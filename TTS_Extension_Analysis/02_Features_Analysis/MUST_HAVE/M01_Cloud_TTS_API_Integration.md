---
feature_code: "M01"
feature_name: "Cloud TTS API Integration"
priority: "Must Have"
analysis_date: "2025-04-28"
speechify_approach_summary: "Speechify integrates with multiple cloud TTS providers (e.g., Microsoft Azure) and possibly their own or other engines, as evidenced by explicit engine mappings in their voice list JSON."
other_approaches:
  - "NaturalReader uses its own cloud endpoints for premium/plus voices, with clear separation between free (local/browser) and paid (cloud) voices."
  - "ReadVox appears to use local ONNX models for TTS synthesis, with no direct evidence of cloud TTS API usage."
key_challenges:
  - "Managing API quotas and costs."
  - "Ensuring low-latency streaming and high reliability."
  - "Mapping user-friendly voice names to provider-specific IDs."
  - "Handling authentication securely in a browser extension."
---

## Feature Description
Cloud TTS API Integration enables the extension to use high-quality, natural-sounding voices by connecting to third-party text-to-speech services. This is essential for replicating the premium experience of apps like Speechify, which go beyond the browser's built-in voices.

## Code Evidence

### Speechify
**File:** `centralized-voice-list.json`
```json
{
  "displayName": "Kristi",
  ...
  "engine": "azure"
}
```
- Voices are mapped to engines such as `azure`, `speechify`, `standard`, etc., confirming multi-provider integration.

### NaturalReader
**File:** `injected/nr-ext-reader/tts.js`
```js
r.premTtsEndpoint="https://moxu0s1jnk.execute-api.us-east-1.amazonaws.com/prod-wpm/tts"
r.plusTtsEndpoint="https://2poo4vxwjc.execute-api.us-east-1.amazonaws.com/prod-wps/tts"
// ...
chrome.runtime.sendMessage({fn:"sendTtsRequest",queryEndpoint:o,text:e}, ...)
```
- Premium/plus voices are fetched from cloud endpoints, with requests routed through a background script.

### ReadVox
**File:** `src/offscreen/workers/synthesizer/index.js`
```js
// References to ONNX models and inference sessions
const s=await U.create(o); // ONNX model session
const {output:l}=await s.run(o); // Local inference
```
- The code references ONNX model loading and inference, indicating local (on-device) synthesis. No direct evidence of cloud TTS API usage was found.

## Pros and Cons of Each Approach

| Approach                | Pros                                                                 | Cons                                                                |
|-------------------------|----------------------------------------------------------------------|---------------------------------------------------------------------|
| **Multi-provider Cloud**<br>(Speechify) | - Maximum voice variety<br>- Best quality<br>- Can leverage new providers easily | - Complex integration<br>- Higher cost<br>- Must manage API keys and quotas |
| **Single-provider Cloud**<br>(NaturalReader) | - Simpler integration<br>- Consistent quality<br>- Easier to manage | - Limited voice selection<br>- Vendor lock-in                       |
| **Local/ONNX Synthesis**<br>(ReadVox) | - Works offline<br>- No API cost<br>- Better privacy              | - Lower quality (unless using large models)<br>- Higher device resource use |

## Kokoro-82M as a TTS Provider

**Overview:**
- [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) is an open-weight, Apache-licensed TTS model with 82M parameters.
- Delivers quality comparable to larger models, is fast and cost-efficient, and can be self-hosted or used via API.
- Cost: As of April 2025, serving Kokoro over API is **under $1 per million characters** ([source](https://huggingface.co/hexgrad/Kokoro-82M)).

**Integration Example (Python):**
```python
from kokoro import KPipeline
pipeline = KPipeline(lang_code='a')
text = "Kokoro is an open-weight TTS model..."
generator = pipeline(text, voice='af_heart')
for i, (gs, ps, audio) in enumerate(generator):
    # audio is a numpy array, 24kHz
    ...
```
([source](https://huggingface.co/hexgrad/Kokoro-82M))

**Pros:**
- No vendor lock-in; open source and self-hostable
- Low cost (API or self-hosted)
- Customizable and extensible
- Transparent licensing and model card

**Cons:**
- If self-hosted, requires managing infrastructure
- May lack some proprietary voices/features of commercial APIs
- Latency and scaling depend on your deployment/API provider

**How This Compares:**
| Approach                | Pros                                                                 | Cons                                                                |
|-------------------------|----------------------------------------------------------------------|---------------------------------------------------------------------|
| **Kokoro-82M (Open, Self/API)** | - No vendor lock-in<br>- Low cost<br>- Customizable<br>- Open source | - Must manage infra if self-hosted<br>- May lack some proprietary voices |
| **Multi-provider Cloud**<br>(Speechify) | - Maximum voice variety<br>- Best quality<br>- Can leverage new providers easily | - Complex integration<br>- Higher cost<br>- Must manage API keys and quotas |
| **Single-provider Cloud**<br>(NaturalReader) | - Simpler integration<br>- Consistent quality<br>- Easier to manage | - Limited voice selection<br>- Vendor lock-in                       |
| **Local/ONNX Synthesis**<br>(ReadVox) | - Works offline<br>- No API cost<br>- Better privacy              | - Lower quality (unless using large models)<br>- Higher device resource use |

**Recommendation (Updated for Kokoro-82M):**
- Use Kokoro-82M as your primary TTS engine for control, cost savings, and open-source flexibility.
- Start with API-based integration for speed, then move to self-hosting as you scale.
- For maximum voice variety, consider hybridizing with commercial APIs if needed.
- For privacy-focused or offline use, self-host Kokoro-82M on your own servers or user devices.

**References:**
- [Kokoro-82M Model Card & Usage](https://huggingface.co/hexgrad/Kokoro-82M)
- [Kokoro-82M GitHub](https://github.com/hexgrad/kokoro)

## Recommendation

For a Speechify-like experience:
- **Adopt a multi-provider cloud TTS integration** (like Speechify) for maximum voice quality, language support, and flexibility. This is the industry standard for premium TTS.
- **If cost or privacy is a concern**, consider a hybrid approach: use local synthesis (ONNX or browser `speechSynthesis`) for free/basic voices, and cloud APIs for premium voices.
- **Avoid single-provider lock-in** unless you have a strong reason (e.g., a unique voice only available from one vendor).

**Implementation Notes:**
- Always keep API keys and tokens secure (never expose in client code).
- Provide clear UI/UX for users to distinguish between free/local and premium/cloud voices.
- Monitor API usage and handle quota errors gracefully.

## Notes & Observations
- Speechify's wide voice selection and quality are a key differentiator, likely due to multi-provider integration.
- User reviews often mention the naturalness of voices, suggesting use of top-tier APIs.
- Some competitors offer fewer voices or lower quality, likely due to cost or technical limitations.
- Chrome extension architecture requires careful handling of secrets and API calls to avoid abuse or leaks. 