// POST /oauth/token  — OAuth 2.1 token endpoint (PKCE, public clients).
//
//  grant_type=authorization_code: code + code_verifier + redirect_uri -> tokens
//  grant_type=refresh_token:      refresh_token -> new access token
//
// Accepts both application/x-www-form-urlencoded (per spec) and JSON.

import { createFileRoute } from "@tanstack/react-router";
import {
  pkceChallengeFromVerifier,
  readAuthCode,
  issueTokens,
  refreshAccess,
} from "@/lib/mcp/oauth.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

async function readParams(request: Request): Promise<Record<string, string>> {
  const ctype = request.headers.get("Content-Type") ?? "";
  if (ctype.includes("application/json")) {
    const b = (await request.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(b).map(([k, v]) => [k, String(v)]));
  }
  const form = await request.formData();
  const out: Record<string, string> = {};
  for (const [k, v] of form.entries()) out[k] = String(v);
  return out;
}

export const Route = createFileRoute("/oauth/token")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }),

      POST: async ({ request }) => {
        let p: Record<string, string>;
        try {
          p = await readParams(request);
        } catch {
          return json({ error: "invalid_request" }, 400);
        }

        const grantType = p.grant_type;

        if (grantType === "authorization_code") {
          const code = p.code ?? "";
          const verifier = p.code_verifier ?? "";
          const redirectUri = p.redirect_uri ?? "";
          const clientId = p.client_id ?? "";
          if (!code || !verifier) {
            return json(
              { error: "invalid_request", error_description: "code and code_verifier required" },
              400,
            );
          }

          const parsed = await readAuthCode(code);
          if (!parsed)
            return json({ error: "invalid_grant", error_description: "bad or expired code" }, 400);
          if (parsed.redirectUri !== redirectUri) {
            return json(
              { error: "invalid_grant", error_description: "redirect_uri mismatch" },
              400,
            );
          }
          if (clientId && parsed.clientId !== clientId) {
            return json({ error: "invalid_grant", error_description: "client_id mismatch" }, 400);
          }
          // PKCE check.
          const expected = await pkceChallengeFromVerifier(verifier);
          if (expected !== parsed.codeChallenge) {
            return json(
              { error: "invalid_grant", error_description: "PKCE verification failed" },
              400,
            );
          }

          const tokens = await issueTokens(parsed.sub, parsed.scope);
          return json(tokens);
        }

        if (grantType === "refresh_token") {
          const refresh = p.refresh_token ?? "";
          if (!refresh) return json({ error: "invalid_request" }, 400);
          const tokens = await refreshAccess(refresh);
          if (!tokens) return json({ error: "invalid_grant" }, 400);
          return json(tokens);
        }

        return json({ error: "unsupported_grant_type" }, 400);
      },
    },
  },
});
