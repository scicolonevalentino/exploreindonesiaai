-- ExploreIndonesia.ai — generation monitoring + Pro demand probe
-- Run in Supabase dashboard → SQL Editor → New query → Run. Idempotent.
--
-- Two tables:
--  • generations  — one row per COMPLETED trip generation by a signed-in user.
--    Powers the per-user daily cap AND doubles as the raw usage distribution
--    (trips per user per day) you read to calibrate the cap. Counting is done
--    client-side under RLS; this is a demand SENSOR, not hard enforcement
--    (signed-out generation stays unlimited by design).
--  • pro_interest — a signed-in user's one-click "I want Pro" hand-raise at the
--    daily-limit wall. The ACTIVE demand signal for the Pro tier. One row per
--    user (upsert), so repeat clicks don't inflate the count.
--
-- Read the signal (run as service_role in the SQL editor — bypasses RLS):
--   -- per-user trips today
--   select user_id, count(*) from public.generations
--     where created_at >= date_trunc('day', now()) group by user_id order by 2 desc;
--   -- how many raised a hand for Pro
--   select count(*) from public.pro_interest;

-- ---------------------------------------------------------------------------
-- generations: per-user completed-generation log
-- ---------------------------------------------------------------------------
create table if not exists public.generations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists generations_user_id_created_idx
  on public.generations (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- pro_interest: one durable "early access to Pro" hand-raise per user
-- ---------------------------------------------------------------------------
create table if not exists public.pro_interest (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  source     text,                              -- e.g. 'generation_limit'
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row-Level Security: every user can only touch their OWN rows. The founder
-- reads aggregates via the dashboard (service_role), which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.generations  enable row level security;
alter table public.pro_interest enable row level security;

drop policy if exists "own generations" on public.generations;
create policy "own generations" on public.generations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own pro_interest" on public.pro_interest;
create policy "own pro_interest" on public.pro_interest
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- API grants — required on newer Supabase projects (no auto-grant). RLS above
-- still limits every role to its own rows.
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete
  on public.generations, public.pro_interest
  to authenticated, service_role;
