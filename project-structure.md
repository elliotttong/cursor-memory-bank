# Project Structure

```
extension-code/
│
├── assets/                     # Icons, etc.
├── background.js             # Service worker
├── highlight-painter.js      # Houdini Paint Worklet
├── lib/                        # External libraries (e.g., Readability.js)
├── manifest.json             # Extension manifest
├── page-scripts/             # Content script modules
│   ├── entry.js                # Main entry point, initialization
│   ├── pageState.js            # Shared state variables
│   ├── coreSetup.js            # Worklet, CSS props init
│   ├── domUtils.js             # DOM manipulation (widget, overlay, observers)
│   ├── textProcessor.js        # Text extraction & processing
│   ├── spanInjector.js         # Span creation & event listeners
│   ├── playbackEngine.js       # Audio playback & lifecycle
│   ├── backgroundComms.js      # Background communication
│   ├── syncEngine.js           # Highlighting synchronization loop
│   ├── coordManager.js         # Coordinate calculation & CSS var updates
│   └── userEvents.js           # User interactions (hover, click)
├── popup/                      # Popup UI (if needed)
│   ├── popup.html
│   └── popup.js
└── styles/
    └── content.css             # Styles for injected elements & overlay
``` 