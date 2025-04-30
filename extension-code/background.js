console.log("Background Service Worker Loaded.");

// --- Constants (Updated for Deep Infra) ---
const KOKORO_API_ENDPOINT = "https://api.deepinfra.com/v1/inference/hexgrad/Kokoro-82M";
// Model version might not be needed in the URL for Deep Infra, check docs if issues arise
// const KOKORO_MODEL_VERSION = "f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13"; 

// Add the same test sentences here for matching
const TOKENIZER_TEST_SENTENCES_BG = [
    "Sentence one. Simple punctuation.",
    "Sentence two: contractions like don't, won't, and can't.",
    "Sentence three ; spaced punctuation ! Number 123.",
    "Sentence four has newlines and state-of-the-art hyphenation.", // Content script collapses newlines, API might too
    "Sentence five has repeated words like test test test.",
    "Sentence six ends abruptly", // No final punctuation
    "¿Sentence seven starts with odd punctuation?"
];

// Helper function to convert base64 string to Blob
function base64ToBlob(base64, contentType = '', sliceSize = 512) {
  // Remove the data URL prefix if present
  const base64Data = base64.startsWith('data:') ? base64.split(',')[1] : base64;
  try {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });

  } catch (e) {
    console.error("Error decoding base64 or creating Blob:", e);
    return null; // Indicate failure
  }
}

// --- T02: Communication Listener --- (Modified for Deep Infra)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message);

  if (message.action === "requestTTS") {
    let apiToken = null; // Changed variable name
    const sentenceText = message.text; 
    const sentenceIndex = message.sentenceIndex;

    if (typeof sentenceText !== 'string' || sentenceText.trim() === '' || typeof sentenceIndex !== 'number') {
        console.error("Invalid requestTTS message format:", message);
        try { sendResponse({ status: "error", message: "Invalid request format." }); } catch(e){} 
        return false; 
    }

    // Use IIAFE
    (async () => {
        try {
            // 1. Get API Token (Using new storage key)
            const data = await chrome.storage.local.get(['deepInfraToken']);
            if (!data.deepInfraToken) {
                // Inform content script AND original sender (popup) about missing token
                 const errorMsg = "Deep Infra API Token not configured.";
                 if(sender.tab?.id) { chrome.tabs.sendMessage(sender.tab.id, { action: "apiError", message: errorMsg, sentenceIndex: sentenceIndex }); }
                 try { sendResponse({ status: "error", message: errorMsg, sentenceIndex: sentenceIndex }); } catch(e){ console.warn("Could not send API key error response to original sender."); }
                 return; // Stop processing
            }
            apiToken = data.deepInfraToken;

            // 2. Call Deep Infra API
            console.log(`Background: Requesting TTS+Timestamps for sentence index: ${sentenceIndex}`);
            const result = await callDeepInfraTTS(sentenceText, apiToken);
            
            // 3. Process Result & Send to Content Script
            if (result && result.audio && result.words && sender.tab?.id) {
                console.log(`Background: Sending audio and ${result.words.length} timestamps for sentence ${sentenceIndex} to tab ${sender.tab.id}`);
                
                // --- Determine Content Type and Base64 Data ---
                let contentType = 'audio/wav'; // Default
                let base64AudioData = result.audio;

                if (typeof result.audio === 'string' && result.audio.startsWith('data:')) {
                    const parts = result.audio.split(',');
                    const meta = parts[0].split(':')[1]?.split(';')[0]; // e.g., audio/wav
                    if (meta) contentType = meta;
                    base64AudioData = parts[1]; // Get only the base64 part
                    console.log(`Background: Detected content type from data URL: ${contentType}`);
                } else if (typeof result.audio !== 'string') {
                     // Send error back to content script if data type is wrong
                    const errorMsg = `API response had unexpected audio data type: ${typeof result.audio}`;
                    console.error(errorMsg);
                    chrome.tabs.sendMessage(sender.tab.id, { action: "sentenceError", message: errorMsg, sentenceIndex: sentenceIndex }); 
                    try { sendResponse({ status: "error", message: errorMsg, sentenceIndex: sentenceIndex }); } catch(e){}
                    return; // Stop processing
                }
                // else: assume it's a raw base64 string, use default contentType
                // --- REMOVED Object URL Creation BLOCK ---
                // let audioObjectURL = null;
                // try { ... } catch { ... } // Entire block removed
                // -----------------------------------------

                // --- Send Raw Data to Content Script ---
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: "playAudioWithTimestamps", 
                    // ** Send the raw base64 data and content type **
                    base64AudioData: base64AudioData, 
                    contentType: contentType, 
                    // ----
                    wordTimestamps: result.words,
                    sentenceIndex: sentenceIndex 
                });
                // ---------------------------------------
                
                // Send success back to original sender (popup/widget)?
                try {
                    // Don't send the full audio data or object URL back to popup
                    sendResponse({ status: "success", detail: `TTS for sentence ${sentenceIndex} complete.`, result: { words: result.words }, sentenceIndex: sentenceIndex });
                } catch (e) {
                    console.warn("Could not send final success response to original sender (context likely closed)", e);
                }
            } else {
                 // Handle cases where response structure is wrong or tab closed
                 let errorDetail = "Unknown error processing API response.";
                 if (!result?.audio) errorDetail = "API response missing audio data.";
                 if (!result?.words) errorDetail = "API response missing timestamp data.";
                 if (!sender.tab?.id) errorDetail = "Originating tab closed before response.";
                 throw new Error(`API call succeeded but processing failed for sentence ${sentenceIndex}: ${errorDetail}`);
            }

        } catch (error) {
            console.error(`TTS Request failed for sentence ${sentenceIndex}:`, error);
             try {
                 sendResponse({ status: "error", message: error.message, sentenceIndex: sentenceIndex });
             } catch (e) {
                 console.warn("Could not send error response to original sender", e);
             }
             if(sender.tab?.id) {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: "sentenceError", 
                    message: error.message,
                    sentenceIndex: sentenceIndex
                });
             }
        }
    })(); // Execute 

    return true; // Indicate async response 
  }
  
});

