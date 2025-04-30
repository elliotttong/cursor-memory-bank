// --- Main Entry Point for Content Script Logic ---

import * as state from './pageState.js';
import { registerPaintWorklet, registerCSSProperties } from './coreSetup.js';
import { injectWidget, ensureHighlightOverlay, startOverlayObserver } from './domUtils.js';
import { getTextToRead, processText } from './textProcessor.js';
import { setupHighlighting } from './spanInjector.js';
import { handlePlayPauseClick } from './playbackEngine.js';
import { setupBackgroundListener } from './backgroundComms.js';
import { startSyncLoop } from './syncEngine.js';

console.log("Kokoro Page Script Entry Initializing...");

// --- Main Initialization Function ---
async function initializeKokoroFeatures() {
    console.log(">>> ENTERED initializeKokoroFeatures function.");

    state.setState({ isInitialized: false }); 
    
    // Perform setup that doesn't depend on text extraction first
    try {
        registerPaintWorklet();
        registerCSSProperties();
        injectWidget(); // This function now only creates the widget
        ensureHighlightOverlay(); // Ensure overlay exists
        setupBackgroundListener(); // Start listening for messages
    } catch(e) {
        console.error("Error during initial setup (Worklet, CSS, Widget, Overlay, Listener):", e);
        // Potentially disable UI if core setup fails
        const playPauseButton = document.getElementById('kokoro-play-pause-button');
        if(playPauseButton) {
             playPauseButton.textContent = "Setup Error";
             playPauseButton.disabled = true;
        }
        return; // Stop initialization
    }

    // Attach listener to the button *after* widget injection
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if (playPauseButton) {
        console.log("[Initialize] Play/Pause button found, attaching listener.");
        playPauseButton.addEventListener('click', handlePlayPauseClick); // Attach imported handler
        playPauseButton.disabled = true; // Keep disabled until text processed
    } else {
        console.error("[Initialize] Play/Pause button not found after injection. Cannot attach listener.");
        // No point continuing if core UI is missing
        return; 
    }
    
    // Now attempt text processing and highlighting setup
    try {
        console.log(">>> Attempting text processing and highlighting setup...");

        const { textToRead, targetElement } = getTextToRead();

        if (!textToRead || !targetElement) { 
            console.warn("Initialization: No text found or target element missing. Cannot proceed.");
            if(playPauseButton) playPauseButton.textContent = "No Text"; 
            // Keep button disabled
            return; 
        }
        
        const { cleanedSentences, allSegments } = processText(textToRead, false);
        // Update state
        state.setState({ 
            segmentedText: allSegments,
            sentenceSegments: cleanedSentences
        });

        if (state.sentenceSegments.length === 0) {
            console.warn("Initialization: No sentences found after processing text.");
            if(playPauseButton) playPauseButton.textContent = "No Sentences";
            return; 
        }

        setupHighlighting(state.segmentedText, targetElement, false);
        console.log("Initialization complete. Spans created.");
        state.setState({ isInitialized: true }); 
        if(playPauseButton) playPauseButton.disabled = false; // Enable button on full success

        startOverlayObserver(); // Start observer only on full success

        // <<< Start the polling loop AFTER successful initialization >>>
        startSyncLoop(); 

    } catch (error) {
        console.error("Error during text processing or highlighting setup:", error);
        state.setState({ 
            isInitialized: false,
            segmentedText: [],
            sentenceSegments: [],
            createdHighlightSpans: [] // Clear potential partial state
        }); 
        if(playPauseButton) { 
             playPauseButton.textContent = "Init Error";
             playPauseButton.disabled = true;
        }
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