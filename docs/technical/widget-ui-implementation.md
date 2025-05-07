# Widget UI Implementation

This technical document describes the implementation of the Chrome TTS Extension's floating widget UI, including its structure, styling concepts, state management, and interaction patterns. The focus is on the *architecture* and *approach*, rather than specific pixel values or colors, which can be found in the `content.css` file.

## Core Architecture: Three-Layer Structure

The widget follows a three-layer container structure in the DOM, each layer handling distinct responsibilities:

### 1. Positioning Container (`#kokoro-tts-widget-container`)
- **Responsibility**: Positioning and Drag Handling.
- **Implementation**:
    - Uses `position: fixed` for viewport-relative positioning.
    - Has a `transparent` background to act as a larger, invisible drag handle without obscuring content.
    - Set to the highest `z-index` to ensure it stays on top of page content.
    - Contains no visual styling itself; it purely dictates *where* the visible widget appears.

### 2. Visual Styling Container (`#kokoro-tts-widget-outer`)
- **Responsibility**: Appearance and Glassmorphism.
- **Implementation**:
    - Defines the widget's shape (`border-radius`).
    - Applies the primary background color/effect (using `--widget-bg`).
    - Implements the glassmorphism effect using `backdrop-filter: blur(...)` and vendor prefixes.
    - Manages `border` and `box-shadow` (including inner shadows for depth).
    - Uses `overflow: hidden` to clip content to the rounded corners.
    - Handles hover state transitions for background, border, and shadow, defined by CSS variables (`--widget-hover-bg`, etc.).

### 3. Content Layout Container (`#kokoro-tts-widget`)
- **Responsibility**: Internal Layout and Content Arrangement.
- **Implementation**:
    - Uses `display: flex` with `flex-direction: column` to arrange items vertically.
    - Centers content using `align-items: center` and `justify-content: center`.
    - Manages padding and `gap` between internal sections.
    - Contains the various functional UI elements (buttons, dividers, etc.).

## Glassmorphism Styling Concept

The widget aims for a modern, semi-transparent "frosted glass" look:

1.  **Semi-transparent Background**: Achieved using `rgba()` colors with an alpha channel value less than 1 (e.g., `0.65`) defined in `--widget-bg`. Opacity increases slightly on hover (`--widget-hover-bg`).
2.  **Backdrop Filter**: The core of the effect, `backdrop-filter: blur(value)`, blurs the content *behind* the widget. Vendor prefixes (`-webkit-`) are included for compatibility.
3.  **Subtle Borders & Shadows**: A faint border (`--widget-border`) helps define the edge. A combination of a standard `box-shadow` and an `inset` shadow (`--widget-inner-shadow`) adds depth and simulates light interaction.
4.  **Smooth Transitions**: CSS `transition` properties are applied to background, border, and shadow to ensure smooth visual changes between default and hover states, using `--transition-speed`.

## State Management via CSS and Attributes

The widget reflects its internal state visually using CSS selectors, primarily relying on data attributes and classes set via JavaScript:

### 1. Playback State (`data-playback` attribute)
- The main widget container (`#kokoro-tts-widget`) has a `data-playback` attribute (e.g., `data-playback="playing"`, `data-playback="paused"`).
- CSS rules target this attribute to show/hide the correct icons within the play/pause button:
    ```css
    /* Example: Hide pause icon when not playing */
    #kokoro-tts-widget:not([data-playback="playing"]) .kokoro-pause-icon {
        display: none;
    }
    /* Example: Hide play icon when playing */
    #kokoro-tts-widget[data-playback="playing"] .kokoro-play-icon {
        display: none;
    }
    ```
- Possible states managed: `idle`, `playing`, `paused`, `loading`, `error`.

### 2. Toggleable Button States (`.added` class)
- Buttons like "Add to Library" use a simple class (`.added`) toggled by JavaScript.
- CSS rules hide/show the relevant icons based on the presence of this class:
    ```css
    /* Example: Default state (show add icon) */
    #kokoro-library-add-button .kokoro-library-added-icon { display: none; }
    #kokoro-library-add-button .kokoro-library-add-icon { display: flex; }

    /* Example: Added state (show added icon) */
    #kokoro-library-add-button.added .kokoro-library-add-icon { display: none; }
    #kokoro-library-add-button.added .kokoro-library-added-icon { display: flex; }
    ```

