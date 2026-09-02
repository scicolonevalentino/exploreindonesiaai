import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { sanityClient } from "@/lib/sanity";
import { tripCardImageUrl, tripsHeaderImageUrl } from "@/lib/image-urls";
import {
  ARTICLES_LIST_QUERY,
  DESTINATIONS,
  TRIP_LENGTHS,
  TRAVEL_STYLES,
  TRAVELLER_TYPES,
  VIBES,
  labelFor,
  type ArticleListItem,
} from "@/lib/sanity-queries";
import { DESTINATION_CONTENT } from "@/data/destinations";

type Search = {
  destinations?: string[];
  tripLengths?: string[];
  styles?: string[];
  travellers?: string[];
  vibes?: string[];
};

function parseArr(v: unknown): string[] | undefined {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string" && v.length > 0) return [v];
  return undefined;
}

const articlesQO = queryOptions({
  queryKey: ["sanity", "articles"],
  queryFn: () => sanityClient.fetch<ArticleListItem[]>(ARTICLES_LIST_QUERY),
  staleTime: 60_000,
});

/** Cards rendered eagerly: roughly the first grid viewport on desktop. */
const EAGER_CARDS = 6;
/** Of those, how many are also preloaded from <head> at high priority. */
const PRELOADED_CARDS = 3;

/** The itinerary whose hero backs the page header. */
function featuredArticle(articles: ArticleListItem[] | undefined) {
  if (!Array.isArray(articles)) return undefined;
  return articles.find((a) => a.slug?.current === "7-days-lombok-gili-islands") ?? articles[0];
}

export const Route = createFileRoute("/trips/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    destinations: parseArr(s.destinations),
    tripLengths: parseArr(s.tripLengths),
    styles: parseArr(s.styles),
    travellers: parseArr(s.travellers),
    vibes: parseArr(s.vibes),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQO),
  head: ({ loaderData }) => {
    const articles = loaderData as ArticleListItem[] | undefined;
    const header = featuredArticle(articles)?.heroImage;
    // The header backdrop is the LCP element here, and the first grid cards sit
    // right under it. Preloading them from <head> starts the fetches with the
    // first bytes of HTML instead of after layout, which is what left the cards
    // blank for a second or two.
    const preloads = [
      ...(header?.asset ? [tripsHeaderImageUrl(header)] : []),
      ...(articles ?? [])
        .slice(0, PRELOADED_CARDS)
        .flatMap((a) => (a.heroImage?.asset ? [tripCardImageUrl(a.heroImage)] : [])),
    ];
    return {
      meta: [
        { title: "Explore all Indonesia trips, ExploreIndonesia.ai" },
        {
          name: "description",
          content:
            "Browse hand-picked Indonesia itineraries. Filter by destination, trip length, travel style, traveller type, and vibe.",
        },
      ],
      links: [
        ...preloads.map((href) => ({
          rel: "preload",
          as: "image",
          href,
          fetchPriority: "high" as const,
        })),
        { rel: "canonical", href: "https://exploreindonesia.ai/trips" },
      ],
    };
  },
  component: TripsPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-serif text-2xl mb-2" style={{ color: "var(--navy-deep)" }}>
          Couldn't load trips
        </h1>
        <p className="text-sm" style={{ color: "var(--slate-muted)" }}>
          {error.message}
        </p>
      </div>
    </div>
  ),
});

function TripsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <TripsInner />
    </Suspense>
  );
}

