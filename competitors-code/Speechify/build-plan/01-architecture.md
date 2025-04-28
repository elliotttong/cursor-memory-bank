# 01: System Architecture

This document outlines the proposed architecture for the TTS Chrome Extension, utilizing Supabase and Hugging Face Inference Endpoints. It adapts the core concepts from the competitor analysis (`01-overview.md`) but replaces local processing with cloud-based services.

## Core Components

```mermaid
graph TD
    subgraph Browser Environment
        direction LR
        A[User Interface: Web Page DOM]
        B[Extension UI: Action Popup, Settings Page]
        C[Content Scripts (CS)]
        D[Background Service Worker (SW)]
    end

    subgraph Supabase Cloud Platform
        direction TB
        SB_Auth[Auth (Google Sign-In)]
        SB_DB[Postgres Database (Profiles, Usage, Config)]
        SB_Store[Storage (Cached Audio)]
        SB_EF[Edge Functions]
        SB_Cron[pg_cron (Scheduled Tasks)]

        subgraph Edge Functions
            direction LR
            EF_TTS[TTS Proxy (Handles caching/routing)]
            EF_AuthCB[Auth Callback]
            EF_StripeWH[Stripe Webhook]
            EF_Referral[Referral Logic]
        end
    end

    subgraph Hugging Face Cloud
        direction TB
        HF_IE[Inference Endpoint (Kokoro-82M)]
    end

    %% Interactions
    A -- User Actions --> C;
    C -- Reads/Modifies --> A;
    C -- UI Updates --> A;
    C -- Messaging --> D;
    B -- User Actions --> D;
    D -- Messaging --> C;
    D -- Manages State --> D;
    D -- API Calls --> SB_EF;
    D -- Authentication --> SB_Auth;

    SB_EF -- DB Queries/Mutations --> SB_DB;
    SB_EF -- Storage Ops --> SB_Store;
    SB_EF -- Calls --> HF_IE;
    SB_EF -- Calls --> Stripe_API[Stripe API];

    SB_Cron -- Triggers --> EF_Health;
    SB_Cron -- Triggers --> SB_DB; %% Example: Daily usage rollup SQL function

    %% Data Flow Example: TTS Request
    C -- 1. Extract Text & Send --> D;
    D -- 2. Auth & Prepare Request --> EF_TTS;
    EF_TTS -- 3. Validate & Check Usage --> SB_DB;
    EF_TTS -- 4. Forward to Model --> HF_IE;
    HF_IE -- 5. Synthesize Audio (& Timestamps?) --> EF_TTS;
    EF_TTS -- 6. Log Usage --> EF_Usage;
    EF_TTS -- 7. Cache Audio? --> SB_Store;
    EF_TTS -- 8. Return Audio URL/Data --> D;
    D -- 9. Send Audio/Timestamps --> C;
    C -- 10. Play Audio & Highlight --> A;

    %% Styling
    style Browser Environment fill:#cde,stroke:#333,stroke-width:2px
    style Supabase Cloud Platform fill:#9cf,stroke:#333,stroke-width:2px
    style Hugging Face Cloud fill:#fc9,stroke:#333,stroke-width:2px
    style Edge Functions fill:#adf,stroke:#333,stroke-width:1px

```

## Component Breakdown

1.  **Chrome Extension (Client-Side)**
    *   **Background Service Worker (SW):**
        *   Acts as the central coordinator.
        *   Manages extension state (playback status, user settings).
        *   Handles communication between Content Scripts and Supabase backend.
        *   Initiates authentication flow with Supabase Auth.
        *   Calls Supabase Edge Functions for TTS requests, usage logging, etc.
        *   Manages context menus and keyboard shortcuts.
        *   **Improvement:** Avoids the need for an Offscreen Document for TTS, simplifying the extension structure compared to the competitor. Playback might be handled via messages to Content Scripts or potentially a minimal Offscreen document solely for reliable audio playback if needed (TBD).
    *   **Content Scripts (CS):**
        *   Injected into web pages.
        *   Responsible for DOM analysis to identify readable content (using heuristics and site-specific adapters).
        *   Injects UI elements (e.g., "Read" button, highlighting overlays).
        *   Communicates extracted text to the SW.
        *   Receives audio data/URLs and timestamp information from the SW.
        *   Manages audio playback (e.g., using `<audio>` element or Web Audio API).
        *   Applies visual highlights to the DOM based on timestamps.
        *   **Improvement:** Implement efficient DOM observation (throttled MutationObserver, IntersectionObserver) based on findings in `14-performance-audit.md`.
    *   **Action Popup / Settings UI:**
        *   Standard browser action popup for primary controls.
        *   Dedicated settings page for voice selection, speed, account management, etc.
        *   Communicates user preferences to the SW.

