# 13: Permissions and Content Security Policy (CSP)

This document outlines the required Chrome Extension permissions and defines the Content Security Policy (CSP) needed for the application to function securely.

## Minimum Required Permissions (`manifest.json`)

We aim for the *minimum set* of permissions necessary, enhancing user trust and reducing security surface area compared to the competitor.

```json
{
  "manifest_version": 3,
  "name": "Read Aloud Deluxe (New)",
  "version": "0.1.0",
  "description": "High-quality text-to-speech for any webpage.",
  "permissions": [
    "activeTab",     // GRANTED ON USER CLICK: Allows access to the current tab when user invokes the extension (e.g., clicks popup, context menu, or hotkey). Preferred over broad host permissions.
    "scripting",     // REQUIRED: To inject content scripts programmatically using `chrome.scripting.executeScript` for text extraction and UI injection, especially when using `activeTab`.
    "storage",       // REQUIRED: For storing user settings, preferences, Supabase session tokens, adapter configurations.
    "identity",      // REQUIRED: For Google Sign-In flow using `chrome.identity.getAuthToken`.
    "contextMenus",  // REQUIRED: If providing a right-click "Read aloud" option.
    "notifications", // REQUIRED: For notifying users about referral success, streak milestones, etc.
    "alarms"         // OPTIONAL BUT RECOMMENDED: For scheduling periodic tasks within the service worker (e.g., checking token expiry, less frequent tasks than cron allows) instead of relying solely on SW lifecycle events.
    // "offscreen"    // POTENTIALLY REQUIRED: Only if reliable audio playback directly from the content script or service worker proves problematic. Avoid if possible.
    // "declarativeNetRequest" // OPTIONAL: Could be used to block specific resources or modify headers if needed, but likely not required for core functionality.
  ],
  "host_permissions": [
    // NO broad host permissions like "<all_urls>" or "*://*/*".
    // Access granted via "activeTab".
    // Permissions for specific backend domains are handled by fetch/CSP, not here.
  ],
  "background": {
    "service_worker": "background.js", // Or background.ts compiled
    "type": "module"
  },
  "content_scripts": [
    // We will primarily use programmatic injection via `chrome.scripting`
    // and `activeTab`. A minimal static content script might be used
    // *only* if essential for early injection before user interaction,
    // but aim to avoid this for stricter permission model.
    // Example if NEEDED (prefer programmatic):
    // {
    //   "matches": ["<all_urls>"], // Needs careful consideration if required
    //   "js": ["content_loader.js"],
    //   "run_at": "document_start",
    //   "all_frames": false
    // }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "commands": {
    "toggle-play-pause": {
      "suggested_key": {
        "default": "Alt+P",
        "mac": "Alt+P"
      },
      "description": "Play or pause reading"
    }
    // Add other commands
  },
  "oauth2": {
    // REQUIRED for chrome.identity.getAuthToken
    "client_id": "<YOUR_CHROME_APP_OAUTH_CLIENT_ID>.apps.googleusercontent.com",
    "scopes": [
      "openid",
      "email",
      "profile"
    ]
  },
  "web_accessible_resources": [
    {
      "resources": [
        "images/*.png",
        "fonts/*.woff2",
        "ui/*" // If injecting UI elements/CSS dynamically
       ],
      "matches": ["<all_urls>"] // Content scripts need access
    }
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';",
    "sandbox": "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';"
    // NOTE: The above `extension_pages` is the default restrictive CSP.
    // We need to add directives to allow connections to Supabase and potentially Stripe/HF.
    // SEE CSP Section Below.
  }
}

```

**Key Permission Choices & Rationale:**

*   **`activeTab` vs. Broad Host Permissions:** Using `activeTab` is the modern standard for privacy and security. It grants temporary access to the current page only when the user explicitly invokes the extension. This avoids needing `<all_urls>`.
*   **`scripting`:** Essential for injecting content scripts on demand when `activeTab` is granted.
*   **`identity`:** Required for the recommended Google Sign-In flow.
*   **`storage`:** Necessary for settings and session persistence.
*   **`offscreen` Avoidance:** Unlike the competitor relying on local TTS, we aim to avoid the `offscreen` permission entirely by using cloud TTS and handling audio playback in the content script or service worker if feasible. This simplifies the extension.

## Content Security Policy (CSP)

The `content_security_policy` in `manifest.json` restricts the resources the extension pages (popup, settings, background worker) can load and execute.

**Required Directives (Additions to default `extension_pages`):**

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'; connect-src https://<YOUR_SUPABASE_REF>.supabase.co wss://<YOUR_SUPABASE_REF>.supabase.co https://api.stripe.com; img-src 'self' data: https://*.googleusercontent.com;"
  // Explanation:
  // script-src 'self': Only allows scripts from the extension's own package.
  // object-src 'self': Disallows <object>, <embed>, <applet>.
  // connect-src:
  //   https://<YOUR_SUPABASE_REF>.supabase.co: Allows connections to Supabase REST API & Edge Functions.
  //   wss://<YOUR_SUPABASE_REF>.supabase.co: Allows WebSocket connections for Supabase Realtime.
  //   https://api.stripe.com: Allows connections to Stripe API (if calling directly from client, e.g., for Checkout Elements. Less likely needed if all Stripe calls are backend).
  // img-src:
  //   'self': Allows images from the extension package.
  //   data:: Allows data URIs (useful for some UI elements).
  //   https://*.googleusercontent.com: Allows loading Google user profile pictures.
}

```

**Notes on CSP:**

*   **Supabase URLs:** Replace `<YOUR_SUPABASE_REF>` with your actual Supabase project reference.
*   **Hugging Face:** We **do not** need to add the Hugging Face endpoint URL to `connect-src` because the extension (Service Worker) calls the *Supabase Edge Function*, and the *Edge Function* calls Hugging Face. The connection is proxied.
*   **Stripe:** Only add `https://api.stripe.com` if the client-side code (e.g., settings page) directly interacts with Stripe APIs (like loading Stripe.js or using Elements). If all Stripe interactions are handled via webhooks and backend calls, it's not needed in the extension's CSP.
*   **Inline Scripts/Eval:** Avoid using inline scripts (`onclick=...`) or `eval()`. If absolutely necessary for a library, you might need `'unsafe-inline'` or `'unsafe-eval'` in `script-src`, but this weakens security and should be avoided if possible (especially `unsafe-eval`).
*   **Web Accessible Resources:** CSP for content scripts interacting with WARs is handled differently and generally less strict, but ensure WARs themselves don't contain overly permissive code.

## Security Notes

*   **Minimal Permissions:** Stick to the minimum required permissions (`activeTab` model).
*   **Input Sanitization:** Sanitize any data received from web pages (content scripts) before processing or storing it.
*   **Secure API Key Handling:** Store Supabase service role keys, Stripe keys, and Hugging Face keys securely as environment variables for Edge Functions, not in client-side code.
*   **RLS:** Implement strict Row Level Security policies in Supabase (as defined in `05-backend-schema.md`) to prevent unauthorized data access.
*   **Dependency Audits:** Regularly audit npm/Deno dependencies for known vulnerabilities.
*   **CSP:** Maintain a strict Content Security Policy. 