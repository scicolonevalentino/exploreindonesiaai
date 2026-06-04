import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  MessageSquare,
  ArrowLeft,
  Image as ImageIcon,
  Footprints,
  Sparkles,
  Check,
} from "lucide-react";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { trackEvent } from "@/lib/analytics-events";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/prototype")({
  head: () => ({
    meta: [
      { title: "Interactive Prototype — exploreindonesia.ai" },
      {
        name: "description",
        content:
          "Try the exploreindonesia.ai interactive prototype: paste an Indonesia itinerary and see how we turn it into a bookable, day-by-day trip.",
      },
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: "exploreindonesia.ai — interactive prototype" },
      { property: "og:description", content: "Try the prototype and send us feedback." },
    ],
  }),
  component: PrototypePage,
});

/** Minimum non-whitespace characters required before the "Assemble" button becomes clickable. */
export const MIN_PASTE_LENGTH = 40;
/** Lower threshold on mobile to reduce friction when pasting shorter itineraries. */
export const MIN_PASTE_LENGTH_MOBILE = 20;

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
/* -------------------------------------------------------------------------- */

type Source = "klook" | "viator" | "getyourguide" | "12go" | "booking";

const SOURCE_LABEL: Record<Source, string> = {
  klook: "KLOOK",
  viator: "VIATOR",
  getyourguide: "GETYOURGUIDE",
  "12go": "12GO",
  booking: "BOOKING.COM",
};
/** Clean, human-readable supplier names for analytics params (platform). */
const PLATFORM_NAME: Record<Source, string> = {
  klook: "Klook",
  viator: "Viator",
  getyourguide: "GetYourGuide",
  "12go": "12Go",
  booking: "Booking.com",
};
const SOURCE_COLOR: Record<Source, string> = {
  klook: "#ef7a23",
  viator: "#1f9e87",
  getyourguide: "#e0533a",
  "12go": "#f1b73a",
  booking: "#1b3aa0",
};

type Item = {
  id: string;
  kind: "bookable" | "selfguided" | "recommended";
  source?: Source;
  title: string;
  rating?: number;
  reviews?: number;
  matched?: string[];
  clusteredMatch?: boolean;
  price?: number;
  priceUnit?: "per person" | "per car";
  durationLabel?: string;
  description?: string;
  defaultAdded?: boolean;
};

type Day = {
  num: number;
  title: string;
  subtitle: string;
  items: Item[];
};

