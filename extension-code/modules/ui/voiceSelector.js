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
  
  // Create the main panel container
  const panel = document.createElement('div');
  panel.className = 'kokoro-voice-selector';
  panel.style.display = 'none';
  
  // Create the panel structure with the same styling variables as the widget
  panel.innerHTML = `
    <div class="kokoro-selector-header">
      <div class="kokoro-selector-title">Select Voice</div>
      <button class="kokoro-selector-close" aria-label="Close voice selector">
        <span class="kokoro-icon kokoro-close-icon"></span>
      </button>
    </div>
    
    <div class="kokoro-provider-tabs">
      <!-- Provider tabs will be populated dynamically -->
    </div>
    
    <div class="kokoro-voice-list">
      <!-- Voice options will be populated dynamically -->
      <div class="kokoro-voice-loading">Loading voices...</div>
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
  
  // Add click outside handler to close panel
  document.addEventListener('click', (event) => {
    if (isVisible && panel && !panel.contains(event.target) && 
        voiceAvatarElement && !voiceAvatarElement.contains(event.target)) {
      toggleVoiceSelector(false);
    }
  });
  
  // Attach to parent element
  parentElement.appendChild(panel);
  selectorPanel = panel;
  
  // Init voice avatar reference
  voiceAvatarElement = document.getElementById('kokoro-voice-button');
  
  return panel;
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
  console.log('[VoiceSelector] Updating voice selector UI');
  
  if (!selectorPanel) return;
  
  try {
    // Get all voices from ProviderManager (flat array)
    const allVoices = providerManager.getAllVoices();
    console.log('[VoiceSelector] providerManager.getAllVoices() returned:', allVoices);
    if (!allVoices || allVoices.length === 0) {
      const voiceList = selectorPanel.querySelector('.kokoro-voice-list');
      if (voiceList) voiceList.innerHTML = '<div class="kokoro-voice-empty">No voices available. Please check your voice configuration.</div>';
      return;
    }
    const selectedVoice = await providerManager.getSelectedVoice();
    const selectedVoiceKey = selectedVoice ? `${selectedVoice.provider}:${selectedVoice.id}` : null;
    console.log('[VoiceSelector] Selected voice:', selectedVoice, 'Selected key:', selectedVoiceKey);

    // Group voices by country
    const voicesByCountry = {};
    for (const voice of allVoices) {
      const country = voice.country || 'Other';
      if (!voicesByCountry[country]) voicesByCountry[country] = [];
      voicesByCountry[country].push(voice);
    }
    console.log('[VoiceSelector] voicesByCountry:', voicesByCountry);

    // Render grouped voice list
    renderGroupedVoiceList(voicesByCountry, selectedVoiceKey);
    // Hide provider tabs (no longer needed)
    const tabsContainer = selectorPanel.querySelector('.kokoro-provider-tabs');
    if (tabsContainer) tabsContainer.style.display = 'none';
    // Update quota status as before
    updateQuotaStatus();
  } catch (error) {
    console.error('[VoiceSelector] Error updating UI:', error);
    // Show error in voice list
    const voiceList = selectorPanel.querySelector('.kokoro-voice-list');
    if (voiceList) {
      voiceList.innerHTML = '<div class="kokoro-voice-error">Error loading voices. Please check your configuration.</div>';
    }
  }
}

/**
 * Render the voice list grouped by country
 * @param {Object} voicesByCountry - Map of country to array of voices
 * @param {string} selectedVoiceKey - Currently selected voice composite key
 */
function renderGroupedVoiceList(voicesByCountry, selectedVoiceKey) {
  const voiceListContainer = selectorPanel.querySelector('.kokoro-voice-list');
  if (!voiceListContainer) return;
  voiceListContainer.innerHTML = '';

  const countryNames = Object.keys(voicesByCountry).sort();
  if (countryNames.length === 0) {
    voiceListContainer.innerHTML = '<div class="kokoro-voice-empty">No voices available</div>';
    return;
  }

  for (const country of countryNames) {
    const groupSection = document.createElement('div');
    groupSection.className = 'kokoro-voice-section';
    groupSection.innerHTML = `<div class="kokoro-voice-section-title">${country}</div>`;
    voiceListContainer.appendChild(groupSection);
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
  
  // Get the avatar URL or use default
  const avatarUrl = voice.avatarUrl || 'assets/icon48.png';
  
  voiceItem.innerHTML = `
    <div class="kokoro-voice-avatar" style="background-image: url('${avatarUrl}')"></div>
    <div class="kokoro-voice-details">
      <div class="kokoro-voice-name">${voice.name}</div>
      <div class="kokoro-voice-lang">${voice.language}</div>
    </div>
    <div class="kokoro-voice-gender">${voice.gender}</div>
    ${voice.isPremium ? '<div class="kokoro-voice-premium-badge">Premium</div>' : ''}
  `;
  
  // Add click handler to select voice
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
  
  try {
    // Set the selected voice in provider manager
    await providerManager.setSelectedVoice(voiceKey);
    
    // Update the voice selector UI
    await updateVoiceSelectorUI();
    
    // Update the voice avatar
    if (voiceAvatarElement) {
      updateVoiceAvatar(voiceAvatarElement);
    }
    
    // Hide the selector after selection
    toggleVoiceSelector(false);
    
    console.log(`[VoiceSelector] Voice selected: ${voiceKey}`);
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