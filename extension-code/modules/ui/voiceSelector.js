/**
 * Voice Selector UI Component
 * 
 * This module is responsible for creating and managing the voice selection UI
 * that appears when clicking the voice avatar button.
 * 
 * It will:
 * 1. Create a dropdown panel with tabs for each provider
 * 2. List voices with avatars and names
 * 3. Handle selection of voices
 * 4. Show quota and status information
 * 5. Handle UI for disabled premium voices when quota is exceeded
 */

import { providerManager } from '../providers/index.js';
import { PROVIDER_TYPES } from '../providers/types.js';

// Will be populated with DOM elements
let selectorPanel = null;
let isVisible = false;
let voiceAvatarElement = null;

/**
 * Create the voice selector panel and attach it to the provided element
 * @param {HTMLElement} parentElement - Element to attach the selector to
 * @returns {HTMLElement} The created selector panel
 */
export function createVoiceSelectorPanel(parentElement) {
  console.log('[VoiceSelector] Creating voice selector panel');
  
  const panel = document.createElement('div');
  panel.className = 'kokoro-voice-selector';
  panel.style.display = 'none';
  
  // New structure: Header, Tabs, Tab Content Panes
  panel.innerHTML = `
    <div class="kokoro-selector-header">
      <div class="kokoro-selector-title">Select Voice</div>
      <button class="kokoro-selector-close" aria-label="Close voice selector">
        <span class="kokoro-icon kokoro-close-icon"></span>
      </button>
    </div>
    
    <div class="kokoro-tabs-navigation">
      <button class="kokoro-tab-button active" data-tab-target="featured">Featured</button>
      <button class="kokoro-tab-button" data-tab-target="recent">Recent</button>
      <button class="kokoro-tab-button" data-tab-target="all-voices">All Voices</button>
    </div>

    <div id="kokoro-country-selector-container">
      <button id="kokoro-country-selector-button">All Countries</button>
      <div id="kokoro-country-dropdown-list" class="hidden">
        <!-- Country items will be populated here -->
      </div>
    </div>
    
    <div class="kokoro-tab-content">
      <div class="kokoro-tab-pane active" id="kokoro-featured-pane">
        <!-- Featured voices will be populated here -->
        <div class="kokoro-voice-loading">Loading featured voices...</div>
      </div>
      <div class="kokoro-tab-pane" id="kokoro-recent-pane">
        <!-- Recent voices will be populated here -->
        <div class="kokoro-voice-loading">Loading recent voices...</div>
      </div>
      <div class="kokoro-tab-pane" id="kokoro-all-voices-pane">
        <div id="kokoro-all-voices-list-container">
            <!-- All voices (grouped by country) will be populated here -->
            <div class="kokoro-voice-loading">Loading all voices...</div>
        </div>
      </div>
    </div>
    
    <div class="kokoro-quota-status">
      <!-- Quota information will be added here -->
    </div>
  `;
  
  // Add close button handler
  const closeButton = panel.querySelector('.kokoro-selector-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      toggleVoiceSelector(false);
    });
  }
  
  // Prevent clicks inside the panel from bubbling up TO the document listener (for "outside" check)
  // AND attempt to stop capture-phase listeners on ancestors from misinterpreting internal clicks.
  // Running this in CAPTURE phase (true) attempts to stop the event early.
  panel.addEventListener('click', (event) => {
    // console.log('[VoiceSelector PanelClick CAPTURE] Click inside panel. Stopping propagation. Target:', event.target);
    event.stopPropagation();
  }, false);
  
  // Add click outside handler to close panel
  document.addEventListener('click', (event) => {
    // console.log('[VoiceSelector DocClick] Document click listener fired. Target:', event.target, 'isVisible:', isVisible);
    if (isVisible && selectorPanel && voiceAvatarElement) {
      const countryDropdown = selectorPanel.querySelector('#kokoro-country-dropdown-list');

      // If the click reached this document listener, it means it was NOT inside selectorPanel
      // (because clicks inside selectorPanel have their propagation stopped by the listener above).
      //
      // Now, we only need to check if the click was on the voiceAvatarElement itself.
      // - If it WAS on voiceAvatarElement, its own click handler is responsible for toggling the panel.
      // - If it was NOT on voiceAvatarElement (and thus also not in selectorPanel), then close the panel.
      if (!voiceAvatarElement.contains(event.target)) {
        // console.log('[VoiceSelector ClickOutside] Closing panel. Target:', event.target);
        toggleVoiceSelector(false); // This will also hide the panel
         // Also ensure country dropdown is hidden if it was open
        if (countryDropdown && !countryDropdown.classList.contains('hidden')) {
            countryDropdown.classList.add('hidden');
        }
      } else {
        // console.log('[VoiceSelector ClickOutside] Click was on avatar, its handler will toggle. Target:', event.target);
        // If the click was on the avatar, we still want to ensure the country dropdown closes if it was open
        // and the click wasn't on the country button itself (which handles its own dropdown toggle).
        const countryButton = selectorPanel.querySelector('#kokoro-country-selector-button');
        if (countryDropdown && !countryDropdown.classList.contains('hidden') && !countryButton.contains(event.target)) {
             countryDropdown.classList.add('hidden');
        }
      }
    }
  });
  
  // Attach to parent element
  parentElement.appendChild(panel);
  selectorPanel = panel;
  
  // Init voice avatar reference
  voiceAvatarElement = document.getElementById('kokoro-voice-button');
  
  // Initialize tab navigation
  initializeTabNavigation(panel);

  // Initialize Country Selector Interactions
  initializeCountrySelectorInteraction(panel);
  
  return panel;
}

