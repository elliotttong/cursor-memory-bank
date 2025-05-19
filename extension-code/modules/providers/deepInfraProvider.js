import { createBaseProvider, PROVIDER_TYPES } from './types.js';

// Constants from background.js
const KOKORO_API_ENDPOINT = "https://api.deepinfra.com/v1/inference/hexgrad/Kokoro-82M";

/**
 * Deep Infra TTS Provider
 * This wraps the existing implementation to avoid breaking changes
 */
const deepInfraProvider = {
  ...createBaseProvider({
    id: PROVIDER_TYPES.DEEP_INFRA,
    name: 'Deep Infra TTS'
  }),
  
  // Override default properties
  supportsWordTimestamps: true,
  supportsSpeedControl: true,
  supportsPremiumVoices: true,
  
  // Predefined voices
  voices: [
    {
      id: 'af_bella',
      name: 'Bella',
      provider: PROVIDER_TYPES.DEEP_INFRA,
      language: 'en-US',
      gender: 'female',
      isPremium: true,
      avatarUrl: 'assets/voices/bella.png' // Will need to add these assets
    },
    {
      id: 'am_novak',
      name: 'Novak',
      provider: PROVIDER_TYPES.DEEP_INFRA,
      language: 'en-US',
      gender: 'male',
      isPremium: true,
      avatarUrl: 'assets/voices/novak.png'
    }
    // Add more voices as needed
  ],
  
  /**
   * Get voices for this provider
   * @returns {Promise<Array<Voice>>}
   */
  async getVoices() {
    return this.voices;
  },
  
  /**
   * Synthesize speech using Deep Infra API
   * This is a wrapper around the existing implementation for now
   * @param {string} text - Text to synthesize
   * @param {string} voiceId - Voice ID to use
   * @param {Object} options - Options for synthesis (speed, etc.)
   * @returns {Promise<AudioData>}
   */
  async synthesizeSpeech(text, voiceId, options = {}) {
    try {
      // Get the API token
      const data = await chrome.storage.local.get(['deepInfraToken']);
      if (!data.deepInfraToken) {
        throw new Error('Deep Infra API Token not configured.');
      }
      
      // For now, just call the existing function from background.js
      // Later we'll move the implementation entirely into this class
      const result = await this.callDeepInfraTTS(text, data.deepInfraToken, voiceId, options);
      
      // Check if audio is a data URL and extract the base64 part if needed
      let audioBase64 = result.audio;
      let contentType = 'audio/wav'; // Default
      
      if (typeof audioBase64 === 'string' && audioBase64.startsWith('data:')) {
        const parts = audioBase64.split(',');
        const meta = parts[0].split(':')[1]?.split(';')[0]; // e.g., audio/wav
        if (meta) contentType = meta;
        audioBase64 = parts[1]; // Get only the base64 part
      }
      
      // Convert the result to our standard AudioData format
      return {
        audioBase64: audioBase64,
        contentType: contentType,
        wordTimestamps: result.words
      };
    } catch (error) {
      console.error('Deep Infra synthesis error:', error);
      throw error;
    }
  },
  
  /**
   * Call Deep Infra API (copied from background.js)
   * This will later be refactored into synthesizeSpeech directly
   * @param {string} text - Text to synthesize
   * @param {string} apiToken - API token
   * @param {string} selectedVoice - Voice ID
   * @param {Object} options - Options for synthesis
   * @returns {Promise<Object>} Raw API response
   */
  async callDeepInfraTTS(text, apiToken, selectedVoice = 'af_bella', options = {}) {
    const outputFormat = "wav";
    const speed = options.speed || 1;
    
    const payload = {
      text: text,
      preset_voice: [selectedVoice],
      output_format: outputFormat,
      return_timestamps: true,
      speed: speed
    };
  
    console.log(`[DeepInfraProvider] Calling API (${KOKORO_API_ENDPOINT})...`, payload);
    const response = await fetch(KOKORO_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  
    const result = await response.json();
    console.log("[DeepInfraProvider] Raw Response:", result);
  
    if (!response.ok) {
      console.error("[DeepInfraProvider] HTTP Error Status:", response.status, result);
      const errorMessage = result?.message || result?.detail || JSON.stringify(result) || 'Unknown HTTP error';
      throw new Error(`API request failed: ${errorMessage}`);
    }
  
    // Basic check on expected output fields
    if (!result || typeof result.audio !== 'string' || !Array.isArray(result.words)) {
      console.error("[DeepInfraProvider] Invalid response structure:", result);
      throw new Error("API response structure invalid or missing audio/words.");
    }
  
    return result;
  }
};

export default deepInfraProvider; 