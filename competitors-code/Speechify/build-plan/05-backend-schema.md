# 05: Backend Database Schema (Supabase/Postgres)

This document defines the initial Postgres schema for storing user data, usage, and application configuration within Supabase.

## Schema Diagram (Conceptual)

```mermaid
erDiagram
    USERS ||--o{ PROFILES : "has"
    PROFILES ||--|{ SUBSCRIPTIONS : "manages"
    PROFILES ||--o{ USAGE_EVENTS : "generates"
    PROFILES ||--o{ MONTHLY_USAGE : "aggregates to"
    PROFILES ||--o{ REFERRALS : "initiates"
    PROFILES ||--o{ REFERRALS : "accepts"
    PROFILES ||--o{ GAMIFICATION_STATE : "has"
    SUBSCRIPTIONS ||--|{ PLANS : "references"

    USERS {
        UUID id PK "References auth.users(id)"
        timestamptz created_at
        string email
        json raw_app_metadata
    }

    PROFILES {
        UUID user_id PK FK "References USERS(id)"
        text display_name
        text avatar_url
        text preferred_voice_id
        float preferred_speed "Default 1.0"
        UUID subscription_id FK "References SUBSCRIPTIONS(id)"
        timestamptz created_at
        timestamptz updated_at
    }

    PLANS {
        text id PK "e.g., free, premium_monthly"
        text name
        text description
        integer monthly_char_limit "Null for unlimited"
        text stripe_price_id
        boolean is_active
    }

    SUBSCRIPTIONS {
        UUID id PK "default gen_random_uuid()"
        UUID user_id FK "References PROFILES(user_id)"
        text plan_id FK "References PLANS(id)"
        text status "e.g., active, trialing, past_due, canceled"
        text stripe_subscription_id UK
        timestamptz current_period_start
        timestamptz current_period_end
        timestamptz trial_start
        timestamptz trial_end
        timestamptz canceled_at
        timestamptz created_at
        timestamptz updated_at
    }

    USAGE_EVENTS {
        UUID id PK "default gen_random_uuid()"
        UUID user_id FK "References PROFILES(user_id)"
        timestamptz timestamp
        text event_type "e.g., TTS_REQUEST, REFERRAL_CONVERSION"
        integer characters_processed
        float duration_seconds
        text voice_id_used
        text model_used "e.g., kokoro-82m, browser_fallback"
        text source "e.g., wikipedia.org, nytimes.com"
        json metadata "Optional details"
    }

    MONTHLY_USAGE {
        UUID user_id PK FK "References PROFILES(user_id)"
        date month_start_date PK
        bigint total_characters_processed
        bigint characters_remaining "Calculated based on plan limit - total"
        timestamptz last_updated
    }

    REFERRALS {
        UUID id PK "default gen_random_uuid()"
        UUID referrer_user_id FK "References PROFILES(user_id)"
        UUID referee_user_id FK "References PROFILES(user_id), nullable"
        text referral_code UK
        timestamptz generated_at
        timestamptz accepted_at
        text status "e.g., pending, accepted, expired"
    }

    GAMIFICATION_STATE {
        UUID user_id PK FK "References PROFILES(user_id)"
        integer current_streak_days
        date last_active_date
        boolean show_confetti "Trigger for UI"
        timestamptz updated_at
    }

```

## Table Definitions (SQL)

