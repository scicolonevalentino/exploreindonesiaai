// GET /auth/callback
//
// Where the magic-link email lands. Supabase appends a one-time `code`; we
// exchange it for a session server-side (which sets the auth cookies via the
// server client's setAll), then redirect the user on. No UI — pure handler.

import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const Route = createFileRoute("/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const next = url.searchParams.get("next") ?? "/account";

        if (code) {
          const supabase = getSupabaseServerClient();
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            return new Response(null, {
              status: 303,
              headers: { Location: next },
            });
          }
        }

        return new Response(null, {
          status: 303,
          headers: { Location: "/login?error=link" },
        });
      },
    },
  },
});
