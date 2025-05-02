import * as state from './pageState.js';

// Function to create and inject the highlighter overlay
export function ensureHighlightOverlay() {
    // Access state via module import
    let existingOverlay = document.querySelector('div[data-kokoro="1"]');
    if (existingOverlay && document.body.contains(existingOverlay)) {
        if (state.kokoroOverlayElement !== existingOverlay) {
            state.setState({ kokoroOverlayElement: existingOverlay });
        }
        return state.kokoroOverlayElement;
    }

    if (state.kokoroOverlayElement && !document.body.contains(state.kokoroOverlayElement)) {
        state.setState({ kokoroOverlayElement: null });
    }

    if (!state.kokoroOverlayElement) {
        console.log("Creating Kokoro highlight overlay...");
        const newOverlay = document.createElement('div');
        newOverlay.className = 'kokoro-overlay';
        newOverlay.id = 'kokoro-highlight-overlay';
        newOverlay.dataset.kokoro = '1'; 
        document.body.appendChild(newOverlay);
        state.setState({ kokoroOverlayElement: newOverlay }); // Update state
        console.log("Kokoro highlight overlay added to body.");
    }
    return state.kokoroOverlayElement;
}

// --- UI Placeholder Injection ---
export function injectWidget() {
    console.log("Attempting to inject widget...");
    const widgetExists = document.getElementById('kokoro-tts-widget');
    if (widgetExists) {
      console.log("Widget already exists.");
      return widgetExists;
    }
  
    if (!document.body) {
        console.error("document.body not found, cannot inject widget yet.");
        return null;
    }
  
    // Create the main positioning container (level 1)
    const container = document.createElement('div');
    container.id = 'kokoro-tts-widget-container';
    
    // Create the visual styling container (level 2)
    const outerContainer = document.createElement('div');
    outerContainer.id = 'kokoro-tts-widget-outer';
    container.appendChild(outerContainer);
    
    // Create the content layout container (level 3)
    const widget = document.createElement('div');
    widget.id = 'kokoro-tts-widget';
    widget.dataset.layout = 'V'; // Default to Vertical
    widget.dataset.playback = 'idle';
    widget.dataset.hover = 'false';
    outerContainer.appendChild(widget);

    // Define the HTML structure based on the new design spec
    widget.innerHTML = `
        <!-- Vertical Layout Container -->
        <div class="kokoro-v-layout">

            <!-- Top Section (Time) -->
            <div class="kokoro-v-section kokoro-v-time">
                <span id="kokoro-time-display" class="kokoro-time-text">--:--</span>
            </div>

            <!-- Main Control Section (Play/Pause, Spinner) -->
            <div class="kokoro-v-section kokoro-v-main-control">
                <button id="kokoro-play-pause-button" class="kokoro-play-pause" aria-label="Play">
                    <!-- SVG icons will be injected via CSS background or JS -->
                    <div class="kokoro-progress-ring"></div> 
                    <span class="kokoro-icon kokoro-play-icon"></span>
                    <span class="kokoro-icon kokoro-pause-icon"></span>
                    <span class="kokoro-icon kokoro-loading-spinner"></span>
                    <span class="kokoro-icon kokoro-error-icon"></span>
                </button>
            </div>

            <!-- Skip Controls Section -->
            <div class="kokoro-v-section kokoro-v-skip-controls">
                <button id="kokoro-skip-prev-button" class="kokoro-skip-button" aria-label="Skip Back">
                    <span class="kokoro-icon kokoro-skip-back-icon"></span>
                    <!-- &lt;&lt; -->
                </button>
                <button id="kokoro-skip-next-button" class="kokoro-skip-button" aria-label="Skip Forward">
                     <span class="kokoro-icon kokoro-skip-fwd-icon"></span>
                    <!-- &gt;&gt; -->
                </button>
            </div>

            <!-- Divider (Optional, shown in some states) -->
            <hr class="kokoro-v-divider" /> 

            <!-- Voice & Speed Section -->
            <div class="kokoro-v-section kokoro-v-voice-speed">
                <button id="kokoro-voice-button" class="kokoro-voice-avatar" aria-label="Select Voice">
                    <!-- Avatar IMG placeholder -->
                </button>
                <button id="kokoro-speed-button" class="kokoro-speed-chip" aria-label="Select Speed">
                    1.0x
                </button>
            </div>

            <!-- Hover Controls Section (Initially hidden) -->
            <div class="kokoro-v-section kokoro-v-hover-controls">
                 <button id="kokoro-library-add-button" class="kokoro-hover-button" aria-label="Add to Library">
                     <span class="kokoro-icon kokoro-library-add-icon"></span> 
                     <span class="kokoro-icon kokoro-library-added-icon"></span> 
                 </button>
                 <button id="kokoro-library-open-button" class="kokoro-hover-button" aria-label="Open Library">
                     <span class="kokoro-icon kokoro-library-open-icon"></span>
                 </button>
                 <button id="kokoro-help-button" class="kokoro-hover-button" aria-label="Help / Report Issue">
                     <span class="kokoro-icon kokoro-help-icon"></span>
                 </button>
                 <button id="kokoro-settings-button" class="kokoro-hover-button" aria-label="Settings">
                     <span class="kokoro-icon kokoro-settings-icon"></span>
                 </button>
                 <button id="kokoro-upgrade-button" class="kokoro-hover-button kokoro-upgrade-button" aria-label="Upgrade">
                     <span class="kokoro-icon kokoro-upgrade-icon"></span>
                 </button>
            </div>

             <!-- Close Button (Optional, maybe only shown on hover?) -->
             <button id="kokoro-close-button" class="kokoro-close-button" aria-label="Close Widget">
                 <span class="kokoro-icon kokoro-close-icon"></span>
             </button>

        </div> 
        
        <!-- Horizontal Layout Container (Structure placeholder, styling later) -->
        <div class="kokoro-h-layout">
            <!-- Placeholder for Horizontal elements -->
        </div>
    `;

    // Add the entire container structure to the document body
    document.body.appendChild(container);

    // Initial state setup (e.g., disable button if needed)
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if (playPauseButton) {
        playPauseButton.disabled = false; // Enable by default, state logic will disable if needed
    }
    console.log("Widget Injected with new nested container structure.");
    
    return widget;
}

