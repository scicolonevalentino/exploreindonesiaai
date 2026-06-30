// Profile persistence: consent record + optional phone, captured in the signup
// modal and written after auth completes (works for both magic-link and OAuth,
// which can't carry custom fields through the redirect themselves).

import { getSupabaseBrowserClient } from "./client";
import { trackEvent } from "@/lib/analytics-events";

// localStorage stash written by the signup modal before redirecting to auth;
// consumed (then cleared) on the signed-in return.
export const PENDING_PROFILE_KEY = "ei:pendingProfile";

export type PendingProfile = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  marketing_opt_in: boolean;
  consent_at: string;
};

export function stashPendingProfile(p: PendingProfile) {
  window.localStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(p));
}

export async function flushPendingProfile(): Promise<void> {
  const raw = window.localStorage.getItem(PENDING_PROFILE_KEY);
  if (!raw) return;
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return; // not signed in yet — keep the stash for later

  // Auth completion. The stash exists only right after an intentful auth flow
  // (signup modal / login page), so this fires once per completion — the missing
  // counterpart to `signup_start`. A brand-new account (created seconds ago) is a
  // GA4 `sign_up`; an existing user returning is a `login`. `provider` mirrors the
  // `method` on signup_start ("google" | "email").
  const createdMs = user.created_at ? new Date(user.created_at).getTime() : 0;
  const isNewUser = createdMs > 0 && Date.now() - createdMs < 5 * 60 * 1000;
  trackEvent(isNewUser ? "sign_up" : "login", {
    method: user.app_metadata?.provider ?? "unknown",
  });

  try {
    const pending = JSON.parse(raw) as PendingProfile;
    // Only write the fields the stash actually carried. The /login page stashes
    // just consent + marketing, so omitting the name/phone keys here means an
    // upsert from there can't null out an existing user's name or phone.
    const payload: Record<string, unknown> = {
      user_id: user.id,
      marketing_opt_in: pending.marketing_opt_in,
      consent_at: pending.consent_at,
      updated_at: new Date().toISOString(),
    };
    // Empty for Google signups — their name lives in user_metadata from Google.
    if (pending.first_name !== undefined) payload.first_name = pending.first_name || null;
    if (pending.last_name !== undefined) payload.last_name = pending.last_name || null;
    if (pending.phone !== undefined) payload.phone = pending.phone || null;
    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) throw error;
  } catch {
    // Don't block the trip flow on profile write issues; the consent stash
    // stays consumed either way to avoid loops.
  }
  window.localStorage.removeItem(PENDING_PROFILE_KEY);
}
