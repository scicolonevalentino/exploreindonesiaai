-- ExploreIndonesia.ai — P2 schema
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (idempotent: IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS).
--
-- auth.users is managed by Supabase Auth. We only add app tables that reference it.

-- ---------------------------------------------------------------------------
-- preferences: one row per user, pre-fills the /p1 builder for return visits
-- ---------------------------------------------------------------------------
create table if not exists public.preferences (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  travel_style text,
  budget_band  text,
  regions      text[],
  pace         text,
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- saved_trips: the itinerary JSON the P1 builder produced, kept per user
-- ---------------------------------------------------------------------------
create table if not exists public.saved_trips (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text,
  prompt     text,
  trip_json  jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists saved_trips_user_id_created_idx
  on public.saved_trips (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row-Level Security: every user can only touch their OWN rows.
-- This is enforced by the database, not the app — the anon key is public.
-- ---------------------------------------------------------------------------
alter table public.preferences enable row level security;
alter table public.saved_trips enable row level security;

drop policy if exists "own preferences" on public.preferences;
create policy "own preferences" on public.preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own saved_trips" on public.saved_trips;
create policy "own saved_trips" on public.saved_trips
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- API grants — required on newer Supabase projects (no auto-grant). RLS above
-- still limits every role to its own rows.
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete
  on public.saved_trips, public.preferences
  to authenticated, service_role;