/**
 * Initialize tab navigation logic
 * @param {HTMLElement} panelElement - The main voice selector panel
 */
function initializeTabNavigation(panelElement) {
  const tabButtons = panelElement.querySelectorAll('.kokoro-tab-button');
  const tabPanes = panelElement.querySelectorAll('.kokoro-tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetPaneId = button.dataset.tabTarget;
      // console.log(`[VoiceSelector Tabs] Clicked tab: ${targetPaneId}`);

      // Deactivate all tabs and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // Activate clicked tab and corresponding pane
      button.classList.add('active');
      const targetPane = panelElement.querySelector(`#kokoro-${targetPaneId}-pane`);
      if (targetPane) {
        targetPane.classList.add('active');
        // console.log(`[VoiceSelector Tabs] Activated pane: #kokoro-${targetPaneId}-pane`);
      } else {
        // console.warn(`[VoiceSelector Tabs] Target pane #kokoro-${targetPaneId}-pane not found`);
      }

      // Update UI based on the new active tab
      // TODO: This will need to be more sophisticated to load specific content for each tab.
      // For now, it will clear all panes and re-render based on its current logic (which focuses on all voices).
      updateVoiceSelectorUI(); 
    });
  });
}

/**
 * Initialize country selector dropdown interaction logic
 * @param {HTMLElement} panelElement - The main voice selector panel
 */
function initializeCountrySelectorInteraction(panelElement) {
  const countryButton = panelElement.querySelector('#kokoro-country-selector-button');
  const countryDropdown = panelElement.querySelector('#kokoro-country-dropdown-list');

  if (!countryButton || !countryDropdown) {
    console.warn('[VoiceSelector] Country selector button or dropdown not found.');
    return;
  }

  countryButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent this click from immediately closing via document listener
    countryDropdown.classList.toggle('hidden');
    // console.log('[VoiceSelector] Toggled country dropdown visibility.');
  });

  countryDropdown.addEventListener('click', (event) => {
    const targetItem = event.target.closest('.kokoro-country-dropdown-item');
    if (targetItem) {
      event.stopPropagation(); // Prevent this click from immediately closing via document listener (if for some reason it wasn't hidden yet)
      const selectedCountryName = targetItem.dataset.countryName;
      countryButton.textContent = selectedCountryName || 'All Countries';
      countryDropdown.classList.add('hidden');
      console.log(`[VoiceSelector] Selected country: ${selectedCountryName || 'All Countries'}`);
      
      // --- Implement T_UI_15: Scroll-to Logic ---
      const allVoicesListContainer = panelElement.querySelector('#kokoro-all-voices-list-container');
      if (allVoicesListContainer) {
        if (selectedCountryName === '' || !selectedCountryName) { // 'All Countries' selected or empty
          allVoicesListContainer.scrollTop = 0;
          // console.log('[VoiceSelector] Scrolled to top of all voices list.');
        } else {
          const targetCountryHeader = allVoicesListContainer.querySelector(`[data-country-scroll-target="${selectedCountryName}"]`);
          if (targetCountryHeader) {
            targetCountryHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // console.log(`[VoiceSelector] Scrolled to country: ${selectedCountryName}`);
          } else {
            // console.warn(`[VoiceSelector] Country header for ${selectedCountryName} not found for scrolling.`);
          }
        }
      }
      // ------------------------------------------
    }
  });

  // Clicking anywhere else on the panel (but outside the dropdown itself IF IT'S OPEN) 
  // should close an open country dropdown.
  panelElement.addEventListener('click', (event) => {
    if (!countryDropdown.classList.contains('hidden')) { // Only act if dropdown is visible
      const isClickOnButton = countryButton.contains(event.target);
      const isClickInDropdown = countryDropdown.contains(event.target);

      if (!isClickOnButton && !isClickInDropdown) {
        countryDropdown.classList.add('hidden');
        // console.log('[VoiceSelector PanelBgClick] Closed country dropdown due to click on panel background.');
      }
    }
  });
}

