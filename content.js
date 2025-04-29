function processText(text) {
    console.log("Processing text (T06 - Refined Sentence/Word Split + Sentence Cleanup)...", IS_TEST_MODE ? "[TEST MODE]" : "");
    // Sentence splitting regex: Looks for sentence-ending punctuation (. ! ?) followed by space or end of string.
    // Handles basic cases, might need refinement for complex abbreviations or direct speech.
    const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text]; // Fallback to the whole text if no sentences found

    const allSegments = [];
    const cleanedSentences = [];
    let globalWordIndex = 0;

    sentences.forEach((sentence, sentenceIndex) => {
        // Clean sentence: remove leading/trailing whitespace, replace multiple spaces/newlines with single space
        const cleanSentence = sentence.trim().replace(/\s+/g, ' ');
        if (!cleanSentence) return; // Skip empty sentences

        console.log(`--- [LOCAL TOKENIZER TEST] Processing Sentence ${sentenceIndex}: "${cleanSentence}" ---`);
        cleanedSentences.push(cleanSentence); // Store cleaned sentence for API calls

        // Word/Punctuation splitting regex:
        // Matches sequences of word characters OR common punctuation marks.
        // OLD: const regex = /\w+|[.,!?;:¿]/g;
        // NEW: Handles contractions and hyphenated words better
        const regex = /([\w'-]+(?:-\w+)*)|[.,!?;:¿]/g;
        // !!! DEBUG LOG: Verify the regex being used at runtime !!!
        console.log(`[DEBUG REGEX CHECK Sentence ${sentenceIndex}] Regex used:`, regex.toString());
        const segments = [];
        let match;
        let wordIndex = 0;

        while ((match = regex.exec(cleanSentence)) !== null) {
            const segmentText = match[0]; // match[1] captures the word part, match[0] captures the whole match (word or punctuation)
            const segmentType = match[1] ? 'word' : 'punctuation'; // If group 1 matched, it's a word-like segment

            segments.push({
                id: `s${sentenceIndex}-w${wordIndex}`,
                text: segmentText,
                type: segmentType,
                sentenceIndex: sentenceIndex,
                wordIndex: wordIndex, // Index within the sentence
                globalIndex: globalWordIndex, // Index across all sentences
                highlighted: false
            });
            wordIndex++;
            globalWordIndex++;
        }

        allSegments.push(...segments);
        console.log(`--- [LOCAL TOKENIZER TEST] Generated Segments (Sentence ${sentenceIndex}):`, segments);
        console.log("--------------------------------------------------------------------");
    });

    console.log(`Processed text into ${cleanedSentences.length} clean sentences and ${allSegments.length} word/punctuation segments.`);
    return { cleanedSentences, allSegments };
}


// --- Highlighting ---
// ... existing code ... 