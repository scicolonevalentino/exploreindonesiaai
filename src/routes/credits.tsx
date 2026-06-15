import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/lib/supabase/useUser";
import { getCreditBalance } from "@/lib/supabase/credits";
import { CREDIT_BUNDLES, formatPrice, type CreditBundle } from "@/lib/credits/bundles";
import { trackEvent } from "@/lib/analytics-events";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: "Buy credits, ExploreIndonesia.ai" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CreditsPage,
});

function CreditsPage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [buying, setBuying] = useState<string | null>(null);

  // Bounce signed-out visitors to login (same guard as /account).
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const refreshBalance = useCallback(() => {
    if (!user) return;
    void getCreditBalance().then(setBalance);
  }, [user]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  // Handle the return from Stripe Checkout. On success the webhook credits the
  // ledger asynchronously, so we poll the balance a few times before giving up.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const status = new URLSearchParams(window.location.search).get("status");
    if (!status) return;
    window.history.replaceState({}, "", "/credits");
    if (status === "cancelled") {
      toast("Checkout cancelled. No charge was made.");
      return;
    }
    if (status === "success") {
      toast.success("Payment received. Adding your credits…");
      let tries = 0;
      const tick = () => {
        tries += 1;
        void getCreditBalance().then((b) => {
          setBalance(b);
          if (tries < 6) setTimeout(tick, 1500);
        });
      };
      setTimeout(tick, 1000);
    }
  }, []);

  const buy = useCallback(async (bundle: CreditBundle) => {
    setBuying(bundle.id);
    trackEvent("credit_checkout_start", { bundle: bundle.id, credits: bundle.credits });
    try {
      const res = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle: bundle.id }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast.error("Couldn't start checkout. Please try again.");
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
    }
    setBuying(null);
  }, []);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/account"
            className="text-sm font-semibold"
            style={{ color: "var(--teal-link)" }}
          >
            ← My account
          </Link>
          <div
            className="text-sm font-semibold rounded-full px-4 py-1.5"
            style={{
              backgroundColor: "#fff",
              color: "var(--navy-mid)",
              border: "1px solid var(--border-cream)",
            }}
          >
            {balance === null ? "…" : `${balance} credit${balance === 1 ? "" : "s"}`}
          </div>
        </div>

        <div className="text-center mb-10">
          <p
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-3"
            style={{ color: "var(--teal-link)" }}
          >
            Pro credits
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
            style={{ color: "var(--navy-mid)" }}
          >
            Refine your trip, one iteration at a time
          </h1>
          <p
            className="mt-4 text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-dark)" }}
          >
            1 credit = 1 AI edit. Credits never expire. No subscription.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {CREDIT_BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className="relative rounded-2xl p-6 flex flex-col"
              style={{
                backgroundColor: "#fff",
                border: bundle.popular
                  ? "2px solid var(--blue-bright)"
                  : "1px solid var(--border-cream)",
              }}
            >
              {bundle.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: "var(--blue-bright)" }}
                >
                  Most popular
                </span>
              )}
              <h2
                className="font-serif text-2xl font-semibold"
                style={{ color: "var(--navy-mid)" }}
              >
                {bundle.name}
              </h2>
              <div className="mt-2 mb-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: "var(--navy-deep)" }}>
                  {formatPrice(bundle.priceCents, bundle.currency)}
                </span>
                <span className="text-sm" style={{ color: "var(--text-dark)" }}>
                  {bundle.credits} credits
                </span>
              </div>
              <p className="text-sm mt-2 mb-6 flex-1" style={{ color: "var(--text-dark)" }}>
                {bundle.blurb}
              </p>
              <Button
                onClick={() => void buy(bundle)}
                disabled={buying !== null}
                className="w-full text-white font-semibold"
                style={{ backgroundColor: "var(--blue-bright)" }}
              >
                {buying === bundle.id ? "Starting checkout…" : `Buy ${bundle.name}`}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
