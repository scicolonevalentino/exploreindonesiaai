// POST /oauth/register  (RFC 7591 Dynamic Client Registration)
//
// Public clients (PKCE, no secret). Stateless: the returned client_id is a
// signed token that encodes the allowed redirect URIs, so no store is needed —
// /authorize and /token decode it to validate redirect_uri.

import { createFileRoute } from "@tanstack/react-router";
import { issueClientId } from "@/lib/mcp/oauth.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export const Route = createFileRoute("/oauth/register")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),

      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return json(
            { error: "invalid_client_metadata", error_description: "Body must be JSON" },
            400,
          );
        }

        const redirectUris = Array.isArray(body.redirect_uris)
          ? body.redirect_uris.filter((u): u is string => typeof u === "string")
          : [];
        if (redirectUris.length === 0) {
          return json(
            { error: "invalid_redirect_uri", error_description: "redirect_uris is required" },
            400,
          );
        }

        const clientId = await issueClientId(redirectUris);
        return json(
          {
            client_id: clientId,
            client_id_issued_at: Math.floor(Date.now() / 1000),
            redirect_uris: redirectUris,
            token_endpoint_auth_method: "none",
            grant_types: ["authorization_code", "refresh_token"],
            response_types: ["code"],
          },
          201,
        );
      },
    },
  },
});
