import * as state from './pageState.js';
import { requestSentenceAudio } from './backgroundComms.js';
import { startSyncLoop, stopSyncLoop } from './syncEngine.js';
import { clearHighlights, updateActiveSentenceHighlighting, updateWordHighlightCoordinates } from './coordManager.js';
import { updatePlayPauseButtonState } from './domUtils.js';

// --- Playback Control & Sentence Logic ---

// Keep track of the current Object URL to revoke it later
let currentAudioObjectURL = null;

// Stops current audio player, clears flags, but leaves playbackIntended and currentSentenceIndex intact.
function stopCurrentAudio() {
    console.log("[stopCurrentAudio] Stopping current audio track...");
    stopSyncLoop(); // Stop polling

    if (state.audioPlayer) {
        try {
            if (!state.audioPlayer.paused) {
                state.audioPlayer.pause();
            }
            state.audioPlayer.removeEventListener('ended', handleAudioEnded);
            state.audioPlayer.removeEventListener('error', handleAudioError);
            state.audioPlayer.removeEventListener('play', handleAudioPlay);
            state.audioPlayer.removeEventListener('pause', handleAudioPause);
            state.audioPlayer.src = '';
            console.log("[stopCurrentAudio] Audio player listeners removed and src cleared.");
        } catch (e) {
            console.error("[stopCurrentAudio] Error cleaning up audio player:", e);
        }
    }

    if (currentAudioObjectURL) {
        console.log(`[stopCurrentAudio] Revoking Object URL: ${currentAudioObjectURL}`);
        URL.revokeObjectURL(currentAudioObjectURL);
        currentAudioObjectURL = null;
    }

    // Clear only momentary playback state
    state.setState({
        audioPlayer: null,
        currentWordTimestamps: [],
        isPlaying: false, // Actual player state is false now
        // playbackIntended: state.playbackIntended, // <<< DO NOT CHANGE INTENTION HERE
        nextAudioData: null,
        lastWordElement: null,
        isStoppingOnError: false,
        bufferedPausedAudio: null,
        shouldAutoplayNext: false // Reset this flag for the next cycle
    });

    updateWordHighlightCoordinates(null); // Clear word highlight

    console.log("[stopCurrentAudio] Finished stopping current audio.");
}

// Exported for UI attachment in entry.js
export function handlePlayPauseClick() {
  console.log("Play/Pause clicked");
  if (!state.isInitialized) {
      console.warn("[handlePlayPauseClick] Ignored - Not initialized yet.");
      return;
  }

  if (!state.playbackIntended) { // Check INTENTION, not momentary state
      // --- User wants to START or RESUME --- 
      state.setState({ playbackIntended: true }); // Set intention to play
      const indexToPlay = state.currentSentenceIndex === -1 ? 0 : state.currentSentenceIndex;
      console.log(`[handlePlayPauseClick] Setting intention to PLAY. Determined indexToPlay: ${indexToPlay}`);
      playSentence(indexToPlay, true); // Always trigger play
  } else {
      // --- User wants to PAUSE --- 
      state.setState({ playbackIntended: false }); // Set intention to pause
      if (state.audioPlayer && !state.audioPlayer.paused) {
          console.log(`[handlePlayPauseClick] User pausing audio for sentence ${state.currentSentenceIndex}`);
          state.audioPlayer.pause();
          // Explicitly set momentary state on user pause action
          state.setState({ isPlaying: false }); 
          updatePlayPauseButtonState('paused');
      } else {
          // If player doesn't exist or already paused, ensure state is consistent
          console.log(`[handlePlayPauseClick] Pause clicked, but player not active. Ensuring state is paused.`);
          state.setState({ isPlaying: false });
          updatePlayPauseButtonState('paused');
      }
  }
}

