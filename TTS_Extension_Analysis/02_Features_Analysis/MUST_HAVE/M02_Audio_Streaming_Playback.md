---
feature_code: "M02"
feature_name: "Audio Streaming Playback"
priority: "Must Have"
analysis_date: "2025-04-28"
status: "in-progress"
---

# M02: Audio Streaming Playback

## Feature Description
Audio Streaming Playback enables the extension to play TTS audio as it is received from the API, providing a responsive and seamless listening experience. This includes support for progressive streaming, buffering, playback controls (play, pause, seek), robust error handling, and compatibility with various audio formats. The goal is to match or exceed the smoothness and reliability of competitors like Speechify.

---

## Competitor Evidence

### Speechify
- **Playback State Management:** Uses React hooks to manage play, pause, buffering, and progress states.
- **Buffering & Streaming:** Handles buffering and error states, suggesting progressive streaming and robust error handling.
- **Playback Controls:** UI supports play, pause, seek, and buffering/loading states.
- **Likely Uses:** HTML5 Audio or Web Audio API for playback, supporting standard formats (mp3, wav, ogg).

### NaturalReader
- **Playback State Management:** UI elements and CSS toggle play/pause icons and overlays based on playback state.
- **Buffering & Streaming:** Loading overlays and progress bars suggest buffering/loading is handled in JS.
- **Playback Controls:** Uses HTML5 `<audio>` element for playback.
- **Audio Format Support:** Implied support for standard formats via `<audio>`.

### ReadVox
- **Playback State Management:** Synthesis and playback handled in offscreen workers.
- **Buffering & Streaming:** Audio generated locally as Float32Array buffer, likely played with Web Audio API.
- **Playback Controls:** Full control over playback and buffering.
- **Audio Format Support:** Raw PCM/Float32Array buffers.

---

## Implementation Approaches

### 1. Chunked/Progressive Streaming
- **HTML5 Audio Element:**
  - Use if the API provides a streamable URL. The browser handles buffering and playback.
  - Example:
    ```js
    const audio = new Audio();
    audio.src = 'https://api.example.com/tts/stream?text=...';
    audio.play();
    ```
- **Fetch Streaming + Web Audio API:**
  - Use for APIs that return audio as a stream. Buffer and decode chunks manually.
  - Example:
    ```js
    const response = await fetch('https://api.example.com/tts/stream?text=...');
    const reader = response.body.getReader();
    const audioCtx = new AudioContext();
    let audioBuffer = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      audioBuffer.push(value);
      // Optionally decode and play chunks as they arrive
    }
    const fullBuffer = new Uint8Array(audioBuffer.flat());
    const decoded = await audioCtx.decodeAudioData(fullBuffer.buffer);
    const source = audioCtx.createBufferSource();
    source.buffer = decoded;
    source.connect(audioCtx.destination);
    source.start();
    ```
- **Considerations:**
  - HTML5 Audio is simpler but less flexible for custom streaming logic.
  - Web Audio API allows for more granular control, including real-time effects and visualization.

### 2. Advanced Error Handling
- **Types of Errors:** Network errors, partial loads, unsupported formats, playback errors.
- **Strategies:**
  - Retry logic with exponential backoff.
  - Graceful fallback (e.g., download full audio, use a different format, or show an error message).
  - User feedback with clear error messages and actionable suggestions.
  - Partial buffer recovery to resume from the last buffered point if possible.
- **Code Example:**
    ```js
    async function playWithRetry(url, maxRetries = 3) {
      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          audio.src = url;
          await audio.play();
          return;
        } catch (e) {
          attempt++;
          if (attempt >= maxRetries) throw e;
          await new Promise(res => setTimeout(res, 1000 * attempt));
        }
      }
    }
    ```

### 3. UI/UX for Playback Controls
- **Responsive Feedback:**
  - Show loading/buffering indicators when audio is not ready.
  - Disable controls (play, seek) during buffering or error states.
  - Provide visual feedback for current playback position and buffered range.
- **Accessibility:**
  - Ensure all controls are keyboard accessible and have ARIA labels.
  - Provide screen reader feedback for state changes (e.g., "Buffering", "Playback error").
- **Example UI States:**
  - Buffering: Show spinner or progress bar.
  - Error: Show error message and retry button.
  - Playing: Show pause/stop and seek controls.
- **Code Example:**
    ```jsx
    {isBuffering && <div className="audio-buffering">Buffering...</div>}
    {error && <div className="audio-error">{error.message} <button onClick={retry}>Retry</button></div>}
    <audio ref={audioRef} onPlay={...} onPause={...} onError={...} />
    ```

### 4. Audio Format Compatibility
- **Detection:**
  - Use `audio.canPlayType()` to check browser support for a given format.
  - Example:
    ```js
    const audio = document.createElement('audio');
    if (audio.canPlayType('audio/mpeg')) { /* use mp3 */ }
    else if (audio.canPlayType('audio/ogg')) { /* use ogg */ }
    else { /* fallback or error */ }
    ```
- **Fallback Strategies:**
  - Request multiple formats from the API if possible.
  - Provide user feedback if no supported format is available.
- **Browser Support:**
  - Most modern browsers support `audio/mpeg` (mp3), `audio/wav`, and `audio/ogg`.
  - Test on all target browsers to ensure compatibility.

---

## Pros and Cons of Each Approach

| Approach                | Pros                                                                 | Cons                                                                |
|-------------------------|----------------------------------------------------------------------|---------------------------------------------------------------------|
| **Speechify (Hooks + HTML5 Audio/Web Audio API)** | - Smooth UX<br>- Robust error handling<br>- Supports all major formats | - Streaming logic abstracted<br>- Debugging can be harder           |
| **NaturalReader (HTML5 Audio)** | - Simple, reliable<br>- Native browser support<br>- Easy to control | - Limited to supported formats<br>- Streaming logic not explicit     |
| **ReadVox (Web Audio API, Local Synthesis)** | - Full control over audio<br>- Works offline<br>- Can process raw buffers | - More complex<br>- Must handle buffering and playback manually      |

---

## Final Recommendation
- **For cloud/streamed audio:** Use the HTML5 Audio element for playback, as done by NaturalReader and likely Speechify. This approach is simple, reliable, and leverages native browser support for common audio formats (e.g., mp3, wav, ogg). It is ideal for playing audio files or streams received from a remote TTS API.
- **For local synthesis or advanced control:** Use the Web Audio API to play raw PCM buffers, as in ReadVox. This is necessary if you generate audio on-device (e.g., with ONNX or Kokoro-82M) or want to add real-time effects, visualization, or custom buffering logic.
- **Hybrid approach:** Support both playback methods, selecting dynamically based on the audio source:
  - Use HTML5 Audio for remote/cloud-generated audio (URL or stream).
  - Use Web Audio API for locally synthesized or custom-generated audio buffers.
- **General best practices:**
  - Provide clear UI feedback for loading, buffering, and playback states.
  - Implement robust error handling for both streaming and local playback.
  - Support seeking and progressive playback for long audio files.
  - Document the streaming and playback logic clearly for maintainability.
  - Test with various audio formats and network conditions to ensure reliability.
  - Plan for future integration of additional features like highlighting sync and speed control.

---

**By following this comprehensive approach, your extension will deliver a robust, user-friendly, and reliable audio streaming playback experience that matches or exceeds leading competitors.**
 