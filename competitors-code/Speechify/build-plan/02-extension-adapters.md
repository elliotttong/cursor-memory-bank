# 02: Site-Specific Text Extraction Adapters

## Strategy: Hybrid Approach

To accurately extract the main readable content from diverse web pages, we'll employ a hybrid strategy combining general heuristics with site-specific adapters, similar to the competitor but with improvements.

1.  **General Heuristics (Default):**
    *   Analyze DOM structure, identifying common article/content tags (`<article>`, `<main>`, elements with roles like `main`, `article`).
    *   Score elements based on text density, paragraph (`<p>`) count, link density (lower is better for main content), and common class names (`content`, `post-body`, `article-content`).
    *   Remove common non-content sections (headers, footers, sidebars, navs, comments) using tag names and typical class/ID patterns.
    *   This heuristic engine will be the fallback when no specific adapter matches.
    *   **Improvement:** Use `readability.js` (Mozilla's library) or a similar robust open-source library as the foundation for the heuristic engine, rather than building entirely from scratch.

2.  **Site-Specific Adapters:**
    *   Maintain a configuration (potentially stored in Supabase DB and fetched by the extension) mapping domain patterns (e.g., `*.wikipedia.org`, `medium.com`) to specific CSS selectors or JavaScript functions.
    *   **Selector-Based Adapters:** Define CSS selectors to directly target the main content container(s) and elements to explicitly exclude (e.g., related posts, author bios within the main container).
    *   **Function-Based Adapters (Advanced):** For complex sites or SPAs, an adapter can be a small JavaScript function (executed via `chrome.scripting.executeScript`) that performs custom DOM traversal or utilizes site-specific JavaScript variables/APIs to locate the content.
    *   **Prioritization:** Adapters always take precedence over the general heuristic engine.
    *   **Health Checks:** Implement the `adapter_health.ts` Edge Function (triggered by pg_cron) to periodically fetch sample pages from supported sites, run the adapter logic, and flag adapters that fail (e.g., due to site redesigns), potentially notifying the team or falling back to heuristics for that domain.

## Adapter Configuration (Conceptual Example)

Could be stored in a `site_adapters` table in Supabase:

| `id` | `domain_pattern`  | `adapter_type` | `content_selector`                | `exclude_selector`                                | `custom_script` | `is_active` | `last_checked`      |
| :--- | :---------------- | :------------- | :-------------------------------- | :---------------------------------------------- | :-------------- | :---------- | :------------------ |
| 1    | `*.wikipedia.org` | `selector`     | `#bodyContent #mw-content-text` | `.infobox, .metadata, .navbox, .catlinks` | `null`          | `true`      | `2023-10-27T10:00Z` |
| 2    | `medium.com`      | `selector`     | `article section`               | `footer, [data-test-id="related-posts"]`      | `null`          | `true`      | `2023-10-27T10:00Z` |
| 3    | `reddit.com`      | `selector`     | `[data-test-id="post-content"]` | `[data-click-id="comments"]`                  | `null`          | `true`      | `2023-10-27T10:00Z` |
| ...  | ...               | ...            | ...                               | ...                                             | ...             | ...         | ...                 |

## Starter Selectors

These are initial best-guess selectors. They **must** be tested and refined.

*   **Wikipedia (`*.wikipedia.org`):**
    *   `content_selector`: `#bodyContent .mw-parser-output` (More specific than just `#mw-content-text`)
    *   `exclude_selector`: `.infobox, .metadata, .navbox, .catlinks, .thumb, .mw-editsection, .reflist, #toc`
*   **Reddit (`*.reddit.com` - Post View):**
    *   `content_selector`: `[data-test-id="post-content"]` (for the main post body), potentially also need to select top-level comments if desired.
    *   `exclude_selector`: `[data-click-id="comments"] > *, .moderator-removed, .deleted-comment-text` (Exclude nested comments if only reading the post, or refine to target specific ad/UI elements)
*   **Medium (`medium.com`, `*.medium.com`):**
    *   `content_selector`: `article section` (Often holds the core content)
    *   `exclude_selector`: `footer, aside, [data-test-id="related-posts"], [data-testid="author-bio"], [aria-label="responses"]`
*   **New York Times (`nytimes.com`):**
    *   `content_selector`: `section[name="articleBody"]`
    *   `exclude_selector`: `figure, .ad, aside, #story-footer, .related-links`
*   **Gmail (`mail.google.com`):**
    *   **Note:** Gmail is highly dynamic and uses obfuscated classes. A simple selector approach is fragile. A function-based adapter or reliance on accessibility attributes (`role="main"`?) might be needed.
    *   `content_selector (Tentative)`: `div[role="listitem"] .adn` (Targets individual email message bodies, but likely needs more context/refinement).
    *   `exclude_selector`: `.gmail_quote, .gmail_signature`

## Extraction Process Flow

1.  Content script activates on page load/navigation.
2.  Script checks the current URL against the fetched adapter configuration.
3.  **If Adapter Match:**
    *   Apply the specific adapter (selector or function).
    *   If selector-based, query for `content_selector`, then remove `exclude_selector` nodes.
    *   If function-based, execute the script to get the content container element(s).
4.  **If No Adapter Match:**
    *   Run the general heuristic engine (`readability.js` or similar).
5.  Traverse the identified content element(s), extracting text nodes.
6.  Clean and format the text (e.g., normalize whitespace, potentially basic sentence splitting for context).
7.  Send the extracted text blocks to the Background Service Worker for TTS processing.

## Competitor Inefficiencies & Our Fixes

*   **Inefficiency:** Competitor might use overly broad selectors or inefficient DOM traversal, especially in their heuristics.
*   **Fix:** Leverage `readability.js` for robust heuristics. Prioritize specific, well-tested CSS selectors in adapters. Implement function-based adapters only when necessary for complex sites.
*   **Inefficiency:** No apparent mechanism for validating adapters after site redesigns.
*   **Fix:** Implement automated adapter health checks via Supabase Edge Functions and pg_cron.
*   **Inefficiency:** Potentially running extraction logic too frequently on dynamic pages.
*   **Fix:** Throttle DOM observation and trigger extraction logic intelligently based on significant content changes, not minor UI updates (See `14-performance-audit.md`). 