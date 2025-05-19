/**
 * Tests for the provider abstraction layer
 * This is a simple test harness to verify that the provider abstraction works correctly
 * without affecting the existing functionality.
 * 
 * Usage:
 * 1. Add this script to the manifest.json (temporarily) as a background script
 * 2. Open the extension background page console
 * 3. Observe the test results
 * 4. Remove from manifest when done
 */

import { initializeProviders, providerManager, deepInfraProvider, browserTTSProvider } from './index.js';

// Test result tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

/**
 * Simple assertion function
 * @param {boolean} condition - The condition to check
 * @param {string} message - Test description
 */
function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testResults.passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    testResults.failed++;
    testResults.errors.push(message);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 RUNNING PROVIDER TESTS 🧪');
  
  try {
    // Test provider initialization
    await testProviderInitialization();
    
    // Test provider interfaces
    testProviderInterfaces();
    
    // Test voice management
    await testVoiceManagement();
    
    // Test synthesis (without audio)
    await testSynthesisSetup();
    
    // Summarize results
    console.log('\n🏁 TEST RESULTS:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    
    if (testResults.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (testResults.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! The provider abstraction layer should be safe to integrate.');
    } else {
      console.log('\n⚠️ SOME TESTS FAILED. Please review before integrating.');
    }
  } catch (error) {
    console.error('💥 TEST EXECUTION ERROR:', error);
  }
}

/**
 * Test provider initialization
 */
async function testProviderInitialization() {
  console.log('\n🔍 Testing Provider Initialization...');
  
  // Initialize providers
  const result = await initializeProviders();
  assert(result === true, 'Provider initialization returns true');
  
  // Check provider manager
  assert(providerManager !== null, 'Provider manager exists');
  assert(providerManager.providers !== undefined, 'Provider manager has providers object');
  
  // Check if providers are registered
  assert(providerManager.providers[deepInfraProvider.id] !== undefined, 'Deep Infra provider is registered');
  assert(providerManager.providers[browserTTSProvider.id] !== undefined, 'Browser TTS provider is registered');
  
  // Check defaults
  assert(providerManager.defaultProvider === deepInfraProvider.id, 'Default provider is set to Deep Infra');
  assert(providerManager.fallbackProvider === browserTTSProvider.id, 'Fallback provider is set to Browser TTS');
}

/**
 * Test provider interfaces
 */
function testProviderInterfaces() {
  console.log('\n🔍 Testing Provider Interfaces...');
  
  // Check Deep Infra provider interface
  assert(typeof deepInfraProvider.id === 'string', 'Deep Infra provider has id string');
  assert(typeof deepInfraProvider.name === 'string', 'Deep Infra provider has name string');
  assert(typeof deepInfraProvider.getVoices === 'function', 'Deep Infra provider has getVoices function');
  assert(typeof deepInfraProvider.synthesizeSpeech === 'function', 'Deep Infra provider has synthesizeSpeech function');
  assert(typeof deepInfraProvider.supportsWordTimestamps === 'boolean', 'Deep Infra provider has supportsWordTimestamps boolean');
  
  // Check Browser TTS provider interface
  assert(typeof browserTTSProvider.id === 'string', 'Browser TTS provider has id string');
  assert(typeof browserTTSProvider.name === 'string', 'Browser TTS provider has name string');
  assert(typeof browserTTSProvider.getVoices === 'function', 'Browser TTS provider has getVoices function');
  assert(typeof browserTTSProvider.synthesizeSpeech === 'function', 'Browser TTS provider has synthesizeSpeech function');
  assert(typeof browserTTSProvider.supportsWordTimestamps === 'boolean', 'Browser TTS provider has supportsWordTimestamps boolean');
}

/**
 * Test voice management
 */
async function testVoiceManagement() {
  console.log('\n🔍 Testing Voice Management...');
  
  // Test Deep Infra voices
  const deepInfraVoices = await deepInfraProvider.getVoices();
  assert(Array.isArray(deepInfraVoices), 'Deep Infra getVoices returns array');
  assert(deepInfraVoices.length > 0, 'Deep Infra has at least one voice');
  
  if (deepInfraVoices.length > 0) {
    const voice = deepInfraVoices[0];
    assert(typeof voice.id === 'string', 'Voice has id string');
    assert(typeof voice.name === 'string', 'Voice has name string');
    assert(typeof voice.provider === 'string', 'Voice has provider string');
    assert(voice.provider === deepInfraProvider.id, 'Voice provider matches Deep Infra id');
  }
  
  // Test Browser TTS voices (might be 0 if browser doesn't support TTS)
  const browserVoices = await browserTTSProvider.getVoices();
  assert(Array.isArray(browserVoices), 'Browser TTS getVoices returns array');
  
  // Test get all voices
  const allVoices = await providerManager.getAllVoices();
  assert(Array.isArray(allVoices), 'getAllVoices returns array');
  assert(allVoices.length >= deepInfraVoices.length, 'getAllVoices has at least as many voices as Deep Infra');
  
  // Test get active provider
  const activeProvider = providerManager.getActiveProvider();
  assert(activeProvider !== null, 'getActiveProvider returns a provider');
  assert(typeof activeProvider.id === 'string', 'Active provider has id string');
  
  // Test get selected voice
  const selectedVoice = await providerManager.getSelectedVoice();
  // This might be null if no voice is selected, so just check it's callable
  assert(true, 'getSelectedVoice is callable');
  
  // Test set selected voice with a sample voice
  if (deepInfraVoices.length > 0) {
    await providerManager.setSelectedVoice(deepInfraVoices[0].id);
    const newSelectedVoice = await providerManager.getSelectedVoice();
    assert(newSelectedVoice !== null, 'Selected voice is set');
    assert(newSelectedVoice.id === deepInfraVoices[0].id, 'Selected voice has correct id');
  }
}

/**
 * Test synthesis setup (but don't actually synthesize)
 */
async function testSynthesisSetup() {
  console.log('\n🔍 Testing Synthesis Setup (without audio)...');
  
  // Test Deep Infra synthesis setup
  const testApi = async () => {
    try {
      // Mock chrome.storage.local.get to return a fake token
      const originalGet = chrome.storage.local.get;
      chrome.storage.local.get = (keys, callback) => {
        if (keys.includes('deepInfraToken') || (typeof keys === 'object' && 'deepInfraToken' in keys)) {
          return Promise.resolve({ deepInfraToken: 'fake-token-for-testing' });
        }
        return originalGet(keys, callback);
      };
      
      // Override callDeepInfraTTS to prevent actual API calls
      const originalCall = deepInfraProvider.callDeepInfraTTS;
      deepInfraProvider.callDeepInfraTTS = async () => {
        return {
          audio: 'base64-audio-data',
          words: [{ word: 'test', start: 0, end: 1 }]
        };
      };
      
      // Try a synthesis call
      const result = await deepInfraProvider.synthesizeSpeech('Test text', 'af_bella');
      
      // Restore original functions
      chrome.storage.local.get = originalGet;
      deepInfraProvider.callDeepInfraTTS = originalCall;
      
      return result;
    } catch (error) {
      console.error('API test error:', error);
      return null;
    }
  };
  
  const apiResult = await testApi();
  assert(apiResult !== null, 'Deep Infra synthesis setup works');
  
  if (apiResult) {
    assert(typeof apiResult.audioBase64 === 'string', 'Deep Infra synthesis returns audioBase64 string');
    assert(Array.isArray(apiResult.wordTimestamps), 'Deep Infra synthesis returns wordTimestamps array');
  }
}

// Start tests
runTests(); 