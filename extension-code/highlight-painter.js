// Houdini Paint Worklet for Kokoro TTS Highlighting

// --- Helper Functions (Adapted Logic) ---

/**
 * Calculates the perceived brightness of a color to determine contrast.
 * @param {string} color - Color string (rgb, rgba, hex).
 * @returns {number} Brightness value (0-255).
 */
function calculateBrightness(color = 'rgb(255, 255, 255)') {
  color = String(color);
  const isHEX = color.indexOf('#') === 0;
  const isRGB = color.indexOf('rgb') === 0;

  let r, g, b;
  if (isHEX) {
    const match = color.substring(1).match(color.length === 7 ? /(\S{2})/g : /(\S{1})/g);
    if (match) {
      r = parseInt(match[0].length === 1 ? match[0] + match[0] : match[0], 16);
      g = parseInt(match[1].length === 1 ? match[1] + match[1] : match[1], 16);
      b = parseInt(match[2].length === 1 ? match[2] + match[2] : match[2], 16);
    }
  } else if (isRGB) {
    const match = color.match(/(\d+(\.\d+)?)/g); // Match numbers including decimals for rgba
    if (match) {
      r = parseInt(match[0], 10);
      g = parseInt(match[1], 10);
      b = parseInt(match[2], 10);
    }
  }

  if (typeof r !== 'undefined') {
    // Standard perceived brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000;
  } else {
    // Default to assuming a light background if color parsing fails
    return 160; 
  }
}

/**
 * Draws a rounded rectangle path.
 * @param {CanvasRenderingContext2D} ctx - Drawing context.
 * @param {number[]} rectInfo - Array [x, y, width, height, radius].
 * Note: Simplified - does not handle matrix transforms or clipping from Speechify code yet.
 */
function drawRoundedRect(ctx, [x, y, w, h, r]) {
  if (w < 0 || h < 0) return; // Ignore invalid dimensions

  // Clamp radius
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;

  ctx.beginPath();
  if (r > 0) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); // Top-right corner
    ctx.arcTo(x + w, y + h, x, y + h, r); // Bottom-right corner
    ctx.arcTo(x, y + h, x, y, r);         // Bottom-left corner
    ctx.arcTo(x, y, x + w, y, r);         // Top-left corner
  } else {
      // Regular rectangle if radius is 0 or less
      ctx.rect(x, y, w, h);
  }
  ctx.closePath();
}

// --- Main Paint Worklet Class ---

class KokoroHighlighter {
  static get inputProperties() {
    // Define the CSS custom properties this worklet reads
    return [
      '--kokoroHighlightWordInfo',        // String: "x1,y1,w1,h1, x2,y2,w2,h2, ..."
      '--kokoroHighlightSentenceInfo',    // String: "x1,y1,w1,h1, x2,y2,w2,h2, ..."
      '--kokoroHoverSentenceInfo',        // String: "x1,y1,w1,h1, x2,y2,w2,h2, ..." (Optional)
      '--kokoroElemColor',                // String: Parent element's background color
      // '--kokoroElemMatrix',             // Omitted for now - Assuming no complex transforms
      '--kokoroSentenceHighlightColorDark', // String: Color for dark text on light bg
      '--kokoroSentenceHighlightColorLight',// String: Color for light text on dark bg
      '--kokoroWordHighlightColorDark',     // String: Color for dark text on light bg
      '--kokoroWordHighlightColorLight',    // String: Color for light text on dark bg
      '--kokoroHoverHighlightColorDark',    // String: Color for hover (Optional)
      '--kokoroHoverHighlightColorLight',    // String: Color for hover (Optional)
      '--kokoroScrollX',                  // Number: Horizontal scroll offset
      '--kokoroScrollY'                   // Number: Vertical scroll offset
    ];
  }

  /**
   * Parses the coordinate string into an array of number arrays.
   * Expected format: "x1,y1,w1,h1,x2,y2,w2,h2,..."
   * @param {CSSUnparsedValue | undefined} propValue - Property value from CSS.
   * @returns {number[][]} Array of [x, y, w, h] arrays.
   */
  parseCoordinateInfo(propValue) {
    if (!propValue) return [];
    const str = propValue.toString().trim();
    if (!str) return [];

    const numbers = str.split(',').map(Number);
    const rects = [];
    if (numbers.length % 4 !== 0) {
        console.warn('KokoroHighlighter: Coordinate info string length is not a multiple of 4:', str);
        // Attempt to use as many full rects as possible
        const usableLength = Math.floor(numbers.length / 4) * 4;
        numbers.length = usableLength; 
    }

    for (let i = 0; i < numbers.length; i += 4) {
      if (numbers.slice(i, i + 4).some(isNaN)) {
         console.warn('KokoroHighlighter: Invalid number found in coordinate info:', str);
         continue; // Skip this rect if it contains NaN
      }
      rects.push(numbers.slice(i, i + 4)); // [x, y, w, h]
    }
    return rects;
  }

