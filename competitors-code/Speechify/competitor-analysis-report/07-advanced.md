# 07: Advanced Diagnostics

This report covers performance considerations, permissions, security aspects, analytics, internationalization, caching, and error handling based on analysis of the codebase.

## 7.1 Performance & Memory

*   **Timers (`setInterval`, `setTimeout`):**
    *   `setInterval`: Used sparingly, primarily within the bundled Grafana Faro analytics library (`offscreen/src/main.js`) for periodically flushing telemetry data.
    *   `setTimeout`: Used extensively for standard web development patterns: debouncing UI interactions (e.g., delaying tooltip appearance/disappearance in `content/chunk-FJMP4XPS.js` with 100-600ms delays), error retries (see 7.7), yielding the main thread (`setTimeout(..., 0)`), and scheduling asynchronous tasks.
    *   **Confirmation:** No evidence suggests core functionality relies on very high-frequency timers (<50ms).
*   **Observers (`MutationObserver`):**
    *   Confirmed usage in `content/chunk-PJRECGUK.js` to observe the document subtree (`subtree: true, childList: true`). This allows the extension to react to dynamic page changes but could have performance implications on very active pages. Careful handling within the observer callback is crucial.
*   **Animation (`requestAnimationFrame`):**
    *   Used by the bundled Preact/React library (`content/chunk-RQERJHUS.js`) for scheduling rendering updates.
    *   Used in Web Vitals monitoring code (`offscreen/src/main.js`).
    *   Used in `content/chunk-BD5GYQVX.js`, potentially for the highlighting synchronization loop, which is an efficient approach.
*   **Idle Tasks (`requestIdleCallback`):**
    *   Detected in performance monitoring code (`offscreen/src/main.js`), indicating deferred execution for non-critical tasks.
*   **DOM Nodes & Leaks:**
    *   No obvious memory leaks apparent from code snippets. Components using Preact/React likely handle unmounting correctly.
    *   The dynamic injection/removal of UI elements (hover icons, tooltips) and highlighting requires careful implementation to avoid leaks. Confirmation would require runtime profiling.
*   **Dev Hints (`FIXME`/`TODO`):**
    *   Minor TODOs found related to potential code cleanup or future enhancements (WebGL math optimization, CSS Houdini skew support) in `offscreen/src/main.js` and `houdini.js`. None indicate known critical performance issues.

**Recommendation:** Profile the `MutationObserver` impact on known complex/dynamic web applications. Runtime memory profiling is recommended to definitively rule out DOM node leaks during extended use.

## 7.2 Permissions Audit

Based on `manifest.json`:

| Permission         | Justification / Observed Need                               | Risk/Warning                     | Usage Confirmed In                   | Overbroad Assessment             |
| :----------------- | :---------------------------------------------------------- | :------------------------------- | :----------------------------------- | :------------------------------- |
| `offscreen`        | **Required** for MV3 audio playback via ONNX/Whisper.       | Low                              | `background/main.js` (creates doc) | No                               |
| `tabs`             | Query tab info (URL, title) for context/activation.         | Medium (See all tab info)        | background, content (via messages) | Potentially (vs `activeTab`)     |
| `contextMenus`     | Add "Read aloud" right-click option.                      | Low                              | background                           | No                               |
| `storage`          | Store user settings (confirmed via Faro logs, IndexedDB use for persistence implies settings might also be here). | Low                              | background, content (settings UI)    | No                               |
| `alarms`           | Schedule background tasks (e.g., sync settings, analytics). | Low                              | background                           | Maybe (Depends on task needs)    |
| `scripting`        | Inject content scripts programmatically.                    | **High** (Execute code anywhere) | background                           | Potentially (vs static injection) |
| `unlimitedStorage` | Needed for large IndexedDB usage (Firebase cache, SQLDelight, potential models). | Low                              | background, offscreen                | Likely No (due to local models/cache)| 
| `system.cpu`       | Performance monitoring (uncommon).                          | Low                              | Not found in searches                | Yes (Unless specific need exists)| 
| `system.memory`    | Performance monitoring (uncommon).                          | Low                              | Not found in searches                | Yes (Unless specific need exists)| 
| `<all_urls>`       | **Required** to inject content scripts on any page.         | **High** (Read any page)       | `manifest.json` (content scripts)    | No (for core function)           |
| `https://*/`       | Host permission (subset of `<all_urls>`).                 | High                             | `manifest.json`                      | Yes (Redundant)                  |
| `http://*/`        | Host permission (subset of `<all_urls>`).                 | High                             | `manifest.json`                      | Yes (Redundant)                  |
| `file://*/`        | Host permission (allows reading local files).               | High                             | `manifest.json`                      | Yes (Redundant)                  |

**Recommendations:**
*   Remove redundant host permissions (`https://*/`, `http://*/`, `file://*/`).
*   Review if `tabs` can be restricted to `activeTab`.
*   Document the specific need for `scripting` over static injection.
*   Remove `system.cpu` and `system.memory` unless a specific, documented need exists (none found).

