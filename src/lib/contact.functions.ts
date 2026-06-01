import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";
const FOUNDER_EMAIL = "scicolonevalentino@gmail.com";
// Verified domain in Brevo (exploreindonesia.ai is DKIM/SPF authenticated).
const SENDER_EMAIL = "notify@exploreindonesia.ai";
const SENDER_NAME = "exploreindonesia.ai";

const EMAIL_RE =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

const InputSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(3, "Invalid email")
    .max(254, "Invalid email")
    .regex(EMAIL_RE, "Invalid email"),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(2000, "Message is too long."),
  // Honeypot: must be empty. Bots tend to fill all fields.
  website: z.string().max(0).optional().or(z.literal("")),
  // Time-trap: must take at least 3 seconds to submit
  elapsedMs: z.number().int().nonnegative().optional(),
});

// Simple in-memory rate limit (per server instance). Best-effort spam guard.
const RATE_LIMIT = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function rateLimited(key: string) {
  const now = Date.now();
  const arr = (RATE_LIMIT.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) return true;
  arr.push(now);
  RATE_LIMIT.set(key, arr);
  return false;
}

// Crude spam scoring
function looksSpammy(name: string, message: string) {
  const text = `${name}\n${message}`.toLowerCase();
  if ((message.match(/https?:\/\//g) ?? []).length >= 3) return true;
  if (/\b(viagra|casino|crypto airdrop|seo services|bitcoin doubler|loan offer)\b/.test(text)) return true;
  if (/[\u0400-\u04FF]{20,}/.test(message)) return true; // long cyrillic block
  return false;
}

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot triggered → pretend success, drop silently
    if (data.website && data.website.length > 0) {
      return { ok: true };
    }
    // Too-fast submit → pretend success, drop
    if (typeof data.elapsedMs === "number" && data.elapsedMs < 3000) {
      return { ok: true };
    }
    if (looksSpammy(data.name, data.message)) {
      return { ok: true };
    }
    if (rateLimited(data.email.toLowerCase())) {
      throw new Error("Too many messages. Please try again in a minute.");
    }

    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const brevoKey = process.env.BREVO_API_KEY;
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");
    if (!brevoKey) throw new Error("BREVO_API_KEY is not configured");

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeMsg = escapeHtml(data.message).replace(/\n/g, "<br/>");

    const res = await fetch(`${GATEWAY_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": brevoKey,
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: FOUNDER_EMAIL, name: "Valentino" }],
        replyTo: { email: data.email, name: data.name },
        subject: `[contact] ${data.name}`,
        htmlContent: `<p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p><p>${safeMsg}</p>`,
        textContent: `From: ${data.name} <${data.email}>\n\n${data.message}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Brevo error ${res.status}: ${body.slice(0, 200)}`);
    }

    return { ok: true };
  });
