# Highlighting Synchronization & Data Flow

This document details the technical implementation of the text highlighting synchronization with audio playback in the Chrome TTS Extension MVP.

## 1. Overview

The system uses a combination of JavaScript modules, CSS Custom Properties, and a CSS Houdini Paint Worklet to achieve synchronized highlighting.

*   **Text Processing:** The content script extracts text, segments it into sentences and words/punctuation, and wraps these segments in `<span>` elements with unique IDs (`s-X-wY`).
*   **Coordinate Calculation:** The `coordManager.js` module calculates the bounding rectangles (`getClientRects`) for these spans.
*   **CSS Custom Properties:** Coordinates for the currently spoken word, sentence, and hovered sentence are stored in CSS custom properties on a dedicated overlay element (`#kokoro-highlight-overlay`). Scroll offsets are also stored as CSS properties.
*   **Houdini Paint Worklet (`highlight-painter.js`):** This worklet reads the CSS custom properties (coordinates and scroll offsets) and paints the highlight rectangles directly onto the overlay element in the correct positions, adjusted for scrolling.
*   **Synchronization Loop (`syncEngine.js`):** A core loop running via `requestAnimationFrame` is responsible for:
    *   Updating scroll offset properties.
    *   Updating hover highlight coordinates based on user interaction state.
    *   Finding the currently spoken word based on audio playback time (`audioPlayer.currentTime`) when playing.
    *   Updating the CSS properties for the active word and sentence coordinates.
    *   Ensuring coordinate updates continue even when paused (using last known active elements).

## 2. Core Modules & Responsibilities

*   **`pageState.js`:** Manages the shared state of the page script (e.g., `isPlaying`, `currentSentenceIndex`, `lastWordElement`, `hoveredSentenceId`).
*   **`textProcessor.js`:** Extracts text content from the page and segments it.
*   **`spanInjector.js`:** Wraps the segmented text in `<span>` elements with unique IDs.
*   **`coordManager.js`:** Calculates coordinates for spans and updates the CSS Custom Properties read by the Paint Worklet. Handles clearing highlights.
*   **`syncEngine.js`:** Runs the main `requestAnimationFrame` loop (`pollingLoop`) to synchronize audio time with highlight coordinate updates. Manages the loop's lifecycle.
*   **`playbackEngine.js`:** Handles audio playback using HTML5 `<audio>`, manages playback state (`play`, `pause`, `ended`), fetches audio from the background script, and interacts with `pageState` and `syncEngine`.
*   **`userEvents.js`:** Attaches event listeners for hover and click interactions on sentence spans, updating state (`hoveredSentenceId`) or triggering playback (`initiateTTS`).
*   **`domUtils.js`:** Handles DOM manipulation like injecting the UI widget and the highlight overlay.
*   **`backgroundComms.js`:** Facilitates communication with the background script (requesting TTS/timestamps).
*   **`highlight-painter.js`:** The CSS Paint Worklet that reads CSS properties and draws the highlights.
*   **`entry.js`:** Initializes all page script modules and sets up event listeners.

## 3. State Management (`pageState.js`)

Key variables tracked:

*   `isPlaying`: Boolean indicating if audio is currently playing.
*   `currentSentenceIndex`: Number, the index of the sentence currently being spoken or last spoken. (-1 if stopped/idle).
*   `currentWordTimestamps`: Array of objects `{ id, start, end }` for the words in the `currentSentenceIndex`.
*   `audioPlayer`: The HTML5 `<audio>` element instance.
*   `lastWordElement`: The DOM element (`<span>`) of the last word that was actively highlighted during playback. Used to maintain word highlight when paused.
*   `hoveredSentenceId`: String (e.g., `s-X`), the ID of the sentence currently being hovered over, or `null`.
*   `animationFrameId`: The ID returned by `requestAnimationFrame`, used to control the `pollingLoop`. `null` if the loop is not running.
*   `nextAudioData`: Object containing pre-fetched audio data/timestamps for the next sentence.

## 4. Initialization Flow

1.  **`entry.js` waits for `DOMContentLoaded`**.
2.  **`coreSetup.js` registers CSS properties** (`--kokoro...`) and the **`highlight-painter.js` Paint Worklet**.
3.  **`domUtils.js` injects the UI widget** and the crucial **`#kokoro-highlight-overlay`** element.
4.  **`textProcessor.js` extracts and segments text**.
5.  **`spanInjector.js` wraps segments** in spans with IDs.
6.  **`userEvents.js` attaches `mouseover`, `mouseout`, and `click` listeners** to the sentence spans (`[data-sentence-id]`).
7.  Initial state is set (e.g., `currentSentenceIndex = -1`, `isPlaying = false`).

## 5. The Polling Loop (`syncEngine.js`)

The `pollingLoop` function is the heart of the visual synchronization.

*   **Lifecycle:**
    *   Started by `startSyncLoop()` (called when playback begins via `handleAudioPlay`, or **when a hover event occurs while the loop is stopped**).
    *   Runs continuously using `requestAnimationFrame`.
    *   Stopped *only* by `stopSyncLoop()` which is called when:
        *   Playback finishes completely (`handleAudioEnded`).
        *   Playback is explicitly stopped (`stopPlaybackAndResetState`).
        *   An error occurs (`handleAudioError`).
    *   Also stops itself if it detects an idle state (not playing AND no active highlights to maintain AND not hovering).
    *   **Crucially, it is NOT stopped on pause (`handleAudioPause`)**.
