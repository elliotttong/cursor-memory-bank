# M09: Activation Control

**Analysis Status:** Complete
**Analysis Date:** YYYY-MM-DD (Update with current date)
**Author:** AI Assistant

## 1. Goal

Analyze how the user initiates TTS (extension icon click, context menu on selection, shortcut) and how the extension determines the scope of text to read (e.g., user-selected text vs. auto-detected main content).

## 2. Competitor Analysis

### Common Patterns (Speechify, NaturalReader, ReadVox)

*   **Activation Methods:** All competitors utilize standard Chrome extension activation points:
    *   **Browser Action:** Listening for clicks on the extension icon (`chrome.action.onClicked`).
    *   **Context Menu:** Creating context menu items (e.g., "Read selected text") and listening for clicks (`chrome.contextMenus.create`, `chrome.contextMenus.onClicked`). Requires `contextMenus` permission.
    *   **Keyboard Shortcuts:** Defining commands in `manifest.json` and listening for them (`chrome.commands.onCommand`). Requires `commands` permission.
    *   **Runtime Messaging:** Extensive use of `chrome.runtime.onMessage.addListener` in background, content, and potentially offscreen scripts to coordinate actions triggered by these activation points or by user interactions within the content script UI.
*   **Setup:** Often use `chrome.runtime.onInstalled` to set up initial context menus or perform other first-run tasks.
*   **Tab Events:** Use `chrome.tabs.onUpdated` and `chrome.tabs.onActivated` to manage state, update UI, or inject scripts based on tab status.

### Determining Text Scope (Selection vs. Page)

*   **Context Menu Activation:**
    *   The `onClicked` event listener for context menus receives an `info` object.
    *   If the menu item was clicked when text was selected, `info.selectionText` will contain the selected text.
    *   The background script directly uses `info.selectionText` if available.
    *   If `info.selectionText` is empty (e.g., user right-clicked elsewhere), it triggers the page extraction flow.
*   **Browser Action / Command Activation:**
    *   These events (`onClicked`, `onCommand`) do *not* automatically provide selected text.
    *   **Typical Flow:**
        1.  Background script receives the activation event.
        2.  Background script sends a message (e.g., `{ type: 'GET_SELECTION' }`) to the content script of the currently active tab (`chrome.tabs.query({ active: true, currentWindow: true })`).
        3.  Content script listens for this message, executes `const selectedText = window.getSelection().toString().trim();`, and sends `selectedText` back in a reply message.
        4.  Background script receives the reply.
        5.  If `selectedText` is not empty, it proceeds to TTS with that text.
        6.  If `selectedText` is empty, it initiates the full-page text extraction process (M06 - e.g., requesting HTML from content script, sending to offscreen document for Readability parsing).

### Specific Implementations

*   **Speechify:** Shows clear use of `action.onClicked`, `contextMenus.onClicked`, `commands.onCommand`, and extensive messaging. Likely implements the standard selection-check flow described above.
*   **NaturalReader:** Uses `runtime.onMessage` heavily across multiple injected scripts, suggesting a message-based coordination for activation and text scope determination handled primarily by the background script.
*   **ReadVox:** Also uses `action.onClicked`, `contextMenus.onClicked`, `commands.onCommand`, and `runtime.onMessage`, following the standard patterns.

## 3. Technical Decision & Implementation Plan

### Decision: Implement Standard Activation Points with Message-Based Selection Check

Adopt the common, robust pattern using standard Chrome APIs for activation and explicit messaging for determining text scope.

### Rationale:

*   **Standard & Reliable:** Uses well-documented Chrome APIs for activation triggers.
*   **Clear Logic:** Explicitly separates the handling of selected text from full-page extraction.
*   **User Experience:** Supports multiple common ways users expect to interact with such extensions (icon, right-click, shortcut).

### Implementation Steps:

1.  **`manifest.json` Setup:**
    *   Define the `action` (e.g., browser action with default popup or just trigger background event).
    *   Request `permissions`: `["contextMenus", "activeTab", "scripting", "offscreen"]` (add others as needed).
    *   Define `commands` for keyboard shortcuts (e.g., `_execute_action`, `read_selection`).
    *   Declare the `background` service worker script.
    *   Declare `content_scripts` to run on relevant pages (`<all_urls>` or specific matches).
    *   Declare the `offscreen` document if using M06/Readability approach.
2.  **Background Script (`background.js`):**
    *   **Setup Context Menu (onInstall):**
        ```javascript
        chrome.runtime.onInstalled.addListener(() => {
          chrome.contextMenus.create({
            id: "read-selected-text",
            title: "Read selected text",
            contexts: ["selection"]
          });
        });
        ```
    *   **Action Click Listener:**
        ```javascript
        chrome.action.onClicked.addListener(async (tab) => {
          initiateReading(tab.id, 'action_click');
        });
        ```
    *   **Context Menu Click Listener:**
        ```javascript
        chrome.contextMenus.onClicked.addListener(async (info, tab) => {
          if (info.menuItemId === "read-selected-text") {
            if (info.selectionText) {
              // Start TTS directly with info.selectionText
              startTTS(tab.id, info.selectionText);
            } else {
              // Should not happen for selection context, but handle defensively
              initiateReading(tab.id, 'context_click_no_selection');
            }
          }
        });
        ```
    *   **Command Listener:**
        ```javascript
        chrome.commands.onCommand.addListener(async (command, tab) => {
          console.log(`Command: ${command}`);
          // Map command to action (e.g., 'toggle-play-pause', 'read-page')
          initiateReading(tab.id, command);
        });
        ```
    *   **Core `initiateReading` Function:**
        ```javascript
        async function initiateReading(tabId, trigger) {
          try {
            const response = await chrome.tabs.sendMessage(tabId, { type: 'GET_SELECTION' });
            if (response && response.selectedText) {
              startTTS(tabId, response.selectedText);
            } else {
              // No selection, initiate full page extraction (M06)
              startPageExtraction(tabId);
            }
          } catch (error) {
            console.error("Error communicating with content script:", error);
            // Handle error (e.g., content script not injected or page not accessible)
          }
        }
        ```
    *   **Helper Functions:** `startTTS(tabId, text)`, `startPageExtraction(tabId)` (which would involve M06 logic - e.g., getting HTML and sending to offscreen doc).
    *   Add `onMessage` listener to handle replies from content/offscreen scripts.
3.  **Content Script (`content.js`):**
    *   **Message Listener:**
        ```javascript
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          if (request.type === 'GET_SELECTION') {
            const selectedText = window.getSelection().toString().trim();
            sendResponse({ selectedText: selectedText });
            return true; // Keep message channel open for async response if needed later
          }
          // Handle other messages (e.g., START_PLAYBACK, UPDATE_HIGHLIGHT)
        });
        ```

## 4. Open Questions / Future Considerations

*   How to handle activation on pages where content scripts cannot run (e.g., Chrome Web Store, some browser-internal pages)? (Likely disable UI/show error).
*   Refining the logic for `initiateReading` based on different commands (e.g., a specific shortcut might *always* trigger page reading, ignoring selection).
*   UX for indicating *what* will be read (selection vs. page) after an icon click or shortcut press.

## 5. Related Features

*   **M06 (Text Extraction):** Triggered when no text is selected.
*   **M07 (Floating Widget):** Appears/activates upon successful initiation.
*   **M08 (State Management):** State is updated based on activation and text scope.
*   **S02 (Selected vs. Page Text Handling):** This feature *is* the core implementation of that differentiation. 