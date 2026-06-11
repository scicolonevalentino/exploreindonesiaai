// P1 ad-hoc landing page: prompt-first trip builder, real AI + real matching.
//
// Visual language deliberately mirrors /prototype (same stages, palette,
// typography, card anatomy) — the only difference is that the trip here is
// generated live and the Book links are real affiliate deep links.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  Camera,
  Car,
  ExternalLink,
  Footprints,
  Info,
  Lightbulb,
  Ship,
  Sparkles,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics-events";
import { downloadItineraryPdf } from "@/lib/trip/pdf";
import type { Insight, InsightLabel, ItineraryItem, Trip } from "@/lib/trip/types";

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

/* -------------------------------------------------------------------------- */
/*  Partner branding (same treatment as /prototype SOURCE_LABEL/SOURCE_COLOR) */
/* -------------------------------------------------------------------------- */

const PARTNER_LABEL: Record<string, string> = {
  viator: "VIATOR",
  getyourguide: "GETYOURGUIDE",
  klook: "KLOOK",
  booking: "BOOKING.COM",
  "12go": "12GO",
  airalo: "AIRALO",
  welcomepickups: "WELCOME PICKUPS",
};
const PLATFORM_NAME: Record<string, string> = {
  viator: "Viator",
  getyourguide: "GetYourGuide",
  klook: "Klook",
  booking: "Booking.com",
  "12go": "12Go",
  airalo: "Airalo",
  welcomepickups: "Welcome Pickups",
};
const PARTNER_COLOR: Record<string, string> = {
  viator: "#1f9e87",
  getyourguide: "#e0533a",
  klook: "#ef7a23",
  booking: "#1b3aa0",
  "12go": "#f1b73a",
  airalo: "#d8326e",
  welcomepickups: "#16a34a",
};

const MIN_PASTE_LENGTH = 20;

// Branded fallback thumbnail per category, used when a partner returns no photo
// (eSIM, ferry, GetYourGuide/Klook, non-Viator recommended). Looks intentional
// instead of an empty box. Real photos can replace these later.
const CATEGORY_THUMB: Record<string, { Icon: LucideIcon; grad: string }> = {
  esim: { Icon: Wifi, grad: "linear-gradient(135deg,#0e7490,#155e75)" },
  ferry_transport: { Icon: Ship, grad: "linear-gradient(135deg,#1e6fb0,#0d3b66)" },
  private_transfer: { Icon: Car, grad: "linear-gradient(135deg,#475569,#1e293b)" },
  activity: { Icon: Camera, grad: "linear-gradient(135deg,#0a8a6e,#065f46)" },
  spa_wellness: { Icon: Sparkles, grad: "linear-gradient(135deg,#be4a7a,#7c2d52)" },
  accommodation: { Icon: BedDouble, grad: "linear-gradient(135deg,#5a4cb0,#312e81)" },
};
const DEFAULT_THUMB = { Icon: Camera, grad: "linear-gradient(135deg,#0a8a6e,#065f46)" };

// Day items render grouped into these slots, in this order. "Full day" first so
// a whole-day tour sits above any stray Morning/Afternoon items.
const SLOT_ORDER = ["Full day", "Morning", "Afternoon", "Evening"] as const;

const INSIGHT_LABEL: Record<InsightLabel, { text: string; bg: string; fg: string }> = {
  ai_blind_spot: {
    text: "AI assistants get this wrong",
    bg: "var(--gold-warm)",
    fg: "var(--navy-deep)",
  },
  local_knowledge: { text: "Local knowledge", bg: "var(--blue-bright)", fg: "#ffffff" },
  easy_to_miss: { text: "Easy to miss", bg: "var(--navy-deep)", fg: "#ffffff" },
};

/* -------------------------------------------------------------------------- */
/*  GA4                                                                       */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Page: input → building → trip                                             */
/* -------------------------------------------------------------------------- */

type Stage = "input" | "building" | "trip";