### 3. Standard Interaction States (`:hover`, `:active`)
- Standard CSS pseudo-classes handle visual feedback for mouse interactions (hover effects, press feedback).
- Effects typically involve changes to `background-color`, `color`, `transform`, and `box-shadow`, using dedicated CSS variables (`--button-hover-bg`, etc.).

## Widget Sections and Layout Structure

- The content container (`#kokoro-tts-widget`) uses flexbox (`flex-direction: column`) to stack functional sections vertically.
- Common sections (`.kokoro-v-section`) group related controls (e.g., play/pause, skip controls, voice/speed).
- **Horizontal Exception**: The skip buttons (`.kokoro-v-skip-controls`) override the vertical layout using `flex-direction: row` to appear side-by-side.
- Subtle visual separators (`.kokoro-v-divider`) are used between some sections.

## Icon Implementation Strategy

- **Method**: Unicode Symbols via CSS `::before` pseudo-elements. This avoids external dependencies (images, font files).
- **Positioning**: Icons (`.kokoro-icon`) are absolutely positioned to overlay their button containers perfectly centered. Buttons (`#kokoro-tts-widget button`) are set to `position: relative` to enable this.
    ```css
    .kokoro-icon {
        position: absolute; /* Center over parent */
        /* ... flex centering properties ... */
    }
    #kokoro-tts-widget button {
        position: relative; /* Context for absolute icon */
        /* ... other styles ... */
    }
    ```
- **Definition**: Each icon class defines its symbol using the `content` property:
    ```css
    .kokoro-play-icon::before { content: "▶"; }
    .kokoro-pause-icon::before { content: "⏸"; }
    /* ... etc ... */
    ```
- **State Handling**: As described in State Management, CSS rules control the `display` property of different icon classes based on the widget's state attributes or button classes.

## CSS Variables System (`:root`)

- A comprehensive set of CSS variables are defined in `:root` to centralize styling parameters.
- **Benefits**:
    - **Consistency**: Ensures uniform spacing, colors, radii, etc.
    - **Maintainability**: Easier to update the look and feel by changing variables in one place.
    - **Theming Potential**: Foundation for potential future light/dark modes.
- **Categories**: Variables cover dimensions (`--widget-width`), colors (`--widget-bg`, `--icon-color`), effects (`--widget-shadow`), interaction feedback (`--button-hover-bg`), and timing (`--transition-speed`).

## Responsive Behavior Concept

- While the widget currently has a fixed width defined by `--widget-width`, its internal layout uses flexbox, allowing elements to adjust naturally within that width.
- **Viewport Awareness**: Dragging functionality includes JavaScript logic to prevent the widget from being moved outside the visible viewport boundaries.
- **Overflow Control**: `overflow: hidden` on the styling container ensures content respects the rounded shape.

## DOM Structure Pattern

The HTML generally follows this nested pattern (simplified):

```html
<div id="kokoro-tts-widget-container"> <!-- Positioning -->
  <div id="kokoro-tts-widget-outer"> <!-- Visuals -->
    <div id="kokoro-tts-widget" data-playback="..."> <!-- Layout & State -->

      <!-- Example Section -->
      <div class="kokoro-v-section">
        <button id="some-button" class="..."> <!-- Button Container -->
          <div class="kokoro-icon kokoro-icon-state-1"></div> <!-- Icon State 1 -->
          <div class="kokoro-icon kokoro-icon-state-2"></div> <!-- Icon State 2 -->
        </button>
      </div>

      <!-- Other sections, dividers -->

    </div>
  </div>
</div>
```

## Browser Compatibility Notes

- **Backdrop Filter**: Vendor prefixes (`-webkit-`) are used for broader compatibility.
- **Z-index**: A high value is chosen to minimize conflicts with page styles, but absolute guarantees aren't possible on all sites.
- **Unicode**: Standard symbols are used for wide font support.

## Interaction with Houdini Highlighting

- **Layering**: The widget (`z-index: ...47`) sits directly above the Houdini highlight overlay (`z-index: ...46`).
- **Transparency**: The widget's semi-transparent background ensures highlights painted on the layer below remain visible.

## Performance Considerations

- **Minimal DOM**: The structure is kept relatively simple.
- **CSS Transitions**: Primarily uses performant properties like `transform` and `opacity` (though background/shadow are also transitioned).
- **CSS Variables**: Efficient for browser style calculation.

## Future Enhancements (Conceptual)

- **Expand/Collapse**: Introduce logic to show/hide less critical controls.
- **Theming**: Leverage CSS variables for light/dark mode support based on system preferences or user settings.
- **Accessibility**: Add ARIA attributes and improve keyboard navigation. 