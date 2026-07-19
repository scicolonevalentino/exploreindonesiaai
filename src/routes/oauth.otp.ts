// POST /oauth/otp  — backend for the /oauth/authorize login page.
//
//  { action: "start",  email }                          -> sends a 6-digit code
//  { action: "verify", email, code, client_id,
//    redirect_uri, code_challenge, state, scope }        -> { redirect } with ?code=
//
// On verify success we authenticate the user via Supabase OTP and mint a short-
// lived authorization code bound to the user, the PKCE challenge and the
// redirect_uri, then hand the client its redirect URL.

import { createFileRoute } from "@tanstack/react-router";
import { clientRedirectUris, issueAuthCode, otpStart, otpVerify } from "@/lib/mcp/oauth.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/oauth/otp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const action = String(body.action ?? "");
        const email = String(body.email ?? "").trim();
        if (!email) return json({ error: "Email is required" }, 400);

        if (action === "start") {
          const ok = await otpStart(email);
          // Always report ok to avoid leaking which emails exist.
          return json({ ok: true, _sent: ok });
        }

        if (action === "verify") {
          const code = String(body.code ?? "").trim();
          const clientId = String(body.client_id ?? "");
          const redirectUri = String(body.redirect_uri ?? "");
          const codeChallenge = String(body.code_challenge ?? "");
          const state = String(body.state ?? "");
          const scope = String(body.scope ?? "mcp");

          // Re-validate the client/redirect binding (never trust the page).
          const ruris = await clientRedirectUris(clientId);
          if (!ruris || !ruris.includes(redirectUri) || !codeChallenge) {
            return json({ error: "Invalid authorization request" }, 400);
          }

          const user = await otpVerify(email, code);
          if (!user) return json({ error: "Invalid or expired code" }, 400);

          const authCode = await issueAuthCode({
            sub: user.userId,
            codeChallenge,
            redirectUri,
            clientId,
            scope,
          });

          const redirect = new URL(redirectUri);
          redirect.searchParams.set("code", authCode);
          if (state) redirect.searchParams.set("state", state);
          return json({ redirect: redirect.toString() });
        }

        return json({ error: "Unknown action" }, 400);
      },
    },
  },
});
