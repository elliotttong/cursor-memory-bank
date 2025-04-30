// --- Core Setup: Paint Worklet and CSS Custom Properties ---

export function registerPaintWorklet() {
    if ('paintWorklet' in CSS) {
        CSS.paintWorklet.addModule(chrome.runtime.getURL('highlight-painter.js')) // Path relative to extension root
          .then(() => {
            console.log('Kokoro highlighter paint worklet registered.');
          })
          .catch(err => {
            console.error('Error registering Kokoro paint worklet:', err);
          });
      } else {
        console.warn('CSS Paint API (Houdini) is not supported in this browser.');
      }
}

export function registerCSSProperties() {
    try {
        console.log("Attempting to register Kokoro CSS properties...");
        const propertiesToRegister = [
            { name: '--kokoroHighlightWordInfo', syntax: '*' }, // String of coords
            { name: '--kokoroHighlightSentenceInfo', syntax: '*' }, // String of coords
            { name: '--kokoroHoverSentenceInfo', syntax: '*' }, // String of coords
            // Treat colors as generic strings to avoid CSSStyleValue issues in PaintWorklet
            { name: '--kokoroElemColor', syntax: '*' },                 // String: e.g., 'rgb(r, g, b)'
            { name: '--kokoroSentenceHighlightColorDark', syntax: '*' }, // String: e.g., '#RRGGBB'
            { name: '--kokoroSentenceHighlightColorLight', syntax: '*' },// String: e.g., '#RRGGBB'
            { name: '--kokoroWordHighlightColorDark', syntax: '*' },     // String: e.g., '#RRGGBB'
            { name: '--kokoroWordHighlightColorLight', syntax: '*' },    // String: e.g., '#RRGGBB'
            { name: '--kokoroHoverHighlightColorDark', syntax: '*' },    // String: e.g., '#RRGGBB'
            { name: '--kokoroHoverHighlightColorLight', syntax: '*' },   // String: e.g., '#RRGGBB'
            { name: '--kokoroScrollX', syntax: '<number>' }, 
            { name: '--kokoroScrollY', syntax: '<number>' }
        ];
    
        propertiesToRegister.forEach(prop => {
            let initialValue = '';
            if (prop.name.includes('Color')) { 
                if (prop.name.includes('Sentence') && prop.name.includes('Dark')) initialValue = 'rgba(55, 75, 100, 0.5)';
                else if (prop.name.includes('Sentence') && prop.name.includes('Light')) initialValue = 'rgba(230, 232, 255, 0.5)';
                else if (prop.name.includes('Word') && prop.name.includes('Dark')) initialValue = 'rgba(58, 114, 224, 0.5)';
                else if (prop.name.includes('Word') && prop.name.includes('Light')) initialValue = 'rgba(180, 187, 254, 0.5)';
                else if (prop.name.includes('Hover') && prop.name.includes('Dark')) initialValue = 'rgba(85, 85, 85, 0.4)';
                else if (prop.name.includes('Hover') && prop.name.includes('Light')) initialValue = 'rgba(221, 221, 221, 0.4)';
                else if (prop.name === '--kokoroElemColor') initialValue = 'rgb(255, 255, 255)';
                else initialValue = 'transparent'; 
            } else if (prop.syntax === '<number>') {
                initialValue = '0';
            }
    
            CSS.registerProperty({
                name: prop.name,
                syntax: prop.syntax,
                inherits: false, 
                initialValue: initialValue
            });
        });
        console.log("Kokoro CSS properties registered successfully.");
    } catch (e) {
        if (e.message.includes("already registered")) {
             console.warn("Kokoro CSS properties already registered. This is expected during development/HMR.");
        } else {
            console.error("Error registering Kokoro CSS properties:", e);
        }
    }
} 