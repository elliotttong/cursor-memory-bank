import * as state from './pageState.js';
import { handleSentenceHover, handleSentenceHoverOut, handleSentenceClick } from './userEvents.js';

// T07: Highlighting Setup - Creates spans and attaches listeners
export function setupHighlighting(segments, targetElement, isTestMode = false) {
    console.log("Setting up highlighting for", segments.length, "segments in target:", targetElement, isTestMode ? "[TEST MODE]" : "");

    if (!targetElement) {
        console.error("Target element for highlighting not provided.");
        return;
    }

    const walker = document.createTreeWalker(targetElement, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
        if (currentNode.nodeValue.trim()) { 
            textNodes.push({ node: currentNode, originalText: currentNode.nodeValue });
        }
    }
    
    let nodeMap = []; 
    const segmentsToWrap = segments.filter(s => s.type === 'word' || s.type === 'punctuation');
    let simplifiedText = textNodes.map(tn => tn.originalText).join('');
    let searchStartInSimplified = 0;
    let segmentsFoundCount = 0, mappingFailedCount = 0, wrapErrorCount = 0;

    console.log(`[SetupHighlighting] Starting mapping for ${segmentsToWrap.length} word/punct segments...`);

    for (let i = 0; i < segmentsToWrap.length; i++) { 
        const segment = segmentsToWrap[i];
        const segmentText = segment.text; 
        const foundIndex = simplifiedText.indexOf(segmentText, searchStartInSimplified);

        if (foundIndex !== -1) {
            segmentsFoundCount++;
            const endIndex = foundIndex + segmentText.length;
            let segmentStartNode = null, segmentStartOffset = -1;
            let segmentEndNode = null, segmentEndOffset = -1;
            let accumulatedLength = 0;

            for(let j = 0; j < textNodes.length; j++) {
                const nodeInfo = textNodes[j];
                const nodeLength = nodeInfo.originalText.length;
                const nodeStartGlobal = accumulatedLength;
                const nodeEndGlobal = accumulatedLength + nodeLength;

                if (segmentStartOffset === -1 && foundIndex >= nodeStartGlobal && foundIndex < nodeEndGlobal) {
                    segmentStartNode = nodeInfo.node;
                    segmentStartOffset = foundIndex - nodeStartGlobal;
                }
                if (segmentEndOffset === -1 && endIndex > nodeStartGlobal && endIndex <= nodeEndGlobal) {
                    segmentEndNode = nodeInfo.node;
                    segmentEndOffset = endIndex - nodeStartGlobal;
                    break; 
                }
                accumulatedLength += nodeLength;
            }

            if (segmentStartNode && segmentEndNode && segmentStartOffset !== -1 && segmentEndOffset !== -1) {
                 nodeMap.push({ segment, startNode: segmentStartNode, startOffset: segmentStartOffset, endNode: segmentEndNode, endOffset: segmentEndOffset });
                 searchStartInSimplified = endIndex;
            } else {
                mappingFailedCount++;
                if (!isTestMode) console.warn(`[SetupHighlighting WARN ${i}] Could not map segment '${segmentText.replace(/\s+/g, ' ')}' accurately.`);
                searchStartInSimplified += 1; 
            }
        } else {
             if (!isTestMode) console.warn(`[SetupHighlighting WARN ${i}] Segment '${segmentText.replace(/\s+/g, ' ')}' not found.`);
             searchStartInSimplified += segmentText.length; 
        }
    }
    console.log(`[SetupHighlighting] Mapping complete. Found: ${segmentsFoundCount}, Failed map: ${mappingFailedCount}`);

    let successfullyWrappedCount = 0;
    let currentCreatedSpans = []; // Store spans created in this run
    console.log(`[SetupHighlighting] Starting wrapping for ${nodeMap.length} mapped segments...`);

    for (let i = nodeMap.length - 1; i >= 0; i--) { // Wrap in reverse to avoid offset issues
        const mapInfo = nodeMap[i];
        try {
            const range = document.createRange();
            range.setStart(mapInfo.startNode, mapInfo.startOffset);
            range.setEnd(mapInfo.endNode, mapInfo.endOffset);

            // --- REMOVED Strict Check --- 
            // We will now *attempt* to wrap even if nodes differ or aren't text nodes.
            // surroundContents might fail, but the catch block will handle errors.
            // const skipReason = null; 
            // ... (previous detailed logging removed for clarity in this step) ...
            // if (skipReason) { ... continue; }
            // --------------------------
            
            const span = document.createElement('span');
            span.id = mapInfo.segment.id; 
            span.className = `kokoro-segment kokoro-${mapInfo.segment.type}`; 
            span.dataset.sentenceId = mapInfo.segment.sentenceId;

            // Add listeners by importing from userEvents.js
            span.addEventListener('mouseover', handleSentenceHover);
            span.addEventListener('mouseout', handleSentenceHoverOut);
            span.addEventListener('click', handleSentenceClick);

            // Attempt to wrap the contents of the range
            range.surroundContents(span);

            mapInfo.segment.element = span; 
            currentCreatedSpans.push(span); 
            successfullyWrappedCount++; 

        } catch (e) {
            wrapErrorCount++;
             // Log errors specifically related to wrapping attempts on potentially complex ranges
             if (!isTestMode) console.error(`[SetupHighlighting WRAP ERROR ${i}] Error wrapping segment ${mapInfo.segment.id} ('${mapInfo.segment.text.replace(/\s+/g, ' ')}'). Range: [${mapInfo.startNode.nodeName}#${mapInfo.startOffset} -> ${mapInfo.endNode.nodeName}#${mapInfo.endOffset}]. Error: ${e.message}`);
        }
    }
    
    // Update the global state with the newly created spans
    state.setState({ createdHighlightSpans: currentCreatedSpans.reverse() }); // Store in original order

    console.log(`Highlighting setup finished. Mapped: ${nodeMap.length}. Wrapped: ${successfullyWrappedCount}. Errors: ${wrapErrorCount}.`);
} 