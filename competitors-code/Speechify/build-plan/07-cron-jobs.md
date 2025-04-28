# 07: Scheduled Backend Tasks (pg_cron)

This document outlines the scheduled tasks to be run using Supabase's `pg_cron` extension.

## Enabling pg_cron

First, ensure the `pg_cron` extension is enabled in your Supabase project's database:

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

## Scheduled Jobs

We will schedule jobs to automate routine tasks like adapter health checks and usage data rollups.

### 1. Weekly Adapter Health Check

**Purpose:** To invoke the `adapter_health` Edge Function periodically to test the validity of site-specific extraction adapters.
**Schedule:** Run once a week (e.g., Sunday at 3:00 AM UTC).
**Action:** Makes an HTTP POST request to the deployed `adapter-health` Supabase Edge Function.

```sql
-- Schedule the adapter health check function to run weekly
-- Assumes the Edge Function is deployed and accessible internally
-- NOTE: Use SELECT cron.schedule instead of direct INSERT for better safety/updates

SELECT cron.schedule(
  'weekly-adapter-check', -- Job name (must be unique)
  '0 3 * * SUN',          -- Cron schedule: At 03:00 on Sunday
  $$
  SELECT net.http_post(
    url:='<YOUR_SUPABASE_FUNCTIONS_URL>/adapter-health',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer <YOUR_SUPABASE_SERVICE_ROLE_KEY>"}', -- Securely call the function
    body:='{}'::jsonb
  );
  $$
);

-- To unschedule:
-- SELECT cron.unschedule('weekly-adapter-check');

-- To view scheduled jobs:
-- SELECT * FROM cron.job;
```

**Notes:**
*   Replace `<YOUR_SUPABASE_FUNCTIONS_URL>` with the actual base URL for your Supabase functions.
*   Replace `<YOUR_SUPABASE_SERVICE_ROLE_KEY>` with your actual service role key. **Security Consideration:** Using the service role key directly in the schedule command is common practice with `pg_cron` on Supabase as the `cron.job` table is restricted. However, ensure appropriate function-level authorization if needed, or explore calling a `SECURITY DEFINER` PostgreSQL function that then calls the HTTP endpoint.
*   The `adapter-health` function itself (defined in `06-edge-functions.md`) contains the logic to fetch adapters and test them.

### 2. Daily Usage Rollup (Optional / Alternative)

**Purpose:** Aggregate raw `usage_events` into the `monthly_usage` table daily. This is an alternative or complement to the real-time upsert logic within the `add-usage` function.
**Benefit:** Can be more resilient if the real-time upsert fails occasionally; acts as a reconciliation step.
**Schedule:** Run once daily (e.g., shortly after midnight UTC).
**Action:** Executes a SQL function or statement to aggregate data from `usage_events` for the previous day and update `monthly_usage`.

```sql
-- Example PostgreSQL function to perform daily aggregation
CREATE OR REPLACE FUNCTION public.rollup_daily_usage()
RETURNS void AS $$
DECLARE
  yesterday_start timestamptz := date_trunc('day', now() - interval '1 day');
  yesterday_end timestamptz := date_trunc('day', now()) - interval '1 second';
  month_start date := date_trunc('month', yesterday_start)::date;
BEGIN
  RAISE LOG 'Starting daily usage rollup for %', yesterday_start::date;

  INSERT INTO public.monthly_usage (user_id, month_start_date, total_characters_processed, last_updated)
  SELECT
    user_id,
    month_start,
    SUM(characters_processed) as daily_chars,
    now()
  FROM public.usage_events
  WHERE timestamp >= yesterday_start AND timestamp <= yesterday_end
    AND characters_processed > 0 -- Only include events with usage
    AND event_type = 'TTS_REQUEST' -- Only rollup TTS events
  GROUP BY user_id
  ON CONFLICT (user_id, month_start_date)
  DO UPDATE SET
    total_characters_processed = public.monthly_usage.total_characters_processed + EXCLUDED.total_characters_processed,
    last_updated = now();

  RAISE LOG 'Finished daily usage rollup.';
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
-- SECURITY DEFINER allows the function to run with creator's privileges (needed for potential cross-schema access or elevated rights if schema changes)
-- Ensure the function owner has necessary permissions on usage_events and monthly_usage.

-- Schedule the rollup function
SELECT cron.schedule(
  'daily-usage-rollup',
  '5 0 * * *', -- Cron schedule: At 00:05 UTC every day
  $$ SELECT public.rollup_daily_usage(); $$
);

-- To unschedule:
-- SELECT cron.unschedule('daily-usage-rollup');
```

**Considerations:**
*   **Real-time vs. Batch:** The `add-usage` function already attempts a real-time upsert into `monthly_usage`. This scheduled job provides a daily reconciliation. Choose one or both depending on reliability needs and tolerance for slight delays in the aggregated view.
*   **Performance:** Ensure appropriate indexes exist on `usage_events` (especially `user_id`, `timestamp`) for efficient daily aggregation.
*   **Timezones:** All scheduling uses the server's timezone (UTC by default on Supabase).

## Monitoring Cron Jobs

Monitor the execution of cron jobs using the Supabase dashboard (Database -> Cron Jobs) or by querying the `cron.job_run_details` table:

```sql
SELECT *
FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 100;
```

Check the `status` column (`succeeded`, `failed`) and investigate any failures using the logs associated with the run. 