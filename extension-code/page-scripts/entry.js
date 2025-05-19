// --- Main Entry Point for Content Script Logic ---

import * as state from './pageState.js';
import { registerPaintWorklet, registerCSSProperties } from './coreSetup.js';
import { injectWidget, ensureHighlightOverlay, startOverlayObserver, updatePlayPauseButtonState } from './domUtils.js';
import { getTextToRead, processText } from './textProcessor.js';
import { setupHighlighting } from './spanInjector.js';
import { stopPlaybackAndResetState, handlePlayPauseClick } from './playbackEngine.js';
import { setupBackgroundListener } from './backgroundComms.js';
import { startSyncLoop } from './syncEngine.js';
import { handleSkipPrevious, handleSkipNext } from './userEvents.js';
import { initDragManager } from './dragManager.js';
import { 
    handleSentenceHover,
    handleSentenceHoverOut,
    handleSentenceClick,
    handleLibraryAddClick,
    handleLibraryOpenClick,
    handleHelpClick,
    handleSettingsClick,
    handleUpgradeClick,
    handleVoiceSelectClick,
    handleSpeedSelectClick,
    handleCloseWidgetClick
} from './userEvents.js';
import { initializeProviders } from '../modules/providers/index.js';

console.log("Kokoro Page Script Entry Initializing...");

