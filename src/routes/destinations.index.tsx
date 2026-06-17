// /destinations — index of every destination hub.
//
// Both the destination-hub and guide breadcrumbs point at /destinations, so this
// page must exist. It is also a useful internal-linking layer: one page that
// links to all 8 cluster hubs.

import { createFileRoute, Link } from "@tanstack/react-router";

import { JsonLd } from "@/components/JsonLd";
import { DESTINATION_CONTENT } from "@/data/destinations";
import { setCdnCache } from "@/lib/cdn-cache";

const SITE = "https://exploreindonesia.ai";
const TITLE = "Indonesia destinations | ExploreIndonesia.ai";
const DESCRIPTION =
  "Browse Indonesia by destination: Bali, Lombok and the Gilis, Komodo and Flores, Java, Raja Ampat and more. Itineraries, guides and transport, all in one place.";

export const Route = createFileRoute("/destinations/")({
  loader: async () => {
    await setCdnCache();
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/destinations` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/destinations` }],
  }),
  component: DestinationsIndex,
});

function DestinationsIndex() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Indonesia destinations",
    itemListElement: DESTINATION_CONTENT.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/destinations/${d.slug}`,
      name: d.name,
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE}/destinations` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <JsonLd data={itemListLd} />
      <JsonLd data={breadcrumbLd} />

      <header
        className="w-full px-6 py-12 sm:py-16"
        style={{ background: "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%)" }}
      >
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← Home
          </Link>
          <p
            className="mt-4 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--blue-soft)" }}
          >
            Destinations
          </p>
          <h1 className="mt-2 font-serif text-white text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
            Explore Indonesia by destination
          </h1>
          <p className="mt-5 text-white/85 text-base sm:text-lg max-w-3xl leading-relaxed">
            Each destination brings together day-by-day itineraries, in-depth guides, and the
            transport you need to get there. Pick a region to start planning.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATION_CONTENT.map((d) => (
            <Link
              key={d.slug}
              to="/destinations/$destination"
              params={{ destination: d.slug }}
              className="group rounded-2xl border bg-white p-6 transition-shadow hover:shadow-lg"
              style={{ borderColor: "var(--border-cream)" }}
            >
              <h2
                className="font-serif text-2xl font-semibold mb-2"
                style={{ color: "var(--navy-deep)" }}
              >
                {d.name}
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-dark)" }}>
                {d.intro}
              </p>
              <ul className="flex flex-wrap gap-2">
                {d.highlights.slice(0, 4).map((h) => (
                  <li
                    key={h}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
