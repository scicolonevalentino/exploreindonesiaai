// Best-effort usage logging for the MCP connector — see supabase/mcp_traffic.sql.
//
// Answers one question: is anything actually calling /api/mcp? Fire-and-forget
// so a logging failure (missing table, network blip) never affects the tool
// response — this is a sensor, not a critical path.

import { createClient } from "@supabase/supabase-js";

type McpCallLog = {
  method: string;
  toolName?: string;
  clientName?: string;
  ip: string;
  userAgent: string;
};

function serviceClient() {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function logMcpCall(entry: McpCallLog) {
  const supabase = serviceClient();
  if (!supabase) return;
  void (async () => {
    try {
      const { error } = await supabase.from("mcp_traffic_log").insert({
        method: entry.method,
        tool_name: entry.toolName ?? null,
        client_name: entry.clientName ?? null,
        ip: entry.ip,
        user_agent: entry.userAgent,
      });
      if (error) {
        const cause = (error as { cause?: unknown }).cause;
        console.error(
          "[mcp telemetry] insert failed:",
          error.message,
          cause instanceof Error ? `cause: ${cause.name} ${cause.message}` : "",
        );
      }
    } catch (err) {
      console.error("[mcp telemetry] insert threw:", err);
    }
  })();
}