// --- Main Initialization Function ---
async function initializeKokoroFeatures() {
    console.log(">>> ENTERED initializeKokoroFeatures function.");

    // --- Ensure ProviderManager and all providers are initialized before any UI/widget code ---
    console.log('[Entry] Initializing providers...');
    await initializeProviders();
    console.log('[Entry] Providers initialized. Proceeding with UI/widget setup.');

    state.setState({ isInitialized: false }); 
    
    // Perform setup that doesn't depend on text extraction first
    try {
        registerPaintWorklet();
        registerCSSProperties();
        injectWidget(); // Injects the new widget structure
        ensureHighlightOverlay();
        setupBackgroundListener();
        
        // Initialize drag functionality
        initDragManager();
        console.log("Drag manager initialized.");
    } catch(e) {
        console.error("Error during initial setup (Worklet, CSS, Widget, Overlay, Listener, Drag):", e);
        const playPauseButton = document.getElementById('kokoro-play-pause-button');
        if(playPauseButton) {
             // Assuming error icon/state is handled by updatePlayPauseButtonState
             updatePlayPauseButtonState('error');
             playPauseButton.disabled = true; // Keep disabled on setup error
        }
        return;
    }

    // Attach listeners to the CORE WIDGET after injection
    const widget = document.getElementById('kokoro-tts-widget');
    if (!widget) {
        console.error("[Initialize] Widget not found after injection! Cannot attach core listeners.");
        return;
    }

    const hoverLeaveDelay = 200; // Delay in ms
    let leaveTimeoutId = null; // Variable to hold the timeout ID

    widget.addEventListener('mouseenter', (event) => {
        console.log("[Hover Debug] Mouse ENTERED widget.");
        if (leaveTimeoutId) {
            clearTimeout(leaveTimeoutId);
            leaveTimeoutId = null;
        }
        widget.dataset.hover = 'true';
    });

    widget.addEventListener('mouseleave', (event) => {
        console.log("[Hover Debug] Mouse LEFT widget. Scheduling hover=false check.");
        if (leaveTimeoutId) { // Clear previous before setting new
            clearTimeout(leaveTimeoutId);
        }
        leaveTimeoutId = setTimeout(() => {
            if (!widget.matches(':hover')) { 
                 console.log(`[Hover Debug] Timeout fired (${hoverLeaveDelay}ms), widget is NOT hovered. Setting hover=false.`);
                 widget.dataset.hover = 'false';
            } else {
                 console.log(`[Hover Debug] Timeout fired (${hoverLeaveDelay}ms), widget IS STILL hovered. Keeping hover=true.`);
            }
             leaveTimeoutId = null;
        }, hoverLeaveDelay); 
    });
    // Ensure NO extra widget.addEventListener('click', ...) for hover logic exists here
    // *********************************************

    // Attach listener to the main Play/Pause button
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if (playPauseButton) {
        console.log("[Initialize] Play/Pause button found, attaching listener.");
        playPauseButton.addEventListener('click', handlePlayPauseClick);
        playPauseButton.disabled = true; // Keep disabled until text processed
    } else {
        console.error("[Initialize] Play/Pause button not found. Cannot attach listener.");
        return; 
    }

    // Attach listeners for Skip buttons
    const skipPrevButton = document.getElementById('kokoro-skip-prev-button');
    const skipNextButton = document.getElementById('kokoro-skip-next-button');
    if (skipPrevButton && skipNextButton) {
        console.log("[Initialize] Skip buttons found, attaching listeners.");
        skipPrevButton.addEventListener('click', handleSkipPrevious);
        skipNextButton.addEventListener('click', handleSkipNext);
    } else {
        console.error("[Initialize] Skip buttons not found.");
    }

    // *** Attach Placeholder Listeners for other controls ***
    const libraryAddButton = document.getElementById('kokoro-library-add-button');
    const libraryOpenButton = document.getElementById('kokoro-library-open-button');
    const helpButton = document.getElementById('kokoro-help-button');
    const settingsButton = document.getElementById('kokoro-settings-button');
    const upgradeButton = document.getElementById('kokoro-upgrade-button');
    const voiceButton = document.getElementById('kokoro-voice-button');
    const speedButton = document.getElementById('kokoro-speed-button');
    const closeButton = document.getElementById('kokoro-close-button');

    // (Add simple console logs for now - these will call userEvent handlers later)
    if (libraryAddButton) libraryAddButton.addEventListener('click', handleLibraryAddClick);
    if (libraryOpenButton) libraryOpenButton.addEventListener('click', handleLibraryOpenClick);
    if (helpButton) helpButton.addEventListener('click', handleHelpClick);
    if (settingsButton) settingsButton.addEventListener('click', handleSettingsClick);
    if (upgradeButton) upgradeButton.addEventListener('click', handleUpgradeClick);
    if (voiceButton) voiceButton.addEventListener('click', handleVoiceSelectClick);
    if (speedButton) speedButton.addEventListener('click', handleSpeedSelectClick);
    if (closeButton) closeButton.addEventListener('click', handleCloseWidgetClick);
    // *********************************************************

    // Initialize the voice avatar with the current voice
    if (voiceButton) {
        // Import async to avoid circular dependencies
        import('../modules/ui/voiceSelector.js').then(module => {
            module.updateVoiceAvatar(voiceButton);
        });
    }
    
    // Now attempt text processing and highlighting setup
    try {
        console.log(">>> Attempting text processing and highlighting setup...");

        const { textToRead, targetElement } = getTextToRead();

        if (!textToRead || !targetElement) { 
            console.warn("Initialization: No text found or target element missing. Cannot proceed.");
            if(playPauseButton) updatePlayPauseButtonState('error'); // Indicate error state 
            return; 
        }
        
        const { cleanedSentences, allSegments } = processText(textToRead, false);
        state.setState({ 
            segmentedText: allSegments,
            sentenceSegments: cleanedSentences
        });

        if (state.sentenceSegments.length === 0) {
            console.warn("Initialization: No sentences found after processing text.");
            if(playPauseButton) updatePlayPauseButtonState('error');
            return; 
        }

        // *** Attach sentence click/hover listeners to the targetElement ***
        //    (assuming setupHighlighting adds spans with class/data attributes)
        // Note: Event delegation on targetElement might be more performant
        targetElement.addEventListener('click', handleSentenceClick);
        // targetElement.addEventListener('mouseover', handleSentenceHover);
        // targetElement.addEventListener('mouseout', handleSentenceHoverOut);
        // TODO: Re-evaluate best way to handle hover on spans vs widget hover
        // ***************************************************************

        setupHighlighting(state.segmentedText, targetElement, false);
        console.log("Initialization complete. Spans created.");
        state.setState({ isInitialized: true }); 
        if(playPauseButton) {
            updatePlayPauseButtonState('idle');
            playPauseButton.disabled = false; // Enable play button now
        }

        startOverlayObserver();
        startSyncLoop(); 

    } catch (error) {
        console.error("Error during text processing or highlighting setup:", error);
        state.setState({ 
            isInitialized: false,
            segmentedText: [],
            sentenceSegments: [],
            createdHighlightSpans: []
        }); 
        if(playPauseButton) updatePlayPauseButtonState('error');
    }
}

// --- Wait for DOM ready before Initializing --- 
// Use a flag to prevent multiple initializations
if (!window.kokoroPageScriptInitialized) {
    window.kokoroPageScriptInitialized = true;
    if (document.readyState === 'loading') { 
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOMContentLoaded listener: Initializing Kokoro Features...");
            initializeKokoroFeatures(); 
            console.log("DOMContentLoaded listener: Initialization complete.");
        });
    } else {  
        console.log("DOMContentLoaded already fired: Initializing Kokoro Features...");
        initializeKokoroFeatures();
        console.log("DOMContentLoaded already fired: Initialization complete.");
    }
} else {
    console.log("Kokoro Page Script: Already initialized on this page load.");
} 