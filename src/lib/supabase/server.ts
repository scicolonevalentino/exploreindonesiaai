// Supabase client for SERVER routes / server functions.
//
// Uses @supabase/ssr with TanStack Start's cookie helpers so the auth session
// (stored in httpOnly cookies) is read on every request and refreshed cookies
// are written back to the response. Never import this into client code — it
// would leak the cookie plumbing. Use src/lib/supabase/client.ts in the browser.

import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export function getSupabaseServerClient() {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const all = getCookies() ?? {};
        return Object.entries(all).map(([name, value]) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options);
        }
      },
    },
  });
}

// Convenience: the logged-in user (or null) for the current request.
export async function getCurrentUser() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
