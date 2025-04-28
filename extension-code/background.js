console.log("Background Service Worker Loaded.");

// Define constants at the top level
const KOKORO_REPLICATE_ENDPOINT = "https://api.replicate.com/v1/predictions";
const KOKORO_MODEL_VERSION = "f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13";

// --- T02: Communication Listener ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message);
  
  if (message.action === "requestTTS") {
    let apiKey = null;
    // Use an immediately-invoked async function expression (IIAFE) 
    // to handle async operations within the sync listener
    (async () => {
        try {
            // 1. Get API Key
            const data = await chrome.storage.local.get(['kokoroApiKey']);
            if (!data.kokoroApiKey) {
                throw new Error("API Key not configured.");
            }
            apiKey = data.kokoroApiKey;

            // 2. Initiate Prediction (gets polling URL)
            const pollUrl = await initiateTTSPrediction(message.text, apiKey);
            
            // Send initial acknowledgement back? Optional.
            // sendResponse({ status: "processing_started", pollUrl: pollUrl });

            // 3. Start Polling
            const result = await pollForResult(pollUrl, apiKey);

            // 4. Send final audio URL to content script
            if (result.status === "succeeded" && sender.tab?.id) {
                chrome.tabs.sendMessage(sender.tab.id, { action: "playAudio", audioSource: result.audioUrl });
                // Send final success status back to original sender IF they are still waiting
                // Note: sendResponse might fail if the original context (popup?) closed
                try {
                    sendResponse({ status: "success", detail: "TTS generation complete.", result: result });
                } catch (e) {
                    console.warn("Could not send final success response to original sender (context likely closed)", e);
                }
            } else {
                 throw new Error("Polling finished but result was not successful or tab ID missing.");
            }

        } catch (error) {
            console.error("TTS Request failed in background handler:", error);
             // Send error back to original sender IF they are still waiting
             try {
                 sendResponse({ status: "error", message: error.message });
             } catch (e) {
                 console.warn("Could not send error response to original sender (context likely closed)", e);
             }
        }
    })(); // Execute the async function

    // MUST return true here to indicate the response will be sent asynchronously
    // (even though the final response might come much later via polling)
    return true; 
  }
  
  // Add other message handlers as needed
});

// --- T03: Kokoro TTS Integration (using Polling) ---
async function initiateTTSPrediction(text, apiKey) {
  const selectedVoice = "af_bella"; // Keep default for now
  
  // Constants KOKORO_REPLICATE_ENDPOINT and KOKORO_MODEL_VERSION are now accessible from the top level
  
  const payload = {
    version: KOKORO_MODEL_VERSION,
    input: {
      text: text,
      voice: selectedVoice
    }
  };

  console.log("Calling Replicate API (async mode)...", payload);
  const response = await fetch(KOKORO_REPLICATE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
      // REMOVED 'Prefer': 'wait=60' 
    },
    body: JSON.stringify(payload)
  });

  const initialPrediction = await response.json();
  console.log("Replicate Initial Response:", initialPrediction);

  if (!response.ok) {
    console.error("Replicate API HTTP Error Status:", response.status);
    throw new Error(`API request failed: ${initialPrediction.detail || 'Unknown HTTP error'}`);
  }

  if (!initialPrediction.urls || !initialPrediction.urls.get) {
      console.error("Invalid initial response from Replicate, missing urls.get:", initialPrediction);
      throw new Error("API response did not contain a polling URL.");
  }

  // Return the URL needed for polling
  return initialPrediction.urls.get; 
}

async function pollForResult(pollUrl, apiKey) {
  const MAX_POLLS = 30; // e.g., 30 polls * 1 second = 30 seconds timeout (adjust if needed)
  const POLL_INTERVAL_MS = 1000; // 1 second
  let pollCount = 0;

  while (pollCount < MAX_POLLS) {
    pollCount++;
    console.log(`Polling attempt ${pollCount} at URL: ${pollUrl}`);
    
    try {
      const response = await fetch(pollUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const predictionResult = await response.json();

      if (!response.ok) {
         console.error(`Polling failed with status ${response.status}:`, predictionResult);
         throw new Error(`Polling request failed: ${predictionResult.detail || 'Unknown polling error'}`);
      }

      console.log(`Polling Response Status: ${predictionResult.status}`);

      if (predictionResult.status === "succeeded") {
          if (predictionResult.output) {
              console.log(`Prediction Succeeded! Received audio URL: ${predictionResult.output}`);
              return { status: "succeeded", audioUrl: predictionResult.output };
          } else {
              console.error("Polling Succeeded but no output URL found:", predictionResult);
              throw new Error("Prediction succeeded but output URL was missing.");
          }
      } else if (predictionResult.status === "failed" || predictionResult.status === "canceled") {
          console.error("Prediction failed or was canceled:", predictionResult);
          throw new Error(`Prediction ${predictionResult.status}: ${predictionResult.error || 'Prediction error'}`);
      } else {
          // Status is starting or processing, wait and poll again
          await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
      }

    } catch (error) {
        console.error("Error during polling:", error);
        throw error; // Rethrow error to stop polling
    }
  }

  // If loop finishes without success
  throw new Error("Prediction timed out after multiple polling attempts.");
}

// Optional: Listener for extension installation/update for setup tasks
chrome.runtime.onInstalled.addListener(() => {
  console.log("Kokoro TTS Reader MVP installed/updated.");
  // Setup default settings in chrome.storage.local if needed
}); 