export function P1Page() {
  const [stage, setStage] = useState<Stage>("input");
  const [prompt, setPrompt] = useState("");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [matching, setMatching] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [stage]);

  async function buildTrip() {
    setError(null);
    setStage("building");
    setTrip(null);
    setInsights([]);

    let meta: { title: string; summary: string; days: number } = {
      title: "Your Indonesia Trip",
      summary: "",
      days: 0,
    };
    const collected: ItineraryItem[] = [];

    try {
      const res = await fetch("/api/public/build-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      // Validation / rate-limit errors come back as plain JSON, not a stream.
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          data.error === "generation_failed"
            ? "Couldn't build your trip right now — please try again."
            : (data.error ?? "Something went wrong"),
        );
      }

      // Read the Server-Sent Events: a `meta` line, then one `item` per item,
      // then `insights` and `done`. Render each item the moment it arrives.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let streamError = false;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() ?? ""; // keep the trailing partial event
        for (const evt of events) {
          const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          let msg: {
            type: string;
            meta?: typeof meta;
            item?: ItineraryItem;
            insights?: Insight[];
          };
          try {
            msg = JSON.parse(dataLine.slice(5).trim());
          } catch {
            continue;
          }
          if (msg.type === "meta" && msg.meta) {
            meta = msg.meta;
            setStage("trip");
            setMatching(true);
            setTrip({ ...meta, items: [] });
          } else if (msg.type === "item" && msg.item) {
            collected.push(msg.item);
            setTrip({ ...meta, items: [...collected] });
          } else if (msg.type === "insights") {
            const got = msg.insights ?? [];
            setInsights(got);
            if (got.length) trackEvent("insights_shown", { count: got.length });
          } else if (msg.type === "error") {
            streamError = true;
          }
        }
      }

      if (streamError || collected.length === 0) {
        throw new Error("Couldn't build your trip right now — please try again.");
      }
      trackEvent("trip_generated", { days: meta.days, items: collected.length });

      // Phase 2: resolve affiliate matches while the user reads the plan.
      const matchRes = await fetch("/api/public/match-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: collected }),
      });
      if (matchRes.ok) {
        const matchData = (await matchRes.json()) as { items: ItineraryItem[] };
        setTrip({ ...meta, items: matchData.items });
      } else {
        // Plan is still useful without matches — degrade, don't fail.
        setTrip({
          ...meta,
          items: collected.map((it) =>
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
      setMatching(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStage("input");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf9f5" }}>
      {stage === "input" && (
        <InputStage value={prompt} onChange={setPrompt} onStart={buildTrip} error={error} />
      )}
      {stage === "building" && <BuildingStage />}
      {stage === "trip" && trip && (
        <TripStage
          trip={trip}
          matching={matching}
          insights={insights}
          onEdit={() => setStage("input")}
        />
      )}
    </div>
  );
}

/* ---- Stage 1: Input (prototype hero + paste card) ---- */

function InputStage({
  value,
  onChange,
  onStart,
  error,
}: {
  value: string;
  onChange: (next: string) => void;
  onStart: () => void;
  error: string | null;
}) {
  const trimmedLength = value.trim().length;
  const canSubmit = trimmedLength >= MIN_PASTE_LENGTH;

  const handleStart = () => {
    trackEvent("assemble_trip_click");
    onStart();
  };

  return (
    <div
      className="flex-1 w-full"
      style={{
        background: "radial-gradient(ellipse at top, #0a4a47 0%, #062d2a 65%, #041e1c 100%)",
        color: "#f2eee4",
      }}
    >
      <header className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <span className="font-bold text-lg sm:text-xl tracking-tight">
          exploreindonesia<span style={{ color: "var(--blue-ice)" }}>.ai</span>
        </span>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-12 pb-20 text-center">
        <p
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] mb-6"
          style={{ color: "var(--blue-ice)" }}
        >
          AI itinerary planning · Powered by real experiences
        </p>
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Have you planned your trip to Indonesia?
        </h1>
        <p
          className="text-4xl sm:text-6xl md:text-7xl italic leading-[1.05] mb-10"
          style={{ fontFamily: "var(--font-serif)", color: "var(--gold-warm)" }}
        >
          We make it <span className="whitespace-nowrap">ready-to-book</span>
        </p>
        <p className="text-base sm:text-lg max-w-2xl mx-auto text-white/80 mb-10">
          Paste the Indonesia itinerary you already have — from ChatGPT, a blog, or your notes — or
          just describe the trip you want. We turn it into a day-by-day plan you can actually book.
        </p>

        <div
          className="rounded-2xl p-5 sm:p-6 text-left shadow-2xl mx-auto"
          style={{ backgroundColor: "#f3f1ea", color: "var(--navy-deep)" }}
        >
          <label htmlFor="p1-paste" className="block text-sm font-bold mb-3">
            Paste your itinerary, or describe your trip
          </label>
          <textarea
            id="p1-paste"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. 10 days in Bali and the Gili Islands in July, couple, mid-range, love snorkeling and food — or paste a full itinerary here"
            rows={10}
            className="w-full text-sm sm:text-[15px] leading-6 p-4 rounded-lg border bg-white/70 whitespace-pre-wrap resize-y focus:outline-none focus:ring-2 focus:ring-[var(--blue-bright)] focus:border-transparent"
            style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
          />
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs sm:text-sm text-[var(--slate-muted)] min-h-[1.25rem]">
              {error ?? (canSubmit ? "Looks good — ready to assemble." : "")}
            </p>
            <button
              type="button"
              onClick={canSubmit ? handleStart : undefined}
              aria-disabled={!canSubmit}
              tabIndex={canSubmit ? 0 : -1}
              className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-white transition-all bg-[var(--blue-bright)] ${
                canSubmit
                  ? "hover:bg-black cursor-pointer opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              Assemble my trip <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- Stage 2: Building (prototype assembling screen, real async) ---- */

const STEPS = [
  { num: 1, title: "Your plan", sub: "as you wrote it" },
  { num: 2, title: "Reading", sub: "day by day" },
  { num: 3, title: "Grouping", sub: "what fits together" },
  { num: 4, title: "Designing", sub: "your itinerary" },
  { num: 5, title: "Finding", sub: "real experiences" },
];

const PROGRESS_MSGS = [
  "Reading your trip line by line…",
  "Grouping activities into days…",
  "Checking routes, timing and geography…",
  "Writing your day-by-day plan…",
  "Almost there — polishing the details…",
];

function BuildingStage() {
  // Generation takes ~30-60s; advance steps on a timer but never claim "done" —
  // the parent switches stage when the real response lands.
  const [activeStep, setActiveStep] = useState(0);
  const STEP_MS = 8000;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEP_MS);
    return () => clearInterval(timer);
  }, []);

  const pct = ((activeStep + 1) / (STEPS.length + 1)) * 100;

  return (
    <div
      className="flex-1 w-full flex flex-col items-center justify-center px-6 py-16"
      style={{
        background: "radial-gradient(ellipse at top, #0a4a47 0%, #062d2a 65%, #041e1c 100%)",
        color: "#f2eee4",
      }}
    >
      <p
        className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] mb-4"
        style={{ color: "var(--blue-ice)" }}
      >
        02 · Assembling
      </p>
      <h2
        className="text-4xl sm:text-5xl font-bold mb-10 text-center"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Building your trip…
      </h2>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-2 sm:gap-3 w-full max-w-3xl mb-12">
        {STEPS.map((s, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <div key={s.num} className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div
                className="rounded-xl px-4 py-3 w-full sm:w-auto sm:min-w-[150px] text-center transition-all"
                style={{
                  backgroundColor: isActive ? "rgba(94, 234, 212, 0.18)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? "var(--blue-ice)" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isActive ? "0 0 24px rgba(94,234,212,0.35)" : undefined,
                  opacity: isDone ? 0.7 : 1,
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: "var(--blue-ice)" }}
                >
                  Step {s.num}
                </div>
                <div className="font-semibold text-sm">{s.title}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.sub}</div>
              </div>
              {i < STEPS.length - 1 && <span className="hidden sm:inline text-white/40">›</span>}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/60 mb-2">
          <span>This usually takes about a minute</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div
          className="h-2 w-full rounded-full overflow-hidden bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-label="Building your trip"
        >
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, var(--blue-bright), var(--gold-warm))",
            }}
          />
        </div>
        <p
          className="text-center text-base sm:text-lg mt-4 text-white font-medium flex items-center justify-center gap-2"
          aria-live="polite"
        >
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--blue-ice)" }}
            aria-hidden
          />
          {PROGRESS_MSGS[activeStep]}
        </p>
      </div>
    </div>
  );
}

