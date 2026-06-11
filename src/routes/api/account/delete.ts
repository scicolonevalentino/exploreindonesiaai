// POST /api/account/delete
//
// Deletes the signed-in user's account (GDPR right to erasure). Auth-user
// deletion needs the service-role key, so it happens server-side only: we
// authenticate the caller from their session cookies, then delete via the
// admin API. The ON DELETE CASCADE on profiles/saved_trips/preferences wipes
// all their rows in the same transaction.

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/account/delete")({
  server: {
    handlers: {
      POST: async () => {
        const supabase = getSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return json({ error: "not_authenticated" }, 401);

        // Server-only secret — read inside the handler, never at module scope.
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceKey) return json({ error: "server_misconfigured" }, 500);

        const admin = createClient(import.meta.env.VITE_SUPABASE_URL as string, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { error } = await admin.auth.admin.deleteUser(user.id);
        if (error) return json({ error: "delete_failed" }, 500);

        // Clear the now-orphaned session cookies.
        await supabase.auth.signOut();
        return json({ ok: true });
      },
    },
  },
});
