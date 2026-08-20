-- ExploreIndonesia.ai — MCP connector traffic log
-- Run in Supabase dashboard → SQL Editor → New query → Run. Idempotent.
--
-- One row per JSON-RPC call handled by /api/mcp. Written server-side with the
-- service_role key (RLS blocks anon/authenticated access entirely — this is
-- an internal usage sensor, not user-facing data). Answers the only question
-- that matters right now: is anything actually calling this connector?
--
-- Read the signal (run as service_role in the SQL editor):
--   -- calls per day, last 30 days
--   select date_trunc('day', created_at) as day, count(*)
--     from public.mcp_traffic_log
--     group by 1 order by 1 desc limit 30;
--   -- which tools get used
--   select tool_name, count(*) from public.mcp_traffic_log
--     where method = 'tools/call' group by 1 order by 2 desc;
--   -- distinct clients seen (by declared MCP client name + IP)
--   select client_name, ip, count(*), max(created_at)
--     from public.mcp_traffic_log group by 1, 2 order by 4 desc;

create table if not exists public.mcp_traffic_log (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  method      text not null,        -- JSON-RPC method: initialize, tools/list, tools/call, ping
  tool_name   text,                 -- populated when method = 'tools/call'
  client_name text,                 -- from the initialize handshake's clientInfo.name, if sent
  ip          text,
  user_agent  text
);

create index if not exists mcp_traffic_log_created_idx
  on public.mcp_traffic_log (created_at desc);

alter table public.mcp_traffic_log enable row level security;
-- No policies: only service_role (server-side, bypasses RLS) may read or write.

grant usage on schema public to service_role;
grant select, insert on public.mcp_traffic_log to service_role;
