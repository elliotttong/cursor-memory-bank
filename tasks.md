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

## Phase 3: UI Refinement & Core Features

- [ ] **T10:** Refine synchronization accuracy (should be good with API timings). *(Low priority)*
- [x] **T11:** Basic testing on a few sample web pages.
    - [x] Fixed ServiceWorker/ObjectURL issue for BBC and similar sites.
    - [x] Fixed API error with bracketed text [Readwise].
    - [ ] Need to test additional sites for comprehensive coverage.
- [x] **T12:** Refine Play/Pause button states (Playing, Paused, Loading, Error, API Key Missing).
- [ ] **T13:** Refactor text extraction to use Offscreen Document. *(Deferred / Re-evaluate)*
- [ ] **T14:** Refine highlighting (target specific element, fix wrapping errors). *(Investigation paused - See docs/limitations.md)*
- [ ] **T15:** ~~Update API Key storage/UI for Deep Infra token.~~ *(Deferred - Using chrome.storage.local for dev. Requires secure backend proxy for release.)*
- [x] **T17 (Was T16):** Implement Skip Forward/Backward buttons and logic.
- [ ] **T18 (Was T17):** Implement Estimated Time Remaining display (simple WPM).
- [ ] **T19 (Was T18):** Implement Voice Selection UI and logic.
- [ ] **T20 (Was T19):** Implement Playback Speed Control UI and logic (verify sync).
- [ ] **T21 (Was T20):** Implement improved hover UX (paragraph segmentation). *(Deferred)*


## Phase 4: Sentence Highlighting & Interaction (Houdini Approach)

- [x] **T21 (Was T16):** Setup Houdini Paint Worklet & Adapt Paint Logic.
    - [x] **T21.1:** Create `highlight-painter.js` and register worklet via `CSS.paintWorklet.addModule`.
    - [x] **T21.2:** Adapt paint logic from `competitors-code/Speechify/houdini.js` into worklet.
- [x] **T22 (Was T17):** Define CSS using `paint()` and custom properties (`--kokoro...`) for highlighting.
- [x] **T23 (Was T18):** Implement coordinate calculation (`getClientRects` on spans) and dynamic CSS variable updates for sentence/word highlighting in `content.js`. *(Line-based sentence logic implemented)*
- [x] **T24 (Was T19):** Implement hover highlighting using coordinate calculation and separate CSS variables updated via `mouseover`/`mouseout`. *(Updated to line-based logic)*
- [x] **T25 (Was T20):** Implement click-to-play (added `click` listeners, implemented `startPlaybackFromSentence(index)`).
- [x] **T26 (Was T21):** Test Houdini-based sentence highlighting, word highlighting, hover, and click-to-play functionality thoroughly.
- [x] **(Refactor T01):** Refactor `content.js` into `page-scripts/` modules. *(Post-T21 task, completed)*

## Phase 5: Advanced Features & Release Prep (Placeholder)

- [ ] Implement secure backend proxy for API key management (Replaces deferred T15).
- [ ] Implement user authentication (if linking to web app).
- [ ] Add persistence for user settings (speed, voice) using `chrome.storage.local` or sync with backend.
- [ ] Revisit Offscreen Document refactor (T13) if performance issues arise.
- [ ] Revisit complex highlighting issues (T14 / limitations) if necessary.
- [ ] Revisit improved hover UX (T20).
- [ ] Comprehensive cross-browser/site testing.
- [ ] Build and packaging for release. 