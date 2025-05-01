import * as state from './pageState.js';
import { updateWordHighlightCoordinates, updateActiveSentenceHighlighting, updateHoverHighlightCoordinates } from './coordManager.js';
import { ensureHighlightOverlay } from './domUtils.js'; // Needed for robust overlay access
import { requestSentenceAudio } from './backgroundComms.js';
import { stopPlaybackAndResetState } from './playbackEngine.js';

// T09: Synchronization Engine

function pollingLoop(timestamp) {
    let overlay = ensureHighlightOverlay();
    if (!overlay) {
        // console.warn("Polling loop: Overlay disappeared, stopping."); // Keep this one
        stopPlaybackAndResetState(); // Stop if overlay vanishes
        return;
    }

    // --- Always Update ---
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    // console.log(`[Polling Loop] Scroll: X=${scrollX.toFixed(1)}, Y=${scrollY.toFixed(1)}`); // Reduce log noise
    overlay.style.setProperty('--kokoroScrollX', scrollX + 'px');
    overlay.style.setProperty('--kokoroScrollY', scrollY + 'px');
    updateHoverHighlightCoordinates(); // Hover updates every frame

    // --- Determine Active Segment for Word Highlight ---
    let activeSegmentForWordHighlight = null; // Default to null

    if (state.isPlaying && state.audioPlayer && state.currentWordTimestamps && state.currentWordTimestamps.length > 0) {
        // --- If playing: Find the CURRENT word based on audio time ---
        const currentTime = state.audioPlayer.currentTime;
        let activeWordFound = false;
        for (const wordInfo of state.currentWordTimestamps) {
            if (currentTime >= wordInfo.start && currentTime < wordInfo.end) {
                const expectedWordId = `s-${state.currentSentenceIndex}-w${wordInfo.id}`;
                const wordElement = document.getElementById(expectedWordId);
                // console.log(`[Polling Loop Word Find] Time match: ${currentTime.toFixed(3)} trying ID: '${expectedWordId}'. Found:`, wordElement); // Reduce noise
                if (wordElement) {
                    // Construct segment for the *currently playing* word
                    activeSegmentForWordHighlight = { type: 'word', element: wordElement, id: expectedWordId };
                    if (state.lastWordElement !== wordElement) {
                         // Store the *element* of the last active word
                        state.setState({ lastWordElement: wordElement });
                    }
                    activeWordFound = true;
                    break;
                } else {
                    // console.warn(`[Polling Loop Word Find] Word element NOT found for ID: ${expectedWordId}`); // Reduce noise
                }
            }
        }
         // Clear lastWordElement only if playback has moved past *all* timestamps for the sentence
        if (!activeWordFound && state.currentWordTimestamps.length > 0 && currentTime >= state.currentWordTimestamps[state.currentWordTimestamps.length - 1].end) {
             // state.setState({ lastWordElement: null }); // Let reset handle this
        }

    } else if (!state.isPlaying && state.lastWordElement) {
        // --- If Paused: Use the LAST known active word element ---
        // Make sure the element still exists in the DOM in case of dynamic changes
        if (document.body.contains(state.lastWordElement)) {
            activeSegmentForWordHighlight = { type: 'word', element: state.lastWordElement, id: state.lastWordElement.id };
        } else {
             console.warn("[Polling Loop - Paused] Last word element no longer in DOM. Clearing highlight.");
             state.setState({ lastWordElement: null }); // Clear if element vanished
             activeSegmentForWordHighlight = null;
        }
    }
    // If stopped or before play, activeSegmentForWordHighlight remains null

    // --- Update Coordinates Every Frame (using determined segment) ---
    // console.log(`[Polling Loop] Update Word Coords with segment:`, activeSegmentForWordHighlight); // Reduce noise
    updateWordHighlightCoordinates(activeSegmentForWordHighlight); // Use the determined segment

    // --- Update Sentence Highlight Coordinates Every Frame (using current index) ---
    const currentSentenceIdx = state.currentSentenceIndex;
    if (currentSentenceIdx >= 0) {
        // console.log(`[Polling Loop] Update Sentence Coords for index: ${currentSentenceIdx}`); // Reduce noise
        updateActiveSentenceHighlighting(currentSentenceIdx);

        // Update the *state variable* for current highlighted sentence ID only if it changes during playback
        if (state.isPlaying) {
            const expectedSentenceId = state.sentenceSegments[currentSentenceIdx]?.id;
            const currentSentenceIdFromState = state.currentHighlightedSentenceId;
            if (expectedSentenceId && currentSentenceIdFromState !== expectedSentenceId) {
                state.setState({ currentHighlightedSentenceId: expectedSentenceId });
            }
        }
    } else {
        // Ensure sentence highlight is cleared if index is invalid (e.g., after stop)
        // updateActiveSentenceHighlighting handles index < 0 internally
         // console.log(`[Polling Loop] Clearing Sentence Coords (index: ${currentSentenceIdx})`); // Reduce noise
         updateActiveSentenceHighlighting(-1); // Explicitly clear if index is invalid? Redundant?
    }

    // --- Request next frame ---
    // Only request if we are playing OR if we have a reason to keep polling (like having active highlights)
    if (state.isPlaying || activeSegmentForWordHighlight || currentSentenceIdx >=0 || state.hoveredSentenceId !== null) {
         state.setState({ animationFrameId: requestAnimationFrame(pollingLoop) });
    } else {
         // console.log("[Polling Loop] Conditions met to stop polling (not playing, no active word/sentence/hover)."); // Keep this one
         state.setState({ animationFrameId: null }); // Stop the loop if truly idle
    }
}

