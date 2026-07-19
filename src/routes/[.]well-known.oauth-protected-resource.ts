// GET /.well-known/oauth-protected-resource  (RFC 9728)
// Tells MCP clients which authorization server guards this resource.

import { createFileRoute } from "@tanstack/react-router";
import { protectedResourceMetadata } from "@/lib/mcp/oauth.server";

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export const Route = createFileRoute("/.well-known/oauth-protected-resource")({
  server: {
    handlers: {
      GET: async () => json(protectedResourceMetadata()),
    },
  },
});
