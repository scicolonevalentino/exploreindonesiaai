// "Get this trip arranged for you", the quote-request popup on each saved-trip
// card. Reuses the existing contact pipeline (sendContactMessage → Brevo →
// founder's inbox, reply-to = the user). The saved trip's title + original
// prompt are folded into the message so each lead arrives with its brief.
// This is the lean intent-test for the future "Quote" monetization tier.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendContactMessage } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics-events";
import { toast } from "sonner";
import type { SavedTripRow } from "@/lib/supabase/trips";

export function QuoteRequestModal({
  trip,
  open,
  onOpenChange,
  userEmail,
  userName,
}: {
  trip: SavedTripRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  userName: string;
}) {
  const send = useServerFn(sendContactMessage);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const mountedAtRef = useRef<number>(Date.now());

  // Reset + restamp the anti-spam timer each time the popup opens.
  useEffect(() => {
    if (!open) return;
    mountedAtRef.current = Date.now();
    setName(userName);
    setEmail(userEmail);
    setNotes("");
    setWebsite("");
    setStatus("idle");
    setErrorMsg("");
  }, [open, userName, userEmail]);

  const days = trip?.trip_json?.trip?.days;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trip || status === "loading" || status === "done") return;
    if (!name.trim() || !email.trim() || notes.trim().length < 10) {
      setStatus("error");
      setErrorMsg("Please add your name, email, and a few words about what you'd like.");
      return;
    }

    // Fold the trip context into the message so the founder gets the brief.
    const message =
      `QUOTE REQUEST, saved trip: "${trip.title}"${days ? ` (${days} days)` : ""}\n` +
      `Original idea: ${trip.prompt || "(none)"}\n\n` +
      `What they'd like help with:\n${notes.trim()}`;

    setStatus("loading");
    setErrorMsg("");
    try {
      await send({
        data: {
          name: name.trim(),
          email: email.trim(),
          message,
          website,
          elapsedMs: Date.now() - mountedAtRef.current,
        },
      });
      setStatus("done");
      trackEvent("quote_request_submit", { trip_id: trip.id, title: trip.title });
      toast.success("Request sent, we'll be in touch by email.");
    } catch (err) {
      setStatus("error");
      const raw = err instanceof Error ? err.message : "";
      setErrorMsg(
        /too many/i.test(raw)
          ? "Too many requests, please try again in a minute."
          : "Couldn't send your request, please try again.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: "var(--cream)" }}>
        {status === "done" ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl" style={{ color: "var(--navy-deep)" }}>
                Request sent 🌴
              </DialogTitle>
              <DialogDescription>
                Thanks! We've got your trip and we'll email you a tailored plan and quote soon. No
                obligation.
              </DialogDescription>
            </DialogHeader>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl" style={{ color: "var(--navy-deep)" }}>
                Get this trip arranged for you
              </DialogTitle>
              <DialogDescription>
                {trip ? (
                  <>
                    One of our trusted partners will tailor{" "}
                    <strong>&ldquo;{trip.title}&rdquo;</strong> and send you a quote for free.
                  </>
                ) : null}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 pt-1">
              {/* Honeypot, hidden from humans */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-10000px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label>
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  aria-label="Your name"
                  className="w-full rounded-md border border-[var(--border-cream)] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Your email"
                  autoComplete="email"
                  className="w-full rounded-md border border-[var(--border-cream)] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <textarea
                required
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What would you like help with? e.g. exact dates, flights, a private driver, upgrade the hotels, add a day in Ubud…"
                aria-label="What you'd like help with"
                className="w-full resize-none rounded-md border border-[var(--border-cream)] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />

              {status === "error" && errorMsg && (
                <p role="alert" className="text-xs text-red-500">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:brightness-95 disabled:opacity-60"
                style={{ backgroundColor: "var(--gold-warm)", color: "var(--navy-deep)" }}
              >
                {status === "loading" ? "Sending…" : "Send my request"} <span aria-hidden>→</span>
              </button>

              <p className="text-center text-[11px] text-muted-foreground">
                Free to ask, no obligation. We reply by email.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
