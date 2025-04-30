# Text Segmentation Logic

This document details the process used to segment the extracted page text into sentences and then into individual words and punctuation marks for highlighting and TTS processing.

## 1. Sentence Segmentation (`textProcessor.js` - `splitIntoSentences`)

Sentences are identified primarily by punctuation marks (`.`, `!`, `?`). However, simple splitting on these characters is insufficient due to abbreviations (e.g., Mr., Mrs., Dr., etc.), decimals, and other edge cases.

**Strategy:**

1.  **Normalize Whitespace:** Multiple whitespace characters are collapsed into single spaces.
2.  **Regex-Based Splitting:** A regular expression is used to split the text. The core idea is to match sentence-ending punctuation (`.`, `!`, `?`) followed by whitespace and an uppercase letter (indicating the start of a new sentence), while attempting to *avoid* splitting on punctuation within abbreviations or decimals.

   *Current Regex (approximate, refer to `textProcessor.js` for exact implementation):*
   ```regex
   /(?<!\b(?:Mr|Mrs|Ms|Dr|Sr|Jr|Inc|Ltd|Co|etc)\.)(?<!\b[A-Z])(?<![0-9])([.?!])\s+(?=[A-Z"'`‘"“])/g
   ```
   *Explanation:*
     *   `(?<!...)`: Negative lookbehind to avoid splitting if preceded by common abbreviations or single uppercase letters (likely acronyms) followed by a period.
     *   `(?<![0-9])`: Negative lookbehind to avoid splitting if preceded by a digit (likely a decimal).
     *   `([.?!])`: Captures the sentence-ending punctuation.
     *   `\s+`: Matches one or more whitespace characters following the punctuation.
     *   `(?=[A-Z"'`‘"“])`: Positive lookahead to ensure the next non-whitespace character is an uppercase letter or a quotation mark (common sentence starters).

3.  **Post-Processing:** The results of the regex split might require minor cleanup (e.g., trimming whitespace). Empty strings resulting from the split are filtered out.

**Limitations:** This regex-based approach is heuristic and may not perfectly handle all edge cases in complex text structures or less common abbreviations.

## 2. Word & Punctuation Segmentation (`textProcessor.js` - `segmentSentence`)

Once sentences are obtained, each sentence is further segmented into individual words and punctuation marks.

**Strategy:**

1.  **Regex Matching:** A regular expression is used with `matchAll` to find sequences that are either:
    *   One or more word characters (`\w+`) - representing actual words.
    *   One or more non-word, non-whitespace characters (`[^\w\s]+`) - representing punctuation marks or symbols.

   *Current Regex (approximate, refer to `textProcessor.js` for exact implementation):*
   ```regex
   /(\w+)|([^\w\s]+)/g
   ```
   *Explanation:*
     *   `(\w+)`: Captures one or more "word" characters (letters, numbers, underscore).
     *   `|`: OR condition.
     *   `([^\w\s]+)`: Captures one or more characters that are *not* word characters and *not* whitespace (i.e., punctuation/symbols).

2.  **ID Assignment:** Each resulting segment (word or punctuation) is assigned a sequential ID within its sentence (e.g., `w0`, `w1`, `w2`).
3.  **Combined ID:** A composite ID combining the sentence index and word index is created (e.g., `s-0-w0`, `s-0-w1`). This ID is used for the `<span>` elements created by `spanInjector.js`.

**Output:** An array of segment objects, each containing the text, its type ('word' or 'punctuation'), and its ID. 