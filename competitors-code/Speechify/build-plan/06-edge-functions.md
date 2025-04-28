# 06: Edge Function Templates (TypeScript/Deno)

This document provides initial TypeScript templates for the core Supabase Edge Functions. These serve as starting points and require integration with Supabase client libraries, Stripe SDK, error handling, and precise business logic.

**Note:** Supabase Edge Functions run on Deno. Import statements and some APIs might differ slightly from Node.js.

## 1. `add_usage`

**Purpose:** Logs TTS usage events and reports usage to Stripe for metered billing.
**Trigger:** Called internally by the `TTS Proxy` function after a successful TTS synthesis.

```typescript
// supabase/functions/add-usage/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Assuming Stripe SDK is available or using direct fetch
// import Stripe from "https://esm.sh/stripe@^14";

interface UsageData {
  userId: string;
  charactersProcessed: number;
  durationSeconds?: number;
  voiceIdUsed?: string;
  modelUsed?: string;
  source?: string;
  stripeSubscriptionItemId?: string; // Required for Stripe usage reporting
}

// Initialize Stripe (use environment variables for keys)
// const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
//   httpClient: Stripe.createFetchHttpClient(),
//   apiVersion: "2023-10-16", // Use a fixed API version
// });

serve(async (req) => {
  // 1. Validate request (e.g., check if called internally or via authorized service role)
  // For simplicity, assuming valid internal call with correct JSON body
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let usageData: UsageData;
  try {
    usageData = await req.json();
    if (!usageData.userId || usageData.charactersProcessed == null) {
      throw new Error("Missing required fields");
    }
  } catch (error) {
    console.error("Invalid usage data:", error);
    return new Response(JSON.stringify({ error: "Bad Request", detail: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Initialize Supabase Admin Client (use env vars)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 3. Insert into usage_events table
  const { error: insertError } = await supabaseAdmin
    .from("usage_events")
    .insert({
      user_id: usageData.userId,
      characters_processed: usageData.charactersProcessed,
      duration_seconds: usageData.durationSeconds,
      voice_id_used: usageData.voiceIdUsed,
      model_used: usageData.modelUsed,
      source: usageData.source,
      event_type: "TTS_REQUEST",
    });

  if (insertError) {
    console.error("Error inserting usage event:", insertError);
    // Decide if this is a critical error; maybe still try reporting to Stripe?
  }

  // 4. Update monthly_usage table (Upsert)
  const currentMonthStart = new Date();
  currentMonthStart.setUTCDate(1);
  currentMonthStart.setUTCHours(0, 0, 0, 0);
  const monthStartDateString = currentMonthStart.toISOString().split('T')[0];

  const { error: upsertError } = await supabaseAdmin.rpc(
    'upsert_monthly_usage', // Assumes a Postgres function for robust upsert
    {
        p_user_id: usageData.userId,
        p_month_start_date: monthStartDateString,
        p_chars_to_add: usageData.charactersProcessed
    }
  );

  if (upsertError) {
      console.error("Error upserting monthly usage:", upsertError);
  }

  // 5. Report usage to Stripe (if applicable)
  if (usageData.stripeSubscriptionItemId && usageData.charactersProcessed > 0) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      // Replace with actual Stripe SDK call if available
      // await stripe.subscriptionItems.createUsageRecord(
      //   usageData.stripeSubscriptionItemId,
      //   {
      //     quantity: usageData.charactersProcessed,
      //     timestamp: timestamp,
      //     action: 'increment',
      //   }
      // );

      // Temporary placeholder using fetch
      const stripeUsageUrl = `https://api.stripe.com/v1/subscription_items/${usageData.stripeSubscriptionItemId}/usage_records`;
      const stripeResp = await fetch(stripeUsageUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `quantity=${usageData.charactersProcessed}&timestamp=${timestamp}&action=increment`,
      });

      if (!stripeResp.ok) {
        const stripeError = await stripeResp.json();
        throw new Error(`Stripe API Error: ${JSON.stringify(stripeError)}`);
      }
       console.log(`Reported ${usageData.charactersProcessed} chars to Stripe item ${usageData.stripeSubscriptionItemId}`);

    } catch (error) {
      console.error("Error reporting usage to Stripe:", error);
      // Add monitoring/alerting here - failed usage reporting is critical for billing.
    }
  }

  // 6. Return success
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