/* ---- Stage 3: Trip (prototype trip view, live data) ---- */

function TripStage({
  trip,
  matching,
  insights,
  onEdit,
}: {
  trip: Trip;
  matching: boolean;
  insights: Insight[];
  onEdit: () => void;
}) {
  const itemsByDay = new Map<number, ItineraryItem[]>();
  for (const item of trip.items) {
    itemsByDay.set(item.day, [...(itemsByDay.get(item.day) ?? []), item]);
  }
  // Real, post-generation stats for the trip header (counts, not fake demo data).
  const recommendedCount = trip.items.filter((i) => i.suggested).length;
  const bookableCount = trip.items.filter((i) => i.type === "bookable" && !i.suggested).length;
  const STATS = [
    { n: trip.days, label: "Days" },
    { n: bookableCount, label: "Bookable" },
    { n: recommendedCount, label: "Recommended" },
    { n: insights.length, label: "Local insights" },
  ];

  // Matched bookables start added (prototype's defaultAdded behavior).
  const [added, setAdded] = useState<Set<string>>(new Set());
  useEffect(() => {
    const next = new Set<string>();
    for (const [day, items] of itemsByDay) {
      items.forEach((item, i) => {
        if (item.matchStatus === "matched") next.add(`${day}-${i}`);
      });
    }
    setAdded(next);
    // Re-seed only when match results land, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matching]);

  const toggle = (key: string, item: ItineraryItem) => {
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        trackEvent("add_to_trip", {
          item_name: item.title,
          platform: item.partner ? PLATFORM_NAME[item.partner] : undefined,
          price: item.price,
        });
      }
      return next;
    });
  };

  const totals = (() => {
    let count = 0;
    let total = 0;
    for (const [day, items] of itemsByDay) {
      items.forEach((item, i) => {
        if (!added.has(`${day}-${i}`)) return;
        count += 1;
        if (item.price !== undefined) total += item.price;
      });
    }
    return { count, total: Math.round(total) };
  })();

  // P1 conversion CTA. Future: this is where the login wall goes — the
  // download becomes the lead-capture moment (sign in to get your itinerary).
  // The PDF embeds every booking link as a real clickable annotation, so the
  // affiliate tracking travels with the file.
  const downloadItinerary = () => {
    trackEvent("download_itinerary_click", {
      items_added: totals.count,
      estimated_total: totals.total,
    });
    downloadItineraryPdf(trip, added, insights);
  };

  return (
    <div
      className="flex-1 w-full"
      style={{ backgroundColor: "#faf9f5", color: "var(--navy-deep)" }}
    >
      <header className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--navy-deep)] hover:underline px-1.5 sm:px-2 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          Edit
          <span className="hidden sm:inline"> itinerary</span>
        </button>
      </header>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <div className="mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em] mb-2"
            style={{ color: "var(--teal-link)" }}
          >
            {matching ? "Your trip · Matching live prices…" : "Your trip · Ready to book"}
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {trip.title}
          </h1>
          <p className="text-sm text-[var(--slate-muted)] max-w-2xl">{trip.summary}</p>

          {/* Real trip stats (post-generation), styled like the prototype's
              assembling counters but with true numbers. */}
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl sm:text-4xl font-bold leading-none"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--navy-deep)" }}
                >
                  {s.n}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-[var(--slate-muted)] mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {[...itemsByDay.keys()]
            .sort((a, b) => a - b)
            .map((day) => (
              <DayBlock
                key={day}
                day={day}
                items={itemsByDay.get(day)!}
                insights={insights.filter((ins) => ins.day === day)}
                added={added}
                onToggle={toggle}
              />
            ))}
        </div>
      </section>

      {/* Inline totals + CTA — prototype layout, Download instead of Review & book */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div
          className="rounded-2xl border bg-white px-6 py-5 flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "var(--border-cream)" }}
        >
          <div className="text-sm">
            <span className="font-semibold">{totals.count} experiences added</span>
            <span className="text-[var(--slate-muted)] mx-3">·</span>
            <span className="text-[var(--slate-muted)]">Estimated total </span>
            <span
              className="font-bold text-xl"
              style={{ fontFamily: "var(--font-serif)", color: "var(--navy-deep)" }}
            >
              ${totals.total}
            </span>
          </div>
          <button
            type="button"
            onClick={downloadItinerary}
            className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-white bg-[var(--blue-bright)] hover:bg-black transition-colors"
          >
            Download the itinerary (PDF) <span aria-hidden>↓</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Woven into the day blocks like the prototype's self-guided cards: same
// dashed-card anatomy (round icon, uppercase kicker, bold title, muted body).
function InsightCard({ insight }: { insight: Insight }) {
  const label = INSIGHT_LABEL[insight.label] ?? INSIGHT_LABEL.local_knowledge;
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl border border-dashed"
      style={{ borderColor: "var(--border-cream)", backgroundColor: "#fbf2dd" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <Lightbulb className="w-5 h-5" style={{ color: "var(--teal-link)" }} aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: label.bg, color: label.fg }}
          >
            {label.text}
          </span>
        </div>
        <h3 className="font-bold text-base">{insight.destination}</h3>
        <p className="text-sm text-[var(--slate-muted)] mt-1">{insight.tip}</p>
      </div>
    </div>
  );
}

