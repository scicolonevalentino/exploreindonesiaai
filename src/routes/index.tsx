import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { PrototypeFlow } from "./prototype";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  Suspense,
  Component,
  useCallback,
  useEffect,
  useRef,
  type ErrorInfo,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { sanityClient, urlFor } from "@/lib/sanity";
import { useIsMobile } from "@/hooks/use-mobile";

// Hero background videos are self-hosted from public/ (served at the site root).
// Previously these came from Lovable's /__l5e asset runtime, but after the
// Vercel cutover that path looped back on itself — see public/hero-bg-*.mp4.
const HERO_VIDEO_DESKTOP = "/hero-bg-desktop.mp4";
const HERO_VIDEO_MOBILE = "/hero-bg-mobile.mp4";
import { useMarqueeDrag } from "@/hooks/useMarqueeDrag";
import {
  ARTICLES_LIST_QUERY,
  DESTINATIONS,
  TRIP_LENGTHS,
  TRAVELLER_TYPES,
  labelFor,
  type ArticleListItem,
} from "@/lib/sanity-queries";
import { shortTitle } from "@/lib/short-title";
import { DESTINATION_CONTENT } from "@/data/destinations";

const articlesQO = queryOptions({
  queryKey: ["sanity", "articles"],
  queryFn: async () => {
    try {
      return await sanityClient.fetch<ArticleListItem[]>(ARTICLES_LIST_QUERY);
    } catch (err) {
      // After TanStack Query's last retry, this surfaces to the error boundary.
      // Log here so we capture the underlying network/Sanity error details.
      console.error("[Sanity] articles fetch failed", {
        query: "ARTICLES_LIST_QUERY",
        message: err instanceof Error ? err.message : String(err),
        error: err,
      });
      throw err;
    }
  },
  // Considered fresh for 5 minutes — most home-page revisits skip the network entirely.
  staleTime: 5 * 60_000,
  // Keep in memory for an hour so back-navigation is instant.
  gcTime: 60 * 60_000,
  // Retry transient network / CDN failures with exponential backoff (max 4s).
  retry: 3,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 4000),
  refetchOnWindowFocus: false,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "exploreindonesia.ai — Turn your Indonesia itinerary into a bookable trip" },
      {
        name: "description",
        content:
          "Paste an Indonesia itinerary from ChatGPT, a blog, or your own notes. We turn it into a structured, day-by-day trip with bookable stays, transfers, tours, and experiences.",
      },
      { property: "og:title", content: "exploreindonesia.ai — Indonesia AI Trip Planner" },
      {
        property: "og:description",
        content: "Paste your Indonesia itinerary and get a bookable, day-by-day plan in seconds.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQO),
  component: Landing,
});

function Logo() {
  return (
    <div className="flex items-center gap-2 font-sans text-base sm:text-lg font-bold tracking-tight">
      <img
        src="/komo-mascot.png"
        alt="Komo, the Explore Indonesia mascot"
        className="h-9 w-9 sm:h-10 sm:w-10 object-contain -translate-y-1"
      />
      <span>
        <span className="text-white">exploreindonesia</span>
        <span style={{ color: "var(--blue-ice)" }}>.ai</span>
      </span>
    </div>
  );
}

