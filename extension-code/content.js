// Check if PaintWorklet is available and register our highlighter
if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule(chrome.runtime.getURL('highlight-painter.js'))
    .then(() => {
      console.log('Kokoro highlighter paint worklet registered.');
    })
    .catch(err => {
      console.error('Error registering Kokoro paint worklet:', err);
    });
} else {
  console.warn('CSS Paint API (Houdini) is not supported in this browser.');
}

console.log("Kokoro TTS Content Script Loaded.");

// --- Constants ---
const USE_TEST_SENTENCES = false; // Set to true to test tokenization

// --- Test Sentences for Tokenization --- (Step 1)
const TOKENIZER_TEST_SENTENCES = [
    "Sentence one. Simple punctuation.",
    "Sentence two: contractions like don't, won't, and can't.",
    "Sentence three ; spaced punctuation ! Number 123.",
    "Sentence four\nhas newlines\nand state-of-the-art hyphenation.",
    "Sentence five has repeated words like test test test.",
    "Sentence six ends abruptly", // No final punctuation
    "¿Sentence seven starts with odd punctuation?"
];

// --- State Variables ---
let audioPlayer = null;
let segmentedText = []; // Array of ALL segments (sentences and words)
let sentenceSegments = []; // Array of JUST sentence segments
let currentSentenceIndex = -1; 
let isPlaying = false;

// Store precise timings received from API
let currentWordTimestamps = []; // Structure: [{ text, start, end }, ...]
let nextAudioData = null; // { sentenceIndex: number, audioDataUrl: string, wordTimestamps: [] } | null

let currentHighlightedWord = null; // Stores the element of the currently highlighted word
// T18: State for tracking the currently highlighted sentence
let currentHighlightedSentenceId = null; 

let createdHighlightSpans = []; // T07 state
let isStoppingOnError = false; // Flag to prevent error handling loops
let isInitialized = false; // <<< Add initialization flag

// --- NEW: Initialization Function ---
function initializeExtensionFeatures() {
    console.log(">>> ENTERED initializeExtensionFeatures function."); // <<< STEP 1: Confirm Entry

    isInitialized = false; 
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    
    // <<< STEP 2: Check Button Access
    if (!playPauseButton) {
        console.error("[Initialize] Play/Pause button not found immediately. Widget injection might be delayed or failed.");
        // Optionally retry initialization after a short delay
        // setTimeout(initializeExtensionFeatures, 200);
        // return; // Stop if button not found yet
    } else {
        console.log("[Initialize] Play/Pause button found.");
        playPauseButton.disabled = true; // Disable button during init
    }
    // ---------------------------
    
    let textToRead = null;
    let targetElement = null;
    try {
        console.log(">>> ENTERED initializeExtensionFeatures TRY block."); // <<< STEP 3: Log Try Entry

        // Get text first
        const extractionResult = getTextToRead(); 
        textToRead = extractionResult.textToRead;
        targetElement = extractionResult.targetElement;

        if (!textToRead || !targetElement) { 
            console.warn("Initialization: No text found or target element missing. Listeners won't be attached yet.");
            return; // Stop initialization if no text
        }
        
        // Process and store segments globally
        const { cleanedSentences, allSegments } = processText(textToRead, false); // Not test mode
        segmentedText = allSegments;
        sentenceSegments = cleanedSentences;

        if (sentenceSegments.length === 0) {
            console.warn("Initialization: No sentences found after processing text. Listeners won't be attached.");
            return; // Stop if no sentences
        }

        // Setup highlighting spans and ATTACH LISTENERS
        setupHighlighting(segmentedText, targetElement, false);
        console.log("Initialization complete. Spans created and listeners attached.");
        isInitialized = true; // <<< Set flag to true on SUCCESS
        if(playPauseButton) playPauseButton.disabled = false; // <<< Enable button on success

    } catch (error) {
        console.error("Error during extension feature initialization:", error);
        // Reset state in case of partial failure
        segmentedText = [];
        sentenceSegments = [];
        createdHighlightSpans = [];
        isInitialized = false; // <<< Ensure flag is false on error
        if(playPauseButton) { // <<< Keep button disabled on error
             playPauseButton.textContent = "Init Error";
             playPauseButton.disabled = true;
        }
    }
}
// --------------------------------

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
      playPauseButton.disabled = true; // <<< Start disabled
      playPauseButton.addEventListener('click', handlePlayPauseClick);
  }
  console.log("Widget Injected.");
}

// --- Wait for DOM ready before injecting & Initializing ---
if (document.readyState === 'loading') { 
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOMContentLoaded listener: START");
        console.log("DOMContentLoaded listener: Calling injectWidget...");
        injectWidget();
        console.log("DOMContentLoaded listener: injectWidget finished.");
        console.log("DOMContentLoaded listener: Calling initializeExtensionFeatures...");
        initializeExtensionFeatures(); 
        console.log("DOMContentLoaded listener: initializeExtensionFeatures finished (or call initiated).");
        console.log("DOMContentLoaded listener: END");
    });
} else {  
    console.log("DOMContentLoaded already fired: START");
    console.log("DOMContentLoaded already fired: Calling injectWidget...");
    injectWidget();
    console.log("DOMContentLoaded already fired: injectWidget finished.");
    console.log("DOMContentLoaded already fired: Calling initializeExtensionFeatures...");
    initializeExtensionFeatures();
    console.log("DOMContentLoaded already fired: initializeExtensionFeatures finished (or call initiated).");
    console.log("DOMContentLoaded already fired: END");
}

// --- T02/T04/T12: Playback Control & Sentence Logic --- 

function handlePlayPauseClick() {
  console.log("Play/Pause clicked");
  if (!isInitialized) {
      console.warn("[handlePlayPauseClick] Ignored - Not initialized yet.");
      return;
  }
  const button = document.getElementById('kokoro-play-pause-button');
  
  if (!isPlaying) {
      // --- Start playing --- 
      if (currentSentenceIndex === -1) {
           // Start from the beginning - text should already be processed
           initiateTTS(0); // <<< Call simplified initiateTTS
      } else {
          // Resume playback (if audioPlayer exists and is paused)
          if (audioPlayer && audioPlayer.paused) {
              audioPlayer.play();
              // isPlaying state and button text handled by 'play' event listener
          } else {
             // This case shouldn't happen if state is managed correctly
             console.warn("Play clicked, not playing, but currentSentenceIndex is not -1 and player not paused?");
             initiateTTS(); // Reset and start over
          }
      }
  } else {
      // --- Pause playing --- 
      if (audioPlayer) {
          audioPlayer.pause();
          // isPlaying state and button text handled by 'pause' event listener
      }
  }
}

