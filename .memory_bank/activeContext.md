# Active Context: Implementation Phase 2 (BUILD Mode)

**Current Mode:** BUILD
**Current Goal:** Implement Phase 2 (Highlighting & Synchronization) of the Chrome TTS Extension MVP.

**Completed Phases:**
*   Phase 1 (Project Setup & Core Integration)

**Completed Tasks (Build Mode):**
*   (T01-T05): Phase 1 complete.
*   (T03/T04): Core TTS API integration & audio playback functional.
*   (T06): Basic text processing/segmentation.

**Active Tasks (Phase 2):**
*   **(T07):** Develop highlighting mechanism (finding/wrapping text nodes).
*   (T08): Timing Strategy (API confirmed no timing data - fallback required).
*   (T09): Core synchronization logic implementation (depends on T07 & T08 strategy).

**Key Focus Areas:**

*   Implementing DOM manipulation for finding and wrapping text for highlighting (T07).
*   Preparing for synchronization logic (T09) based on T07 output.

**Next Steps (BUILD Mode):**

1.  **Implement T07 (Highlighting Mechanism):** Focus on `setupHighlighting` in `content.js`.
2.  Implement T09 (Sync Logic - Fallback).
3.  Test Phase 2 functionality.
4.  Document Phase 2 build.
5.  Proceed to Phase 3 (Refinement & Testing).