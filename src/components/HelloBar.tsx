import { Link, useRouterState } from "@tanstack/react-router";
import { useUser } from "@/lib/supabase/useUser";

export function HelloBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading } = useUser();

  // The prototype page has its own dedicated feedback bar, hide the global one
  // there. Also hidden on the trip-builder/auth surfaces: a "get early access"
  // waitlist bar makes no sense where the user is already using the product.
  if (["/prototype", "/p1", "/login", "/account"].includes(pathname)) return null;

  // On the product homepage the bar CTA sends visitors to the live builder
  // (#try-it) instead of the waitlist, same action as "Assemble my trip".
  // Both "/" (post-launch swap) and "/p1-home" embed the live builder.
  const isProductHome = pathname === "/" || pathname === "/p1-home";
  const targetId = isProductHome ? "try-it" : "early-access";

  const handleCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        const input = isProductHome
          ? el.querySelector<HTMLTextAreaElement>("textarea")
          : el.querySelector<HTMLInputElement>('input[type="email"]');
        input?.focus({ preventScroll: true });
      }, 600);
    }
  };

  return (
    <div
      role="region"
      aria-label="Early access announcement"
      className="sticky top-0 z-50 w-full text-white text-xs sm:text-sm"
      style={{
        backgroundColor: "var(--blue-bright)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 1px 12px rgba(20,184,166,0.35)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 relative flex items-center justify-center gap-3">
        <p className="text-center leading-snug font-medium pr-24 sm:pr-0">
          <span className="hidden sm:inline">Plan your Indonesia trip. Book it in minutes. </span>
          <span className="sm:hidden">Launching soon. </span>
          <a
            href={`#${targetId}`}
            onClick={handleCta}
            aria-label={
              isProductHome
                ? "Assemble my trip, jump to the trip builder"
                : "Get early access, jump to the waitlist signup"
            }
            className="ml-1 inline-flex items-center gap-1 font-bold text-white bg-white/15 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white transition-colors px-3 py-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--blue-bright)]"
          >
            {isProductHome ? "Assemble my trip →" : "Get early access →"}
          </a>
        </p>

        {/* Auth entry points, top right. Skipped while auth state loads to avoid
            a login→my-trips flicker for signed-in visitors. */}
        {!loading && (
          <nav
            aria-label="Account"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3"
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
