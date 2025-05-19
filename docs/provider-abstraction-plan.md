# Provider Abstraction Plan

## Overview

This document outlines the architecture and implementation plan for adding multi-provider TTS support to our Chrome Extension, including fallback mechanisms and UI adaptations.

## Requirements Analysis

Based on user needs and competitor analysis, our provider abstraction layer must:

1. Support multiple TTS providers (starting with Deep Infra and browser TTS)
2. Provide consistent voice selection interface regardless of provider
3. Handle quota limitations with transparent fallback
4. Adapt synchronization/highlighting based on available timing data
5. Extend the existing UI (not recreate) to support provider selection
6. Be extensible for future provider additions
7. Maintain backward compatibility with existing Deep Infra implementation
8. Implement shared quota tracking across all premium providers

## Components Affected

1. **Background Service Worker**:
   - TTS request handling
   - Provider selection logic
   - Quota tracking

2. **Content Scripts**:
   - UI enhancements for voice selection
   - Handling different timing data formats
   - Audio playback adaptation

3. **State Management**:
   - Provider availability status
   - Voice preferences storage
   - Quota tracking

## Architecture Design

### 1. Provider Interface

All providers will implement a consistent interface:

```javascript
// Interface each provider must implement
interface TTSProvider {
  id: string;                  // Unique provider ID
  name: string;                // Display name 
  isAvailable: boolean;        // Whether provider is currently available
  voices: Voice[];             // Voices offered by this provider
  
  // Core methods
  getVoices(): Promise<Voice[]>;
  synthesizeSpeech(text: string, voiceId: string, options: any): Promise<AudioData>;
  
  // Provider-specific capabilities
  supportsWordTimestamps: boolean;
  supportsSpeedControl: boolean;
  supportsPremiumVoices: boolean;
  
  // Quota management (if applicable)
  quotaExceeded: boolean;
  checkQuota(textLength: number): boolean;
  trackUsage(textLength: number): void;
}
```

### 2. Voice Data Structure

Standardized voice object used across providers:

```javascript
interface Voice {
  id: string;           // Unique voice ID
  name: string;         // Display name
  provider: string;     // Provider ID this voice belongs to
  language: string;     // Language code (e.g., "en-US")
  gender: string;       // "male", "female", or "neutral"
  isPremium: boolean;   // Whether this is a premium voice
  avatarUrl?: string;   // Optional avatar image URL
  sampleText?: string;  // Sample text for preview
}
```

### 3. Provider Manager

Central management system that:
- Registers available providers
- Handles provider selection based on voice and availability
- Implements fallback logic when primary provider is unavailable
- Manages state persistence (selected voice, provider preferences)
- Tracks shared quota usage across all premium providers

### 4. Implementation Strategy

#### A. Core Files

1. `providerManager.js`:
   - Provider registration and selection
   - Voice listing and filtering
   - Fallback management
   - Settings persistence
   - Centralized quota tracking for all premium providers

2. `deepInfraProvider.js`:
   - Implementation of TTSProvider interface for Deep Infra
   - API request formatting/handling
   - Precise word timestamp processing
   - Refactored from existing Deep Infra code to ensure compatibility

3. `browserTTSProvider.js`:
   - Implementation of TTSProvider interface for browser TTS
   - Chrome TTS API integration
   - Word timing estimation

#### B. UI Integration

**UI Approach**: Extend the existing widget, not recreate it.

1. Add dropdown panel to existing avatar button:
   - Tabbed interface with provider categories
   - Visual voice list with avatars and names
   - Premium vs. free voice indicators
   - Status indicators for quota/availability

2. Style considerations:
   - Consistent with existing widget design
   - Clear visual hierarchy for providers and voices
   - Accessible indicators for premium/quota status

## Competitor Approach Analysis

### Speechify
- **Pros**: 
  - Rich voice metadata (gender, accent, use case)
  - Visual avatars make voices feel personable
  - Clear provider attribution in data
  - Preview samples for voices
  
- **Cons**:
  - Potential for overwhelm with too many voices
  - Heavy voice list JSON (387KB)

- **Implementation**: 
  - Uses centralized voice configuration
  - Specialized voice UI components
  - Clean provider abstraction in code

### NaturalReader
- **Pros**:
  - Clear menu hierarchy
  - Search functionality for voices
  - Voice toggling feature (Alt+S)
  - Language auto-detection
  
- **Cons**:
  - Multiple nested menus
  - Complex provider-specific options

- **Implementation**:
  - Modular providers with capability flags
  - Provider-specific UI options
  - Centralized voice management

### ReadVox
- **Pros**:
  - Simple, focused interface
  - Lightweight implementation
  - Clear fallback patterns
  
- **Cons**:
  - Limited customization
  - Fewer voice options

- **Implementation**:
  - Provider factory pattern
  - Simplified voice structure
  - Minimal UI overhead

## Implementation Steps

1. **Data Structure Setup**:
   - Define provider interface
   - Define voice data structure
   - Create provider manager skeleton

2. **Deep Infra Integration**:
   - Carefully refactor existing Deep Infra code to match provider interface while preserving functionality
   - Implement voice listing and selection
   - Add quota tracking

3. **Browser TTS Integration**:
   - Create browser TTS provider implementation
   - Add word timing estimation logic
   - Implement Chrome TTS API methods

4. **UI Enhancements**:
   - Add voice selection dropdown to existing widget
   - Implement provider tabs in dropdown
   - Add status indicators for quota/availability

5. **Fallback Logic**:
   - Implement automatic provider switching
   - Add user preference persistence
   - Ensure synchronization adapts to timing differences
   - Implement shared quota management between premium providers

## Challenges & Mitigations

1. **Challenge**: Different timing data formats between providers.
   **Mitigation**: Adapter layer that normalizes timing data for the sync engine.

2. **Challenge**: UI complexity with multiple providers.
   **Mitigation**: Tabbed interface with clear categorization; focus on simplicity.

3. **Challenge**: Quota tracking accuracy.
   **Mitigation**: Conservative estimation; clear user feedback when approaching limits.

4. **Challenge**: Performance with provider switching.
   **Mitigation**: Lazy initialization of providers; caching voice lists.

5. **Challenge**: Maintaining compatibility with existing Deep Infra implementation.
   **Mitigation**: Incremental refactoring with comprehensive testing after each step; avoid changing underlying API call patterns.

6. **Challenge**: Shared quota management across premium providers.
   **Mitigation**: Centralized quota store in provider manager rather than in individual providers.

## Testing Strategy

1. Unit tests for each provider implementation
2. Integration tests for provider switching and fallback
3. UI tests for voice selection and status indicators
4. Quota limit simulation testing
5. Cross-site compatibility testing
6. Regression testing to ensure existing Deep Infra functionality remains intact

## Next Steps

1. Implement `providerManager.js` as the foundation
2. Carefully refactor existing Deep Infra code into `deepInfraProvider.js` with backward compatibility
3. Add browser TTS support in `browserTTSProvider.js`
4. Enhance UI to support provider selection
5. Add fallback logic and shared quota management system
6. Implement user preference persistence 