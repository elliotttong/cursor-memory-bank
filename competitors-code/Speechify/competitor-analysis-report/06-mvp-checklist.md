# 06: MVP Checklist for Replication

This checklist summarizes the core features and technical implementations identified in the analysis that would be critical to replicate for a competing Minimum Viable Product (MVP).

## Core Functionality

*   **[ ] Text Extraction (Hybrid Approach)**
    *   **[ ] Generic Heuristic:** Implement robust DOM traversal and filtering to identify main content on arbitrary websites (similar to `_` in `content/init-NNEJU3PF.js`). Must handle visibility, element types, and basic text density/length filtering.
    *   **[ ] Site-Specific Adapters:** Develop a mechanism (like `WebAdapterFactory`) to apply custom CSS selectors for high-traffic/complex sites (e.g., major news sites, Google Docs, specific web apps) to improve accuracy.
    *   **[ ] Content Script Injection:** Inject content script(s) effectively (`run_at: document_start` or `document_idle` as needed) to perform extraction (`content-wrapper.js`).
*   **[ ] Text Segmentation:**
    *   **[ ] Sentence Splitting:** Reliably split extracted text into sentences.
    *   **[ ] Word Splitting/Tokenization:** Split sentences into words/tokens suitable for the TTS engine.
*   **[ ] Audio Playback (Offscreen)**
    *   **[ ] Utilize Offscreen API:** Implement audio playback within an Offscreen Document (`offscreen` permission, `offscreen/*` resources) to comply with MV3 and handle audio reliably.
    *   **[ ] Basic Playback Controls:** Implement Play, Pause functionality triggered via UI and hotkeys.
*   **[ ] Highlighting (Timestamp-Based)**
    *   **[ ] Sentence Highlighting:** Add/remove CSS classes to visually mark the currently playing sentence.
    *   **[ ] Word Highlighting:** Add/remove CSS classes to visually mark the currently playing word.
    *   **[ ] Timestamp Generation:** The TTS engine *must* provide accurate word-level (or at least token-level that can be aggregated) timestamps.
    *   **[ ] Synchronization Logic:** Implement a reliable loop (`requestAnimationFrame` or similar) in the content script to sync audio time with timestamp data and apply highlight classes.
*   **[ ] UI Injection**
    *   **[ ] Hover Play Button:** Inject a play icon that appears on hover over detected text blocks/sentences (`content/init-ESVNB32Q.js`, `content/init-F27DTRWA.js`).
    *   **[ ] Basic Player UI (Optional but Recommended):** A minimal persistent player UI (even if just a pause button/progress) might be needed for better UX.
*   **[ ] Hotkey Integration**
    *   **[ ] Define Commands:** Define essential commands (at least Play/Pause) in `manifest.json` (`commands`).
    *   **[ ] Background Listener:** Implement `chrome.commands.onCommand` listener in the background script to trigger actions.

## Technical Requirements & Architecture

*   **[ ] Manifest V3 Compliance:** Build as an MV3 extension.
*   **[ ] Background Service Worker:** Use a service worker (`background/main.js`) for coordination.
*   **[ ] Content Script(s):** Structure for DOM interaction and UI injection.
*   **[ ] Offscreen Document:** Essential for reliable audio playback.
*   **[ ] Permissions:**
    *   `offscreen`: Required for audio.
    *   `storage`: Required for settings.
    *   `scripting`: Likely needed for robust content script injection or interaction.
    *   `contextMenus`: Useful for "Read aloud" right-click option.
    *   `host_permissions`: `<all_urls>` or sufficiently broad permissions to cover target websites.
*   **[ ] Storage:** Use `chrome.storage.local` or `chrome.storage.sync` for basic settings (e.g., voice selection, speed).
*   **[ ] Cross-Script Communication:** Establish reliable messaging between Content Scripts, Background Script, and Offscreen Document (`chrome.runtime.sendMessage`, `chrome.tabs.sendMessage`).

## Key Dependencies/Choices

*   **[ ] TTS Engine Choice:**
    *   **Local (like Speechify):** Requires integrating an ONNX model (like Whisper) + ONNX Runtime, WASM handling. **Benefit:** Offline capability, potentially lower latency, **provides word timestamps**. **Challenge:** Complexity, bundle size, performance.
    *   **Cloud (e.g., Hugging Face, GCP, AWS):** Requires network requests (`fetch`), API key management. **Benefit:** Simpler initial implementation, potentially wider voice variety. **Challenge:** Latency, cost, **lack of reliable word timestamps from most standard endpoints**, API key security.
    *   **Browser `speechSynthesis` (Not recommended for matching Speechify):** Simplest but lacks voice quality, control, and **reliable word boundary events (`onboundary` is often inaccurate or inconsistent)**.
*   **[ ] UI Framework (Optional):** Using Preact/React + CSS-in-JS (like Speechify) helps manage complex injected UIs but adds to bundle size. Vanilla JS + CSS is possible for simpler MVPs.

## Nice-to-Have (Beyond MVP but in Target Extension)

*   [ ] Advanced Playback Controls (Speed, Skip)
*   [ ] Voice Selection UI
*   [ ] OCR Fallback (Screenshot Mode)
*   [ ] Save to Library / Cloud Sync (`externally_connectable`, backend API)
*   [ ] Specific site integrations (e.g., Google Docs, PDF handling)
*   [ ] Theming (Dark/Light Mode UI adaptation)
*   [ ] Analytics/Error Reporting (like their Segment/Faro integration)

**Recommendation:** The most critical dependency choice is the **TTS engine**. Replicating the precise highlighting requires an engine that provides reliable word-level timestamps, strongly favoring a local Whisper/ONNX approach similar to the target extension, despite its complexity. 