2.  **Supabase (Backend Platform)**
    *   **Auth:** Handles user authentication via Google Sign-In tailored for Chrome Extensions. Provides JWTs for authenticated requests to Edge Functions.
    *   **Postgres Database:** Stores user profiles, preferences, subscription status, usage data (raw events, aggregated monthly), referral information, gamification state (streaks), and potentially adapter configuration. Implements Row Level Security (RLS) to protect user data.
    *   **Storage:** Caches generated audio files (MP3s) to reduce latency and costs for repeated requests. Uses signed URLs for secure access from the client.
    *   **Edge Functions (TypeScript/Deno):**
        *   `TTS Proxy & Timestamp Gen.`: Receives requests from the SW, authenticates the user, checks usage limits against DB, forwards the request to the HF Inference Endpoint, receives the audio, potentially processes/generates timestamps (if not provided by HF), triggers usage logging, caches the result in Storage, and returns the audio URL/data. **Crucial:** Must investigate timestamp generation capabilities of Kokoro-82M/HF Endpoint or plan for server-side generation/alignment.
        *   `Usage Logging`: Records TTS character counts or duration per user, potentially calling Stripe's Metered Billing API.
        *   `Stripe Webhook Handler`: Listens for events from Stripe (e.g., subscription updates) and updates user status in the DB.
        *   `Adapter Health Check`: Triggered by pg_cron to test site-specific adapters (e.g., fetch a sample page, run selectors) and log results.
        *   `Referral Logic`: Handles referral code generation, validation, and crediting.
    *   **pg_cron:** Schedules backend tasks like running the adapter health check function or performing daily/monthly usage rollups in the database.

3.  **Hugging Face (TTS Service)**
    *   **Inference Endpoint:** Hosts the Kokoro-82M model on GPU infrastructure. Receives text input from the Supabase TTS Proxy Edge Function and returns synthesized audio data. **Need to confirm:** Output format (MP3, WAV?), streaming support, and importantly, whether it can provide word/sentence-level timestamps or alignment information suitable for highlighting.

## Key Differences from Competitor

*   **TTS Location:** Cloud (HF) vs. Local (ONNX/WASM).
*   **Backend:** Full-fledged Supabase vs. Minimal external calls (competitor used backend mainly for sync/analytics).
*   **Offscreen Document:** Likely eliminated or minimized vs. Central component for competitor's TTS.
*   **Resource Usage:** Shifts heavy computation (TTS) to the cloud, potentially reducing client-side CPU/memory load but introducing network latency and cloud costs.
*   **Scalability:** Cloud-based architecture offers easier scalability for TTS load and user data management.

This architecture leverages modern cloud services to rebuild the core functionality while aiming for better voice quality, scalability, and potentially reduced client-side complexity. The primary challenge is ensuring reliable and accurate synchronized highlighting given the move to a cloud TTS provider. 

### Considerations & Alternatives

*   **Speech Recognition:** Not included in MVP, but could be a future addition (e.g., voice commands).
*   **Offline Support:** Limited due to cloud reliance. Could potentially cache some audio locally, but focus is online.

## Dependencies

*   **Browser APIs:** `chrome.scripting`, `chrome.runtime`, `chrome.storage`, `chrome.identity`.
*   **External Services:** Supabase, Hugging Face Inference Endpoints, Stripe (later phase).
*   **DOM Manipulation:** Requires robust content scripts to interact with diverse web page structures, necessitating an adapter pattern (`02-extension-adapters.md`). 