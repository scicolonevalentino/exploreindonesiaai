import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { sanityClient, urlFor } from "@/lib/sanity";
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

export const Route = createFileRoute("/trips")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    destinations: parseArr(s.destinations),
    tripLengths: parseArr(s.tripLengths),
    styles: parseArr(s.styles),
    travellers: parseArr(s.travellers),
    vibes: parseArr(s.vibes),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQO),
  head: () => ({
    meta: [
      { title: "Explore all Indonesia trips — ExploreIndonesia.ai" },
      {
        name: "description",
        content:
          "Browse hand-picked Indonesia itineraries. Filter by destination, trip length, travel style, traveller type, and vibe.",
      },
    ],
  }),
  component: TripsPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-serif text-2xl mb-2" style={{ color: "var(--navy-deep)" }}>
          Couldn't load trips
        </h1>
        <p className="text-sm" style={{ color: "var(--slate-muted)" }}>{error.message}</p>
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
      ? current.filter((v) => v !== value)
      : [...current, value];
    navigate({
      search: (prev) => ({ ...prev, [key]: next.length ? next : undefined }),
      replace: true,
    });
  };

  const clearAll = () =>
    navigate({
      search: {},
      replace: true,
    });

  // AND across filter groups, OR within a group.
  const filtered = useMemo(() => {
    return articles.filter((a) => {
      // Destination: matches primary OR any secondary
      if (sel.destinations.length) {
        const all = [a.destinationPrimary, ...(a.destinationSecondary ?? [])].filter(
          Boolean,
        ) as string[];
        if (!sel.destinations.some((d) => all.includes(d))) return false;
      }
      if (sel.tripLengths.length && !sel.tripLengths.includes(a.tripLengthBucket ?? "")) {
        return false;
      }
      if (sel.styles.length) {
        const all = [a.travelStylePrimary, ...(a.travelStyleSecondary ?? [])].filter(
          Boolean,
        ) as string[];
        if (!sel.styles.some((s) => all.includes(s))) return false;
      }
      if (sel.travellers.length) {
        const tt = a.travellerTypes ?? [];
        if (!sel.travellers.some((t) => tt.includes(t))) return false;
      }
      if (sel.vibes.length && !sel.vibes.includes(a.vibe ?? "")) return false;
      return true;
    });
  }, [articles, sel]);

  const totalFilters =
    sel.destinations.length +
    sel.tripLengths.length +
    sel.styles.length +
    sel.travellers.length +
    sel.vibes.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <header
        className="w-full px-6 py-10 sm:py-14"
        style={{
          background:
            "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← Home
          </Link>
          <h1 className="mt-4 font-serif text-white text-4xl sm:text-5xl font-semibold leading-tight">
            Explore all trips
          </h1>
          <p className="mt-3 text-white/80 max-w-2xl">
            Hand-picked Indonesia itineraries. Filter by what matters to you.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <aside className="lg:sticky lg:top-6 lg:self-start space-y-7">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--navy-deep)" }}>
              Filters
            </h2>
            {totalFilters > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-medium underline"
                style={{ color: "var(--teal-link)" }}
              >
                Clear all ({totalFilters})
              </button>
            )}
          </div>

          <FilterGroup
            title="Destination"
            options={DESTINATIONS}
            selected={sel.destinations}
            onToggle={(v) => toggle("destinations", v)}
          />
          <FilterGroup
            title="Trip length"
            options={TRIP_LENGTHS}
            selected={sel.tripLengths}
            onToggle={(v) => toggle("tripLengths", v)}
          />
          <FilterGroup
            title="Travel style"
            options={TRAVEL_STYLES}
            selected={sel.styles}
            onToggle={(v) => toggle("styles", v)}
          />
          <FilterGroup
            title="Traveller type"
            options={TRAVELLER_TYPES}
            selected={sel.travellers}
            onToggle={(v) => toggle("travellers", v)}
          />
          <FilterGroup
            title="Vibe"
            options={VIBES}
            selected={sel.vibes}
            onToggle={(v) => toggle("vibes", v)}
          />
        </aside>

        <main>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map((a) => (
                <TripCard key={a._id} article={a} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <h3
        className="text-xs font-semibold uppercase tracking-[0.15em] mb-3"
        style={{ color: "var(--navy-mid)" }}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {options.map((o) => {
          const checked = selected.includes(o.value);
          return (
            <li key={o.value}>
              <label className="flex items-start gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(o.value)}
                  className="mt-0.5 h-4 w-4 rounded border-2 cursor-pointer"
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
    </div>
  );
}

function TripCard({ article }: { article: ArticleListItem }) {
  const img = article.heroImage?.asset
    ? urlFor(article.heroImage).width(800).height(500).fit("crop").auto("format").url()
    : null;
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
            loading="lazy"
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
