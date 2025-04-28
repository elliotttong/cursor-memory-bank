# 09: Referral System Logic

This document outlines the logic for the user referral system, leveraging Supabase for data storage and real-time updates.

## Goals

*   Allow existing users (referrers) to generate a unique referral code.
*   Allow new users (referees) to sign up using a referral code.
*   Reward both the referrer and the referee upon successful referral (e.g., free usage credits, extended trial, feature unlock - TBD).
*   Track referral status.

## Database Schema (`referrals` table - see 05-backend-schema.md)

*   `id` (uuid, PK)
*   `referrer_user_id` (uuid, FK to profiles.user_id)
*   `referee_user_id` (uuid, FK to profiles.user_id, nullable, unique) - Ensures a user can only be referred once.
*   `referral_code` (text, unique) - The code shared by the referrer.
*   `generated_at` (timestamptz)
*   `accepted_at` (timestamptz, nullable) - When the referee successfully signs up or applies the code.
*   `status` (text: 'pending', 'accepted', 'expired')

## Referral Code Generation

1.  **Trigger:** An authenticated user requests their referral code (e.g., via the Settings page).
2.  **Action (Backend - Edge Function or RPC):**
    *   Check if the user (`referrer_user_id`) already has an *active* referral code in the `referrals` table where `referee_user_id` IS NULL and `status` = 'pending'.
    *   **If Yes:** Return the existing `referral_code`.
    *   **If No:**
        *   Generate a unique, human-readable code (e.g., `HAPPY-READ-123`). Use a library or algorithm to generate codes and check for collisions against the `referral_code` column until a unique one is found.
        *   Insert a new row into the `referrals` table:
            *   `referrer_user_id`: Current user's ID.
            *   `referee_user_id`: NULL
            *   `referral_code`: The newly generated unique code.
            *   `status`: 'pending'
        *   Return the newly generated `referral_code` to the user.

```typescript
// Conceptual Edge Function / RPC ('generate_referral_code')

async function generateReferralCode(userId: string, supabaseClient: SupabaseClient): Promise<string> {
  // 1. Check for existing pending code for this user
  const { data: existing, error: fetchError } = await supabaseClient
    .from('referrals')
    .select('referral_code')
    .eq('referrer_user_id', userId)
    .is('referee_user_id', null)
    .eq('status', 'pending')
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existing) return existing.referral_code;

  // 2. Generate unique code (implement robust generation + collision check)
  let newCode = '';
  let collision = true;
  while (collision) {
    newCode = generateReadableCode(12); // Implement this helper
    const { data: check, error: checkError } = await supabaseClient
      .from('referrals')
      .select('referral_code')
      .eq('referral_code', newCode)
      .maybeSingle();
    if (checkError) throw checkError;
    if (!check) collision = false;
  }

  // 3. Insert new referral record
  const { error: insertError } = await supabaseClient
    .from('referrals')
    .insert({
      referrer_user_id: userId,
      referral_code: newCode,
      status: 'pending',
    });

  if (insertError) throw insertError;

  return newCode;
}

function generateReadableCode(length: number): string {
    // Simple example - use a better library like nanoid or custom logic
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.match(/.{1,4}/g)?.join('-') || result; // Add dashes
}

```

## Referral Code Application / Acceptance

**Scenario 1: Applied During Sign-up**

1.  **Trigger:** New user signs up (e.g., via Google Sign-In) and provides a referral code in the onboarding flow.
2.  **Action (Backend - Trigger on `auth.users` insert OR dedicated Edge Function):**
    *   After the new user is created in `auth.users` and potentially their `profiles` row is initialized, a trigger or function receives the `new_user_id` and the `referral_code`.
    *   Validate the `referral_code`: Find the row in `referrals` matching the code where `status` = 'pending' and `referee_user_id` IS NULL.
    *   **If Valid Code Found:**
        *   Check that `referrer_user_id` is not the same as `new_user_id` (users cannot refer themselves).
        *   Update the `referrals` row:
            *   Set `referee_user_id` = `new_user_id`.
            *   Set `status` = 'accepted'.
            *   Set `accepted_at` = `now()`.
        *   **Apply Rewards:** Trigger logic to grant rewards (e.g., call another function, update usage credits/plan status in `profiles` or `subscriptions` table) for both `referrer_user_id` and `referee_user_id`.
        *   Send real-time notifications (see below).
    *   **If Invalid Code:** Log the attempt, inform the user the code is invalid/expired/used.

**Scenario 2: Applied After Sign-up (Less Common)**

*   If allowed, a user could enter a code via settings.
*   Logic is similar, but needs to ensure the user hasn't already been referred (`referee_user_id` UNIQUE constraint helps) and potentially apply time limits (e.g., must apply within 7 days of sign-up).

## Real-time Notifications (Supabase Realtime)

1.  **Referrer Notification:**
    *   When a referral status changes to 'accepted', use a database trigger or the Edge Function processing the acceptance to send a real-time message.
    *   **Channel:** Subscribe the referrer user to a private channel (e.g., `private:user_${referrer_user_id}`).
    *   **Payload:** `{"type": "referral_accepted", "referee_name": "New User Name", "reward": "+5000 chars"}`.
    *   **Client Action:** The referrer's extension listens on their private channel and shows a notification (e.g., toast message).
2.  **Referee Notification:**
    *   Similarly, notify the referee about their reward upon successful code application.

```sql
-- Example Trigger Function (Conceptual) to notify referrer
CREATE OR REPLACE FUNCTION handle_referral_acceptance()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Check if status changed to 'accepted'
  IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
    -- Construct the notification payload
    payload := jsonb_build_object(
      'type', 'referral_accepted',
      'reward_applied', 'Your reward details here' -- Add actual reward info
      -- Optionally fetch referee display name if needed
    );

    -- Send notification to the referrer
    PERFORM pg_notify('supabase_realtime', json_build_object(
        'schema', 'public',
        'table', 'profiles', -- Or a dedicated notification table
        'type', 'INSERT', -- Use INSERT type for pg_notify with payload
        'commit_timestamp', now(),
        'record', jsonb_build_object('user_id', NEW.referrer_user_id), -- Target user
        'old_record', null,
        'columns', ARRAY[]::text[],
        'errors', null,
        'payload', payload -- Custom payload
    )::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to the referrals table
CREATE TRIGGER referral_accepted_trigger
AFTER UPDATE ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION handle_referral_acceptance();

```

**Client-Side Realtime Subscription:**

```typescript
// In Service Worker or relevant UI component
const userId = (await supabase.auth.getUser()).data.user?.id;
if (userId) {
  const channel = supabase.channel(`private:user_${userId}`);

  channel
    .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' }, // Listen broadly or define specific notification table
        (payload) => {
            // Check for custom payload type
            if (payload.new?.payload?.type === 'referral_accepted') {
                console.log('Referral accepted!', payload.new.payload);
                // Show notification to user
                chrome.notifications.create(...);
            }
        }
     )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed to user channel!');
      }
    });
}
```

## Considerations

*   **Reward Logic:** Define the specific rewards and implement the logic to apply them (updating character limits, extending trials, modifying subscription status). This might involve complex interactions with the `subscriptions` table and potentially Stripe.
*   **Code Uniqueness:** Ensure the referral code generation handles potential collisions robustly.
*   **Expiration:** Consider adding an expiration duration to pending referrals.
*   **Fraud Prevention:** Implement basic checks (e.g., prevent self-referral). More advanced checks might involve IP tracking or usage pattern analysis if abuse becomes an issue.
*   **UI:** Provide clear UI for users to find their code, share it, and enter a code during onboarding. 