# Generator Prompt Template: Creating a UI State Research Prompt

**Objective:** To instruct an AI assistant (like me) to generate a detailed and effective research prompt. This research prompt will be given to *another* AI (or used for manual research) to investigate a persistent and difficult-to-solve UI state management problem.

**Instructions for the AI Assistant Using This Template:**

To use this template, provide the following information based on the *specific* UI state issue you are currently facing:

1.  **Describe the UI State Problem:**
    *   Clearly state the undesired behavior. What *should* happen vs. what *is* happening?
    *   (e.g., "A `data-hover` attribute is being incorrectly removed from the main widget element shortly after clicking specific internal buttons, causing the UI to collapse unexpectedly, even though the mouse pointer remains over the widget.")

2.  **Identify Key Elements & State Mechanism:**
    *   Which primary HTML element(s) are involved? (Provide IDs or unique selectors if possible).
    *   How is the problematic UI state being tracked and controlled? (e.g., `data-*` attributes, CSS classes toggled via JS, React state variables, specific library state).
    *   (e.g., "Element: `#kokoro-tts-widget`. State mechanism: `data-hover="true"`/`"false"` attribute.")

3.  **Specify the Context:**
    *   What is the execution environment? (e.g., Chrome Extension Content Script, Standard Web Page, React Application, Vue Component, etc.).
    *   Are there any relevant frameworks or libraries in use? (e.g., React, jQuery, specific UI libraries).
    *   How is the UI element added to the page? (e.g., Injected dynamically via script, part of initial HTML, rendered by framework).
    *   (e.g., "Context: Chrome Extension Content Script injecting the widget dynamically into the page body. Vanilla JS.")

4.  **Summarize Failed Attempts:**
    *   List the different approaches already tried to solve the problem.
    *   For *each* attempt, briefly explain *why* it failed or what specific edge cases it didn't cover. Be precise.
    *   (e.g., "1. Simple `mouseenter`/`mouseleave`: Failed due to spurious `mouseleave` on internal attribute change. 2. Debounced `mouseleave` + `relatedTarget` check: Failed as `relatedTarget` was often outside during spurious event. 3. Debounced `mouseleave` + `:hover` check: Failed as `:hover` pseudo-class reported false during timeout after specific clicks. 4. Debounced `mouseleave` + click timer reset: Failed *only* for Play/Pause/Skip buttons; timeout still fired incorrectly.")

5.  **Provide Current (Failing) Code Snippets:**
    *   Include the exact code for the event listeners, state update logic, or other relevant functions involved in the *current failing implementation*. Keep snippets focused but provide enough context.
    *   (e.g., ```javascript
// Current event listeners for hover/click...
widget.addEventListener('...'){...}
```)

6.  **Provide Representative Log Snippets:**
    *   Include console logs or other output that clearly demonstrates the failure mode of the *current implementation*. Highlight the key moments showing the incorrect state change.
    *   (e.g., ```log
[Debug] Click detected while hovered. Resetting leave timer.
... (attribute change logs) ...
[Debug] Mouse LEFT widget. Scheduling hover=false.
... (other logs) ...
[Debug] Timeout fired (200ms). Setting hover=false. <--- PROBLEM
```)

**Your Task (Based on the Information Above):**

Construct a detailed, comprehensive, and well-structured **Research Prompt** suitable for submission to another AI assistant or for guiding manual research. This research prompt must:

*   Clearly explain the Problem, Context, and Failed Attempts using the details provided above.
*   Integrate the provided Code Snippets and Log Snippets effectively to illustrate the issue.
*   Formulate specific, targeted research questions for the external AI/researcher. These questions should focus on:
    *   Potential underlying causes for the failure of the *current* approach (considering timing, event loop, DOM manipulation side-effects, environment-specific quirks).
    *   Alternative, potentially more robust strategies or design patterns for managing this type of UI state reliably in the given context.
    *   Relevant known issues, best practices, or pitfalls related to the specific context (e.g., state management in Chrome Content Scripts, handling events on dynamically injected elements).

**Final Output:**

Use the `edit_file` tool to save the generated **Research Prompt** (NOT this template) to a specified Markdown file in the workspace.

**Example Tool Call (To be executed after generating the research prompt):**
```tool_code
print(default_api.edit_file(
    target_file="ui_state_research_prompt.md",
    instructions="Save the generated research prompt to a markdown file.",
    code_edit="<PASTE THE ENTIRE GENERATED RESEARCH PROMPT HERE>"
))
``` 