// Modified: Only sets index and requests audio
function initiateTTS(startIndex = 0) { 
  console.log(`Requesting TTS start from index: ${startIndex}`);

  // Ensure initialization happened and we have segments
  if (sentenceSegments.length === 0) {
      console.error("[initiateTTS] No sentences available. Initialization might have failed. Trying to re-initialize...");
      // Attempt re-initialization as a fallback
      initializeExtensionFeatures();
      if (sentenceSegments.length === 0) {
          console.error("[initiateTTS] Re-initialization failed. Cannot start TTS.");
          stopPlaybackAndResetState(); // Ensure clean state
          return;
      }
      console.log("[initiateTTS] Re-initialization successful.");
  }

  // Stop any existing playback first (safer)
  stopPlaybackAndResetState();
  
  // Set target index and request audio
  if (startIndex < 0 || startIndex >= sentenceSegments.length) {
      console.warn(`[initiateTTS] Invalid startIndex ${startIndex}. Defaulting to 0.`);
      startIndex = 0;
  }
  currentSentenceIndex = startIndex; 

  const playPauseButton = document.getElementById('kokoro-play-pause-button');
  if(playPauseButton) {
       playPauseButton.textContent = "Loading..."; 
       playPauseButton.disabled = true;
  }

  requestSentenceAudio(currentSentenceIndex); // Request the target start index
}

// New function to request audio for a specific sentence index
function requestSentenceAudio(index) {
    if (index < 0 || index >= sentenceSegments.length) {
        console.log("Index out of bounds, not requesting sentence:", index);
        return; 
    }
    const sentence = sentenceSegments[index];
    console.log(`Requesting audio+timestamps for sentence ${index}: "${sentence.text.substring(0,50)}..."`);
    chrome.runtime.sendMessage({ 
        action: "requestTTS", 
        text: sentence.text, 
        sentenceIndex: index 
    }, (response) => {
       // Background now sends separate message on completion/error
    });
}

// Listener for messages from background (T02 - Updated action name)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`[${new Date().toLocaleTimeString()}] Content listener received message:`, JSON.parse(JSON.stringify(message))); 
  console.log("Message received in content script:", message);
  
  if (message.action === "playAudioWithTimestamps") { // ** Updated action name **
    handleReceivedAudio(message.sentenceIndex, message.audioDataUrl, message.wordTimestamps);
  }
  else if (message.action === "sentenceError") {
     console.error(`Error received from background for sentence ${message.sentenceIndex}: ${message.message}`);
     if (message.sentenceIndex === currentSentenceIndex) {
         stopPlaybackAndResetState(); 
         const playPauseButton = document.getElementById('kokoro-play-pause-button');
         if(playPauseButton) playPauseButton.textContent = "Error";
     }
  } 
  else if (message.action === "apiError") { // Handle API key missing error
     console.error(`API Error from background: ${message.message}`);
     stopPlaybackAndResetState();
     const playPauseButton = document.getElementById('kokoro-play-pause-button');
     if(playPauseButton) playPauseButton.textContent = "API Key Missing"; // Or similar
  }
});

// Updated function to handle received audio data AND TIMESTAMPS
function handleReceivedAudio(index, dataUrl, timestamps) {
    console.log(`Received audio data and ${timestamps?.length || 0} timestamps for sentence index ${index}`);
    // --- DEBUG LOG: Log the received timestamps array --- 
    console.log(`[DEBUG] Timestamps received for sentence ${index}:`, JSON.parse(JSON.stringify(timestamps)));
    // --- DEBUG LOG: Log the beginning of the dataUrl --- 
    console.log(`[DEBUG] Received dataUrl (start): ${dataUrl?.substring(0, 50)}...`);
    // -------------------------------------------------
    
    if (!dataUrl || !timestamps) {
        console.error("Received incomplete audio data from background for sentence:", index);
        if (index === currentSentenceIndex) stopPlaybackAndResetState();
        return;
    }

    const audioData = { sentenceIndex: index, audioDataUrl: dataUrl, wordTimestamps: timestamps };

    if (index === currentSentenceIndex) {
        if (!isPlaying) {
            playAudio(audioData.audioDataUrl, audioData.wordTimestamps); 
        } else {
            console.warn(`Received audio for current index ${index} while already playing. Storing as next.`);
            nextAudioData = audioData; 
        }
    } 
    else if (index === currentSentenceIndex + 1) {
        console.log(`[PRE-FETCH] Storing data for next sentence ${index}. Overwriting previous nextAudioData:`, nextAudioData);
        nextAudioData = audioData;
    } 
    else {
        console.warn(`Received audio for unexpected sentence index ${index} (current: ${currentSentenceIndex})`);
    }
}

// --- T04: Basic Audio Playback (Modified to accept timestamps) ---

// --- Define ALL handlers BEFORE playAudio uses them ---

function handleAudioPlay() {
    console.log(`Playback started/resumed for sentence ${currentSentenceIndex}`);
    isPlaying = true;
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if (playPauseButton) {
        playPauseButton.textContent = "Pause";
        playPauseButton.disabled = false;
    }
    startSyncLoop();
}

function handleAudioPause() {
  console.log('Playback paused for sentence', currentSentenceIndex);
  isPlaying = false;
  stopSyncLoop(); // Stop polling when paused
  // Update button text
  const playPauseButton = document.getElementById('kokoro-play-pause-button');
  if (playPauseButton) {
      playPauseButton.textContent = 'Play';
      playPauseButton.disabled = false;
  }
}

function handleAudioEnded() {
    console.log(`Audio finished for sentence ${currentSentenceIndex}`);
    isPlaying = false; 
    currentWordTimestamps = []; 
    stopSyncLoop(); // Stop polling
    
    console.log(`[AUDIO END] Checking nextAudioData before decision:`, nextAudioData);

    const expectedNextIndex = currentSentenceIndex + 1;
    if (nextAudioData && nextAudioData.sentenceIndex === expectedNextIndex) {
        console.log(`[AUDIO END] Found buffered audio for next sentence ${expectedNextIndex}. Playing.`);
        currentSentenceIndex++; 
        updateSentenceHighlight(currentSentenceIndex); // T18: Update sentence highlight for next sentence
        const nextData = nextAudioData;
        nextAudioData = null; 
        playAudio(nextData.audioDataUrl, nextData.wordTimestamps);
    } 
    else if (expectedNextIndex < sentenceSegments.length) {
         console.log(`[AUDIO END] No buffered audio found for sentence ${expectedNextIndex}. Waiting...`);
         currentSentenceIndex++; 
         updateSentenceHighlight(currentSentenceIndex); // T18: Update sentence highlight even if waiting
         const playPauseButton = document.getElementById('kokoro-play-pause-button');
         if (playPauseButton) playPauseButton.textContent = "Buffering...";
    } 
    else { 
        console.log("[AUDIO END] Finished playing all sentences.");
        stopPlaybackAndResetState();
    }
}

