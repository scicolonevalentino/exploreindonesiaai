-- ExploreIndonesia.ai — Pro credits ledger (P3 / pro-p3)
-- Run in Supabase SQL Editor. Idempotent. Apply to a TEST/preview project while
-- building; only run on prod at launch.
--
-- Model: FLAT credits. 1 credit = 1 complete agent trip-build. Revisions and the
-- back-and-forth on the SAME trip are free (no ledger row). Append-only ledger;
-- balance = sum(delta).
--   • purchases  → +N rows, inserted by the Stripe webhook (service_role),
--     idempotent on stripe_session_id (Stripe can deliver the same event twice).
--   • agent builds → -1 rows, inserted ONLY via spend_credit() so a user can
--     never self-grant credits and can never go negative.

create table if not exists public.credit_ledger (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  delta             integer not null,            -- +N purchase/grant, -1 spend
  reason            text not null,               -- 'purchase' | 'agent_build' | 'grant' | 'refund'
  stripe_session_id text unique,                 -- idempotency key for purchases (null for spends)
  created_at        timestamptz not null default now()
);

create index if not exists credit_ledger_user_idx
  on public.credit_ledger (user_id, created_at desc);

-- Current user's credit balance (0 if no rows).
create or replace function public.credit_balance()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(delta), 0)::int
  from public.credit_ledger
  where user_id = auth.uid();
$$;

-- Spend exactly one credit for an agent build. A per-user advisory lock serializes
-- concurrent spends so two builds can't both pass a stale balance check; the lock
-- auto-releases at transaction end. Returns the new balance, raises if insufficient.
create or replace function public.spend_credit(p_reason text default 'agent_build')
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_balance int;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_uid::text, 0));

  select coalesce(sum(delta), 0)::int into v_balance
  from public.credit_ledger
  where user_id = v_uid;

  if v_balance < 1 then
    raise exception 'insufficient_credits' using errcode = 'P0001';
  end if;

  insert into public.credit_ledger (user_id, delta, reason)
  values (v_uid, -1, p_reason);

  return v_balance - 1;
end;
$$;

-- RLS: a user may READ only their own ledger. There is deliberately NO direct
-- insert/update/delete for authenticated users — credits move only through
-- spend_credit() (security definer) and the service_role Stripe webhook. That is
-- what makes self-granting impossible.
alter table public.credit_ledger enable row level security;

drop policy if exists "read own ledger" on public.credit_ledger;
create policy "read own ledger" on public.credit_ledger
  for select
  using (auth.uid() = user_id);

grant usage on schema public to authenticated, service_role;
grant select on public.credit_ledger to authenticated;
grant all    on public.credit_ledger to service_role;
grant execute on function public.credit_balance()      to authenticated;
grant execute on function public.spend_credit(text)    to authenticated;