/**
 * Toggle the visibility of the voice selector panel
 * @param {boolean} [show] - Force specific state (optional)
 * @returns {boolean} New visibility state
 */
export function toggleVoiceSelector(show) {
  console.log('[VoiceSelector] Toggling voice selector panel');
  
  if (!selectorPanel) {
    console.warn('[VoiceSelector] No selector panel found');
    return false;
  }
  
  // If show parameter is provided, use it, otherwise toggle
  isVisible = (typeof show === 'boolean') ? show : !isVisible;
  
  selectorPanel.style.display = isVisible ? 'block' : 'none';
  
  // If showing, update the UI with current data
  if (isVisible) {
    updateVoiceSelectorUI();
  }
  
  return isVisible;
}

/**
 * Update the voice selector UI with current voice information, grouped by country
 */
export async function updateVoiceSelectorUI() {
  console.log('[VoiceSelector] Updating voice selector UI (tab-aware)');
  
  if (!selectorPanel) return;

  const featuredPane = selectorPanel.querySelector('#kokoro-featured-pane');
  const recentPane = selectorPanel.querySelector('#kokoro-recent-pane');
  const allVoicesPane = selectorPanel.querySelector('#kokoro-all-voices-pane');
  const allVoicesListContainer = allVoicesPane ? allVoicesPane.querySelector('#kokoro-all-voices-list-container') : null;

  // Determine active tab
  const activeTabButton = selectorPanel.querySelector('.kokoro-tab-button.active');
  const activeTabTarget = activeTabButton ? activeTabButton.dataset.tabTarget : 'all-voices'; // Default to all-voices if somehow none active

  console.log(`[VoiceSelector] Active tab target: ${activeTabTarget}`);

  // Clear all panes before rendering the active one to prevent stale content
  if(featuredPane) featuredPane.innerHTML = '<div class="kokoro-voice-loading">Loading featured voices...</div>';
  if(recentPane) recentPane.innerHTML = '<div class="kokoro-voice-loading">Loading recent voices...</div>'; // Placeholder for now
  if(allVoicesListContainer) allVoicesListContainer.innerHTML = '<div class="kokoro-voice-loading">Loading all voices...</div>';
  
  try {
    const allVoices = providerManager.getAllVoices();
    console.log('[VoiceSelector] providerManager.getAllVoices() returned:', allVoices);

    if (!allVoices || allVoices.length === 0) {
      const emptyMessage = '<div class="kokoro-voice-empty">No voices available. Please check your voice configuration.</div>';
      if(featuredPane) featuredPane.innerHTML = emptyMessage;
      if(recentPane) recentPane.innerHTML = emptyMessage; // Or "No recent voices"
      if(allVoicesListContainer) allVoicesListContainer.innerHTML = emptyMessage;
      return;
    }
    const selectedVoice = await providerManager.getSelectedVoice();
    const selectedVoiceKey = selectedVoice ? `${selectedVoice.provider}:${selectedVoice.id}` : null;
    console.log('[VoiceSelector] Selected voice:', selectedVoice, 'Selected key:', selectedVoiceKey);

    if (activeTabTarget === 'featured' && featuredPane) {
      renderFeaturedVoiceList(featuredPane, allVoices, selectedVoiceKey);
    } else if (activeTabTarget === 'all-voices' && allVoicesListContainer) {
      // Group voices by country for 'All Voices' tab
      const voicesByCountry = {};
      for (const voice of allVoices) {
        const country = voice.country || 'Other';
        if (!voicesByCountry[country]) voicesByCountry[country] = [];
        voicesByCountry[country].push(voice);
      }
      console.log('[VoiceSelector] voicesByCountry (for all-voices tab):', voicesByCountry);
      renderGroupedVoiceList(allVoicesListContainer, voicesByCountry, selectedVoiceKey);
      populateCountrySelector(voicesByCountry);
    } else if (activeTabTarget === 'recent' && recentPane) {
      // Placeholder for recent voices - T_UI_17
      recentPane.innerHTML = '<div class="kokoro-voice-empty">Recent voices will appear here.</div>';
    }
    
    updateQuotaStatus();
  } catch (error) {
    console.error('[VoiceSelector] Error updating UI:', error);
    const errorMessage = '<div class="kokoro-voice-error">Error loading voices. Please check your configuration.</div>';
    // Display error in the currently active pane or all panes as a fallback
    if (activeTabTarget === 'featured' && featuredPane) featuredPane.innerHTML = errorMessage;
    else if (activeTabTarget === 'all-voices' && allVoicesListContainer) allVoicesListContainer.innerHTML = errorMessage;
    else if (activeTabTarget === 'recent' && recentPane) recentPane.innerHTML = errorMessage;
    else { // Fallback if no specific pane or unknown
        if(featuredPane) featuredPane.innerHTML = errorMessage;
        if(allVoicesListContainer) allVoicesListContainer.innerHTML = errorMessage;
        if(recentPane) recentPane.innerHTML = errorMessage;
    }
  }
}