```sql
-- Extension to use UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles (linked to Supabase Auth users)
CREATE TABLE public.profiles (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  preferred_voice_id text, -- Could reference a voices table later
  preferred_speed real DEFAULT 1.0 CHECK (preferred_speed > 0 AND preferred_speed <= 4.0),
  subscription_id uuid, -- Nullable initially, references subscriptions table
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Plans
CREATE TABLE public.plans (
  id text PRIMARY KEY, -- e.g., 'free', 'premium_monthly', 'premium_yearly'
  name text NOT NULL,
  description text,
  monthly_char_limit integer, -- NULL for unlimited
  stripe_price_id text UNIQUE, -- Required for paid plans
  is_active boolean DEFAULT true NOT NULL
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
-- Note: Populate this table manually or via seeding.
-- RLS: Allow authenticated users to read active plans.
CREATE POLICY "Allow authenticated read access to active plans" ON public.plans FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Subscriptions (linking users to plans)
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  plan_id text NOT NULL REFERENCES public.plans(id),
  status text NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
  stripe_subscription_id text UNIQUE, -- Nullable for free plans or during creation
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
-- Add foreign key constraint from profiles to subscriptions AFTER subscriptions table is created
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_subscription FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE SET NULL;

-- Usage Events (Raw log of character processing)
CREATE TABLE public.usage_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now() NOT NULL,
  event_type text DEFAULT 'TTS_REQUEST' NOT NULL, -- e.g., TTS_REQUEST, REFERRAL_CONVERSION
  characters_processed integer CHECK (characters_processed >= 0),
  duration_seconds real,
  voice_id_used text,
  model_used text, -- e.g., 'kokoro-82m', 'browser_fallback'
  source text, -- e.g., domain name like 'wikipedia.org'
  metadata jsonb -- Store extra details if needed
);
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_usage_events_user_timestamp ON public.usage_events(user_id, timestamp DESC);

-- Monthly Usage Aggregation
CREATE TABLE public.monthly_usage (
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  month_start_date date NOT NULL,
  total_characters_processed bigint DEFAULT 0 NOT NULL CHECK (total_characters_processed >= 0),
  -- characters_remaining can be calculated via a view or function
  last_updated timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, month_start_date)
);
ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;

-- Referrals
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  referee_user_id uuid UNIQUE REFERENCES public.profiles(user_id) ON DELETE SET NULL, -- One user can only be referred once
  referral_code text UNIQUE NOT NULL,
  generated_at timestamptz DEFAULT now() NOT NULL,
  accepted_at timestamptz,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'accepted', 'expired'))
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);

-- Gamification State
CREATE TABLE public.gamification_state (
    user_id uuid PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    current_streak_days integer DEFAULT 0 NOT NULL CHECK (current_streak_days >= 0),
    last_active_date date, -- Date of last recorded usage contributing to streak
    show_confetti boolean DEFAULT false NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.gamification_state ENABLE ROW LEVEL SECURITY;

-- Add indexes for foreign keys for performance
CREATE INDEX idx_profiles_subscription_id ON public.profiles(subscription_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_monthly_usage_user_id ON public.monthly_usage(user_id);
CREATE INDEX idx_referrals_referee_user_id ON public.referrals(referee_user_id);

-- Function to update `updated_at` columns automatically
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update `updated_at`
CREATE TRIGGER set_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

CREATE TRIGGER set_subscriptions_timestamp
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

CREATE TRIGGER set_gamification_timestamp
BEFORE UPDATE ON public.gamification_state
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Add trigger for monthly_usage last_updated (could also be done in upsert logic)
CREATE TRIGGER set_monthly_usage_timestamp
BEFORE UPDATE ON public.monthly_usage
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

```

## Row Level Security (RLS) Policies (Initial Examples)

RLS is crucial for protecting user data.

```sql
-- PROFILES Table
-- Users can view their own profile.
CREATE POLICY "Allow individual user read access" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
-- Users can update their own profile.
CREATE POLICY "Allow individual user update access" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- SUBSCRIPTIONS Table
-- Users can view their own subscription.
CREATE POLICY "Allow individual user read access" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
-- Note: Updates to subscriptions should likely be handled by backend functions (e.g., Stripe webhook) or specific privileged roles, not directly by users.

-- USAGE_EVENTS Table
-- Users can view their own usage events.
CREATE POLICY "Allow individual user read access" ON public.usage_events
  FOR SELECT USING (auth.uid() = user_id);
-- Allow Edge Functions (service_role) to insert usage events.
CREATE POLICY "Allow service role insert access" ON public.usage_events
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- MONTHLY_USAGE Table
-- Users can view their own monthly usage.
CREATE POLICY "Allow individual user read access" ON public.monthly_usage
  FOR SELECT USING (auth.uid() = user_id);
-- Allow Edge Functions (service_role) to insert/update usage.
CREATE POLICY "Allow service role insert/update access" ON public.monthly_usage
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- REFERRALS Table
-- Users can view referrals they initiated.
CREATE POLICY "Allow referrer read access" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_user_id);
-- Users can view a referral they accepted (if logged in).
CREATE POLICY "Allow referee read access" ON public.referrals
  FOR SELECT USING (auth.uid() = referee_user_id);
-- Allow creating referrals if authenticated.
CREATE POLICY "Allow authenticated user insert access" ON public.referrals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = referrer_user_id);
-- Allow Edge Functions (service_role) to update status (e.g., mark as accepted).
CREATE POLICY "Allow service role update access" ON public.referrals
  FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- GAMIFICATION_STATE Table
-- Users can view their own gamification state.
CREATE POLICY "Allow individual user read access" ON public.gamification_state
  FOR SELECT USING (auth.uid() = user_id);
-- Allow Edge Functions (service_role) or triggers to update state.
CREATE POLICY "Allow service role update access" ON public.gamification_state
  FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

```

**Note:** These RLS policies are foundational. More specific policies, especially around updates and deletions, will be needed. Access for specific backend functions might use `SECURITY DEFINER` functions or specific service roles for finer control beyond the basic `service_role`.
