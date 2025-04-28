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

let createdHighlightSpans = []; // T07 state

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

// --- T02/T04/T12: Playback Control & Sentence Logic --- 

function handlePlayPauseClick() {
  console.log("Play/Pause clicked");
  const button = document.getElementById('kokoro-play-pause-button');
  
  if (!isPlaying) {
      // --- Start playing --- 
      if (currentSentenceIndex === -1) {
           // Start from the beginning
           initiateTTS(); // This will extract text and request sentence 0
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

function initiateTTS() {
  console.log("Initiating TTS sequence...");
  stopPlaybackAndResetState(); 
  
  let testModeActive = false;
  let textToRead = null;
  let targetElement = null;

  if (USE_TEST_SENTENCES) { // (Step 2)
      console.log("--- TOKENIZER TEST MODE ACTIVE ---");
      testModeActive = true;
      // Use test sentences directly, join them to simulate a single block of text
      textToRead = TOKENIZER_TEST_SENTENCES.join('\n\n'); // Join with double newline for separation
      targetElement = document.body; // Still need a dummy target for setupHighlighting
      console.log("Using predefined test sentences for tokenization test.");
  } else {
      // Normal operation: Extract text from page
      const extractionResult = getTextToRead(); 
      textToRead = extractionResult.textToRead;
      targetElement = extractionResult.targetElement;
  }

  if (!textToRead || !targetElement) { 
      console.log("No text found or target element missing.");
      return;
  }
  
  // Process and store segments (Pass testModeActive flag)
  const { cleanedSentences, allSegments } = processText(textToRead, testModeActive);
  // Store all segments for highlighting/sync logic
  segmentedText = allSegments;
  // Use the cleaned sentences array for iterating/requesting audio
  sentenceSegments = cleanedSentences;

  if (sentenceSegments.length === 0) {
      console.error("No sentences found after processing text.");
      stopPlaybackAndResetState(); 
      return;
  }

  // Setup highlighting spans using the correct allSegments array
  setupHighlighting(segmentedText, targetElement, testModeActive);

  const playPauseButton = document.getElementById('kokoro-play-pause-button');
  if(playPauseButton) playPauseButton.textContent = "Loading Test...";
  if(playPauseButton) playPauseButton.disabled = true;

  // Start the sequence by requesting the FIRST sentence
  currentSentenceIndex = 0;
  requestSentenceAudio(currentSentenceIndex);
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
    updateHighlight(null); // Clear previous word highlight
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
        const nextData = nextAudioData;
        nextAudioData = null; 
        playAudio(nextData.audioDataUrl, nextData.wordTimestamps);
    } 
    else if (expectedNextIndex < sentenceSegments.length) {
         console.log(`[AUDIO END] No buffered audio found for sentence ${expectedNextIndex}. Waiting...`);
         currentSentenceIndex++; 
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
}

// --- The function that uses the handlers ---
function playAudio(audioDataUrl, timestamps) {
  console.log(`playAudio called for sentence ${currentSentenceIndex} with ${timestamps.length} timestamps.`);
  
  if (!audioPlayer) { 
    console.log("Creating new Audio element...");
    audioPlayer = new Audio(); 
    console.log(" -> Audio element created.");
    
    // Attach listeners ONLY when the element is first created
    audioPlayer.addEventListener('ended', handleAudioEnded);
    console.log(" -> Added 'ended' listener.");
    audioPlayer.addEventListener('error', handleAudioError);
    console.log(" -> Added 'error' listener.");
    audioPlayer.addEventListener('play', handleAudioPlay); 
    console.log(" -> Added 'play' listener.");
    audioPlayer.addEventListener('pause', handleAudioPause);
    console.log(" -> Added 'pause' listener.");

    // --- REMOVE timeupdate listeners - we will use polling --- 
    // audioPlayer.addEventListener('timeupdate', handleTimeUpdate); 
    // console.log(" -> Added 'timeupdate' listener (handleTimeUpdate).");
    // audioPlayer.addEventListener('timeupdate', () => { 
    //     console.log("[timeupdate event fired!] Current time:", audioPlayer?.currentTime);
    // });
    // console.log(" -> Added 'timeupdate' listener (inline test log).");
    // ----------------------------------------------------------

    audioPlayer.addEventListener('loadstart', () => { console.log(`Audio event: loadstart for sentence ${currentSentenceIndex}`); });
    console.log(" -> Added 'loadstart' listener.");
    audioPlayer.addEventListener('loadeddata', () => { console.log(`Audio event: loadeddata for sentence ${currentSentenceIndex}`); });
    console.log(" -> Added 'loadeddata' listener.");
    audioPlayer.addEventListener('canplay', () => { console.log(`Audio event: canplay for sentence ${currentSentenceIndex}`); });
    console.log(" -> Added 'canplay' listener.");
    audioPlayer.addEventListener('canplaythrough', () => { console.log(`Audio event: canplaythrough for sentence ${currentSentenceIndex}`); });
    console.log(" -> Added 'canplaythrough' listener.");
    
    console.log(" -> Finished adding listeners inside if block.");
  } else {
      console.log(`Reusing existing audioPlayer for sentence ${currentSentenceIndex}.`);
  }
  
  // Store the precise timings for the currently playing sentence
  currentWordTimestamps = timestamps;
  
  // --- Revert back to using the actual audioDataUrl --- 
  // const testAudioUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.wav"; 
  // console.log(`[DEBUG] Setting audioPlayer.src to TEST URL: ${testAudioUrl}`);
  // audioPlayer.src = testAudioUrl; // TEMP OVERRIDE
  console.log(`Setting audioPlayer.src for sentence ${currentSentenceIndex}`);
  audioPlayer.src = audioDataUrl; // Use the actual Data URL
  // ---------------------------------------------------
  
  console.log(`Calling audioPlayer.load() for sentence ${currentSentenceIndex}`);
  audioPlayer.load();

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
  // --------------------------------------------

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
        audioPlayer.pause();
        audioPlayer.src = ""; 
    }
    isPlaying = false;
    currentSentenceIndex = -1;
    nextAudioData = null;
    currentWordTimestamps = []; // Clear timestamps
    stopSyncLoop(); 
    clearHighlights(); 
    currentHighlightedWord = null; // Clear highlighted word ref
    
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if (playPauseButton) {
        playPauseButton.textContent = "Play";
        playPauseButton.disabled = false;
    }
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
    console.log("Processing text (T06 - Refined Sentence/Word Split + Sentence Cleanup)...", isTestMode ? "[TEST MODE]" : "");

    const rawSentences = text.match(/[^.!?¿]+[.!?¿\s]*(?:\s|$)/g) || [text]; // Added ¿ to sentence terminators
    
    let segments = [];
    let sentenceCounter = 0; 
    let wordCounter = 0; 

    rawSentences.forEach((rawSentenceText, rawSentenceIndex) => {
        const trimmedSentence = rawSentenceText.trim().replace(/\s+/g, ' '); 
        if (!trimmedSentence) return; 

        const sentenceId = `s-${sentenceCounter}`; 
        segments.push({ 
            type: 'sentence', 
            text: trimmedSentence, 
            id: sentenceId, 
            element: null
        });
        
        // --- (Step 3) Log local tokenization for TEST sentences --- 
        if (isTestMode) {
            console.log(`--- [LOCAL TOKENIZER TEST] Processing Sentence ${sentenceCounter}: "${trimmedSentence}" ---`);
        }
        // ----------------------------------------------------------

        const wordsAndPunctuation = trimmedSentence.match(/\w+|[.,!?;:¿]/g) || []; // Added ¿ to word/punct regex
        let sentenceWordSegments = []; // Temporary array for logging

        wordsAndPunctuation.forEach((wordText, wordIndexWithinSentence) => {
            if (!wordText) return; 
            
            const wordId = `s${sentenceCounter}-w${wordIndexWithinSentence}`;
            const wordSegment = {
                type: 'word', 
                text: wordText, 
                id: wordId, 
                sentenceId: sentenceId, 
                element: null 
            };
            segments.push(wordSegment);
            if (isTestMode) { // Collect segments for logging if in test mode
                sentenceWordSegments.push(wordSegment);
            }
            wordCounter++;
        });

        // --- (Step 3) Log the generated segments for the TEST sentence --- 
        if (isTestMode) {
            console.log(`--- [LOCAL TOKENIZER TEST] Generated Segments (Sentence ${sentenceCounter}):`, JSON.parse(JSON.stringify(sentenceWordSegments)));
            console.log(`--------------------------------------------------------------------`);
        }
        // ---------------------------------------------------------------

        sentenceCounter++; 
    });

    console.log(`Processed text into ${sentenceCounter} clean sentences and ${wordCounter} word/punctuation segments.`);
    if (!isTestMode) {
        // Only log this for non-test mode to avoid clutter
        console.log("First 10 word/punctuation segments:", segments.filter(s=>s.type==='word').slice(0, 10));
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
    let globalCharIndex = 0; // Tracks character position across concatenated text nodes
    let nodeMap = []; // Map segments back to the nodes they span
    let currentTextNodeMapIndex = 0;

    // Build a simplified text representation and map segments
    let simplifiedText = textNodes.map(tn => tn.originalText).join('');
    let searchStartInSimplified = 0;

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (segment.type === 'sentence') continue; // Skip sentence segments for wrapping

        const segmentText = segment.text; 
        // TODO: Need robust matching - consider normalizing whitespace?
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
            } else {
                // Only log this warning if NOT in test mode
                if (!isTestMode) { 
                    console.warn(`Could not map segment '${segmentText}' (index ${i}) accurately to text nodes.`);
                }
            }

            searchStartInSimplified = endIndex; // Continue search from end of this segment
        } else {
             // Only log this warning if NOT in test mode
             if (!isTestMode) {
                 console.warn(`Segment '${segmentText}' (index ${i}) not found in target element's text content.`);
             }
             // Try to continue searching from the last known position just in case?
             // searchStartInSimplified += 1; // Be cautious with this
        }
    }

    // --- Now perform the wrapping based on the mapped ranges ---
    // Iterate in reverse order to minimize disruption from node splitting by surroundContents
    let successfullyWrappedCount = 0;
    for (let i = nodeMap.length - 1; i >= 0; i--) {
        const mapInfo = nodeMap[i];
        try {
            const range = document.createRange();
            range.setStart(mapInfo.startNode, mapInfo.startOffset);
            range.setEnd(mapInfo.endNode, mapInfo.endOffset);

            // --- Defensive Check (Stricter) ---
            // Only wrap if the entire range is within a SINGLE text node
            if (mapInfo.startNode !== mapInfo.endNode || mapInfo.startNode.nodeType !== Node.TEXT_NODE) {
                if (!isTestMode) {
                    console.warn(`Skipping segment ${mapInfo.segment.id} ('${mapInfo.segment.text}') because it spans across nodes or boundary is not a Text node.`);
                }
                continue; // Skip to the next segment
            }
            // ---------------------------------

            const span = document.createElement('span');
            span.id = mapInfo.segment.id;
            // Add classes based on segment type
            span.className = `kokoro-segment kokoro-${mapInfo.segment.type}`; 
            if (mapInfo.segment.type === 'word' && mapInfo.segment.sentenceId) {
                 span.classList.add(`kokoro-sentence-${mapInfo.segment.sentenceId}`); 
            }

            range.surroundContents(span); // This modifies the DOM

            mapInfo.segment.element = span; // Store reference in the original segment object
            createdHighlightSpans.push(span); 
            successfullyWrappedCount++; // Increment success count

        } catch (e) {
             // Catch other potential errors during wrapping, though the check above should prevent InvalidStateError
             if (!isTestMode) {
                console.error(`Error wrapping segment ${mapInfo.segment.id} ('${mapInfo.segment.text}'):`, e, mapInfo);
             }
        }
    }
     // Reverse the stored spans array so it's in original segment order if needed elsewhere
    createdHighlightSpans.reverse(); 

    console.log(`Highlighting setup finished. Attempted to map ${nodeMap.length} segments. Successfully wrapped: ${successfullyWrappedCount}`);
}