// Unified function: Handles starting, resuming, skipping, clicking.
export function playSentence(targetIndex, shouldPlay) {
    console.log(`[playSentence] Called with targetIndex: ${targetIndex}, shouldPlay: ${shouldPlay}`);

    if (state.sentenceSegments.length === 0) {
        console.error("[playSentence] No sentences available. Requires initialization.");
        stopPlaybackAndResetState(); // Full reset needed
        return;
    }

    // Stop current audio gently (clears isPlaying, but not playbackIntended)
    stopCurrentAudio();

    // Validate target index
    if (targetIndex < 0 || targetIndex >= state.sentenceSegments.length) {
        console.error(`[playSentence] Invalid targetIndex ${targetIndex}. Bounds are 0-${state.sentenceSegments.length - 1}. Stopping.`);
        stopPlaybackAndResetState(); // Full reset needed
        return;
    }

    // Update state and highlight BEFORE loading
    console.log(`[playSentence] Setting index ${targetIndex} and updating sentence highlight.`);
    state.setState({ currentSentenceIndex: targetIndex });
    updateActiveSentenceHighlighting(targetIndex);
    startSyncLoop(); // Ensure one frame runs for the highlight update

    // Show loading state UI
    updatePlayPauseButtonState('loading');

    // Set flag to control auto-play based on the shouldPlay argument
    console.log(`[playSentence] DEBUG: Setting shouldAutoplayNext flag to: ${shouldPlay}`);
    state.setState({ shouldAutoplayNext: shouldPlay });

    // Request the audio
    console.log(`[playSentence] Requesting audio for index ${targetIndex}.`);
    requestSentenceAudio(targetIndex);
}


// Internal handler for receiving audio from backgroundComms
export function handleReceivedAudio(index, audioObjectURL, timestamps) {
    // ... (remains the same, relies on shouldAutoplayNext)
    console.log(`[handleReceivedAudio] Received audio for sentence index ${index}. Timestamps: ${timestamps?.length || 0}. URL starts with: ${audioObjectURL?.substring(0, 20)}`);

    if (!audioObjectURL || !timestamps) {
        console.error("[handleReceivedAudio] Received incomplete audio data for sentence:", index);
        if (index === state.currentSentenceIndex) stopPlaybackAndResetState();
        return;
    }

    if (index !== state.currentSentenceIndex) {
        console.warn(`[handleReceivedAudio] Received audio for unexpected index ${index} (current target: ${state.currentSentenceIndex}). Revoking URL.`);
        URL.revokeObjectURL(audioObjectURL);
        return;
    }

    const audioData = { sentenceIndex: index, audioObjectURL: audioObjectURL, wordTimestamps: timestamps };

    console.log(`[handleReceivedAudio] DEBUG: Checking shouldAutoplayNext flag: ${state.shouldAutoplayNext}`);

    if (state.shouldAutoplayNext) {
        console.log(`[handleReceivedAudio] DEBUG: Autoplaying audio immediately for index ${index}.`);
        state.setState({ shouldAutoplayNext: false });
        playAudio(audioData.audioObjectURL, audioData.wordTimestamps);
    } else {
        console.log(`[handleReceivedAudio] DEBUG: Buffering audio for paused state index ${index}.`);
        state.setState({ bufferedPausedAudio: audioData });
        updatePlayPauseButtonState('paused');
    }
}

// --- Audio Lifecycle Handlers (Internal) ---

function handleAudioPlay() {
    console.log(`Playback started/resumed for sentence ${state.currentSentenceIndex}`);
    // isPlaying reflects the actual player state
    state.setState({
        isPlaying: true,
        // playbackIntended remains true (or was set by user)
        shouldAutoplayNext: false,
        bufferedPausedAudio: null
    });
    updatePlayPauseButtonState('playing');
    startSyncLoop();
}

function handleAudioPause() {
  // Log only, state managed by explicit actions
  console.log(`[DEBUG] Audio pause event fired for player. Current isPlaying: ${state.isPlaying}, playbackIntended: ${state.playbackIntended}, player ended: ${state.audioPlayer?.ended}`);
}

function handleAudioEnded() {
    console.log(`Audio finished for sentence ${state.currentSentenceIndex}`);

    if (currentAudioObjectURL) {
        console.log(`[Revoke] Revoking Object URL: ${currentAudioObjectURL}`);
        URL.revokeObjectURL(currentAudioObjectURL);
        currentAudioObjectURL = null;
    }

    // Momentarily set isPlaying false
    state.setState({ isPlaying: false, currentWordTimestamps: [] });
    stopSyncLoop();

    const expectedNextIndex = state.currentSentenceIndex + 1;

    if (expectedNextIndex < state.sentenceSegments.length) {
        console.log(`[AUDIO END] Proceeding to next sentence: ${expectedNextIndex}`);
        // *** Automatically proceed based on the USER'S INTENTION ***
        playSentence(expectedNextIndex, state.playbackIntended);
    } else {
        console.log("[AUDIO END] Finished playing all sentences.");
        stopPlaybackAndResetState(); // This will set playbackIntended = false
    }
}

function handleAudioError(event) {
    // ... (remains the same, calls stopPlaybackAndResetState which handles flags)
    console.error(`Audio playback error during sentence ${state.currentSentenceIndex}:`, event);

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

    stopPlaybackAndResetState();
    updatePlayPauseButtonState('error');
}

