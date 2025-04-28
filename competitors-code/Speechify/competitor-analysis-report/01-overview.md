# 01: Extension Overview & Architecture

This document provides a high-level overview of the Speechify Chrome extension's architecture based on the `manifest.json` and subsequent code analysis.

## Core Components

The extension follows a standard Manifest V3 structure:

1.  **Background Service Worker (`background/main.js`)**: Acts as the central hub, managing state, coordinating communication between different parts of the extension, handling events (like hotkeys, context menu clicks, tab updates), and **confirmed managing the Offscreen Document lifecycle** (via `chrome.offscreen.createDocument`, see `background/main.js` L1419).
2.  **Content Scripts**: Injected into web pages (`<all_urls>`) to interact with the DOM.
    *   `content-wrapper.js` (and `css/speechify.css`): Injected at `document_start`. Responsible for the primary tasks of identifying readable content, injecting UI elements (like the play button, hover highlights), and communicating with the background script.
    *   `content-idle-notifier.js`: Injected at `document_idle`. **Confirmed to signal** (`window.postMessage({ event: 'idle' })`) that the idle state has been reached, allowing other content scripts to coordinate setup.
    *   `toggleIcon.js`: Also injected (`document_idle` default). **Confirmed to send the OS color scheme** (`dark` or `light`) to the background script, likely for setting the toolbar icon theme.
3.  **Offscreen Document (`offscreen/offscreen.html`, `offscreen/src/main.js`)**: Utilizes the `offscreen` permission. **Confirmed used for local audio synthesis (via ONNX Runtime / Whisper model) and playback**, overcoming MV3 service worker limitations. Receives text instructions from the background script.
4.  **Web Accessible Resources**: Includes UI assets (`images/`, `fonts/`, `audio/`), core logic/helpers (`houdini.js`, `content/*`, `offscreen/*`), and WebAssembly modules (`timestretch_bg.wasm`, ONNX runtime WASM files).
    *   The purpose of `timestretch_bg.wasm` is **not confirmed**; searches did not reveal its usage for time-stretching or other functions within the analyzed audio pipeline. It might be legacy or used elsewhere.
    *   ONNX Runtime WASM files are loaded by `offscreen/src/main.js` for local TTS.
5.  **Google Docs Specific Script (`gdocs.js`)**: Suggests custom logic or selectors specifically for handling Google Docs (Confirmed in Text Extraction Analysis).

## Key Permissions & Features

*   **Broad Host Access (`<all_urls>`):** Allows the extension to function on nearly any webpage, including local files (`file://*/`). **Redundant `http/https/file` permissions also present.**
*   **Storage (`storage`, `unlimitedStorage`):** Used for storing user settings, preferences, and **confirmed used for large IndexedDB caches** (Firebase offline data, SQLDelight library data, potentially model assets). `unlimitedStorage` supports this large cache.
*   **Scripting (`scripting`):** Enables dynamic injection of code by the background script, potentially for complex injection scenarios.
*   **Offscreen Audio Playback (`offscreen`):** **Required** for local TTS synthesis and playback in MV3.
*   **Context Menus (`contextMenus`):** Provides users with right-click options (e.g., "Read aloud").
*   **Hotkeys (`commands`):** Offers keyboard shortcuts for core actions (Play/Pause, Save).
*   **System Info (`system.cpu`, `system.memory`):** Uncommon permissions; **no usage found** in searches. Their necessity is questionable.
*   **External Communication (`externally_connectable`):** Allows interaction with Speechify's web services (`*.speechify.com`) for features like account sync and library saving. **Confirmed used for analytics** (Segment/Faro via Speechify proxy). **Not used for core TTS synthesis.**

## Architectural Diagram (Conceptual)

```mermaid
graph LR
    subgraph User Interface
        A[Web Page DOM]
        B[Injected UI (Button, Highlights)]
        C[Extension Popup/Options] -- Optional --> SW
    end

    subgraph Content Script Environment (`content-wrapper.js`, etc.)
        CS[Content Script]
        CS -- Reads/Manipulates --> A
        CS -- Creates/Updates --> B
        CS -- Communicates via --> SW[Service Worker]
        CS -- Loads --> WARes[Web Accessible Resources]
    end

    subgraph Background Environment
        SW[Service Worker (`background/main.js`)]
        SW -- Creates & Manages --> OD[Offscreen Document]
        SW -- Handles Events --> FN(Hotkey Listener, Context Menus, etc.)
        SW -- Stores/Retrieves --> Store(chrome.storage / IndexedDB)
        SW -- Calls --> ExtAPI(Speechify Backend & Analytics)
    end

    subgraph Offscreen Document (`offscreen/src/main.js`)
        OD -- Handles --> Audio(Local Audio Synthesis & Playback)
        OD -- Uses --> ONNXWASM(ONNX Runtime WASM)
        OD -- Uses --> FirebaseStore(IndexedDB via Firebase)
        OD -- Uses --> OtherWASM(timestretch_bg.wasm?) -- Purpose Unclear
        OD -- Communicates --> SW
    end

    A -- User Interaction --> CS
    B -- User Interaction --> CS

    style Content Script Environment fill:#f9f,stroke:#333,stroke-width:2px
    style Background Environment fill:#ccf,stroke:#333,stroke-width:2px
    style Offscreen Document fill:#cfc,stroke:#333,stroke-width:2px
    style User Interface fill:#ff9,stroke:#333,stroke-width:2px

```

## Summary

The extension is a sophisticated text-to-speech reader using local synthesis. It injects scripts (`content-wrapper.js`) to analyze web page content using a hybrid approach (heuristics + site-specific adapters, including for Google Docs). UI controls (hover buttons, highlights) are added dynamically. Audio playback and **local TTS synthesis (via ONNX/Whisper)** are handled robustly using the Offscreen API. **WebAssembly is confirmed used for the ONNX runtime**, while the purpose of `timestretch_bg.wasm` remains unclear. It communicates with external Speechify servers for synchronization and analytics, but **not for core TTS**. It relies heavily on broad permissions (`<all_urls>`, `scripting`, `unlimitedStorage`) to operate across websites and manage its local data stores. 