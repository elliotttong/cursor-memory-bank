# 10: Gamification Features

This document details the implementation of gamification features like usage streaks and sharing, using Supabase for state management and real-time updates.

## Goals

*   Encourage regular usage through a daily streak mechanism.
*   Provide visual feedback for achievements (e.g., confetti).
*   Enable users to share their usage/streaks.

## Database Schema (`gamification_state` table - see 05-backend-schema.md)

*   `user_id` (uuid, PK, FK to profiles.user_id)
*   `current_streak_days` (integer, default 0)
*   `last_active_date` (date, nullable) - Stores the date of the *last* day the user performed an action contributing to the streak (e.g., listened to TTS).
*   `show_confetti` (boolean, default false) - A flag to trigger a one-time confetti animation in the UI.
*   `updated_at` (timestamptz)

## Streak Logic

1.  **Tracking Usage:**
    *   When a user performs a significant action (e.g., initiates TTS playback via the `TTS Proxy` Edge Function), this event needs to potentially update their streak.
    *   The `add_usage` Edge Function (or a dedicated gamification function called by it/triggered by `usage_events` insert) will handle streak updates.
2.  **Updating Streak (Backend - Edge Function or DB Trigger/Function):**
    *   **Get Current State:** Fetch the user's current `gamification_state` record.
    *   **Get Current Date:** Determine the current date in UTC.
    *   **Check Last Active Date:** Compare the current date with the `last_active_date`.
        *   **If `last_active_date` is NULL or `current_date` is the day *after* `last_active_date`:**
            *   Increment `current_streak_days` by 1.
            *   Set `last_active_date` to `current_date`.
            *   Set `show_confetti` to `true` if a milestone is reached (e.g., 3 days, 7 days, 14 days, etc.).
            *   Update the `gamification_state` record.
        *   **If `current_date` is the *same* as `last_active_date`:**
            *   Do nothing (streak already counted for today).
        *   **If `current_date` is *more than one day after* `last_active_date`:**
            *   Reset `current_streak_days` to 1 (new streak starts today).
            *   Set `last_active_date` to `current_date`.
            *   Set `show_confetti` to `false`.
            *   Update the `gamification_state` record.
    *   **Implementation Choice:** This logic can reside within an Edge Function called after usage is logged, or potentially within a PostgreSQL function triggered by inserts into `usage_events` (though this might trigger too frequently; an Edge Function offers more control).

```typescript
// Conceptual Edge Function / RPC ('update_streak')

async function updateStreak(userId: string, supabaseAdmin: SupabaseClient): Promise<void> {
  const todayUTC = new Date(); // Use UTC for consistency
  todayUTC.setUTCHours(0, 0, 0, 0);
  const todayDateString = todayUTC.toISOString().split('T')[0];

  // 1. Get current state (or initialize if not exists)
  let { data: state, error: fetchError } = await supabaseAdmin
    .from('gamification_state')
    .select('current_streak_days, last_active_date')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching gamification state:", fetchError);
    return; // Or throw
  }

  let currentStreak = 0;
  let lastActiveDate: Date | null = null;
  let needsInsert = false;

  if (state) {
    currentStreak = state.current_streak_days;
    lastActiveDate = state.last_active_date ? new Date(state.last_active_date + 'T00:00:00Z') : null;
  } else {
      needsInsert = true;
  }

  let newStreak = currentStreak;
  let newLastActiveDate = todayDateString;
  let showConfetti = false;

  // 2. Calculate new streak
  if (!lastActiveDate) {
      // First time activity
      newStreak = 1;
  } else {
      const diffDays = Math.round((todayUTC.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
          // Consecutive day
          newStreak++;
      } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
      } else { // diffDays === 0
          // Same day activity - no change to streak itself, just update timestamp
          newStreak = currentStreak; // Ensure it doesn't reset if user already acted today
          newLastActiveDate = state.last_active_date; // Keep original date if same day
      }
  }

  // 3. Check for milestones (example)
  const milestones = [3, 7, 14, 30, 60, 90];
  if (milestones.includes(newStreak) && newStreak > currentStreak) { // Only trigger if streak increased to milestone
      showConfetti = true;
  }

  // 4. Upsert the state
  const { error: upsertError } = await supabaseAdmin
    .from('gamification_state')
    .upsert({
      user_id: userId,
      current_streak_days: newStreak,
      last_active_date: newLastActiveDate,
      show_confetti: showConfetti,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (upsertError) {
    console.error("Error upserting gamification state:", upsertError);
  }
}

```

