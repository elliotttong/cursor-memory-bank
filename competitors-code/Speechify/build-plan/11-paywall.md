# 11: Paywall and Subscription Plans

This document defines the subscription tiers, usage limits, and interaction with Stripe for billing.

## Subscription Tiers

We will offer a simple tiered structure:

1.  **Free Tier:**
    *   **Target:** New users, occasional users.
    *   **Features:** Access to core TTS functionality, standard browser fallback voices, possibly limited selection of Kokoro voices.
    *   **Limits:** Strict monthly character limit (e.g., 10,000 characters).
    *   **Price:** Free.
    *   `plans.id`: `free`
2.  **Premium Tier:**
    *   **Target:** Regular users, users wanting highest quality voices.
    *   **Features:** All free features, full access to all available Kokoro voices, higher character limits, priority support (future).
    *   **Limits:** Generous monthly character limit (e.g., 500,000 characters) or potentially unlimited (TBD based on cost analysis).
    *   **Price:** Monthly or Annual subscription fee.
    *   `plans.id`: `premium_monthly`, `premium_yearly`
    *   **Stripe Price IDs:** Corresponding Price IDs from Stripe (e.g., `price_abc...`, `price_xyz...`).

## Database Representation (`plans` table - see 05-backend-schema.md)

This table stores the definition of each plan:

| `id`              | `name`            | `description`                           | `monthly_char_limit` | `stripe_price_id` | `is_active` |
| :---------------- | :---------------- | :-------------------------------------- | :------------------- | :---------------- | :---------- |
| `free`            | Free              | Basic TTS, limited voices & usage       | 10000                | `null`            | `true`      |
| `premium_monthly` | Premium (Monthly) | All voices, high usage limit (monthly)  | 500000               | `price_...`       | `true`      |
| `premium_yearly`  | Premium (Yearly)  | All voices, high usage limit (annually) | 500000               | `price_...`       | `true`      |

*   `monthly_char_limit`: NULL could represent unlimited, but setting a high number might be better for consistency.
*   The `stripe_price_id` links the plan to a specific price object in Stripe.

## Usage Metering and Enforcement

1.  **Tracking:** Every TTS request logs `characters_processed` in the `usage_events` table (handled by `add_usage` function).
2.  **Aggregation:** The `monthly_usage` table stores the `total_characters_processed` for each user per billing month (updated in near real-time by `add_usage` and potentially reconciled by `daily-usage-rollup` cron job).
3.  **Checking Limits (Backend - `TTS Proxy` Edge Function):**
    *   Before calling the HF Inference Endpoint, the `TTS Proxy` function must check the user's usage against their plan limits.
    *   **Fetch User's Plan & Usage:**
        *   Get the `user_id` from the verified JWT.
        *   Query `subscriptions` table to get the user's current `plan_id` and `status` (must be 'active' or 'trialing').
        *   Query `plans` table using `plan_id` to get the `monthly_char_limit`.
        *   Query `monthly_usage` table for the current month's `total_characters_processed`.
    *   **Calculate Remaining Quota:** `remaining = monthly_char_limit - total_characters_processed`.
    *   **Enforce Limit:**
        *   If `plan.monthly_char_limit` is NULL (unlimited), allow the request.
        *   If `remaining >= requested_characters`, allow the request.
        *   If `remaining < requested_characters`, **reject** the request with an appropriate error (e.g., 429 Too Many Requests or 402 Payment Required) and a message indicating the limit has been reached.

