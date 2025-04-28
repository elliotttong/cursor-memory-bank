# M06: Text Extraction (Web)

**Analysis Status:** In Progress
**Analysis Date:** YYYY-MM-DD
**Author:** AI Assistant

## 1. Goal

Analyze the methods used to identify and extract the main readable content from diverse web pages (articles, blogs, potentially Gmail). Look for common patterns, potential use of libraries (like Readability.js), or custom heuristics/selectors. Do they have separate files for different sites like Wikipedia, Reddit, etc.? How do they make it specific to each page?

## 2. Competitor Analysis

### Speechify

*   **Method:** Client-side Readability.js.
*   **Evidence:**
    *   Codebase search confirmed references to "Readability" in `content/main.js` and other content/offscreen scripts (`init-QU3EJ6BJ.js`, `chunk-6VFX2JNU.js`).
    *   Code in `offscreen/src/main.js` includes logic to load a Readability ONNX model (`readability_gb.onnx`, `readability_gb_wide.onnx`) based on viewport width and establishes message handlers (`path: "readability"`).
    *   The use of an offscreen document (`offscreen/src/main.js`) suggests processing happens there, likely receiving the DOM content via messaging and returning the extracted text.
*   **Site-Specific Logic:** No strong evidence of separate files per site was found. It appears to rely primarily on the general Readability algorithm, potentially augmented by ML models (`gb.onnx`) for classification or refinement, rather than site-specific selectors in the extension code itself.

### NaturalReader

*   **Method:** Server-side extraction via API call.
*   **Evidence:**
    *   Code in `injected/nr-ext-reading-bar/nr-ext-reading-bar.js` constructs a request to `https://readability.naturalreaders.com/` with the service `"urltojson"`.
    *   The current page URL is sent to this backend service.
    *   The subdomain strongly suggests the backend uses a Readability.js-based algorithm.
    *   No client-side Readability library usage was found in the extension's code.
*   **Site-Specific Logic:** Handled server-side. The backend service likely applies Readability and potentially custom rules or refinements based on the URL/domain being processed. The client extension does not appear to contain site-specific extraction logic.

### ReadVox

*   **Method:** (Needs specific investigation - To Be Analyzed) Likely client-side or potentially server-side similar to the others. Given its local TTS focus, client-side is plausible.
*   **Evidence:** TBD
*   **Site-Specific Logic:** TBD

## 3. Technical Decision & Implementation Plan

### Decision: Client-Side Readability.js in Offscreen Document

The recommended approach is to implement text extraction **client-side** using Mozilla's **Readability.js** library, executed within an **Offscreen Document**.

### Rationale:

*   **Privacy:** Processing happens entirely within the user's browser, avoiding the need to send page content or URLs to an external server.
*   **Cost:** No server infrastructure or API costs associated with extraction.
*   **Simplicity:** Readability.js is a well-maintained, open-source library specifically designed for this task. Integrating it client-side is generally straightforward.
*   **Performance:** Offscreen documents allow running the potentially CPU-intensive parsing process without blocking the main extension thread or the page's UI.
*   **Robustness:** Readability.js is widely used (e.g., Firefox Reader View) and effective on a vast range of websites.

### Implementation Steps:

1.  **Include Readability.js:** Add the latest version of `@mozilla/readability` as a project dependency or bundle it directly.
2.  **Create Offscreen Document:**
    *   Define an HTML file for the offscreen document (e.g., `offscreen/extractor.html`).
    *   Include a script (`offscreen/extractor.js`) in this HTML file.
    *   Declare the `offscreen` permission in `manifest.json` with the `DOCUMENT_SCANNER` reason (appropriate for DOM parsing).
3.  **Messaging Setup:**
    *   **Content Script:** When extraction is needed (e.g., user clicks play), send a message to the background script containing the page's full `document.documentElement.outerHTML`.
    *   **Background Script:**
        *   Receive the message from the content script.
        *   Check if an offscreen document exists; if not, create one using `chrome.offscreen.createDocument(...)`.
        *   Forward the HTML content in a message to the offscreen document using `chrome.runtime.sendMessage()`.
    *   **Offscreen Script (`offscreen/extractor.js`):**
        *   Add a message listener using `chrome.runtime.onMessage.addListener`.
        *   When HTML content is received:
            *   Import/use the `Readability` class.
            *   Parse the HTML string into a DOM using `DOMParser`: `const doc = new DOMParser().parseFromString(htmlString, 'text/html');`
            *   Instantiate Readability: `const reader = new Readability(doc);`
            *   Parse the document: `const article = reader.parse();`
            *   Extract relevant content (`article.title`, `article.content`, `article.textContent`, `article.excerpt`). Handle cases where `article` is null.
            *   Send the extracted article object (or relevant parts) back to the background script via `chrome.runtime.sendMessage()`.
    *   **Background Script:** Receive the extracted content message from the offscreen document and forward it to the original content script tab.
    *   **Content Script:** Receive the extracted content and use it for TTS processing (e.g., populating the player).
4.  **Error Handling:** Implement robust error handling for cases where Readability fails to parse or extract content (e.g., send back an error message). Handle offscreen document creation errors.
5.  **Site-Specific Logic (If Needed):**
    *   Start with the general Readability approach.
    *   *Avoid* creating separate files per site initially.
    *   If specific high-priority sites consistently fail extraction, consider adding targeted logic *after* the Readability attempt:
        *   In the offscreen script, check if `article` is null or insufficient.
        *   If so, and if the URL matches a known problematic site, apply custom heuristics (e.g., querySelector for specific known content containers).
        *   This should be a fallback, not the primary method.

### Trade-offs vs. Server-Side (NaturalReader's approach):

*   **Pros (Client-Side):** Better privacy, lower cost, simpler infrastructure.
*   **Cons (Client-Side):** May be less robust on *some* complex sites compared to a server that can use more complex fetching/rendering/parsing; potentially higher CPU usage on the client device (mitigated by Offscreen Document).
*   **Server-Side Option:** Could be considered as a *fallback* or premium feature if client-side extraction proves insufficient for critical websites, but adds complexity and cost.

## 4. Open Questions / Future Considerations

*   How to handle pages that heavily rely on client-side JavaScript rendering for content? (Readability operates on the provided HTML source; might need the *rendered* DOM). The `outerHTML` approach captures the current state, which is generally good.
*   Performance impact of parsing very large documents in the offscreen document.
*   Specific handling for PDFs (See M07).
*   Handling for web apps like Gmail (likely needs very custom selectors, Readability may not work well).

## 5. Related Features

*   **M03/M04:** Highlighting/Sync depends on having the extracted text structure.
*   **M07:** PDF Text Extraction (requires a different approach).

</rewritten_file> 