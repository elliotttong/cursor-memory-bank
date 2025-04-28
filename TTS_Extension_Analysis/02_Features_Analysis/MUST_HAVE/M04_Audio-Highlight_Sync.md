---
feature_code: "M04"
feature_name: "Audio-Highlight Sync"
priority: "Must Have"
analysis_date: "2025-04-28"
status: "in-progress"
---

# M04: Audio-Highlight Sync

## Feature Description & Goal
Audio-Highlight Sync is the mechanism that ensures the correct word or sentence is visually highlighted in real time as the corresponding audio is played. This is critical for accessibility, comprehension, and user experience. The goal is to determine the core technique used to synchronize the precise audio playback position with the correct word and sentence highlight, analyzing potential use of API timing data/metadata, `speechSynthesis` boundary events, or other custom timing mechanisms.

---

## Competitor Analysis

### Speechify
- **Mechanism:**
  - Uses **timing metadata** (likely from the TTS API or pre-processing) that maps audio time to word/sentence positions.
  - **Internal state management** (hooks like `useTime`, `useProgress`, `seekTo`) tracks playback position.
  - **Highlight updates** are triggered by custom events and state changes, with CSS Houdini variables updated as playback progresses.
  - **Polling or event-driven updates** are likely used to map the current playback time to the correct highlight, but the exact polling interval or event is abstracted.
- **Code Evidence:**
  - `houdini.js` references custom CSS properties for highlight positions, updated in real time.
  - `init-OQBBM3IP.js` uses hooks and state for playback and highlight sync.
  - No use of browser-native `onboundary` or `timeupdate` events.

### NaturalReader
- **Mechanism:**
  - Uses the **HTML5 `<audio>` element** for playback.
  - **Polling of `audio.currentTime`** is the most likely mechanism for sync.
  - **Precomputed timing data** (word/sentence start times) is mapped to the current playback time.
  - **DOM manipulation** is used to update highlights as the audio plays.
- **Code Evidence:**
  - UI and CSS show toggling of highlight classes, but no direct timing sync code is visible.
  - No use of browser-native `onboundary` or speech events.

### ReadVox
- **Mechanism:**
  - Uses the **Web Audio API** for playback of locally synthesized audio.
  - **Timing data** is likely generated during synthesis (e.g., phoneme/word boundaries).
  - **Playback position** is tracked using the Web Audio API's `AudioContext.currentTime` or similar.
  - **Highlight updates** are mapped from playback time to timing data.
- **Code Evidence:**
  - Audio is generated as a Float32Array buffer and played using the Web Audio API.
  - No direct evidence of timing sync code, but this is the standard approach for local synthesis.

---

## Timing Mechanisms in Practice

| Competitor   | Timing Mechanism                | Highlight Update Trigger         | Data Source         |
|--------------|---------------------------------|----------------------------------|---------------------|
| Speechify    | Custom timing metadata + hooks  | State/events, likely polling     | TTS API/preprocess  |
| NaturalReader| `audio.currentTime` polling     | setInterval/requestAnimationFrame| Precomputed timing  |
| ReadVox      | Web Audio API playback time     | setInterval/requestAnimationFrame| Synthesis timing    |

- **None of the competitors use browser-native speech events (`onboundary`, `timeupdate`) for sync.**
- All rely on **timing metadata** and **polling or event-driven updates** to synchronize highlights.

---

## Example: Polling and Mapping Logic

```js
// Example: Polling audio position and updating highlight
const timingMap = [
  { start: 0.0, end: 0.5, word: 'Hello' },
  { start: 0.5, end: 1.0, word: 'world' },
  // ...
];

function updateHighlight(currentTime) {
  const current = timingMap.find(t => currentTime >= t.start && currentTime < t.end);
  if (current) {
    highlightWord(current.word);
  }
}

// For HTML5 Audio
const audio = document.getElementById('audio');
setInterval(() => {
  updateHighlight(audio.currentTime);
}, 50); // 20 FPS

// For Web Audio API
function pollWebAudio(audioCtx, startTime) {
  function poll() {
    const currentTime = audioCtx.currentTime - startTime;
    updateHighlight(currentTime);
    requestAnimationFrame(poll);
  }
  poll();
}
```

---

## Pros and Cons Table