function DayBlock({
  day,
  items,
  insights,
  added,
  onToggle,
}: {
  day: number;
  items: ItineraryItem[];
  insights: Insight[];
  added: Set<string>;
  onToggle: (key: string, item: ItineraryItem) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div
          className="rounded-xl px-3 py-2 text-center text-white shrink-0"
          style={{ backgroundColor: "var(--navy-deep)" }}
        >
          <div className="text-[10px] uppercase tracking-widest opacity-70">Day</div>
          <div
            className="text-xl font-bold leading-none"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {day}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
            {items[0]?.location ?? `Day ${day}`}
          </h2>
        </div>
        <div
          className="flex-1 border-t hidden sm:block"
          style={{ borderColor: "var(--border-cream)" }}
        />
      </div>

      <div className="space-y-5">
        {SLOT_ORDER.map((slot) => {
          // Keep each item's ORIGINAL index so add-to-trip keys stay stable.
          const inSlot = items
            .map((item, i) => ({ item, i }))
            .filter(({ item }) => (item.time ?? "Morning") === slot);
          if (inSlot.length === 0) return null;
          return (
            <div key={slot} className="space-y-3">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--slate-muted)" }}
              >
                {slot}
              </p>
              {inSlot.map(({ item, i }) => (
                <ItemCard
                  key={`${day}-${i}`}
                  item={item}
                  added={added.has(`${day}-${i}`)}
                  onToggle={() => onToggle(`${day}-${i}`, item)}
                />
              ))}
            </div>
          );
        })}
        {insights.map((insight, i) => (
          <InsightCard key={`ins-${day}-${i}`} insight={insight} />
        ))}
      </div>
    </div>
  );
}

