import * as state from './pageState.js';
import { requestSentenceAudio } from './backgroundComms.js';
import { startSyncLoop, stopSyncLoop } from './syncEngine.js';
import { clearHighlights, updateActiveSentenceHighlighting } from './coordManager.js';
import { updatePlayPauseButtonState, showSkipButtons, hideSkipButtons } from './domUtils.js';

// --- Playback Control & Sentence Logic ---

// Keep track of the current Object URL to revoke it later
let currentAudioObjectURL = null;

// Exported for UI attachment in entry.js
export function handlePlayPauseClick() {
  console.log("Play/Pause clicked");
  if (!state.isInitialized) {
      console.warn("[handlePlayPauseClick] Ignored - Not initialized yet.");
      return;
  }
  
  if (!state.isPlaying) {
      if (state.currentSentenceIndex === -1) {
           updatePlayPauseButtonState('loading');
           initiateTTS(0);
      } else {
          if (state.audioPlayer && state.audioPlayer.paused) {
              state.audioPlayer.play().catch(handleAudioError);
          } else {
             console.warn("Play clicked but audio player not paused? Re-initiating.");
             updatePlayPauseButtonState('loading');
             initiateTTS(state.currentSentenceIndex);
          }
      }
  } else {
      if (state.audioPlayer) {
          state.audioPlayer.pause();
      }
  }
}

// Exported for starting playback
export function initiateTTS(startIndex = 0) { 
  console.log(`Requesting TTS start from index: ${startIndex}`);

  // TODO: Re-evaluate if re-initialization is the right approach here
  if (state.sentenceSegments.length === 0) {
      console.error("[initiateTTS] No sentences available. Requires initialization.");
      // Perhaps call a function from init.js? 
      // initializeExtensionFeatures(); // Avoid calling the old monolithic function
      stopPlaybackAndResetState();
      return;
  }

  stopPlaybackAndResetState();
  
  if (startIndex < 0 || startIndex >= state.sentenceSegments.length) {
      console.warn(`[initiateTTS] Invalid startIndex ${startIndex}. Defaulting to 0.`);
      startIndex = 0;
  }
  state.setState({ currentSentenceIndex: startIndex });

  updatePlayPauseButtonState('loading');

  requestSentenceAudio(state.currentSentenceIndex);
}

// Internal handler for receiving audio from backgroundComms
export function handleReceivedAudio(index, audioObjectURL, timestamps) {
    console.log(`Received audio object URL and ${timestamps?.length || 0} timestamps for sentence index ${index}`);
    console.log(`[DEBUG] Timestamps received for sentence ${index}:`, JSON.parse(JSON.stringify(timestamps)));
    console.log(`[DEBUG] Received Object URL: ${audioObjectURL}`);
    
    if (!audioObjectURL || !timestamps) {
        console.error("Received incomplete audio data (missing URL or timestamps) for sentence:", index);
        if (index === state.currentSentenceIndex) stopPlaybackAndResetState(); // Stop if error on current sentence
        return;
    }

    // Store ObjectURL along with timestamps
    const audioData = { sentenceIndex: index, audioObjectURL: audioObjectURL, wordTimestamps: timestamps };

    if (index === state.currentSentenceIndex) {
        // If received for the sentence we are currently supposed to play
        if (!state.isPlaying) {
            playAudio(audioData.audioObjectURL, audioData.wordTimestamps);
        } else {
            console.warn(`Received audio for current index ${index} while playing. Storing as next.`);
            state.setState({ nextAudioData: audioData }); 
        }
    } 
    else if (index === state.currentSentenceIndex + 1) {
        console.log(`[PRE-FETCH] Storing data (ObjectURL) for next sentence ${index}.`);
        state.setState({ nextAudioData: audioData });
    } 
    else {
        // Revoke unexpected URL immediately?
        console.warn(`Received audio for unexpected index ${index} (current: ${state.currentSentenceIndex}). Revoking URL.`);
        if (audioObjectURL) URL.revokeObjectURL(audioObjectURL);
    }
}

// --- Audio Lifecycle Handlers (Internal) ---

function handleAudioPlay() {
    console.log(`Playback started/resumed for sentence ${state.currentSentenceIndex}`);
    if (!state.hasPlaybackStartedEver) {
        state.setState({ hasPlaybackStartedEver: true });
        showSkipButtons(); // Show buttons on first play
    }
    state.setState({ isPlaying: true });
    updatePlayPauseButtonState('playing');
    startSyncLoop();
}

