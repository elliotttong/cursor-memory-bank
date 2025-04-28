# TTS Extension Feature Analysis Tracker

This file tracks the analysis progress for each planned feature of the target TTS extension (Speechify replica). Use the 'Goal' description to guide the analysis for each item. Mark tasks as complete by changing `- [ ]` to `- [x]`.

---

## MUST HAVE Features

- [x] **M01: Cloud TTS API Integration**
  - *Goal: Analyze how premium TTS voices are accessed. Identify potential APIs used (like Play.ht, ElevenLabs, Google, AWS Polly), authentication methods, and how voice selection maps to API calls, especially for Speechify.*
- [ ] **M02: Audio Streaming Playback**
  - *Goal: Investigate how audio data received from the API is handled. Is it streamed progressively? Buffered? What audio formats are likely used? How is playback controlled (e.g., HTML5 `<audio>`, Web Audio API)?*
- [x] **M03: Highlighting (Word & Sentence)**
  - *Goal: Detail the mechanism for visually highlighting text on the webpage as it's spoken. How are specific words and sentences identified and styled dynamically? (e.g., wrapping in `<span>`s, applying CSS classes). Focus on achieving both word and sentence level like Speechify.*
- [x] **M04: Audio-Highlight Sync**
  - *Goal: Determine the core technique used to synchronize the precise audio playback position with the correct word and sentence highlight. Analyze potential use of API timing data/metadata, `speechSynthesis` boundary events (if applicable), or other custom timing mechanisms.*
- [x] **M05: Playback Speed Control**
  - *Goal: Understand how speed adjustment (especially the high speeds advertised by Speechify) is achieved while maintaining sync. Is it an API parameter, or client-side manipulation of audio playback rate? How is sync preserved at high speeds?*
  - *Status: done*
- [x] **M06: Text Extraction (Web)**
  - *Goal: Analyze the methods used to identify and extract the main readable content from diverse web pages (articles, blogs, potentially Gmail). Look for common patterns, potential use of libraries (like Readability.js), or custom heuristics/selectors.Do they have serparate files for different sites like wikepedia, reddit etc, how do they make it specific to each page?*
- [x] **M07: Floating Widget UI**
  - *Goal: Examine the implementation of the persistent floating player. How is it injected onto the page? What technologies might be used (if discernible)? How does it handle different website layouts and scrolling?*
- [x] **M08: State Management (Basic)**
  - *Goal: Identify how the extension tracks the current essential playback state (e.g., playing/paused, current audio position, current text segment index/reference) during an active reading session on a single page.*
- [x] **M09: Activation Control**
  - *Goal: Analyze how the user initiates TTS (icon click, context menu on selection, shortcut) and how the extension determines the scope of text to read (e.g., user-selected text vs. auto-detected main content).*
- [x] **M10: Voice Management & Selection**
  - *Goal: Understand how the list of available voices (especially premium/cloud-based ones) is fetched, presented to the user in the UI, and how user selection translates to parameters for the TTS API calls.*

---

## SHOULD HAVE Features

- [ ] **S01: State Persistence (Reloads/Sessions)**
  - *Goal: Investigate how reading progress (last position on a specific URL, selected voice, speed) is saved and restored across page reloads or potentially across browser sessions using mechanisms like `chrome.storage.local` or `chrome.storage.sync`.*
- [ ] **S02: Selected vs. Page Text Handling**
  - *Goal: Detail the specific logic and UI/UX flow that differentiates between reading only the text manually selected by the user versus auto-detecting and reading the main page content.*
- [ ] **S03: Audio Caching**
  - *Goal: Determine if/how generated audio snippets (e.g., per paragraph or sentence) are cached locally in the browser to reduce redundant API calls and improve load times for previously read or revisited sections.*
- [ ] **S04: Language Detection**
  - *Goal: Analyze how the language of the page content is detected (e.g., HTML `lang` attribute, browser APIs, content analysis libraries) and how this potentially influences automatic voice selection or availability.*
- [ ] **S05: Error Handling (Basic)**
  - *Goal: Identify how common operational errors (e.g., TTS API request failure, network issues during streaming, failure to extract text from a page) are managed or reported to the user gracefully.*
- [ ] **S06: Library Saving Mechanism**
  - *Goal: Understand how users can save content (e.g., URL of a webpage, uploaded document reference) for later listening within the extension. What information is stored? Where is it stored (local/cloud)? How is it organized/accessed?*
- [ ] **S07: PDF Text Extraction**
  - *Goal: Analyze how text is extracted from PDF files when opened within the Chrome browser's PDF viewer. Does it primarily handle text-based PDFs? Are there specific challenges or libraries involved?*
- [ ] **S08: Scrubbing/Skipping Controls**
  - *Goal: Investigate the implementation of controls allowing the user to jump forward/backward by a set amount (e.g., sentence/paragraph) or scrub through the audio timeline, while ensuring the text highlight stays synchronized.*
- [ ] **S09: Keyboard Shortcuts**
  - *Goal: Identify the default keyboard shortcuts offered for common actions (play/pause, skip, speed up/down) and analyze how these shortcuts are registered and handled by the extension.*

---

## COULD HAVE Features

- [ ] **C01: OCR Integration**
  - *Goal: Analyze how text might be extracted from images found within a webpage. Does the extension perform OCR locally (less likely), or does it interact with a backend service? Examine any UI elements or network calls related to image text recognition.*
- [ ] **C02: Cross-Device Sync Mechanism**
  - *Goal: Examine any evidence of how the library items or reading position might be synchronized across different devices (e.g., Chrome extension and mobile app). This likely involves user accounts and a backend API; focus on analyzing the extension's interaction points (API calls, data formats).*
- [ ] **C03: Complex Layout Handling**
  - *Goal: Assess how the extension's text extraction and highlighting behave with non-standard content structures like nested tables, complex lists, code blocks with syntax highlighting, or content within iframes.*
- [ ] **C04: Performance Optimization**
  - *Goal: Look for specific techniques potentially used to optimize resource usage (CPU, memory) during text processing or playback, or methods employed to improve the perceived speed and responsiveness, especially on long or complex pages.*
- [ ] **C05: Custom Highlighting**
  - *Goal: Determine if users can customize the appearance (color, style - e.g., background vs. underline) of the text highlighting and how these user preferences are stored and applied.*
- [ ] **C06: Focus Mode**
  - *Goal: Analyze if a feature exists to dim or hide parts of the page not currently being read to help user focus. If so, investigate how this visual effect is implemented (e.g., overlays, CSS manipulation).*
- [ ] **C07: Offline Mode (System Voices)**
  - *Goal: Investigate if the extension offers an offline mode, likely using the browser's built-in `speechSynthesis` API and system voices as a fallback when cloud APIs are unavailable or undesired. How does the switch occur?*

---