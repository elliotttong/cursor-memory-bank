import * as state from './pageState.js';
// Import necessary handlers from playbackEngine (will be created later)
import { handleReceivedAudio, stopPlaybackAndResetState } from './playbackEngine.js';

// New function to request audio for a specific sentence index
export function requestSentenceAudio(index) {
    if (index < 0 || index >= state.sentenceSegments.length) {
        console.log("Index out of bounds, not requesting sentence:", index);
        return; 
    }
    const sentence = state.sentenceSegments[index];
    console.log(`Requesting audio+timestamps for sentence ${index}: "${sentence.text.substring(0,50)}..."`);
    console.log(`   (API Text: "${sentence.cleanedTextForApi.substring(0,50)}...")`);
    chrome.runtime.sendMessage({ 
        action: "requestTTS", 
        text: sentence.cleanedTextForApi,
        sentenceIndex: index 
    }, (response) => {
       // Background now sends separate message on completion/error
    });
}

// Listener for messages from background 
export function setupBackgroundListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log(`[${new Date().toLocaleTimeString()}] Content listener received message:`, JSON.parse(JSON.stringify(message))); 
        
        if (message.action === "playAudioWithTimestamps") {
          // Check if we received raw audio data instead of an object URL
          if (message.base64AudioData && message.contentType) {
            try {
              // Convert base64 to Blob
              const byteCharacters = atob(message.base64AudioData);
              const byteArrays = [];
              const sliceSize = 512;
              
              for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
              }
              
              const blob = new Blob(byteArrays, { type: message.contentType });
              const audioObjectURL = URL.createObjectURL(blob);
              console.log(`Created Object URL from base64 data: ${audioObjectURL}`);
              
              // Call the playback handler with the created object URL
              handleReceivedAudio(message.sentenceIndex, audioObjectURL, message.wordTimestamps);
            } catch (error) {
              console.error(`Error creating Blob/ObjectURL in content script: ${error.message}`);
              // Pass the error to the error handler
              chrome.runtime.sendMessage({ 
                action: "sentenceError", 
                message: `Failed to create object URL in content script: ${error.message}`, 
                sentenceIndex: message.sentenceIndex 
              });
              if (message.sentenceIndex === state.currentSentenceIndex) {
                stopPlaybackAndResetState();
              }
            }
          } else if (message.audioObjectURL) {
            // Legacy support for direct object URL (should not happen with updated background script)
            console.warn('Received deprecated audioObjectURL format. This should not happen with updated background script.');
            handleReceivedAudio(message.sentenceIndex, message.audioObjectURL, message.wordTimestamps);
          } else {
            console.error('Received playAudioWithTimestamps message without valid audio data');
            chrome.runtime.sendMessage({ 
              action: "sentenceError", 
              message: "Invalid audio data format received", 
              sentenceIndex: message.sentenceIndex 
            });
          }
        }
        else if (message.action === "sentenceError") {
           console.error(`Error received from background for sentence ${message.sentenceIndex}: ${message.message}`);
           if (message.sentenceIndex === state.currentSentenceIndex) {
               stopPlaybackAndResetState(); 
               // TODO: Update UI feedback (requires importing UI/DOM utils)
               const playPauseButton = document.getElementById('kokoro-play-pause-button');
               if(playPauseButton) playPauseButton.textContent = "Error";
           }
        } 
        else if (message.action === "apiError") { 
           console.error(`API Error from background: ${message.message}`);
           stopPlaybackAndResetState();
           // TODO: Update UI feedback (requires importing UI/DOM utils)
           const playPauseButton = document.getElementById('kokoro-play-pause-button');
           if(playPauseButton) playPauseButton.textContent = "API Key Missing"; 
        }
      });
} 