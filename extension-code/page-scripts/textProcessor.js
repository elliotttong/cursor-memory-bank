// T06: Text Extraction / Processing

// TODO: Move Readability to Offscreen Document
// Remove the import statement - assume Readability is loaded globally via manifest
// import { Readability } from './readability.js'; 

export function getTextToRead() {
    console.log("Attempting text extraction using Readability.js...");
    let textToRead = null;
    let targetElement = null; 
    
    try {
        const documentClone = document.cloneNode(true);
        const reader = new Readability(documentClone);
        const article = reader.parse();

        if (article && article.textContent) {
            console.log(`Readability extracted article: "${article.title}"`);
            textToRead = article.textContent.trim();
            targetElement = document.body; // Temporary target
            console.log(`Using extracted text (length ${textToRead?.length}) for TTS.`);
            console.log(`Highlighting target (temporary):`, targetElement);
        } else {
            console.warn("Readability could not parse or find main content.");
        }
    } catch (error) {
        console.error("Error during Readability parsing:", error);
        textToRead = null;
        targetElement = null;
    }

    if (!textToRead) {
         console.error("Could not extract suitable text using Readability.");
         // TODO: Improve UI feedback - This requires importing button handling
    }
    
    return { textToRead: textToRead, targetElement: targetElement }; 
}

export function processText(text, isTestMode = false) {
    console.log("Processing text...", isTestMode ? "[TEST MODE]" : "");

    const rawSentences = text.match(/[^.!?¿]+[.!?¿\s]*(?:\s|$)/g) || [text];
    
    let segments = [];
    let sentenceCounter = 0; 
    let wordCounter = 0;

    rawSentences.forEach((rawSentenceText) => {
        const trimmedSentence = rawSentenceText.trim().replace(/\s+/g, ' '); 
        if (!trimmedSentence) return; 

        const sentenceId = `s-${sentenceCounter}`; 
        segments.push({ type: 'sentence', text: trimmedSentence, id: sentenceId, element: null });
        
        if (isTestMode) {
            console.log(`--- [TOKENIZER TEST] Sentence ${sentenceCounter}: "${trimmedSentence}" ---`);
        }

        const wordsAndPunctuation = trimmedSentence.match(/([\w'-]+(?:-\w+)*)|[.,!?;:¿]/g) || [];
        let sentenceWordSegments = [];

        wordsAndPunctuation.forEach((wordText, wordIndexWithinSentence) => {
            if (!wordText) return; 
            const isWord = /^\w+$/.test(wordText);
            const segmentType = isWord ? 'word' : 'punctuation';
            const segmentId = `${sentenceId}-w${wordIndexWithinSentence}`;
            const segment = { type: segmentType, text: wordText, id: segmentId, sentenceId: sentenceId, element: null };
            segments.push(segment);
            if (isTestMode) sentenceWordSegments.push(segment);
            wordCounter++;
        });

        if (isTestMode) {
            console.log(`--- [TOKENIZER TEST] Segments:`, JSON.parse(JSON.stringify(sentenceWordSegments)));
        }
        sentenceCounter++; 
    });

    console.log(`Processed text into ${sentenceCounter} sentences and ${wordCounter} word/punctuation segments.`);
    if (!isTestMode) {
        console.log("First 10 segments (word/punct):", segments.filter(s => s.type !== 'sentence').slice(0, 10));
    }
    return { cleanedSentences: segments.filter(seg => seg.type === 'sentence'), allSegments: segments };
} 