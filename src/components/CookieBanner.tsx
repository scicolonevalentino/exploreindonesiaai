import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getConsent, setConsent } from "@/lib/analytics-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (value: "accepted" | "rejected") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4"
    >
      <div
        className="mx-auto max-w-3xl rounded-2xl shadow-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
        style={{
          backgroundColor: "#ffffff",
          borderColor: "var(--border-cream)",
        }}
      >
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: "var(--text-dark)" }}
        >
          We use cookies to measure traffic and improve the site (Google
          Analytics, Contentsquare). No cookies fire until you choose. Read our{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-2 font-medium"
            style={{ color: "var(--teal-link)" }}
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium border transition-colors hover:bg-black/5"
            style={{
              borderColor: "var(--border-cream)",
              color: "var(--navy-deep)",
            }}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--blue-bright)" }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
