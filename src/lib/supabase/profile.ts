// Profile persistence: consent record + optional phone, captured in the signup
// modal and written after auth completes (works for both magic-link and OAuth,
// which can't carry custom fields through the redirect themselves).

import { getSupabaseBrowserClient } from "./client";

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

  try {
    const pending = JSON.parse(raw) as PendingProfile;
    const { error } = await supabase.from("profiles").upsert({
      user_id: user.id,
      // Empty for Google signups — their name lives in user_metadata from Google.
      first_name: pending.first_name || null,
      last_name: pending.last_name || null,
      phone: pending.phone || null,
      marketing_opt_in: pending.marketing_opt_in,
      consent_at: pending.consent_at,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch {
    // Don't block the trip flow on profile write issues; the consent stash
    // stays consumed either way to avoid loops.
  }
  window.localStorage.removeItem(PENDING_PROFILE_KEY);
}