function clearHighlights() {
    console.log("Clearing highlights by removing class..."); 
    
    // We query ALL potential highlight elements each time to ensure cleanup,
    // even if `createdHighlightSpans` array is incomplete due to errors during setup.
    const highlightedElements = document.querySelectorAll('.kokoro-highlight-word, .kokoro-highlight-sentence');
    highlightedElements.forEach(el => {
        // Check if the element is one we created OR just has the class
        // For now, just remove classes - simpler than unwrapping
         el.classList.remove('kokoro-highlight-word', 'kokoro-highlight-sentence');
         // TODO: Define these classes later in CSS
    });

    // If we need to unwrap spans later:
    /*
    console.log("Clearing highlights by unwrapping spans...");
    // Iterate backwards through created spans to minimize DOM issues during removal
    for (let i = createdHighlightSpans.length - 1; i >= 0; i--) {
        const span = createdHighlightSpans[i];
         if (span && span.parentNode) {
            const parent = span.parentNode;
            // Move all children (should just be text node(s)) out before removing span
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
            parent.normalize(); // Merge adjacent text nodes
        }
    }
    createdHighlightSpans = []; // Clear the array
    */
   
   // Also clear the element references in the main segmentedText array
   segmentedText.forEach(segment => segment.element = null);
}

// --- T09: Synchronization (Using Polling with requestAnimationFrame)
let animationFrameId = null; // Store the ID for cancellation