// --- T03: Deep Infra TTS Integration --- (Replaces Replicate functions)

// REMOVED: initiateTTSPrediction (Replicate specific)
// REMOVED: pollForResult (Replicate specific)

// NEW function to call Deep Infra API
async function callDeepInfraTTS(text, apiToken) {
  const selectedVoice = "af_bella"; // Keep default for now
  const outputFormat = "wav"; // Ensure consistent format
  
  // Corrected payload structure (no "input" wrapper)
  const payload = {
    text: text,
    // Ensure voice is an array as per schema
    voice: [selectedVoice], 
    output_format: outputFormat,
    return_timestamps: true, // ** Request timestamps! **
    // speed: 1, // Optional: Add speed control later
    // stream: false // Keep default for now
  };

  console.log(`Calling Deep Infra API (${KOKORO_API_ENDPOINT})...`, payload);
  const response = await fetch(KOKORO_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  console.log("Deep Infra Raw Response:", result);

  if (!response.ok) {
    console.error("Deep Infra API HTTP Error Status:", response.status, result);
    // Try to extract a specific error message from Deep Infra's response structure
    const errorMessage = result?.message || result?.detail || JSON.stringify(result) || 'Unknown HTTP error';
    throw new Error(`API request failed: ${errorMessage}`);
  }

  // Basic check on expected output fields (audio might be base64, words should be array)
  if (!result || typeof result.audio !== 'string' || !Array.isArray(result.words)) {
      console.error("Invalid response structure from Deep Infra:", result);
      throw new Error("API response structure invalid or missing audio/words.");
  }

  // Return the full result object which should contain 'audio' (base64 string) and 'words' array
  return result; 
}

// --- Programmatic Injection for Module Support ---

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Inject when the tab is completely loaded and has a http/https URL
    if (changeInfo.status === 'complete' && tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
        console.log(`Tab ${tabId} updated and complete. Attempting to inject entry script.`);
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                // Use a function that dynamically imports the module
                func: () => {
                    // Check if already injected to avoid duplicates on refreshes within the same tab lifecycle
                    if (window.kokoroPageScriptInitialized) {
                        console.log('Kokoro entry script already initialized. Skipping dynamic import.');
                        return;
                    }
                    // Dynamically import the entry script as a module
                    const entryScriptUrl = chrome.runtime.getURL('page-scripts/entry.js');
                    console.log(`Dynamically importing module: ${entryScriptUrl}`);
                    import(entryScriptUrl).then(() => {
                        console.log('Kokoro entry script module loaded successfully.');
                    }).catch(err => {
                        console.error('Error dynamically importing Kokoro entry script:', err);
                    });
                },
            });
            console.log(`Successfully requested injection for tab ${tabId}`);
        } catch (err) {
            // Log errors, potentially occurring if the tab is closed or protected
            console.error(`Failed to inject script into tab ${tabId}: ${err.message}`);
        }
    }
});

// Optional: Listener for extension installation/update for setup tasks
chrome.runtime.onInstalled.addListener(() => {
  console.log("Kokoro TTS Reader MVP installed/updated.");
  // Consider setting a placeholder for deepInfraToken if none exists
}); 