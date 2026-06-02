import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, type ErrorInfo, Component, type ReactNode } from "react";


import { sanityClient, urlFor } from "@/lib/sanity";
import {
  ARTICLES_LIST_QUERY,
  DESTINATIONS,
  TRIP_LENGTHS,
  TRAVELLER_TYPES,
  labelFor,
  type ArticleListItem,
} from "@/lib/sanity-queries";

const articlesQO = queryOptions({
  queryKey: ["sanity", "articles"],
  queryFn: () => sanityClient.fetch<ArticleListItem[]>(ARTICLES_LIST_QUERY),
  staleTime: 60_000,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "exploreindonesia.ai — Turn your Indonesia itinerary into a bookable trip" },
      {
        name: "description",
        content:
          "Paste the Indonesia itinerary you already have and we turn it into a day-by-day plan you can actually book through the world's most trusted travel companies.",
      },
      { property: "og:title", content: "exploreindonesia.ai — Indonesia AI Trip Planner" },
      {
        property: "og:description",
        content:
          "Paste your Indonesia itinerary and get a bookable, day-by-day plan in seconds.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQO),
  component: Landing,
});

function Logo() {
  return (
    <div className="font-sans text-base sm:text-lg font-bold tracking-tight">
      <span className="text-white">exploreindonesia</span>
      <span style={{ color: "var(--blue-ice)" }}>.ai</span>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--navy-deep) 0%, var(--blue-bright) 100%)",
      }}
    >
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10">
        <Logo />
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 text-center">
        <p
          className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-6"
          style={{ color: "var(--blue-soft)" }}
        >
          AI itinerary planning, powered by real experiences
        </p>

        <h1 className="font-serif text-white leading-[1.1] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold">
          You've planned the trip.
          <br />
          <span className="italic font-normal bg-transparent text-lime-950" style={{ color: "var(--gold-warm)" }}>
            We make it bookable.
          </span>
        </h1>

        <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-white/85 font-light">
          Paste the Indonesia itinerary you already have - from ChatGPT, a blog, or
          your notes - and we turn it into a day-by-day plan you can actually book,
          through the world's most trusted travel organizations.
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
      body:
        "Drop in the itinerary you already have. No starting over, no forms to fill, just paste and go.",
    },
    {
      n: 2,
      title: "We make it bookable",
      body:
        "We match your itinerary with vetted experiences from trusted travel platforms and local operators",
    },
    {
      n: 3,
      title: "Review and book",
      body:
        "See your whole trip in one place. Approve what you want, one tap at a time.",
    },
  ];

  return (
    <section
      className="w-full px-6 py-20 sm:py-28"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-center mb-14"
          style={{ color: "var(--teal-link)" }}
        >
          How it works
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {steps.map((s) => (
            <div key={s.n} className="text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg mb-6 mx-auto md:mx-0"
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
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-dark)" }}
              >
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
  ];

  return (
    <section
      className="w-full px-6 pb-24 pt-4"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-center mb-10 max-w-3xl mx-auto"
          style={{ color: "var(--slate-muted)" }}
        >
          Outstanding experiences and real-time prices. From the brands you already trust.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
          {partners.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-xl px-5 py-3 sm:px-7 sm:py-4 border"
              style={{ borderColor: "var(--border-cream)" }}
            >
              <span className="font-bold text-base sm:text-lg" style={{ color: p.color }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>

        <p
          className="text-center text-base"
          style={{ color: "var(--text-dark)" }}
        >
          Behind these names sit thousands of vetted local operators across Indonesia.
        </p>
      </div>
    </section>
  );
}

// Build a clean, short title from the full article title.
// Keeps the leading "X Days in <Place>" portion and drops the
// trailing ":" or " — " / " - " explanation.
function shortTitle(title: string): string {
  if (!title) return "";
  const splitters = [":", " — ", " – ", " - "];
  for (const s of splitters) {
    const i = title.indexOf(s);
    if (i > 0) return title.slice(0, i).trim();
  }
  return title.trim();
}

function InspirationCard({ article }: { article: ArticleListItem }) {
  const img = article.heroImage?.asset
    ? urlFor(article.heroImage).width(720).height(900).fit("crop").auto("format").url()
    : null;
  const duration = labelFor(TRIP_LENGTHS, article.tripLengthBucket);
  const traveller = article.travellerTypes?.[0]
    ? labelFor(TRAVELLER_TYPES, article.travellerTypes[0])
    : labelFor(DESTINATIONS, article.destinationPrimary);

  return (
    <Link
      to="/trips/$slug"
      params={{ slug: article.slug.current }}
      className="group relative block w-[260px] sm:w-[300px] shrink-0 rounded-2xl overflow-hidden border bg-white transition-shadow hover:shadow-xl"
      style={{ borderColor: "var(--border-cream)" }}
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
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {duration && (
          <p
            className="text-[11px] uppercase tracking-[0.2em] mb-1.5"
            style={{ color: "var(--blue-ice)" }}
          >
            {duration}
          </p>
        )}
        <h3 className="font-serif text-lg sm:text-xl font-semibold leading-snug">
          {shortTitle(article.title)}
        </h3>
        {traveller && (
          <p className="mt-1 text-xs text-white/80">{traveller}</p>
        )}
      </div>
    </Link>
  );
}

function InspirationMarquee() {
  const { data: articles } = useSuspenseQuery(articlesQO);
  if (!articles || articles.length === 0) return null;
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...articles, ...articles];

  return (
    <div
      className="relative w-full overflow-hidden marquee-pause"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
      }}
    >
      <div className="flex gap-5 w-max animate-marquee">
        {loop.map((a, i) => (
          <InspirationCard key={`${a._id}-${i}`} article={a} />
        ))}
      </div>
    </div>
  );
}

function Inspiration() {
  return (
    <section
      className="w-full py-20 sm:py-28"
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
            Browse our top selection of Indonesia trips
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-dark)" }}>
            Hand-picked routes across the archipelago. Start from one, make it yours.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6">
            <div className="h-[380px] rounded-2xl" style={{ backgroundColor: "var(--cream)" }} />
          </div>
        }
      >
        <InspirationMarquee />
      </Suspense>

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

function Landing() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Trust />
      <Inspiration />
    </main>
  );
}