function pollingLoop() {
    // If not playing, or player doesn't exist, stop the loop
    if (!isPlaying || !audioPlayer) { 
        animationFrameId = null; // Clear the ID
        return; 
    }

    // Call the existing logic to check time and update highlight
    handleTimeUpdate(); 

    // Schedule the next frame
    animationFrameId = requestAnimationFrame(pollingLoop);
}

function handleTimeUpdate() {
    // Log removed from the start to avoid spamming console excessively
    // console.log("[handleTimeUpdate] Entered function."); 
    
    // Guard condition remains useful even with polling
    if (!isPlaying || !audioPlayer || currentWordTimestamps.length === 0) return;
    
    // ---> ADD CHECK: Don't run sync logic/logging in test mode <---
    if (USE_TEST_SENTENCES) return; 
    // ------------------------------------------------------------
    
    const currentTime = audioPlayer.currentTime;
    const HIGHLIGHT_OFFSET = 0.1; // Delay highlighting by 100ms

    let activeWordTimestamp = null;
    for (const timing of currentWordTimestamps) {
        // --- Apply Offset --- 
        if (currentTime >= (timing.start + HIGHLIGHT_OFFSET) && currentTime < (timing.end + HIGHLIGHT_OFFSET)) {
        // ------------------
            activeWordTimestamp = timing;
            break;
        }
    }
    
    let activeSegment = null;
    if (activeWordTimestamp) {
        const expectedSegmentId = `s${currentSentenceIndex}-w${activeWordTimestamp.id}`;
        const currentCleanSentenceId = `s-${currentSentenceIndex}`; // ID used in processText
        
        // --- DEBUG LOG: Log details before segment lookup --- 
        console.log(`[DEBUG SYNC] Looking for ID: ${expectedSegmentId}`);
        console.log(`           Current Sentence Index: ${currentSentenceIndex}`);
        console.log(`           Active Timestamp (API):`, JSON.parse(JSON.stringify(activeWordTimestamp)));
        const relevantLocalSegments = segmentedText.filter(seg => seg.sentenceId === currentCleanSentenceId);
        console.log(`           Local Segments for ${currentCleanSentenceId}:`, JSON.parse(JSON.stringify(relevantLocalSegments.slice(Math.max(0, activeWordTimestamp.id - 2), activeWordTimestamp.id + 3)))); 
        // ----------------------------------------------------

        // --- Primary Match Attempt (by ID ONLY) ---
        activeSegment = segmentedText.find(seg => seg.id === expectedSegmentId );
        
        // --- REMOVED Unreliable Text Fallback --- 
        if (!activeSegment) {
             // If ID match fails, just log the mismatch and do nothing else.
             console.warn(`[SYNC MISMATCH] Word timestamp found (API ID: ${activeWordTimestamp.id}, Text: '${activeWordTimestamp.text}'), but NO matching segment found for constructed ID: ${expectedSegmentId}. Check tokenization alignment.`);
        }
        // ----------------------------------------
        
    } else {
         // console.log(`No active word timestamp found for currentTime: ${currentTime.toFixed(3)}`);
    }

    updateHighlight(activeSegment); // Will be called with null if no match found
}

function startSyncLoop() {
    console.log("Sync loop initiated (using requestAnimationFrame).");
    // Ensure we don't start multiple loops
    if (animationFrameId === null) { 
        pollingLoop(); // Start the loop
    }
}

function stopSyncLoop() {
    console.log("Sync loop stopped (cancelling animation frame).");
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    // Clear highlight when stopping completely? 
    // updateHighlight(null); // Can be handled elsewhere if needed
}

function updateHighlight(activeSegment) { 
    const newHighlightElement = activeSegment ? activeSegment.element : null;
    if (newHighlightElement !== currentHighlightedWord) {
        if (currentHighlightedWord) {
            currentHighlightedWord.classList.remove('kokoro-highlight-word');
        }
        if (newHighlightElement) {
            if (document.getElementById(newHighlightElement.id)) { 
                newHighlightElement.classList.add('kokoro-highlight-word');
                // Optional Scroll
                // newHighlightElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            } else {
                // This warning helps if the span wasn't created properly
                console.warn(`[Highlight] Target element ${newHighlightElement.id} not found in DOM for segment '${activeSegment?.text}'.`);
                newHighlightElement = null; 
            }
        }
        currentHighlightedWord = newHighlightElement;
    }
} 