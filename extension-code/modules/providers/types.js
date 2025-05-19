/**
 * @typedef {Object} Voice
 * @property {string} id - Unique voice ID
 * @property {string} name - Display name
 * @property {string} provider - Provider ID this voice belongs to
 * @property {string} language - Language code (e.g., "en-US")
 * @property {string} gender - "male", "female", or "neutral"
 * @property {boolean} isPremium - Whether this is a premium voice
 * @property {string} [avatarUrl] - Optional avatar image URL
 * @property {string} [sampleText] - Sample text for preview
 */

/**
 * @typedef {Object} AudioData
 * @property {string} audioBase64 - Base64-encoded audio data
 * @property {string} contentType - MIME type of the audio (e.g., "audio/wav")
 * @property {Array<Object>} wordTimestamps - Array of word timing objects
 * @property {number} [duration] - Optional audio duration in seconds
 */

/**
 * @typedef {Object} TTSProvider
 * @property {string} id - Unique provider ID
 * @property {string} name - Display name
 * @property {boolean} isAvailable - Whether provider is currently available
 * @property {Array<Voice>} voices - Voices offered by this provider
 * 
 * @property {Function} getVoices - Returns Promise<Array<Voice>>
 * @property {Function} synthesizeSpeech - Returns Promise<AudioData>
 * 
 * @property {boolean} supportsWordTimestamps - Whether provider supports word-level timestamps
 * @property {boolean} supportsSpeedControl - Whether provider supports speed control
 * @property {boolean} supportsPremiumVoices - Whether provider offers premium voices
 * 
 * @property {boolean} quotaExceeded - Whether quota is exceeded for this provider
 * @property {Function} checkQuota - Returns boolean indicating if quota allows the request
 * @property {Function} trackUsage - Updates usage tracking
 */

export const PROVIDER_TYPES = {
  DEEP_INFRA: 'deepinfra',
  BROWSER_TTS: 'browsertts'
};

/**
 * @function createBaseProvider
 * @description Creates a base provider object with default implementations
 * @param {Object} config - Configuration object
 * @returns {TTSProvider} A partial provider with default implementations
 */
export function createBaseProvider(config) {
  return {
    id: config.id,
    name: config.name,
    isAvailable: true,
    voices: [],
    supportsWordTimestamps: false,
    supportsSpeedControl: false,
    supportsPremiumVoices: false,
    quotaExceeded: false,
    
    // Default implementations
    getVoices: async function() {
      return this.voices;
    },
    
    checkQuota: function(textLength) {
      return !this.quotaExceeded;
    },
    
    trackUsage: function(textLength) {
      // Default no-op implementation
    },
    
    // This must be implemented by specific providers
    synthesizeSpeech: async function(text, voiceId, options) {
      throw new Error('synthesizeSpeech not implemented for this provider');
    }
  };
} 