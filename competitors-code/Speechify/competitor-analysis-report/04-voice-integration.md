# 04: Voice Integration and Synthesis

This document investigates how the extension generates speech audio and integrates different voices.

## Synthesis Method

The analysis confirms that the extension **does not use the standard Web Speech API (`window.speechSynthesis`)** provided by the browser. Key indicators:

*   No code references found for `speechSynthesis`, `getVoices()`, or `speechSynthesis.speak()`.
*   The presence and heavy use of `onnxruntime-web` within `offscreen/src/main.js`.
*   Specific code patterns related to Whisper model decoding (`_decode_asr`, `token_timestamps`, `WhisperTimeStampLogitsProcessor`) in `offscreen/src/main.js`, as detailed in `03-timing-highlighting.md`.

Instead, the extension performs **local Text-to-Speech (TTS) synthesis** using an **ONNX model (confirmed Whisper variant)** running directly in the browser via the ONNX Runtime.

## Code Paths and Execution Flow

1.  **Request Initiation**: A request to speak text originates from the content script or background script.
2.  **Offscreen Processing**: The text is sent to the Offscreen Document (`offscreen/src/main.js`).
3.  **Model Loading**: The ONNX Runtime loads the necessary TTS model files (`.onnx`, `.wasm`). These files are loaded using `fetch` (confirmed via `grep` results showing `.arrayBuffer()` usage) within `offscreen/src/main.js`, likely during initialization.
4.  **Tokenization & Inference**: The text is tokenized (using BPE, as discussed in `03-timing-highlighting.md`) and fed into the loaded ONNX model for inference.
5.  **Audio & Timestamp Generation**: The model generates the raw audio data and corresponding token-level timestamps.
6.  **Audio Handling**: The generated audio data is buffered and managed within the Offscreen Document, using Web Audio API or a similar mechanism, to facilitate playback and provide the necessary timing control confirmed in `01-overview.md` and `03-timing-highlighting.md`.

```mermaid
graph TD
    A[Request to Speak Text] --> B(Background Script);
    B --> C(Offscreen Document `offscreen/src/main.js`);
    C --> D{ONNX Runtime Initialized?};
    D -- No --> E[Load WASM & Model Files via fetch];
    E --> F[Initialize ONNX Runtime & Load Model];
    D -- Yes --> F;
    F --> G[Tokenize Input Text (BPE)];
    G --> H[Run TTS Model Inference (Whisper?)];
    H --> I[Receive Audio Data & Token Timestamps];
    I --> J[Process Timestamps (Word Level)];
    I --> K[Buffer/Decode Audio Data];
    J --> L(Send Timestamps to Background/Content Script);
    K --> M(Initiate Audio Playback within Offscreen Document);

    subgraph Offscreen Environment
        C; D; E; F; G; H; I; J; K; L; M;
    end
```

## Voice Selection

*   Voices are selected from a predefined list compatible with the local ONNX engine.
*   The file `centralized-voice-list.json` (**confirmed present** in the root directory, 387KB) almost certainly contains detailed metadata (name, language, speaker characteristics, model pointers?) for these voices.
*   There is no indication of dynamic fetching of voices via `speechSynthesis.getVoices()` or calls to external APIs to list available voices; selection relies on this local manifest.

## External API Calls

While `fetch` and `XMLHttpRequest` are used, they are primarily for:

1.  Loading the ONNX WASM module and model files.
2.  Sending analytics/logging data (e.g., to Segment via `https://api.segment.io/v1` or Grafana Faro via `https://...grafana.net/...`).
3.  Interacting with Speechify's own backend APIs (`*.speechify.com`) for features like account sync or library saving (as indicated by `externally_connectable` in `manifest.json` and confirmed in `01-overview.md`), but **not** for the core TTS synthesis itself.

**There are no observed REST API calls to external endpoints specifically for generating speech audio from text.**

## Replacing with Hugging Face Inference Endpoints

Swapping the local ONNX engine with calls to Hugging Face (HF) Inference Endpoints directly from the client-side (Offscreen Document or Background Script) **without an intermediary backend** presents challenges:

*   **Feasibility**: Yes, basic TTS audio generation is possible using `fetch`:
    *   Modify `offscreen/src/main.js` to call the HF endpoint (`POST https://api-inference.huggingface.co/models/YourTtsModel`) instead of running the ONNX model.
    *   **Request Body**: `JSON.stringify({ inputs: "text..." })`
    *   **Headers**: `Authorization: Bearer HF_TOKEN`, `Content-Type: application/json`
    *   **Response**: Handle the returned audio blob.
*   **Major Hurdles**:
    1.  **API Key Security**: Embedding an HF API token client-side is insecure. Requiring users to provide their own key is a workaround but shifts responsibility.
    2.  **Timestamp Loss**: Standard HF TTS endpoints typically **do not** provide word-level timestamps. This would break the extension's precise highlighting feature, as confirmed in `03-timing-highlighting.md`. Replicating highlighting would require alternative, likely less accurate, methods (heuristics, basic `ontimeupdate`, etc.) or a different TTS API provider that *does* offer timestamps.
    3.  **CORS**: The HF endpoint must permit requests from `chrome-extension://...` origins.
    4.  **Latency/Cost**: Introduces network latency and potential API costs/rate limits.

**Conclusion**: While audio *could* be generated via direct HF calls, the core feature of precisely synchronized highlighting would likely be lost or significantly degraded due to the lack of word-level timestamps from standard HF TTS endpoints.