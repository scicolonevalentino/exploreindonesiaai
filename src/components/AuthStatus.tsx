// Floating auth chip for the product surfaces (/p1): "Log in" when signed out,
// "My trips" + "Sign out" when signed in. The marketing pages keep their own
// chrome — this only renders where it's mounted.

import { Link } from "@tanstack/react-router";
import { useUser } from "@/lib/supabase/useUser";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Colors live in classes (not inline style) so hover states can override them.
const pill =
  "inline-flex items-center gap-1.5 rounded-full border border-[var(--border-cream)] bg-white px-4 py-2 text-sm font-semibold text-[var(--navy-deep)] shadow-sm transition-colors hover:bg-[var(--navy-deep)] hover:text-white";

export function AuthStatus() {
  const { user, loading } = useUser();
  if (loading) return null;

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      {user ? (
        <>
          <Link to="/account" className={pill}>
            My trips
          </Link>
          <button
            type="button"
            onClick={() => void getSupabaseBrowserClient().auth.signOut()}
            className="text-xs font-medium text-[var(--slate-muted)] underline-offset-2 hover:underline"
          >
            Sign out
          </button>
        </>
      ) : (
        <Link to="/login" className={pill}>
          Log in
        </Link>
      )}
    </div>
  );
}