function ItemCard({
  item,
  added,
  onToggle,
}: {
  item: ItineraryItem;
  added: boolean;
  onToggle: () => void;
}) {
  // Informational items use the prototype's dashed "self-guided" card.
  if (item.type === "informational") {
    const isTransport = item.category === "on_demand_transport";
    return (
      <div
        className="flex items-start gap-4 p-4 rounded-xl border border-dashed"
        style={{ borderColor: "var(--border-cream)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--cream)" }}
        >
          {isTransport ? (
            <Info className="w-5 h-5" style={{ color: "var(--teal-link)" }} aria-hidden />
          ) : (
            <Footprints className="w-5 h-5" style={{ color: "var(--teal-link)" }} aria-hidden />
          )}
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-widest font-semibold mb-1"
            style={{ color: "var(--teal-link)" }}
          >
            {isTransport ? "On the spot · Grab / Gojek" : "Good to know"}
            {item.time ? ` · ${item.time}` : ""}
          </p>
          <h3 className="font-bold text-base">{item.title}</h3>
          <p className="text-sm text-[var(--slate-muted)] mt-1">{item.description}</p>
        </div>
      </div>
    );
  }

  const platform = item.partner ? PLATFORM_NAME[item.partner] : undefined;
  const matched = item.matchStatus === "matched" && item.deepLink;
  const pending = item.matchStatus === "pending";
  // An eSIM is bought, not booked.
  const bookVerb = item.category === "esim" ? "Buy" : "Book";

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl border transition-all ${
        added ? "ring-2 ring-[var(--blue-bright)]" : ""
      }`}
      style={{
        borderColor: "var(--border-cream)",
        backgroundColor: item.suggested ? "#fbf2dd" : "white",
      }}
    >
      <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[140px_1fr_auto] gap-3 sm:gap-4">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            (() => {
              const thumb = CATEGORY_THUMB[item.category] ?? DEFAULT_THUMB;
              return (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-2 text-white text-center"
                  style={{ background: thumb.grad }}
                >
                  <thumb.Icon className="w-6 h-6 opacity-90" aria-hidden />
                  <span className="text-[10px] font-medium leading-tight opacity-90 line-clamp-2 hidden sm:block">
                    {item.location}
                  </span>
                </div>
              );
            })()
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            {item.suggested && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "#b58a3a" }}
              >
                <Sparkles className="w-3 h-3" aria-hidden /> Recommended
              </span>
            )}
            {matched && item.partner && (
              <span
                className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-white"
                style={{ backgroundColor: PARTNER_COLOR[item.partner] ?? "var(--navy-deep)" }}
              >
                ● {PARTNER_LABEL[item.partner] ?? item.partner}
              </span>
            )}
            {pending && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wider animate-pulse"
                style={{ color: "var(--teal-link)" }}
              >
                ● Matching…
              </span>
            )}
          </div>

          <h3
            className="font-bold text-sm sm:text-lg leading-snug break-words"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-[var(--slate-muted)] mt-1.5 sm:mt-2">
            {item.description}
          </p>
          <p className="text-xs text-[var(--slate-muted)] mt-1">📍 {item.location}</p>
        </div>

        <div className="hidden sm:flex flex-col items-end justify-between gap-2 text-right">
          {matched ? (
            <>
              <div>
                {item.price !== undefined ? (
                  <>
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-serif)", color: "var(--navy-deep)" }}
                    >
                      {item.currency === "USD" || !item.currency ? "$" : `${item.currency} `}
                      {item.price}
                    </span>
                    <span className="text-xs text-[var(--slate-muted)] ml-1">from</span>
                  </>
                ) : (
                  <span className="text-xs text-[var(--slate-muted)]">See price on site</span>
                )}
              </div>
              {/* Book is the conversion — the loud, colored, primary CTA. */}
              <a
                href={item.deepLink}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() => fireAffiliateClick(item)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-110"
                style={{ backgroundColor: "var(--blue-bright)" }}
              >
                {bookVerb} now on {platform} <ExternalLink className="w-4 h-4" aria-hidden />
              </a>
              {/* Add-to-trip is the quiet secondary (drives the PDF contents). */}
              <button
                type="button"
                onClick={onToggle}
                className={`text-xs font-semibold transition-colors ${
                  added
                    ? "text-[var(--teal-link)]"
                    : "text-[var(--slate-muted)] hover:text-[var(--navy-deep)]"
                }`}
              >
                {added ? "✓ Added to trip" : "+ Add to trip"}
              </button>
            </>
          ) : pending ? (
            <div className="flex flex-col items-end gap-2">
              <div
                className="h-7 w-20 rounded animate-pulse"
                style={{ backgroundColor: "#e6dfd0" }}
              />
              <div
                className="h-9 w-28 rounded-full animate-pulse"
                style={{ backgroundColor: "#e6dfd0" }}
              />
            </div>
          ) : (
            <span className="max-w-[11rem] text-xs text-[var(--slate-muted)]">
              {item.noMatchReason ?? "Not bookable online"}
            </span>
          )}
        </div>
      </div>

      {/* Mobile-only price + CTA */}
      <div className="sm:hidden mt-3 pt-3 border-t" style={{ borderColor: "var(--border-cream)" }}>
        {matched ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                {item.price !== undefined && (
                  <span
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-serif)", color: "var(--navy-deep)" }}
                  >
                    {item.currency === "USD" || !item.currency ? "$" : `${item.currency} `}
                    {item.price}
                  </span>
                )}
              </div>
              <a
                href={item.deepLink}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() => fireAffiliateClick(item)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-sm"
                style={{ backgroundColor: "var(--blue-bright)" }}
              >
                {bookVerb} on {platform} <ExternalLink className="w-4 h-4" aria-hidden />
              </a>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className={`mt-2 text-xs font-semibold ${
                added ? "text-[var(--teal-link)]" : "text-[var(--slate-muted)]"
              }`}
            >
              {added ? "✓ Added to trip" : "+ Add to trip"}
            </button>
          </>
        ) : pending ? (
          <div
            className="h-9 w-full rounded-full animate-pulse"
            style={{ backgroundColor: "#e6dfd0" }}
          />
        ) : (
          <p className="text-xs text-[var(--slate-muted)]">
            {item.noMatchReason ?? "Not bookable online"}
          </p>
        )}
      </div>
    </div>
  );
}
