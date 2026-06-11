// Supabase client for the BROWSER.
//
// Safe to import in client components. Uses the anon key + URL, both of which
// are public (VITE_ prefixed). Row-Level Security on the database is what keeps
// one user from reading another user's rows — never rely on the client.

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}
