import { createBaseProvider, PROVIDER_TYPES } from './types.js';

/**
 * Browser TTS Provider
 * Uses Chrome's built-in TTS capabilities
 */
const browserTTSProvider = {
  ...createBaseProvider({
    id: PROVIDER_TYPES.BROWSER_TTS,
    name: 'Browser TTS'
  }),
  
  // Override default properties
  supportsWordTimestamps: false, // We'll estimate these
  supportsSpeedControl: true,
  supportsPremiumVoices: false,
  
  // Will be populated on initialization
  voices: [],
  
  /**
   * Initialize the provider
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // Try to get available voices from Chrome
      if (chrome.tts && chrome.tts.getVoices) {
        const voiceList = await this.fetchVoices();
        
        // Convert to our standard format
        this.voices = voiceList.map(voice => ({
          id: voice.voiceName,
          name: voice.voiceName,
          provider: PROVIDER_TYPES.BROWSER_TTS,
          language: voice.lang || 'en-US',
          gender: this.inferGender(voice.voiceName),
          isPremium: false,
          browserVoice: voice // Keep reference to original voice object
        }));
        
        console.log(`[BrowserTTSProvider] Loaded ${this.voices.length} voices`);
      } else {
        console.warn('[BrowserTTSProvider] Chrome TTS API not available');
        this.isAvailable = false;
      }
    } catch (error) {
      console.error('[BrowserTTSProvider] Initialization error:', error);
      this.isAvailable = false;
    }
  },
  
  /**
   * Fetch voices from Chrome TTS API
   * @returns {Promise<Array>}
   */
  async fetchVoices() {
    return new Promise((resolve) => {
      chrome.tts.getVoices((voices) => {
        resolve(voices || []);
      });
    });
  },
  
  /**
   * Try to infer gender from voice name (imperfect but better than nothing)
   * @param {string} voiceName 
   * @returns {string} 'male', 'female', or 'neutral'
   */
  inferGender(voiceName) {
    const name = voiceName.toLowerCase();
    
    // Check for common indicators in the name
    if (/\b(male|man|guy|boy|david|john|james|paul|richard)\b/.test(name)) {
      return 'male';
    }
    
    if (/\b(female|woman|lady|girl|mary|sarah|lisa|karen|emily)\b/.test(name)) {
      return 'female';
    }
    
    return 'neutral';
  },
  
  /**
   * Get voices for this provider
   * @returns {Promise<Array<Voice>>}
   */
  async getVoices() {
    if (this.voices.length === 0) {
      await this.initialize();
    }
    return this.voices;
  },
  
  /**
   * Synthesize speech using browser TTS
   * @param {string} text - Text to synthesize
   * @param {string} voiceId - Voice ID to use
   * @param {Object} options - Options for synthesis (speed, etc.)
   * @returns {Promise<AudioData>}
   */
  async synthesizeSpeech(text, voiceId, options = {}) {
    try {
      if (!chrome.tts) {
        throw new Error('Chrome TTS API not available');
      }
      
      // Find the voice
      const voice = this.voices.find(v => v.id === voiceId);
      if (!voice) {
        throw new Error(`Voice not found: ${voiceId}`);
      }
      
      // Generate audio using Chrome TTS API
      const audioData = await this.generateAudio(text, voice, options);
      
      // Generate estimated word timestamps
      const wordTimestamps = this.generateEstimatedTimestamps(text, audioData.duration);
      
      return {
        audioBase64: audioData.audioBase64,
        contentType: 'audio/wav',
        wordTimestamps: wordTimestamps,
        duration: audioData.duration
      };
    } catch (error) {
      console.error('[BrowserTTSProvider] Synthesis error:', error);
      throw error;
    }
  },
  
  /**
   * Generate audio using Chrome TTS
   * This is more complex because Chrome TTS doesn't return audio data directly
   * We have to use an audio context to capture the audio output
   * @param {string} text 
   * @param {Object} voice 
   * @param {Object} options 
   * @returns {Promise<Object>} Audio data and duration
   */
  async generateAudio(text, voice, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // For now, we'll use a placeholder solution
        // In a real implementation, we'd need a way to capture Chrome TTS audio output
        // This could involve using an OffscreenDocument or other approach
        
        // Simulate audio generation
        console.log(`[BrowserTTSProvider] Generating audio for: "${text}" with voice ${voice.id}`);
        
        // Speak the text (this will use the system speakers but not give us the audio data)
        chrome.tts.speak(text, {
          voiceName: voice.id,
          rate: options.speed || 1,
          onEvent: (event) => {
            if (event.type === 'end') {
              // For now, return a dummy audio signal
              // This is a placeholder for demonstration
              const dummyAudioData = this.generateDummyAudio();
              const estimatedDuration = this.estimateDuration(text);
              
              resolve({
                audioBase64: dummyAudioData,
                duration: estimatedDuration
              });
            } else if (event.type === 'error') {
              reject(new Error(`TTS error: ${event.errorMessage || 'Unknown error'}`));
            }
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Generate a dummy audio signal for testing
   * In a real implementation, we'd capture actual audio data
   * @returns {string} Base64 encoded audio
   */
  generateDummyAudio() {
    // This would be a real audio capture in production
    // For now, return a simple sine wave as placeholder
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YQAAAAA=';
  },
  
  /**
   * Estimate speech duration based on text length and reading speed
   * @param {string} text 
   * @returns {number} Duration in seconds
   */
  estimateDuration(text) {
    // Average reading speed is ~150 words per minute or 2.5 words per second
    const words = text.split(/\s+/).length;
    const wordsPerSecond = 2.5;
    
    return words / wordsPerSecond;
  },
  
  /**
   * Generate estimated word timestamps
   * @param {string} text 
   * @param {number} duration - Total duration in seconds
   * @returns {Array<Object>} Word timestamp objects
   */
  generateEstimatedTimestamps(text, duration) {
    const words = text.split(/\s+/);
    const timestamps = [];
    
    // Simple linear distribution
    for (let i = 0; i < words.length; i++) {
      const startTime = (duration * i) / words.length;
      const endTime = (duration * (i + 1)) / words.length;
      
      timestamps.push({
        word: words[i],
        start: startTime,
        end: endTime
      });
    }
    
    return timestamps;
  }
};

export default browserTTSProvider; 