// Internal function to play audio - called by handleReceivedAudio
function playAudio(audioObjectURL, timestamps) {
   // ... (playAudio remains the same - sets up player, calls .play())
  console.log(`[playAudio] DEBUG: Called for sentence ${state.currentSentenceIndex} with ${timestamps.length} timestamps. URL: ${audioObjectURL?.substring(0,20)}`);

  if (state.audioPlayer) {
      console.warn("[playAudio] Existing audioPlayer found, attempting cleanup *again* (should have been done by stopCurrentAudio).");
      try {
        if (!state.audioPlayer.paused) state.audioPlayer.pause();
        state.audioPlayer.removeEventListener('ended', handleAudioEnded);
        state.audioPlayer.removeEventListener('error', handleAudioError);
        state.audioPlayer.removeEventListener('play', handleAudioPlay);
        state.audioPlayer.removeEventListener('pause', handleAudioPause);
        state.audioPlayer.src = '';
      } catch(e) { console.error("Error cleaning up old audio player:", e); }
      state.setState({ audioPlayer: null });
  }
  if (currentAudioObjectURL) {
      console.warn(`[playAudio] Revoking PREVIOUS Object URL before playing new one: ${currentAudioObjectURL}`);
      URL.revokeObjectURL(currentAudioObjectURL);
      currentAudioObjectURL = null;
  }

  console.log("Creating new Audio element...");
  const player = new Audio();

  player.addEventListener('ended', handleAudioEnded);
  player.addEventListener('error', handleAudioError);
  player.addEventListener('play', handleAudioPlay);
  player.addEventListener('pause', handleAudioPause);

  player.addEventListener('loadstart', () => console.log(`Audio event: loadstart for ${state.currentSentenceIndex}`));
  player.addEventListener('loadeddata', () => console.log(`Audio event: loadeddata for ${state.currentSentenceIndex}`));

  state.setState({
      audioPlayer: player,
      currentWordTimestamps: timestamps
  });
  currentAudioObjectURL = audioObjectURL;

  console.log(`Setting audioPlayer.src for sentence ${state.currentSentenceIndex} to ObjectURL`);
  player.src = audioObjectURL;

  console.log(`Calling audioPlayer.play() for sentence ${state.currentSentenceIndex}`);
  if (state.playbackRate) {
      console.log(`[playAudio] Setting playbackRate to ${state.playbackRate}`);
      player.playbackRate = state.playbackRate;
  }
  const playPromise = player.play();
  if (playPromise !== undefined) {
      playPromise.then(_ => {
          console.log("[playAudio] DEBUG: player.play() promise resolved successfully.");
      }).catch(error => {
          console.error("[playAudio] DEBUG: player.play() promise rejected:", error);
          handleAudioError({errorDetails: error});
      });
  } else {
     console.log("[playAudio] DEBUG: player.play() did not return a promise (older browser?). Assuming playback started.");
  }

  const nextIndex = state.currentSentenceIndex + 1;
  if (nextIndex < state.sentenceSegments.length && !state.nextAudioData) {
      console.log(`[playAudio] Requesting pre-fetch for next sentence: ${nextIndex}`);
      requestSentenceAudio(nextIndex);
  }
}

// Exported for resetting state from other modules
// This function FULLY stops everything and resets intention.
export function stopPlaybackAndResetState() {
    console.log("Stopping playback and resetting state.");

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
            state.audioPlayer.removeEventListener('ended', handleAudioEnded);
            state.audioPlayer.removeEventListener('error', handleAudioError);
            state.audioPlayer.removeEventListener('play', handleAudioPlay);
            state.audioPlayer.removeEventListener('pause', handleAudioPause);
            state.audioPlayer.src = '';

            console.log("[Reset] Audio player listeners removed and src cleared.");
        } catch (e) {
            console.error("[Reset] Error cleaning up audio player:", e);
        }
    }
    stopSyncLoop();

    // *** Reset ALL relevant state, including intention ***
    state.setState({
        audioPlayer: null,
        currentWordTimestamps: [],
        isPlaying: false,
        playbackIntended: false, // Reset intention on full stop
        currentSentenceIndex: -1,
        nextAudioData: null,
        lastWordElement: null,
        currentHighlightedSentenceId: null,
        isStoppingOnError: false,
        shouldAutoplayNext: false,
        bufferedPausedAudio: null
    });

    updatePlayPauseButtonState('idle');

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