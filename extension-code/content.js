console.log("Kokoro TTS Content Script Loaded.");

let audioPlayer = null;
let currentHighlightIndex = -1;
let segmentedText = []; // Structure: [{ type: 'sentence'/'word', text: '...', element: node }, ...]
let timingData = null; // To be populated based on T08

// --- T05: UI Placeholder Injection ---
function injectWidget() {
  console.log("Attempting to inject widget...");
  const widgetExists = document.getElementById('kokoro-tts-widget');
  if (widgetExists) {
    console.log("Widget already exists.");
    return;
  }

  // Ensure body exists before appending
  if (!document.body) {
      console.error("document.body not found, cannot inject widget yet.");
      // Optionally retry after a delay
      // setTimeout(injectWidget, 100);
      return;
  }

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'kokoro-tts-widget-container'; 
  // Use iframe to isolate widget CSS/JS if needed, simpler div for MVP
  const widget = document.createElement('div');
  widget.id = 'kokoro-tts-widget';
  widget.innerHTML = `
    <button id="kokoro-play-pause-button">Play</button>
    <span>Kokoro TTS</span>
  `;
  
  widgetContainer.appendChild(widget);
  document.body.appendChild(widgetContainer);

  const playPauseButton = document.getElementById('kokoro-play-pause-button');
  if (playPauseButton) {
      playPauseButton.addEventListener('click', handlePlayPauseClick);
  }
  console.log("Widget Injected.");
}

// --- Wait for DOM ready before injecting ---
if (document.readyState === 'loading') {  // Check if loading already complete
    document.addEventListener('DOMContentLoaded', injectWidget);
} else {  // Handle cases where script runs after DOMContentLoaded
    injectWidget();
}

// --- T02: Communication & T04/T09/T12: Playback Control ---

function handlePlayPauseClick() {
  console.log("Play/Pause clicked");
  const button = document.getElementById('kokoro-play-pause-button');
  
  if (!audioPlayer || audioPlayer.paused) {
      // If no audio or paused, start/resume
      if (audioPlayer && !audioPlayer.src) {
          // If player exists but no source, initiate TTS
          initiateTTS();
      } else if (audioPlayer) {
          // If player exists and has source (i.e., is paused)
          audioPlayer.play();
          button.textContent = "Pause";
          startSyncLoop(); // Resume sync
      } else {
           // If player doesn't exist
           initiateTTS();
      }
  } else {
      // If playing, pause
      audioPlayer.pause();
      button.textContent = "Play";
      stopSyncLoop(); // Pause sync
  }
}

function initiateTTS() {
  console.log("Initiating TTS request...");
  const textToRead = getTextToRead(); // T06 placeholder
  if (!textToRead) {
      console.log("No text found/selected to read.");
      return;
  }
  
  // Prepare for playback
  segmentedText = processText(textToRead); // T06 placeholder
  setupHighlighting(segmentedText); // T07 placeholder
  
  const playPauseButton = document.getElementById('kokoro-play-pause-button');
  if(playPauseButton) playPauseButton.textContent = "Loading...";
  if(playPauseButton) playPauseButton.disabled = true;

  // Send text to background for TTS (T02)
  chrome.runtime.sendMessage({ action: "requestTTS", text: textToRead }, (response) => {
    if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        if(playPauseButton) playPauseButton.textContent = "Error";
        // Reset button state after a delay? 
        return;
    }
    
    console.log("Response from background:", response);
    if (response && response.status === "success") {
      // We might get audio source directly here or via separate message
      console.log("TTS request successful (background response)");
      // Playback will be triggered by the 'playAudio' message listener below
    } else {
      console.error("TTS request failed:", response?.message);
      if(playPauseButton) playPauseButton.textContent = "Error";
       // Reset button state
       setTimeout(() => {
            if(playPauseButton) playPauseButton.textContent = "Play";
            if(playPauseButton) playPauseButton.disabled = false;
       }, 2000);
    }
  });
}

// Listener for messages from background (T02)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.action === "playAudio") {
    playAudio(message.audioSource);
  }
  // Add other message handlers (e.g., for timing data)
});

// --- T04: Basic Audio Playback ---
function playAudio(audioSource) {
  console.log("playAudio called with source:", audioSource);
  if (!audioPlayer) {
    audioPlayer = new Audio();
    audioPlayer.addEventListener('ended', handleAudioEnded);
    audioPlayer.addEventListener('error', handleAudioError);
    audioPlayer.addEventListener('timeupdate', handleTimeUpdate); // For T09
  }
  // TODO: Handle different audioSource types (URL, base64 data URI)
  audioPlayer.src = audioSource; 
  audioPlayer.play()
    .then(() => {
        console.log("Audio playback started.");
        const playPauseButton = document.getElementById('kokoro-play-pause-button');
        if(playPauseButton) playPauseButton.textContent = "Pause";
        if(playPauseButton) playPauseButton.disabled = false;
        startSyncLoop(); // Start sync (T09)
    })
    .catch(error => {
        console.error("Audio playback failed:", error);
        const playPauseButton = document.getElementById('kokoro-play-pause-button');
        if(playPauseButton) playPauseButton.textContent = "Error";
        if(playPauseButton) playPauseButton.disabled = false;
    });
}