/* Required PostgreSQL Function for Upserting Monthly Usage:
CREATE OR REPLACE FUNCTION upsert_monthly_usage(p_user_id uuid, p_month_start_date date, p_chars_to_add bigint)
RETURNS void AS $$
BEGIN
  INSERT INTO public.monthly_usage (user_id, month_start_date, total_characters_processed, last_updated)
  VALUES (p_user_id, p_month_start_date, p_chars_to_add, now())
  ON CONFLICT (user_id, month_start_date)
  DO UPDATE SET
    total_characters_processed = public.monthly_usage.total_characters_processed + EXCLUDED.total_characters_processed,
    last_updated = now();
END;
$$ LANGUAGE plpgsql;
*/
```

---

## 2. `stripe_webhook`

**Purpose:** Handles incoming webhooks from Stripe to update subscription statuses.
**Trigger:** External POST request from Stripe.

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Assuming Stripe SDK is available
// import Stripe from "https://esm.sh/stripe@^14";

// Initialize Stripe (use environment variables)
// const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { ... });
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!;

// Helper to map Stripe status to our DB status
const getSubscriptionStatus = (stripeStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'past_due', // Or a different status
    incomplete: 'incomplete',
    incomplete_expired: 'canceled',
  };
  return statusMap[stripeStatus] || 'canceled'; // Default to canceled
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text(); // Read raw body for signature verification

  let event;
  try {
    // Verify webhook signature using Stripe SDK (or manual verification)
    // event = stripe.webhooks.constructEvent(body, signature!, stripeWebhookSecret);

    // Manual verification placeholder (less secure, prefer SDK)
    if (!signature) throw new Error("Missing Stripe signature");
    // TODO: Implement proper manual signature verification if SDK is unavailable
    console.warn("Skipping Stripe signature verification - IMPLEMENT PROPERLY!");
    event = JSON.parse(body);

  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Initialize Supabase Admin Client
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let subscription;
  let status;

  // Handle the event type
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': // Represents cancellation
      subscription = event.data.object;
      status = getSubscriptionStatus(subscription.status);
      console.log(`Handling subscription ${subscription.id}, status: ${status}`);

      const { error: updateError } = await supabaseAdmin
        .from("subscriptions")
        .update({
          status: status,
          plan_id: subscription.items.data[0].price.lookup_key || subscription.items.data[0].price.product, // Assumes lookup_key or product ID maps to our plan_id
          stripe_subscription_id: subscription.id,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        })
        .eq("stripe_subscription_id", subscription.id);

      if (updateError) {
        console.error(`Error updating subscription ${subscription.id}:`, updateError);
        return new Response("Database update failed", { status: 500 });
      }
      break;

    case 'invoice.payment_failed':
      subscription = event.data.object;
      console.log(`Handling payment failure for subscription ${subscription.subscription}`);
      // Update status to past_due if relevant
      const { error: paymentFailedError } = await supabaseAdmin
        .from("subscriptions")
        .update({ status: 'past_due' })
        .eq("stripe_subscription_id", subscription.subscription); // Note: invoice object contains subscription ID

        if (paymentFailedError) {
            console.error(`Error updating subscription ${subscription.subscription} to past_due:`, paymentFailedError);
            return new Response("Database update failed", { status: 500 });
        }
      break;

    case 'invoice.payment_succeeded':
       subscription = event.data.object;
       console.log(`Handling successful payment for subscription ${subscription.subscription}`);
       // Ensure status is active
       const { error: paymentSuccessError } = await supabaseAdmin
         .from("subscriptions")
         .update({ status: 'active' })
         .eq("stripe_subscription_id", subscription.subscription)
         .neq("status", "trialing"); // Avoid overriding trialing status on first invoice

        if (paymentSuccessError) {
            console.error(`Error updating subscription ${subscription.subscription} to active:`, paymentSuccessError);
            // Non-critical error usually
        }
       break;

    // Add other event types as needed (e.g., checkout.session.completed)

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

```

