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

### Provider-Agnostic, Voice-Centric Architecture Plan (Completed)

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
- [x] Remove legacy provider-based UI/selection logic
- [x] Add defensive/fallback logic
- [x] Test all flows and edge cases

⚠️ **Potential Challenges**
- Ensuring all legacy code paths are updated to use the new flow
- Handling missing or malformed config gracefully
- Ensuring backward compatibility with user settings

✅ **Testing Strategy**
- Manual and automated tests for all UI, selection, and playback flows
- Simulate missing providers/voices and verify graceful fallback

📝 **Task Checklist**
- [x] Refactor ProviderManager for config-driven voice management
- [x] Refactor UI to use ProviderManager for all voice data
- [x] Refactor playback and background logic for composite key routing
- [x] Remove legacy provider-based UI/selection logic
- [x] Add defensive/fallback logic
- [x] Test all flows and edge cases

🟢 **Step 1: Update config and data structures for composite keys.**
- [x] Ensure each voice in voiceConfig.json has both provider and id fields. (Already present)
- [x] Build a lookup map: compositeKey (provider:id) -> voiceObject in ProviderManager.

🟢 **Step 2: Refactor selection/storage to use composite keys throughout the UI and ProviderManager.**
- [x] Update UI to store and retrieve selected voice by composite key.
- [x] Update ProviderManager to use composite key for all selection/storage logic.

🟢 **Step 3: Update playback and highlighting routing to use composite key for provider/voice lookup.**
- [x] Refactor playback and highlight sync logic to use the selected composite key for provider/voice lookup and routing.

🟢 **Step 4: Add defensive/fallback logic.**
- [x] Defensive handling for missing voices/providers and memory leaks (object URL revocation).

🟢 **Step 5: Test all flows and edge cases.**
- [x] All major flows tested; no critical bugs remain. Prefetching is robust. Audio caching is a future optimization.

**Next Steps:**
- (Optional) Implement audio caching for pre-fetched audio.
- Polish UI (premium lockout, avatars, etc.)
- Add advanced features as per roadmap.

**Summary:**
- The provider abstraction, composite key routing, and config-driven voice management are complete and robust. The system is ready for polish and advanced features.

## Phase X: Voice Selector UI Revamp (New Focus)

**Goal:** Implement a new, more user-friendly voice selector UI with tabbed navigation (Featured, Recent, All Voices), country-based grouping, and improved voice discovery, taking inspiration from Speechify's UI patterns. Reference `activeContext.md` for UI feature details.

**Files to Modify:**
- `extension-code/modules/ui/voiceSelector.js` (Primary focus)
- `extension-code/assets/voices/voiceConfig.json` (For `isFeatured` flag)
- (Potentially) CSS files for new styles.

**Task Checklist & Implementation Phases:**

**Phase 1: Data & Core Structure**
- [ ] **T_UI_01:** Add `isFeatured` boolean property to voices in `voiceConfig.json`. Mark a few diverse voices as featured.
- [ ] **T_UI_02:** Plan for "Recent" Voices: Decide on `localStorage` key and structure (array of last ~5 composite voice keys). (Implementation later)
- [ ] **T_UI_03:** Implement initial HTML structure in `voiceSelector.js` for the main panel, header (title, close), tab navigation (Featured, Recent, All Voices), and empty tab content panes.

**Phase 2: "All Voices" Tab - Core Functionality**
- [ ] **T_UI_04:** Grouping & Rendering: In `voiceSelector.js`, fetch voices via `providerManager.getAllVoices()`, group them by `voice.country`.
- [ ] **T_UI_05:** For each country in "All Voices", render a country header and then a list of voice items (`div.voice-item`) showing name, language, gender. Add `data-voice-key`.
- [ ] **T_UI_06:** Style voice items with placeholders for avatar/icon, premium tag, and selected state indicator.
- [ ] **T_UI_07:** Make the `all-voices-pane` scrollable via CSS.
- [ ] **T_UI_08:** Implement voice selection logic: Attach click listener to `.voice-item`, call `providerManager.setSelectedVoice(voiceKey)`, re-render/update selected state, and update main widget avatar.

**Phase 3: Tab Switching & "Featured" Tab**
- [ ] **T_UI_09:** Implement tab switching logic: Click listeners on tab buttons to show/hide corresponding panes and update active tab style.
- [ ] **T_UI_10:** Populate "Featured" Tab: Create function to filter `providerManager.getAllVoices()` for `isFeatured: true`, render voice items (similar to "All Voices") into the `featured-voices-pane`.
- [ ] **T_UI_11:** Attach voice selection logic to "Featured" tab items.

**Phase 4: "All Voices" - Country Selector & Scroll-to**
- [ ] **T_UI_12:** Country Selector UI: Add `div#country-selector-button` (e.g., "All Countries") and a hidden `div#country-dropdown-list`.
- [ ] **T_UI_13:** Populate Country Selector: Get unique country list, create `div.country-dropdown-item` for each with `data-country-name`.
- [ ] **T_UI_14:** Country Selector Interaction: Click on button toggles dropdown. Click on item updates button text, hides dropdown.
- [ ] **T_UI_15:** Scroll-to Logic: On country selection, find corresponding country header in voice list (add `data-country-scroll-target`) and use `element.scrollIntoView()`.

**Phase 5: "Recent" Tab (Implement after others)**
- [ ] **T_UI_16:** Recent Voices Storage: On voice selection, save composite key to `localStorage` array (max N items, newest first).
- [ ] **T_UI_17:** Populate "Recent" Tab: On tab click, read keys from `localStorage`, fetch full voice objects from `ProviderManager`, render into `recent-voices-pane`. Attach selection logic.

**Phase 6: Styling & Refinements**
- [ ] **T_UI_18:** Apply CSS iteratively for desired aesthetic (Speechify inspiration).
- [ ] **T_UI_19:** Ensure basic keyboard accessibility for tabs and lists.
- [ ] **T_UI_20:** Refine premium tag display and selected voice indicators.
- [ ] **T_UI_21:** Add simple placeholders for voice avatars/icons.

**Next Steps (Post UI Revamp):**
- (Optional) Implement audio caching for pre-fetched audio.
- Add advanced features as per roadmap (speed control, premium lockout details, etc.).

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