/**
 * Drag Manager for Kokoro TTS Widget
 * Handles dragging and position persistence for the widget
 */

// Use local storage keys
const POSITION_STORAGE_KEY = 'kokoroWidgetPosition';

/**
 * Get the widget width from CSS custom property
 * @returns {number} The widget width in pixels
 */
function getWidgetWidth() {
  // Get the computed width from CSS variable
  const widthVar = getComputedStyle(document.documentElement).getPropertyValue('--widget-width').trim();
  
  // Parse the value (removing 'px' if present)
  const parsedWidth = parseInt(widthVar);
  
  // Return parsed value or fallback to 48px if parsing fails
  return !isNaN(parsedWidth) ? parsedWidth : 48;
}

/**
 * Initialize draggability for the widget container
 */
export function initDragManager() {
  const container = document.getElementById('kokoro-tts-widget-container');
  if (!container) return;
  
  let isDragging = false;
  let offsetX, offsetY;
  
  // Load saved position from localStorage
  const savedPosition = JSON.parse(localStorage.getItem(POSITION_STORAGE_KEY) || '{}');
  if (savedPosition.left && savedPosition.top) {
    // Verify the saved position is within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Parse the saved positions (removing 'px')
    const parsedLeft = parseInt(savedPosition.left);
    const parsedTop = parseInt(savedPosition.top);
    
    // Get actual widget height
    const rect = container.getBoundingClientRect();
    const widgetWidth = getWidgetWidth();
    const widgetHeight = rect.height || widgetWidth * 4; // Use actual height or estimate based on width
    
    // Check if position is valid and FULLY within viewport
    if (!isNaN(parsedLeft) && !isNaN(parsedTop) && 
        parsedLeft >= 0 && parsedLeft <= (viewportWidth - widgetWidth) && 
        parsedTop >= 0 && parsedTop <= (viewportHeight - widgetHeight)) {
      container.style.left = savedPosition.left;
      container.style.top = savedPosition.top;
      container.style.right = 'auto';
      container.style.bottom = 'auto';
    } else {
      // Position was outside viewport, reset to default
      resetWidgetPosition();
    }
  }
  
  // Mouse down event - start dragging
  container.addEventListener('mousedown', (e) => {
    // Only initiate drag on container but not on interactive elements
    if (e.target.closest('button, select, input')) return;
    
    isDragging = true;
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;
    container.style.transition = 'none'; // Disable transitions during drag
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  });
  
  // Mouse move event - update position during drag
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get current widget dimensions using getBoundingClientRect for accuracy
    const rect = container.getBoundingClientRect();
    const widgetWidth = rect.width || getWidgetWidth();
    const widgetHeight = rect.height;
    
    // Calculate new position
    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;
    
    // STRICT boundary enforcement - ensure widget stays FULLY in viewport
    // Left and Top boundaries: 0 (cannot go negative)
    // Right boundary: viewportWidth - widgetWidth
    // Bottom boundary: viewportHeight - widgetHeight
    
    // Apply strict constraints that keep the ENTIRE widget visible
    left = Math.max(0, Math.min(left, viewportWidth - widgetWidth));
    top = Math.max(0, Math.min(top, viewportHeight - widgetHeight));
    
    // Apply new position
    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
    container.style.right = 'auto';
    container.style.bottom = 'auto';
  });
  
  // Mouse up event - end dragging and save position
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    
    isDragging = false;
    container.style.transition = ''; // Restore transitions
    document.body.style.userSelect = '';
    
    // Ensure widget is still properly within viewport before saving position
    ensureWidgetInViewport(container);
    
    // Save position to localStorage
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({
      left: container.style.left,
      top: container.style.top
    }));
  });

  // Add mouse enter/leave effects
  container.addEventListener('mouseenter', () => {
    const outerContainer = document.getElementById('kokoro-tts-widget-outer');
    if (outerContainer) outerContainer.classList.add('hover');
  });
  
  container.addEventListener('mouseleave', () => {
    const outerContainer = document.getElementById('kokoro-tts-widget-outer');
    if (outerContainer) outerContainer.classList.remove('hover');
  });
  
  // Add window resize handler to ensure widget stays in view
  window.addEventListener('resize', () => {
    ensureWidgetInViewport(container);
  });
}

/**
 * Ensure widget stays within viewport boundaries
 * @param {HTMLElement} container - The widget container element
 */
function ensureWidgetInViewport(container) {
  if (!container) return;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get actual widget dimensions
  const rect = container.getBoundingClientRect();
  const widgetWidth = rect.width || getWidgetWidth();
  const widgetHeight = rect.height || widgetWidth * 4; // Estimate height based on width
  
  // Parse current position
  let left = parseInt(container.style.left);
  let top = parseInt(container.style.top);
  
  // If position is NaN (e.g., if using 'auto'), get from bounding rect
  if (isNaN(left) || isNaN(top)) {
    left = rect.left;
    top = rect.top;
  }
  
  // Check boundaries and adjust if needed
  let needsAdjustment = false;
  
  // Ensure widget stays FULLY within viewport
  if (left < 0) {
    left = 0;
    needsAdjustment = true;
  }
  
  if (left > viewportWidth - widgetWidth) {
    left = viewportWidth - widgetWidth;
    needsAdjustment = true;
  }
  
  if (top < 0) {
    top = 0;
    needsAdjustment = true;
  }
  
  if (top > viewportHeight - widgetHeight) {
    top = viewportHeight - widgetHeight;
    needsAdjustment = true;
  }
  
  // Apply adjustments if needed
  if (needsAdjustment) {
    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
    
    // Update saved position
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({
      left: `${left}px`,
      top: `${top}px`
    }));
  }
}

/**
 * Reset widget position to default (bottom right)
 */
export function resetWidgetPosition() {
  const container = document.getElementById('kokoro-tts-widget-container');
  if (!container) return;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get actual widget dimensions
  const rect = container.getBoundingClientRect();
  let widgetWidth = rect.width;
  let widgetHeight = rect.height;
  
  // If dimensions are 0 (e.g., if widget is not visible), use CSS variable
  if (!widgetWidth || !widgetHeight) {
    widgetWidth = getWidgetWidth();
    widgetHeight = widgetWidth * 4; // Estimate height as 4x the width for vertical layout
  }
  
  // Position in bottom right, but still fully within viewport
  // Use a smaller margin (10px) to allow closer positioning to the edges
  container.style.left = `${viewportWidth - widgetWidth - 10}px`;
  container.style.top = `${viewportHeight - widgetHeight - 10}px`;
  container.style.right = 'auto';
  container.style.bottom = 'auto';
  
  // Clear saved position
  localStorage.removeItem(POSITION_STORAGE_KEY);
} 