```typescript
// Conceptual check within TTS Proxy Edge Function

async function checkUsageLimits(userId: string, requestedChars: number, supabaseClient: SupabaseClient): Promise<{ allowed: boolean; message: string; stripeSubscriptionItemId?: string }> {

  // 1. Get user's active/trialing subscription and plan details
  const { data: subData, error: subError } = await supabaseClient
    .from('subscriptions')
    .select(`
      plan_id,
      status,
      stripe_subscription_id, 
      plans ( id, monthly_char_limit, stripe_price_id )
    `)
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single();

  if (subError || !subData) {
    console.error("Error fetching subscription or no active/trialing sub:", subError);
    // Fallback to check if a basic 'free' plan exists if no subscription found?
    // For now, deny if no valid subscription.
    return { allowed: false, message: "No active subscription found." };
  }

  const plan = subData.plans;
  if (!plan) {
      return { allowed: false, message: "Plan details not found for subscription." };
  }

  // 2. Check if plan has limits
  if (plan.monthly_char_limit === null || plan.monthly_char_limit === undefined) {
    // Unlimited plan
    return { allowed: true, message: "Unlimited plan.", stripeSubscriptionItemId: getStripeItemId(subData) };
  }

  // 3. Get current monthly usage
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const monthStartDateString = monthStart.toISOString().split('T')[0];

  const { data: usageData, error: usageError } = await supabaseClient
    .from('monthly_usage')
    .select('total_characters_processed')
    .eq('user_id', userId)
    .eq('month_start_date', monthStartDateString)
    .single();

  if (usageError && usageError.code !== 'PGRST116') { // PGRST116 = row not found
    console.error("Error fetching monthly usage:", usageError);
    return { allowed: false, message: "Error checking usage limits." };
  }

  const currentUsage = usageData?.total_characters_processed || 0;
  const remaining = plan.monthly_char_limit - currentUsage;

  // 4. Enforce limit
  if (remaining >= requestedChars) {
    return { allowed: true, message: `Usage allowed. Remaining: ${remaining - requestedChars}`, stripeSubscriptionItemId: getStripeItemId(subData) };
  } else {
    return { allowed: false, message: `Monthly limit of ${plan.monthly_char_limit} characters exceeded. Remaining: ${remaining}.` };
  }
}

// Helper to extract the correct Stripe Item ID for usage reporting
// (Implementation depends on Stripe subscription structure)
function getStripeItemId(subscriptionData: any): string | undefined {
    // Find the item ID associated with the metered price
    // This logic depends on how you structure Stripe Products/Prices/Subscriptions
    // return subscriptionData?.items?.data?.find(item => item.price.id === subscriptionData.plans.stripe_price_id)?.id;
    // Placeholder - ASSUMES first item is the metered one
    return subscriptionData?.stripe_subscription_id ? `si_${subscriptionData.stripe_subscription_id.substring(4)}` : undefined; // This is likely WRONG, need actual item ID
}

```

## Stripe Integration

*   **Products & Prices:** Define Products (Free, Premium) and corresponding Prices (Monthly, Yearly recurring; potentially metered usage prices) in your Stripe Dashboard.
*   **Stripe Price ID:** Store the Stripe Price ID (`price_...`) in the `plans` table.
*   **Checkout:** Use Stripe Checkout hosted pages or integrate Stripe Elements in the extension's settings page to handle new subscriptions.
    *   Pass the `user_id` in `client_reference_id` or `metadata` during Checkout Session creation to link the Stripe Customer/Subscription back to the Supabase user.
*   **Webhooks:** The `stripe_webhook` Edge Function (see `06-edge-functions.md`) listens for events like `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed` to keep the `subscriptions` table in sync with Stripe.
*   **Metered Billing:** For plans with limits that map to Stripe's metered billing, the `add_usage` Edge Function reports usage increments to the corresponding Stripe Subscription Item ID using `stripe.subscriptionItems.createUsageRecord`. The `stripeSubscriptionItemId` needs to be retrieved and passed to the `add_usage` function, likely fetched during the initial usage check.

## Upgrade/Downgrade Flow

1.  User initiates plan change in settings.
2.  Frontend calls a backend function (e.g., `update-subscription` Edge Function).
3.  Backend function uses the Stripe API to:
    *   Retrieve the Stripe Customer ID associated with the user.
    *   Retrieve the current Stripe Subscription ID.
    *   Update the subscription items, swapping the old Price ID for the new one (`stripe.subscriptions.update`). Stripe handles proration based on settings.
4.  The `stripe_webhook` function receives the `customer.subscription.updated` event and updates the `subscriptions` table in Supabase accordingly.

## Considerations

*   **Stripe Item ID for Usage:** Correctly identifying the `subscription_item_id` associated with the metered price is crucial for accurate usage reporting.
*   **Race Conditions:** Ensure the usage check and the usage logging (`add_usage`) are atomic or handle potential race conditions, especially around the monthly limit boundary.
*   **Clarity:** Clearly communicate usage limits and remaining quota to users in the extension UI.
*   **Grace Periods:** Decide how to handle users slightly exceeding limits or during payment failures (e.g., allow completion of current request, brief grace period). 