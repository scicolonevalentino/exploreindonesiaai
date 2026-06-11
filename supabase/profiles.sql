-- ExploreIndonesia.ai — P2 step 2: user profiles (consent + optional phone)
-- Run in Supabase dashboard → SQL Editor → New query → Run. Idempotent.

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
