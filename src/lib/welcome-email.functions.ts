import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "./supabase/server";

// Sends the one-time welcome email on first sign-in, via Brevo's transactional
// template (built in the Brevo dashboard, "Welcome email - new signup").
//
// Fire-once is anchored on profiles.welcome_email_sent_at, NOT on auth.callback
// (which runs on every magic-link click / OAuth return). This server fn is
// idempotent: the first call sends + stamps the timestamp, every later call is
// a no-op. Safe to invoke from multiple landing points (p1 save-flow, /account)
// — only the first one through actually sends.
//
// Server-only: BREVO_API_KEY is never exposed to the client. The Supabase
// server client reads the session from cookies, so auth.getUser() identifies
// the caller and RLS scopes the profile read/write to their own row.

const BREVO_API_URL = "https://api.brevo.com/v3";
// Authenticated sender (DKIM/SPF on exploreindonesia.ai). Matches the sender
// configured on the Brevo template.
const SENDER_EMAIL = "hello@exploreindonesia.ai";
const SENDER_NAME = "ExploreIndonesia.ai";
// Brevo transactional template id for "Welcome email - new signup".
const WELCOME_TEMPLATE_ID = 1;
// Brevo "Members" list — EVERY signup is added here (list #2 is the waitlist).
// Marketing consent is tracked per-contact via the MARKETING_OPT_IN boolean
// attribute (campaigns target a segment on that attribute, never this raw list).
const MEMBERS_LIST_ID = 3;

function firstWord(value: unknown): string {
  return typeof value === "string" ? (value.trim().split(/\s+/)[0] ?? "") : "";
}

export const sendWelcomeEmailOnce = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { sent: false, reason: "no-user" as const };

  // Profile may not exist yet (e.g. a bare /login signup that never opened
  // the Save & Download modal). maybeSingle tolerates the missing row.
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, marketing_opt_in, welcome_email_sent_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.welcome_email_sent_at) {
    return { sent: false, reason: "already" as const };
  }

  // Name resolution order: profile (from the signup modal) → user_metadata
  // (Google, or magic-link `data`) → empty (template falls back to "explorer").
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const firstName =
    profile?.first_name?.trim() ||
    (typeof meta.first_name === "string" ? meta.first_name.trim() : "") ||
    firstWord(meta.full_name) ||
    firstWord(meta.name) ||
    "";
  const lastName =
    profile?.last_name?.trim() ||
    (typeof meta.last_name === "string" ? meta.last_name.trim() : "") ||
    "";
  // Marketing consent comes from the signup forms (modal + /login), stashed →
  // profile. Absent (e.g. Google with no tick) defaults to false.
  const marketingOptIn = profile?.marketing_opt_in === true;

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) throw new Error("BREVO_API_KEY is not configured");

  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    "api-key": brevoKey,
  };

  // 1) Upsert the Brevo contact so the template's {{ contact.FIRSTNAME }}
  //    resolves. EVERY signup goes into the Members list; the MARKETING_OPT_IN
  //    boolean records consent so campaigns can target a segment on it without
  //    ever emailing someone who didn't tick the box. updateEnabled merges into
  //    an existing contact rather than erroring.
  await fetch(`${BREVO_API_URL}/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: user.email,
      updateEnabled: true,
      attributes: {
        ...(firstName ? { FIRSTNAME: firstName } : {}),
        ...(lastName ? { LASTNAME: lastName } : {}),
        MARKETING_OPT_IN: marketingOptIn,
      },
      listIds: [MEMBERS_LIST_ID],
    }),
  }).catch(() => {
    // Don't block the welcome send if the contact upsert hiccups; the
    // template's default ("explorer") covers an unresolved FIRSTNAME.
  });

  // 2) Send the welcome via the transactional template.
  const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [
        {
          email: user.email,
          name: `${firstName} ${lastName}`.trim() || undefined,
        },
      ],
      templateId: WELCOME_TEMPLATE_ID,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo welcome send failed ${res.status}: ${body.slice(0, 200)}`);
  }

  // 3) Stamp it so it never sends twice. Update the existing row, or insert
  //    a minimal one (with NOT NULL marketing_opt_in defaulted false) for the
  //    no-profile case.
  const now = new Date().toISOString();
  if (profile) {
    await supabase
      .from("profiles")
      .update({ welcome_email_sent_at: now, updated_at: now })
      .eq("user_id", user.id);
  } else {
    await supabase.from("profiles").insert({
      user_id: user.id,
      marketing_opt_in: false,
      welcome_email_sent_at: now,
      updated_at: now,
    });
  }

  return { sent: true as const };
});
