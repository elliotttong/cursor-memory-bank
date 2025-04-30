# Known Limitations

This document tracks known limitations and edge cases for the Chrome TTS Extension.

## Highlighting

*   **Complex Intra-Word Formatting (e.g., Bionic Reading):**
    *   **Issue:** Visual highlighting may fail for sentences containing complex HTML formatting *within* individual words (e.g., using `<strong>` tags for parts of words as seen with Bionic Reading styles on sites like Readwise).
    *   **Cause:** The `spanInjector.js` relies on `range.surroundContents()` which can fail when the text segment to be wrapped crosses boundaries of nested HTML elements within a word.
    *   **Impact:** Audio playback for the affected sentence should still work correctly, but the sentence and its words will not be visually highlighted during playback.
    *   **Status:** Accepted limitation for now due to the complexity of reliably fixing span injection for all possible complex DOM structures. The `spanInjector` logs errors when this occurs.

*   **Last Word Highlighting (e.g., BBC News):**
    *   **Issue:** The very last word of a sentence might occasionally not be highlighted or the highlight might disappear slightly too early on certain sites with specific DOM structures (observed on BBC News articles).
    *   **Cause:** Potentially related to timing synchronization or how the final word's span interacts with adjacent element boundaries or punctuation spans.
    *   **Status:** Investigation paused (T14). Requires further debugging of `syncEngine.js` timing or `spanInjector.js` wrapping near sentence ends for specific site structures. 