# M07: Floating Widget UI

**Analysis Status:** Complete
**Analysis Date:** YYYY-MM-DD (Update with current date)
**Author:** AI Assistant

## 1. Goal

Examine the implementation of the persistent floating player widget. How is it injected onto the page? What technologies might be used (if discernible)? How does it handle different website layouts, scrolling, and potential overlaps with page elements?

## 2. Competitor Analysis (Deep Dive)

### Speechify

*   **Injection Method:** Injects UI elements directly into the host page's DOM. Content scripts likely use `document.createElement` to create a container `div` and `document.body.appendChild` (or similar) to add it to the page.
*   **Technology:** Uses **React/Preact** (evident from previous code analysis) to render components *inside* the injected container. Relies on standard **HTML, CSS, and JavaScript**.
*   **Style Isolation:** Appears to rely on **CSS scoping/namespacing** within its React components rather than Shadow DOM for the main player, increasing potential for style conflicts with the host page.
*   **Layout/Scrolling Handling:**
    *   Achieves persistence during scrolling using `position: fixed;` CSS on the main container.
    *   Uses a very high `z-index` (e.g., `2147483647`) to stay visually on top of most page elements.
    *   Employs **site-specific logic** (detecting `hostname`/`href`) to adjust initial placement and potentially tailor UI injection points (e.g., adding inline buttons on Reddit comments vs. a single player on Wikipedia).
    *   Likely uses JavaScript (`getBoundingClientRect`, potentially `IntersectionObserver`) for dynamic adjustments to avoid overlapping critical *fixed* page elements (like headers or banners) and to respond to viewport resizing.
    *   Uses CSS transitions for smooth appearance/disappearance.
*   **Evidence:** DOM inspection of the live extension, code searches confirming DOM manipulation methods (`createElement`, `appendChild`, `querySelector`), `hostname`/`location` checks, and presence of React patterns.

### NaturalReader

*   **Injection Method:** Similar to Speechify, uses direct DOM injection via content scripts (`createElement`, `appendChild`).
*   **Technology:** Primarily **standard HTML, CSS, and JavaScript**. Less evidence of a major component framework like React being used for the core player UI.
*   **Style Isolation:** Relies on standard **CSS scoping/namespacing**.
*   **Layout/Scrolling Handling:**
    *   Uses `position: fixed;` and a high `z-index` for persistence and visibility.
    *   Appears to have simpler layout handling than Speechify, relying more on the initial fixed position without complex dynamic adjustments for element overlap.
*   **Evidence:** DOM inspection, code searches showing basic DOM manipulation and styling.

### ReadVox

*   **Method:** (Analysis Pending)
*   **Evidence:** TBD
*   **Layout Handling:** TBD

## 3. Technical Decision & Implementation Plan

### Decision: Inject Custom Element with Shadow DOM

Implement the floating widget as a **Custom Element** injected into the page by the content script, utilizing the **Shadow DOM** for robust style and structure encapsulation.

### Rationale:

*   **Superior Isolation:** Shadow DOM provides the strongest protection against CSS conflicts between the widget and the host page, a potential issue with the direct injection methods used by competitors.
*   **Encapsulation & Maintainability:** Keeps the widget's complex HTML structure, CSS, and JavaScript logic neatly contained and separate from the page DOM. Custom Elements offer a standard, reusable component model.
*   **Framework Agnostic/Compatible:** While we can use vanilla JS, this approach allows rendering complex UI frameworks (React, Vue, Svelte, etc.) *inside* the shadow root if future complexity demands it.

### Implementation Steps (Clear Guidance):

1.  **Define the Custom Element (`floating-player.js` or similar):**
    *   Create a class `FloatingPlayerWidget` extending `HTMLElement`.
    *   In its `constructor` or `connectedCallback`:
        *   Attach the shadow root: `const shadowRoot = this.attachShadow({ mode: 'open' });`
        *   Define the widget's internal HTML template (e.g., using a `<template>` element for efficiency). Include containers for buttons (play/pause, skip), progress bar, speed control, voice selector.
        *   Define the widget's internal CSS within a `<style>` tag. Use modern CSS (Flexbox/Grid) for layout. Ensure all styles are defined *within* this tag.
            ```css
            /* Example internal style */
            .player-container {
              display: flex;
              align-items: center;
              background-color: #f0f0f0;
              padding: 10px;
              border-radius: 8px;
              /* ... other internal styles ... */
            }
            button { /* Styles are scoped to shadow DOM */
              /* ... button styles ... */
            }
            ```
        *   Clone the template and append it to the `shadowRoot`: `shadowRoot.appendChild(template.content.cloneNode(true));`
        *   Query select internal elements *from the shadowRoot* (e.g., `this.playButton = shadowRoot.querySelector('#play-pause-button');`) and attach internal event listeners (`this.playButton.addEventListener('click', ...);`).
