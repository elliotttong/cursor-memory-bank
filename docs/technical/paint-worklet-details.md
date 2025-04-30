# Houdini Paint Worklet Details (`highlight-painter.js`)

This document provides details about the implementation of the CSS Houdini Paint Worklet used for rendering text highlights.

## 1. Purpose

The Paint Worklet (`highlight-painter.js`) is responsible for drawing the visual highlights for the currently spoken word, the current sentence, and the hovered sentence onto a dedicated overlay element (`#kokoro-highlight-overlay`). It offers better performance compared to manipulating potentially thousands of individual span background colors directly, especially during rapid updates like word-by-word highlighting.

## 2. Registration

The worklet is registered in `coreSetup.js` using:

```javascript
if ('paintWorklet' in CSS) {
    CSS.paintWorklet.addModule('page-scripts/highlight-painter.js')
        .then(() => console.log('Kokoro highlighter paint worklet registered.'))
        .catch(err => console.error('Error registering paint worklet:', err));
} else {
    console.warn('CSS Paint Worklet API not supported.');
}
```

The overlay element in `coreSetup.js` (or injected via `domUtils.js`) uses CSS like `background-image: paint(kokoro-highlighter);` to utilize this worklet.

## 3. Input Properties

The worklet reads several CSS Custom Properties defined on the overlay element. These properties are updated by `coordManager.js`.

*   `--kokoroHighlightWordInfo`: String containing comma-separated coordinates (`x,y,width,height`) for the currently spoken word's bounding rectangles.
*   `--kokoroHighlightSentenceInfo`: String containing comma-separated coordinates for the current sentence's bounding rectangles.
*   `--kokoroHoverSentenceInfo`: String containing comma-separated coordinates for the hovered sentence's bounding rectangles.
*   `--kokoroScrollX`: The current horizontal scroll offset (`window.scrollX`) in pixels.
*   `--kokoroScrollY`: The current vertical scroll offset (`window.scrollY`) in pixels.
*   `--kokoroHighlightWordColor`, `--kokoroHighlightSentenceColor`, `--kokoroHoverColor`: Base RGBA color strings for the different highlight types (defaults provided during registration in `coreSetup.js`).
*   `--kokoroHighlightWordColorDark`, `--kokoroHighlightSentenceColorDark`, `--kokoroHoverColorDark`: Alternative darker RGBA color strings used when the underlying text element's background is detected as light.
*   `--kokoroHighlightRadius`: Border radius for the highlight rectangles.

## 4. The `paint()` Method

This is the core method executed by the browser's rendering engine whenever the overlay needs repainting (e.g., when its size changes or its custom properties are updated).

**Signature:** `paint(ctx, geom, properties)`

*   `ctx`: A 2D rendering context (similar to the Canvas API) for drawing.
*   `geom`: An object containing the geometry (width, height) of the element being painted.
*   `properties`: An object allowing access to the element's computed styles, including custom properties.

**Logic:**

1.  **Read Properties:** Retrieves the values of all `--kokoro...` custom properties using `properties.get('--kokoroPropertyName').toString()`. Includes coordinate strings, colors, radius, and scroll offsets.
2.  **Parse Coordinates:** Splits the coordinate strings (e.g., `--kokoroHighlightWordInfo`) by commas and groups them into arrays of rectangle data `[x, y, width, height]`.
3.  **Parse Scroll Offsets:** Parses the `--kokoroScrollX` and `--kokoroScrollY` values.
4.  **Determine Background Brightness (Heuristic):**
    *   Attempts to get the background color of the element *underneath* the center of the overlay using a sampling approach (this is complex and potentially unreliable across all browser security contexts; implementation might vary or be simplified). A simpler approach might involve reading a property set on the `body` or a designated container.
    *   Calculates the perceived brightness of the background color.
    *   Selects either the standard highlight colors or the `...Dark` variants based on the calculated brightness (uses darker highlights on light backgrounds for better contrast).
5.  **Draw Highlights:**
    *   Iterates through the parsed coordinates for Hover, Sentence, and Word highlights.
    *   For *each* rectangle `[x, y, width, height]`:
        *   **Adjusts coordinates for scroll:** Calculates `drawX = x - scrollX` and `drawY = y - scrollY`.
        *   Sets the appropriate `fillStyle` (using the brightness-adjusted color).
        *   Calls a helper function (e.g., `roundRect`) to draw a filled rectangle with rounded corners at `(drawX, drawY)` with the given `width`, `height`, and `--kokoroHighlightRadius`.

## 5. Helper Functions

*   **`parseCoords(coordString)`:** Takes the comma-separated string and returns an array of `[x, y, width, height]` arrays.
*   **`roundRect(ctx, x, y, width, height, radius)`:** A utility function to draw a rectangle with rounded corners using the 2D context API (e.g., using `beginPath`, `moveTo`, `lineTo`, `arcTo`, `closePath`, `fill`).
*   **`brightnessByColor(color)` / `parseColor(colorString)`:** Functions to parse CSS color strings (like `rgb(...)` or `rgba(...)`) and calculate their perceived brightness (often using a weighted average of R, G, B components).

## 6. Performance Considerations

*   The Paint Worklet runs off the main thread, preventing highlighting logic from blocking user interactions.
*   Updating CSS Custom Properties is generally more performant than directly manipulating styles on many DOM elements.
*   The complexity of drawing and coordinate parsing within the `paint()` method should be kept minimal to ensure smooth rendering. 