function TripsInner() {
  const { data: articles } = useSuspenseQuery(articlesQO);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/trips" });

  const sel = {
    destinations: search.destinations ?? [],
    tripLengths: search.tripLengths ?? [],
    styles: search.styles ?? [],
    travellers: search.travellers ?? [],
    vibes: search.vibes ?? [],
  };

  const toggle = (key: keyof Search, value: string) => {
    const current = sel[key];
    const next = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    navigate({
      search: (prev: Search) => ({ ...prev, [key]: next.length ? next : undefined }),
      replace: true,
    });
  };

  const clearGroup = (key: keyof Search) =>
    navigate({
      search: (prev: Search) => ({ ...prev, [key]: undefined }),
      replace: true,
    });

  const clearAll = () =>
    navigate({
      search: () => ({}) as Search,
      replace: true,
    });

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (sel.destinations.length) {
        const all = [a.destinationPrimary, ...(a.destinationSecondary ?? [])].filter(
          Boolean,
        ) as string[];
        if (!sel.destinations.some((d: string) => all.includes(d))) return false;
      }
      if (sel.tripLengths.length && !sel.tripLengths.includes(a.tripLengthBucket ?? "")) {
        return false;
      }
      if (sel.styles.length) {
        const all = [a.travelStylePrimary, ...(a.travelStyleSecondary ?? [])].filter(
          Boolean,
        ) as string[];
        if (!sel.styles.some((s: string) => all.includes(s))) return false;
      }
      if (sel.travellers.length) {
        const tt = a.travellerTypes ?? [];
        if (!sel.travellers.some((t: string) => tt.includes(t))) return false;
      }
      if (sel.vibes.length && !sel.vibes.includes(a.vibe ?? "")) return false;
      return true;
    });
  }, [articles, sel]);

  const headerImg = useMemo(() => {
    const hero = featuredArticle(articles)?.heroImage;
    return hero?.asset ? tripsHeaderImageUrl(hero) : null;
  }, [articles]);

  const totalFilters =
    sel.destinations.length +
    sel.tripLengths.length +
    sel.styles.length +
    sel.travellers.length +
    sel.vibes.length;

  const activeChips: Array<{ key: keyof Search; value: string; label: string }> = [
    ...sel.destinations.map((v: string) => ({
      key: "destinations" as const,
      value: v,
      label: labelFor(DESTINATIONS, v),
    })),
    ...sel.tripLengths.map((v: string) => ({
      key: "tripLengths" as const,
      value: v,
      label: labelFor(TRIP_LENGTHS, v),
    })),
    ...sel.styles.map((v: string) => ({
      key: "styles" as const,
      value: v,
      label: labelFor(TRAVEL_STYLES, v),
    })),
    ...sel.travellers.map((v: string) => ({
      key: "travellers" as const,
      value: v,
      label: labelFor(TRAVELLER_TYPES, v),
    })),
    ...sel.vibes.map((v: string) => ({
      key: "vibes" as const,
      value: v,
      label: labelFor(VIBES, v),
    })),
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <header
        className="relative w-full overflow-hidden px-6 py-8 sm:py-10"
        style={{
          background: "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%)",
        }}
      >
        {headerImg && (
          <img
            src={headerImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            fetchPriority="high"
            decoding="async"
          />
        )}
        {headerImg && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
        )}
        <div className="relative z-10 mx-auto max-w-7xl">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← Home
          </Link>
          <h1 className="mt-3 font-serif text-white text-3xl sm:text-4xl font-semibold leading-tight">
            Explore all trips
          </h1>
          <p className="mt-2 text-white/75 text-sm sm:text-base max-w-2xl">
            Hand-picked Indonesia itineraries.
          </p>
        </div>
      </header>

      {/* Horizontal filter bar */}
      {/* Sticks BELOW the HelloBar, which is itself `sticky top-0` at a higher
          z-index: both parked at top-0 and the announcement bar painted over
          this row's first line, hiding the Destination and Trip length filters
          entirely on mobile (where the chips wrap onto two lines). */}
      <div
        className="sticky z-30 border-b"
        style={{
          top: "var(--hellobar-h, 0px)",
          backgroundColor: "#ffffff",
          borderColor: "var(--border-cream)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-2 flex-wrap">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.2em] mr-1"
            style={{ color: "var(--slate-muted)" }}
          >
            Filter
          </span>
          <FilterDropdown
            label="Destination"
            options={DESTINATIONS}
            selected={sel.destinations}
            onToggle={(v) => toggle("destinations", v)}
            onClear={() => clearGroup("destinations")}
          />
          <FilterDropdown
            label="Trip length"
            options={TRIP_LENGTHS}
            selected={sel.tripLengths}
            onToggle={(v) => toggle("tripLengths", v)}
            onClear={() => clearGroup("tripLengths")}
          />
          <FilterDropdown
            label="Travel style"
            options={TRAVEL_STYLES}
            selected={sel.styles}
            onToggle={(v) => toggle("styles", v)}
            onClear={() => clearGroup("styles")}
          />
          <FilterDropdown
            label="Traveller"
            options={TRAVELLER_TYPES}
            selected={sel.travellers}
            onToggle={(v) => toggle("travellers", v)}
            onClear={() => clearGroup("travellers")}
          />
          <FilterDropdown
            label="Vibe"
            options={VIBES}
            selected={sel.vibes}
            onToggle={(v) => toggle("vibes", v)}
            onClear={() => clearGroup("vibes")}
          />
          {totalFilters > 0 && (
            <button
              onClick={clearAll}
              className="ml-auto text-xs font-medium underline underline-offset-2"
              style={{ color: "var(--teal-link)" }}
            >
              Clear all ({totalFilters})
            </button>
          )}
        </div>
        {activeChips.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 pb-3 flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={`${chip.key}-${chip.value}`}
                onClick={() => toggle(chip.key, chip.value)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:bg-black/5"
                style={{
                  borderColor: "var(--border-cream)",
                  color: "var(--navy-deep)",
                  backgroundColor: "#fff",
                }}
              >
                {chip.label}
                <X className="h-3 w-3 opacity-60" />
              </button>
            ))}
          </div>
        )}
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm mb-6" style={{ color: "var(--slate-muted)" }}>
          {filtered.length} {filtered.length === 1 ? "trip" : "trips"}
          {totalFilters > 0 ? ` matching your filters` : ""}
        </p>

        {filtered.length === 0 ? (
          <div
            className="rounded-2xl border p-10 text-center"
            style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
          >
            <p className="font-serif text-xl mb-2" style={{ color: "var(--navy-deep)" }}>
              No trips match these filters yet.
            </p>
            <p className="text-sm" style={{ color: "var(--slate-muted)" }}>
              Try clearing some filters or check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a, i) => (
              <TripCard
                key={a._id}
                article={a}
                eager={i < EAGER_CARDS}
                priority={i < PRELOADED_CARDS}
              />
            ))}
          </div>
        )}

        <section className="mt-16 border-t pt-10" style={{ borderColor: "var(--border-cream)" }}>
          <h2
            className="font-serif text-xl sm:text-2xl font-semibold mb-4"
            style={{ color: "var(--navy-deep)" }}
          >
            Browse by destination
          </h2>
          <ul className="flex flex-wrap gap-2">
            {DESTINATION_CONTENT.map((d) => (
              <li key={d.slug}>
                <Link
                  to="/destinations/$destination"
                  params={{ destination: d.slug }}
                  className="inline-block px-3 py-1.5 rounded-full text-sm border transition-colors hover:bg-black/5"
                  style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
                >
                  {d.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  selected: string[];
  onToggle: (v: string) => void;
  onClear: () => void;
}) {
  const count = selected.length;
  const active = count > 0;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
          style={{
            borderColor: active ? "var(--navy-deep)" : "var(--border-cream)",
            backgroundColor: active ? "var(--navy-deep)" : "#fff",
            color: active ? "#fff" : "var(--navy-deep)",
          }}
        >
          {label}
          {active && (
            <span
              className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                color: "#fff",
              }}
            >
              {count}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-64 p-0 overflow-hidden rounded-xl border shadow-xl"
        style={{ backgroundColor: "#ffffff", borderColor: "var(--border-cream)" }}
      >
        <ul className="max-h-72 overflow-y-auto p-2">
          {options.map((o) => {
            const checked = selected.includes(o.value);
            return (
              <li key={o.value}>
                <label
                  className="flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer hover:bg-black/5 text-sm"
                  style={{ color: "var(--text-dark)" }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(o.value)}
                    className="h-4 w-4 rounded border-2 cursor-pointer"
                    style={{ accentColor: "var(--blue-bright)" }}
                  />
                  <span style={{ color: checked ? "var(--navy-deep)" : "var(--text-dark)" }}>
                    {o.label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        {active && (
          <div
            className="border-t px-3 py-2 flex justify-end"
            style={{ borderColor: "var(--border-cream)" }}
          >
            <button
              onClick={onClear}
              className="text-xs font-medium underline"
              style={{ color: "var(--teal-link)" }}
            >
              Clear {label.toLowerCase()}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function TripCard({
  article,
  eager = false,
  priority = false,
}: {
  article: ArticleListItem;
  /** Render without loading="lazy" — roughly the first grid viewport. */
  eager?: boolean;
  /** Also request at high priority — only the cards preloaded from <head>. */
  priority?: boolean;
}) {
  const img = article.heroImage?.asset ? tripCardImageUrl(article.heroImage) : null;
  return (
    <Link
      to="/trips/$slug"
      params={{ slug: article.slug.current }}
      className="group rounded-2xl overflow-hidden border bg-white transition-shadow hover:shadow-lg"
      style={{ borderColor: "var(--border-cream)" }}
    >
      <div
        className="aspect-[16/10] w-full overflow-hidden"
        style={{ backgroundColor: "var(--blue-soft)" }}
      >
        {img && (
          <img
            src={img}
            alt={article.heroImage?.alt ?? article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            width={800}
            height={500}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
          />
        )}
      </div>
      <div className="p-5">
        <p
          className="text-xs uppercase tracking-[0.18em] mb-2"
          style={{ color: "var(--teal-link)" }}
        >
          {labelFor(TRIP_LENGTHS, article.tripLengthBucket)}
          {article.destinationPrimary
            ? ` · ${labelFor(DESTINATIONS, article.destinationPrimary)}`
            : ""}
        </p>
        <h3
          className="font-serif text-xl font-semibold leading-snug mb-2"
          style={{ color: "var(--navy-deep)" }}
        >
          {article.title}
        </h3>
        {article.route && (
          <p className="text-sm mb-3" style={{ color: "var(--slate-muted)" }}>
            {article.route}
          </p>
        )}
        {article.metaDescription && (
          <p className="text-sm line-clamp-2" style={{ color: "var(--text-dark)" }}>
            {article.metaDescription}
          </p>
        )}
      </div>
    </Link>
  );
}