## UI Updates (Real-time)

1.  **Subscribing to Changes:**
    *   The client-side (Service Worker or relevant UI components like the Popup/Settings page) subscribes to changes on the `gamification_state` table for the logged-in user using Supabase Realtime.

    ```typescript
    // In Service Worker or UI component
    const userId = '...'; // Get current user ID
    const gamificationChannel = supabase.channel(`gamification-state-${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'gamification_state', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Gamification state changed:', payload.new);
          const newState = payload.new as { current_streak_days: number, show_confetti: boolean, /* ... */ };

          // Update local state / UI elements
          updateStreakDisplay(newState.current_streak_days);

          if (newState.show_confetti) {
            triggerConfettiAnimation();
            // Reset the confetti flag in the DB after showing it
            resetConfettiFlag(userId);
          }
        }
      )
      .subscribe();

    async function resetConfettiFlag(userId: string) {
        // Call an RPC or use client to update the flag back to false
        const { error } = await supabase
            .from('gamification_state')
            .update({ show_confetti: false })
            .eq('user_id', userId);
        if(error) console.error("Error resetting confetti flag:", error);
    }

    function updateStreakDisplay(days: number) { /* ... */ }
    function triggerConfettiAnimation() { /* ... Use a library like canvas-confetti ... */ }
    ```

2.  **Displaying Streaks:**
    *   The extension popup or settings page fetches the initial `current_streak_days` on load.
    *   It updates the display whenever a change event is received via the Realtime subscription.
3.  **Triggering Confetti:**
    *   When a Realtime message arrives with `show_confetti: true`, the UI triggers a confetti animation (e.g., using a library like `canvas-confetti`).
    *   Crucially, after triggering the animation, the client **must call back to the backend** (e.g., via an RPC function `reset_confetti_flag`) to set `show_confetti` back to `false` in the database. This prevents the confetti from showing repeatedly on subsequent loads before the next milestone.

## Share Card

1.  **Trigger:** User clicks a "Share Streak" button in the UI.
2.  **Data Fetching:** The client fetches the current `current_streak_days`.
3.  **Generating Shareable Content:**
    *   **Option A (Simple Text/Link):** Generate text like "I'm on a X-day reading streak with [Your App Name]! #ReadEveryDay" and provide standard web share options (`navigator.share`) or copy-to-clipboard.
    *   **Option B (Image Generation):**
        *   Client sends streak data to a dedicated Supabase Edge Function (`generate-share-card`).
        *   Edge Function uses an image generation library (like Deno's Satori or Og_edge) or calls a third-party service to create a visually appealing image (e.g., a card showing the streak number, app logo, maybe user avatar).
        *   Function uploads the image to Supabase Storage and returns the public URL.
        *   Client uses the URL with `navigator.share` or displays the image.

## Considerations

*   **Definition of "Active Day":** Clearly define what user action counts towards maintaining a streak (e.g., minimum listening time, specific number of TTS requests).
*   **Timezones:** Perform date comparisons consistently, preferably in UTC, on the backend to avoid timezone issues.
*   **Performance:** Updating the streak on every single TTS request might be excessive. Consider batching updates or triggering the update logic less frequently (e.g., once per user session per day).
*   **Confetti Reset:** Ensure the mechanism to reset `show_confetti` is reliable to prevent annoying repeat animations. 