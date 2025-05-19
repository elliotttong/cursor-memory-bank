import { PROVIDER_TYPES } from './types.js';

/**
 * Provider manager for TTS services (config-driven, robust)
 */
class ProviderManager {
  constructor() {
    this.providers = {};
    this.defaultProvider = null;
    this.fallbackProvider = null;
    this.selectedVoiceKey = null; // composite key
    this.initialized = false;
    this.sharedQuota = {
      premiumLimit: 100000, // Default character limit (will be updated)
      usedToday: 0,
      lastResetDate: null
    };
    this.allVoices = [];
    this.voicesByKey = {};
  }

  /**
   * Initialize the provider manager
   */
  async initialize() {
    if (this.initialized) return;
    await this.loadVoicesFromConfig();
    await this.loadSelectedVoice();
    this.initialized = true;
  }

  /**
   * Load voices from config and build composite key lookup map
   */
  async loadVoicesFromConfig() {
    const url = chrome.runtime.getURL('assets/voices/voiceConfig.json');
    console.log('[ProviderManager] Fetching voice config from:', url);
    const response = await fetch(url);
    const voiceConfig = await response.json();
    console.log('[ProviderManager] Raw voice config loaded:', voiceConfig);
    this.allVoices = [];
    this.voicesByKey = {};
    if (voiceConfig && Array.isArray(voiceConfig.voices)) {
      for (const voice of voiceConfig.voices) {
        this.allVoices.push(voice);
        const key = `${voice.provider}:${voice.id}`;
        this.voicesByKey[key] = voice;
      }
    }
    console.log('[ProviderManager] allVoices after config load:', this.allVoices);
    console.log('[ProviderManager] voicesByKey after config load:', this.voicesByKey);
  }

  /**
   * Get all voices (flat array from config)
   */
  getAllVoices() {
    console.log('[ProviderManager] getAllVoices() called. Returning:', this.allVoices);
    return this.allVoices;
  }

  /**
   * Get a voice by composite key (provider:id)
   */
  getVoiceByKey(compositeKey) {
    return this.voicesByKey[compositeKey];
  }

  /**
   * Get the currently selected voice (from config-driven map)
   */
  async getSelectedVoice() {
    if (!this.selectedVoiceKey) {
      // Fallback to first available voice
      return this.allVoices.length > 0 ? this.allVoices[0] : null;
    }
    return this.getVoiceByKey(this.selectedVoiceKey) || (this.allVoices.length > 0 ? this.allVoices[0] : null);
  }

  /**
   * Set the selected voice (composite key)
   */
  async setSelectedVoice(voiceKey) {
    this.selectedVoiceKey = voiceKey;
    await chrome.storage.local.set({ selectedVoiceKey: voiceKey });
  }

  /**
   * Load selected voice from storage (composite key)
   */
  async loadSelectedVoice() {
    const data = await chrome.storage.local.get(['selectedVoiceKey']);
    if (data.selectedVoiceKey && this.voicesByKey[data.selectedVoiceKey]) {
      this.selectedVoiceKey = data.selectedVoiceKey;
    } else {
      this.selectedVoiceKey = this.allVoices.length > 0 ? `${this.allVoices[0].provider}:${this.allVoices[0].id}` : null;
    }
  }

  /**
   * Register a TTS provider
   * @param {TTSProvider} provider 
   */
  registerProvider(provider) {
    this.providers[provider.id] = provider;
    
    // Set defaults if not already set
    if (!this.defaultProvider && provider.id === PROVIDER_TYPES.DEEP_INFRA) {
      this.defaultProvider = provider.id;
    }
    
    if (!this.fallbackProvider && provider.id === PROVIDER_TYPES.BROWSER_TTS) {
      this.fallbackProvider = provider.id;
    }
    
    console.log(`[ProviderManager] Registered provider: ${provider.id}`);
  }

  /**
   * Get a provider by ID
   * @param {string} providerId 
   * @returns {TTSProvider}
   */
  getProvider(providerId) {
    return this.providers[providerId] || null;
  }

  /**
   * Get all registered providers
   * @returns {Object} Map of provider IDs to providers
   */
  getAllProviders() {
    return this.providers;
  }

