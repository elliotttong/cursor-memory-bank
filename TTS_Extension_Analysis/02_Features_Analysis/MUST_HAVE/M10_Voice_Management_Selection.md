# M10: Voice Management & Selection

**Goal:** Understand how the list of available voices (especially premium/cloud-based ones) is fetched, presented to the user in the UI, and how user selection translates to parameters for the TTS API calls.

## Competitor Analysis: Speechify

Based on analysis of `competitors-code/Speechify/centralized-voice-list.json` and `competitors-code/Speechify/content/chunk-Z4JSAUZD.js`.

### 1. Fetching & Data Structure

*   **Method:** Speechify appears to utilize a large, static JSON file (`centralized-voice-list.json`) which is likely bundled with the extension or fetched once during initialization. This acts as the central repository for voice information.
*   **Data Structure:** The JSON is highly structured, containing:
    *   Overall configuration (default/fallback voices).
    *   Grouping of voices (e.g., by language: "English", "Spanish"; by category: "Cloud Voices", potentially "Offline").
    *   Detailed metadata for each voice entry:
        *   `displayName` (User-facing)
        *   `name` (Internal ID, likely used for API calls)
        *   `gender`
        *   `language` (e.g., `en-US`)
        *   `engine` (e.g., `speechify`, `azure`, `google`, `standard` - likely indicates quality/source/tier)
        *   `labels` (Array, explicitly marking status like `premium`, `celebrity`, `beta`, `ai-enhanced`)
        *   `tags` (Descriptive for filtering/search, e.g., `accent:british`, `use-case:audiobook`)
        *   Asset URLs (`avatarImage`, `previewAudio`) hosted on Google Cloud Storage.

### 2. UI Presentation

*   **Processing:** Client-side JavaScript (`chunk-Z4JSAUZD.js`) parses the JSON data.
*   **UI Components:** React components are used to render the voice selection interface.
    *   Voices are displayed in lists, grouped by categories defined in the JSON or generated dynamically (e.g., "Recommended", "Recent").
    *   Language names and flags are displayed using helper functions and potentially `Intl.DisplayNames`.
    *   Search and filtering capabilities likely leverage the `tags` and other metadata.
    *   Tabs ("Recommended", "Recent", "Custom", "All") provide different views of the voice list.
    *   Premium status/labels are likely displayed based on the `labels` array or potentially the `engine` field from the JSON.
    *   Voice previews are triggered using the `previewAudio` URL.

### 3. Selection & State Management

*   **Mechanism:** User clicks on a voice item trigger an `onVoiceSelection` handler.
*   **State Update:** This handler likely performs checks (e.g., premium entitlement based on user status and voice `labels`/`engine`) before calling a dedicated state update function (identified as `it` in the obfuscated code).
*   **State Library:** Speechify seems to use a global state management library (potentially Jotai, inferred from `useAtom` usage identified as `_()`) to store the currently selected voice object.
*   **API Call Configuration:** Subsequent TTS synthesis requests read the selected voice's details (specifically the internal `name` and perhaps `engine` or `language`) from this global state to configure the API payload.

### 4. Pros

*   **Rich Metadata:** The centralized JSON allows for very detailed information per voice, enabling rich UI features (filtering, tags, labels, avatars).
*   **Offline Data:** Bundling the JSON makes the voice list available offline (though previews/synthesis still require connection).
*   **Clear Tier Distinction:** Using `labels` and `engine` provides clear data points to differentiate standard vs. premium voices.
*   **Scalability:** Adding new voices primarily involves updating the central JSON file.

### 5. Cons

*   **Large Initial Load:** The JSON file is very large (>7000 lines), potentially impacting initial extension load time or requiring lazy-loading strategies.
*   **Client-Side Processing:** Significant data processing (grouping, filtering) happens on the client, which could impact performance on lower-end devices.
*   **Manual Updates:** Maintaining the JSON file requires a manual update and deployment process for adding/changing voices. A dynamic API endpoint might offer more flexibility.

## Implementation Guidance

Based on the Speechify analysis, here's a potential approach for our project:

1.  **Voice Data Source:**
    *   **Option A (Static JSON - Speechify's Approach):** Create a structured JSON file similar to Speechify's. Include essential fields: `id` (internal), `displayName`, `language`, `gender`, `engine` (e.g., "kokoro", "browser"), `quality` ("standard", "premium"), `previewUrl`.
        *   *Pro:* Simple to start, works offline for list display.
        *   *Con:* Less flexible, requires manual updates and potential large initial load.
    *   **Option B (API Endpoint):** Create a backend API endpoint (e.g., using Convex) that returns the list of available voices. This allows for dynamic updates and potentially filtering/pagination server-side.
        *   *Pro:* More flexible, easier updates, smaller initial payload.
        *   *Con:* Requires backend setup, list not available offline.
    *   **Recommendation:** Start with **Option A (Static JSON)** for simplicity, especially given our primary focus on Kokoro-82M (initially a smaller list). We can migrate to an API later if needed. Store the JSON within the extension's assets.

2.  **Data Structure:** Define a clear `Voice` type/interface in TypeScript:
    ```typescript
    interface Voice {
      id: string; // Internal unique identifier (e.g., "kokoro-en-us-female-1")
      displayName: string; // User-facing name (e.g., "Kokoro Female")
      language: string; // BCP 47 code (e.g., "en-US")
      gender: 'female' | 'male' | 'neutral';
      engine: 'kokoro' | 'browser'; // Identifies the TTS source
      quality: 'standard' | 'premium'; // Tier indication
      previewUrl?: string; // Optional URL for audio preview
      // Add other relevant fields like tags, description if needed
    }
    ```

3.  **Fetching & Caching:**
    *   Fetch the voice list (from JSON file or API) when the voice selection component mounts.
    *   Consider caching the list in memory or local storage to avoid repeated fetching/parsing, especially if using an API.

4.  **UI Presentation:**
    *   Use React components to display the list.
    *   Group voices logically (e.g., by language, by engine/quality).
    *   Display relevant information: `displayName`, `language`. Add icons for premium/engine if desired.
    *   Implement a preview button using the `previewUrl` and the HTML5 `<audio>` element or Web Audio API.
    *   Clearly indicate the currently selected voice.

5.  **Selection & State Management:**
    *   Use a state management solution (e.g., Zustand, Jotai, or even React Context for simplicity if the state is localized) to store the currently selected `Voice` object.
    *   When a voice is clicked:
        *   Perform any necessary checks (e.g., if it's a premium voice and the user has access - relevant if we add tiers later).
        *   Update the central state with the full selected `Voice` object.

6.  **API Call Integration:**
    *   When initiating a TTS request:
        *   Read the selected `Voice` object from the state.
        *   Pass the relevant properties (e.g., `id`, `language`, `engine`-specific parameters) to the TTS generation function (e.g., our Kokoro-82M client or the browser's `speechSynthesis`).

**Initial Implementation Focus:**

*   Create `voices.json` with initial Kokoro-82M voice(s) and potentially standard browser voices.
*   Build the UI component to fetch/display this list.
*   Implement state management for the selected voice.
*   Connect the selected voice's properties to the TTS synthesis function call. 