  paint(ctx, size, properties) {
    // ctx: The 2D drawing context (like Canvas)
    // size: { width, height } of the element being painted
    // properties: Accessor for the inputProperties

    // --- Get Property Values --- 
    const wordRects = this.parseCoordinateInfo(properties.get('--kokoroHighlightWordInfo'));
    const sentenceRects = this.parseCoordinateInfo(properties.get('--kokoroHighlightSentenceInfo'));
    const hoverRects = this.parseCoordinateInfo(properties.get('--kokoroHoverSentenceInfo')); // Optional hover

    const elemColor = properties.get('--kokoroElemColor')?.toString() || 'rgb(255, 255, 255)'; // Default to white background

    const sentenceColorDark = properties.get('--kokoroSentenceHighlightColorDark')?.toString() || '#374b64'; // Default dark blue-gray
    const sentenceColorLight = properties.get('--kokoroSentenceHighlightColorLight')?.toString() || '#E6E8FF'; // Default light blue
    const wordColorDark = properties.get('--kokoroWordHighlightColorDark')?.toString() || '#3a72e0'; // Default blue
    const wordColorLight = properties.get('--kokoroWordHighlightColorLight')?.toString() || '#B4BBFE'; // Default light purple

    const hoverColorDark = properties.get('--kokoroHoverHighlightColorDark')?.toString() || '#555555'; // Default dark gray for hover
    const hoverColorLight = properties.get('--kokoroHoverHighlightColorLight')?.toString() || '#DDDDDD'; // Default light gray for hover

    // --- GET SCROLL OFFSETS --- 
    const scrollX = parseFloat(properties.get('--kokoroScrollX')?.toString() || '0');
    const scrollY = parseFloat(properties.get('--kokoroScrollY')?.toString() || '0');
    // --------------------------

    const defaultRadius = 6; // Standard radius for corners

    // --- Determine Contrast Mode --- 
    const useDarkHighlightColors = calculateBrightness(elemColor) >= 160; // Threshold can be adjusted
    // console.log(`Elem Color: ${elemColor}, Brightness: ${calculateBrightness(elemColor)}, Use Dark Highlights: ${useDarkHighlightColors}`); // Debug

    // --- Paint Order: Hover (Optional) -> Sentence -> Word --- 
    
    // 1. Paint Hover Highlights (if any)
    if (hoverRects.length > 0) {
      ctx.fillStyle = useDarkHighlightColors ? hoverColorDark : hoverColorLight;
      for (const rect of hoverRects) {
        // --- ADJUST COORDINATES --- 
        const yOffset = -20;
        const adjustedRect = [rect[0] + scrollX, rect[1] + scrollY + yOffset, rect[2], rect[3]];
        drawRoundedRect(ctx, [...adjustedRect, defaultRadius]);
        // --------------------------
        ctx.fill();
      }
    }

    // 2. Paint Sentence Highlights
    if (sentenceRects.length > 0) {
      ctx.fillStyle = useDarkHighlightColors ? sentenceColorDark : sentenceColorLight;
      for (const rect of sentenceRects) {
        // --- ADJUST COORDINATES --- 
        const yOffset = -20;
        const adjustedRect = [rect[0] + scrollX, rect[1] + scrollY + yOffset, rect[2], rect[3]];
        drawRoundedRect(ctx, [...adjustedRect, defaultRadius]);
        // --------------------------
        ctx.fill();
      }
    }

    // 3. Paint Word Highlights (drawn on top of sentence highlights)
    if (wordRects.length > 0) {
      ctx.fillStyle = useDarkHighlightColors ? wordColorDark : wordColorLight;
      for (const rect of wordRects) {
        // --- ADJUST COORDINATES --- 
        const yOffset = -20;
        const adjustedRect = [rect[0] + scrollX, rect[1] + scrollY + yOffset, rect[2], rect[3]];
        drawRoundedRect(ctx, [...adjustedRect, defaultRadius]);
        // --------------------------
        ctx.fill();
      }
    }
  }
}

// Register the paint worklet
if (typeof registerPaint === 'function') { 
    try {
      registerPaint('kokoroHighlighter', KokoroHighlighter);
    } catch (e) {
        console.error("Failed to register KokoroHighlighter paint worklet", e);
    }
} else {
    console.error("registerPaint function not available in this context.");
} 