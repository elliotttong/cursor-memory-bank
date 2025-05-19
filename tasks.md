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

### Provider-Agnostic, Voice-Centric Architecture Plan (Updated)

📋 **Overview of Changes**
- All voices are loaded from voiceConfig.json at startup by ProviderManager.
- ProviderManager builds a flat array and a composite key map of all voices.
- UI and playback logic always use ProviderManager for voice data (never provider instances).
- Voice selection, storage, and lookup are always by composite key (provider:id).
- Provider logic is only used for synthesis (TTS API calls), not for UI or selection.
- Adding new providers/voices is just a config update and a new provider implementation for synthesis.

📁 **Files to Modify**
- extension-code/modules/providers/providerManager.js
- extension-code/modules/ui/voiceSelector.js
- extension-code/page-scripts/playbackEngine.js
- extension-code/page-scripts/backgroundComms.js
- extension-code/background.js
- extension-code/assets/voices/voiceConfig.json
- Any file that previously handled voice selection, playback, or highlight syncing via provider logic

🔄 **Implementation Steps**
- [x] Refactor ProviderManager for config-driven voice management
- [x] Refactor UI to use ProviderManager for all voice data
- [x] Refactor playback and background logic for composite key routing
- [ ] Add defensive/fallback logic
- [ ] Test all flows and edge cases

⚠️ **Potential Challenges**
- Ensuring all legacy code paths are updated to use the new flow
- Handling missing or malformed config gracefully
- Ensuring backward compatibility with user settings

✅ **Testing Strategy**
- Manual and automated tests for all UI, selection, and playback flows
- Simulate missing providers/voices and verify graceful fallback

📝 **Task Checklist**
- [ ] Refactor ProviderManager for config-driven voice management
- [ ] Refactor UI to use ProviderManager for all voice data
- [ ] Refactor playback and background logic for composite key routing
- [ ] Remove legacy provider-based UI/selection logic
- [ ] Add defensive/fallback logic
- [ ] Test all flows and edge cases

🟢 **Step 1: Update config and data structures for composite keys.**
- [x] Ensure each voice in voiceConfig.json has both provider and id fields. (Already present)
- [x] Build a lookup map: compositeKey (provider:id) -> voiceObject in ProviderManager.

🟢 **Step 2: Refactor selection/storage to use composite keys throughout the UI and ProviderManager.**
- [x] Update UI to store and retrieve selected voice by composite key.
- [x] Update ProviderManager to use composite key for all selection/storage logic.

🟢 **Step 3: Update playback and highlighting routing to use composite key for provider/voice lookup.**
- [x] Refactor playback and highlight sync logic to use the selected composite key for provider/voice lookup and routing.

🟡 **Step 4: UI Improvements.**
- [ ] Update UI to show all voices in a single list, grouped by country. (In progress)
- [ ] Implement premium lockout UI logic.
- [ ] Store and load selected voice by composite key.
- [ ] Continue with the rest of the checklist (speed control, caching, etc).

🟢 **Step 5: Refactor text extraction to use Offscreen Document.**
- [ ] Refactor text extraction to use Offscreen Document.

🟢 **Step 6: Refine highlighting (target specific element, fix wrapping errors).**
- [ ] Refine highlighting (target specific element, fix wrapping errors).

🟢 **Step 7: Update API Key storage/UI for Deep Infra token.**
- [ ] Update API Key storage/UI for Deep Infra token.

🟢 **Step 8: Implement Skip Forward/Backward buttons and logic.**
- [x] Implement Skip Forward/Backward buttons and logic.

🟢 **Step 9: Implement Estimated Time Remaining display (simple WPM).**
- [ ] Implement Estimated Time Remaining display (simple WPM).

🟢 **Step 10: Implement Voice Selection UI and logic.**
- [ ] Implement Voice Selection UI and logic.

🟢 **Step 11: Implement Playback Speed Control UI and logic (verify sync).**
- [ ] Implement Playback Speed Control UI and logic (verify sync).

🟢 **Step 12: Implement improved hover UX (paragraph segmentation).**
- [ ] Implement improved hover UX (paragraph segmentation).

🟢 **Step 13: Implement Audio Caching (LRU strategy recommended) to reduce redundant API calls.**
- [ ] Implement Audio Caching (LRU strategy recommended) to reduce redundant API calls.

🟢 **Step 14: Refactor TTS logic to use a provider abstraction layer (Deep Infra, browser TTS, future providers).**
- [ ] Refactor TTS logic to use a provider abstraction layer (Deep Infra, browser TTS, future providers).

🟢 **Step 15: Create provider interface and manager modules.**
- [x] Create provider interface and manager modules.

🟢 **Step 16: Define voice data structure that works across providers.**
- [x] Define voice data structure that works across providers.

🟢 **Step 17: Implement usage tracking for quota-limited providers.**
- [x] Implement usage tracking for quota-limited providers.

🟢 **Step 18: Refactor Deep Infra logic to use provider interface.**
- [x] Refactor Deep Infra logic to use provider interface.

🟢 **Step 19: Add browser TTS implementation.**
- [x] Add browser TTS implementation.

🟢 **Step 20: Add support for browser TTS API with word timing estimation.**
- [x] Add support for browser TTS API with word timing estimation.

🟢 **Step 21: Create placeholder for voice selector UI component.**
- [x] Create placeholder for voice selector UI component.

🟢 **Step 22: Add dropdown panel to existing avatar button (tabbed by provider).**
- [ ] Add dropdown panel to existing avatar button (tabbed by provider).

🟢 **Step 23: Style premium voices with appropriate visual indicators.**
- [ ] Style premium voices with appropriate visual indicators.

🟢 **Step 24: Add status indicators for quota limits and fallback.**
- [ ] Add status indicators for quota limits and fallback.

🟢 **Step 25: Implement provider switching and fallback logic.**
- [x] Implement provider switching and fallback logic.

🟢 **Step 26: Handle automatic fallback when quota exceeded.**
- [x] Handle automatic fallback when quota exceeded.

🟢 **Step 27: Store and manage user provider/voice preferences.**
- [x] Store and manage user provider/voice preferences.

🟢 **Step 28: Ensure synchronization logic adapts to timing data differences.**
- [x] Ensure synchronization logic adapts to timing data differences.

🟢 **Step 29: Create test HTML page for provider functionality.**
- [x] Create test HTML page for provider functionality.

🟢 **Step 30: Add feature flag system for safe rollout.**
- [x] Add feature flag system for safe rollout.

🟢 **Step 31: Ensure backward compatibility with existing code.**
- [x] Ensure backward compatibility with existing code.

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
- [ ] Revisit improved hover UX (T21).
- [ ] Comprehensive cross-browser/site testing.
- [ ] Build and packaging for release. 

---

**Implementation Sequence Recommendation:**
- T20 (Playback Speed Control)
- T19 (Voice Selection) + T22 (Audio Caching) (developed together)
- T18 (Estimated Time Remaining)
- T23 (Provider Abstraction, Fallback, UI/UX logic)

**Notes:**
- Provider abstraction and fallback logic are foundational for scalability and maintainability.
- UI/UX will extend the existing floating widget UI, not recreate it.
- Key competitor learnings integrated:
  - Speechify: Voice categorization by provider, visual avatars for voices
  - NaturalReader: Clean menu structure and status indicators
  - ReadVox: Simplified interface with clear fallback patterns
- CREATIVE mode is not required for this phase; standard engineering patterns suffice. 