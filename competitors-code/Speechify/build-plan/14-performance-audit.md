# 14: Performance Audit & Refactor Plan

This document identifies potential performance inefficiencies observed or inferred from the competitor's extension analysis and outlines our plan to address them in the new implementation.

## Potential Competitor Inefficiencies

Based on the analysis reports (`competitor-analysis-report/*.md`), the following areas might present performance bottlenecks or inefficiencies in the competitor's extension:

1.  **DOM Observation & Text Extraction:**
    *   **Inefficiency:** Potentially using inefficient or overly broad DOM manipulation observers (e.g., a non-throttled `MutationObserver` watching large parts of the `body`) to detect content changes, leading to excessive checks and script execution, especially on dynamic pages (SPAs, social media feeds).
    *   **Inefficiency:** Reliance on complex, potentially slow heuristic algorithms for text extraction on every page load or significant DOM change, even when simpler site adapters could apply.
    *   **Inefficiency:** Injecting multiple content scripts (`content-wrapper.js`, `content-idle-notifier.js`, `toggleIcon.js`) might slightly increase initial load/injection overhead, although likely minor.
2.  **Local TTS Processing:**
    *   **Inefficiency:** Running ONNX Runtime and Whisper-like models directly in the browser (Offscreen Document) consumes significant client-side CPU and memory resources, potentially impacting browser responsiveness, especially on lower-end machines or during complex synthesis tasks.
    *   **Inefficiency:** Loading large model files (`.onnx`, `.wasm`) via `fetch` could impact initial startup time or time-to-first-speech.
    *   **Inefficiency:** Caching model files or other large assets in IndexedDB (`unlimitedStorage`) is good, but inefficient reads/writes could still be a factor.
3.  **Highlighting Synchronization:**
    *   **Inefficiency:** While their timestamp-driven approach is likely accurate, inefficiently searching the DOM within the `requestAnimationFrame` loop to find and update highlighted elements could cause jank if not carefully optimized, especially on pages with very large amounts of text.
4.  **Resource Usage:**
    *   **Inefficiency:** The purpose of `timestretch_bg.wasm` was unclear, suggesting potentially unused or legacy code contributing to bundle size.
    *   **Inefficiency:** Requesting `system.cpu` and `system.memory` permissions without apparent usage adds unnecessary permission overhead.
    *   **Inefficiency:** Broad `<all_urls>` host permissions require the browser to consider the extension on every navigation, slightly impacting performance compared to the `activeTab` model.

## Our Refactor & Improvement Plan

Our architecture (cloud TTS, Supabase backend, `activeTab` permission) inherently addresses some inefficiencies, but we will focus on:

1.  **Efficient DOM Interaction & Text Extraction (Content Script):**
    *   **Plan:** Use `activeTab` and programmatic injection (`chrome.scripting.executeScript`) as the primary mechanism, minimizing static content script injection.
    *   **Plan:** Employ **throttled `MutationObserver`** instances, carefully configured to watch only specific relevant subtrees of the DOM where main content is expected or likely to change. Avoid observing the entire `document.body`.
    *   **Plan:** Use `IntersectionObserver` to detect when potential content blocks become visible, triggering extraction logic only when necessary.
    *   **Plan:** Prioritize efficient, specific **site adapters** (CSS selectors first) over general heuristics.
    *   **Plan:** Leverage `readability.js` (or similar tested library) for the fallback heuristic engine, benefiting from its optimizations.
    *   **Plan:** Cache adapter configurations effectively using `chrome.storage.local` with appropriate update mechanisms.
2.  **Optimized Highlighting (Content Script):**
    *   **Plan:** When receiving timestamped segments from the backend, pre-process the target DOM elements. Store references or generate efficient mappings (e.g., using `Range` objects or unique IDs on wrapper `<span>`s injected around sentences/words) instead of re-querying the DOM repeatedly within the `requestAnimationFrame` loop.
    *   **Plan:** Minimize DOM reflows during highlighting. Apply/remove classes efficiently. Use CSS containment where applicable.
    *   **Plan:** Consider using `AudioWorklet` for potentially more precise timing updates if `requestAnimationFrame` proves insufficient, though this adds complexity.
3.  **Reduced Client-Side Load:**
    *   **Plan:** Offload all TTS processing to the cloud (HF Inference Endpoint via Supabase Edge Function). This eliminates the major CPU/memory burden of running ONNX/Whisper locally.
    *   **Plan:** Eliminate the need for the `offscreen` permission and Offscreen Document if possible, simplifying the extension architecture. Handle audio playback directly in the Content Script using Web Audio API or `<audio>` elements, relying on the backend for audio data/URLs.
4.  **Minimalist Permissions & Resources:**
    *   **Plan:** Adhere strictly to the minimal permissions outlined in `13-permissions-csp.md`, primarily using `activeTab` and `scripting`.
    *   **Plan:** Avoid unnecessary permissions like `system.cpu`/`memory`.
    *   **Plan:** Carefully manage bundled assets and dependencies to keep the extension size reasonable.
    *   **Plan:** Ensure no unused code/assets (like the competitor's `timestretch_bg.wasm`) are included.
5.  **Backend & Network Optimization:**
    *   **Plan:** Cache generated audio effectively in Supabase Storage to reduce redundant calls to the HF Endpoint.
    *   **Plan:** Optimize Edge Function performance (cold starts, efficient DB queries).
    *   **Plan:** Implement appropriate error handling and fallbacks (e.g., browser voice) for network or API issues.
    *   **Plan:** Use Supabase Realtime efficiently, subscribing only to necessary data changes.

By addressing the competitor's likely bottlenecks (local processing, potentially inefficient DOM handling) and adopting a cloud-centric architecture with careful client-side implementation, we aim for a significantly more performant and resource-friendly extension. 