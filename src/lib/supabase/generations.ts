// Generation monitoring + Pro-demand probe, via the browser Supabase client.
// Row-Level Security scopes every read/write to the signed-in user, so reads
// never pass user_id and inserts only set it explicitly (same pattern as
// trips.ts). Everything here is BEST-EFFORT and FAILS OPEN — counting or
// logging must never block or break a trip generation.

import { getSupabaseBrowserClient } from "./client";

// Start of the visitor's LOCAL day as an ISO instant — the cap resets at their
// own midnight ("your free trips refresh tomorrow"), not UTC midnight.
function startOfLocalDayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// How many trips the signed-in user has generated since their local midnight.
// Returns 0 on any error so a hiccup never gates a build.
export async function countGenerationsToday(): Promise<number> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { count, error } = await supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfLocalDayISO());
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/* ----------------------------- anonymous cap ---------------------------- */
// Signed-out visitors are counted in localStorage (no server identity to key
// on). Bypassable by design — like the signed-in cap, we only want the signal
// that drives the signup wall, not a hard lock. Resets at the visitor's local
// midnight to match the signed-in counter's semantics.

const ANON_COUNT_KEY = "ei:anonGenerations";

// Local calendar day as YYYY-MM-DD, so the count rolls over at the visitor's
// own midnight rather than UTC.
function localDayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// How many trips a signed-out visitor has generated today. 0 on any error.
export function countAnonGenerationsToday(): number {
  try {
    const raw = window.localStorage.getItem(ANON_COUNT_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { day?: string; count?: number };
    return parsed.day === localDayKey() ? (parsed.count ?? 0) : 0;
  } catch {
    return 0;
  }
}

// Record one completed signed-out generation. Best-effort; never throws.
export function logAnonGeneration(): void {
  try {
    const next = countAnonGenerationsToday() + 1;
    window.localStorage.setItem(
      ANON_COUNT_KEY,
      JSON.stringify({ day: localDayKey(), count: next }),
    );
  } catch {
    // Private mode / storage full — skip, the cap just fails open.
  }
}

// Log one COMPLETED generation for the signed-in user. No-op when signed out
// (signed-out generation is counted separately, in localStorage).
export async function logGeneration(): Promise<void> {
  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("generations").insert({ user_id: user.id });
  } catch {
    // Never let logging break the build flow.
  }
}

// Record the user's one-click "I want Pro" hand-raise at the limit wall. Upsert
// keeps a single durable row per user, so repeat clicks don't inflate the
// signal. The user is signed in here, so we already have their identity/email —
// no form needed.
export async function recordProInterest(source = "generation_limit"): Promise<void> {
  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("pro_interest")
      .upsert({ user_id: user.id, source }, { onConflict: "user_id", ignoreDuplicates: true });
  } catch {
    // Best-effort.
  }
}
