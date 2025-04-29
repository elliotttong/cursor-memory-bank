# Task List: Chrome TTS Extension MVP

## Phase 1: Project Setup & Core Integration

- [x] **T01:** Set up basic Chrome Extension structure (Manifest V3, background worker, content script placeholder).
- [x] **T02:** Establish communication channel between background and content script.
- [x] **T03:** Integrate Kokoro-82M TTS (Switched to Deep Infra API).
    - [x] Define request format (Sentence-by-sentence, requesting timestamps).
    - [x] Handle API response (Audio Data URL + Timestamps).
- [x] **T04:** Implement basic audio playback in the content script.
    - [x] Basic HTML5 Audio playback (handling Data URLs).
    - [x] Sentence queuing/pre-fetching logic.
- [x] **T05:** Set up basic UI/widget placeholder (floating button or similar).

## Phase 2: Highlighting & Synchronization

- [x] **T06:** Implement basic text processing/segmentation (sentences, words) in the content script.
- [x] **T07:** Develop highlighting mechanism (finding/wrapping text nodes in spans). *(Partially done: Wrapping logic implemented, needs testing/refinement)*
- [x] **T08:** Timing Strategy. *(Solved: Using precise word timestamps from Deep Infra API)*.
- [x] **T09:** Implement core synchronization logic between audio playback and text highlighting. *(Using precise API timestamps)*

## Phase 3: Refinement & Testing

- [ ] **T10:** Refine synchronization accuracy (should be good with API timings).
- [ ] **T11:** Basic testing on a few sample web pages.
- [ ] **T12:** Add simple play/pause controls.
- [ ] **T13:** Refactor text extraction to use Offscreen Document.
- [ ] **T14:** Refine highlighting (target specific element, fix wrapping errors).
- [ ] **T15:** Update API Key storage/UI for Deep Infra token. 

## Phase 4: Sentence Highlighting & Interaction (Houdini Approach)

- [x] **T16:** Setup Houdini Paint Worklet & Adapt Paint Logic.
    - [x] **T16.1:** Create `highlight-painter.js` and register worklet via `CSS.paintWorklet.addModule`.
    - [x] **T16.2:** Adapt paint logic from `competitors-code/Speechify/houdini.js` into worklet.
- [x] **T17:** Define CSS using `paint()` and custom properties (`--kokoro...`) for highlighting.
- [x] **T18:** Implement coordinate calculation (`getClientRects` on spans) and dynamic CSS variable updates for sentence/word highlighting in `content.js`. *(Line-based sentence logic implemented)*
- [x] **T19:** Implement hover highlighting using coordinate calculation and separate CSS variables updated via `mouseover`/`mouseout`. *(Updated to line-based logic)*
- [x] **T20:** Implement click-to-play (added `click` listeners, implemented `startPlaybackFromSentence(index)`).
- [x] **T21:** Test Houdini-based sentence highlighting, word highlighting, hover, and click-to-play functionality thoroughly. 