2.  **Register the Custom Element (in `content_script.js`):**
    *   Import the class definition.
    *   Register it *once*: `if (!customElements.get('floating-player-widget')) { customElements.define('floating-player-widget', FloatingPlayerWidget); }`
3.  **Injection Logic (in `content_script.js`):**
    *   Function `showPlayer()`:
        *   Check if element exists: `let player = document.querySelector('floating-player-widget');`
        *   If not (`!player`):
            *   `player = document.createElement('floating-player-widget');`
            *   `player.id = 'my-tts-player-widget'; // Assign an ID for easy access`
            *   `document.body.appendChild(player);`
        *   Ensure visibility (remove any 'hidden' class).
    *   Function `hidePlayer()`:
        *   Find the player: `const player = document.querySelector('floating-player-widget');`
        *   If player exists, add a class for hiding (e.g., `player.classList.add('hidden');`) or remove it from DOM (`player.remove();`) if preferred.
4.  **Host Page Styling (Inject CSS via `manifest.json` or dynamically):**
    *   Create a CSS file (e.g., `widget_host_styles.css`) to style the *custom element tag itself* for positioning.
    *   **Crucially, these styles target `floating-player-widget`, NOT elements *inside* the shadow DOM.**
        ```css
        /* widget_host_styles.css */
        floating-player-widget {
          position: fixed;
          bottom: 25px;
          right: 25px;
          width: 350px; /* Example */
          height: auto;
          z-index: 2147483647 !important; /* Max z-index, !important helps fight page styles */
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
          /* Add initial box-shadow, border-radius etc. if desired */
        }

        floating-player-widget.hidden {
          opacity: 0;
          transform: translateY(100%); /* Example hide animation */
          pointer-events: none;
        }
        ```
    *   Reference this CSS file in the `content_scripts` section of `manifest.json`.
5.  **Communication (Content Script <-> Custom Element):**
    *   **Widget -> Content Script:** Inside the custom element class, dispatch custom events for user actions:
        ```javascript
        // Inside FloatingPlayerWidget class
        this.playButton.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('player-play-pause', { bubbles: true, composed: true }));
        });
        ```
        Listen for these events in the content script:
        ```javascript
        // In content_script.js
        document.addEventListener('player-play-pause', (event) => {
          // Check event.target if needed
          handlePlayPauseRequest();
        });
        ```
    *   **Content Script -> Widget:** Call public methods defined on the custom element class or set attributes/properties:
        ```javascript
        // In content_script.js
        const player = document.querySelector('floating-player-widget');
        if (player) {
          player.updateProgress(newPercentage); // Assumes updateProgress method exists
          player.setAttribute('state', 'playing'); // Update state via attribute if needed for CSS
        }
        ```
        Define corresponding methods/attribute handlers within the `FloatingPlayerWidget` class.
6.  **Layout/Overlap Handling:**
    *   Begin with the high `z-index` fixed positioning.
    *   Defer complex overlap detection unless specific site conflicts become apparent during testing.
    *   Ensure the widget adapts reasonably to different viewport sizes using CSS within the Shadow DOM.

## 4. Open Questions / Future Considerations

*   User customization of widget position (draggable?). Defer unless requested.
*   Handling conflicts with site `z-index` wars. Manual user repositioning might be the simplest initial solution if conflicts arise.
*   Accessibility: Ensure shadow DOM internals are accessible. Use ARIA attributes appropriately on controls within the custom element.

## 5. Related Features

*   Requires **M08 (State Management)** for data to display.
*   Triggered by **M09 (Activation Control)**.
*   Hosts UI for **M10 (Voice Selection)**, **M05 (Speed Control)**, **S08 (Scrubbing)**. 