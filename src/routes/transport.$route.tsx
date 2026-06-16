import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import groq from "groq";

import { sanityClient, urlFor } from "@/lib/sanity";
import { JsonLd } from "@/components/JsonLd";
import type { SanityImage } from "@/lib/sanity-queries";
import { findRouteBySlug, type TransportRoute } from "@/data/routes";
import { TwelveGoBanner } from "@/components/TwelveGoBanner";

// Related itineraries that use this route, fetched server-side in the loader so
// the titles AND the header hero image land in the SSR HTML (no client-side
// flash). Wrapped in try/catch so a Sanity outage degrades gracefully (no
// related section, plain gradient header) instead of breaking the page.
type RelatedTrip = {
  _id: string;
  title: string;
  slug: { current: string };
  heroImage?: SanityImage;
};
const RELATED_TRIPS_QUERY = groq`*[
  _type == "article" && contentStatus == "live" && slug.current in $slugs
]{ _id, title, slug, heroImage }`;

type LoaderData = { route: TransportRoute; relatedTrips: RelatedTrip[] };

export const Route = createFileRoute("/transport/$route")({
  loader: async ({ params }): Promise<LoaderData> => {
    const r = findRouteBySlug(params.route);
    // "todo" rows are backlog stubs, not publishable pages.
    if (!r || r.status === "todo") throw notFound();
    let relatedTrips: RelatedTrip[] = [];
    try {
      relatedTrips = r.relatedTripSlugs.length
        ? await sanityClient.fetch<RelatedTrip[]>(RELATED_TRIPS_QUERY, {
            slugs: r.relatedTripSlugs,
          })
        : [];
    } catch {
      // A Sanity outage must never block the static route content.
      relatedTrips = [];
    }
    return { route: r, relatedTrips };
  },
  head: ({ params, loaderData }) => {
    const r = (loaderData as LoaderData | undefined)?.route ?? findRouteBySlug(params.route);
    if (!r) return {};
    const url = `https://exploreindonesia.ai/transport/${r.slug}`;
    return {
      meta: [
        { title: r.metaTitle },
        { name: "description", content: r.metaDescription },
        { property: "og:title", content: r.metaTitle },
        { property: "og:description", content: r.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: TransportPage,
  notFoundComponent: () => (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-center"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div>
        <h1 className="font-serif text-3xl mb-3" style={{ color: "var(--navy-deep)" }}>
          Route not found
        </h1>
        <Link to="/trips" className="underline" style={{ color: "var(--teal-link)" }}>
          Browse all trips
        </Link>
      </div>
    </div>
  ),
});

function TransportPage() {
  const { route: r, relatedTrips } = Route.useLoaderData() as LoaderData;

  // Header background: reuse the hero image of a related itinerary so transport
  // pages stay visually coherent with the rest of the site. Falls back to the
  // plain gradient when no related image is available (or Sanity is down).
  const heroImage = relatedTrips.find((t) => t.heroImage)?.heroImage;
  const heroUrl = heroImage
    ? urlFor(heroImage).width(1600).height(520).fit("crop").auto("format").url()
    : null;

  const url = `https://exploreindonesia.ai/transport/${r.slug}`;
  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: r.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://exploreindonesia.ai" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Getting around",
        item: "https://exploreindonesia.ai/transport",
      },
      { "@type": "ListItem", position: 3, name: `${r.fromName} to ${r.toName}`, item: url },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <JsonLd data={faqLD} />
      <JsonLd data={breadcrumbLD} />

      <header
        className="w-full bg-cover bg-center px-6 py-12 sm:py-16"
        style={
          heroUrl
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(8,52,51,0.86) 0%, rgba(11,34,52,0.9) 100%), url(${heroUrl})`,
              }
            : { background: "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%)" }
        }
      >
        <div className="mx-auto max-w-3xl">
          <Link to="/transport" className="text-sm text-white/70 hover:text-white">
            ← Getting around Indonesia
          </Link>
          <p
            className="mt-4 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--blue-soft)" }}
          >
            How to get there
          </p>
          <h1 className="mt-2 font-serif text-white text-4xl sm:text-5xl font-semibold leading-tight">
            {r.fromName} to {r.toName}
          </h1>
          <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed">{r.summary}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* Our pick */}
        <section
          className="rounded-2xl border p-6 sm:p-8 mb-10"
          style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
        >
          <h2
            className="font-serif text-xl sm:text-2xl font-semibold mb-3"
            style={{ color: "var(--navy-deep)" }}
          >
            Our pick
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--slate-muted)" }}>
            {r.recommendation}
          </p>
        </section>

        {/* Options */}
        <h2
          className="font-serif text-2xl sm:text-3xl font-semibold mb-6"
          style={{ color: "var(--navy-deep)" }}
        >
          Your options
        </h2>
        <div className="flex flex-col gap-4 mb-14">
          {r.modes.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border p-5 sm:p-6"
              style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3
                  className="font-serif text-lg font-semibold"
                  style={{ color: "var(--navy-deep)" }}
                >
                  {m.label}
                </h3>
                <span className="text-sm font-medium" style={{ color: "var(--teal-link)" }}>
                  {m.priceUsdText}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6 text-sm">
                <div className="flex gap-2">
                  <dt className="font-semibold" style={{ color: "var(--navy-deep)" }}>
                    Duration:
                  </dt>
                  <dd style={{ color: "var(--slate-muted)" }}>{m.durationText}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold" style={{ color: "var(--navy-deep)" }}>
                    Frequency:
                  </dt>
                  <dd style={{ color: "var(--slate-muted)" }}>{m.frequencyText}</dd>
                </div>
              </dl>
              {m.notes && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--slate-muted)" }}>
                  {m.notes}
                </p>
              )}
              {m.bookingUrl && (
                <a
                  href={m.bookingUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="mt-4 inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--blue-bright)" }}
                >
                  Check schedules &amp; book →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* 12Go affiliate banner */}
        <TwelveGoBanner />

        {/* FAQ */}
        {r.faqs.length > 0 && (
          <section className="mb-14">
            <h2
              className="font-serif text-2xl sm:text-3xl font-semibold mb-6"
              style={{ color: "var(--navy-deep)" }}
            >
              Common questions
            </h2>
            <dl className="flex flex-col gap-5">
              {r.faqs.map((f, i) => (
                <div key={i}>
                  <dt
                    className="font-semibold text-base mb-1"
                    style={{ color: "var(--navy-deep)" }}
                  >
                    {f.question}
                  </dt>
                  <dd className="text-sm leading-relaxed" style={{ color: "var(--slate-muted)" }}>
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Related itineraries — the link back into the product */}
        {relatedTrips.length > 0 && (
          <section
            className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
          >
            <h2
              className="font-serif text-xl sm:text-2xl font-semibold mb-2"
              style={{ color: "var(--navy-deep)" }}
            >
              Itineraries that use this route
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--slate-muted)" }}>
              See it in a full day-by-day trip you can book.
            </p>
            <ul className="flex flex-col gap-3">
              {relatedTrips.map((t) => (
                <li key={t._id}>
                  <Link
                    to="/trips/$slug"
                    params={{ slug: t.slug.current }}
                    className="inline-flex items-center font-medium underline underline-offset-2"
                    style={{ color: "var(--teal-link)" }}
                  >
                    {t.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-xs leading-relaxed" style={{ color: "var(--slate-muted)" }}>
          Prices and schedules are working estimates and change with season and operator. Confirm
          current fares and departure times before you book. Some links are affiliate links; booking
          through them helps fund the site at no extra cost to you.
        </p>
      </main>
    </div>
  );
}
