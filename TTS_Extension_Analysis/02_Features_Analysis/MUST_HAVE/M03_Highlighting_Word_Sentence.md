# M03: Highlighting (Word & Sentence)

## Feature Description
Highlighting the currently spoken word and/or sentence in sync with audio playback is a core usability feature for TTS extensions. Advanced implementations, like Speechify's, use a CSS Houdini Paint Worklet to achieve visually rich, performant, and customizable highlights.

---

## Why Use CSS Houdini Paint Worklet (Speechify Approach)?
- **Advanced Visual Effects:** Enables rounded corners, gradients, shadows, and layered highlights (e.g., sentence and word simultaneously).
- **Performance:** Avoids DOM bloat by not wrapping every word in a `<span>`, which is critical for long documents.
- **Consistency:** Ensures highlights look the same across sites, regardless of their CSS.
- **User Customization:** Easily supports user-selected colors, border radius, and other styles via CSS variables.

**Note:** Houdini is only supported in Chromium-based browsers. A fallback (class-based highlighting) is required for full compatibility.

---

## Technical Implementation Outline

### 1. **CSS Houdini Paint Worklet**
- Register a paint worklet that draws highlights based on CSS custom properties.
- Example: `houdini-highlight.js`

```js
// houdini-highlight.js
registerPaint('tts-highlight', class {
  static get inputProperties() {
    return [
      '--tts-highlight-color',
      '--tts-highlight-radius',
      '--tts-highlight-padding',
    ];
  }
  paint(ctx, geom, properties) {
    const color = properties.get('--tts-highlight-color').toString() || '#B5C687';
    const radius = parseFloat(properties.get('--tts-highlight-radius')) || 6;
    const padding = parseFloat(properties.get('--tts-highlight-padding')) || 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(radius, padding);
    ctx.lineTo(geom.width - radius, padding);
    ctx.quadraticCurveTo(geom.width, padding, geom.width, radius + padding);
    ctx.lineTo(geom.width, geom.height - radius - padding);
    ctx.quadraticCurveTo(geom.width, geom.height - padding, geom.width - radius, geom.height - padding);
    ctx.lineTo(radius, geom.height - padding);
    ctx.quadraticCurveTo(padding, geom.height - padding, padding, geom.height - radius - padding);
    ctx.lineTo(padding, radius + padding);
    ctx.quadraticCurveTo(padding, padding, radius, padding);
    ctx.closePath();
    ctx.fill();
  }
});
```

- Register the worklet in your extension:

```js
if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule(chrome.runtime.getURL('houdini-highlight.js'));
}
```

### 2. **Applying the Highlight**
- Use a custom class and CSS to apply the paint worklet to the current word/sentence:

```css
.tts-highlight-word {
  background: paint(tts-highlight);
  --tts-highlight-color: var(--user-highlight-color, #B5C687);
  --tts-highlight-radius: var(--user-highlight-radius, 6px);
  --tts-highlight-padding: 2px;
  color: #0d3b55;
  transition: background 0.2s;
}
```

- Update the custom properties in real time based on user settings.

### 3. **Fallback for Non-Houdini Browsers**
- Use standard CSS classes and DOM `<span>` wrapping for highlighting:

```css
.tts-highlight-word {
  background: var(--user-highlight-color, #B5C687);
  border-radius: var(--user-highlight-radius, 6px);
  color: #0d3b55;
}
```

- Detect Houdini support in JS and switch between approaches as needed.

### 4. **User Customization**
- Provide a settings UI for users to pick highlight color, border radius, etc.
- Store preferences using Chrome extension storage APIs.
- Apply user preferences via CSS variables.

### 5. **Integration Example**
- As playback progresses, update the highlighted word/sentence by adding/removing the `.tts-highlight-word` class and updating CSS variables.

```js
function highlightWord(element, color, radius) {
  element.classList.add('tts-highlight-word');
  element.style.setProperty('--user-highlight-color', color);
  element.style.setProperty('--user-highlight-radius', radius + 'px');
}
function clearHighlights() {
  document.querySelectorAll('.tts-highlight-word').forEach(e => e.classList.remove('tts-highlight-word'));
}
```

---

## Considerations for Implementation
- **Browser Support:** Houdini only works in Chromium browsers. Always provide a fallback.
- **Performance:** Houdini is efficient for large documents, but test on long pages.
- **Accessibility:** Ensure highlights do not interfere with screen readers or keyboard navigation.
- **Complex Editors:** For Google Docs/Slides, a canvas overlay is still required—Houdini does not solve this.
- **User Experience:** Allow real-time preview of highlight changes in the settings UI.

---

## Recommendation
**Adopt the Speechify-style CSS Houdini Paint Worklet for highlighting, with a robust fallback for non-supporting browsers.**
- This approach delivers a visually rich, performant, and customizable experience, matching the best-in-class TTS extensions.
- Prioritize user customization and accessibility.
- For edge cases (Google Docs/Slides), implement a canvas overlay solution.

---

**By following this approach, your extension will offer a modern, expert-level highlighting experience that stands out in the TTS market.** 