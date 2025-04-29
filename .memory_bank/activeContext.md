# Active Context: Implementation Phase 2/4 (BUILD Mode - Houdini Pivot)

**Current Mode:** BUILD
**Current Goal:** Implement Phase 4 (Highlighting & Synchronization) using Houdini Paint API.

**Completed Phases:**
*   Phase 1 (Project Setup & Core Integration)
*   Phase 2 (Basic Highlighting Setup - Spans created)

**Completed Tasks (Build Mode):**
*   (T01-T05): Phase 1 complete.
*   (T06): Basic text processing/segmentation.
*   (T07): Basic highlighting mechanism (wrapping words/punct in spans with IDs).
*   (T08/T09): Using API Timestamps for sync logic base.

**Active Tasks (Phase 4 - Houdini Approach):**
*   ~(T16): Setup Houdini Paint Worklet & adapt paint logic.~ (Done)
*   ~(T17): Define CSS using `paint()` and custom properties.~ (Done)
*   ~(T18): Implement coordinate calculation and dynamic CSS variable updates for sentence/word highlighting.~ (Done)
*   ~(T19): Implement hover highlighting using coordinate calculation and CSS variables.~ *(Done)*
*   **(T20):** Test all Houdini-based highlighting and interactions. *(Current)*

**Key Focus Areas:**

*   ~~Setting up the Houdini Paint Worklet infrastructure (T16.1).~~
*   ~~Implementing robust coordinate calculation (`getClientRects`) for text spans (T18, T19).~~ *(Sentence/Word/Hover Done)*
*   ~~Dynamically updating CSS custom properties to drive the paint worklet (T18, T19).~~ *(Done for Sentence/Word/Hover)*
*   ~~Adapting and testing the paint logic ported from Speechify's code (T16.2).~~

**Next Steps (BUILD Mode):**

1.  ~~Implement T16.1: Create `highlight-painter.js` and register the worklet.~~
2.  ~~Implement T16.2: Adapt paint logic into the worklet.~~
3.  ~~Implement T17: Define CSS rules.~~
4.  ~~Implement T18: Coordinate calculation & dynamic updates.~~
5.  ~~Implement T19: Hover logic.~~
6.  ~~Implement T20: Click-to-play.~~
7.  Test T21. *(Next)*
8.  Address Phase 3 tasks (T10-T15) concurrently or afterwards.