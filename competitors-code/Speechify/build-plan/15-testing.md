# 15: Testing Strategy

This document outlines the testing strategy for the TTS Chrome Extension, covering unit, integration, and end-to-end (E2E) tests.

## Goals

*   Ensure the reliability and correctness of core features (text extraction, TTS playback, highlighting, auth, billing).
*   Verify the robustness of site-specific adapters.
*   Catch regressions during development.
*   Validate performance and resource usage.

## Testing Levels & Tools

1.  **Unit Tests:**
    *   **Scope:** Individual functions, modules, UI components (React), and utility functions within the extension and backend (Edge Functions).
    *   **Tools:**
        *   **Extension (TypeScript):** Jest or Vitest.
        *   **Edge Functions (Deno/TypeScript):** Deno's built-in test runner (`deno test`).
        *   **UI Components (React):** React Testing Library with Jest/Vitest.
    *   **Focus:** Testing business logic in isolation, helper functions (e.g., code generation, date manipulation), component rendering and basic interactions, Edge Function input validation and core logic (mocking external APIs like Supabase client, Stripe, HF).
    *   **Example:** Testing the streak calculation logic, testing the parsing of a response from the HF endpoint mock, testing rendering of the settings page components.

2.  **Integration Tests:**
    *   **Scope:** Interactions between different parts of the extension (Popup <-> Service Worker <-> Content Script), and interactions between the Service Worker and the backend (Supabase DB, Auth, Edge Functions).
    *   **Tools:**
        *   **Extension Internal:** Testing frameworks that allow interaction between extension components (potentially custom setup using `chrome.runtime.sendMessage` mocks or dedicated testing libraries if available for MV3).
        *   **Backend:** Deno tests for Edge Functions that *do* interact with a **local Supabase instance** (using Supabase CLI `supabase start`) or a dedicated **staging Supabase project**. This allows testing DB interactions, RLS policies, and function chaining.
    *   **Focus:** Verifying message passing, state management across components, authentication flow with Supabase Auth, data fetching and mutation via Edge Functions, RLS policy enforcement.
    *   **Example:** Testing the full flow from clicking "Login" in the popup to successful Supabase Auth sign-in and session storage; testing sending text from CS to SW, SW calling TTS Edge Function (mocking HF call), receiving response, and sending data back to CS; testing Stripe webhook updates to the DB.

3.  **End-to-End (E2E) Tests:**
    *   **Scope:** Simulating real user workflows in a browser environment with the extension installed.
    *   **Tools:** Puppeteer or Playwright.
    *   **Environment:** Requires a test browser instance, potentially loading the unpacked extension, and interacting with live test pages or local fixtures. Needs connection to a staging Supabase/HF backend.
    *   **Focus:** Validating user journeys: login, selecting text, initiating playback, observing highlighting, changing settings, checking subscription status changes, testing on various target websites (using adapter fixtures).
    *   **Example:**
        *   Load Wikipedia page, click extension icon, click play, verify audio starts and highlighting appears correctly.
        *   Navigate to settings, log in with Google, change voice speed, verify setting persists.
        *   Simulate Stripe webhook call to staging backend, verify plan status updates in the UI.
        *   Test adapter functionality on fixture HTML files representing target sites (Wikipedia, Medium, etc.).

## Specific Test Areas

*   **Text Extraction Adapters:**
    *   **Unit:** Test individual selector logic or custom adapter functions with mock DOM structures.
    *   **Integration/E2E:** Create static HTML fixture files (`test/fixtures/wikipedia.html`, `test/fixtures/medium.html`, etc.) representing the target structure for each supported site. Use Puppeteer/Playwright to load these fixtures and run the extraction logic, asserting that the correct content is extracted.
    *   The `adapter_health` cron job also serves as a form of continuous integration testing for live sites.
*   **Highlighting Synchronization:**
    *   **Unit:** Test the client-side logic for finding segments/words based on time and applying highlights (using mock timestamp data and simplified DOM).
    *   **E2E:** Critical for validating the visual outcome. Use Puppeteer/Playwright to:
        *   Load a test page.
        *   Initiate playback (potentially mocking the backend response with predefined audio URL and timestamps).
        *   Capture screenshots or analyze DOM state at specific playback times to verify the correct elements are highlighted.
        *   Requires careful coordination between controlling audio playback and checking DOM state.
*   **Authentication:**
    *   **Integration:** Test the `chrome.identity` flow and Supabase `signInWithIdToken` interaction against a staging Supabase project.
    *   **E2E:** Automate the Google Sign-In flow using Puppeteer (can be challenging due to Google's security measures; might require specific browser flags or test accounts).
*   **Billing & Paywall:**
    *   **Integration:** Test Edge Functions interacting with a Stripe test environment and staging Supabase DB. Simulate usage logging and check limit enforcement.
    *   **E2E:** Simulate user actions that should be blocked by paywall limits. Simulate subscription updates via Stripe test webhooks and verify UI/access changes.
*   **Performance:**
    *   **E2E:** Use browser dev tools or Puppeteer's performance metrics (`page.metrics()`) to measure script execution time, memory usage, and observe potential jank during highlighting on complex pages.

## Success Criteria (E2E Examples)

*   **Basic Playback:** User can successfully initiate playback on Wikipedia, audio plays, and sentence/word highlighting is visibly synchronized with the audio.
*   **Login:** User can successfully sign in using Google; their email/avatar appears in the popup/settings.
*   **Limit Enforcement:** Free tier user attempts to play content exceeding their character limit; playback is denied with an informative message.
*   **Adapter Robustness:** Text extraction succeeds on fixture pages for all targeted websites (Wikipedia, Medium, Reddit, NYT, Gmail basic). 