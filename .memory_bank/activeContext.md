# Active Context: Voice Selector UI Revamp (New Focus)

**Current Mode:** UI IMPLEMENTATION (Voice Selector Revamp)
**Goal:** Implement a new, more user-friendly voice selector UI with tabbed navigation (Featured, Recent, All Voices), country-based grouping, and improved voice discovery, taking inspiration from Speechify's UI patterns.

**Key Architecture Principles (UI Revamp):**
*   **Data-Driven:** UI will be dynamically populated from `voiceConfig.json` via `ProviderManager`.
*   **Component-Based (Conceptual):** While not using a framework, structure the JS for maintainability, separating rendering logic from event handling where possible.
*   **User Experience Focus:** Prioritize intuitive navigation and clear presentation of voice options.
*   **Inspiration, Not Imitation:** Adapt Speechify's successful UX patterns (tabs, grouping) to fit our specific voice data and project structure.

**High-Level UI Features:**
1.  **Tabbed Interface:**
    *   "Featured" tab: Showcasing a curated list of voices.
    *   "Recent" tab: Displaying recently used voices (via `localStorage`).
    *   "All Voices" tab: Comprehensive list, grouped by country, with a country selection mechanism.
2.  **"All Voices" Tab Functionality:**
    *   Voices grouped by country.
    *   Country selector dropdown to filter/scroll to a specific country.
    *   Scrollable voice list within each country or for all countries.
3.  **Voice Items:**
    *   Display voice name, language/locale, gender.
    *   Visual indicator for premium voices.
    *   Visual indicator for currently selected voice.
    *   (Future) Placeholder for voice avatars/icons.

**Status:**
*   Core backend (ProviderManager, voiceConfig.json, composite keys) is stable and robust.
*   Previous UI data issues (undefined names/languages) resolved.
*   Current task: Implement the new voice selector UI as per the detailed plan in `tasks.md`.

---
*(Previous content regarding Provider Abstraction remains below for historical context but is now largely complete)*

**Key Architecture Principles (Provider Abstraction - Completed):**
* All voices are loaded from voiceConfig.json at startup by ProviderManager.
* ProviderManager builds a flat array and a composite key map of all voices.
* UI and playback logic always use ProviderManager for voice data (never provider instances).
* Voice selection, storage, and lookup are always by composite key (provider:id).
* Provider logic is only used for synthesis (TTS API calls), not for UI or selection.
* Adding new providers/voices is just a config update and a new provider implementation for synthesis.

**Implementation Steps (Provider Abstraction - Completed):**
- [x] Refactor ProviderManager for config-driven voice management
- [x] Refactor UI to use ProviderManager for all voice data
- [x] Refactor playback and background logic for composite key routing
- [x] Add defensive/fallback logic (robust handling of missing voices/providers, object URL revocation)
- [x] Test all flows and edge cases (no critical bugs remain)

**Composite Key Update (Completed):**
* All voice lookups, selection, and storage use composite keys (provider:id) to ensure uniqueness and future-proof the system against provider/voice id collisions. This is now a core part of the architecture and implementation plan.

**Provider-Agnostic, Voice-Centric Architecture Plan (Completed)**

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

**Next Steps (Post UI Revamp):**
- (Optional) Implement audio caching for pre-fetched audio.
- Add advanced features as per roadmap (speed control, premium lockout details, etc.).

**Summary (Provider Abstraction - Completed):**
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