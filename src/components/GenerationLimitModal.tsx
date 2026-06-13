// Shown when a SIGNED-IN user hits the daily free-generation cap. The cap is a
// Pro-demand probe, not a paywall: the whole point of this modal is to let a
// heavy user raise their hand for Pro in ONE click (we already know who they
// are). That click is the ACTIVE signal we measure; closing without clicking is
// the passive signal (the open itself fires `generation_limit_reached`
// upstream). See src/lib/trip/limits.ts and supabase/generations.sql.

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { recordProInterest } from "@/lib/supabase/generations";
import { trackEvent } from "@/lib/analytics-events";

export function GenerationLimitModal({
  open,
  onOpenChange,
  limit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limit: number;
}) {
  const [raised, setRaised] = useState(false);
  const [busy, setBusy] = useState(false);

  const raiseHand = async () => {
    setBusy(true);
    trackEvent("pro_interest_click", { source: "generation_limit", daily_limit: limit });
    await recordProInterest("generation_limit");
    setBusy(false);
    setRaised(true);
  };

  // Dismissing ("I'll come back tomorrow") is its own signal — people who hit the
  // wall but DON'T want Pro yet. The ratio of this vs pro_interest_click tells us
  // how strong the upgrade pull is.
  const dismissTomorrow = () => {
    trackEvent("come_back_tomorrow_click", { source: "generation_limit", daily_limit: limit });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: "var(--cream)" }}>
        {raised ? (
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl" style={{ color: "var(--navy-deep)" }}>
              You're on the list 🎉
            </DialogTitle>
            <DialogDescription>
              We'll email you the moment Pro opens, unlimited trips and the power to edit and refine
              any itinerary. Thanks for helping shape it. Your free trips refresh tomorrow.
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl" style={{ color: "var(--navy-deep)" }}>
                You've reached today's free limit
              </DialogTitle>
              <DialogDescription>
                You've built {limit} trips today, you're clearly planning something good. Your free
                trips refresh tomorrow.
              </DialogDescription>
            </DialogHeader>

            <div
              className="rounded-xl border p-4 mt-1"
              style={{ borderColor: "var(--border-cream)", backgroundColor: "#fbf2dd" }}
            >
              <p
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "#b58a3a" }}
              >
                <Sparkles className="w-3 h-3" aria-hidden /> Coming soon · Pro
              </p>
              <p className="text-sm" style={{ color: "var(--navy-deep)" }}>
                Want to keep planning now? Pro gives you unlimited trips, the power to edit and
                refine any itinerary, and a premium PDF. We're opening early access, be first in
                line.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={raiseHand}
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full text-white transition-all bg-[var(--blue-bright)] hover:bg-black disabled:opacity-60"
              >
                {busy ? "Adding you…" : "Get early access to Pro"} <span aria-hidden>→</span>
              </button>
              <button
                type="button"
                onClick={dismissTomorrow}
                className="text-sm font-medium self-center py-1"
                style={{ color: "var(--slate-muted)" }}
              >
                I'll come back tomorrow
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
