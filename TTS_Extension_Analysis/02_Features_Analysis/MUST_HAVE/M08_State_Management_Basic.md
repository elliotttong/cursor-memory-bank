# M08: State Management (Basic)

**Analysis Status:** Complete
**Analysis Date:** YYYY-MM-DD (Update with current date)
**Author:** AI Assistant

## 1. Goal

Identify how the extension tracks the current essential playback state (e.g., playing/paused, current audio position, current text segment index/reference) during an active reading session on a single page. This focuses on the *in-memory state* for a single session, not persistence across reloads (which is S01).

## 2. Competitor Analysis

### Speechify

*   **Method:** Likely uses a combination of React component state (`useState`, `useReducer`) and a more centralized custom store or a lightweight state management library (like Zustand/Jotai). Custom hooks (`useTime`, `useProgress`, `seekTo` mentioned in M04 analysis) likely encapsulate specific state logic.
*   **Evidence:**
    *   Code in `content/chunk-SWWFND36.js` shows functions like `getState()`, `setState()`, `subscribe()`, and refers to combining state from different sources (`config`, `featureflags`, `user`), strongly suggesting a structured, centralized store pattern.
    *   Previous analysis (M02, M04) identified the likely use of React hooks for managing playback, buffering, and progress states.
    *   The overall architecture uses components, favoring a structured state approach.
*   **Key State Variables (Inferred):** `isPlaying`, `isLoading`, `isBuffering`, `currentTime`, `duration`, `currentWordIndex`, `currentSentenceIndex`, `playbackRate`, `selectedVoice`.

### NaturalReader

*   **Method:** Appears to use a simpler, direct vanilla JavaScript approach. State is likely managed through variables scoped within content scripts or specific modules, and by directly reading properties from the HTML `<audio>` element.
*   **Evidence:**
    *   Code searches did not reveal explicit state management patterns (`getState`, `setState`, dedicated state objects).
    *   Relies on polling `audio.currentTime` (M04 analysis), indicating direct access to the audio element's state.
    *   UI updates likely happen directly within event listeners that also modify local script variables holding state flags (e.g., a `let isPlaying = false;` variable toggled in play/pause handlers).
*   **Key State Variables (Inferred):** relies heavily on `HTMLAudioElement` properties (`paused`, `currentTime`, `duration`, `playbackRate`), supplemented by script-scoped variables for tracking things like the current text segment or highlight status.

### ReadVox

*   **Method:** (Analysis Pending)
*   **Evidence:** TBD
*   **Key State Variables (Inferred):** TBD

## 3. Technical Decision & Implementation Plan

### Decision: Centralized State Slice with Context/Hook (React) or Module (Vanilla JS)

Given the interconnected nature of playback state (time affects highlight, playing status affects UI, etc.), a slightly structured approach is recommended over scattered `useState` calls or simple global variables.

**If using React/Preact for the UI (e.g., for the Floating Widget M07):**

*   **Approach:** Use React's **Context API** combined with a **`useReducer` hook** or a custom hook managing multiple `useState` calls to handle the playback state slice.
*   **Rationale:**
    *   Keeps related state logic together.
    *   Avoids prop drilling state deep into the component tree.
    *   `useReducer` is well-suited for managing state with multiple, well-defined actions (play, pause, seek, updateTime, setVoice, setSpeed, setLoading, etc.).
    *   Fits naturally within the React ecosystem.

**If using primarily Vanilla JS:**

*   **Approach:** Create a dedicated **JavaScript module** (e.g., `playbackState.js`) that encapsulates the state and provides getter/setter functions and potentially a simple subscription mechanism.
*   **Rationale:**
    *   Provides a single source of truth for playback state.
    *   Organizes state logic away from direct DOM manipulation code.
    *   Allows different parts of the extension (e.g., content script, player UI) to access and update state consistently.

### Implementation Steps (React Context + Reducer Example):

1.  **Define State Shape:** Determine the essential pieces of state needed *for an active session*:
    ```typescript
    interface PlaybackState {
      status: 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error';
      currentTime: number;
      duration: number;
      currentWordIndex: number | null;
      currentSentenceIndex: number | null;
      playbackRate: number;
      selectedVoiceId: string | null;
      errorMessage?: string;
      // Potentially: reference to the currently loaded audio source/segments
    }
    ```
