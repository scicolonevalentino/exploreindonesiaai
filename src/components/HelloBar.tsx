import { useRouterState } from "@tanstack/react-router";

export function HelloBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // The prototype page has its own dedicated feedback bar — hide the global one
  // there. Also hidden on the trip-builder/auth surfaces: a "get early access"
  // waitlist bar makes no sense where the user is already using the product.
  if (["/prototype", "/p1", "/login", "/account"].includes(pathname)) return null;

  const handleCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("early-access");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        const input = el.querySelector<HTMLInputElement>('input[type="email"]');
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center justify-center gap-3">
        <p className="text-center leading-snug font-medium">
          <span className="hidden sm:inline">Plan your Indonesia trip. Book it in minutes. </span>
          <span className="sm:hidden">Launching soon. </span>
          <a
            href="#early-access"
            onClick={handleCta}
            aria-label="Get early access — jump to the waitlist signup"
            className="ml-1 inline-flex items-center gap-1 font-bold text-white bg-white/15 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white transition-colors px-3 py-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--blue-bright)]"
          >
            Get early access →
          </a>
        </p>
      </div>
    </div>
  );
}
