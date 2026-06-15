// Pro credit balance + spend, via the browser Supabase client. RLS scopes the
// ledger read to the signed-in user; balance and spend go through the
// SECURITY DEFINER functions credit_balance() / spend_credit() (see
// supabase/credits.sql) so the client can never grant itself credits.

import { getSupabaseBrowserClient } from "./client";

// The signed-in user's current credit balance. Returns 0 on any error or when
// signed out — callers treat 0 as "no credits" (the wall), never as a crash.
export async function getCreditBalance(): Promise<number> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("credit_balance");
    if (error) return 0;
    return typeof data === "number" ? data : 0;
  } catch {
    return 0;
  }
}

export type SpendResult =
  | { ok: true; balance: number }
  | { ok: false; reason: "insufficient_credits" | "error" };

// Spend exactly one credit for an agent iteration. The DB function re-checks the
// balance atomically and raises 'insufficient_credits' when empty, which we map
// to a typed result so the caller can show the credit wall instead of throwing.
export async function spendCredit(reason = "agent_iteration"): Promise<SpendResult> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("spend_credit", { p_reason: reason });
    if (error) {
      const insufficient = /insufficient_credits/i.test(error.message ?? "");
      return { ok: false, reason: insufficient ? "insufficient_credits" : "error" };
    }
    return { ok: true, balance: typeof data === "number" ? data : 0 };
  } catch {
    return { ok: false, reason: "error" };
  }
}
