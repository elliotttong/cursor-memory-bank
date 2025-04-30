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
   * @param {string} propNameForLogging - Name of the property for logging.
   * @returns {number[][]} Array of [x, y, w, h] arrays.
   */
  parseCoordinateInfo(propValue, propNameForLogging = 'Unknown Prop') {
    // STEP 1: Early exit for empty/invalid propValue
    if (!propValue) {
        // console.log(`[Painter DEBUG - ${propNameForLogging}] Property value is null/undefined.`); // Optional: Log if needed
        return [];
    }
    const str = propValue.toString().trim();
    if (!str) {
        // console.log(`[Painter DEBUG - ${propNameForLogging}] Property value string is empty.`); // Optional: Log if needed
        return [];
    }
    // End STEP 1

    const numbers = str.split(',').map(Number);
    const rects = [];

    // STEP 2: Check length *before* logging warning
    if (numbers.length === 0) {
        // console.log(`[Painter DEBUG - ${propNameForLogging}] Parsed zero numbers from string.`); // Optional: Log if needed
        return []; // Return empty if no numbers parsed
    }
    if (numbers.length % 4 !== 0) {
        // Log the warning only if the string was non-empty but length is wrong
        console.warn(`KokoroHighlighter: Coordinate info string length (${numbers.length}) for ${propNameForLogging} is not a multiple of 4: "${str.substring(0, 50)}..."`);
        // Attempt to use as many full rects as possible
        const usableLength = Math.floor(numbers.length / 4) * 4;
        numbers.length = usableLength;
        if (numbers.length === 0) return []; // Return if truncation resulted in zero length
    }
    // End STEP 2

    for (let i = 0; i < numbers.length; i += 4) {
      const rectCoords = numbers.slice(i, i + 4); // Get the coords for this rect
      if (rectCoords.some(isNaN)) {
         console.warn(`KokoroHighlighter: Invalid number (NaN) found in coordinate info for ${propNameForLogging}:`, str);
         continue; // Skip this rect if it contains NaN
      }
      // Add check for zero width/height
      if (rectCoords[2] <= 0 || rectCoords[3] <= 0) {
          // console.warn(`KokoroHighlighter: Skipping zero width/height rect for ${propNameForLogging}: [${rectCoords.join(', ')}]`); // Optional: Log if needed
          continue; // Skip zero-dimension rectangles
      }
      rects.push(rectCoords); // [x, y, w, h]
    }
    return rects;
  }

  paint(ctx, size, properties) {
    // <<< DEBUG: Draw a red square at top-left to confirm paint execution & overlay visibility >>>
    try {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
        ctx.fillRect(0, 0, 50, 50); // Draw 50x50 square at top-left of the overlay
    } catch (e) {
        console.error("[Painter Debug Square] Error drawing debug rectangle:", e);
    }
    // <<< End DEBUG >>>
    
    // ctx: The 2D drawing context (like Canvas)
    // size: { width, height } of the element being painted
    // properties: Accessor for the inputProperties

    // --- Get Property Values & Log ---
    // Pass property names to parseCoordinateInfo for better logging
    const wordRects = this.parseCoordinateInfo(properties.get('--kokoroHighlightWordInfo'), 'WordInfo');
    const sentenceRects = this.parseCoordinateInfo(properties.get('--kokoroHighlightSentenceInfo'), 'SentenceInfo');
    const hoverRects = this.parseCoordinateInfo(properties.get('--kokoroHoverSentenceInfo'), 'HoverInfo'); // Optional hover

    // <<< DEBUG: Log parsed coordinates if any exist >>>
    const shouldLog = wordRects.length > 0 || sentenceRects.length > 0 || hoverRects.length > 0;
    if (shouldLog) {
        console.log(`[Painter Paint DEBUG] === Painting Frame ===`);
        if(wordRects.length > 0) console.log(`  > Word Rects (${wordRects.length}):`, JSON.stringify(wordRects.slice(0, 2))); // Log first few
        if(sentenceRects.length > 0) console.log(`  > Sentence Rects (${sentenceRects.length}):`, JSON.stringify(sentenceRects.slice(0, 2)));
        if(hoverRects.length > 0) console.log(`  > Hover Rects (${hoverRects.length}):`, JSON.stringify(hoverRects.slice(0, 2)));
    }
    // <<< End DEBUG >>>

    const elemColor = properties.get('--kokoroElemColor')?.toString() || 'rgb(255, 255, 255)';

    // <<< Get color strings directly, apply fallbacks >>>
    const sentenceColorDark = properties.get('--kokoroSentenceHighlightColorDark')?.toString().trim() || '#374b64';
    const sentenceColorLight = properties.get('--kokoroSentenceHighlightColorLight')?.toString().trim() || '#E6E8FF';
    const wordColorDark = properties.get('--kokoroWordHighlightColorDark')?.toString().trim() || '#3a72e0';
    const wordColorLight = properties.get('--kokoroWordHighlightColorLight')?.toString().trim() || '#B4BBFE';
    const hoverColorDark = properties.get('--kokoroHoverHighlightColorDark')?.toString().trim() || '#555555';
    const hoverColorLight = properties.get('--kokoroHoverHighlightColorLight')?.toString().trim() || '#DDDDDD';
    // <<< End color fetching >>>

    // --- GET SCROLL OFFSETS ---
    const scrollX = parseFloat(properties.get('--kokoroScrollX')?.toString() || '0');
    const scrollY = parseFloat(properties.get('--kokoroScrollY')?.toString() || '0');
    // Log Scroll Offsets
    // if (shouldLog) console.log(`  > Scroll: X=${scrollX}, Y=${scrollY}`);
    // End Log

    const defaultRadius = 6;

    // --- Determine Contrast Mode ---
    const brightness = calculateBrightness(elemColor);
    const useDarkHighlightColors = brightness >= 160;

    // <<< DEBUG: Log Color Calculation >>>
    if (shouldLog) {
        console.log(`  > Elem Color: ${elemColor}`);
        console.log(`  > Brightness: ${brightness.toFixed(2)}`);
        console.log(`  > Use Dark Colors: ${useDarkHighlightColors}`);
    }
    // <<< End DEBUG >>>

    // --- Select Color String Based on Contrast ---
    const hoverFill = useDarkHighlightColors ? hoverColorDark : hoverColorLight;
    const sentenceFill = useDarkHighlightColors ? sentenceColorDark : sentenceColorLight;
    const wordFill = useDarkHighlightColors ? wordColorDark : wordColorLight;

    // <<< DEBUG: Log Chosen Fill Colors (Now strings) >>>
    if (shouldLog) {
        console.log(`  > Final Hover Fill Style: ${hoverFill}`);
        console.log(`  > Final Sentence Fill Style: ${sentenceFill}`);
        console.log(`  > Final Word Fill Style: ${wordFill}`);
    }
    // <<< End DEBUG >>>

    // --- Paint Order: Hover (Optional) -> Sentence -> Word ---
    
    // 1. Paint Hover Highlights (if any)
    if (hoverRects.length > 0) {
      ctx.fillStyle = hoverFill;
      for (const rect of hoverRects) {
        const adjustedRect = [rect[0], rect[1], rect[2], rect[3]]; // Use raw coordinates
        // <<< DEBUG LOG >>>
        if (shouldLog) console.log(`  -> Drawing HOVER rect with color ${ctx.fillStyle}: [${adjustedRect.join(', ')}] Radius: ${defaultRadius}`);
        drawRoundedRect(ctx, [...adjustedRect, defaultRadius]);
        ctx.fill();
      }
    }

    // 2. Paint Sentence Highlights
    if (sentenceRects.length > 0) {
      ctx.fillStyle = sentenceFill;
      for (const rect of sentenceRects) {
        const adjustedRect = [rect[0], rect[1], rect[2], rect[3]]; // Use raw coordinates
        // <<< DEBUG LOG >>>
        if (shouldLog) console.log(`  -> Drawing SENTENCE rect with color ${ctx.fillStyle}: [${adjustedRect.join(', ')}] Radius: ${defaultRadius}`);
        drawRoundedRect(ctx, [...adjustedRect, defaultRadius]);
        ctx.fill();
      }
    }

    // 3. Paint Word Highlights (drawn on top of sentence highlights)
    if (wordRects.length > 0) {
      ctx.fillStyle = wordFill;
      for (const rect of wordRects) {
        const adjustedRect = [rect[0], rect[1], rect[2], rect[3]]; // Use raw coordinates
        // <<< DEBUG LOG >>>
        if (shouldLog) console.log(`  -> Drawing WORD rect with color ${ctx.fillStyle}: [${adjustedRect.join(', ')}] Radius: ${defaultRadius}`);
        drawRoundedRect(ctx, [...adjustedRect, defaultRadius]);
        ctx.fill();
      }
    }
    // Log end of paint if something should have been drawn
    // if (shouldLog) console.log(`[Painter Paint DEBUG] --- Finished Painting ---`);
    // End Log
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