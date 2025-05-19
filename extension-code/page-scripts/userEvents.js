import * as state from './pageState.js';
import { ensureHighlightOverlay, updatePlayPauseButtonState } from './domUtils.js';
import { requestSentenceAudio } from './backgroundComms.js';
import { stopPlaybackAndResetState, handlePlayPauseClick, playSentence } from './playbackEngine.js';
import { startSyncLoop } from './syncEngine.js';
import { updateHoverHighlightCoordinates } from './coordManager.js';
import { createVoiceSelectorPanel, toggleVoiceSelector, updateVoiceAvatar } from '../modules/ui/voiceSelector.js';

// --- Hover Highlighting Logic (Houdini Version) ---
export function handleSentenceHover(event) {
    const target = event.target.closest('.kokoro-segment[data-sentence-id]');
    if (!target || !target.dataset.sentenceId) return;

    const sentenceId = target.dataset.sentenceId;
    
    if (state.hoveredSentenceId !== sentenceId) {
        state.setState({ hoveredSentenceId: sentenceId });
        startSyncLoop();
    }
}

export function handleSentenceHoverOut(event) {
    const target = event.target.closest('.kokoro-segment[data-sentence-id]');
    if (!target || !target.dataset.sentenceId) return;

    if (state.hoveredSentenceId === target.dataset.sentenceId) {
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
        if (clickedIndex < 0 || clickedIndex >= state.sentenceSegments.length) {
            console.error("[Click] Clicked index out of bounds:", clickedIndex);
            return;
        }

        console.log(`[Click] Calling playSentence for index: ${clickedIndex}`);
        state.setState({ playbackIntended: true });
        playSentence(clickedIndex, true);

    } catch (e) {
        console.error("[Click] Error handling click:", e);
    }
}

// --- Skip Button Handlers --- 

export function handleSkipPrevious() {
    console.log("[Skip Previous] Clicked.");
    if (!state.isInitialized || state.currentSentenceIndex <= 0) {
        console.warn("[Skip Previous] Ignored - Not initialized or already at first sentence.");
        return;
    }
    const targetIndex = state.currentSentenceIndex - 1;
    console.log(`[Skip Previous] Target index: ${targetIndex}. Current playback INTENDED: ${state.playbackIntended}`);
    playSentence(targetIndex, state.playbackIntended);
}

export function handleSkipNext() {
    console.log("[Skip Next] Clicked.");
    if (!state.isInitialized || state.currentSentenceIndex >= state.sentenceSegments.length - 1) {
        console.warn("[Skip Next] Ignored - Not initialized or already at last sentence.");
        return;
    }
    const targetIndex = state.currentSentenceIndex + 1;
    console.log(`[Skip Next] Target index: ${targetIndex}. Current playback INTENDED: ${state.playbackIntended}`);
    playSentence(targetIndex, state.playbackIntended);
}
// -------------------------------- 

// --- Placeholder Handlers for New UI Controls ---

export function handleLibraryAddClick() {
    // Add/remove 'added' class for visual feedback (basic)
    const button = document.getElementById('kokoro-library-add-button');
    if (button) button.classList.toggle('added'); 
    console.log("[Placeholder] Library Add/Remove Toggled");
    // TODO: Implement actual logic to save/remove from library
}

export function handleLibraryOpenClick() {
    console.log("[Placeholder] Open Library Clicked");
    // TODO: Implement logic to open library view/tab
}

export function handleHelpClick() {
    console.log("[Placeholder] Help Clicked");
    // TODO: Implement logic to show help/report dialog
}

export function handleSettingsClick() {
    console.log("[Placeholder] Settings Clicked");
    // TODO: Implement logic to show settings panel
}

export function handleUpgradeClick() {
    console.log("[Placeholder] Upgrade Clicked");
    // TODO: Implement logic to show upgrade/paywall info
}

export function handleVoiceSelectClick() {
    console.log("[Voice Selector] Voice Select button clicked");
    
    // Get the container element to attach the selector to
    const container = document.getElementById('kokoro-tts-widget-container');
    if (!container) {
        console.error("[Voice Selector] Container not found");
        return;
    }
    
    // Create voice selector panel if it doesn't exist yet
    let selectorPanel = document.querySelector('.kokoro-voice-selector');
    if (!selectorPanel) {
        selectorPanel = createVoiceSelectorPanel(container);
    }
    
    // Toggle the visibility of the selector panel
    toggleVoiceSelector();

    // Update the voice avatar
    const voiceButton = document.getElementById('kokoro-voice-button');
    if (voiceButton) {
        updateVoiceAvatar(voiceButton);
    }
}

export function handleSpeedSelectClick() {
    console.log("[Placeholder] Speed Select Clicked");
    // TODO: Implement logic to show speed selection pop-out
}

export function handleCloseWidgetClick() {
    console.log("[Placeholder] Close Widget Clicked");
    const widget = document.getElementById('kokoro-tts-widget');
    if (widget) {
        widget.style.display = 'none'; // Simple hide
    }
    // TODO: Add logic to potentially re-show later or persist closed state?
}

// -------------------------------- 