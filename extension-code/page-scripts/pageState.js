// --- State Variables ---
export let audioPlayer = null;
export let segmentedText = []; // Array of ALL segments (sentences and words)
export let sentenceSegments = []; // Array of JUST sentence segments
export let currentSentenceIndex = -1; 
export let isPlaying = false;
export let playbackIntended = false; // NEW: Tracks user's explicit play/pause intention

// Store precise timings received from API
export let currentWordTimestamps = []; // Structure: [{ text, start, end }, ...]
export let nextAudioData = null; // { sentenceIndex: number, audioDataUrl: string, wordTimestamps: [] } | null

export let currentHighlightedWord = null; // Stores the element of the currently highlighted word
// T18: State for tracking the currently highlighted sentence
export let currentHighlightedSentenceId = null; 

export let createdHighlightSpans = []; // T07 state
export let isStoppingOnError = false; // Flag to prevent error handling loops
export let isInitialized = false; // <<< Add initialization flag

export let kokoroOverlayElement = null; // Toplevel variable to hold the overlay
export let kokoroOverlayObserver = null; // Hold the observer instance

// --- Hover State ---
export let hoveredSentenceId = null; // Tracks the sentence ID currently being hovered

// --- T09: Synchronization State ---
export let animationFrameId = null; // Store the ID for cancellation
export let lastWordElement = null; // T18: Keep track of the last element for background color check

// NEW: Buffer for audio received while paused/jumped
export let bufferedPausedAudio = null; // { sentenceIndex, audioObjectURL, wordTimestamps }

// NEW: Flag to indicate if the next received audio should play automatically
export let shouldAutoplayNext = false;

// T19: Voice selection state
export let selectedVoiceId = 'kokoro-82m'; // Default voice ID

// T20: Playback speed state
export let playbackRate = 1.0; // Default playback rate

// T18: Estimated reading time
export let estimatedReadingTimeMinutes = 0; // Estimated reading time in minutes
export let totalWordCount = 0; // Total number of words in the content

// Function to allow modules to update state variables
// This is a simple approach; more complex state management could be used later if needed.
export function setState(newState) {
    if (newState.audioPlayer !== undefined) audioPlayer = newState.audioPlayer;
    if (newState.segmentedText !== undefined) segmentedText = newState.segmentedText;
    if (newState.sentenceSegments !== undefined) sentenceSegments = newState.sentenceSegments;
    if (newState.currentSentenceIndex !== undefined) currentSentenceIndex = newState.currentSentenceIndex;
    if (newState.isPlaying !== undefined) isPlaying = newState.isPlaying;
    if (newState.playbackIntended !== undefined) playbackIntended = newState.playbackIntended;
    if (newState.currentWordTimestamps !== undefined) currentWordTimestamps = newState.currentWordTimestamps;
    if (newState.nextAudioData !== undefined) nextAudioData = newState.nextAudioData;
    if (newState.currentHighlightedWord !== undefined) currentHighlightedWord = newState.currentHighlightedWord;
    if (newState.currentHighlightedSentenceId !== undefined) currentHighlightedSentenceId = newState.currentHighlightedSentenceId;
    if (newState.createdHighlightSpans !== undefined) createdHighlightSpans = newState.createdHighlightSpans;
    if (newState.isStoppingOnError !== undefined) isStoppingOnError = newState.isStoppingOnError;
    if (newState.isInitialized !== undefined) isInitialized = newState.isInitialized;
    if (newState.kokoroOverlayElement !== undefined) kokoroOverlayElement = newState.kokoroOverlayElement;
    if (newState.kokoroOverlayObserver !== undefined) kokoroOverlayObserver = newState.kokoroOverlayObserver;
    if (newState.hoveredSentenceId !== undefined) hoveredSentenceId = newState.hoveredSentenceId;
    if (newState.animationFrameId !== undefined) animationFrameId = newState.animationFrameId;
    if (newState.lastWordElement !== undefined) lastWordElement = newState.lastWordElement;
    if (newState.bufferedPausedAudio !== undefined) bufferedPausedAudio = newState.bufferedPausedAudio;
    if (newState.shouldAutoplayNext !== undefined) shouldAutoplayNext = newState.shouldAutoplayNext;
    if (newState.selectedVoiceId !== undefined) selectedVoiceId = newState.selectedVoiceId;
    if (newState.playbackRate !== undefined) playbackRate = newState.playbackRate;
    if (newState.estimatedReadingTimeMinutes !== undefined) estimatedReadingTimeMinutes = newState.estimatedReadingTimeMinutes;
    if (newState.totalWordCount !== undefined) totalWordCount = newState.totalWordCount;
} 