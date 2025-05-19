# Active Context: Provider Abstraction Implementation (Updated)

**Current Mode:** IMPLEMENTATION (Provider Abstraction, TTS Providers)
**Goal:** Implement scalable, robust, and maintainable TTS provider abstraction and UI/UX.

**Key Architecture Principles (Updated):**
* All voices are loaded from voiceConfig.json at startup by ProviderManager.
* ProviderManager builds a flat array and a composite key map of all voices.
* UI and playback logic always use ProviderManager for voice data (never provider instances).
* Voice selection, storage, and lookup are always by composite key (provider:id).
* Provider logic is only used for synthesis (TTS API calls), not for UI or selection.
* Adding new providers/voices is just a config update and a new provider implementation for synthesis.

**Implementation Steps:**
- [x] Refactor ProviderManager for config-driven voice management
- [x] Refactor UI to use ProviderManager for all voice data
- [x] Refactor playback and background logic for composite key routing
- [x] Add defensive/fallback logic (robust handling of missing voices/providers, object URL revocation)
- [x] Test all flows and edge cases (no critical bugs remain)

**Status:**
* All core refactor tasks are complete. The system is robust, defensive, and future-proof. Prefetching and memory management are working as designed. Audio caching and advanced UI polish are next-level optimizations.

**Composite Key Update:**
* All voice lookups, selection, and storage use composite keys (provider:id) to ensure uniqueness and future-proof the system against provider/voice id collisions. This is now a core part of the architecture and implementation plan.

**Provider-Agnostic, Voice-Centric Architecture Plan**

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

📋 **Overview of Changes**
- Voice selection and UI will be provider-agnostic: all voices are shown in a single list (grouped by country, not provider).
- Voice config is loaded at startup and contains all metadata (id, displayName, country, provider, isPremium, etc).
- Voice selection is stored by composite key (provider:id).
- When playing audio or syncing highlights, the selected voice is looked up, its provider is determined, and the correct provider is used for synthesis and timing.
- No need for per-voice capability flags since all providers support the full feature set.

📁 **Files to Modify**
- extension-code/modules/providers/providerManager.js
- extension-code/modules/providers/index.js
- extension-code/modules/ui/voiceSelector.js
- extension-code/assets/voices/voiceConfig.json
- (Possibly) extension-code/modules/providers/deepInfraProvider.js, browserTTSProvider.js (to remove hardcoded voices and ensure they use the config)
- Any file that handles voice selection, playback, or highlight syncing

🔄 **Implementation Steps**
1. **Voice Config Loading**
   - Load all voices from voiceConfig.json at startup (already implemented with async fetch).
   - Store all voices in a flat array in ProviderManager.
   - Build a lookup map: compositeKey (provider:id) -> voiceObject.
2. **UI: Voice Selector**
   - Show all voices in a single list, grouped by country (not provider).
   - Show a lock icon for premium voices if quota is reached or user is not premium.
   - Allow user to select any voice; store the selected composite key.
3. **Voice Selection Storage**
   - Store the selected composite key in local storage (or extension storage).
   - On startup, load the last selected voice or use the default.
4. **Playback & Highlighting**
   - When playback or highlight sync is triggered:
     - Look up the selected voice by composite key.
     - Determine the provider from the voice object.
     - Route the request to the correct provider for synthesis and timing.
   - All providers must implement the full feature set (word timing, speed, etc).
5. **Provider Logic**
   - Remove hardcoded voice lists from provider modules.
   - Providers only handle synthesis logic; voices are passed in or looked up as needed.
6. **Error Handling**
   - If a provider is missing or fails, voices from that provider are disabled or hidden.
   - If a voice is selected but its provider is unavailable, fall back to the default voice.
7. **Testing**
   - Test voice selection, playback, and highlighting with all voices.
   - Test premium lockout logic.
   - Test fallback logic if a provider is unavailable.

**Implementation Progress:**
*   **Provider Abstraction Core:** ✅ COMPLETE
    * Created provider interface/types (`modules/providers/types.js`)
    * Implemented provider manager (`modules/providers/providerManager.js`)
    * Created Deep Infra provider (`modules/providers/deepInfraProvider.js`)
    * Created Browser TTS provider (`modules/providers/browserTTSProvider.js`)
    * Added provider initialization logic (`modules/providers/index.js`)
    * Created testing utilities (`modules/providers/tests.js`, `/tests/provider-test.html`)

*   **Background Integration:** ✅ COMPLETE
    * Updated background.js to use provider abstraction
    * Added feature flag system for safer rollout
    * Maintained backward compatibility
    * Updated manifest.json for module support

*   **UI Components:** 🟡 PARTIALLY COMPLETE
    * Created placeholder voice selector module (`modules/ui/voiceSelector.js`)
    * Prepared for voice avatar images (`assets/voices/`)
    * Actual UI implementation is the next step

**Next Steps:**
- (Optional) Implement audio caching for pre-fetched audio.
- Polish UI (premium lockout, avatars, etc.)
- Add advanced features as per roadmap.

**Summary:**
- The provider abstraction, composite key routing, and config-driven voice management are complete and robust. The system is ready for polish and advanced features.

**Architecture:**
* **Provider Interface:** Defines common voice structure and provider methods
* **Provider Manager:** Central point for provider selection, voice management, and quota tracking
* **Composite Key Voice Lookup:** All voice operations use composite keys (provider:id) for uniqueness and future extensibility
* **Deep Infra Provider:** Wraps existing API functionality in provider interface
* **Browser TTS Provider:** Uses Chrome TTS API with estimated word timing
* **Feature Flags:** Allow easy rollback if issues are found

**Testing Strategy:**
* Stand-alone testing page (`tests/provider-test.html`)
* Feature flag to safely roll out changes
* Unit tests for each provider
* Backward compatibility checks

**UI Extension Strategy:**
* Keep existing widget, add dropdown to voice avatar
* Show provider tabs and voice options
* Visual indicators for premium voices and quota status
* Clear fallback indicators for quota-limited scenarios

This implementation successfully adds support for multiple TTS providers in a scalable, maintainable way while preserving backward compatibility with the existing extension functionality.