function Hero() {
  const isMobile = useIsMobile();
  const videoSrc = isMobile ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP;

  return (
    <section
      className="relative w-full overflow-hidden isolate"
      style={{
        background: "linear-gradient(135deg, var(--navy-deep) 0%, var(--blue-bright) 100%)",
      }}
    >
      {/* Background video — muted, looping, decorative. Lighter treatment so
          the footage feels present without overpowering the headline. */}
      <video
        key={videoSrc}
        className="absolute inset-0 w-full h-full object-cover -z-10 motion-reduce:hidden"
        style={{ filter: "saturate(0.95) brightness(0.92)" }}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Desktop overlay: subtle base wash for global legibility */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none hidden md:block"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,45,42,0.35) 0%, rgba(6,45,42,0.25) 50%, rgba(6,45,42,0.55) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Desktop focal scrim: darker ellipse behind the headline area so text
          pops while the video edges stay visible and animated */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 55%, rgba(6,45,42,0.65) 0%, rgba(6,45,42,0.35) 55%, rgba(6,45,42,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Mobile overlay: stronger but still lets motion show through */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,45,42,0.60) 0%, rgba(6,45,42,0.45) 50%, rgba(6,45,42,0.70) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-10">
        <Logo />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 text-center">
        <p
          className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-6"
          style={{ color: "var(--blue-soft)", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}
        >
          AI itinerary planning, powered by real experiences
        </p>

        <h1
          className="font-serif text-white leading-[1.1] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold"
          style={{ textShadow: "0 2px 28px rgba(0,0,0,0.75)" }}
        >
          Have you planned your trip to Indonesia?
          <br />
          <span className="italic font-normal" style={{ color: "var(--gold-warm)" }}>
            We make it <span className="whitespace-nowrap">ready-to-book</span>
          </span>
        </h1>

        <p
          className="mt-8 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-white font-light"
          style={{ textShadow: "0 1px 14px rgba(0,0,0,0.65)" }}
        >
          Paste an Indonesia itinerary from ChatGPT, a blog, or your own notes. We turn it into a
          structured, day-by-day trip with bookable stays, transfers, tours, and experiences.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Paste your plan",
      body: "Drop in the itinerary you already have. No starting over. No long forms to fill out. Just paste and go.",
    },
    {
      n: 2,
      title: "We match it",
      body: "We match your itinerary with vetted experiences from trusted travel platforms and local operators.",
    },
    {
      n: 3,
      title: "You book it",
      body: "Review your trip in one place, then choose the experiences you want to book.",
    },
  ];

  return (
    <section className="w-full px-6 py-20 sm:py-28" style={{ backgroundColor: "var(--cream)" }}>
      <div className="mx-auto max-w-6xl">
        <p
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-center mb-14"
          style={{ color: "var(--teal-link)" }}
        >
          How it works
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg mb-6 mx-auto"
                style={{ backgroundColor: "var(--blue-bright)" }}
              >
                {s.n}
              </div>
              <h3
                className="font-serif text-2xl font-semibold mb-3"
                style={{ color: "var(--navy-mid)" }}
              >
                {s.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-dark)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const partners = [
    { name: "Viator", color: "#1f9e87" },
    { name: "Klook", color: "#ef7a23" },
    { name: "Booking.com", color: "#1b3aa0" },
    { name: "GetYourGuide", color: "#e0533a" },
    { name: "12Go", color: "#0d9488" },
    { name: "Agoda", color: "#d72f7a" },
    { name: "Hostelworld", color: "#f15a2b" },
    { name: "Airbnb", color: "#ff5a5f" },
    { name: "Skyscanner", color: "#0770e3" },
    { name: "Kiwi.com", color: "#00a991" },
    { name: "Rentalcars.com", color: "#f76707" },
    { name: "QEEQ", color: "#2a6df4" },
    { name: "Musement", color: "#ff5a36" },
    { name: "Tiqets", color: "#ff5b9a" },
    { name: "World Nomads", color: "#1a1a1a" },
    { name: "Airalo", color: "#f76b1c" },
    { name: "Welcome Pickups", color: "#ffcc33" },
    { name: "Intrepid Travel", color: "#c8102e" },
  ];

  // Duplicate so the marquee loops seamlessly.
  const loop = [...partners, ...partners];
  const trackRef = useRef<HTMLDivElement>(null);
  useMarqueeDrag(trackRef, { step: 180 });

  return (
    <section className="w-full pb-24 pt-4" style={{ backgroundColor: "var(--cream)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <p
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-center mb-10 max-w-3xl mx-auto"
          style={{ color: "var(--slate-muted)" }}
        >
          We search across leading travel platforms
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden marquee-pause marquee-reduced-scroll mb-10"
        data-partner-strip="true"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex gap-3 sm:gap-4 w-max animate-marquee focus:outline-none"
          data-partner-track="true"
          role="region"
          aria-roledescription="carousel"
          aria-label="Trusted travel partner brands."
        >
          {loop.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="bg-white rounded-xl px-5 py-3 sm:px-7 sm:py-4 border shrink-0"
              data-partner-logo={p.name}
              style={{ borderColor: "var(--border-cream)" }}
            >
              <span
                className="font-bold text-base sm:text-lg whitespace-nowrap"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-base" style={{ color: "var(--text-dark)" }}>
          Behind these names sit thousands of vetted local operators across Indonesia.
        </p>
      </div>
    </section>
  );
}

// Minimum number of cards we expect for a healthy carousel.
const MIN_EXPECTED_ARTICLES = 4;

type GtagFn = (cmd: string, event: string, params: Record<string, unknown>) => void;
type WindowWithAnalytics = {
  gtag?: GtagFn;
  dataLayer?: Array<Record<string, unknown>>;
};

// GA4 measurement ID — must match the gtag('config', ...) call in __root.tsx.
// Using `send_to` pins the event to this stream so GTM-side GA4 tags don't
// re-forward it and cause double counting.
const GA4_MEASUREMENT_ID = "G-ZNEKVH2ETY";

// Per-session dedupe: { event + slug } only fires once even if both gtag and
// a GTM listener somehow observe the same dataLayer push.
const sentEvents = new Set<string>();

function sendGAEvent(event: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const dedupeKey = `${event}:${payload.item_slug ?? payload.item_id ?? ""}`;
  if (sentEvents.has(dedupeKey)) return;
  sentEvents.add(dedupeKey);

  const w = window as unknown as WindowWithAnalytics;
  try {
    if (typeof w.gtag === "function") {
      // send_to scopes the event to GA4 only → GTM GA4 tags won't duplicate it.
      w.gtag("event", event, { ...payload, send_to: GA4_MEASUREMENT_ID });
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...payload, send_to: GA4_MEASUREMENT_ID });
    }
  } catch {
    // Never let analytics break the page.
  }
}

function cardPayload(article: ArticleListItem, position: number) {
  return {
    event_category: "home_inspiration_carousel",
    item_id: article._id,
    item_name: shortTitle(article.title),
    item_slug: article.slug?.current,
    item_destination: article.destinationPrimary,
    item_trip_length: article.tripLengthBucket,
    position,
    link_url: `/trips/${article.slug?.current ?? ""}`,
  };
}

function trackCardClick(article: ArticleListItem, position: number) {
  const payload = cardPayload(article, position);
  sendGAEvent("select_content", payload);
  sendGAEvent("inspiration_card_click", payload);
}

function InspirationCard({
  article,
  position,
  totalCards,
}: {
  article: ArticleListItem;
  position: number;
  totalCards: number;
}) {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const slug = article.slug?.current;

  const img = article.heroImage?.asset
    ? urlFor(article.heroImage).width(720).height(900).fit("crop").auto("format").url()
    : null;
  const duration =
    typeof article.tripLengthDays === "number" && article.tripLengthDays > 0
      ? `${article.tripLengthDays} ${article.tripLengthDays === 1 ? "day" : "days"}`
      : labelFor(TRIP_LENGTHS, article.tripLengthBucket);

  const traveller = article.travellerTypes?.[0]
    ? labelFor(TRAVELLER_TYPES, article.travellerTypes[0])
    : labelFor(DESTINATIONS, article.destinationPrimary);
  const title = shortTitle(article.title);

  // Route prefetch when the card scrolls into view.
  useEffect(() => {
    const el = linkRef.current;
    if (!el || !slug) return;
    const prefetch = () =>
      router.preloadRoute({ to: "/trips/$slug", params: { slug } }).catch(() => {});
    if (typeof IntersectionObserver === "undefined") {
      prefetch();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            prefetch();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: [0.5] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug, router]);

  // Arrow-key navigation between sibling cards in the same marquee row.
  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLAnchorElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End")
      return;
    const current = linkRef.current;
    if (!current) return;
    const parent = current.parentElement;
    if (!parent) return;
    const siblings = Array.from(
      parent.querySelectorAll<HTMLAnchorElement>('[data-inspiration-card="true"]'),
    );
    const idx = siblings.indexOf(current);
    if (idx === -1) return;
    e.preventDefault();
    let next = idx;
    if (e.key === "ArrowRight") next = Math.min(idx + 1, siblings.length - 1);
    if (e.key === "ArrowLeft") next = Math.max(idx - 1, 0);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = siblings.length - 1;
    siblings[next]?.focus();
  }, []);

  return (
    <Link
      ref={linkRef}
      to="/trips/$slug"
      params={{ slug: article.slug.current }}
      preload="intent"
      onClick={() => trackCardClick(article, position)}
      onKeyDown={handleKeyDown}
      data-inspiration-card="true"
      role="listitem"
      aria-label={`${title}${duration ? ` — ${duration}` : ""}${traveller ? `, for ${traveller}` : ""}. Card ${position + 1} of ${totalCards}.`}
      className="group relative block w-[260px] sm:w-[300px] shrink-0 snap-start rounded-2xl overflow-hidden border bg-white transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 cursor-pointer"
      style={{
        borderColor: "var(--border-cream)",
        cursor: "pointer",
        // @ts-expect-error CSS custom prop for focus ring
        "--tw-ring-color": "var(--blue-bright)",
      }}
    >
      <div
        className="aspect-[4/5] w-full overflow-hidden"
        style={{ backgroundColor: "var(--blue-soft)" }}
      >
        {img && (
          <img
            src={img}
            alt={article.heroImage?.alt ?? article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(6,45,42,0.85) 0%, rgba(6,45,42,0.15) 55%, transparent 100%)",
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white" aria-hidden="true">
        {duration && (
          <p
            className="text-[11px] uppercase tracking-[0.2em] mb-1.5"
            style={{ color: "var(--blue-ice)" }}
          >
            {duration}
          </p>
        )}
        <h3 className="font-serif text-lg sm:text-xl font-semibold leading-snug group-hover:underline underline-offset-4 decoration-2">
          {title}
        </h3>
        {traveller && <p className="mt-1 text-xs text-white/80">{traveller}</p>}
      </div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div
      className="w-[260px] sm:w-[300px] shrink-0 rounded-2xl overflow-hidden border animate-skeleton"
      style={{ borderColor: "var(--border-cream)", backgroundColor: "var(--cream)" }}
      aria-hidden="true"
    >
      <div className="aspect-[4/5] w-full" style={{ backgroundColor: "var(--blue-soft)" }} />
      <div className="p-5 space-y-2">
        <div className="h-2.5 w-16 rounded" style={{ backgroundColor: "var(--border-cream)" }} />
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "var(--border-cream)" }} />
        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--border-cream)" }} />
      </div>
    </div>
  );
}

