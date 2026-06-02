import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "hellobar-dismissed-v1";

export function HelloBar() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setDismissed(true);
    } catch {
      // ignore
    }
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  const handleCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("early-access");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Focus the email input shortly after scroll begins.
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
        backgroundColor: "var(--navy-deep)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex items-center justify-center gap-3 relative">
        <p className="text-center leading-snug pr-8">
          <span className="hidden sm:inline">
            Plan your Indonesia trip — book it in minutes.{" "}
          </span>
          <span className="sm:hidden">Early access opening soon. </span>
          <a
            href="#early-access"
            onClick={handleCta}
            className="font-semibold underline underline-offset-4 hover:opacity-90"
            style={{ color: "var(--gold-warm)" }}
          >
            Get early access →
          </a>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
