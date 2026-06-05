import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import groq from "groq";

import { sanityClient, urlFor } from "@/lib/sanity";
import { JsonLd } from "@/components/JsonLd";
import { DESTINATIONS, TRIP_LENGTHS, labelFor, type ArticleListItem } from "@/lib/sanity-queries";
import {
  DESTINATION_CONTENT,
  findDestinationBySlug,
  type DestinationContent,
} from "@/data/destinations";

const ARTICLES_BY_DESTINATION_QUERY = groq`*[
  _type == "article"
  && contentStatus == "live"
  && (destinationPrimary == $value || $value in destinationSecondary)
] | order(articleCreatedDate desc) {
  _id, title, slug, heroImage, route, tripLengthBucket, tripLengthDays,
  destinationPrimary, destinationSecondary, travelStylePrimary,
  travellerTypes, vibe, metaDescription
}`;

const articlesByDestQO = (value: string) =>
  queryOptions({
    queryKey: ["sanity", "articlesByDestination", value],
    queryFn: () =>
      sanityClient.fetch<ArticleListItem[]>(ARTICLES_BY_DESTINATION_QUERY, {
        value,
      }),
    staleTime: 5 * 60_000,
  });

export const Route = createFileRoute("/destinations/$destination")({
  loader: async ({ context, params }) => {
    const dest = findDestinationBySlug(params.destination);
    if (!dest) throw notFound();
    await context.queryClient.ensureQueryData(articlesByDestQO(dest.value));
    return dest;
  },
  head: ({ params, loaderData }) => {
    const dest =
      (loaderData as DestinationContent | undefined) ?? findDestinationBySlug(params.destination);
    if (!dest) return {};
    const url = `https://exploreindonesia.ai/destinations/${dest.slug}`;
    return {
      meta: [
        { title: dest.metaTitle },
        { name: "description", content: dest.metaDescription },
        { property: "og:title", content: dest.metaTitle },
        { property: "og:description", content: dest.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: DestinationPage,
  notFoundComponent: () => (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-center"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div>
        <h1 className="font-serif text-3xl mb-3" style={{ color: "var(--navy-deep)" }}>
          Destination not found
        </h1>
        <Link to="/trips" className="underline" style={{ color: "var(--teal-link)" }}>
          Browse all trips
        </Link>
      </div>
    </div>
  ),
});

function DestinationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DestinationInner />
    </Suspense>
  );
}

function DestinationInner() {
  const dest = Route.useLoaderData();
  const { data: articles } = useSuspenseQuery(articlesByDestQO(dest.value));

  const destUrl = `https://exploreindonesia.ai/destinations/${dest.slug}`;
  const itemListLD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${dest.name} itineraries`,
    itemListElement: articles.slice(0, 20).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://exploreindonesia.ai/trips/${a.slug.current}`,
      name: a.title,
    })),
  };
  const collectionLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dest.metaTitle || `${dest.name} itineraries`,
    ...(dest.metaDescription ? { description: dest.metaDescription } : {}),
    url: destUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "ExploreIndonesia.ai",
      url: "https://exploreindonesia.ai",
    },
  };
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://exploreindonesia.ai" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: "https://exploreindonesia.ai/destinations",
      },
      { "@type": "ListItem", position: 3, name: dest.name, item: destUrl },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <JsonLd data={collectionLD} />
      <JsonLd data={breadcrumbLD} />
      <JsonLd data={itemListLD} />
      <header
        className="w-full px-6 py-12 sm:py-16"
        style={{
          background: "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%)",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← Home
          </Link>
          <p
            className="mt-4 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--blue-soft)" }}
          >
            Destination
          </p>
          <h1 className="mt-2 font-serif text-white text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
            {dest.name}
          </h1>
          <p className="mt-5 text-white/85 text-base sm:text-lg max-w-3xl leading-relaxed">
            {dest.intro}
          </p>
          {dest.highlights.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {dest.highlights.map((h: string) => (
                <li
                  key={h}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-white/20 text-white/90"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2
            className="font-serif text-2xl sm:text-3xl font-semibold"
            style={{ color: "var(--navy-deep)" }}
          >
            {articles.length} {articles.length === 1 ? "itinerary" : "itineraries"} in{" "}
            {dest.shortName}
          </h2>
          <Link
            to="/trips"
            search={{ destinations: [dest.value] }}
            className="text-sm font-medium underline underline-offset-2 hidden sm:inline"
            style={{ color: "var(--teal-link)" }}
          >
            Open in filters →
          </Link>
        </div>

        {articles.length === 0 ? (
          <div
            className="rounded-2xl border p-10 text-center"
            style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
          >
            <p className="font-serif text-xl mb-2" style={{ color: "var(--navy-deep)" }}>
              New {dest.shortName} itineraries are coming soon.
            </p>
            <p className="text-sm mb-5" style={{ color: "var(--slate-muted)" }}>
              In the meantime, browse the full collection.
            </p>
            <Link
              to="/trips"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--blue-bright)" }}
            >
              All trips →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <TripCard key={a._id} article={a} />
            ))}
          </div>
        )}

        <section
          className="mt-16 rounded-2xl border p-6 sm:p-8"
          style={{
            borderColor: "var(--border-cream)",
            backgroundColor: "#ffffff",
          }}
        >
          <h2
            className="font-serif text-xl sm:text-2xl font-semibold mb-4"
            style={{ color: "var(--navy-deep)" }}
          >
            Other destinations
          </h2>
          <ul className="flex flex-wrap gap-2">
            {DESTINATION_CONTENT.filter((d) => d.slug !== dest.slug).map((d) => (
              <li key={d.slug}>
                <Link
                  to="/destinations/$destination"
                  params={{ destination: d.slug }}
                  className="inline-block px-3 py-1.5 rounded-full text-sm border transition-colors hover:bg-black/5"
                  style={{
                    borderColor: "var(--border-cream)",
                    color: "var(--navy-deep)",
                  }}
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
