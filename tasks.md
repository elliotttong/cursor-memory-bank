# Task List: Chrome TTS Extension MVP

## Phase 1: Project Setup & Core Integration

- [x] **T01:** Set up basic Chrome Extension structure (Manifest V3, background worker, content script placeholder).
- [x] **T02:** Establish communication channel between background and content script.
- [x] **T03:** Integrate Kokoro-82M TTS (via Replicate API).
    - [x] Define request format.
    - [x] Handle API response (audio URL).
- [x] **T04:** Implement basic audio playback in the content script (using HTML5 Audio or Web Audio API).
- [x] **T05:** Set up basic UI/widget placeholder (floating button or similar).

## Phase 2: Highlighting & Synchronization

- [x] **T06:** Implement basic text processing/segmentation (sentences, words) in the content script.
- [ ] **T07:** Develop highlighting mechanism (e.g., wrapping text in spans).
- [ ] **T08:** Integrate timing information from TTS (if available) or develop a strategy for sync. *(Creative Phase Done: Prioritize checking Kokoro timing data, fallback to polling/estimation. See `.memory_bank/creative_phase_sync_logic.md`)*
- [ ] **T09:** Implement core synchronization logic between audio playback and text highlighting. *(Creative Phase Done: Follow recommended approach from `.memory_bank/creative_phase_sync_logic.md`)*

## Phase 3: Refinement & Testing

- [ ] **T10:** Refine synchronization accuracy.
- [ ] **T11:** Basic testing on a few sample web pages.
- [ ] **T12:** Add simple play/pause controls. 