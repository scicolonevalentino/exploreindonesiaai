// Best-effort usage logging for the MCP connector — see supabase/mcp_traffic.sql.
//
// Answers one question: is anything actually calling /api/mcp? Awaited (not
// fire-and-forget): this serverless runtime doesn't expose a waitUntil-style
// hook to keep a background task alive after the response is sent, so an
// un-awaited insert gets killed mid-flight when the invocation ends — that's
// why the first version silently logged nothing. A logging failure still
// never throws past this function, so it can't break the tool response.
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

export async function logMcpCall(entry: McpCallLog) {
  const supabase = serviceClient();
  if (!supabase) return;
  try {
    const { error } = await supabase.from("mcp_traffic_log").insert({
      method: entry.method,
      tool_name: entry.toolName ?? null,
      client_name: entry.clientName ?? null,
      ip: entry.ip,
      user_agent: entry.userAgent,
    });
    if (error) console.error("[mcp telemetry] insert failed:", error.message);
  } catch (err) {
    console.error("[mcp telemetry] insert threw:", err);
  }
}
