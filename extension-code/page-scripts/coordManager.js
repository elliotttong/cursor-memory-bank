import * as state from './pageState.js';
import { ensureHighlightOverlay } from './domUtils.js'; // Needed for robust overlay access

// T18: Update word highlight coordinates
export function updateWordHighlightCoordinates(activeSegment) {
    let overlay = ensureHighlightOverlay();
    if (!overlay) {
        // console.error("Overlay element not found for word highlight update.");
        return;
    }

    // Check if we received a valid word segment object
    let reason = '';
    if (!activeSegment) reason = 'segment is null/undefined';
    else if (typeof activeSegment !== 'object') reason = 'segment is not an object';
    else if (activeSegment.type !== 'word') reason = 'segment type is not word';
    else if (!activeSegment.element) reason = 'segment element is null/undefined';

    if (reason) {
        // Check if the property needs clearing
        const currentWordInfo = overlay.style.getPropertyValue('--kokoroHighlightWordInfo');
        if (currentWordInfo !== '') {
             console.log(`[CoordMgr Word] Clearing word highlight (invalid/null segment).`);
            overlay.style.setProperty('--kokoroHighlightWordInfo', '');
            overlay.style.setProperty('--kokoroElemColor', 'rgb(255, 255, 255)'); // Reset color too
        }
        return;
    }

    const wordSpan = activeSegment.element;
    const rects = wordSpan.getClientRects();
    
    let parentColor = 'rgb(255, 255, 255)'; 
    try {
        if (wordSpan.parentElement) {
            parentColor = window.getComputedStyle(wordSpan.parentElement).backgroundColor;
        }
    } catch(e) { console.warn("Could not get parent background color", e); }

    if (rects.length > 0) {
        const coordString = Array.from(rects)
            .filter(rect => rect.width > 0 && rect.height > 0)
            // Convert to L,T,W,H format (like sentence/hover) for consistency?
            // Or keep as L,T,R,B if painter expects that? Let's assume L,T,W,H for now.
             .map(rect => `${rect.left},${rect.top},${rect.width},${rect.height}`)
            .join(',');
        
        overlay.style.setProperty('--kokoroHighlightWordInfo', coordString);
        overlay.style.setProperty('--kokoroElemColor', parentColor);

    } else {
        const currentWordInfo = overlay.style.getPropertyValue('--kokoroHighlightWordInfo');
        if (currentWordInfo !== '') {
            console.log(`[CoordMgr Word] Clearing --kokoroHighlightWordInfo (zero rects).`);
            overlay.style.setProperty('--kokoroHighlightWordInfo', '');
            overlay.style.setProperty('--kokoroElemColor', 'rgb(255, 255, 255)');
        }
    }
}

// T18: Update sentence highlight coordinates
export function updateSentenceHighlightCoordinates(targetSentenceIndex) {
    let overlay = ensureHighlightOverlay();
    if (!overlay) {
        console.error("Overlay element not found for sentence highlight update.");
        return;
    }

    if (targetSentenceIndex < 0) {
        overlay.style.setProperty('--kokoroHighlightSentenceInfo', ''); 
        return;
    }

    const sentenceId = `s-${targetSentenceIndex}`;
    // Query within the document, assuming spans exist
    const sentenceSpans = document.querySelectorAll(`.kokoro-segment[data-sentence-id="${sentenceId}"]`);

    if (sentenceSpans.length === 0) {
        overlay.style.setProperty('--kokoroHighlightSentenceInfo', ''); 
        return;
    }

    let allRects = [];
    sentenceSpans.forEach(span => {
        try {
            const rects = span.getClientRects();
            for (let i = 0; i < rects.length; i++) {
                const rect = rects[i];
                if (rect.width > 0 && rect.height > 0) { 
                    allRects.push({
                        left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom,
                        width: rect.width, height: rect.height
                    });
                }
            }
        } catch (e) { console.error("Error getting rects for span:", span.id, e); }
    });

    if (allRects.length === 0) {
        overlay.style.setProperty('--kokoroHighlightSentenceInfo', ''); 
        return;
    }

    // --- Line Merging Logic --- 
    const lines = {};
    const tolerance = 5; 
    allRects.forEach(rect => {
        let foundLine = false;
        for (const lineTop in lines) {
            if (Math.abs(rect.top - parseFloat(lineTop)) < tolerance) {
                lines[lineTop].push(rect);
                foundLine = true;
                break;
            }
        }
        if (!foundLine) {
            lines[rect.top] = [rect];
        }
    });

    const lineBoundingBoxes = Object.values(lines).map(lineRects => {
        if (lineRects.length === 0) return null;
        let minX = lineRects[0].left, maxX = lineRects[0].right;
        let minY = lineRects[0].top, maxY = lineRects[0].bottom;

        for (let i = 1; i < lineRects.length; i++) {
            minX = Math.min(minX, lineRects[i].left);
            maxX = Math.max(maxX, lineRects[i].right);
            minY = Math.min(minY, lineRects[i].top);     
            maxY = Math.max(maxY, lineRects[i].bottom); 
        }
        const width = maxX - minX;
        const height = maxY - minY;
        // Return L,T,W,H format
        return [minX, minY, width, height]; 
    }).filter(box => box && box[2] > 0 && box[3] > 0); 
    // --- End Line Merging --- 

    const coordString = lineBoundingBoxes.flat().join(',');
    overlay.style.setProperty('--kokoroHighlightSentenceInfo', coordString); 
}

