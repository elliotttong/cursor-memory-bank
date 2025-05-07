# Widget UI – State Guide
*This document outlines the state management approach for the Kokoro TTS widget UI.*

---

## 1. Core Idea
One widget.
Two potential shapes (currently implemented as Vertical Pill):

*   **Vertical** pill
*   **Horizontal** bar

Multiple key states driving UI visibility:

1.  **idle** (before play, or after stop/error)
2.  **loading** (fetching audio)
3.  **playing**
4.  **paused**
5.  **error** (general playback error)
6.  **apiKeyError** (specific API key issue)

**Principle:** Never rebuild the widget DOM. Only update state flags (attributes) on existing elements.

---

## 2. State Flags
Add flags as `data-*` attributes to the root *content* element (`#kokoro-tts-widget`):

```html
<div id="kokoro-tts-widget"
     data-layout="V"          <!-- V or H (Currently only V implemented) -->
     data-playback="idle"     <!-- idle | loading | playing | paused | error | apiKeyError -->
     data-hover="false">       <!-- "true" or "false" -->
</div>
```

**Updating State:**
*   Playback state (`data-playback`) is updated by the `updatePlayPauseButtonState(stateString)` function in `extension-code/page-scripts/domUtils.js`.
*   Hover state (`data-hover`) is updated by event listeners in `extension-code/page-scripts/entry.js`.