function handleAudioError(event) {
    console.error(`Audio playback error during sentence ${currentSentenceIndex}:`, event);

    // --- Prevent Recursive Error Handling --- 
    if (isStoppingOnError) {
        console.warn("[handleAudioError] Already stopping due to a previous error. Ignoring recursive call.");
        return;
    }
    isStoppingOnError = true;
    // ----------------------------------------

    stopSyncLoop(); // Stop polling on error
    
    // Log details from the standard audio error event if available
    if (audioPlayer && audioPlayer.error) {
        console.error("MediaError details:", audioPlayer.error);
        console.error(`- Code: ${audioPlayer.error.code}`);
        console.error(`- Message: ${audioPlayer.error.message}`);
    } 
    // Log details if the error came from the play() promise rejection
    else if (event.errorDetails) { 
         console.error("Promise rejection details:", event.errorDetails);
    }
    
    stopPlaybackAndResetState(); 
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if (playPauseButton) playPauseButton.textContent = "Error";
    
    // --- Reset the flag AFTER attempting to stop --- 
    // isStoppingOnError = false; // Moved reset to end of stopPlaybackAndResetState
    // --------------------------------------------
}

// --- The function that uses the handlers ---
function playAudio(audioDataUrl, timestamps) {
  console.log(`playAudio called for sentence ${currentSentenceIndex} with ${timestamps.length} timestamps.`);
  
  // --- Always create a NEW Audio element --- 
  console.log("Creating new Audio element for playback...");
  audioPlayer = new Audio(); // Create fresh element
  console.log(" -> New Audio element created.");
  
  // Attach listeners to the new element
  audioPlayer.addEventListener('ended', handleAudioEnded);
  console.log(" -> Added 'ended' listener.");
  audioPlayer.addEventListener('error', handleAudioError);
  console.log(" -> Added 'error' listener.");
  audioPlayer.addEventListener('play', handleAudioPlay); 
  console.log(" -> Added 'play' listener.");
  audioPlayer.addEventListener('pause', handleAudioPause);
  console.log(" -> Added 'pause' listener.");
  audioPlayer.addEventListener('loadstart', () => { console.log(`Audio event: loadstart for sentence ${currentSentenceIndex}`); });
  console.log(" -> Added 'loadstart' listener.");
  audioPlayer.addEventListener('loadeddata', () => { console.log(`Audio event: loadeddata for sentence ${currentSentenceIndex}`); });
  console.log(" -> Added 'loadeddata' listener.");
  // Add other listeners if needed ('canplay', etc.)
  console.log(" -> Finished adding listeners.");
  // -----------------------------------------
  
  // Store the precise timings for the currently playing sentence
  currentWordTimestamps = timestamps;
  
  console.log(`Setting audioPlayer.src for sentence ${currentSentenceIndex}`);
  audioPlayer.src = audioDataUrl; 
  
  // --- REMOVE EXPLICIT LOAD CALL (Still removed) --- 

  console.log(`Calling audioPlayer.play() for sentence ${currentSentenceIndex}`);
  try {
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
          playPromise.then(_ => {
              // 'play' event listener (handleAudioPlay) will handle success state changes
              console.log(`audioPlayer.play() promise resolved for sentence ${currentSentenceIndex}`);
          }).catch(error => {
              // Log error from the promise specifically
              console.error(`audioPlayer.play() promise rejected for sentence ${currentSentenceIndex}:`, error);
              // Explicitly call our error handler to ensure state reset
              handleAudioError({ // Simulate an event object
                  type: 'error', 
                  target: audioPlayer, 
                  errorDetails: error // Pass the actual promise rejection error
              }); 
          });
      }
  } catch (error) {
      // Catch synchronous errors during the play() call itself
      console.error(`Synchronous error calling audioPlayer.play() for sentence ${currentSentenceIndex}:`, error);
       handleAudioError({ type: 'error', target: audioPlayer, errorDetails: error }); 
  }

  // Pre-fetch the NEXT sentence (logic remains similar)
  const nextIndex = currentSentenceIndex + 1;
  if (nextIndex < sentenceSegments.length) {
      if (!nextAudioData || nextAudioData.sentenceIndex !== nextIndex) {
          requestSentenceAudio(nextIndex);
      } else {
          console.log(`Audio for next sentence ${nextIndex} already buffered.`);
      }
  } else {
      console.log("Last sentence is playing, no more to pre-fetch.");
  }
}

// stopPlaybackAndResetState: Clear timestamps
function stopPlaybackAndResetState() {
    console.log("Stopping playback and resetting state.");
    if (audioPlayer) {
        // --- Remove the existing audio element completely --- 
        try {
            if (!audioPlayer.paused) {
                audioPlayer.pause(); 
            }
            // Remove listeners (optional but good practice before removing element)
            audioPlayer.removeEventListener('ended', handleAudioEnded);
            audioPlayer.removeEventListener('error', handleAudioError);
            audioPlayer.removeEventListener('play', handleAudioPlay); 
            audioPlayer.removeEventListener('pause', handleAudioPause);
            // ... remove other listeners if added ...

            // audioPlayer.src = ""; // No longer needed
            if (audioPlayer.parentNode) { // Check if it's in the DOM
                audioPlayer.remove(); // Remove from DOM
                console.log("[Reset] Removed audio player element from DOM.");
            }
            audioPlayer = null; // Discard the reference
            console.log("[Reset] Set audioPlayer reference to null.");
        } catch (e) {
            console.error("[Reset] Error removing audio player:", e);
            audioPlayer = null; // Ensure reference is cleared even on error
        }
        // ---------------------------------------------------
    }
    isPlaying = false;
    currentSentenceIndex = -1;
    nextAudioData = null;
    currentWordTimestamps = [];
    stopSyncLoop(); 
    clearHighlights(); 
    currentHighlightedWord = null;
    isStoppingOnError = false; 
    lastWordElement = null; // Also reset this
    
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if (playPauseButton) {
        playPauseButton.textContent = "Play";
        playPauseButton.disabled = false;
    }
    
    console.log("[Reset] State reset complete. isStoppingOnError set to false.");
}

// --- Placeholder Functions for Later Phases ---

