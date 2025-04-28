# 02: Text Extraction Mechanisms

This document details how the extension identifies and extracts readable text content from web pages.

## Overview

The extension employs a sophisticated **hybrid approach** combining generic heuristics, site-specific adapters, and an OCR fallback mechanism to maximize compatibility and accuracy across different websites.

## 1. Generic Heuristics

For websites where no specific adapter is available, the extension relies on generic algorithms to traverse the DOM and identify plausible article text. Key functions involved appear to be (names likely minified based on observed logic):

*   **Traversal Function 1 (e.g., `_` in `content/init-NNEJU3PF.js`)**: Recursively walks the DOM tree starting from a given element.
    *   **Filtering**: It ignores elements based on:
        *   CSS classes provided in an `ignoredSelectors` list.
        *   CSS selectors provided in another list.
        *   Computed styles (`display: none`, `visibility: hidden`).
        *   Element size (`clientWidth === 1`).
    *   **Extraction**: It collects `textContent` from `TEXT_NODE`s.
    *   **Refinement**: It filters extracted text snippets, keeping only those with a minimum trimmed length and a minimum word count.

    ```javascript
    // Simplified logic from content/init-NNEJU3PF.js (~line 14)
    traverseAndFilter = (element, ignoredClasses, ignoredSelectors) => {
        if (element instanceof HTMLElement && /* Is ignored? Check classList, matches(selector), visibility, size */) {
            return [];
        }
        let childNodes = Array.from(element.childNodes);
        if (childNodes.length === 0) { // Leaf node
            return element.nodeType === Node.TEXT_NODE ? [{ text: element.textContent ?? "", elem: element }] : [];
        }
        // Recurse
        return childNodes.flatMap(node =>
            node.nodeType === Node.TEXT_NODE ? [{ text: node.textContent ?? "", elem: node }] :
            node.nodeType === Node.ELEMENT_NODE ? _(node, ignoredClasses, ignoredSelectors) : []
        )
        // Filter by length and word count
        .filter(item => item.text.trim().replace(/\n|\r\n/, "").length > 1)
        .filter(item => (item.text.match(/\w+/)?.length ?? 0) > 0);
    }
    ```

*   **`q` function (found in `content/init-44ZT64ND.js`)**: Another DOM traversal function that extracts text, specifically skipping elements hidden via `display: none` or `visibility: hidden`. It seems simpler than `_`.
*   **`ie` filter function (found in `content/init-44ZT64ND.js`)**: This function seems designed to *exclude* specific elements based on configuration, including `ignoredSelectors` and potentially special rules for code blocks (`ignoredSelectorForCodeSegment`, `ignoredTagForCodeSegment`).

## 2. Site-Specific Adapters

The presence of `content/adapters-A53YKHAM.js` exporting a `WebAdapterFactory` strongly indicates a system for applying tailored extraction logic for specific websites.

*   **Factory Pattern**: The `WebAdapterFactory` likely selects the appropriate adapter based on `window.location.hostname` or other page characteristics.
*   **Selector-Based Logic**: Functions like `Ie` in `content/init-F27DTRWA.js` demonstrate adapter logic. This function attempts to find content using a cascade of specific CSS selectors targeting known structures for articles, comments, modals, or editors.
    ```javascript
    // Simplified logic from content/init-F27DTRWA.js (~line 165)
    var Ie = (startElement, siteConfig) => {
        // siteConfig likely contains selectors like detailModal, commentParent, articleContainer etc.
        let specificSelectors = LoadSiteSpecificSelectors(siteConfig);
        return (
            // Try finding content within a known modal structure
            document.querySelector(siteConfig.detailModal) ? startElement.closest(siteConfig.detailModalContainer)?.querySelector(siteConfig.detailModalText) :
            // Try finding content within a known comment structure
            startElement.closest(siteConfig.commentParent)?.querySelector(siteConfig.commentContent) ??
            // Try finding content within a known article structure
            startElement.closest(specificSelectors.articleContainer)?.querySelector(specificSelectors.articleTextSelector) /* ... potentially more specific selectors */ ??
            // Try finding content within a known editor
            document.querySelector(siteConfig.editorContainer)
        );
    };
    ```
*   **Dedicated Adapters**: The existence of `gdocs.js` confirms that specific, complex web applications like Google Docs have their own dedicated adapters.

## 3. OCR Fallback (Screenshot Mode)

For content not accessible via the DOM (e.g., text within images, canvas elements, inaccessible PDFs), the extension provides an OCR fallback mechanism:

*   **Trigger**: Likely initiated via the "Screenshot Mode" command/hotkey (`Alt+R` by default).
*   **Process**: Code in `content/init-LCCYJZVE.js` handles capturing a selected area of the page (`si(N,L.width,L.height)` suggests screenshot capture). The image data (`Z`) is then sent to a backend service (`oi(Z,R,L.left)` which likely calls the `/ocr/ocr-image` endpoint mentioned in `content/chunk-XP57BQDH.js`).
*   **Backend Dependency**: This relies on an external Speechify API endpoint for the actual OCR processing.

## Summary of Logic Flow

```mermaid
graph TD
    A[Content Script Starts] --> B{Site Recognized?};
    B -- Yes --> C[Load Site-Specific Adapter (e.g., GDocs, custom selectors)];
    B -- No --> D[Use Generic Heuristic (DOM traversal, filtering)];
    C --> E{Extraction Successful?};
    D --> E;
    E -- Yes --> F[Send Extracted Text to Background];
    E -- No / User Initiates --> G[Activate Screenshot/OCR Mode?];
    G -- Yes --> H[Capture Screen Area];
    H --> I[Send Image to Backend OCR Service];
    I --> J[Receive Text from Backend];
    J --> F;
    G -- No --> K[Fail / No Content Found];

    style C fill:#ccf,stroke:#333
    style D fill:#cfc,stroke:#333
    style G fill:#f9f,stroke:#333
```

This multi-layered approach allows the extension to handle a wide variety of web content, prioritizing direct DOM access with specific selectors when possible, falling back to heuristics, and finally offering OCR for otherwise inaccessible text. 