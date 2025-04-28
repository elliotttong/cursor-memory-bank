# 03: Synchronized Highlighting Specification

This document outlines the algorithm for synchronizing text highlighting with audio playback, a critical feature for user experience.

## Core Challenge

The primary challenge is accurately mapping segments of the synthesized audio back to the corresponding text elements (words, sentences) in the original web page DOM, especially since the TTS is performed remotely (Hugging Face) and may not inherently provide the fine-grained timing information the competitor's local model did.

## Proposed Algorithm: Server-Side Timestamp Generation & Client-Side Application

We will aim to generate timestamps server-side within the Supabase Edge Function (`TTS Proxy & Timestamp Gen.`) and send this structured data to the client (Content Script) for rendering.

**Assumptions:**

*   The Kokoro-82M model or the HF Inference Endpoint API provides *some* form of timing information. This could be:
    *   **Ideal:** Word-level start/end times (similar to competitor).
    *   **Acceptable:** Phoneme timings, sentence timings, or alignment information between input text and output audio frames.
    *   **Worst Case:** No timing info beyond the total audio duration.
*   If timing info is insufficient, the Edge Function will need to perform Speech-to-Text (STT) alignment using an efficient model (e.g., Whisper running on the same HF endpoint or a separate, faster alignment model) to generate the required timestamps. This adds complexity and latency.

**Algorithm Steps:**

1.  **Text Segmentation (Client - Content Script):**
    *   Before sending text to the backend, the Content Script performs initial segmentation, primarily into sentences. This uses standard browser APIs (`Intl.Segmenter`) or reliable regex for robustness.
    *   Each sentence (or logical block) is assigned a unique temporary ID.
    *   The Content Script stores a mapping of these IDs to the corresponding DOM elements/ranges representing those sentences on the page.
    *   **Rationale:** Sending pre-segmented text helps the backend correlate timestamps back to meaningful units.

2.  **TTS Request & Timestamp Generation (Backend - Edge Function):**
    *   The SW sends the segmented text (with IDs) to the `TTS Proxy` Edge Function.
    *   The Edge Function calls the HF Inference Endpoint with the text.
    *   **Timestamp Acquisition:**
        *   **If HF provides word/sentence timestamps:** Extract and format them, associating them with the incoming sentence IDs.
        *   **If HF provides SSML `<mark>` support:** Inject `<mark name="sent_ID_word_INDEX"/>` tags into the input text before sending it to HF. The HF endpoint *might* return events or metadata correlating these marks with audio timing. (Needs verification with Kokoro/HF Endpoint docs).
        *   **If HF provides only audio:** Perform forced alignment (STT) on the generated audio against the original text to generate word/sentence timestamps. This is the fallback, potentially using a fast alignment model.
    *   The Edge Function prepares a JSON response containing:
        *   The URL to the cached audio file (or potentially streamed data).
        *   An array of timed segments, e.g.:
            ```json
            {
              "audioUrl": "https://.../cached_audio.mp3",
              "segments": [
                { "id": "sent_1", "startTime": 0.5, "endTime": 4.2, "text": "This is the first sentence.", "words": [
                    { "text": "This", "startTime": 0.5, "endTime": 0.8 },
                    { "text": "is", "startTime": 0.8, "endTime": 1.0 },
                    // ... more words ...
                  ]
                },
                { "id": "sent_2", "startTime": 4.3, "endTime": 8.1, "text": "And the second one.", "words": [...] }
              ]
            }
            ```

3.  **Highlighting Application (Client - Content Script):**
    *   The SW receives the JSON response and forwards the `segments` array and `audioUrl` to the Content Script.
    *   The Content Script loads the audio using the Web Audio API (preferred for precise time control) or an `<audio>` element.
    *   It retrieves the DOM element mappings stored in Step 1 using the `id` from the received segments.
    *   On audio playback (`play` event):
        *   Initialize `currentSentenceIndex = -1`, `currentWordIndex = -1`.
        *   Start a `requestAnimationFrame` loop (or use `AudioWorklet` for higher precision if needed).
    *   **Inside the `requestAnimationFrame` loop:**
        *   Get the current audio playback time (`audioContext.currentTime` or `audioElement.currentTime`).
        *   **Sentence Highlighting:** Find the segment in the `segments` array where `startTime <= currentTime < endTime`. Let this be `newSentenceIndex`.
            *   If `newSentenceIndex` is different from `currentSentenceIndex`:
                *   Remove highlight class from the element corresponding to `segments[currentSentenceIndex]` (if valid).
                *   Add highlight class (e.g., `tts-highlight-sentence`) to the element corresponding to `segments[newSentenceIndex]`, potentially scrolling it into view (`scrollIntoView({behavior: 'smooth', block: 'center'})`).
                *   Update `currentSentenceIndex = newSentenceIndex`.
                *   Reset `currentWordIndex = -1` (to start word highlighting for the new sentence).
        *   **Word Highlighting (within the current sentence):**
            *   If `currentSentenceIndex` is valid, get the `words` array for that segment.
            *   Find the word in the `words` array where `startTime <= currentTime < endTime`. Let this be `newWordIndex`.
            *   If `newWordIndex` is different from `currentWordIndex`:
                *   Find the DOM Range/Node for the word within the current sentence's element (requires careful text searching or pre-calculated ranges).
                *   Remove highlight class from the element/range corresponding to `words[currentWordIndex]` (if valid).
                *   Add highlight class (e.g., `tts-highlight-word`) to the element/range corresponding to `words[newWordIndex]`.
                *   Update `currentWordIndex = newWordIndex`.
    *   **On audio end/pause:** Remove all active highlight classes.

## Alternative/Fallback: Web Speech API `onboundary`

*   If the remote TTS + timestamp generation proves too unreliable, slow, or costly, a fallback to using the browser's built-in `speechSynthesis` could be implemented.
*   **Pros:** Simpler integration, potentially lower latency for basic playback.
*   **Cons:** Voice quality varies drastically between browsers/OS, often lower than dedicated models. `onboundary` events are typically only for word boundaries and can be less reliable or precise than model-generated timestamps. Custom voice selection is limited.
*   **Implementation:** Use `speechSynthesis.speak()` and listen for the `onboundary` event. The event provides `charIndex`, which needs to be mapped back to word/sentence elements in the DOM.

## SSML `<mark>` Path

*   If the HF endpoint supports SSML input and provides timing feedback for `<mark>` tags, this is a promising approach.
*   **Input Modification:** Wrap sentences and potentially words with `<mark name="unique_id"/>` before sending to TTS.
*   **Output Handling:** The API needs to provide events or metadata mapping these mark names to audio timestamps.
*   **Client Logic:** Similar to the main algorithm, but relies on the mark timings provided by the API instead of a separate `segments` array.

## Competitor Comparison

*   The competitor leveraged local model inference, giving them direct access to precise token/word timestamps generated during synthesis.
*   Our cloud-based approach necessitates a mechanism (API feature, SSML, or server-side alignment) to bridge the gap and obtain comparable timing information for accurate highlighting.

**Conclusion:** The primary technical risk is obtaining accurate, low-latency word/sentence timestamps from the remote TTS service. Plan A is direct API support, Plan B is SSML marks, Plan C is server-side alignment (fallback). Client-side logic remains similar but depends heavily on the quality of timestamps received. 