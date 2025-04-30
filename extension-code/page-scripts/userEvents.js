import * as state from './pageState.js';
import { ensureHighlightOverlay } from './domUtils.js';
import { requestSentenceAudio } from './backgroundComms.js';
import { stopPlaybackAndResetState } from './playbackEngine.js';
import { startSyncLoop } from './syncEngine.js';

// --- Hover Highlighting Logic (Houdini Version) ---
export function handleSentenceHover(event) {
    const target = event.target.closest('.kokoro-segment');
    if (!target || !target.dataset.sentenceId) return;

    const sentenceId = target.dataset.sentenceId;
    
    if (state.hoveredSentenceId !== sentenceId) {
        console.log(`[Hover In] Setting hoveredSentenceId to: ${sentenceId}`);
        state.setState({ hoveredSentenceId: sentenceId });
        startSyncLoop();
    }
}

export function handleSentenceHoverOut(event) {
    const target = event.target.closest('.kokoro-segment');
    if (!target || !target.dataset.sentenceId) return;

    if (state.hoveredSentenceId === target.dataset.sentenceId) {
        console.log(`[Hover Out] Clearing hoveredSentenceId (was ${state.hoveredSentenceId})`);
        state.setState({ hoveredSentenceId: null });
    }
}

// --- Click-to-Play Logic --- 
export function handleSentenceClick(event) {
    if (!state.isInitialized) {
        console.warn("[Click] Ignored - Not initialized.");
        return;
    }
    const target = event.target.closest('.kokoro-segment[data-sentence-id]');
    if (!target) {
        console.warn("[Click] Clicked target missing sentenceId.");
        return;
    }
    const sentenceId = target.dataset.sentenceId;
    console.log(`[Click] Detected click on sentence: ${sentenceId}`);

    try {
        const indexStr = sentenceId.split('-')[1];
        const clickedIndex = parseInt(indexStr, 10);

        if (isNaN(clickedIndex)) {
            console.error("[Click] Could not parse index from ID:", sentenceId);
            return;
        }
        if (clickedIndex === state.currentSentenceIndex && state.isPlaying) {
            console.log("[Click] Clicked on currently playing sentence. Ignoring.");
            return; 
        }
        if (clickedIndex < 0 || clickedIndex >= state.sentenceSegments.length) {
            console.error("[Click] Clicked index out of bounds:", clickedIndex);
            return;
        }

        console.log(`[Click] Starting playback from index: ${clickedIndex}`);
        startPlaybackFromSentence(clickedIndex);

    } catch (e) {
        console.error("[Click] Error handling click:", e);
    }
}

// Internal function called by click handler
function startPlaybackFromSentence(index) {
    console.log(`Starting playback from sentence: ${index}`);
    
    stopPlaybackAndResetState(); // Reset playback state first
    
    // Clear hover highlight explicitly
    try {
        let overlay = ensureHighlightOverlay();
        if (overlay) overlay.style.setProperty('--kokoroHoverSentenceInfo', '');
    } catch(e) { console.error("[Click->Start] Error clearing hover:", e); }
    
    // Set new target index in state
    state.setState({ currentSentenceIndex: index });

    // Update UI
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if(playPauseButton) {
        playPauseButton.textContent = "Loading...";
        playPauseButton.disabled = true;
    }

    // Request audio for the target sentence
    requestSentenceAudio(state.currentSentenceIndex); 
} 