function handleAudioPause() {
  console.log('Playback paused for sentence', state.currentSentenceIndex);
  state.setState({ isPlaying: false });
  updatePlayPauseButtonState('paused');
}

function handleAudioEnded() {
    console.log(`Audio finished for sentence ${state.currentSentenceIndex}`);
    
    // ** Revoke the Object URL for the track that just finished **
    if (currentAudioObjectURL) {
        console.log(`[Revoke] Revoking Object URL: ${currentAudioObjectURL}`);
        URL.revokeObjectURL(currentAudioObjectURL);
        currentAudioObjectURL = null;
    }

    state.setState({ isPlaying: false, currentWordTimestamps: [] });
    stopSyncLoop(); 
    
    console.log(`[AUDIO END] Checking nextAudioData:`, state.nextAudioData);

    const expectedNextIndex = state.currentSentenceIndex + 1;
    const bufferedData = state.nextAudioData;

    if (bufferedData && bufferedData.sentenceIndex === expectedNextIndex) {
        console.log(`[AUDIO END] Found buffered audio (ObjectURL) for next sentence ${expectedNextIndex}.`);
        state.setState({ currentSentenceIndex: expectedNextIndex, nextAudioData: null });
        updateActiveSentenceHighlighting(state.currentSentenceIndex); // Use coordManager function
        // ** Pass the ObjectURL from buffered data **
        playAudio(bufferedData.audioObjectURL, bufferedData.wordTimestamps); 
    } 
    else if (expectedNextIndex < state.sentenceSegments.length) {
         console.log(`[AUDIO END] No buffered audio for sentence ${expectedNextIndex}. Waiting...`);
         state.setState({ currentSentenceIndex: expectedNextIndex });
         updateActiveSentenceHighlighting(state.currentSentenceIndex); // Update highlight even if waiting
         updatePlayPauseButtonState('loading');
    } 
    else { 
        console.log("[AUDIO END] Finished playing all sentences.");
        stopPlaybackAndResetState();
    }
}

function handleAudioError(event) {
    console.error(`Audio playback error during sentence ${state.currentSentenceIndex}:`, event);
    
    // ** Revoke the Object URL if an error occurred **
    if (currentAudioObjectURL) {
        console.log(`[Revoke on Error] Revoking Object URL: ${currentAudioObjectURL}`);
        URL.revokeObjectURL(currentAudioObjectURL);
        currentAudioObjectURL = null;
    }

    if (state.isStoppingOnError) {
        console.warn("[handleAudioError] Already stopping. Ignoring recursive call.");
        return;
    }
    state.setState({ isStoppingOnError: true });

    stopSyncLoop(); 
    
    if (state.audioPlayer && state.audioPlayer.error) {
        console.error("MediaError details:", state.audioPlayer.error);
    } else if (event.errorDetails) { 
         console.error("Promise rejection details:", event.errorDetails);
    }
    
    stopPlaybackAndResetState(); // This will reset isStoppingOnError
    updatePlayPauseButtonState('error');
}