function handleAudioEnded() {
    console.log("Audio playback finished.");
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if(playPauseButton) playPauseButton.textContent = "Play";
    if(playPauseButton) playPauseButton.disabled = false;
    stopSyncLoop(); // Stop sync
    clearHighlights(); // T07 placeholder
    // Reset state
    currentHighlightIndex = -1;
    segmentedText = [];
    timingData = null;
}

function handleAudioError(event) {
    console.error("Audio playback error:", event);
    // Log more details if available
    if (audioPlayer && audioPlayer.error) {
        console.error("MediaError details:", audioPlayer.error);
        console.error(`- Code: ${audioPlayer.error.code}`);
        console.error(`- Message: ${audioPlayer.error.message}`);
    }
    stopSyncLoop(); // Stop sync if playback fails
    // Maybe update UI state
}

// --- Placeholder Functions for Later Phases ---

// T06: Text Extraction / Processing
function getTextToRead() {
    // MVP: Force simple text for API debugging
    console.log("Attempting to get text to read (FORCING SIMPLE TEXT)...");
    const simpleText = "Hello world. This is a test.";
    console.log(`Using forced simple text: ${simpleText}`);
    return simpleText;
    
    /* // Original fallback logic commented out
    let text = null;
    const p = document.querySelector('p'); // Still basic
    if (p && p.innerText.trim()) {
        console.log("Found text in first <p> element.");
        text = p.innerText;
    } else if (document.body && document.body.innerText.trim()) {
        console.warn("Could not find text in <p>, falling back to document.body.innerText (may be inaccurate).");
        // Limit body text length for MVP to avoid overwhelming API/processing
        text = document.body.innerText.substring(0, 2000); 
    }

    if (!text) {
         console.error("Could not find any suitable text on the page.");
    }
    return text; 
    */
}

function processText(text) {
    console.log("Processing text (T06 - Basic Sentence/Word Split)...");

    // Basic sentence split using regex (handles ., !, ? followed by space or end of string)
    // This is naive and won't handle abbreviations like Mr. or e.g. correctly.
    const sentences = text.match(/[^.!?]+[.!?\s]*(?:\s|$)/g) || [text]; 
    
    let segments = [];
    sentences.forEach((sentenceText, sentenceIndex) => {
        const trimmedSentence = sentenceText.trim();
        if (!trimmedSentence) return;

        // Add sentence segment
        segments.push({ 
            type: 'sentence', 
            text: trimmedSentence, 
            id: `s-${sentenceIndex}`, // Assign an ID
            element: null // Placeholder for DOM element reference (T07)
        });

        // Basic word split by spaces (also naive, doesn't handle punctuation well)
        const words = trimmedSentence.split(/\s+/);
        words.forEach((wordText, wordIndex) => {
            if (!wordText) return;
            // TODO: Clean punctuation from wordText for cleaner matching/highlighting?
            segments.push({ 
                type: 'word', 
                text: wordText, 
                id: `s${sentenceIndex}-w${wordIndex}`, // Assign an ID
                sentenceId: `s-${sentenceIndex}`, // Link word to sentence
                element: null // Placeholder for DOM element reference (T07)
            });
        });
    });

    console.log(`Processed text into ${segments.filter(s=>s.type==='sentence').length} sentences and ${segments.filter(s=>s.type==='word').length} words.`);
    return segments;
}

// T07: Highlighting Setup
function setupHighlighting(segments) {
    // TODO: Find/wrap text nodes corresponding to segments
    console.log("Setting up highlighting (placeholder)...");
    // This needs to find text on page and wrap words/sentences in spans,
    // then store references to those spans in the segments array.
}
function clearHighlights() {
    console.log("Clearing highlights (placeholder)...");
    // TODO: Remove highlighting classes/spans
     const highlightedElements = document.querySelectorAll('.kokoro-highlight-word, .kokoro-highlight-sentence');
    highlightedElements.forEach(el => el.classList.remove('kokoro-highlight-word', 'kokoro-highlight-sentence'));
}

// T09: Synchronization
let syncInterval = null;
function handleTimeUpdate() {
    if (!audioPlayer || audioPlayer.paused || !timingData) return; // Needs timing data (Option 1) or estimates (Option 4)
    
    // This is where the core logic from creative_phase_sync_logic.md goes
    const currentTime = audioPlayer.currentTime;
    // console.log(`TimeUpdate: ${currentTime}`); 

    // TODO: Implement Option 1 or Option 4 logic here based on currentTime
    // Find current word/sentence index based on timingData or estimates
    // let newIndex = findCurrentSegmentIndex(currentTime, timingData);
    // if (newIndex !== currentHighlightIndex) {
    //    updateHighlight(currentHighlightIndex, newIndex);
    //    currentHighlightIndex = newIndex;
    // }
}

function startSyncLoop() {
    // Alternative/Supplement to timeupdate for Option 4 (Polling)
    // if (syncInterval) clearInterval(syncInterval);
    // syncInterval = setInterval(handleTimeUpdateBasedOnPolling, 100); // Adjust interval as needed
    console.log("Sync loop started (placeholder - relying on timeupdate for now).");
}

function stopSyncLoop() {
    // if (syncInterval) clearInterval(syncInterval);
    // syncInterval = null;
    console.log("Sync loop stopped.");
}

function updateHighlight(oldIndex, newIndex) {
    console.log(`Updating highlight from ${oldIndex} to ${newIndex} (placeholder)`);
    // TODO: Remove highlight from old segment element
    // TODO: Add highlight to new segment element
} 