/**
 * Populate the country selector dropdown list
 * @param {Object} voicesByCountry - Map of country to array of voices
 */
function populateCountrySelector(voicesByCountry) {
  const dropdownList = selectorPanel.querySelector('#kokoro-country-dropdown-list');
  if (!dropdownList) {
    console.warn('[VoiceSelector] Country dropdown list element not found.');
    return;
  }

  dropdownList.innerHTML = ''; // Clear existing items

  // Add "All Countries" option
  const allCountriesItem = document.createElement('div');
  allCountriesItem.className = 'kokoro-country-dropdown-item';
  allCountriesItem.textContent = 'All Countries';
  allCountriesItem.dataset.countryName = ''; // Use empty string to signify all countries
  dropdownList.appendChild(allCountriesItem);

  const countryNames = Object.keys(voicesByCountry).sort();

  if (countryNames.length > 0) {
    countryNames.forEach(countryName => {
      const countryItem = document.createElement('div');
      countryItem.className = 'kokoro-country-dropdown-item';
      countryItem.textContent = countryName;
      countryItem.dataset.countryName = countryName;
      dropdownList.appendChild(countryItem);
    });
  }
  // console.log('[VoiceSelector] Populated country selector dropdown.', dropdownList);
}

/**
 * Render the list of featured voices into a specific pane
 * @param {HTMLElement} targetPane - The tab pane to render into
 * @param {Array<Object>} allVoices - Array of all voice objects
 * @param {string} selectedVoiceKey - Currently selected voice composite key
 */
function renderFeaturedVoiceList(targetPane, allVoices, selectedVoiceKey) {
  if (!targetPane) return;
  targetPane.innerHTML = ''; // Clear loading message

  const featuredVoices = allVoices.filter(voice => voice.isFeatured === true);
  console.log('[VoiceSelector] Filtered featured voices:', featuredVoices);

  if (featuredVoices.length === 0) {
    targetPane.innerHTML = '<div class="kokoro-voice-empty">No featured voices available at the moment.</div>';
    return;
  }

  for (const voice of featuredVoices) {
    const voiceItem = createVoiceItem(voice, selectedVoiceKey);
    targetPane.appendChild(voiceItem);
  }
}

/**
 * Render the voice list grouped by country into a specific pane
 * @param {HTMLElement} targetPane - The tab pane to render into
 * @param {Object} voicesByCountry - Map of country to array of voices
 * @param {string} selectedVoiceKey - Currently selected voice composite key
 */
function renderGroupedVoiceList(targetPane, voicesByCountry, selectedVoiceKey) {
  if (!targetPane) return;
  targetPane.innerHTML = ''; // Clear loading message or previous list

  const countryNames = Object.keys(voicesByCountry).sort();
  if (countryNames.length === 0) {
    targetPane.innerHTML = '<div class="kokoro-voice-empty">No voices available</div>';
    return;
  }

  for (const country of countryNames) {
    const groupSection = document.createElement('div');
    groupSection.className = 'kokoro-voice-section';
    
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'kokoro-voice-section-title';
    sectionTitle.textContent = country;
    sectionTitle.dataset.countryScrollTarget = country; // Add data attribute for scrolling
    groupSection.appendChild(sectionTitle);

    // groupSection.innerHTML = `<div class="kokoro-voice-section-title" data-country-scroll-target="${country}">${country}</div>`; // Old way
    targetPane.appendChild(groupSection);
    for (const voice of voicesByCountry[country]) {
      const voiceItem = createVoiceItem(voice, selectedVoiceKey);
      groupSection.appendChild(voiceItem);
    }
  }
}

