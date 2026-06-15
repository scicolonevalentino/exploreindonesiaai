-- ExploreIndonesia.ai — Pro edit-loop tracking (P3 Phase 3)
-- Idempotent. Adds a per-trip counter of AI edits so the FIRST edit on each trip
-- is free (the hook) and the 2nd+ spends a credit. Server-side gating reads/
-- increments this; RLS on saved_trips already scopes rows to the owner.

alter table public.saved_trips
  add column if not exists ai_edits_used integer not null default 0;
