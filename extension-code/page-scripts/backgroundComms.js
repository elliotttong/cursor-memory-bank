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
    chrome.runtime.sendMessage({ 
        action: "requestTTS", 
        text: sentence.text, 
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
          handleReceivedAudio(message.sentenceIndex, message.audioDataUrl, message.wordTimestamps);
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