/**
 * Create a voice item element
 * @param {Object} voice - Voice object
 * @param {string} selectedVoiceKey - Currently selected voice composite key
 * @returns {HTMLElement} Voice item element
 */
function createVoiceItem(voice, selectedVoiceKey) {
  const voiceItem = document.createElement('div');
  voiceItem.className = 'kokoro-voice-item';
  const compositeKey = `${voice.provider}:${voice.id}`;
  voiceItem.dataset.voiceKey = compositeKey;
  
  if (compositeKey === selectedVoiceKey) {
    voiceItem.classList.add('kokoro-voice-item-selected');
  }

  // Basic structure for a voice item - can be expanded with icons, etc.
  voiceItem.innerHTML = `
    <div class="kokoro-voice-item-avatar"></div> <!-- Placeholder for avatar/icon -->
    <div class="kokoro-voice-item-details">
      <div class="kokoro-voice-item-name">${voice.name || 'Unknown Name'}</div>
      <div class="kokoro-voice-item-meta">${voice.language || 'N/A'} - ${voice.gender || 'N/A'}</div>
    </div>
    ${voice.isPremium ? '<div class="kokoro-voice-item-premium">Premium</div>' : ''}
    ${compositeKey === selectedVoiceKey ? '<div class="kokoro-voice-item-checkmark">&#10003;</div>' : ''}
  `;

  voiceItem.addEventListener('click', async () => {
    await selectVoice(compositeKey);
  });
  
  return voiceItem;
}

/**
 * Update the quota status display
 */
async function updateQuotaStatus() {
  const quotaContainer = selectorPanel.querySelector('.kokoro-quota-status');
  if (!quotaContainer) return;
  
  try {
    // Check if there are any premium providers
    const hasPremiumProviders = Object.values(providerManager.getAllProviders())
      .some(provider => provider.supportsPremiumVoices);
    
    if (!hasPremiumProviders) {
      quotaContainer.style.display = 'none';
      return;
    }
    
    // Get shared quota information
    const quotaLimit = providerManager.sharedQuota.premiumLimit;
    const usedToday = providerManager.sharedQuota.usedToday;
    const percentUsed = Math.min(100, Math.round((usedToday / quotaLimit) * 100));
    
    quotaContainer.innerHTML = `
      <div class="kokoro-quota-label">Premium Usage: ${percentUsed}%</div>
      <div class="kokoro-quota-bar">
        <div class="kokoro-quota-progress" style="width: ${percentUsed}%"></div>
      </div>
      <div class="kokoro-quota-text">
        ${usedToday.toLocaleString()} / ${quotaLimit.toLocaleString()} characters
      </div>
    `;
    
    quotaContainer.style.display = 'block';
  } catch (error) {
    console.error('[VoiceSelector] Error updating quota status:', error);
    quotaContainer.style.display = 'none';
  }
}

/**
 * Select a voice and update the UI
 * @param {string} voiceKey - Composite key (provider:id) to select
 */
async function selectVoice(voiceKey) {
  console.log(`[VoiceSelector] Selecting voice: ${voiceKey}`);
  if (!voiceKey) return;
  try {
    await providerManager.setSelectedVoice(voiceKey);
    // Re-render the UI to show new selection (or more targeted update)
    updateVoiceSelectorUI(); 
    // Update main widget avatar too
    const avatarElement = document.getElementById('kokoro-voice-button');
    if (avatarElement) updateVoiceAvatar(avatarElement);
  } catch (error) {
    console.error('[VoiceSelector] Error selecting voice:', error);
  }
}

/**
 * Set the voice avatar image based on the currently selected voice
 * @param {HTMLElement} avatarElement - The avatar element to update
 */
export async function updateVoiceAvatar(avatarElement) {
  console.log('[VoiceSelector] Updating voice avatar');
  
  if (!avatarElement) return;
  
  try {
    const selectedVoice = await providerManager.getSelectedVoice();
    
    if (selectedVoice && selectedVoice.avatarUrl) {
      // Set the avatar image URL if available
      avatarElement.style.backgroundImage = `url('${selectedVoice.avatarUrl}')`;
    } else {
      // Use a default avatar
      avatarElement.style.backgroundImage = 'url("assets/icon48.png")';
    }
  } catch (error) {
    console.error('[VoiceSelector] Error updating avatar:', error);
    // Use default on error
    avatarElement.style.backgroundImage = 'url("assets/icon48.png")';
  }
} 