  /**
   * Get the currently active provider
   * @returns {TTSProvider}
   */
  getActiveProvider() {
    // If we have a selected voice, find its provider
    if (this.selectedVoiceKey) {
      for (const providerId in this.providers) {
        const provider = this.providers[providerId];
        const voices = provider.voices;
        if (voices.find(v => v.id === this.selectedVoiceKey)) {
          // Check if provider is available and has quota
          if (provider.isAvailable && !provider.quotaExceeded) {
            return provider;
          }
          break;
        }
      }
    }
    
    // Otherwise use default provider if available
    const defaultProvider = this.providers[this.defaultProvider];
    if (defaultProvider && defaultProvider.isAvailable && !defaultProvider.quotaExceeded) {
      return defaultProvider;
    }
    
    // Fall back to the fallback provider
    return this.providers[this.fallbackProvider];
  }

  /**
   * Synthesize speech using the appropriate provider
   * @param {string} text - Text to synthesize
   * @param {Object} options - Options for synthesis
   * @returns {Promise<AudioData>}
   */
  async synthesizeSpeech(text, options = {}) {
    const activeProvider = this.getActiveProvider();
    const selectedVoice = await this.getSelectedVoice();
    
    if (!activeProvider) {
      throw new Error('No active provider available');
    }
    
    if (!selectedVoice) {
      throw new Error('No voice selected or available');
    }
    
    const voiceKey = selectedVoice.id;
    
    // Check if this is a premium provider
    if (activeProvider.supportsPremiumVoices) {
      // Check shared quota first
      if (!this.checkSharedQuota(text.length)) {
        console.log('[ProviderManager] Premium quota exceeded, falling back to browser TTS');
        // Fall back to browser TTS
        const fallbackProvider = this.providers[this.fallbackProvider];
        if (!fallbackProvider) {
          throw new Error('Quota exceeded and no fallback provider available');
        }
        
        // Use the first available voice from the fallback provider
        const fallbackVoices = await fallbackProvider.getVoices();
        if (fallbackVoices.length === 0) {
          throw new Error('No fallback voices available');
        }
        
        return fallbackProvider.synthesizeSpeech(text, fallbackVoices[0].id, options);
      }
      
      // Track usage for all premium providers
      this.trackSharedUsage(text.length);
    }
    
    // Let the provider check its own quota too
    if (!activeProvider.checkQuota(text.length)) {
      console.log(`[ProviderManager] Provider ${activeProvider.id} quota exceeded`);
      throw new Error(`Provider ${activeProvider.id} quota exceeded`);
    }
    
    // Track provider-specific usage
    activeProvider.trackUsage(text.length);
    
    // Synthesize the speech
    return activeProvider.synthesizeSpeech(text, voiceKey, options);
  }

  /**
   * Check if the shared premium quota allows the request
   * @param {number} textLength 
   * @returns {boolean}
   */
  checkSharedQuota(textLength) {
    return (this.sharedQuota.usedToday + textLength) <= this.sharedQuota.premiumLimit;
  }

  /**
   * Track usage against the shared premium quota
   * @param {number} textLength 
   */
  trackSharedUsage(textLength) {
    this.sharedQuota.usedToday += textLength;
    this.saveQuotaData();
  }

  /**
   * Check if the quota should be reset (daily)
   */
  checkQuotaReset() {
    if (!this.sharedQuota.lastResetDate) {
      this.resetQuota();
      return;
    }
    
    const lastReset = new Date(this.sharedQuota.lastResetDate);
    const now = new Date();
    
    // Reset if it's a new day
    if (lastReset.getDate() !== now.getDate() || 
        lastReset.getMonth() !== now.getMonth() || 
        lastReset.getFullYear() !== now.getFullYear()) {
      this.resetQuota();
    }
  }

  /**
   * Reset the quota to zero
   */
  resetQuota() {
    this.sharedQuota.usedToday = 0;
    this.sharedQuota.lastResetDate = new Date().toISOString();
    this.saveQuotaData();
  }

  /**
   * Save quota data to storage
   */
  async saveQuotaData() {
    await chrome.storage.local.set({
      premiumQuota: this.sharedQuota
    });
  }

  /**
   * Load quota data from storage
   */
  async loadQuotaData() {
    const data = await chrome.storage.local.get(['premiumQuota']);
    if (data.premiumQuota) {
      this.sharedQuota = data.premiumQuota;
    }
  }
}

// Create and export singleton instance
const providerManager = new ProviderManager();
export default providerManager; 