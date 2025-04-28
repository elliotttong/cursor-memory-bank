# 18: Legal & Compliance Notes

This document outlines key legal and compliance considerations for the project, focusing on model licensing and Chrome Web Store policies.

**Disclaimer:** This is not legal advice. Consult with legal professionals for specific guidance.

## 1. Model Licensing: Kokoro-82M (Apache License 2.0)

*   **License:** The specified model, `hexgrad/Kokoro-82M`, is listed on Hugging Face with an **Apache License 2.0**.
*   **Permissions:** Apache 2.0 is a permissive open-source license that generally allows:
    *   **Commercial Use:** Yes.
    *   **Modification:** Yes.
    *   **Distribution:** Yes (of original or modified works).
    *   **Private Use:** Yes.
    *   **Sublicensing:** Not directly, but recipients get the same rights.
*   **Conditions:**
    *   **License and Copyright Notice:** You MUST include a copy of the Apache 2.0 license text and any original copyright notices (if present in the model distribution) with your distributed software (e.g., within the extension package or linked from an "About" section).
    *   **State Changes:** If you modify the licensed files, you MUST indicate that changes were made. (Less relevant if only *using* the model via API, but important if fine-tuning and redistributing the model itself).
    *   **NOTICE File:** If the original work includes a `NOTICE` text file containing attribution notices, you MUST include that `NOTICE` file within your distribution in a readable form.
    *   **No Trademark Use:** The license does not grant permission to use the names, trademarks, service marks, or product names of the licensor (Hexgrad or original authors), except for reasonable and customary use in describing the origin of the work and reproducing the copyright notice.
    *   **No Warranty/Liability:** The software is provided "AS IS" without warranties, and the licensor is not liable for damages.
*   **Our Implementation:**
    *   Since we are *using* the model via an API (HF Inference Endpoint) and not distributing the model files themselves within the extension, the primary requirement is **attribution**. Include a clear notice in the extension's "About" or "Settings" page acknowledging the use of Kokoro-82M by Hexgrad, licensed under Apache 2.0. Link to the model card and the license text.
    *   Example Attribution Text: "Voice synthesis powered by Kokoro-82M by Hexgrad, licensed under the Apache License 2.0. [Link to Model Card] [Link to License]"

## 2. Chrome Web Store (CWS) Policies

Key policies to adhere to:

*   **Permissions:**
    *   **Request Minimal Permissions:** Only request permissions essential for the extension's core functionality (`13-permissions-csp.md`). Using `activeTab` instead of broad host permissions is strongly aligned with CWS best practices.
    *   **Justify Permissions:** Provide clear justifications for requested permissions in the CWS developer dashboard submission, explaining *why* each permission is needed for the user-facing functionality.
*   **User Data Privacy:**
    *   **Privacy Policy:** MUST provide a comprehensive privacy policy detailing what data is collected (user content for TTS, usage analytics, authentication info, etc.), how it's used, stored (Supabase), and shared (Hugging Face for TTS, Stripe for billing). Link prominently from the CWS listing and within the extension.
    *   **Secure Handling:** Transmit user data securely (HTTPS for all API calls). Protect user data at rest (Supabase RLS, database security).
    *   **Anonymization/Aggregation:** Consider anonymizing or aggregating usage data where possible.
*   **Single Purpose:** The extension should adhere to its stated purpose (TTS). Avoid bundling unrelated functionality.
*   **Content Policies:** Ensure the extension does not promote hate speech, illegal acts, etc. (Generally not an issue for a utility like TTS, but be mindful).
*   **Security:** Avoid security vulnerabilities (e.g., XSS through insecure handling of web content, insecure API key storage - addressed by backend proxy).
*   **Monetization:**
    *   Clearly disclose any paid features or subscriptions (`11-paywall.md`).
    *   Use a CWS-approved payment processor (Stripe is common and generally accepted) or rely on external subscription management linked from the extension.
    *   Do not use deceptive or obfuscated payment practices.
*   **User Experience:** Provide a clear UI, avoid intrusive advertising (if any), and ensure the extension functions as described.

## 3. Other Considerations

*   **Supabase & Hugging Face Terms of Service:** Adhere to the ToS for both platforms regarding API usage limits, acceptable use, data processing agreements (DPAs), etc.
*   **Stripe Integration:** Comply with Stripe's terms and PCI DSS requirements (though using Stripe Checkout/Elements typically handles most direct PCI compliance).
*   **Readability.js License:** If using Mozilla's `readability.js`, comply with its license (typically Apache 2.0 as well, but verify).
*   **Dependencies:** Check licenses of all included libraries (npm, Deno) to ensure compatibility with commercial use and distribution within a Chrome Extension.

## Action Items

*   [ ] Draft Privacy Policy.
*   [ ] Draft CWS Listing Description, including permission justifications.
*   [ ] Implement clear attribution for Kokoro-82M (and other key dependencies) within the extension UI.
*   [ ] Verify `readability.js` license.
*   [ ] Review Supabase, HF, and Stripe ToS/DPAs.
*   [ ] Consult legal counsel before launch. 