// --- Function to update Play/Pause Button State ---
export function updatePlayPauseButtonState(stateString) {
    const widget = document.getElementById('kokoro-tts-widget');
    if (!widget) return;

    // Set the data-playback attribute on the root element
    widget.dataset.playback = stateString;

    // Optionally disable the main button (e.g., during loading?)
    // const button = document.getElementById('kokoro-play-pause-button');
    // if (button) {
    //    button.disabled = (stateString === 'loading'); 
    // }

    console.log(`[UI Update] Widget playback state set to: ${stateString}`);

    // Hide/Show skip buttons based on state (can refine this)
    if (stateString === 'idle' || stateString === 'error') {
        // Maybe hide skips?
        // hideSkipButtons(); // Let CSS handle this based on data-playback
    } else {
        // showSkipButtons(); // Let CSS handle this based on data-playback
    }
}

// --- Skip Button Visibility Helpers (Likely REMOVE - CSS handles visibility) ---
// export function showSkipButtons() { ... }
// export function hideSkipButtons() { ... }
// ---------------------------------------------------------------------------

// --- Mutation Observer Logic ---
function handleDOMMutations(mutationsList, observer) {
    const overlayExists = document.querySelector('div[data-kokoro="1"]');
    if (!overlayExists) {
        console.warn("[MutationObserver] Kokoro overlay detached from DOM! Recreating...");
        ensureHighlightOverlay(); // Re-create it
    }
}

// Function to initialize and start the observer
export function startOverlayObserver() {
    if (state.kokoroOverlayObserver) {
        return;
    }
    const observer = new MutationObserver(handleDOMMutations);

    if (document.documentElement) {
        console.log("[MutationObserver] Starting observer on documentElement.");
        observer.observe(document.documentElement, { 
            childList: true,
            subtree: true    
        });
        state.setState({ kokoroOverlayObserver: observer }); // Store observer in state
    } else {
        console.error("[MutationObserver] Cannot start observer: document.documentElement not found.");
    }
}

// Function to stop the observer
export function stopOverlayObserver() {
    if (state.kokoroOverlayObserver) {
        console.log("[MutationObserver] Stopping observer.");
        state.kokoroOverlayObserver.disconnect();
        state.setState({ kokoroOverlayObserver: null }); // Clear observer from state
    }
} 