// Internal function to play audio
function playAudio(audioObjectURL, timestamps) {
  console.log(`playAudio called for sentence ${state.currentSentenceIndex} with ${timestamps.length} timestamps.`);
  console.log(`  > Object URL: ${audioObjectURL}`);
  
  // --- Cleanup old player & Revoke previous URL if any --- 
  if (state.audioPlayer) {
      console.warn("[playAudio] Existing audioPlayer found, attempting cleanup first.");
      try {
        if (!state.audioPlayer.paused) state.audioPlayer.pause();
        state.audioPlayer.removeEventListener('ended', handleAudioEnded);
        state.audioPlayer.removeEventListener('error', handleAudioError);
        state.audioPlayer.removeEventListener('play', handleAudioPlay); 
        state.audioPlayer.removeEventListener('pause', handleAudioPause);
        state.audioPlayer.src = ''; // Release resource
      } catch(e) { console.error("Error cleaning up old audio player:", e); }
      state.setState({ audioPlayer: null });
  }
  if (currentAudioObjectURL) {
      console.warn(`[playAudio] Revoking PREVIOUS Object URL before playing new one: ${currentAudioObjectURL}`);
      URL.revokeObjectURL(currentAudioObjectURL);
      currentAudioObjectURL = null;
  }
  // ------------------------------------------------------

  console.log("Creating new Audio element...");
  const newPlayer = new Audio(); 
  
  // Attach mandatory listeners
  newPlayer.addEventListener('ended', handleAudioEnded);
  newPlayer.addEventListener('error', handleAudioError);
  newPlayer.addEventListener('play', handleAudioPlay); 
  newPlayer.addEventListener('pause', handleAudioPause);
  
  // Add other debug listeners if needed
  newPlayer.addEventListener('loadstart', () => console.log(`Audio event: loadstart for ${state.currentSentenceIndex}`));
  newPlayer.addEventListener('loadeddata', () => console.log(`Audio event: loadeddata for ${state.currentSentenceIndex}`));

  // Store timestamps, player, and **the new Object URL** in state/module scope
  state.setState({ 
      audioPlayer: newPlayer, 
      currentWordTimestamps: timestamps 
  });
  currentAudioObjectURL = audioObjectURL; // Track the URL being used
  
  console.log(`Setting audioPlayer.src for sentence ${state.currentSentenceIndex} to ObjectURL`);
  newPlayer.src = audioObjectURL; // ** Use the Object URL **
  
  console.log(`Calling audioPlayer.play() for sentence ${state.currentSentenceIndex}`);
  newPlayer.play().catch(handleAudioError); // Catch potential play() promise rejection

  // Pre-fetch next sentence if applicable
  const nextIndex = state.currentSentenceIndex + 1;
  if (nextIndex < state.sentenceSegments.length && !state.nextAudioData) { // Only fetch if not already buffered
      requestSentenceAudio(nextIndex);
  }
}

// Exported for resetting state from other modules
export function stopPlaybackAndResetState() {
    console.log("Stopping playback and resetting state.");
    
    // ** Revoke the current Object URL if playback is stopped **
    if (currentAudioObjectURL) {
        console.log(`[Revoke on Stop] Revoking Object URL: ${currentAudioObjectURL}`);
        URL.revokeObjectURL(currentAudioObjectURL);
        currentAudioObjectURL = null;
    }
    
    if (state.audioPlayer) {
        try {
             if (!state.audioPlayer.paused) {
                state.audioPlayer.pause(); 
            }
            // Remove listeners on the current instance
            state.audioPlayer.removeEventListener('ended', handleAudioEnded);
            state.audioPlayer.removeEventListener('error', handleAudioError);
            state.audioPlayer.removeEventListener('play', handleAudioPlay); 
            state.audioPlayer.removeEventListener('pause', handleAudioPause);
            state.audioPlayer.src = ''; // Attempt to release resource

            console.log("[Reset] Audio player listeners removed and src cleared.");
        } catch (e) {
            console.error("[Reset] Error cleaning up audio player:", e);
        }
    }
    stopSyncLoop(); // Stop polling
    hideSkipButtons(); // Hide skip buttons on full stop/reset

    // Update state using setState
    state.setState({
        audioPlayer: null,
        currentWordTimestamps: [],
        isPlaying: false,
        currentSentenceIndex: -1, 
        nextAudioData: null,
        lastWordElement: null,
        currentHighlightedSentenceId: null,
        isStoppingOnError: false, // Ensure this is reset
        hasPlaybackStartedEver: false // Reset the flag
    });

    updatePlayPauseButtonState('idle'); // Set idle state on stop/reset

    // Clear highlights slightly after state reset to ensure loop has stopped
    setTimeout(clearHighlights, 50); 
}

// --- NEW: Function to jump between sentences when paused ---
export function jumpToSentence(targetIndex) {
    console.log(`[Jump] Jumping to sentence index: ${targetIndex}`);
    if (targetIndex < 0 || targetIndex >= state.sentenceSegments.length) {
        console.error(`[Jump] Target index ${targetIndex} is out of bounds.`);
        return;
    }

    // Set new target index in state
    state.setState({ currentSentenceIndex: targetIndex });

    // Update visual highlight immediately
    try {
        updateActiveSentenceHighlighting(targetIndex);
    } catch (e) {
        console.error(`[Jump] Error updating sentence highlight: ${e}`);
    }

    // Request audio for the new target sentence (pre-fetch)
    // Note: We don't set loading state on the button here, as we are paused.
    requestSentenceAudio(targetIndex);
    
    // Ensure playback state remains paused and button shows 'Play'
    state.setState({ isPlaying: false });
    updatePlayPauseButtonState('paused'); 
}
// ----------------------------------------------------------- 