## 7.3 Security & Privacy

*   **Script Injection:** No direct injection of external scripts via `createElement('script')` was found.
*   **`innerHTML` / `dangerouslySetInnerHTML`:**
    *   Confirmed usage within the bundled Preact library (`content/chunk-5EAK3AW7.js`, `content/chunk-NUN3A7RC.js`) for React's standard mechanism. Risk depends entirely on whether *user-controlled or unsanitized data* is passed to this prop.
    *   Other uses appear safe (HTML normalization, clearing elements, template initialization in libraries).
    *   **Recommendation:** Audit all data sources passed to `dangerouslySetInnerHTML`.
*   **CSP:** `manifest.json` policy allows `wasm-unsafe-eval` (required for ONNX Runtime) and scripts/objects only from `'self'`. Sandbox policy allows `default-src *` (broad). Appears reasonably configured for its needs.
*   **PII Handling:**
    *   Core TTS processing is local.
    *   Visited URLs are processed.
    *   **OCR feature confirmed to send screen image data externally.** (`content/init-LCCYJZVE.js`, `/ocr/ocr-image` endpoint)
    *   **Segment analytics confirmed to send user ID, email, name** (`offscreen/src/main.js` calls `m_.identify`).
    *   **Recommendation:** Implement explicit, granular user consent for OCR data submission and identified analytics tracking.
*   **Secrets:** Analytics keys (Segment writeKey in `offscreen/src/main.js`) are embedded client-side.

## 7.4 Analytics & Telemetry

*   **Providers:** Confirmed use of **Segment** and **Grafana Faro**.
*   **Location:** Initialization and calls primarily in `offscreen/src/main.js`.
*   **Data Sent:**
    *   **Segment:** Confirmed `identify` calls (userId, email, name) and `track` calls (custom events).
    *   **Grafana Faro:** Confirmed collection of errors, logs, performance metrics (Web Vitals, resource timings, navigation), session info, console logs.
*   **Endpoints:**
    *   Segment: Confirmed proxy API host (`https:////4n41y71c5.api.speechify.com/v1`) and direct URL (`https://api.segment.io/v1`) mentioned.
    *   Faro: Confirmed collectors (`https://...grafana.net/collect/...`, `https://extension.faro.speechify.dev/collect`).
*   **Cadence:** Faro batches sends (default ~250ms), Segment calls are event-driven.
*   **Consent:** No code related to requesting consent found. Controlled partly by feature flags (`ceSegment`).

**Recommendation:** Implement clear user consent mechanism for analytics, distinguishing between anonymized (Faro) and identified (Segment) data if possible.

## 7.5 Internationalisation (i18n)

*   **API Usage:** Uses `__MSG_key__` in `manifest.json`. **Confirmed no usage of `chrome.i18n.getMessage` in JS code found**.
*   **Locales:** Confirmed only `_locales/en/` exists.
*   **Adding Locales (e.g., `en_GB`):** Requires creating `_locales/en_GB/messages.json` AND **refactoring all hardcoded UI strings in JS components** to use `chrome.i18n.getMessage()`.

**Recommendation:** Significant refactoring required for multi-language support.

## 7.6 Caching & Offline

*   **`chrome.storage`:** Usage not directly found via `grep`. Settings might be stored via backend sync or within IndexedDB.
*   **`IndexedDB`:** **Confirmed heavy usage** (`offscreen/src/main.js`, background, content chunks).
    *   Used by bundled **Firebase** library (Firestore offline persistence).
    *   Used by bundled **SQLDelight** library (structured data caching, e.g., library).
    *   Used for analytics state/heartbeats (Faro/Firebase Analytics).
*   **Offline Content:** User library data and potentially model assets/voices stored via IndexedDB (Firestore/SQLDelight).
*   **Limits/Eviction:** `unlimitedStorage` permission used. Eviction handled by Firestore/SQLDelight internal logic or potentially custom LRU (`LruGarbageCollector` class name found).

**Recommendation:** Further investigation into IndexedDB schemas could clarify exact cached data (settings vs. content vs. models).

## 7.7 Rate Limits & Error Handling

*   **TTS Rate Limits:** N/A (Local ONNX TTS).
*   **API Call Retries:**
    *   **Confirmed Grafana Faro transport handles 429 errors** with backoff based on `Retry-After` or a default (`offscreen/src/main.js`).
    *   **Confirmed Exponential Backoff with Jitter** used for some internal async operations (`offscreen/src/main.js`).
*   **Error Handling:**
    *   `fetch` calls generally have `.catch` blocks.
    *   Errors are primarily logged via Faro or console.
*   **Circuit Breaker:** No explicit pattern found.

**Recommendation:** Enhance user feedback for critical errors (e.g., failed model load, persistent API issues) beyond internal logging. 