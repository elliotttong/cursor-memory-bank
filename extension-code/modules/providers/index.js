import providerManager from './providerManager.js';
import deepInfraProvider from './deepInfraProvider.js';
import browserTTSProvider from './browserTTSProvider.js';

/**
 * Initialize all providers and the provider manager
 * @returns {Promise<void>}
 */
export async function initializeProviders() {
  console.log('[Providers] Initializing TTS providers...');
  
  try {
    // Register providers
    providerManager.registerProvider(deepInfraProvider);
    providerManager.registerProvider(browserTTSProvider);
    
    // Initialize manager
    await providerManager.initialize();
    
    // Initialize browser TTS provider (needs async initialization)
    await browserTTSProvider.initialize();
    
    console.log('[Providers] All providers initialized successfully');
    return true;
  } catch (error) {
    console.error('[Providers] Initialization error:', error);
    return false;
  }
}

// Export the provider manager and providers
export { default as providerManager } from './providerManager.js';
export { default as deepInfraProvider } from './deepInfraProvider.js';
export { default as browserTTSProvider } from './browserTTSProvider.js'; 