function handleTimeUpdate() {
    console.log(`[handleTimeUpdate] Called. currentTime: ${state.audioPlayer?.currentTime?.toFixed(3)}, isPlaying: ${state.isPlaying}`);

    if (!state.isPlaying || !state.audioPlayer || state.currentWordTimestamps.length === 0) {
        console.log(`[handleTimeUpdate] Returning early.`);
        return;
    }

    // Skip if in test mode (constant defined elsewhere, maybe move to state?)
    // const USE_TEST_SENTENCES = false; // Temporary
    // if (USE_TEST_SENTENCES) return;

    const currentTime = state.audioPlayer.currentTime;
    const HIGHLIGHT_OFFSET = 0.1; 

    let activeWordTimestamp = null;
    for (const timing of state.currentWordTimestamps) {
        if (currentTime >= (timing.start + HIGHLIGHT_OFFSET) && currentTime < (timing.end + HIGHLIGHT_OFFSET)) {
            activeWordTimestamp = timing;
            break;
        }
    }

    if (activeWordTimestamp) {
        console.log(`[handleTimeUpdate] Found active timestamp:`, JSON.parse(JSON.stringify(activeWordTimestamp)));
    } 

    let activeSegment = null;
    if (activeWordTimestamp) {
        const expectedSegmentId = `s-${state.currentSentenceIndex}-w${activeWordTimestamp.id}`;
        activeSegment = state.segmentedText.find(seg => seg.id === expectedSegmentId);
        
        if (activeSegment) {
             console.log(`[handleTimeUpdate - ID Match] Found active segment:`, {id: activeSegment.id, text: activeSegment.text, element: !!activeSegment.element});
        } else {
             console.warn(`[handleTimeUpdate] SYNC MISMATCH - TS found (id: ${activeWordTimestamp.id}) but NO segment for ID: ${expectedSegmentId}`);
        }
    }

    // Update word highlight coordinates
    updateWordHighlightCoordinates(activeSegment);
}

export function startSyncLoop() {
    console.log("[startSyncLoop] Sync loop initiated.");
    if (state.animationFrameId === null) {
        if (state.isPlaying) {
            console.log("[startSyncLoop] Player is playing, starting continuous pollingLoop.");
            pollingLoop(); // Start continuous loop if playing
        } else {
            console.log("[startSyncLoop] Player is NOT playing, starting ONE frame of pollingLoop.");
            requestAnimationFrame(pollingLoop); // Start only ONE frame if not playing (e.g., after jump)
        }
    } else {
        console.log("[startSyncLoop] Loop already running or requested. ID:", state.animationFrameId);
    }
}

export function stopSyncLoop() {
    console.log(`[stopSyncLoop] Requesting stop. Current ID: ${state.animationFrameId}`);
    if (state.animationFrameId !== null) {
        cancelAnimationFrame(state.animationFrameId);
        state.setState({ animationFrameId: null }); // Update state
        console.log("[stopSyncLoop] Loop cancelled and ID cleared.");
    }
} 