function InspirationSkeleton() {
  return (
    <div
      className="w-full overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Loading trip inspiration"
    >
      <div className="flex gap-5 px-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function InspirationFallback({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div
        className="rounded-2xl border p-8 sm:p-10 text-center"
        style={{ borderColor: "var(--border-cream)", backgroundColor: "var(--cream)" }}
        role="status"
      >
        <p className="font-serif text-xl mb-2" style={{ color: "var(--navy-deep)" }}>
          Trip inspiration is on its way.
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--slate-muted)" }}>
          {message}
        </p>
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--blue-bright)" }}
        >
          See all trips →
        </Link>
      </div>
    </div>
  );
}

class InspirationBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Inspiration] fetch failed after retries — using fallback UI", {
      fallbackPath: "InspirationFallback (error boundary)",
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }
  render() {
    if (this.state.hasError) {
      return (
        <InspirationFallback message="We couldn't load our top trips right now. Browse the full collection instead." />
      );
    }
    return this.props.children;
  }
}

function InspirationMarquee() {
  const { data: articles } = useSuspenseQuery(articlesQO);
  const trackRef = useRef<HTMLDivElement>(null);
  useMarqueeDrag(trackRef, { step: 240 });

  if (!articles || articles.length === 0) {
    console.warn("[Inspiration] Sanity returned no articles — using empty fallback", {
      fallbackPath: "InspirationFallback (empty result)",
      count: articles?.length ?? 0,
    });
    return (
      <InspirationFallback message="New itineraries are being prepared. Check back soon — or explore everything we already have." />
    );
  }

  const fewerThanExpected = articles.length < MIN_EXPECTED_ARTICLES;
  const loop = [...articles, ...articles];

  return (
    <>
      {fewerThanExpected && (
        <div className="mx-auto max-w-6xl px-6 mb-6 text-center">
          <p className="text-xs" style={{ color: "var(--slate-muted)" }}>
            Showing {articles.length} of our newest trips — more on the way.
          </p>
        </div>
      )}
      <div
        className="relative w-full overflow-hidden marquee-pause marquee-reduced-scroll"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 3%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 3%, black 92%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-5 w-max animate-marquee focus:outline-none"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${articles.length} Indonesia trip itineraries.`}
        >
          {loop.map((a, i) => (
            <InspirationCard
              key={`${a._id}-${i}`}
              article={a}
              position={i % articles.length}
              totalCards={articles.length}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Inspiration() {
  return (
    <section
      id="inspiration"
      className="w-full py-20 sm:py-28 scroll-mt-4"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "var(--teal-link)" }}
          >
            Need inspiration?
          </p>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
            style={{ color: "var(--navy-mid)" }}
          >
            Browse curated Indonesia itineraries
          </h2>
          <p
            className="mt-4 text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-dark)" }}
          >
            Hand-picked routes across the archipelago. Start from one, make it yours.
          </p>
        </div>
      </div>

      <InspirationBoundary>
        <Suspense fallback={<InspirationSkeleton />}>
          <InspirationMarquee />
        </Suspense>
      </InspirationBoundary>

      <div className="text-center mt-12 px-6">
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 font-semibold text-base px-7 py-3.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--blue-bright)" }}
        >
          Explore all trips →
        </Link>
      </div>
    </section>
  );
}

