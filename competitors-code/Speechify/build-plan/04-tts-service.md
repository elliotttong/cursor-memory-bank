# 04: TTS Service Integration (Kokoro-82M on Hugging Face)

This document specifies how the extension will interact with the deployed Kokoro-82M model via a Hugging Face Inference Endpoint.

## Endpoint Interaction

*   **Location:** The TTS request will be proxied through a Supabase Edge Function (`TTS Proxy & Timestamp Gen.`) to securely handle API keys and potentially process timestamps.
*   **Model:** `hexgrad/Kokoro-82M` (or our fine-tuned version) deployed on a dedicated HF Inference Endpoint (GPU recommended for performance).
*   **Authentication:** The Supabase Edge Function will use a securely stored Hugging Face API Token (e.g., via Supabase Vault or environment variables) in the `Authorization: Bearer HF_TOKEN` header of the request to the Inference Endpoint.

## API Request (Edge Function to HF Endpoint)

*   **Method:** `POST`
*   **URL:** `https://<YOUR_ENDPOINT_URL>.endpoints.huggingface.cloud`
*   **Headers:**
    *   `Authorization: Bearer <HF_API_TOKEN>`
    *   `Content-Type: application/json`
*   **Body (JSON):**
    ```json
    {
      "inputs": "Text to be synthesized goes here. It can be a moderately long paragraph.",
      "parameters": {
        // Model-specific parameters for Kokoro-82M go here.
        // These need research/experimentation based on the model card and HF implementation.
        // Examples (SPECULATIVE - verify these!):
        "voice_preset": "default_or_user_selected_id", // If model supports presets
        "speed": 1.0, // Playback speed factor (if supported by model/endpoint directly)
        "temperature": 0.7, // Controls randomness/creativity
        "output_format": "mp3", // Request specific format if possible (e.g., mp3, wav, opus)
        "return_timestamps": "word" // CRITICAL: Request word-level timestamps if the endpoint/model supports it.
        // "return_ssml_marks": true // Alternative: Request feedback on SSML marks if using that approach.
      }
    }
    ```
    *   **Note:** The exact structure of `parameters` depends heavily on the specific handler implementation for Kokoro-82M within the HF Inference Endpoint runtime. We may need to build a custom handler (as per HF docs) to ensure timestamp support.

## API Response (HF Endpoint to Edge Function)

*   **Success (Status Code 200):**
    *   **Content-Type:** `audio/mpeg` (or `audio/wav`, etc.) if returning raw audio, OR `application/json` if returning structured data.
    *   **Ideal JSON Body (if timestamp generation is supported):**
        ```json
        {
          "audio_blob": "<Base64 Encoded Audio String?>", // Or perhaps a direct audio stream/buffer
          "audio_format": "mp3",
          "timestamps": [
            { "word": "Text", "start_time": 0.12, "end_time": 0.45 },
            { "word": "to", "start_time": 0.46, "end_time": 0.55 },
            // ... array of word timestamps
          ],
          "duration_seconds": 5.67
          // Potentially sentence timestamps or SSML mark timings as well
        }
        ```
    *   **Alternative (Raw Audio):** If the endpoint only returns the audio file directly, the `Content-Type` will indicate the format, and the response body will be the binary audio data.
*   **Error (Status Code 4xx/5xx):**
    *   **Content-Type:** `application/json`
    *   **Body:**
        ```json
        {
          "error": "Error message from the endpoint (e.g., model loading failed, input too long, rate limit exceeded)",
          "error_code": "MODEL_ERROR | RATE_LIMIT | ..."
        }
        ```

## Edge Function Responsibilities (`TTS Proxy & Timestamp Gen.`)

1.  Receive segmented text and user preferences (e.g., desired speed) from the SW.
2.  Authenticate the user (via JWT) and check usage limits against Supabase DB.
3.  Construct the JSON payload for the HF Inference Endpoint, including input text and relevant parameters (potentially adjusting text for SSML marks if using that approach).
4.  Send the `POST` request to the HF endpoint with the API key.
5.  Handle the response:
    *   **If JSON with timestamps:**
        *   Decode/process audio if necessary.
        *   Store the audio blob in Supabase Storage.
        *   Format the timestamps, correlating them back to the original sentence IDs.
        *   Return the Storage URL and structured timestamp data to the SW.
    *   **If Raw Audio:**
        *   Store the audio blob in Supabase Storage.
        *   **Perform server-side alignment (Plan C):** Pass the audio and original text to an alignment function/model (potentially another call to a Whisper HF endpoint configured for transcription with timestamps) to generate timestamps.
        *   Format the generated timestamps.
        *   Return the Storage URL and structured timestamp data to the SW.
    *   **If Error:** Log the error and return an appropriate error message to the SW.
6.  Trigger the `Usage Logging` Edge Function asynchronously.

## Fallback to Browser Voice

If the HF Inference Endpoint fails (e.g., due to downtime, API key issues, network errors, user exceeding limits without a paid plan) or if the user explicitly prefers it for offline use/speed:

1.  The `TTS Proxy` Edge Function or the Background Service Worker detects the failure or condition.
2.  The SW falls back to using the standard Web Speech API (`window.speechSynthesis`).
3.  **Voice Selection:** Attempt to select a preferred browser voice based on language and user settings.
4.  **Playback:** Use `speechSynthesis.speak(utterance)`.
5.  **Highlighting:** Rely on the `utterance.onboundary` event. Map the `event.charIndex` back to the DOM elements. This will likely be less accurate than the primary method.
6.  **UI Indication:** Clearly indicate to the user that a fallback voice/method is being used.

## Competitor Comparison

*   **Competitor:** Used local ONNX/Whisper, providing direct, low-latency access to timestamps generated intrinsically by the model.
*   **Ours:** Relies on a network request to HF via a Supabase proxy. Timestamp generation is a critical dependency:
    *   Best case: HF endpoint provides accurate word timestamps.
    *   Worst case: Requires additional server-side processing (alignment) in the Edge Function, adding latency and complexity.
*   **Advantage:** Potential for higher voice quality with Kokoro-82M and offloading computation.
*   **Disadvantage:** Network latency, potential costs, and the crucial dependency on timestamp generation method.

**Action Item:** Thoroughly investigate and test the timestamp generation capabilities of Kokoro-82M when deployed via HF Inference Endpoints. Determine if a custom inference handler is needed to extract or generate this data. This dictates the complexity of the `TTS Proxy` Edge Function and the feasibility of Plan A/B vs. Plan C for highlighting.