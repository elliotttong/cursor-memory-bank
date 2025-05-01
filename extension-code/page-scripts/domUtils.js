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
      return;
    }
  
    if (!document.body) {
        console.error("document.body not found, cannot inject widget yet.");
        return;
    }
  
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'kokoro-tts-widget-container'; 
    const widget = document.createElement('div');
    widget.id = 'kokoro-tts-widget';
    widget.innerHTML = `
      <div class="kokoro-widget-row kokoro-widget-main-controls">
          <button id="kokoro-play-pause-button">Play</button>
      </div>
      <div class="kokoro-widget-row kokoro-widget-skip-controls">
          <button id="kokoro-skip-prev-button" class="kokoro-skip-button kokoro-skip-button-hidden" title="Previous Sentence">&lt;&lt;</button> 
          <button id="kokoro-skip-next-button" class="kokoro-skip-button kokoro-skip-button-hidden" title="Next Sentence">&gt;&gt;</button>
      </div>
      <div class="kokoro-widget-row kokoro-widget-label">
          <span>Kokoro TTS</span>
      </div>
    `;
    
    widgetContainer.appendChild(widget);
    document.body.appendChild(widgetContainer);
  
    const playPauseButton = document.getElementById('kokoro-play-pause-button');
    if (playPauseButton) {
        playPauseButton.disabled = true; // Start disabled
        // TODO: Attach handlePlayPauseClick listener (will be imported in entry.js)
    }
    console.log("Widget Injected.");
  }

// --- Function to update Play/Pause Button State ---
export function updatePlayPauseButtonState(stateString) {
    const button = document.getElementById('kokoro-play-pause-button');
    if (!button) return; 

    // Disable button during loading or if API key missing to prevent clicks
    button.disabled = (stateString === 'loading' || stateString === 'apiKeyError');

    // Show skip buttons when loading starts (user initiated playback)
    if (stateString === 'loading') {
        showSkipButtons(); 
    }

    switch(stateString) {
        case 'loading':
            button.textContent = 'Loading...';
            break;
        case 'playing':
            button.textContent = 'Pause'; // Or Pause Icon ⏸️
            button.disabled = false; // Ensure enabled when playing
            break;
        case 'paused':
            button.textContent = 'Play'; // Or Play Icon ▶️
            button.disabled = false; // Ensure enabled when paused
            break;
        case 'error':
            button.textContent = 'Error'; // Or Error Icon ❌
            button.disabled = false; // Allow retry potentially
            break;
        case 'apiKeyError':
            button.textContent = 'API Key?'; // Or Key Icon 🔑
            // Keep disabled
            break;
        case 'idle':
        default:
            button.textContent = 'Play'; // Or Play Icon ▶️
            button.disabled = false; // Ensure enabled when idle/ready
            // Keep skip buttons hidden when idle (handled by stopPlaybackAndResetState calling hideSkipButtons)
            break;
    }
    console.log(`[UI Update] Play/Pause button state set to: ${stateString}`);
}

// --- NEW: Skip Button Visibility Helpers ---
export function showSkipButtons() {
    const prevButton = document.getElementById('kokoro-skip-prev-button');
    const nextButton = document.getElementById('kokoro-skip-next-button');
    if (prevButton) prevButton.classList.remove('kokoro-skip-button-hidden');
    if (nextButton) nextButton.classList.remove('kokoro-skip-button-hidden');
    console.log("[UI Update] Skip buttons shown.");
}

export function hideSkipButtons() {
    const prevButton = document.getElementById('kokoro-skip-prev-button');
    const nextButton = document.getElementById('kokoro-skip-next-button');
    if (prevButton) prevButton.classList.add('kokoro-skip-button-hidden');
    if (nextButton) nextButton.classList.add('kokoro-skip-button-hidden');
    console.log("[UI Update] Skip buttons hidden.");
}
// ----------------------------------------

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