function EmbeddedPrototype() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      id="try-it"
      ref={sectionRef}
      aria-label="Try the prototype"
      // scroll-margin keeps each stage's top clear of the sticky HelloBar (~46px)
      // when PrototypeFlow scrolls this section into view on stage changes.
      className="w-full flex flex-col scroll-mt-14"
      style={{ backgroundColor: "#faf9f5" }}
    >
      <PrototypeFlow containerRef={sectionRef} showHelloBarOnInput={false} embedded />
    </section>
  );
}

function BrowseByDestination() {
  return (
    <section className="w-full px-6 py-20 sm:py-28" style={{ backgroundColor: "var(--cream)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "var(--teal-link)" }}
          >
            Browse by destination
          </p>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
            style={{ color: "var(--navy-mid)" }}
          >
            Explore Indonesia, region by region
          </h2>
          <p
            className="mt-4 text-base sm:text-lg max-w-3xl mx-auto"
            style={{ color: "var(--text-dark)" }}
          >
            ExploreIndonesia.ai publishes hand-picked, day-by-day itineraries across the whole
            archipelago: Bali, the Nusa and Gili Islands, Java, Komodo and Flores, Lombok, Sumatra
            and Raja Ampat. From 5-day Bali escapes to month-long grand tours, every trip lays out
            the route, the best time to go, rough costs and bookable stays, transfers and tours.
            Pick a destination to see every itinerary we have for it.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {DESTINATION_CONTENT.map((d) => (
            <Link
              key={d.slug}
              to="/destinations/$destination"
              params={{ destination: d.slug }}
              className="group rounded-2xl border bg-white px-5 py-6 text-center transition-shadow hover:shadow-lg"
              style={{ borderColor: "var(--border-cream)" }}
            >
              <span
                className="font-serif text-lg font-semibold leading-snug group-hover:underline underline-offset-4"
                style={{ color: "var(--navy-deep)" }}
              >
                {d.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Landing() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <EmbeddedPrototype />
      <Trust />
      <Inspiration />
      <BrowseByDestination />
    </main>
  );
}