const TRIP: {
  id: string;
  title: string;
  destination: string;
  locations: string;
  days: Day[];
} = {
  id: "7-days-in-bali",
  title: "7 Days in Bali",
  destination: "Bali",
  locations: "Ubud · Batur · Nusa Penida · Uluwatu · Canggu",
  days: [
    {
      num: 1,
      title: "Arrival & Ubud",
      subtitle: "Denpasar → Ubud",
      items: [
        {
          id: "d1-transfer",
          kind: "bookable",
          source: "klook",
          title: "Private Airport Transfer, DPS to Ubud",
          rating: 4.8,
          reviews: 2140,
          matched: ["Arrive Denpasar (DPS)", "private transfer to Ubud"],
          price: 18,
          priceUnit: "per car",
          durationLabel: "~75 min",
        },
      ],
    },
    {
      num: 2,
      title: "Ubud Highlights",
      subtitle: "Central Bali",
      items: [
        {
          id: "d2-ubud",
          kind: "bookable",
          source: "viator",
          title: "Ubud Highlights: Rice Terrace, Monkey Forest & Tirta Empul",
          rating: 4.7,
          reviews: 8930,
          matched: ["Tegalalang rice terrace", "Sacred Monkey Forest", "Tirta Empul temple"],
          price: 45,
          priceUnit: "per person",
          durationLabel: "Full day · 9h",
          defaultAdded: true,
        },
        {
          id: "d2-campuhan",
          kind: "selfguided",
          title: "Campuhan Ridge Walk at sunset",
          description:
            "Go ~5pm to beat the heat, about 2km each way. No ticket needed; start near Warwick Ibah.",
        },
      ],
    },
    {
      num: 3,
      title: "Batur Sunrise",
      subtitle: "Kintamani",
      items: [
        {
          id: "d3-batur",
          kind: "bookable",
          source: "getyourguide",
          title: "Mount Batur Sunrise Trek with Breakfast",
          rating: 4.9,
          reviews: 5610,
          matched: ["Mount Batur sunrise trek"],
          price: 38,
          priceUnit: "per person",
          durationLabel: "Early start · 2:00am pickup",
          defaultAdded: true,
        },
        {
          id: "d3-spa",
          kind: "recommended",
          title: "Ubud spa & flower-bath ritual",
          price: 28,
          priceUnit: "per person",
          description:
            "A relaxed add-on for your \u201Cfree afternoon by the pool\u201D, only if you'd like it.",
        },
      ],
    },
    {
      num: 4,
      title: "Nusa Penida",
      subtitle: "Island day trip",
      items: [
        {
          id: "d4-nusa",
          kind: "bookable",
          source: "viator",
          title: "Nusa Penida Full-Day Island Tour by Speedboat",
          rating: 4.6,
          reviews: 6240,
          matched: ["Nusa Penida day trip", "Kelingking", "Angel's Billabong", "Broken Beach"],
          clusteredMatch: true,
          price: 72,
          priceUnit: "per person",
          durationLabel: "Full day · 12h",
        },
      ],
    },
    {
      num: 5,
      title: "Uluwatu",
      subtitle: "Bukit Peninsula",
      items: [
        {
          id: "d5-uluwatu",
          kind: "bookable",
          source: "getyourguide",
          title: "Uluwatu Temple & Kecak Fire Dance at Sunset",
          rating: 4.7,
          reviews: 4115,
          matched: ["Uluwatu Temple", "Kecak fire dance at sunset"],
          clusteredMatch: true,
          price: 32,
          priceUnit: "per person",
          durationLabel: "Evening · 5h",
        },
      ],
    },
    {
      num: 6,
      title: "Canggu",
      subtitle: "Surf & slow morning",
      items: [
        {
          id: "d6-surf",
          kind: "bookable",
          source: "klook",
          title: "Canggu Beginner Surf Lesson (Batu Bolong)",
          rating: 4.8,
          reviews: 1980,
          matched: ["morning surf lesson"],
          price: 25,
          priceUnit: "per person",
          durationLabel: "2h session",
        },
        {
          id: "d6-cafe",
          kind: "recommended",
          title: "Canggu cafe & smoothie-bowl food tour",
          price: 34,
          priceUnit: "per person",
          description:
            "A relaxed add-on for your \u201Ccafe-hop, relax\u201D, only if you'd like it.",
        },
      ],
    },
    {
      num: 7,
      title: "Departure",
      subtitle: "Bali → DPS",
      items: [
        {
          id: "d7-transfer",
          kind: "bookable",
          source: "12go",
          title: "Private Departure Transfer to Ngurah Rai Airport",
          rating: 4.8,
          reviews: 980,
          matched: ["Departure, transfer to airport"],
          price: 16,
          priceUnit: "per car",
          durationLabel: "~60 min",
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

type Stage = "input" | "assembling" | "trip";

/**
 * Shared composer used by both the standalone /prototype route and the
 * embedded version on the home page. Manages the textarea value + stage
 * transitions, and scrolls the container ref (or window) to the top on
 * each stage change so every step opens from its own top.
 */
export function PrototypeFlow({
  containerRef,
  showHelloBarOnInput = true,
  embedded = false,
}: {
  containerRef?: RefObject<HTMLElement | null>;
  showHelloBarOnInput?: boolean;
  embedded?: boolean;
}) {
  const [stage, setStage] = useState<Stage>("input");
  const [paste, setPaste] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (containerRef?.current) {
      containerRef.current.scrollIntoView({ block: "start", behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [stage, containerRef]);

  return (
    <>
      {stage === "input" && (
        <InputStage
          value={paste}
          onChange={setPaste}
          onStart={() => setStage("assembling")}
          embedded={embedded}
        />
      )}
      {stage === "assembling" && <AssemblingStage onDone={() => setStage("trip")} />}
      {stage === "trip" && <TripStage onEdit={() => setStage("input")} />}
    </>
  );
}

function PrototypePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf9f5" }}>
      <PrototypeFlow />
    </div>
  );
}

/* ---- Hello bar (feedback only) ---- */

export function PrototypeHelloBar() {
  return (
    <div
      role="region"
      aria-label="Prototype feedback bar"
      className="sticky top-0 z-50 w-full text-white text-xs sm:text-sm"
      style={{
        backgroundColor: "var(--blue-bright)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 1px 12px rgba(20,184,166,0.35)",
      }}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-medium text-white/90 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-1"
          aria-label="Back to homepage"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Back to site</span>
        </Link>

        <p className="text-center leading-snug font-medium flex-1 px-2">
          <span className="hidden sm:inline">
            You're trying the prototype. Tell us what you think.{" "}
          </span>
          <span className="sm:hidden">Prototype, share your thoughts.</span>
        </p>

        <FeedbackDialog
          trigger={
            <button
              type="button"
              aria-label="Give us feedback on the prototype"
              className="inline-flex items-center gap-1.5 font-bold text-white bg-white/15 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white transition-colors px-3 py-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--blue-bright)] whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Give us feedback</span>
            </button>
          }
          title="Feedback on the prototype"
          description="What worked, what didn't, what's missing? It goes straight to the founder."
        />
      </div>
    </div>
  );
}

/* ---- Stage 1: Input ---- */

export function InputStage({
  value,
  onChange,
  onStart,
  embedded = false,
}: {
  value: string;
  onChange: (next: string) => void;
  onStart: () => void;
  embedded?: boolean;
}) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const minLength = mounted && isMobile ? MIN_PASTE_LENGTH_MOBILE : MIN_PASTE_LENGTH;
  const trimmedLength = value.trim().length;
  const canSubmit = trimmedLength >= minLength;
  const remaining = Math.max(0, minLength - trimmedLength);

  const handleStart = () => {
    trackEvent("assemble_trip_click");
    onStart();
  };

  if (embedded) {
    return (
      <div
        className="w-full px-6 py-16 sm:py-20"
        style={{
          background: "radial-gradient(ellipse at top, #0a4a47 0%, #062d2a 65%, #041e1c 100%)",
          color: "#f2eee4",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span
              className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "var(--gold-warm)",
                color: "var(--navy-deep)",
              }}
            >
              Demo
            </span>
            <span className="text-xs sm:text-sm text-white/70">Output is illustrative</span>
          </div>

          <div
            className="rounded-2xl p-5 sm:p-6 text-left shadow-2xl"
            style={{ backgroundColor: "#f3f1ea", color: "var(--navy-deep)" }}
          >
            <label htmlFor="prototype-paste" className="block text-sm font-bold mb-1">
              Paste your itinerary
            </label>
            <p className="text-xs sm:text-sm text-[var(--slate-muted)] mb-3" aria-live="polite">
              {mounted ? (
                <>Add at least {minLength} characters to unlock the Assemble button.</>
              ) : (
                <>&nbsp;</>
              )}
            </p>
            <textarea
              id="prototype-paste"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste your Indonesia itinerary here…"
              rows={10}
              className="w-full font-mono text-sm sm:text-[15px] leading-6 p-4 rounded-lg border bg-white/70 whitespace-pre-wrap resize-y focus:outline-none focus:ring-2 focus:ring-[var(--blue-bright)] focus:border-transparent"
              style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
            />
            <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
              <p
                className="text-xs sm:text-sm text-[var(--slate-muted)] min-h-[1.25rem]"
                aria-live="polite"
              >
                {!mounted
                  ? ""
                  : canSubmit
                    ? "Looks good — ready to assemble."
                    : `${remaining} more character${remaining === 1 ? "" : "s"} to go (${trimmedLength}/${minLength}).`}
              </p>
              <button
                type="button"
                onClick={canSubmit ? handleStart : undefined}
                aria-disabled={!canSubmit}
                tabIndex={canSubmit ? 0 : -1}
                className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-white transition-all ${
                  canSubmit
                    ? "bg-[var(--blue-bright)] hover:bg-black cursor-pointer opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    : "bg-[var(--slate-muted)] opacity-50 cursor-not-allowed pointer-events-none"
                }`}
              >
                Assemble my trip <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <nav className="flex items-center gap-6 text-sm text-white/80">
          <a href="#how" className="hover:text-white transition-colors">
            How it works
          </a>
          <Link to="/" className="hover:text-white transition-colors">
            Trips
          </Link>
        </nav>
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
          Paste the Indonesia itinerary you already have, from ChatGPT, a blog, or your notes, and
          we turn it into a day-by-day plan you can actually book.
        </p>

        <div
          className="rounded-2xl p-5 sm:p-6 text-left shadow-2xl mx-auto"
          style={{ backgroundColor: "#f3f1ea", color: "var(--navy-deep)" }}
        >
          <label htmlFor="prototype-paste-standalone" className="block text-sm font-bold mb-3">
            Paste your itinerary
          </label>
          <textarea
            id="prototype-paste-standalone"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your Indonesia itinerary here…"
            rows={10}
            className="w-full font-mono text-sm sm:text-[15px] leading-6 p-4 rounded-lg border bg-white/70 whitespace-pre-wrap resize-y focus:outline-none focus:ring-2 focus:ring-[var(--blue-bright)] focus:border-transparent"
            style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
          />
          <div className="mt-4 flex items-center justify-end">
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

/* ---- Stage 2: Assembling ---- */

const STEPS = [
  { num: 1, title: "Your plan", sub: "as you pasted it" },
  { num: 2, title: "Reading", sub: "day by day" },
  { num: 3, title: "Grouping", sub: "what fits together" },
  { num: 4, title: "Finding", sub: "real experiences" },
  { num: 5, title: "Choosing", sub: "the best-rated" },
  { num: 6, title: "Your trip", sub: "ready to book" },
];

const PROGRESS_MSGS = [
  "Reading your paste line by line…",
  "Grouping activities into days…",
  "Searching providers across Klook, Viator, GetYourGuide & 12Go…",
  "Mocking bookable results, matching prices and de-duping…",
  "Ranking by rating and proximity…",
  "Ready, your trip is bookable.",
];

export function AssemblingStage({ onDone }: { onDone: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const STEP_MS = 900;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < STEPS.length; i++) {
      timers.push(setTimeout(() => setActiveStep(i), i * STEP_MS));
    }
    timers.push(setTimeout(onDone, STEPS.length * STEP_MS + 500));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const pct = ((activeStep + 1) / STEPS.length) * 100;

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
        Reading your trip…
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 mb-10 text-center">
        {[
          { n: 7, l: "Days" },
          { n: 10, l: "Bookable" },
          { n: 4, l: "Self-guided" },
          { n: 2, l: "Recommended" },
        ].map((s) => (
          <div key={s.l}>
            <div
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {s.n}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-white/60 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/60 mb-2">
          <span>
            Step {activeStep + 1} of {STEPS.length}
          </span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div
          className="h-2 w-full rounded-full overflow-hidden bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-label="Assembling your trip"
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

/* ---- Stage 3: Trip ---- */

export function TripStage({ onEdit }: { onEdit: () => void }) {
  const initiallyAdded = useMemo(() => {
    const s = new Set<string>();
    TRIP.days.forEach((d) => d.items.forEach((i) => i.defaultAdded && s.add(i.id)));
    return s;
  }, []);
  const [added, setAdded] = useState<Set<string>>(initiallyAdded);
  const [view, setView] = useState<"day" | "map">("day");
  const [showRedirect, setShowRedirect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const totals = useMemo(() => {
    let count = 0;
    let total = 0;
    TRIP.days.forEach((d) =>
      d.items.forEach((i) => {
        if (added.has(i.id)) {
          count += 1;
          total += i.price ?? 0;
        }
      }),
    );
    return { count, total };
  }, [added]);

  // Fire `trip_viewed` once when the assembled itinerary first renders.
  // TripStage only mounts after the assembling simulation completes, so its
  // mount IS the "trip data loaded" moment. The ref guard keeps it to a single
  // push even if React re-runs the effect (e.g. StrictMode double-invoke).
  const hasFiredView = useRef(false);
  useEffect(() => {
    if (hasFiredView.current) return;
    const bookableItemCount = TRIP.days.reduce(
      (n, d) => n + d.items.filter((i) => i.kind === "bookable").length,
      0,
    );
    if (bookableItemCount === 0) return;
    hasFiredView.current = true;
    trackEvent("trip_viewed", {
      trip_id: TRIP.id,
      destination: TRIP.destination,
      duration_days: TRIP.days.length,
      bookable_item_count: bookableItemCount,
    });
  }, []);

  const toggle = (id: string) =>
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

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

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-32">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.22em] mb-2"
              style={{ color: "var(--teal-link)" }}
            >
              Your trip · Ready to book
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {TRIP.title}
            </h1>
            <p className="text-sm text-[var(--slate-muted)]">{TRIP.locations}</p>
            <p className="text-sm mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>📅 7 days</span>
              <span>🎟️ 7 bookable experiences</span>
              <span>
                <Footprints className="inline w-3.5 h-3.5 -mt-0.5" aria-hidden /> 1 self-guided
                moment
              </span>
            </p>
          </div>

          <div
            className="inline-flex rounded-full p-1 border bg-white text-sm"
            style={{ borderColor: "var(--border-cream)" }}
          >
            {(["day", "map"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  view === v
                    ? "bg-[var(--navy-deep)] text-white"
                    : "text-[var(--slate-muted)] hover:text-[var(--navy-deep)]"
                }`}
              >
                {v === "day" ? "Day by day" : "Map"}
              </button>
            ))}
          </div>
        </div>

        {view === "map" ? (
          <div
            className="rounded-2xl border h-80 flex items-center justify-center text-[var(--slate-muted)]"
            style={{
              borderColor: "var(--border-cream)",
              background: "linear-gradient(135deg, #e8f0ee 0%, #d6e6e2 100%)",
            }}
          >
            Map view, coming soon
          </div>
        ) : (
          <div className="space-y-12">
            {TRIP.days.map((d) => (
              <DayBlock key={d.num} day={d} added={added} onToggle={toggle} />
            ))}
          </div>
        )}
      </section>

      {/* Inline totals + CTA — no sticky bar, sits right after the itinerary */}
      {totals.count > 0 && (
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
              onClick={() => {
                // Primary conversion event for the prototype funnel.
                trackEvent("review_and_book_click");
                setShowRedirect(true);
              }}
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-white bg-[var(--blue-bright)] hover:bg-black transition-colors"
            >
              Review & book <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}

      <Dialog open={showRedirect} onOpenChange={setShowRedirect}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div
              className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: "var(--blue-bright)" }}
            >
              <Check className="w-6 h-6 text-white" aria-hidden />
            </div>
            <DialogTitle className="text-center">Congratulations!</DialogTitle>
            <DialogDescription className="text-center">
              Finish your booking securely on each supplier. Nothing is confirmed until you complete
              it there.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowRedirect(false)}
              className="px-5 py-2 rounded-full border bg-white text-sm font-medium hover:bg-[var(--cream)]"
              style={{ borderColor: "var(--border-cream)" }}
            >
              Back to trip
            </button>
            <button
              type="button"
              onClick={() => {
                trackEvent("feedback_modal_open");
                // Sequence the dialogs instead of nesting: close this one, then
                // open feedback at the top level. Nested Radix dialogs swallow
                // the trigger tap on touch devices.
                setShowRedirect(false);
                setShowFeedback(true);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[var(--blue-bright)] text-white text-sm font-semibold hover:bg-black transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden /> Give us feedback
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <FeedbackDialog
        open={showFeedback}
        onOpenChange={setShowFeedback}
        title="How was the prototype?"
        description="You made it to the end! Tell us what worked, what didn't, or what you'd love next."
      />
    </div>
  );
}

function DayBlock({
  day,
  added,
  onToggle,
}: {
  day: Day;
  added: Set<string>;
  onToggle: (id: string) => void;
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
            {day.num}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
            {day.title}
          </h2>
          <p className="text-sm text-[var(--slate-muted)]">{day.subtitle}</p>
        </div>
        <div
          className="flex-1 border-t hidden sm:block"
          style={{ borderColor: "var(--border-cream)" }}
        />
      </div>

      <div className="space-y-4">
        {day.items.map((i) => (
          <ItemCard key={i.id} item={i} added={added.has(i.id)} onToggle={() => onToggle(i.id)} />
        ))}
      </div>
    </div>
  );
}

function ItemCard({ item, added, onToggle }: { item: Item; added: boolean; onToggle: () => void }) {
  if (item.kind === "selfguided") {
    return (
      <div
        className="flex items-start gap-4 p-4 rounded-xl border border-dashed"
        style={{ borderColor: "var(--border-cream)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--cream)" }}
        >
          <Footprints className="w-5 h-5" style={{ color: "var(--teal-link)" }} aria-hidden />
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-widest font-semibold mb-1"
            style={{ color: "var(--teal-link)" }}
          >
            Self-guided · free
          </p>
          <h3 className="font-bold text-base">{item.title}</h3>
          <p className="text-sm text-[var(--slate-muted)] mt-1">{item.description}</p>
        </div>
      </div>
    );
  }

  const isRecommended = item.kind === "recommended";
  const platform = item.source ? PLATFORM_NAME[item.source] : undefined;

  // Fire add_to_trip only when adding (not when removing an already-added item).
  const handleToggle = () => {
    if (!added) {
      trackEvent("add_to_trip", {
        item_name: item.title,
        platform,
        price: item.price,
      });
    }
    onToggle();
  };

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl border transition-all ${
        added ? "ring-2 ring-[var(--blue-bright)]" : ""
      }`}
      style={{
        borderColor: "var(--border-cream)",
        backgroundColor: isRecommended ? "#fbf2dd" : "white",
      }}
    >
      <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[140px_1fr_auto] gap-3 sm:gap-4">
        <div
          className="aspect-[4/3] rounded-lg flex items-center justify-center text-xs text-[var(--slate-muted)] text-center px-2"
          style={{ backgroundColor: "#e6dfd0" }}
        >
          <div>
            <ImageIcon className="w-5 h-5 mx-auto mb-1 opacity-60" aria-hidden />
            <div className="leading-tight hidden sm:block">
              {item.title.slice(0, 32)}
              {item.title.length > 32 ? "…" : ""}
            </div>
            {item.durationLabel && (
              <div
                className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: "var(--navy-deep)" }}
              >
                {item.durationLabel}
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            {item.source && (
              <span
                className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-white"
                style={{ backgroundColor: SOURCE_COLOR[item.source] }}
              >
                ● {SOURCE_LABEL[item.source]}
              </span>
            )}
            {item.clusteredMatch && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--teal-link)" }}
              >
                ● Clustered match
              </span>
            )}
            {isRecommended && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "#b58a3a" }}
              >
                <Sparkles className="w-3 h-3" aria-hidden /> Recommended
              </span>
            )}
          </div>

          <h3
            className="font-bold text-sm sm:text-lg leading-snug break-words"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {item.title}
          </h3>

          {item.rating != null && (
            <p className="text-xs text-[var(--slate-muted)] mt-1">
              <span className="text-amber-500">★</span> {item.rating.toFixed(1)} (
              {item.reviews?.toLocaleString()})
            </p>
          )}

          {item.matched && item.matched.length > 0 && (
            <p className="text-xs mt-2 text-[var(--slate-muted)] hidden sm:block">
              matched from{" "}
              {item.matched.map((m, idx) => (
                <span key={m}>
                  <span
                    className="px-1.5 py-0.5 rounded font-mono text-[11px]"
                    style={{ backgroundColor: "#e6f3f0", color: "var(--teal-link)" }}
                  >
                    {m}
                  </span>
                  {idx < item.matched!.length - 1 && <span className="mx-1">·</span>}
                </span>
              ))}
            </p>
          )}

          {item.description && (
            <p className="text-xs sm:text-sm text-[var(--slate-muted)] mt-1.5 sm:mt-2">
              {item.description}
            </p>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-end justify-between gap-2 text-right">
          <div>
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "var(--navy-deep)" }}
            >
              ${item.price}
            </span>
            <span className="text-xs text-[var(--slate-muted)] ml-1">{item.priceUnit}</span>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
              added
                ? "bg-[var(--blue-bright)] text-white border-transparent"
                : "bg-white text-[var(--navy-deep)] border-[var(--blue-bright)] hover:bg-[var(--blue-bright)] hover:text-white"
            }`}
          >
            {added ? "✓ Added to trip" : "Add to trip"}
          </button>
          {item.source && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                trackEvent("affiliate_click", {
                  platform,
                  item_name: item.title,
                  price: item.price,
                });
              }}
              className="text-xs text-[var(--teal-link)] hover:underline"
            >
              Book now on{" "}
              {SOURCE_LABEL[item.source].charAt(0) +
                SOURCE_LABEL[item.source].slice(1).toLowerCase()}{" "}
              →
            </a>
          )}
        </div>
      </div>

      {/* Mobile-only price + CTA row */}
      <div
        className="flex sm:hidden items-center justify-between gap-3 mt-3 pt-3 border-t"
        style={{ borderColor: "var(--border-cream)" }}
      >
        <div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "var(--navy-deep)" }}
          >
            ${item.price}
          </span>
          <span className="text-xs text-[var(--slate-muted)] ml-1">{item.priceUnit}</span>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
            added
              ? "bg-[var(--blue-bright)] text-white border-transparent"
              : "bg-white text-[var(--navy-deep)] border-[var(--blue-bright)] hover:bg-[var(--blue-bright)] hover:text-white"
          }`}
        >
          {added ? "✓ Added" : "Add to trip"}
        </button>
      </div>
    </div>
  );
}
