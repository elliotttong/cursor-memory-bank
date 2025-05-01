# Implementation Plan: Chrome TTS Extension MVP

**Complexity Level:** 3 (Mix of simple UI and potentially complex interactions)

## Requirements Analysis

*   **Phase 3 (UI Refinement & Core Features):**
    *   (T10) Verify and potentially refine sync accuracy. *(Low priority)*
    *   (T11) Perform basic usability testing on diverse web pages.
    *   (T12) Refine Play/Pause button visual states. *(Superseded by T-UI-Refactor)*
    *   (T13) Refactor text extraction to use Offscreen Document. *(Deferred)*
    *   (T14) Refine highlighting logic. *(Investigation Paused)*
    *   (T15) ~~API Key UI/Storage.~~ *(Deferred)*
    *   (T17) Add Skip Forward/Backward sentence buttons. *(Functionality implemented, UI part of T-UI-Refactor)*
    *   **(NEW) T-UI-Refactor:** Implement new multi-state, multi-layout widget UI based on design spec.
    *   (T18) Display estimated reading time. *(Depends on T-UI-Refactor)*
    *   (T19) Add Voice Selection control. *(Depends on T-UI-Refactor)*
    *   (T20) Add Playback Speed control. *(Depends on T-UI-Refactor)*
*   **Phase 4 (Houdini Highlighting):** Completed.
*   **Phase 5 (Advanced & Release):** Secure API key, user auth, settings persistence, further testing, build.

## Components Affected

*   `extension-code/page-scripts/domUtils.js`: Add new UI elements (skip buttons, time display, speed control, voice dropdown) to `injectWidget`. Add update functions for time display. **(Major changes for T-UI-Refactor)**
*   `extension-code/page-scripts/entry.js`: Attach listeners for new UI elements. **(Add hover listeners for T-UI-Refactor)**
*   `extension-code/page-scripts/userEvents.js`: Add handlers for skip buttons, speed control, voice selection. **(Add future handlers for new controls)**
*   `extension-code/page-scripts/playbackEngine.js`: Modify to use `playbackRate` state. Add function to update rate. **(Update state setting for T-UI-Refactor)**
*   `extension-code/page-scripts/textProcessor.js`: Calculate total words for T18.
*   `extension-code/page-scripts/pageState.js`: Add state for `playbackRate`, `selectedVoiceId`. **(Add layout, hovering for T-UI-Refactor)**
*   `extension-code/page-scripts/backgroundComms.js`: Send `selectedVoiceId`.
*   `extension-code/background.js`: Receive `selectedVoiceId`, use it in `callDeepInfraTTS`.
*   `extension-code/styles/content.css`: Style new UI elements. **(Major changes for T-UI-Refactor)**
*   `chrome.storage.local` (Later, Phase 5): Persisting speed/voice settings.

## Architecture Considerations

*   **API Key Management (T15 Deferred):** Needs backend proxy for release.
*   **Highlighting Sync (T20 - Speed Control):** Needs careful testing when `playbackRate` is not 1.
*   **Voice List (T19):** Hardcode initially, consider dynamic fetch later.
*   **Settings Persistence (Phase 5):** Use `chrome.storage.local` for user speed/voice preferences.
*   **(T-UI-Refactor) State-Driven CSS:** Use `data-*` attributes (`data-layout`, `data-playback`, `data-hover`) on the root widget for styling via CSS attribute selectors.
*   **(T-UI-Refactor) Static HTML:** Define a comprehensive but static HTML structure in `domUtils.js`; show/hide elements using CSS.

## Implementation Strategy & Detailed Steps

*(Previous Phase 3 steps for T12, T17, T18, T19, T20 are now superseded or integrated into the UI Refactor task)*

**Phase 3: UI Refactor & Feature Integration**

*   **(T-UI-Refactor) Implement New Widget UI:** (Requires Creative Phase First)
    *   **Phase 3.1: Foundational Refactor (HTML Structure, Base Styles, State Attributes)**
        1.  `pageState.js`: Add `layout: 'V'`, `hovering: false`.
        2.  `domUtils.js` (`injectWidget`): Replace existing HTML with the new comprehensive structure (placeholders included). Add `updateWidgetAttributes(newState)` function.
        3.  `content.css`: Clear old styles, add base styles, add initial rules for Idle Vertical state (`[data-layout="V"][data-playback="idle"][data-hover="false"]`).
        4.  `entry.js`: Add `mouseenter`/`mouseleave` listeners to widget root -> update `hovering` state -> call `updateWidgetAttributes()`.
        5.  `playbackEngine.js`: Modify relevant functions to call `updateWidgetAttributes()` with correct `data-playback` value.
    *   **Phase 3.2: Vertical Layout Implementation**
        1.  `content.css`: Implement all CSS rules for Vertical Layout (`[data-layout="V"]`) across all playback and hover states.
        2.  **Testing:** Verify visual states and transitions for Vertical layout.
    *   **Phase 3.3: Horizontal Layout Implementation**
        1.  `content.css`: Implement all CSS rules for Horizontal Layout (`[data-layout="H"]`).
        2.  **Testing:** Verify visual states and transitions for Horizontal layout (using debug method to switch `data-layout`).
    *   **Phase 3.4: Integrate Existing Controls**
        1.  **Connect:** Ensure Play/Pause, Skip buttons, Time Display elements in the new HTML are correctly targeted/updated by JS.
        2.  **Refine:** Adjust CSS for alignment and interaction appearance.
*   **(T18) Estimated Time:** *(Depends on T-UI-Refactor)*
    *   Add `<span>` (e.g., `#kokoro-time-estimate`) to new widget HTML structure.
    *   Add `updateEstimatedTime(minutes)` function in `domUtils.js`.
    *   Modify `textProcessor.js` (`processText`) to return `totalWordCount`.
    *   In `entry.js` (after `processText`), calculate `estimatedMinutes`, call `updateEstimatedTime`.
*   **(T19) Voice Selection:** *(Depends on T-UI-Refactor)*
    *   Add Voice Avatar placeholder/button to widget HTML.
    *   **(Later):** Implement pop-out list, state (`selectedVoiceId`), event handling, `backgroundComms.js`/`background.js` changes.
*   **(T20) Playback Speed:** *(Depends on T-UI-Refactor)*
    *   Add Speed Chip placeholder/button to widget HTML.
    *   **(Later):** Implement pop-out/options, state (`playbackRate`), event handling, `playbackEngine.js` integration.

**Phase 4: Houdini Highlighting:** (Completed - Tasks T21-T26)

**Phase 5: Advanced Features & Release Prep:**

*   **(T22) Audio Caching:**
    *   **Goal:** Avoid re-fetching TTS for already played/skipped sentences within a session.
    *   **Component:** `pageState.js` (add cache Map), `backgroundComms.js` (check cache before request), `playbackEngine.js` (store in cache on receive, manage revocation).
    *   **Strategy:** Implement an LRU (Least Recently Used) cache for `audioObjectURL` and `wordTimestamps`, mapped by sentence index.
    *   **Revocation:** When adding to a full cache, revoke and remove the URL of the *least recently accessed* item.
    *   **Considerations:** Determine appropriate cache size (e.g., 5-10). Ensure robust URL revocation to prevent memory leaks.
*   **(Future)** Implement secure backend proxy (replaces T15).
*   **(Future)** Implement user auth.
*   **(Future)** Add settings persistence.
*   **(Future)** Revisit T13, T14 if needed.
*   **(Future)** Testing & Build.

*(Deferred/Paused tasks: T13, T14, T15)*
 