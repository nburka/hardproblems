-- Job-alert subscriptions. Paste into the Supabase SQL editor once,
-- then wire the app up with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
--
-- Three tables:
--   alert_subscribers — one row per email address / subscription
--   alert_sent        — dedupe log so we never re-send the same job
--   alert_bounces     — bounce / complaint webhook events from Resend

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Subscribers
-- ---------------------------------------------------------------------------

do $$
begin
  create type alert_status as enum ('pending', 'active', 'unsubscribed');
exception
  when duplicate_object then null;
end $$;

create table if not exists alert_subscribers (
  id                uuid primary key default uuid_generate_v4(),
  email             text not null,
  -- Case-insensitive uniqueness key. Generated column so we can index it.
  email_lower       text generated always as (lower(email)) stored,
  status            alert_status not null default 'pending',
  -- Serialized filter state — mirrors the URL params on /jobs.
  filters           jsonb not null default '{}'::jsonb,
  -- 32-byte URL-safe tokens for confirm + one-click unsubscribe links.
  confirm_token     text unique,
  unsubscribe_token text not null unique,
  confirmed_at      timestamptz,
  unsubscribed_at   timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  last_digest_at    timestamptz,
  -- Rough anti-abuse — record the requesting IP at signup time.
  signup_ip         inet
);

-- Only one live subscription per email at a time. Unsubscribed rows
-- stay in the table (for audit / re-subscribe grace) but don't block
-- a fresh pending or active row.
create unique index if not exists alert_subscribers_email_live_uniq
  on alert_subscribers (email_lower)
  where status <> 'unsubscribed';

create index if not exists alert_subscribers_status_idx
  on alert_subscribers (status);

create index if not exists alert_subscribers_last_digest_idx
  on alert_subscribers (last_digest_at)
  where status = 'active';

-- Auto-update updated_at on any row change.
create or replace function alert_touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists alert_subscribers_touch on alert_subscribers;
create trigger alert_subscribers_touch
  before update on alert_subscribers
  for each row
  execute function alert_touch_updated_at();

-- ---------------------------------------------------------------------------
-- Sent-job dedupe log
-- ---------------------------------------------------------------------------

create table if not exists alert_sent (
  id            bigserial primary key,
  subscriber_id uuid not null references alert_subscribers(id) on delete cascade,
  job_url       text not null,
  sent_at       timestamptz not null default now()
);

create unique index if not exists alert_sent_dedupe_idx
  on alert_sent (subscriber_id, job_url);

create index if not exists alert_sent_subscriber_idx
  on alert_sent (subscriber_id);

-- ---------------------------------------------------------------------------
-- Bounce / complaint log (populated from Resend webhooks)
-- ---------------------------------------------------------------------------

create table if not exists alert_bounces (
  id          bigserial primary key,
  email       text not null,
  event_type  text not null,
  reason      text,
  raw         jsonb,
  received_at timestamptz not null default now()
);

create index if not exists alert_bounces_email_idx
  on alert_bounces (lower(email));

-- ---------------------------------------------------------------------------
-- RLS: lock everything down. All access goes through the service-role
-- key on the server; the anon key must never touch these tables.
-- ---------------------------------------------------------------------------

alter table alert_subscribers enable row level security;
alter table alert_sent        enable row level security;
alter table alert_bounces     enable row level security;
