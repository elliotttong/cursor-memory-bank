# Implementation Plan: Chrome TTS Extension MVP (Phases 3 & 4)

**Complexity Level:** 3 (Due to Phase 4 features)

## Requirements Analysis

*   **Phase 3 (Refinement & Testing):**
    *   (T10) Verify and potentially refine sync accuracy (though API timestamps should make this minimal).
    *   (T11) Perform basic usability testing on diverse web pages.
    *   (T12) Implement basic play/pause UI controls functionality.
    *   (T13) Refactor text extraction to use an Offscreen Document for better performance/isolation.
    *   (T14) Refine highlighting logic to handle edge cases (e.g., wrapping errors, targeting specific containers).
    *   (T15) Implement UI/storage for the Deep Infra API key.
*   **Phase 4 (Sentence Highlighting & Interaction):**
    *   Implement visual highlighting for the currently playing sentence.
    *   Implement visual highlighting for sentences on mouse hover.
    *   Allow users to click on any sentence to start playback from that point.
    *   Ensure highlight styles are distinct and work reasonably across different websites.

## Components Affected

*   `extension-code/content.js`: Major changes for Phase 3 refactoring (T13) and all of Phase 4 (T16-T20). State management, DOM manipulation, event handling.
*   `extension-code/background.js`: Minor changes possible for Offscreen Document communication (T13).
*   `extension-code/offscreen/offscreen.html`, `extension-code/offscreen/offscreen.js` (New): Required for T13.
*   `extension-code/popup/popup.html`, `extension-code/popup/popup.js`: Required for API key input/storage (T15).
*   `extension-code/styles/content.css`: Required for new highlight styles (T17).

## Architecture Considerations

*   **Offscreen Document (T13):** Use for DOM parsing (Readability.js) to avoid impacting main page performance. Requires message passing setup between content script and offscreen document.
*   **Sentence Association (T16-T20):** Confirmed approach: Use `data-sentence-id` attribute on all word/punctuation `<span>` elements created by `setupHighlighting`. This allows reliable querying and event handling for sentences.
*   **State Management:** Carefully manage `currentSentenceIndex`, `isPlaying`, `audioPlayer`, and `nextAudioData` during click-to-play actions (T20).

## Implementation Strategy & Detailed Steps

**Phase 3: Refinement & Testing (Tasks T10-T15)**

*   **(T15) API Key UI:**
    *   Create simple popup UI (`popup.html`/`popup.js`) with an input field for the API key.
    *   Use `chrome.storage.local` to save/retrieve the key.
    *   Modify `background.js` to read the key from storage before making API calls. Implement error handling if the key is missing/invalid.
*   **(T12) Play/Pause Controls:**
    *   Functionality already implemented in `content.js` (`handlePlayPauseClick`). Ensure robustness.
*   **(T13) Offscreen Document Refactor:**
    *   Create `offscreen.html` and `offscreen.js`.
    *   Set up `chrome.offscreen.createDocument` call in `background.js`.
    *   Move Readability execution logic to `offscreen.js`.
    *   Implement message passing:
        *   `content.js` sends DOM content (or relevant part) to `background.js`.
        *   `background.js` relays to `offscreen.js`.
        *   `offscreen.js` processes with Readability and sends extracted text back via `background.js` to `content.js`.
    *   Update `content.js` (`getTextToRead`) to use this message flow instead of direct Readability execution.
*   **(T14) Highlighting Refinement:**
    *   Investigate potential wrapping errors observed or reported during testing.
    *   Explore methods to target the main content container identified by Readability (if possible) for `setupHighlighting` instead of `document.body`.
*   **(T10) Sync Accuracy:**
    *   Primarily involves testing; API timestamps should be accurate. Monitor during T11.
*   **(T11) Basic Testing:**
    *   Test core functionality (play, pause, stop, highlighting) on 3-5 different websites (news articles, blogs, documentation). Document any issues.

**Phase 4: Sentence Highlighting & Interaction (Houdini Approach - Tasks T16-T21)**

*   **(T16) Setup Houdini Paint Worklet & Adapt Logic:** (Completed)
    *   (T16.1) Create `extension-code/highlight-painter.js`.
    *   (T16.1) Add worklet registration (`CSS.paintWorklet.addModule('highlight-painter.js')`) likely in `content.js` or potentially background script if needed.
    *   (T16.2) Port core painting logic (`paint`, `roundRect`, `brightnessByColor`, etc.) from `competitors-code/Speechify/houdini.js` into `highlight-painter.js`.
    *   (T16.2) Define necessary CSS custom properties (e.g., `--kokoroHighlightWordInfo`, `--kokoroHighlightSentenceInfo`, `--kokoroElemColor`, `--kokoroSentenceHighlightColorDark`, etc.) based on the adapted logic.
*   **(T17) CSS Styles:** (Completed)
    *   In `styles/content.css`: Apply `background-image: paint(kokoroHighlighter);` (or similar name) to the elements that will contain highlighted text (potentially need a wrapper or apply to `body` initially).
    *   Define the necessary color custom properties (e.g., `--kokoroSentenceHighlightColorDark: #374b64;`, `--kokoroSentenceHighlightColorLight: #E6E8FF;`, etc.).
*   **(T18) Active Sentence/Word Highlighting Logic:** (Completed)
    *   In `content.js` (within `pollingLoop` and `handleTimeUpdate`):
        *   Word (`handleTimeUpdate`): Finds active word span based on timestamp, calls `getClientRects()`, formats coords, updates `--kokoroHighlightWordInfo`.
        *   Sentence (`pollingLoop` calling `updateSentenceHighlightCoordinates`): Gets all spans for `currentSentenceIndex`, gets all `clientRects`, groups them by line, calculates min/max horizontal extent per line, formats coords for each line, updates `--kokoroHighlightSentenceInfo`.
        *   Updates `--kokoroElemColor` based on word parent's background.
        *   Updates `--kokoroScrollX`/`--kokoroScrollY` in `pollingLoop`.
*   **(T19) Hover Highlighting Logic:** (Completed)
    *   In `content.js` -> `setupHighlighting`: Keep `mouseover`/`mouseout` listeners.
    *   Implement listener functions:
        *   `handleSentenceHover(event)`: Gets `sentenceId`. Queries all spans for sentence. Uses same line-based coordinate calculation logic as T18 (`getClientRects`, group by line, find min/max). Updates `--kokoroHoverSentenceInfo`.
        *   `handleSentenceHoverOut(event)`: Clears `--kokoroHoverSentenceInfo`.
*   **(T20) Click-to-Play Logic:** (Completed)
    *   In `content.js` -> `setupHighlighting`:
        *   Keep `