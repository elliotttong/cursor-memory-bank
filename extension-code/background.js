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

            // 2. Call Deep Infra API (Assuming Synchronous Response for now)
            console.log(`Background: Requesting TTS+Timestamps for sentence index: ${sentenceIndex}`);
            const result = await callDeepInfraTTS(sentenceText, apiToken);
            
            // 3. Process Result & Send to Content Script
            if (result && result.audio && result.words && sender.tab?.id) {
                console.log(`Background: Sending audio and ${result.words.length} timestamps for sentence ${sentenceIndex} to tab ${sender.tab.id}`);
                
                // --- Corrected Data URL Handling ---
                let audioDataUrl;
                if (typeof result.audio === 'string' && result.audio.startsWith('data:audio')) {
                    // API already provided a Data URL
                    console.log("Using Data URL directly from API response.");
                    audioDataUrl = result.audio;
                } else if (typeof result.audio === 'string') {
                     // Assume it's base64 data and add the prefix
                    console.warn("API audio response did not start with 'data:audio', assuming base64 and adding prefix.");
                    audioDataUrl = `data:audio/wav;base64,${result.audio}`;
                } else {
                    // Handle unexpected audio format
                    throw new Error(`API response had unexpected audio data type: ${typeof result.audio}`);
                }
                // -------------------------------------

                chrome.tabs.sendMessage(sender.tab.id, {
                    action: "playAudioWithTimestamps", // New action name
                    audioDataUrl: audioDataUrl, // Send the corrected URL
                    wordTimestamps: result.words,
                    sentenceIndex: sentenceIndex 
                });
                // Send success back to original sender (popup/widget)?
                try {
                    // Don't send the full audio data back to popup
                    const minimalResult = { ...result, audio: `(audio data length: ${result.audio?.length})` }; 
                    sendResponse({ status: "success", detail: `TTS for sentence ${sentenceIndex} complete.`, result: minimalResult, sentenceIndex: sentenceIndex });
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


// Optional: Listener for extension installation/update for setup tasks
chrome.runtime.onInstalled.addListener(() => {
  console.log("Kokoro TTS Reader MVP installed/updated.");
  // Consider setting a placeholder for deepInfraToken if none exists
}); 