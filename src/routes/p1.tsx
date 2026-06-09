// P1 ad-hoc landing page: prompt-first trip builder.
//
// The whole concept: paste your prompt (or an itinerary from anywhere) and we
// build the bookable day-by-day plan. No granular inputs at P1 — a future
// granular-input CTA can reuse TripPreferencesSchema's optional fields.

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MapPin, ExternalLink, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent } from "@/lib/analytics-events";
import type { ItineraryItem, Trip } from "@/lib/trip/types";

export const Route = createFileRoute("/p1")({
  head: () => ({
    meta: [
      { title: "Build your Indonesia trip — exploreindonesia.ai" },
      {
        name: "description",
        content:
          "Paste your Indonesia trip idea or itinerary and get a day-by-day plan with real, bookable prices.",
      },
      // Ad-hoc P1 test page — keep out of the index until it graduates.
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: P1Page,
});

const PARTNER_LABEL: Record<string, string> = {
  viator: "Viator",
  klook: "Klook",
  booking: "Booking.com",
  "12go": "12Go",
  airalo: "Airalo",
};

const EXAMPLE_PROMPTS = [
  "10 days in Bali and the Gili Islands in July, mid-range budget, couple, love snorkeling and food",
  "One week Java: Yogyakarta temples, Mount Bromo sunrise, ending in Bali",
  "Honeymoon: 12 relaxed days, luxury, beaches + a few cultural days, no early mornings",
];

type Phase = "form" | "generating" | "matching" | "done";

// GA4 affiliate click event. gtag is lazy-loaded after Cookiebot consent
// (analytics-consent.ts) — guard so a click before consent never throws.
function fireAffiliateClick(item: ItineraryItem) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", "affiliate_click", {
      partner: item.partner,
      category: item.category,
      location: item.location,
      price: item.price,
    });
  }
  // Also push to dataLayer so GTM-side tags see it regardless of gtag timing.
  trackEvent("affiliate_click", {
    partner: item.partner,
    category: item.category,
    location: item.location,
    price: item.price,
  });
}

function P1Page() {
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buildTrip() {
    setError(null);
    setPhase("generating");
    setTrip(null);

    try {
      const res = await fetch("/api/public/build-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = (await res.json()) as { trip?: Trip; error?: string };
      if (!res.ok || !data.trip) {
        throw new Error(
          data.error === "generation_failed"
            ? "Couldn't build your trip right now — please try again."
            : (data.error ?? "Something went wrong"),
        );
      }

      setTrip(data.trip);
      setPhase("matching");
      trackEvent("trip_generated", { days: data.trip.days, items: data.trip.items.length });

      // Phase 2: resolve affiliate matches while the user reads the plan.
      const matchRes = await fetch("/api/public/match-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: data.trip.items }),
      });
      if (matchRes.ok) {
        const matchData = (await matchRes.json()) as { items: ItineraryItem[] };
        setTrip({ ...data.trip, items: matchData.items });
      } else {
        // Plan is still useful without matches — degrade, don't fail.
        setTrip({
          ...data.trip,
          items: data.trip.items.map((it) =>
            it.matchStatus === "pending"
              ? {
                  ...it,
                  matchStatus: "no_match",
                  noMatchReason: "Matching unavailable — try again later",
                }
              : it,
          ),
        });
      }
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("form");
    }
  }

  const itemsByDay = new Map<number, ItineraryItem[]>();
  for (const item of trip?.items ?? []) {
    itemsByDay.set(item.day, [...(itemsByDay.get(item.day) ?? []), item]);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Paste your trip. We make it bookable.</h1>
      <p className="mt-2 text-muted-foreground">
        Describe your Indonesia trip — or paste an itinerary from anywhere — and get a day-by-day
        plan with real, bookable prices. You review and book every item yourself; nothing is booked
        automatically.
      </p>

      {(phase === "form" || phase === "generating") && (
        <Card className="mt-6">
          <CardContent className="space-y-4 pt-6">
            <Textarea
              rows={8}
              placeholder={"e.g. " + EXAMPLE_PROMPTS[0]}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="text-base"
            />

            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                >
                  {p.slice(0, 52)}…
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              size="lg"
              className="w-full"
              disabled={phase === "generating" || prompt.trim().length < 10}
              onClick={buildTrip}
            >
              {phase === "generating" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building your trip… (~1 min)
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Build my trip
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {trip && (
        <section className="mt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">{trip.title}</h2>
            <p className="mt-1 text-muted-foreground">{trip.summary}</p>
            {phase === "matching" && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Matching live prices and booking links…
              </p>
            )}
          </div>

          {[...itemsByDay.keys()]
            .sort((a, b) => a - b)
            .map((day) => (
              <div key={day}>
                <h3 className="mb-3 text-lg font-semibold">Day {day}</h3>
                <div className="space-y-3">
                  {itemsByDay.get(day)!.map((item, i) => (
                    <ItemCard key={`${day}-${i}`} item={item} />
                  ))}
                </div>
              </div>
            ))}

          <Button variant="outline" onClick={() => setPhase("form")}>
            Edit my prompt and rebuild
          </Button>
        </section>
      )}
    </main>
  );
}

function ItemCard({ item }: { item: ItineraryItem }) {
  const bookable = item.type === "bookable";

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {item.time && (
              <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
            )}
            <h4 className="font-medium">{item.title}</h4>
            {!bookable && (
              <Badge variant="secondary" className="gap-1">
                <Info className="h-3 w-3" /> Info
              </Badge>
            )}
            {bookable && item.matchStatus === "matched" && item.partner && (
              <Badge variant="outline">{PARTNER_LABEL[item.partner] ?? item.partner}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {item.location}
          </p>
        </div>

        {bookable && (
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            {item.matchStatus === "pending" && (
              <>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-24" />
              </>
            )}
            {item.matchStatus === "matched" && item.deepLink && (
              <>
                {item.price !== undefined && (
                  <span className="text-sm font-semibold">
                    from {item.currency ?? "USD"} {item.price}
                  </span>
                )}
                <Button asChild size="sm">
                  <a
                    href={item.deepLink}
                    target="_blank"
                    rel="noopener nofollow sponsored"
                    onClick={() => fireAffiliateClick(item)}
                  >
                    Book <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </>
            )}
            {item.matchStatus === "no_match" && (
              <span className="max-w-[12rem] text-right text-xs text-muted-foreground">
                {item.noMatchReason ?? "Not bookable online"}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