// T06: Text Extraction / Processing
function getTextToRead() {
    // MVP TEMPORARY APPROACH: Use Readability directly in content script.
    // LONG TERM: Move this to Offscreen Document (See M06 Analysis)
    console.log("Attempting text extraction using Readability.js (Temporary Content Script Method)...");
    
    let textToRead = null;
    let targetElement = null; // Target for highlighting setup
    
    try {
        // Clone the document to avoid modifying the live DOM during parsing
        const documentClone = document.cloneNode(true);
        const reader = new Readability(documentClone);
        const article = reader.parse();

        if (article && article.textContent) {
            console.log(`Readability extracted article: "${article.title}"`);
            textToRead = article.textContent.trim(); // Use the plain text content for TTS
            
            // --- TEMPORARY HIGHLIGHTING TARGET --- 
            // For now, use document.body to allow setupHighlighting to run.
            // This is NOT ideal as it might wrap text outside the main article.
            // TODO: Refine targetElement selection later, possibly by finding 
            // the main article container identified by Readability in the *original* document.
            targetElement = document.body; 
            // -------------------------------------

            console.log(`Using extracted text (length ${textToRead?.length}) for TTS.`);
            console.log(`Highlighting target (temporary):`, targetElement);
            // console.log(`Text starts: ${textToRead?.substring(0, 150)}...`); // Log more text

        } else {
            console.warn("Readability could not parse or find main content.");
        }

    } catch (error) {
        console.error("Error during Readability parsing:", error);
        textToRead = null;
        targetElement = null;
    }

    // --- UI Feedback --- 
    if (!textToRead) {
         console.error("Could not extract suitable text using Readability.");
         const playPauseButton = document.getElementById('kokoro-play-pause-button');
         if(playPauseButton) {
            playPauseButton.textContent = "No Text";
            setTimeout(() => {
                 if(playPauseButton.textContent === "No Text") { 
                     playPauseButton.textContent = "Play";
                     playPauseButton.disabled = false;
                 }
            }, 2000);
         }
    }
    
    // Return text for TTS and the (temporary) element for highlighting
    return { textToRead: textToRead, targetElement: targetElement }; 
}

