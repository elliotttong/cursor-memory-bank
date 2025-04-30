# Implementation Plan: Chrome TTS Extension MVP

**Complexity Level:** 3 (Mix of simple UI and potentially complex interactions)

## Requirements Analysis

*   **Phase 3 (UI Refinement & Core Features):**
    *   (T10) Verify and potentially refine sync accuracy. *(Low priority)*
    *   (T11) Perform basic usability testing on diverse web pages.
    *   (T12) Refine Play/Pause button visual states. *(In Progress)*
    *   (T13) Refactor text extraction to use Offscreen Document. *(Deferred)*
    *   (T14) Refine highlighting logic. *(Investigation Paused)*
    *   (T15) ~~API Key UI/Storage.~~ *(Deferred)*
    *   (T17) Add Skip Forward/Backward sentence buttons.
    *   (T18) Display estimated reading time.
    *   (T19) Add Voice Selection control.
    *   (T20) Add Playback Speed control.
*   **Phase 4 (Houdini Highlighting):** Completed.
*   **Phase 5 (Advanced & Release):** Secure API key, user auth, settings persistence, further testing, build.

## Components Affected

*   `extension-code/page-scripts/domUtils.js`: Add new UI elements (skip buttons, time display, speed control, voice dropdown) to `injectWidget`. Add update functions for time display.
*   `extension-code/page-scripts/entry.js`: Attach listeners for new UI elements.
*   `extension-code/page-scripts/userEvents.js`: Add handlers for skip buttons, speed control, voice selection.
*   `extension-code/page-scripts/playbackEngine.js`: Modify to use `playbackRate` state. Add function to update rate.
*   `extension-code/page-scripts/textProcessor.js`: Calculate total words for T18.
*   `extension-code/page-scripts/pageState.js`: Add state for `playbackRate`, `selectedVoiceId`.
*   `extension-code/page-scripts/backgroundComms.js`: Send `selectedVoiceId`.
*   `extension-code/background.js`: Receive `selectedVoiceId`, use it in `callDeepInfraTTS`.
*   `extension-code/styles/content.css`: Style new UI elements.
*   `chrome.storage.local` (Later, Phase 5): Persisting speed/voice settings.

## Architecture Considerations

*   **API Key Management (T15 Deferred):** Needs backend proxy for release.
*   **Highlighting Sync (T20 - Speed Control):** Needs careful testing when `playbackRate` is not 1.
*   **Voice List (T19):** Hardcode initially, consider dynamic fetch later.
*   **Settings Persistence (Phase 5):** Use `chrome.storage.local` for user speed/voice preferences.

## Implementation Strategy & Detailed Steps

**Phase 3: UI Refinement & Core Features (Tasks T10, T11, T12, T17-T20)**

*   **(T12) Play/Pause Button States:** *(In Progress)*
    *   Implement `updatePlayPauseButtonState` in `domUtils.js`.
    *   Call from `entry.js`, `userEvents.js`, `playbackEngine.js`, `backgroundComms.js`.
*   **(T17) Skip Buttons:**
    *   Add Prev/Next buttons to `widget.innerHTML` in `domUtils.js`.
    *   Style buttons in `content.css`.
    *   Attach listeners in `entry.js`.
    *   Create `handleSkipPrevious`, `handleSkipNext` in `userEvents.js`.
    *   Handlers calculate `targetIndex = state.currentSentenceIndex +/- 1`, check bounds, call `startPlaybackFromSentence(targetIndex)`.
*   **(T18) Estimated Time:**
    *   Add `<span>` (e.g., `id="kokoro-time-estimate"`) to `widget.innerHTML` in `domUtils.js`.
    *   Add `updateEstimatedTime(minutes)` function in `domUtils.js` to update the span.
    *   Modify `textProcessor.js` (`processText`) to return `totalWordCount`.
    *   In `entry.js`, after calling `processText`, calculate `estimatedMinutes = Math.round(totalWordCount / 150)`.
    *   Call `updateEstimatedTime(estimatedMinutes)`.
*   **(T19) Voice Selection:**
    *   Define list of Kokoro voices (ID and display name) - can be a constant initially.
    *   Add `<select id="kokoro-voice-select">` to `widget.innerHTML` in `domUtils.js`, populate `<option>` elements from the list.
    *   Add `selectedVoiceId` to `pageState.js` (default: 'af_bella').
    *   Attach `change` listener in `entry.js`.
    *   Create handler in `userEvents.js` to update `state.selectedVoiceId` on change.
    *   Modify `backgroundComms.js` (`requestSentenceAudio`) to get voice from state and include `voiceId: state.selectedVoiceId` in the message.
    *   Modify `background.js` listener to read `message.voiceId`.
    *   Modify `background.js` (`callDeepInfraTTS`) to use the passed `voiceId` in the API payload's `voice` array.
*   **(T20) Playback Speed:**
    *   Define speed options (e.g., `[0.75, 1, 1.25, 1.5, 2]`).
    *   Add UI (e.g., `<select id="kokoro-speed-select">`) to `widget.innerHTML` in `domUtils.js`, populate options.
    *   Add `playbackRate` to `pageState.js` (default: 1).
    *   Attach `change` listener in `entry.js`.
    *   Create handler in `userEvents.js` that calls a new function `setPlaybackSpeed(rate)` (to be added in `playbackEngine.js`).
    *   Add `setPlaybackSpeed(rate)` to `playbackEngine.js`: updates `state.playbackRate`; if `state.audioPlayer` exists, sets `state.audioPlayer.playbackRate = rate`.
    *   Modify `playAudio` in `playbackEngine.js` to set `newPlayer.playbackRate = state.playbackRate` when the player is created.
    *   **Testing:** Thoroughly test highlighting synchronization at different speeds. Check if `syncEngine.js` needs adjustments.
*   **(T10) Sync Accuracy:** *(Low priority testing)*
*   **(T11) Basic Testing:** *(Ongoing)*

**Phase 4: Houdini Highlighting:** (Completed - Tasks T21-T26)

**Phase 5: Advanced Features & Release Prep:** (Tasks defined in `tasks.md` - Focus on backend proxy, persistence, etc.)

*(Deferred/Paused tasks: T13, T14, T15, T20 - Hover UX)*
 