2.  **Define Actions:** Create action types for all possible state transitions:
    ```typescript
    type PlaybackAction =
      | { type: 'PLAY' }
      | { type: 'PAUSE' }
      | { type: 'LOAD_START' }
      | { type: 'LOAD_SUCCESS'; payload: { duration: number } }
      | { type: 'LOAD_ERROR'; payload: { message: string } }
      | { type: 'UPDATE_TIME'; payload: { time: number } }
      | { type: 'UPDATE_HIGHLIGHT'; payload: { wordIndex: number | null, sentenceIndex: number | null } }
      | { type: 'SEEK'; payload: { time: number } }
      | { type: 'SET_RATE'; payload: { rate: number } }
      | { type: 'SET_VOICE'; payload: { voiceId: string } }
      | { type: 'RESET' };
    ```
3.  **Create Reducer Function:** Implement a pure function that takes the current state and an action, and returns the new state.
    ```typescript
    function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
      switch (action.type) {
        case 'PLAY': return { ...state, status: 'playing' };
        case 'PAUSE': return { ...state, status: 'paused' };
        case 'UPDATE_TIME': return { ...state, currentTime: action.payload.time };
        // ... other cases
        case 'RESET': return initialPlaybackState;
        default: return state;
      }
    }
    ```
4.  **Create Context & Provider:**
    *   Create the context: `const PlaybackContext = createContext<{ state: PlaybackState; dispatch: React.Dispatch<PlaybackAction> } | undefined>(undefined);`
    *   Create a provider component that uses `useReducer` and passes `state` and `dispatch` down via the context provider.
    ```typescript
    const initialPlaybackState: PlaybackState = { /* ... initial values ... */ };
    export const PlaybackProvider = ({ children }) => {
      const [state, dispatch] = useReducer(playbackReducer, initialPlaybackState);
      return <PlaybackContext.Provider value={{ state, dispatch }}>{children}</PlaybackContext.Provider>;
    };
    ```
5.  **Use the Context:** Wrap the relevant parts of your UI (e.g., the component rendering the floating player) with `PlaybackProvider`. Access state and dispatch actions in components using `useContext(PlaybackContext)`.
    ```typescript
    function PlayerControls() {
      const { state, dispatch } = useContext(PlaybackContext);
      // Use state.status, state.currentTime etc. to render UI
      const handlePlay = () => dispatch({ type: 'PLAY' });
      // ...
    }
    ```
6.  **Connect to Audio Logic:** The core audio playing logic (whether using HTML5 Audio or Web Audio API) will dispatch actions to this reducer based on audio events (`onplay`, `onpause`, `ontimeupdate`, `onerror`, `onloadedmetadata`). UI components dispatch actions based on user interaction.

### Implementation Steps (Vanilla JS Module Example):

1.  **Create `playbackState.js`:**
    ```javascript
    let state = { /* initial state shape */ };
    const listeners = new Set();

    export function getState() {
      return { ...state }; // Return a copy
    }

    export function updateState(newStatePartial) {
      const previousState = { ...state };
      state = { ...state, ...newStatePartial };
      // Notify listeners if state actually changed
      if (JSON.stringify(previousState) !== JSON.stringify(state)) {
         listeners.forEach(listener => listener(state, previousState));
      }
    }

    export function subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener); // Unsubscribe function
    }

    export function resetState() {
       updateState({ /* initial state shape */ });
    }
    ```
2.  **Usage:**
    *   Import functions: `import { getState, updateState, subscribe } from './playbackState.js';`
    *   Get state: `const currentStatus = getState().status;`
    *   Update state: `updateState({ status: 'playing', currentTime: newTime });`
    *   Listen for changes: `const unsubscribe = subscribe((newState) => { /* Update UI */ });`

## 4. Open Questions / Future Considerations

*   How will this session state interact with persistent state (S01) saved in `chrome.storage`?
*   Need clear boundaries: what state is *purely* for the current session vs. what needs saving?
*   Complexity: If state becomes significantly more complex (e.g., managing multiple audio buffers, complex undo/redo), migrating to a more robust library (Zustand, Redux Toolkit) might be warranted later.

## 5. Related Features

*   **M07 (Floating Widget):** UI reads from this state.
*   **M04 (Sync):** Logic updates `currentTime` and `current...Index` state.
*   **M05 (Speed):** Updates `playbackRate` state.
*   **M10 (Voice):** Updates `selectedVoiceId` state.
*   **S01 (Persistence):** Reads initial state from storage on load, potentially saves key parts of this state on changes or unload.
*   **S08 (Scrubbing):** Dispatches actions to update `currentTime`. 