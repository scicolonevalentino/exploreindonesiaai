// GET /.well-known/oauth-authorization-server  (RFC 8414)
// Authorization Server metadata: endpoints, PKCE support, grant types.

import { createFileRoute } from "@tanstack/react-router";
import { authorizationServerMetadata } from "@/lib/mcp/oauth.server";

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export const Route = createFileRoute("/.well-known/oauth-authorization-server")({
  server: {
    handlers: {
      GET: async () => json(authorizationServerMetadata()),
    },
  },
});
