// Profile persistence: consent record + optional phone, captured in the signup
// modal and written after auth completes (works for both magic-link and OAuth,
// which can't carry custom fields through the redirect themselves).
//
// Auth-completion analytics (GA4 `login` / `sign_up`) are tracked SEPARATELY
// from the profile stash: the event must fire on every completed auth flow, not
// only when a marketing opt-in happened to be stashed. `markAuthPending` records
// the intent the moment an auth flow starts; `trackAuthCompletion` fires the
// matching event once when the user lands back signed in.

import { getSupabaseBrowserClient } from "./client";
import { trackEvent } from "@/lib/analytics-events";

// localStorage stash written by the signup modal before redirecting to auth;
// consumed (then cleared) on the signed-in return.
export const PENDING_PROFILE_KEY = "ei:pendingProfile";

// Marker written the instant an auth flow is initiated (Google or email), so the
// signed-in return can fire exactly one login/sign_up event — independent of
// whether any profile fields were stashed. Value is the method for the event.
export const AUTH_PENDING_KEY = "ei:authPending";

// Bounded retries for a failing profile upsert, so a transient DB error doesn't
// silently drop the GDPR consent record but also can't loop forever.
const PROFILE_WRITE_ATTEMPTS_KEY = "ei:profileWriteAttempts";
const MAX_PROFILE_WRITE_ATTEMPTS = 3;

export type AuthMethod = "google" | "email";

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

// Record that an auth flow just started. Call right before signInWithOAuth /
// signInWithOtp so the return leg knows a genuine login was initiated.
export function markAuthPending(method: AuthMethod) {
  try {
    window.localStorage.setItem(AUTH_PENDING_KEY, method);
  } catch {
    // Private-mode / storage-full: analytics is best-effort, never block auth.
  }
}

// Fire the GA4 login/sign_up event once per completed auth flow. Gated on the
// pending marker (set at auth start) so it fires only after an intentful login,
// never on a passive session resume; the marker is cleared on fire so a refresh
// can't double-count. A brand-new account is a `sign_up`, a returning one a
// `login` — decided by comparing created_at with last_sign_in_at rather than a
// wall-clock window, so a link opened minutes later is still classed correctly.
export async function trackAuthCompletion(): Promise<void> {
  let method: string | null;
  try {
    method = window.localStorage.getItem(AUTH_PENDING_KEY);
  } catch {
    method = null;
  }
  if (!method) return; // no auth flow was initiated on this device

  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return; // session not ready yet — keep the marker, retry next call

  window.localStorage.removeItem(AUTH_PENDING_KEY);

  const createdMs = user.created_at ? new Date(user.created_at).getTime() : 0;
  const lastSignInMs = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : 0;
  // On a first-ever sign-in Supabase sets created_at and last_sign_in_at within
  // the same moment; a returning user's last_sign_in_at is much later.
  const isNewUser =
    createdMs > 0 && (lastSignInMs === 0 || Math.abs(lastSignInMs - createdMs) < 10_000);

  trackEvent(isNewUser ? "sign_up" : "login", { method });
}

export async function flushPendingProfile(): Promise<void> {
  // Fire the auth-completion event first, regardless of whether any profile
  // fields were stashed — this is the missing counterpart to `signup_start`.
  await trackAuthCompletion();

  const raw = window.localStorage.getItem(PENDING_PROFILE_KEY);
  if (!raw) return;
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return; // not signed in yet — keep the stash for later

  let pending: PendingProfile;
  try {
    pending = JSON.parse(raw) as PendingProfile;
  } catch {
    // Corrupt stash — nothing recoverable, drop it so we don't loop on it.
    window.localStorage.removeItem(PENDING_PROFILE_KEY);
    return;
  }

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
  if (!error) {
    window.localStorage.removeItem(PENDING_PROFILE_KEY);
    window.localStorage.removeItem(PROFILE_WRITE_ATTEMPTS_KEY);
    return;
  }

  // The write failed. This row holds the GDPR consent proof (consent_at,
  // marketing_opt_in), so DON'T discard the stash — a later flush can retry it.
  // Surface the failure instead of swallowing it, and cap retries so a
  // permanently-failing write can't loop the user forever.
  const attempts = Number(window.localStorage.getItem(PROFILE_WRITE_ATTEMPTS_KEY) ?? "0") + 1;
  console.error("[profile] consent upsert failed", { attempt: attempts, error });
  trackEvent("profile_write_failed", { attempt: attempts });
  if (attempts >= MAX_PROFILE_WRITE_ATTEMPTS) {
    // Give up retrying, but keep the record locally rather than deleting the
    // consent proof outright.
    window.localStorage.removeItem(PROFILE_WRITE_ATTEMPTS_KEY);
    return;
  }
  window.localStorage.setItem(PROFILE_WRITE_ATTEMPTS_KEY, String(attempts));
}
