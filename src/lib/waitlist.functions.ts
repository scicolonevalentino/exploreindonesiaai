import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";
const BREVO_LIST_ID = 2;

const EMAIL_RE =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

const InputSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Invalid email")
    .max(254, "Invalid email")
    .regex(EMAIL_RE, "Invalid email"),
});

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const brevoKey = process.env.BREVO_API_KEY;
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");
    if (!brevoKey) throw new Error("BREVO_API_KEY is not configured");

    const res = await fetch(`${GATEWAY_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": brevoKey,
      },
      body: JSON.stringify({
        email: data.email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!res.ok && res.status !== 204) {
      const body = await res.text();
      // Brevo returns 400 with code "duplicate_parameter" if contact already in list — treat as success
      if (res.status === 400 && body.includes("duplicate_parameter")) {
        return { ok: true, alreadySubscribed: true };
      }
      throw new Error(`Brevo error ${res.status}: ${body}`);
    }

    return { ok: true, alreadySubscribed: false };
  });
