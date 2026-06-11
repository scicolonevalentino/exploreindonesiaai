-- ExploreIndonesia.ai — P2 step 2: profiles table + API grants
-- Run in Supabase dashboard → SQL Editor → New query → Run. Idempotent.
--
-- The grants section is required: newer Supabase projects don't auto-grant
-- table access to the API roles, so without it every REST/client query fails
-- with 42501 "permission denied" (seen live on saved_trips). RLS still
-- restricts every role to its own rows — grants only open the door, policies
-- decide who gets which rows.

-- profiles: consent record + optional phone + marketing opt-in
create table if not exists public.profiles (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  phone            text,
  marketing_opt_in boolean not null default false,
  consent_at       timestamptz,          -- when the user ticked the data-consent box
  updated_at       timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- API grants for all P2 tables. Only signed-in users (authenticated) and the
-- server (service_role) touch these — anon stays locked out entirely.
grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete
  on public.saved_trips, public.preferences, public.profiles
  to authenticated, service_role;