| Approach                | Pros                                                                 | Cons                                                                |
|-------------------------|----------------------------------------------------------------------|---------------------------------------------------------------------|
| **Speechify (Timing Metadata + State)** | - High accuracy<br>- Smooth sync<br>- Works with custom TTS APIs | - Requires timing metadata<br>- More complex to implement           |
| **NaturalReader (Audio Time Polling)** | - Simple<br>- Leverages native audio element<br>- Easy to implement | - Less precise<br>- May drift on long audio<br>- Needs timing data  |
| **ReadVox (Synthesis Timing + Web Audio API)** | - Full control<br>- Can be very accurate<br>- Works offline/local | - Most complex<br>- Requires custom timing extraction and mapping    |

---

## Recommendation for Chrome Extension TTS Project
- **Preferred Approach:**
  - Use timing metadata (word/sentence start times) from the TTS API or generate it during synthesis.
  - As audio plays, poll the playback position (HTML5 Audio: `audio.currentTime`, Web Audio API: `audioCtx.currentTime`) and map to the corresponding word/sentence using a timing map.
  - Update highlights in real time using efficient polling (e.g., `setInterval` at 20–60 FPS or `requestAnimationFrame`).
  - Debounce highlight updates to avoid excessive DOM changes.
  - Provide fallback for cases where timing data is unavailable (e.g., highlight by sentence or paragraph).
  - Test for drift and edge cases (e.g., seeking, pausing, network hiccups).
- **Why this approach?**
  - It matches the best-in-class competitors and is robust for both cloud and local TTS.
  - It does not rely on browser-native speech events, which are not available for remote/cloud TTS or custom synthesis.

---

**By following this approach, your extension will deliver accurate, smooth, and reliable audio-highlight synchronization, matching or exceeding the best-in-class TTS extensions.**

---

## Options for Audio-Highlight Sync with Kokoro-82M

To achieve accurate and efficient audio-highlight synchronization using Kokoro-82M (which does not natively provide timing metadata), consider the following approaches:

### 1. Forced Alignment (Post-process)
**Workflow:**
- Synthesize audio with Kokoro-82M.
- Use a forced aligner (e.g., Montreal Forced Aligner, Aeneas) to align the original text to the audio.
- Use the resulting timing map for highlight sync.
**Pros:**
- High accuracy (word/phoneme level).
- Works with any TTS output, no model changes.
**Cons:**
- Adds 2–20 seconds of processing per paragraph (see [MFA performance](https://montreal-forced-aligner.readthedocs.io/en/latest/performance.html)).
- Not suitable for instant/real-time playback.
- Requires running a Python process or web service for alignment.

### 2. Heuristic Alignment via Audio Analysis
**Workflow:**
- Synthesize audio with Kokoro-82M.
- Use lightweight audio analysis (e.g., energy/volume spikes, silence detection) to segment the audio.
- Heuristically map segments to words/sentences based on text length and detected pauses.
**Pros:**
- Fast (sub-second for short texts).
- No external dependencies.
**Cons:**
- Only approximate sync (may drift, especially with complex sentences).
- Not robust for all languages/voices.

### 3. Model-Internal Alignment Extraction
**Workflow:**
- Modify or extend Kokoro-82M to expose its internal duration/phoneme alignment (if available).
- Use this data to map text to audio time.
**Pros:**
- Real-time or near-real-time sync.
- Most accurate if model supports it.
**Cons:**
- Requires ML expertise and code changes to Kokoro-82M.
- May not be feasible if the model does not expose alignment info.

### 4. Hybrid (Chunked Synthesis + Heuristic)
**Workflow:**
- Split text into small chunks (e.g., 1–2 words or sentences).
- Synthesize each chunk separately with Kokoro-82M.
- Concatenate audio and build a timing map based on chunk durations.
**Pros:**
- Fast, parallelizable.
- Simple to implement.
**Cons:**
- May introduce unnatural pauses at chunk boundaries.
- Not as smooth as full-sentence synthesis.

---

**Recommendation:**
- Use **forced alignment** for high-accuracy sync in batch/preprocessing scenarios.
- Use **heuristic alignment** or **chunked synthesis** for instant feedback or short texts, accepting lower accuracy.
- For advanced/real-time needs, explore extracting alignment from Kokoro-82M's internals if feasible.

For more details, see the [Kokoro-82M model card](https://huggingface.co/hexgrad/Kokoro-82M) and [Montreal Forced Aligner documentation](https://montreal-forced-aligner.readthedocs.io/en/latest/). 