# 17: Project Roadmap & Timeline (Revised for Lean MVP)

This revised roadmap prioritizes delivering the core text extraction, TTS playback, and highlighting functionality locally within the extension as quickly as possible for the Minimum Viable Product (MVP). Backend integration and features like login, billing, and advanced settings are deferred to later phases.

**Overall Goal:** Rapidly develop a functional MVP demonstrating the core reading experience, then iteratively add backend integration and features.

**Estimated Timeline (MVP Focus):** ~3 Weeks

## Phase 1: Core Client-Side MVP (Weeks 1-3)

**Goal:** Create a working extension that extracts text, reads it aloud using browser TTS and then Kokoro (via basic proxy), synchronizes highlights, and provides essential playback controls via a floating UI element.

*   **Week 1: Foundation & Browser TTS**
    *   [ ] Basic Extension Structure (Manifest V3: SW, Popup stub, `activeTab`/`scripting` permissions).
    *   [ ] Implement Text Extraction (Content Script using `readability.js` or similar heuristic).
    *   [ ] Implement Browser TTS Playback: Send extracted text from CS to SW, SW uses `chrome.speechSynthesis.speak()`.
    *   [ ] Implement **Floating UI (FAB)**: Inject basic floating button via Content Script (`12-ui-wireframes.md`).
    *   [ ] Implement Basic Playback Controls (Play/Pause on FAB triggering SW actions).
    *   [ ] Basic Communication Channel (CS <-> SW messaging).
    *   [ ] Minimal Popup UI showing status (Idle/Reading) - *Controls primarily on FAB*.
*   **Week 2: Highlighting & Interaction**
    *   [ ] Implement Highlight Synchronization using `speechSynthesis` `onboundary` events.
        *   Map `event.charIndex` to words/sentences in the content script.
        *   Apply/remove highlight CSS classes.
    *   [ ] Implement Speed Control (accessible perhaps via popup or future FAB expansion).
    *   [ ] Implement "Click Sentence to Play": Detect clicks on text segments, calculate start point, and initiate `speechSynthesis.speak()` from that point.
    *   [ ] Refine basic text segmentation in content script for clicking and boundary mapping.
    *   [ ] Update FAB state based on playback (Playing, Paused).
*   **Week 3: Integrate Cloud TTS (Kokoro) & Polish**
    *   [ ] Setup **basic, unauthenticated** HF Inference Endpoint for Kokoro-82M.
    *   [ ] Create **simple** Supabase Edge Function (`basic-tts-proxy`) that takes text and returns audio URL/data from HF (**no auth, no usage check initially**).
        *   *Initial focus is just getting audio back.* Determine timestamp availability (Plan A/B/C from `03-highlight-sync.md`).
    *   [ ] Modify SW to call this basic Edge Function instead of `speechSynthesis` (perhaps via a toggle or as default).
    *   [ ] Adapt highlighting logic for Kokoro (Timestamp or fallback).
    *   [ ] Basic error handling for TTS API call.
    *   [ ] Polish core UI elements (FAB interaction/states).
    *   [ ] Basic E2E tests for extraction, browser TTS playback/highlighting, Kokoro TTS playback/highlighting, and FAB interaction.

**Outcome Phase 1 (MVP):** A functional extension demonstrating core text-to-speech with highlighting using both browser and high-quality cloud voices (Kokoro). Controls include play/pause **via a floating button**, speed, and click-to-play. No login, usage tracking, or advanced features.

## Phase 2: Backend Integration & User Accounts (Weeks 4-5)

**Goal:** Integrate Supabase backend for user authentication and prepare for feature expansion.

*   [ ] Setup full Supabase project (Staging/Prod from Phase 1).
*   [ ] Implement full DB schema (`profiles`, `usage_events`, etc. - `05-backend-schema.md`).
*   [ ] Implement Google Sign-In using Supabase Auth (`08-auth.md`).
*   [ ] Update extension UI to include Login/Logout states.
*   [ ] **Replace** `basic-tts-proxy` with authenticated `TTS Proxy` Edge Function.
    *   Add JWT auth check.
    *   Implement basic usage logging to `usage_events` (`add_usage` function - `06-edge-functions.md`).
*   [ ] Implement basic user profile fetching/display.
*   [ ] Setup staging deployment pipeline (`16-devops.md`).

**Outcome Phase 2:** MVP functionality is now tied to user accounts, backend is established, basic usage is logged.

## Phase 3: Monetization & Feature Expansion (Weeks 6-7)

**Goal:** Implement paywall, site adapters, and initial engagement features.

*   [ ] Implement Paywall logic: Usage limits based on `monthly_usage`, plan definitions (`11-paywall.md`).
*   [ ] Integrate Stripe Checkout & Webhooks (`06-edge-functions.md`, `11-paywall.md`).
*   [ ] Implement Site Adapters framework and initial adapters (`02-extension-adapters.md`).
*   [ ] Implement Streak logic (`10-gamification.md`).
*   [ ] Implement basic Referrals (`09-referral-system.md`).
*   [ ] Build out full Settings Page UI.
*   [ ] Expand test coverage (E2E for login, adapters, paywall).
*   [ ] Internal / Beta testing.

**Outcome Phase 3:** Feature-complete V1 ready for wider beta testing or launch, including premium tiers.

## Phase 4: Launch & Iteration (Week 8+)

**Goal:** Public launch and ongoing development.

*   [ ] Final testing, bug fixing, UI polish.
*   [ ] Finalize legal/privacy docs, CWS listing (`18-legal.md`).
*   [ ] Setup Production deployment pipeline (`16-devops.md`).
*   [ ] **LAUNCH:** Deploy backend, publish to Chrome Web Store.
*   [ ] Monitor performance, errors, feedback.
*   [ ] Iterate based on roadmap (`17-roadmap.md` original scope) and user feedback (advanced features, more adapters, etc.).

This revised roadmap significantly accelerates time-to-MVP for the core reading experience, allowing for earlier validation before investing heavily in backend infrastructure and features.