*   **Operations on Every Frame:**
    1.  Reads `window.scrollX` / `window.scrollY`.
    2.  Updates `--kokoroScrollX` and `--kokoroScrollY` CSS properties on the overlay.
    3.  Calls `updateHoverHighlightCoordinates()` which reads `state.hoveredSentenceId` and updates `--kokoroHoverSentenceInfo` accordingly.
*   **Highlight Updates (Conditional Logic within the loop):**
    1.  **Word Highlight:**
        *   *If `state.isPlaying`*: Iterates through `state.currentWordTimestamps`, finds the word matching `state.audioPlayer.currentTime`, gets its element by ID, stores the element in `state.lastWordElement`, and creates a `segment` object for it.
        *   *If `!state.isPlaying` (Paused)*: Checks if `state.lastWordElement` exists and is still in the DOM. If yes, creates a `segment` object using `state.lastWordElement`.
        *   *Otherwise*: `segment` remains `null`.
        *   Calls `updateWordHighlightCoordinates(segment)` which updates `--kokoroHighlightWordInfo`.
    2.  **Sentence Highlight:**
        *   Reads `state.currentSentenceIndex`.
        *   Calls `updateSentenceHighlightCoordinates(state.currentSentenceIndex)` which updates `--kokoroHighlightSentenceInfo`. This ensures the sentence highlight remains visible and adjusts to scroll even when paused.
*   **Loop Continuation:** Requests the next animation frame *unless* specific idle conditions are met (not playing, no active word/sentence highlight state, no active hover state).

## 6. Playback States & Transitions (`playbackEngine.js`)

*   **Play (`handlePlayPauseClick` / `initiateTTS` / `playAudio`):**
    *   Sets `state.isPlaying = true`.
    *   Calls `startSyncLoop()`.
    *   Sets `audioPlayer.src` and calls `audioPlayer.play()`.
*   **Pause (`handlePlayPauseClick` -> `audioPlayer.pause()` -> `handleAudioPause`):**
    *   Sets `state.isPlaying = false`.
    *   Updates button text.
    *   **Does NOT stop the `syncEngine` loop.**
*   **Ended (`handleAudioEnded`):**
    *   Sets `state.isPlaying = false`.
    *   Calls `stopSyncLoop()`.
    *   Checks for `state.nextAudioData` to play the next sentence or calls `stopPlaybackAndResetState`.
*   **Stop (`stopPlaybackAndResetState`):**
    *   Pauses player, removes listeners, clears `src`.
    *   Calls `stopSyncLoop()`.
    *   Resets relevant state variables (`isPlaying`, `currentSentenceIndex`, `audioPlayer`, `lastWordElement`, etc.).
    *   Calls `clearHighlights()` (deferred slightly with `setTimeout`).

## 7. Coordinate Calculation & Painting

*   **`coordManager.js`:**
    *   `updateWord/Sentence/HoverHighlightCoordinates` functions take a segment object (word) or index (sentence) or read state (hover).
    *   They find the relevant span(s) by ID.
    *   Use `element.getClientRects()` to get precise dimensions and positions relative to the viewport.
    *   Format these coordinates into a string.
    *   Update the corresponding CSS property (`--kokoroHighlightWordInfo`, `--kokoroHighlightSentenceInfo`, `--kokoroHoverSentenceInfo`) on the `#kokoro-highlight-overlay`.
*   **`highlight-painter.js` (Paint Worklet):**
    *   The `paint(ctx, geom, properties)` method runs whenever the browser needs to repaint the overlay.
    *   Reads the CSS custom properties using `properties.get('--kokoro...')`.
    *   Parses the coordinate strings.
    *   Reads the scroll offset properties (`--kokoroScrollX`, `--kokoroScrollY`).
    *   Iterates through the coordinates, **subtracts the scroll offsets** from each coordinate's `x` and `y` values to adjust for the current scroll position.
    *   Draws the highlight rectangles (`roundRect`) onto the canvas (`ctx`) at the adjusted positions.

## 8. User Interaction (`userEvents.js`)

*   **Hover (`mouseover`/`mouseout`):**
    *   Finds the parent sentence span (`data-sentence-id`).
    *   Updates `state.setState({ hoveredSentenceId: 's-X' })` on mouseover.
    *   **Calls `startSyncLoop()` on mouseover** to ensure the loop is running to process the hover state, even if playback hasn't started.
    *   Updates `state.setState({ hoveredSentenceId: null })` on mouseout.
    *   The `pollingLoop` reads `state.hoveredSentenceId` via `updateHoverHighlightCoordinates` on the next frame to update the visual hover highlight.
*   **Click (`click`):**
    *   Finds the parent sentence span and extracts the index from its ID.
    *   Calls `playbackEngine.initiateTTS(sentenceIndex)` to stop current playback (if any) and start playing from the clicked sentence. 