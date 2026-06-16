import { Link, useRouterState } from "@tanstack/react-router";
import { useUser } from "@/lib/supabase/useUser";

export function HelloBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading } = useUser();

  // The prototype page has its own dedicated feedback bar, hide the global one
  // there. Also hidden on the trip-builder/auth surfaces: a "get early access"
  // waitlist bar makes no sense where the user is already using the product.
  if (["/prototype", "/p1", "/login", "/account"].includes(pathname)) return null;

  // The bar always drives to the live trip builder. On the product homepage
  // ("/" or "/p1-home") it scrolls to the embedded builder (#try-it); on every
  // other page it links to the homepage, where the builder lives.
  const isProductHome = pathname === "/" || pathname === "/p1-home";

  const scrollToBuilder = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("try-it");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        el.querySelector<HTMLTextAreaElement>("textarea")?.focus({ preventScroll: true });
      }, 600);
    }
  };

  const ctaClass =
    "group ml-2 inline-flex items-center gap-1.5 font-bold text-[var(--navy-deep)] bg-white hover:bg-[var(--navy-deep)] hover:text-white focus-visible:bg-[var(--navy-deep)] focus-visible:text-white shadow-sm hover:shadow-md transition-all px-4 py-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--blue-bright)]";

  return (
    <div
      role="region"
      aria-label="Trip planner announcement"
      className="sticky top-0 z-50 w-full text-white text-xs sm:text-sm"
      style={{
        backgroundColor: "var(--blue-bright)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 1px 12px rgba(20,184,166,0.35)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 relative flex items-center justify-between sm:justify-center gap-2 sm:gap-3">
        <p className="min-w-0 text-center leading-snug font-medium">
          {/* Decorative lead-in: desktop only. On mobile it's dropped so the CTA
              and the auth links fit a phone width without overlapping. */}
          <span className="hidden sm:inline">Plan your Indonesia trip. Book it in minutes. </span>
          {isProductHome ? (
            <a
              href="#try-it"
              onClick={scrollToBuilder}
              aria-label="Assemble my trip, jump to the trip builder"
              className={ctaClass}
            >
              Assemble my trip
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
          ) : (
            <Link to="/" aria-label="Assemble my trip, go to the trip builder" className={ctaClass}>
              Assemble my trip
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          )}
        </p>

        {/* Auth entry points, top right. Skipped while auth state loads to avoid
            a login→my-trips flicker for signed-in visitors. */}
        {!loading && (
          <nav
            aria-label="Account"
            className="shrink-0 flex items-center gap-2 sm:gap-3 sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2"
          >
            {user ? (
              <Link
                to="/account"
                className="inline-flex items-center gap-1 font-bold bg-white text-[var(--navy-deep)] hover:bg-black hover:text-white transition-colors px-3 py-1 rounded-full"
              >
                My trips
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-semibold text-white/90 hover:text-white underline-offset-2 hover:underline"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 font-bold bg-white text-[var(--navy-deep)] hover:bg-black hover:text-white transition-colors px-3 py-1 rounded-full"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
