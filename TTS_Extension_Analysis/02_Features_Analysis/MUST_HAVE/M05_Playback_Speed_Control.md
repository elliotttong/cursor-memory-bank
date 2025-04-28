---
feature_code: "M05"
feature_name: "Playback Speed Control"
priority: "Must Have"
analysis_date: "2025-04-28"
status: "in-progress"
---

# M05: Playback Speed Control

## Feature Description & Goal
Playback Speed Control allows users to adjust the speed of audio playback, enabling faster or slower listening while maintaining intelligibility and, ideally, natural pitch. The goal is to understand how high-speed playback (as advertised by Speechify) is achieved while maintaining audio quality and sync, and to compare the technical approaches of leading TTS extensions.

---

## Competitor Analysis

### Speechify
- **Code Evidence:**
  - The extension includes a `timestretch_bg.wasm` file, referenced in the manifest as a web-accessible resource. This indicates the use of a WebAssembly (WASM) module for real-time audio time-stretching.
  - WASM modules are commonly used for high-performance digital signal processing (DSP) in the browser, enabling playback speed changes **without altering pitch**.
  - The main background script (`background/main.js`) is very large and likely handles audio processing, but the presence of the WASM module and the need for high-speed playback strongly indicate that playback speed is handled via WASM-based time-stretching, not just by setting `audio.playbackRate`.
  - No direct evidence in the UI or Houdini code for speed control, further supporting that the heavy lifting is done in the background with WASM.
- **Summary:**
  - Speechify achieves high-speed playback with pitch preservation using a custom WASM time-stretching engine, allowing for playback speeds well above 2x without the "chipmunk" effect.

### NaturalReader
- **Code Evidence:**
  - In `background/audio-player.js`:
    ```js
    e.playerSetPlaybackRate=function(a,n,r){e.audioPlayer.playbackRate=a.rate}
    ```
    - This sets the `playbackRate` property of the native `Audio` element.
  - No evidence of custom DSP or WASM modules for time-stretching.
- **Summary:**
  - NaturalReader uses the browser's built-in playbackRate property. This is simple and efficient, but does not preserve pitch at high speeds.

### ReadVox
- **Code Evidence:**
  - In `src/offscreen/index.js`, the following is set when playing audio:
    ```js
    Se.playbackRate = e.data.playbackRate
    ```
    - This sets the playback rate on an `Audio` element.
  - No evidence of custom DSP, WASM, or advanced time-stretching.
- **Summary:**
  - ReadVox uses the browser's native playbackRate property. No advanced time-stretching or pitch correction.

---

## Comparison Table

| Competitor   | Speed Control Method         | Pitch Preservation | Max Quality at High Speed | Implementation Complexity |
|--------------|-----------------------------|--------------------|--------------------------|--------------------------|
| Speechify    | WASM time-stretching (DSP)  | Yes                | High                     | High                     |
| NaturalReader| HTML5 Audio playbackRate     | No                 | Medium                   | Low                      |
| ReadVox      | HTML5 Audio playbackRate     | No                 | Medium                   | Low                      |

---

## Pros and Cons

### WASM Time-Stretching (Speechify Approach)
**Pros:**
- High-quality, pitch-preserved playback at any speed (1.5x, 2x, 3x+)
- Professional, "natural" sound at high speeds

**Cons:**
- Requires custom DSP code (WASM or similar)
- More complex to implement and maintain
- Slightly higher CPU usage

### HTML5 Audio playbackRate (NaturalReader, ReadVox)
**Pros:**
- Simple, native, and efficient
- Easy to implement (one line of code)
- Works in all browsers

**Cons:**
- Pitch increases with speed (chipmunk effect)
- Audio quality degrades at high speeds (>2x)
- Not suitable for "professional" TTS experience

---

## Recommendation for Chrome Extension TTS Project
- **For best-in-class, high-speed playback (like Speechify):**
  - **Strongly recommended:** Implement a WASM-based time-stretching engine. This is the only approach that delivers high-quality, pitch-preserved playback at 2x, 3x, or higher speeds, matching the professional experience of Speechify.
  - Use a library such as [SoundTouchJS](https://github.com/cutterbl/SoundTouchJS) or port a proven DSP library (e.g., Rubber Band, SoundTouch) to WASM.
  - This approach is more complex but is essential for a premium, competitive TTS product.
- **If simplicity is more important than quality:**
  - Use the browser's native `audio.playbackRate` property and accept the pitch shift at high speeds.

---

## Implementation Guidance: WASM Time-Stretching

### 1. **Choose a WASM DSP Library**
- [SoundTouchJS](https://github.com/cutterbl/SoundTouchJS): JavaScript/WASM port of the SoundTouch time-stretching library.
- [Rubber Band Library](https://breakfastquay.com/rubberband/): Can be compiled to WASM for advanced time-stretching.
- Or use your own WASM module if you have DSP expertise.

### 2. **Integrate with Audio Pipeline**
- **Step 1:** Decode your audio (e.g., from TTS API or local synthesis) to a raw PCM buffer (Float32Array).
- **Step 2:** Pass the buffer through the WASM time-stretching engine, specifying the desired playback rate.
- **Step 3:** Play the processed buffer using the Web Audio API (e.g., via AudioBufferSourceNode).

**Example (using SoundTouchJS):**
```js
import { SimpleFilter } from 'soundtouchjs';

// Assume you have a Float32Array 'pcmData' and a sample rate
const filter = new SimpleFilter(pcmData, sampleRate);
filter.tempo = 2.0; // 2x speed, pitch preserved

const processed = [];
let samples;
while ((samples = filter.extract(4096)).length > 0) {
  processed.push(...samples);
}

// Convert processed to Float32Array and play with Web Audio API
const audioCtx = new AudioContext();
const buffer = audioCtx.createBuffer(1, processed.length, sampleRate);
buffer.copyToChannel(new Float32Array(processed), 0);
const source = audioCtx.createBufferSource();
source.buffer = buffer;
source.connect(audioCtx.destination);
source.start();
```

### 3. **Integrate in Chrome Extension**
- Use an offscreen document or background script to run the WASM processing (as Speechify does).
- Ensure the WASM module is included as a web-accessible resource in your manifest.
- Use message passing to control playback speed from the UI.

### 4. **Test and Optimize**
- Test at various speeds (1.5x, 2x, 3x+) for quality and CPU usage.
- Profile performance on different devices.
- Consider fallback to native playbackRate if WASM is not supported.

---

**Why this approach?**
- Only WASM-based time-stretching delivers the high-speed, natural, pitch-preserved playback that users expect from a premium TTS extension.
- This is the technical foundation for matching or exceeding Speechify's user experience.

---

**Choose WASM time-stretching for a professional, competitive TTS product. Use HTML5 playbackRate only for simple, non-premium use cases.**

---

| Approach         | Quality at High Speed | Pitch Preservation | Complexity | Example Use Case         |
|------------------|----------------------|--------------------|------------|--------------------------|
| WASM DSP         | High                 | Yes                | High       | Speechify, pro TTS       |
| HTML5 playbackRate| Medium/Low           | No                 | Low        | Simpler extensions       |

---

**Choose WASM time-stretching if you want to match Speechify's "super-fast, natural" playback. Choose HTML5 playbackRate for a quick, simple solution.** 