---

## 3. `adapter_health`

**Purpose:** Periodically tests site-specific adapters.
**Trigger:** Scheduled via pg_cron.

```typescript
// supabase/functions/adapter-health/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Basic fetch function (consider adding retries, more robust error handling)
async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        // Mimic a browser user agent if necessary
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow", // Follow redirects
    });
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: Status ${response.status}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

// Dummy function to simulate running CSS selectors (cheerio-wasm or similar needed for real DOM parsing)
// In a real scenario, this might call another function/service or use a WASM parser.
function checkSelector(html: string, selector: string): boolean {
  // THIS IS A PLACEHOLDER - Requires actual DOM parsing library
  console.warn("checkSelector is a placeholder and does not parse HTML");
  return html.includes(selector.split(' ')[0].replace(/^[.#]/,'')); // Very basic check
}

serve(async (_req) => {
  console.log("Running Adapter Health Check...");

  // 1. Initialize Supabase Admin Client
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 2. Fetch active site adapters
  const { data: adapters, error: fetchError } = await supabaseAdmin
    .from("site_adapters") // Assuming table name from 02-extension-adapters.md
    .select("id, domain_pattern, adapter_type, content_selector, custom_script")
    .eq("is_active", true);

  if (fetchError) {
    console.error("Error fetching adapters:", fetchError);
    return new Response("Failed to fetch adapters", { status: 500 });
  }

  if (!adapters || adapters.length === 0) {
    console.log("No active adapters found to check.");
    return new Response(JSON.stringify({ message: "No active adapters" }), {
       status: 200,
       headers: { "Content-Type": "application/json" },
    });
  }

  const results = [];

  // 3. Iterate and test each adapter
  for (const adapter of adapters) {
    // Construct a sample URL (heuristic, needs improvement)
    const sampleUrl = `https://${adapter.domain_pattern.replace('*.', 'www.')}`;
    console.log(`Checking adapter for ${adapter.domain_pattern} using URL: ${sampleUrl}`);

    let isHealthy = false;
    let checkDetails = "";

    const html = await fetchHtml(sampleUrl);

    if (html) {
      if (adapter.adapter_type === 'selector' && adapter.content_selector) {
          // Use a DOM parsing library here (e.g., linkedom, cheerio-wasm)
          // isHealthy = parseHtmlAndCheckSelector(html, adapter.content_selector);
          isHealthy = checkSelector(html, adapter.content_selector); // Placeholder
          checkDetails = `Checked selector: ${adapter.content_selector}`;
      } else if (adapter.adapter_type === 'function' && adapter.custom_script) {
          // Requires a more complex setup to execute custom JS securely
          checkDetails = "Function adapter check not implemented";
          console.warn("Function adapter check requires secure execution environment.");
          // isHealthy = false; // Mark as unhealthy until implemented
          isHealthy = true; // TEMP: Assume healthy
      } else {
           checkDetails = "Invalid adapter type or missing data";
           isHealthy = false;
      }
    } else {
      checkDetails = `Failed to fetch sample URL: ${sampleUrl}`;
      isHealthy = false;
    }

    results.push({ id: adapter.id, domain: adapter.domain_pattern, healthy: isHealthy, details: checkDetails });

    // 4. Update adapter status in DB (optional - could just log)
    const { error: updateError } = await supabaseAdmin
      .from("site_adapters")
      .update({ last_checked: new Date().toISOString(), is_healthy: isHealthy }) // Add is_healthy column? Or just log?
      .eq("id", adapter.id);

    if (updateError) {
        console.error(`Failed to update adapter ${adapter.id}:`, updateError);
    }

    // Add alerting mechanism here if !isHealthy (e.g., send notification)
    if (!isHealthy) {
        console.warn(`Adapter unhealthy: ${adapter.domain_pattern} - ${checkDetails}`);
        // TODO: Send alert (e.g., to Slack, email)
    }
  }

  console.log("Adapter Health Check Complete.", results);

  // 5. Return summary
  return new Response(JSON.stringify({ message: "Check complete", results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

``` 