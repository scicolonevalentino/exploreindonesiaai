// POST /api/mcp  —  Remote MCP server (Streamable HTTP, stateless).
//
// Hand-rolled JSON-RPC 2.0 over the web Request/Response API so it runs on this
// repo's Nitro/Cloudflare-style runtime (the official MCP SDK transports assume
// Node req/res). Stateless: every POST is answered with a single JSON response,
// no session or SSE stream needed because the server never initiates messages.
//
// Exposes the ExploreIndonesia.ai tools (search_itineraries, match_trip,
// get_booking_links) so claude.ai / Claude Code can plan real, bookable
// Indonesia trips. Tool logic lives in @/lib/mcp/tools.server.ts.

import { createFileRoute } from "@tanstack/react-router";
import { TOOLS, callTool } from "@/lib/mcp/tools.server";
import { authRequired, verifyBearer } from "@/lib/mcp/oauth.server";
import { SITE_URL } from "@/lib/mcp/config";

const SUPPORTED_PROTOCOL = "2025-06-18";
const SERVER_INFO = { name: "exploreindonesia-ai", version: "0.1.0" };

// 401 that points MCP clients at the protected-resource metadata, per the MCP
// authorization spec, so they can discover the auth server and start OAuth.
function unauthorized() {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "WWW-Authenticate": `Bearer resource_metadata="${SITE_URL}/.well-known/oauth-protected-resource"`,
    },
  });
}

type JsonRpcId = string | number | null;

function result(id: JsonRpcId, body: unknown) {
  return { jsonrpc: "2.0", id, result: body };
}
function error(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      // Public read-only tool server; allow browser-based MCP clients.
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
    },
  });
}

async function handleRpc(msg: Record<string, unknown>): Promise<unknown | null> {
  const id = (msg.id ?? null) as JsonRpcId;
  const method = msg.method;
  const params = (msg.params ?? {}) as Record<string, unknown>;

  // Notifications (no id) get no response body.
  const isNotification = msg.id === undefined;

  switch (method) {
    case "initialize":
      return result(id, {
        protocolVersion:
          typeof params.protocolVersion === "string" ? params.protocolVersion : SUPPORTED_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions:
          "Tools for planning real, bookable Indonesia trips from ExploreIndonesia.ai. " +
          "search_itineraries finds curated published trips; match_trip / get_booking_links " +
          "turn a drafted plan into bookable items with affiliate deep links.",
      });

    case "notifications/initialized":
    case "notifications/cancelled":
      return null; // ack-only

    case "ping":
      return result(id, {});

    case "tools/list":
      return result(id, { tools: TOOLS });

    case "tools/call": {
      const name = String(params.name ?? "");
      const args = (params.arguments ?? {}) as Record<string, unknown>;
      try {
        const data = await callTool(name, args);
        return result(id, {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        });
      } catch (err) {
        // Tool-level failures are reported as a successful call with isError,
        // per MCP spec, so the model can see and recover from them.
        const message = err instanceof Error ? err.message : "Tool execution failed";
        return result(id, {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        });
      }
    }

    default:
      if (isNotification) return null;
      return error(id, -32601, `Method not found: ${String(method)}`);
  }
}

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      OPTIONS: async () => jsonResponse(null, 204),

      // Streamable HTTP clients may open a GET for a server->client SSE stream.
      // This server is stateless and never pushes, so decline it cleanly.
      GET: async () =>
        new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "POST, OPTIONS" },
        }),

      POST: async ({ request }) => {
        // Enforce OAuth bearer token when enabled (off by default for testing).
        if (authRequired() && !(await verifyBearer(request.headers.get("Authorization")))) {
          return unauthorized();
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return jsonResponse(error(null, -32700, "Parse error"), 200);
        }

        // JSON-RPC batch support.
        if (Array.isArray(payload)) {
          const responses = (
            await Promise.all(payload.map((m) => handleRpc(m as Record<string, unknown>)))
          ).filter((r) => r !== null);
          return responses.length === 0 ? jsonResponse(null, 202) : jsonResponse(responses);
        }

        if (!payload || typeof payload !== "object") {
          return jsonResponse(error(null, -32600, "Invalid Request"), 200);
        }

        const response = await handleRpc(payload as Record<string, unknown>);
        // Notifications produce no body -> 202 Accepted.
        return response === null ? jsonResponse(null, 202) : jsonResponse(response);
      },
    },
  },
});
