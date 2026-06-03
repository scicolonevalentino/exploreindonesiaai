import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Call Brevo's API directly (see contact.functions.ts): the Lovable connector
// gateway required an unprovisioned LOVABLE_API_KEY. Brevo needs only BREVO_API_KEY.
const BREVO_API_URL = "https://api.brevo.com/v3";
const BREVO_LIST_ID = 2;

const EMAIL_RE =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

// Known throwaway / disposable email domains. Conservative list.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
  "getnada.com",
  "dispostable.com",
  "sharklasers.com",
  "spam4.me",
  "throwawaymail.com",
  "maildrop.cc",
]);

const InputSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Invalid email")
    .max(254, "Invalid email")
    .regex(EMAIL_RE, "Invalid email"),
  // Honeypot — must be empty
  website: z.string().max(0).optional().or(z.literal("")),
  // Time trap — ms between form mount and submit
  elapsedMs: z.number().int().nonnegative().optional(),
});

// In-memory rate limit per server instance (best-effort).
const RATE_LIMIT = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(key: string) {
  const now = Date.now();
  const arr = (RATE_LIMIT.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) return true;
  arr.push(now);
  RATE_LIMIT.set(key, arr);
  return false;
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot tripped → silently succeed
    if (data.website && data.website.length > 0) {
      return { ok: true, alreadySubscribed: false };
    }
    // Submitted too fast (likely bot) → silently succeed
    if (typeof data.elapsedMs === "number" && data.elapsedMs < 1500) {
      return { ok: true, alreadySubscribed: false };
    }

    const email = data.email.toLowerCase();
    const domain = email.split("@")[1] ?? "";
    if (DISPOSABLE_DOMAINS.has(domain)) {
      throw new Error("Please use a non-disposable email address.");
    }
    if (rateLimited(email)) {
      throw new Error("Too many attempts. Please try again in a minute.");
    }

    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) throw new Error("BREVO_API_KEY is not configured");

    const res = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "api-key": brevoKey,
      },
      body: JSON.stringify({
        email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!res.ok && res.status !== 204) {
      const body = await res.text();
      if (res.status === 400 && body.includes("duplicate_parameter")) {
        return { ok: true, alreadySubscribed: true };
      }
      throw new Error(`Brevo error ${res.status}: ${body}`);
    }

    return { ok: true, alreadySubscribed: false };
  });