function processText(text, isTestMode = false) { // Accept test mode flag
    console.log("Processing text (T06 - Reverted to Word/Punct Only)...", isTestMode ? "[TEST MODE]" : "");

    // Reverted Regex logic for sentence splitting - might need refinement later
    const rawSentences = text.match(/[^.!?¿]+[.!?¿\s]*(?:\s|$)/g) || [text]; // Added ¿ back
    
    let segments = [];
    let sentenceCounter = 0; 
    let wordCounter = 0; // Overall word/punct counter

    rawSentences.forEach((rawSentenceText, rawSentenceIndex) => {
        const trimmedSentence = rawSentenceText.trim().replace(/\s+/g, ' '); 
        if (!trimmedSentence) return; 

        const sentenceId = `s-${sentenceCounter}`; 
        // Add the sentence segment itself (though we don't wrap it)
        segments.push({ 
            type: 'sentence', 
            text: trimmedSentence, 
            id: sentenceId, 
            element: null
        });
        
        if (isTestMode) {
            console.log(`--- [TOKENIZER TEST] Processing Sentence ${sentenceCounter}: "${trimmedSentence}" ---`);
        }

        // --- Refined Regex to handle hyphenated words/dates --- 
        const wordsAndPunctuation = trimmedSentence.match(/([\w'-]+(?:-\w+)*)|[.,!?;:¿]/g) || [];
        // --------------------------------------------------
        let sentenceWordSegments = []; // Temporary array for logging

        wordsAndPunctuation.forEach((wordText, wordIndexWithinSentence) => {
            if (!wordText) return; 
            
            // Determine type based on regex match (simple check)
            const isWord = /^\w+$/.test(wordText);
            const segmentType = isWord ? 'word' : 'punctuation';
            
            // Reverted segment ID format (sX-wY)
            const segmentId = `${sentenceId}-w${wordIndexWithinSentence}`;
            const segment = {
                type: segmentType, 
                text: wordText, 
                id: segmentId, 
                sentenceId: sentenceId, 
                element: null 
            };
            segments.push(segment);
            if (isTestMode) { 
                sentenceWordSegments.push(segment);
            }
            wordCounter++;
        });

        if (isTestMode) {
            console.log(`--- [TOKENIZER TEST] Generated Segments (Sentence ${sentenceCounter}):`, JSON.parse(JSON.stringify(sentenceWordSegments)));
            console.log(`--------------------------------------------------------------------`);
        }

        sentenceCounter++; 
    });

    console.log(`Processed text into ${sentenceCounter} sentences and ${wordCounter} word/punctuation segments.`);
    if (!isTestMode) {
        console.log("First 10 word/punctuation segments:", segments.filter(s => s.type !== 'sentence').slice(0, 10));
    }
    return { cleanedSentences: segments.filter(seg => seg.type === 'sentence'), allSegments: segments };
}

// T07: Highlighting Setup
// Store references to created spans for easy clearing
function setupHighlighting(segments, targetElement, isTestMode = false) {
    console.log("Setting up highlighting for", segments.length, "segments in target:", targetElement, isTestMode ? "[TEST MODE]" : "");

    if (!targetElement) {
        console.error("Target element for highlighting not provided.");
        return;
    }

    // --- Use TreeWalker to find only Text nodes within the target ---
    const walker = document.createTreeWalker(
        targetElement, 
        NodeFilter.SHOW_TEXT,
        null, // No custom filter logic needed here
        false // Deprecated argument
    );

    let currentNode;
    let currentSegmentIndex = 0;
    
    // Store text nodes and their original content to reconstruct ranges accurately
    const textNodes = [];
    while (currentNode = walker.nextNode()) {
        // Ignore empty/whitespace-only nodes if necessary, but maybe not for accurate range calculation
        if (currentNode.nodeValue.trim()) { 
            textNodes.push({ node: currentNode, originalText: currentNode.nodeValue });
        }
    }
    
    // Now, iterate through segments and try to find them across the collected text nodes
    let nodeMap = []; // Map segments back to the nodes they span

    // Reverted: Filter out the sentence segments, wrap words and punctuation
    const segmentsToWrap = segments.filter(s => s.type === 'word' || s.type === 'punctuation');

    // Build a simplified text representation and map segments
    let simplifiedText = textNodes.map(tn => tn.originalText).join('');
    let searchStartInSimplified = 0;

    for (let i = 0; i < segmentsToWrap.length; i++) { // Iterate through segments to wrap
        const segment = segmentsToWrap[i];
        // We need to handle potential variations in whitespace during matching
        // For now, let's try a direct match first
        const segmentText = segment.text; 
        const foundIndex = simplifiedText.indexOf(segmentText, searchStartInSimplified);

        if (foundIndex !== -1) {
            const endIndex = foundIndex + segmentText.length;
            // Map this segment's range (foundIndex to endIndex in simplifiedText) 
            // back to the original text nodes and their internal offsets.
            
            let segmentStartNode = null, segmentStartOffset = -1;
            let segmentEndNode = null, segmentEndOffset = -1;
            let accumulatedLength = 0;

            for(let j = 0; j < textNodes.length; j++) {
                const nodeInfo = textNodes[j];
                const nodeLength = nodeInfo.originalText.length;
                const nodeStartGlobal = accumulatedLength;
                const nodeEndGlobal = accumulatedLength + nodeLength;

                // Check if segment starts in this node
                if (segmentStartOffset === -1 && foundIndex >= nodeStartGlobal && foundIndex < nodeEndGlobal) {
                    segmentStartNode = nodeInfo.node;
                    segmentStartOffset = foundIndex - nodeStartGlobal;
                }

                // Check if segment ends in this node
                if (segmentEndOffset === -1 && endIndex > nodeStartGlobal && endIndex <= nodeEndGlobal) {
                    segmentEndNode = nodeInfo.node;
                    segmentEndOffset = endIndex - nodeStartGlobal;
                    break; // Found end node, segment mapping complete for this segment
                }
                
                accumulatedLength += nodeLength;
            }

            if (segmentStartNode && segmentEndNode && segmentStartOffset !== -1 && segmentEndOffset !== -1) {
                 // Store the range info for later wrapping
                 nodeMap.push({ 
                     segment: segment, 
                     startNode: segmentStartNode, 
                     startOffset: segmentStartOffset,
                     endNode: segmentEndNode, 
                     endOffset: segmentEndOffset 
                 });
                 // Update search start for the next segment
                 searchStartInSimplified = endIndex;
            } else {
                if (!isTestMode) { 
                    console.warn(`[SetupHighlighting] Could not map segment '${segment.text.replace(/\s+/g, ' ')}' (type: ${segment.type}, index ${i}) accurately to text nodes.`);
                }
                // If mapping fails, try advancing the search start cautiously
                searchStartInSimplified += 1; 
            }
        } else {
             if (!isTestMode) {
                 console.warn(`[SetupHighlighting] Segment '${segment.text.replace(/\s+/g, ' ')}' (type: ${segment.type}, index ${i}) not found in target element's text content starting from index ${searchStartInSimplified}.`);
             }
             // If not found, advance search position past where it *should* have been? Risky.
             searchStartInSimplified += segmentText.length; // Try skipping over it
        }
    }

    // --- Now perform the wrapping based on the mapped ranges --- 
    let successfullyWrappedCount = 0;
    for (let i = nodeMap.length - 1; i >= 0; i--) {
        const mapInfo = nodeMap[i];
        try {
            const range = document.createRange();
            range.setStart(mapInfo.startNode, mapInfo.startOffset);
            range.setEnd(mapInfo.endNode, mapInfo.endOffset);

            // Defensive Check: Only wrap if range is within a single Text node
            if (mapInfo.startNode !== mapInfo.endNode || mapInfo.startNode.nodeType !== Node.TEXT_NODE) {
                if (!isTestMode) {
                    console.warn(`Skipping segment ${mapInfo.segment.id} ('${mapInfo.segment.text.replace(/\s+/g, ' ')}') because it spans across nodes or boundary is not a Text node.`);
                }
                continue; 
            }
            
            const span = document.createElement('span');
            // Reverted: Use segment ID (sX-wY format)
            span.id = mapInfo.segment.id; 
            // Base class + specific type class (kokoro-word, kokoro-punctuation)
            span.className = `kokoro-segment kokoro-${mapInfo.segment.type}`; 
            
            // T16/T18: Add data attribute for sentence ID (s-X format)
            span.dataset.sentenceId = mapInfo.segment.sentenceId;

            // T19/T20: Add listeners
            span.addEventListener('mouseover', handleSentenceHover);
            span.addEventListener('mouseout', handleSentenceHoverOut);
            span.addEventListener('click', handleSentenceClick);

            range.surroundContents(span); // This modifies the DOM

            mapInfo.segment.element = span; 
            createdHighlightSpans.push(span); 
            successfullyWrappedCount++; 

        } catch (e) {
             if (!isTestMode) {
                console.error(`Error wrapping segment ${mapInfo.segment.id} ('${mapInfo.segment.text.replace(/\s+/g, ' ')}'):`, e, mapInfo);
             }
        }
    }
    
    console.log(`Highlighting setup finished. Attempted to map ${nodeMap.length} segments. Successfully wrapped: ${successfullyWrappedCount}`);
}

function clearHighlights() {
    console.log("Clearing highlights via coordinates..."); // Updated log message
    
    try { 
        // --- Clear word highlight via coordinates --- 
        updateWordHighlightCoordinates(null); 
        lastWordElement = null; // Reset background check cache
        // ---------------------------------------------

        // --- Clear sentence highlight via coordinates --- 
        // updateSentenceHighlight(-1); // OLD, INCORRECT FUNCTION NAME - REMOVE THIS LINE
        updateSentenceHighlightCoordinates(-1); // CORRECT FUNCTION NAME
        // -------------------------------------------

        // --- Clear hover highlight variable --- 
        const targetElement = document.body;
        targetElement.style.setProperty('--kokoroHoverSentenceInfo', '');
        // -------------------------------------

    } catch (e) {
        console.error("[DEBUG] Error inside clearHighlights logic:", e);
    }
}

// --- T09: Synchronization (Using Polling with requestAnimationFrame)
let animationFrameId = null; // Store the ID for cancellation
let lastWordElement = null; // T18: Keep track of the last element for background color check

function pollingLoop() {
    // ---> NEW DEBUG LOG <---
    console.log(`[pollingLoop] Entered loop. animationFrameId=${animationFrameId}`);
    // ---------------------

    // If not playing, or player doesn't exist, stop the loop
    if (!isPlaying || !audioPlayer) {
        animationFrameId = null; // Clear the ID
        return;
    }

    // --- ADD SCROLL OFFSET UPDATE BACK HERE --- 
    const targetElement = document.body; 
    try {
        const currentScrollX = window.scrollX;
        const currentScrollY = window.scrollY;
        targetElement.style.setProperty('--kokoroScrollX', currentScrollX);
        targetElement.style.setProperty('--kokoroScrollY', currentScrollY);
    } catch (e) {
        console.error("[PollingLoop] Error setting scroll offset properties:", e);
    }
    // -----------------------------------------

    // --- UPDATE SENTENCE COORDINATES ---
    try {
        updateSentenceHighlightCoordinates(currentSentenceIndex);
    } catch (e) {
        console.error("[PollingLoop] Error updating sentence highlight coordinates:", e);
    }
    // ----------------------------------

    // ---> NEW DEBUG LOG <---
    console.log(`[pollingLoop] Calling handleTimeUpdate...`);
    // ---------------------
    // Call the existing logic to check time and update highlight
    handleTimeUpdate(); // This updates WORD coordinates

    // Schedule the next frame
    // ---> NEW DEBUG LOG <---
    console.log(`[pollingLoop] Requesting next animation frame...`);
    // ---------------------
    animationFrameId = requestAnimationFrame(pollingLoop);
    // ---> NEW DEBUG LOG <---
    console.log(`[pollingLoop] Next animation frame requested with ID: ${animationFrameId}`);
    // ---------------------
}

function handleTimeUpdate() {
    // ---> NEW DEBUG LOG <---
    console.log(`[handleTimeUpdate] Called. currentTime: ${audioPlayer?.currentTime?.toFixed(3)}, isPlaying: ${isPlaying}`);
    // ---------------------

    // Guard condition remains useful even with polling
    if (!isPlaying || !audioPlayer || currentWordTimestamps.length === 0) {
        // ---> NEW DEBUG LOG <---
        console.log(`[handleTimeUpdate] Returning early. isPlaying=${isPlaying}, audioPlayer=${!!audioPlayer}, timestamps=${currentWordTimestamps.length}`);
        // ---------------------
        return;
    }

    // ---> ADD CHECK: Don't run sync logic/logging in test mode <---
    if (USE_TEST_SENTENCES) return;
    // ------------------------------------------------------------

    const currentTime = audioPlayer.currentTime;
    const HIGHLIGHT_OFFSET = 0.1; // Delay highlighting by 100ms

    let activeWordTimestamp = null;
    for (const timing of currentWordTimestamps) {
        if (currentTime >= (timing.start + HIGHLIGHT_OFFSET) && currentTime < (timing.end + HIGHLIGHT_OFFSET)) {
            activeWordTimestamp = timing;
            break;
        }
    }

    // ---> NEW DEBUG LOG <---
    if (activeWordTimestamp) {
        console.log(`[handleTimeUpdate] Found active timestamp:`, JSON.parse(JSON.stringify(activeWordTimestamp)));
    } else {
        // console.log(`[handleTimeUpdate] No active timestamp found.`); // Potentially too noisy
    }
    // ---------------------

    let activeSegment = null;
    if (activeWordTimestamp) {
        // --- FIX SYNC MISMATCH: Use correct ID format ---
        // OLD: const expectedSegmentId = `s${currentSentenceIndex}-w${activeWordTimestamp.id}`;
        // const expectedSegmentId = `s-${currentSentenceIndex}-w-${activeWordTimestamp.id}`;
        // --- NEW APPROACH: Find segment by text content within the current sentence ---
        const currentSentenceSegmentId = `s-${currentSentenceIndex}`;
        activeSegment = segmentedText.find(seg => 
            seg.sentenceId === currentSentenceSegmentId && 
            (seg.type === 'word' || seg.type === 'punctuation') &&
            seg.text === activeWordTimestamp.text
            // TODO: If duplicates cause issues, we might need to involve activeWordTimestamp.id 
            // as a secondary check or track the last matched index within the sentence.
        );
        // ------------------------------------------------------------------------------
        
        // --- Keep the Debug Logging --- 
        if (activeSegment) {
             console.log(`[handleTimeUpdate - Text Match] Found active segment:`, {id: activeSegment.id, text: activeSegment.text, element: !!activeSegment.element});
        } else {
             // Log if timestamp found but segment not
             console.warn(`[handleTimeUpdate] SYNC MISMATCH - Found timestamp but NO segment for ID: ${activeWordTimestamp.id}`);
        }
        // ---------------------

        // REMOVED OLD MISMATCH WARNING - handled above
        // if (!activeSegment) { ... }
    }

    // T18: Update coordinate-based highlight for the word
    updateWordHighlightCoordinates(activeSegment);

    // T18: TODO - Call function to update sentence highlight coordinates later
    // updateSentenceHighlightCoordinates(currentSentenceIndex);
}

function startSyncLoop() {
    // ---> NEW DEBUG LOG <---
    console.log("[startSyncLoop] Sync loop initiated.");
    // ---------------------
    // Ensure we don't start multiple loops
    if (animationFrameId === null) {
        // ---> NEW DEBUG LOG <---
        console.log("[startSyncLoop] animationFrameId is null, starting pollingLoop.");
        // ---------------------
        pollingLoop(); // Start the loop
    } else {
        // ---> NEW DEBUG LOG <---
        console.log("[startSyncLoop] animationFrameId is NOT null, loop already running? ID:", animationFrameId);
        // ---------------------
    }
}

function stopSyncLoop() {
    // ---> NEW DEBUG LOG <---
    console.log(`[stopSyncLoop] Sync loop stop requested. Current animationFrameId: ${animationFrameId}`);
    // ---------------------
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        // Explicitly clear highlights via coordinates when stopping
        updateWordHighlightCoordinates(null); // Clear word coords
        updateSentenceHighlightCoordinates(-1); // Clear sentence coords
        animationFrameId = null;
    }
}

function updateHighlight(activeSegment) { 
    // console.log(`[UpdateHighlight] Called with activeSegment:`, activeSegment ? { id: activeSegment.id, text: activeSegment.text, element: activeSegment.element } : null);

    const newHighlightElement = activeSegment ? activeSegment.element : null;
    // console.log(`[UpdateHighlight] newHighlightElement:`, newHighlightElement);
    // console.log(`[UpdateHighlight] currentHighlightedWord (before):`, currentHighlightedWord);
    // console.log(`[UpdateHighlight] Comparison (new !== current):`, newHighlightElement !== currentHighlightedWord);

    if (newHighlightElement !== currentHighlightedWord) {
        // console.log(`[UpdateHighlight] --> Elements differ, proceeding with update.`);
        if (currentHighlightedWord) {
            // console.log(`[UpdateHighlight] Removing highlight from old element:`, currentHighlightedWord);
            currentHighlightedWord.classList.remove('kokoro-highlight-word');
            // console.log(`[UpdateHighlight] Class removed from old element.`);
        }
        if (newHighlightElement) {
            // console.log(`[UpdateHighlight] Checking if new element exists in DOM:`, newHighlightElement.id);
            const elementInDom = document.getElementById(newHighlightElement.id);
            // console.log(`[UpdateHighlight] Element in DOM check result:`, elementInDom);
            
            if (elementInDom) { 
                // console.log(`[UpdateHighlight] Adding highlight to new element:`, newHighlightElement);
                newHighlightElement.classList.add('kokoro-highlight-word');
                // console.log(`[UpdateHighlight] Class added to new element.`);
                // Optional Scroll
                // newHighlightElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            } else {
                // This warning helps if the span wasn't created properly
                console.warn(`[Highlight] Target element ${newHighlightElement.id} not found in DOM for segment '${activeSegment?.text}'.`); // Keep this warning
                newHighlightElement = null; // Explicitly nullify if not found
            }
        }
        // console.log(`[UpdateHighlight] Updating currentHighlightedWord to:`, newHighlightElement);
        currentHighlightedWord = newHighlightElement;
        // console.log(`[UpdateHighlight] currentHighlightedWord (after update):`, currentHighlightedWord);
    } 
    // else {
    //     console.log(`[UpdateHighlight] --> Elements are the same, no update needed.`);
    // }
} 

// --- T19: Hover Highlighting Logic (Houdini Version) ---
function handleSentenceHover(event) {
    if (!isInitialized) return;
    if (!event.target.dataset.sentenceId) return; 
    const sentenceId = event.target.dataset.sentenceId;
    const targetElement = document.body; 

    const currentSentenceId = currentSentenceIndex >= 0 ? `s-${currentSentenceIndex}` : null;
    if (sentenceId === currentSentenceId) return;

    // --- ADD SCROLL UPDATE ON HOVER START --- 
    try {
        const currentScrollX = window.scrollX;
        const currentScrollY = window.scrollY;
        targetElement.style.setProperty('--kokoroScrollX', currentScrollX);
        targetElement.style.setProperty('--kokoroScrollY', currentScrollY);
        // console.log(`[Hover In] Updated scroll: X=${currentScrollX}, Y=${currentScrollY}`); // DEBUG
    } catch (e) {
        console.error("[Hover In] Error setting scroll offset properties:", e);
    }
    // ---------------------------------------

    try {
        const spans = document.querySelectorAll(`span[data-sentence-id="${sentenceId}"]`);
        let hoverCoordString = ''; // Initialize

        if (spans.length > 0) {
            // --- Apply Line-Based Logic (copied & adapted from updateSentenceHighlightCoordinates) ---
            let allRects = [];
            spans.forEach(span => {
                const rects = span.getClientRects();
                for (let i = 0; i < rects.length; i++) {
                    allRects.push(rects[i]);
                }
            });

            if (allRects.length > 0) {
                const lines = {};
                const tolerance = 1;
                allRects.forEach(rect => {
                    if (rect.width === 0 || rect.height === 0) return;
                    const lineTop = Math.round(rect.top / tolerance) * tolerance;
                    if (!lines[lineTop]) {
                        lines[lineTop] = {
                            rects: [],
                            top: rect.top,
                            height: rect.height
                        };
                    }
                    lines[lineTop].rects.push(rect);
                    lines[lineTop].height = Math.max(lines[lineTop].height, rect.height);
                });

                const lineCoordStrings = [];
                for (const lineTopKey in lines) {
                    const line = lines[lineTopKey];
                    if (line.rects.length === 0) continue;

                    let minLeft = line.rects[0].left;
                    let maxRight = line.rects[0].right;

                    for (let i = 1; i < line.rects.length; i++) {
                        minLeft = Math.min(minLeft, line.rects[i].left);
                        maxRight = Math.max(maxRight, line.rects[i].right);
                    }

                    const lineWidth = maxRight - minLeft;
                    const lineTop = line.top;
                    const lineHeight = line.height;

                    if (lineWidth > 0 && lineHeight > 0) {
                        lineCoordStrings.push(`${minLeft},${lineTop},${lineWidth},${lineHeight}`);
                    }
                }
                hoverCoordString = lineCoordStrings.join(',');
            }
            // --- End Line-Based Logic ---
        } else {
            hoverCoordString = ''; // Clear if no spans found (edge case)
        }

        // Update the hover-specific CSS variable
        targetElement.style.setProperty('--kokoroHoverSentenceInfo', hoverCoordString);
        // console.log(`[Hover In] Set line-based hover coords for ${sentenceId}: ${hoverCoordString.substring(0,100)}...`); // Debug

    } catch (e) {
        console.error(`[Hover In] Error applying hover for ${sentenceId}:`, e);
        targetElement.style.setProperty('--kokoroHoverSentenceInfo', ''); // Clear on error
    }
}

function handleSentenceHoverOut(event) {
    if (!isInitialized) return;
    if (!event.target.dataset.sentenceId) return;
    const sentenceId = event.target.dataset.sentenceId; // Keep for potential debug logging
    const targetElement = document.body;

    try {
        targetElement.style.setProperty('--kokoroHoverSentenceInfo', '');
        // console.log(`[Hover Out] Cleared hover coords for ${sentenceId}`); // Debug
     } catch (e) {
        console.error(`[Hover Out] Error removing hover for ${sentenceId}:`, e);
    }
}

// --- T20: Click-to-Play Logic --- 
function handleSentenceClick(event) {
    if (!isInitialized) {
        console.warn("[handleSentenceClick] Ignored - Not initialized yet.");
        return;
    }
    if (!event.target.dataset.sentenceId) {
        console.warn("[Click] Clicked target missing sentenceId:", event.target);
        return;
    }
    const sentenceId = event.target.dataset.sentenceId;
    console.log(`[Click] Detected click on sentence: ${sentenceId}`);

    try {
        // Extract index from ID (e.g., "s-5" -> 5)
        const indexStr = sentenceId.split('-')[1];
        const clickedIndex = parseInt(indexStr, 10);

        if (isNaN(clickedIndex)) {
            console.error("[Click] Could not parse sentence index from ID:", sentenceId);
            return;
        }

        if (clickedIndex === currentSentenceIndex && isPlaying) {
            console.log("[Click] Clicked on currently playing sentence. Ignoring.");
            return; // Optional: Ignore click if already playing this sentence
        }

        if (clickedIndex < 0 || clickedIndex >= sentenceSegments.length) {
            console.error("[Click] Clicked index out of bounds:", clickedIndex);
            return;
        }

        console.log(`[Click] Starting playback from sentence index: ${clickedIndex}`);
        startPlaybackFromSentence(clickedIndex);

    } catch (e) {
        console.error("[Click] Error handling sentence click:", e);
    }
}

function startPlaybackFromSentence(index) {
    console.log(`Starting playback from sentence: ${index}`);
    
    // 1. Stop any current playback and reset relevant state
    stopPlaybackAndResetState(); // This now sets audioPlayer to null
    
    // --- Clear hover highlight --- 
    try {
        const targetElement = document.body;
        targetElement.style.setProperty('--kokoroHoverSentenceInfo', '');
        console.log("[Click->Start] Cleared hover highlight variable.");
    } catch(e) {
        console.error("[Click->Start] Error clearing hover highlight variable:", e);
    }
    // ---------------------------
    
    // 2. Set the new target sentence index
    currentSentenceIndex = index;

    // 3. Update UI immediately 
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if(playPauseButton) {
        playPauseButton.textContent = "Loading...";
        playPauseButton.disabled = true;
    }

    // 4. Request audio for the new sentence (REMOVE setTimeout)
    console.log("[startPlaybackFromSentence] Requesting audio directly.");
    requestSentenceAudio(currentSentenceIndex); 
}

// T18: New function to calculate and set word highlight coordinates
function updateWordHighlightCoordinates(activeSegment) {
    const targetElement = document.body; // Element where CSS variables are set
    let wordCoordString = '';
    let currentElemColor = 'rgb(255, 255, 255)'; // Default background

    const wordElement = activeSegment ? activeSegment.element : null;

    if (wordElement && document.getElementById(wordElement.id)) { // Check if element exists in DOM
        try {
            // Use getClientRects() to handle potential multi-line words
            const rects = wordElement.getClientRects();
            const coordStrings = [];
            if (rects && rects.length > 0) {
                for (let i = 0; i < rects.length; i++) {
                    const rect = rects[i];
                    // Format: x,y,w,h (relative to viewport)
                    coordStrings.push(`${rect.left},${rect.top},${rect.width},${rect.height}`);
                }
                wordCoordString = coordStrings.join(',');
                // console.log("[Coords] Word Coords:", wordCoordString); // Debug
            } else {
                 console.warn(`[Coords] getClientRects returned empty or null for word ${activeSegment?.id}`);
                 wordCoordString = '';
            }

            // Check background color only if the element changed to avoid spamming getComputedStyle
            if (wordElement !== lastWordElement) {
                try {
                     // Get background color of the PARENT element for better context
                    currentElemColor = window.getComputedStyle(wordElement.parentElement || targetElement).backgroundColor || 'rgb(255, 255, 255)';
                    targetElement.style.setProperty('--kokoroElemColor', currentElemColor);
                    // console.log("[Coords] Updated Elem Color:", currentElemColor); // Debug
                } catch (e) {
                    console.error(`Error getting background color for parent of ${activeSegment?.id}:`, e);
                     targetElement.style.setProperty('--kokoroElemColor', 'rgb(255, 255, 255)'); // Fallback
                }
                lastWordElement = wordElement; // Update last element checked
            }

        } catch (e) {
            console.error(`Error getting coordinates for word ${activeSegment?.id}:`, e);
            wordCoordString = ''; // Clear coords on error
        }
    } else {
        // No active word or element not found in DOM
        wordCoordString = ''; // Ensure coords are cleared
        if (lastWordElement !== null) {
           // If the word disappeared, reset background check cache
            lastWordElement = null;
        }
    }

    // ---> DEBUG LOG <---
    console.log(`[Coords Update] Setting --kokoroHighlightWordInfo: '${wordCoordString.substring(0, 100)}${wordCoordString.length > 100 ? '...' : ''}'`);
    // -----------------

    // Update the CSS variable for the paint worklet
    try {
      targetElement.style.setProperty('--kokoroHighlightWordInfo', wordCoordString);
    } catch (e) {
        console.error("[Highlight] Error setting --kokoroHighlightWordInfo:", e);
    }
}

// T18: Placeholder for sentence coordinate update function
function updateSentenceHighlightCoordinates(targetSentenceIndex) {
    const targetElement = document.body; // Element where CSS variables are set
    let sentenceCoordString = '';
    const sentenceId = targetSentenceIndex >= 0 ? `s-${targetSentenceIndex}` : null;

    if (sentenceId) {
        try {
            const spans = document.querySelectorAll(`span[data-sentence-id="${sentenceId}"]`);
            if (spans.length > 0) {
                let allRects = [];
                spans.forEach(span => {
                    // Use getClientRects() to handle multi-line elements properly
                    const rects = span.getClientRects();
                    for (let i = 0; i < rects.length; i++) {
                        allRects.push(rects[i]);
                    }
                });

                if (allRects.length > 0) {
                    // Group rects by line (using top coordinate with a small tolerance)
                    const lines = {};
                    const tolerance = 1; // Allow for slight pixel variations
                    allRects.forEach(rect => {
                        if (rect.width === 0 || rect.height === 0) return; // Ignore zero-size rects
                        const lineTop = Math.round(rect.top / tolerance) * tolerance;
                        if (!lines[lineTop]) {
                            lines[lineTop] = {
                                rects: [],
                                top: rect.top, // Store the actual top of the first rect for this line
                                height: rect.height // Assume height is consistent per line initially
                            };
                        }
                        lines[lineTop].rects.push(rect);
                        // Update height if a larger rect is found on the same line (handles font size changes)
                        lines[lineTop].height = Math.max(lines[lineTop].height, rect.height);
                    });

                    // Calculate min/max for each line
                    const lineCoordStrings = [];
                    for (const lineTopKey in lines) {
                        const line = lines[lineTopKey];
                        if (line.rects.length === 0) continue;

                        let minLeft = line.rects[0].left;
                        let maxRight = line.rects[0].right;
                        
                        for (let i = 1; i < line.rects.length; i++) {
                            minLeft = Math.min(minLeft, line.rects[i].left);
                            maxRight = Math.max(maxRight, line.rects[i].right);
                        }

                        const lineWidth = maxRight - minLeft;
                        // Use the stored line top and max height
                        const lineTop = line.top; 
                        const lineHeight = line.height; 

                        if (lineWidth > 0 && lineHeight > 0) { // Ensure valid dimensions
                            lineCoordStrings.push(`${minLeft},${lineTop},${lineWidth},${lineHeight}`);
                        }
                    }
                    sentenceCoordString = lineCoordStrings.join(',');
                }
            } else {
                // console.warn(`[Coords] No spans found for sentence ${sentenceId}`);
                sentenceCoordString = '';
            }
        } catch (e) {
            console.error(`Error getting coordinates for sentence ${sentenceId}:`, e);
            sentenceCoordString = ''; // Clear coords on error
        }
    }

    // ---> DEBUG LOG <---
    console.log(`[Coords Update] Setting --kokoroHighlightSentenceInfo: '${sentenceCoordString.substring(0, 100)}${sentenceCoordString.length > 100 ? '...' : ''}'`);
    // -----------------

    // Update the CSS variable
    try {
      targetElement.style.setProperty('--kokoroHighlightSentenceInfo', sentenceCoordString);
    } catch (e) {
        console.error(`[Highlight] Error setting --kokoroHighlightSentenceInfo:`, e);
    }
    // Note: --kokoroElemColor is updated by the word highlight function for now
}

// T18: Function to manage sentence highlighting - NOW USING COORDS
// Renamed from updateSentenceHighlight
function updateActiveSentenceHighlighting(targetSentenceIndex) {
     console.log(`[updateActiveSentenceHighlighting] Updating sentence highlight for index: ${targetSentenceIndex}`); // Add log here too
     updateSentenceHighlightCoordinates(targetSentenceIndex);
}