// Exported wrapper for sentence highlighting updates
export function updateActiveSentenceHighlighting(targetSentenceIndex) {
     console.log(`[CoordMgr] Updating sentence highlight coords for index: ${targetSentenceIndex}`);
     updateSentenceHighlightCoordinates(targetSentenceIndex);
}

// Exported function to clear all highlights via coordinates
export function clearHighlights() {
    console.log("[CoordMgr] Clearing highlights via coordinates...");
    try {
        let overlay = ensureHighlightOverlay();
        if (!overlay) {
            console.error("[clearHighlights] Overlay element could not be ensured!");
            return; 
        }

        // Clear word highlight coords
        updateWordHighlightCoordinates(null);
        state.setState({ lastWordElement: null }); // Also clear the state tracking element

        // Clear sentence highlight coords
        updateSentenceHighlightCoordinates(-1);

        // Clear hover highlight coords
        overlay.style.setProperty('--kokoroHoverSentenceInfo', '');

    } catch (e) {
        console.error("[clearHighlights] Error clearing highlights:", e);
    }
}

// --- NEW Hover Coordinate Update Function ---

export function updateHoverHighlightCoordinates() {
    let overlay = ensureHighlightOverlay();
    if (!overlay) {
        return;
    }

    const sentenceId = state.hoveredSentenceId;

    if (sentenceId) {
        const sentenceSpans = document.querySelectorAll(`.kokoro-segment[data-sentence-id="${sentenceId}"]`);

        if (sentenceSpans.length === 0) {
            overlay.style.setProperty('--kokoroHoverSentenceInfo', '');
            return;
        }

        // Calculate bounding boxes (same logic as updateSentenceHighlightCoordinates)
        let allRects = [];
        sentenceSpans.forEach(span => {
            try {
                const rects = span.getClientRects();
                for (let i = 0; i < rects.length; i++) {
                    const rect = rects[i];
                    if (rect.width > 0 && rect.height > 0) allRects.push(rect);
                }
            } catch (e) { console.error("[Hover Poll] Error getting rects:", e); }
        });

        if (allRects.length === 0) {
            overlay.style.setProperty('--kokoroHoverSentenceInfo', '');
            return;
        }

        const lines = {};
        const tolerance = 5;
        allRects.forEach(rect => {
            let foundLine = false;
            for (const lineTop in lines) {
                if (Math.abs(rect.top - parseFloat(lineTop)) < tolerance) {
                    lines[lineTop].push(rect);
                    foundLine = true;
                    break;
                }
            }
            if (!foundLine) lines[rect.top] = [rect];
        });

        const lineBoundingBoxes = Object.values(lines).map(lineRects => {
            if (lineRects.length === 0) return null;
            let minX = lineRects[0].left, maxX = lineRects[0].right;
            let minY = lineRects[0].top, maxY = lineRects[0].bottom;
            for (let i = 1; i < lineRects.length; i++) {
                minX = Math.min(minX, lineRects[i].left);
                maxX = Math.max(maxX, lineRects[i].right);
                minY = Math.min(minY, lineRects[i].top);
                maxY = Math.max(maxY, lineRects[i].bottom);
            }
            return [minX, minY, maxX - minX, maxY - minY]; // L,T,W,H
        }).filter(box => box && box[2] > 0 && box[3] > 0);

        const coordString = lineBoundingBoxes.flat().join(',');
        overlay.style.setProperty('--kokoroHoverSentenceInfo', coordString);

    } else {
        // Check if the property *needs* clearing to avoid unnecessary style updates
        const currentHoverInfo = overlay.style.getPropertyValue('--kokoroHoverSentenceInfo');
        if (currentHoverInfo !== '') {
             console.log(`[Hover Poll] Clearing --kokoroHoverSentenceInfo`);
            overlay.style.setProperty('--kokoroHoverSentenceInfo', '');
        } 
    }
} 