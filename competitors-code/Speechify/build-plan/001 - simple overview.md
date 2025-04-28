# 001: Simple Project Overview

## What We're Building

We are creating a Chrome browser extension that can read web pages aloud to the user. Think of it like an audiobook for any article or website. When the extension reads, it will also highlight the text being spoken, making it easy to follow along.

Our goal is to make a high-quality, easy-to-use reader that works better than existing options by using modern technology for better voices and performance.

## How It Works (The Main Parts)

1.  **The Extension (Runs in Chrome):**
    *   This is the part the user installs and interacts with.
    *   It figures out the main text content on a webpage (like an article, ignoring ads and menus).
    *   It shows a simple floating button on the page to start reading.
    *   It communicates with our backend to get the audio.
    *   It plays the audio and highlights the corresponding text on the screen.
    *   It will eventually have a popup menu and settings page for controls.

2.  **The Backend (Using Supabase):**
    *   This is our "server" running in the cloud.
    *   It will eventually handle user accounts (login with Google).
    *   It manages requests for text-to-speech.
    *   It talks to the special Text-to-Speech service.
    *   It will eventually track usage, handle subscriptions, and store settings.

3.  **The Text-to-Speech (TTS) Service (Using Hugging Face):**
    *   This is a specialized cloud service that takes text and turns it into natural-sounding speech using an advanced AI voice model (Kokoro-82M).
    *   Our backend sends text here, and it sends back the audio.

## The Most Important Goal Right Now: MVP (Minimum Viable Product)

Our **first and most important goal** is to build a *basic, working version* of the extension as quickly as possible (the MVP).

**What the MVP will do:**

*   Successfully **find and extract** the main text from common websites.
*   Read the text aloud using the **browser's built-in voice**.
*   Read the text aloud using the **high-quality Kokoro voice** (via a basic backend connection).
*   **Highlight** the text being spoken (both for browser and Kokoro voices).
*   Provide a **simple floating button** on the page to Play/Pause.
*   Allow controlling the reading **speed**.
*   Allow **clicking on a sentence** to start reading from there.

**What the MVP will *NOT* include (These come LATER):**

*   User Accounts / Login
*   Usage Limits / Paid Subscriptions (Paywall)
*   Referral System (Sharing codes)
*   Gamification (Usage streaks, etc.)
*   Advanced Settings or a complex Popup UI

**Why this approach?** We want to prove that the core reading and highlighting experience works well *before* spending time building the more complex backend features like user accounts and payments. This lets us get feedback faster and make sure the most important part of the extension is solid. Once the MVP is working well, we will add the other features phase by phase. 