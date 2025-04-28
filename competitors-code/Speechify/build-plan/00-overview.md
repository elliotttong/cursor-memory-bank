# 00: Project Overview & Vision

## Vision

To create a high-quality, user-friendly, and reliable text-to-speech (TTS) Chrome Extension that provides a seamless reading experience across the web. We aim to surpass existing solutions by leveraging modern cloud infrastructure for superior voice quality, enhanced features, and robust performance, while adhering strictly to ethical and legal standards.

## High-Level Goals

1.  **Replicate Core Functionality:** Implement the essential features identified in the competitor analysis (text extraction, TTS playback, synchronized highlighting, voice selection).
2.  **Superior Voice Quality:** Utilize the state-of-the-art Kokoro-82M model via Hugging Face Inference Endpoints for natural-sounding voices.
3.  **Robust Backend:** Build a scalable and maintainable backend using Supabase for authentication, data storage, usage tracking, and API proxying.
4.  **Performance & Efficiency:** Optimize client-side performance by offloading TTS to the cloud and implementing efficient DOM interaction techniques.
5.  **Clean Implementation:** Develop a completely new codebase ("steal like an artist"), avoiding direct code reuse and focusing on best practices.
6.  **Feature Enhancements:** Incorporate value-added features like referrals, gamification (streaks), and strive for improved site compatibility through a robust adapter system.

## Core Features (MVP Target)

*   Content identification and extraction on web pages.
*   TTS playback using Kokoro-82M via HF Inference Endpoint.
*   Synchronized sentence and word highlighting.
*   User authentication (Google Sign-In via Supabase).
*   Basic usage tracking.
*   Settings for voice speed.
*   Context menu integration.
*   Keyboard shortcuts.

## Target Technology Stack

*   **Frontend (Extension):** TypeScript, React (for UI components like Popup/Settings), Chrome Extension APIs (Manifest V3).
*   **Backend:** Supabase (Auth, Postgres DB, Storage, Edge Functions, pg_cron).
*   **TTS Model:** Kokoro-82M (Apache-2.0 License).
*   **TTS Hosting:** Hugging Face Inference Endpoints.
*   **Billing (Post-MVP):** Stripe.

## High-Level Architecture Flow

```mermaid
graph TD
    User[User on Web Page] --> Ext[Chrome Extension]
    Ext --> SB[Supabase Backend]
    SB --> HF[HF Inference Endpoint (Kokoro-82M)]
    HF --> SB
    SB --> Ext
    Ext --> User(Audio Playback & Highlighting)

    subgraph Chrome Extension
        CS[Content Script]
        SW[Service Worker]
        UI[Popup/Settings]
    end

    subgraph Supabase
        Auth[Auth]
        DB[Database]
        Store[Storage]
        EF[Edge Functions]
        Cron[pg_cron]
    end

    Ext -- 1. Extract Text --> SW
    SW -- 2. Auth Check --> Auth
    SW -- 3. TTS Request --> EF
    EF -- 4. Call Model --> HF
    HF -- 5. Synthesize Audio --> EF
    EF -- 6. Log Usage --> DB
    EF -- 7. Cache Audio --> Store
    EF -- 8. Return Audio URL --> SW
    SW -- 9. Send to CS --> CS
    CS -- 10. Play & Highlight --> User
```

## Key Differentiators from Competitor

*   **Cloud-Based TTS:** Provides access to higher quality voices (Kokoro-82M) and offloads client processing.
*   **Modern Backend:** Leverages Supabase for a comprehensive, integrated backend solution.
*   **Simplified Client:** Reduces complexity in the extension itself by removing local model inference.
*   **Focus on Efficiency:** Explicit goal to address and improve upon performance bottlenecks observed in the competitor.

This project aims to deliver a best-in-class TTS experience by combining learnings from existing solutions with the power and flexibility of modern cloud platforms. 