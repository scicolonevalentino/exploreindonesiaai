import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { JsonLd } from "@/components/JsonLd";
import { TRANSPORT_ROUTES, type TransportRoute } from "@/data/routes";

// Built routes only (live + draft). "todo" backlog rows are not listed.
const LISTED = TRANSPORT_ROUTES.filter((r) => r.status !== "todo");

// Featured = the iconic island-hopping ferry routes. These lead the page; the
// rest (longer hauls, flights, overland, transfers) sit under "show all" so the
// hub reads as island-hopping first and never exposes sparse, gappy groups.
const FEATURED_SLUGS = [
  "bali-to-gili-islands",
  "bali-to-nusa-penida",
  "bali-to-lombok",
  "lombok-to-gili-islands",
];
const FEATURED = LISTED.filter((r) => FEATURED_SLUGS.includes(r.slug));
const REST = LISTED.filter((r) => !FEATURED_SLUGS.includes(r.slug));

// Curated phrases for the kinetic headline (decorative; the real, crawlable
// links live below). Six phrases -> 15s loop (see styles.css).
const KINETIC = [
  { from: "Bali", to: "Gili Islands" },
  { from: "Bali", to: "Nusa Penida" },
  { from: "Lombok", to: "Gili Islands" },
  { from: "Bali", to: "Lombok" },
  { from: "Bali", to: "Labuan Bajo" },
  { from: "Jakarta", to: "Yogyakarta" },
];

function RouteCard({ r }: { r: TransportRoute }) {
  return (
    <li>
      <Link
        to="/transport/$route"
        params={{ route: r.slug }}
        className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--border-cream)] bg-white px-5 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--teal-link)] hover:shadow-md"
      >
        <span className="font-medium text-[var(--navy-deep)] group-hover:text-white">
          {r.fromName} to {r.toName}
        </span>
        <span
          aria-hidden
          className="text-[#bcd2cc] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white"
        >
          →
        </span>
      </Link>
    </li>
  );
}

export const Route = createFileRoute("/transport/")({
  head: () => {
    const url = "https://exploreindonesia.ai/transport";
    const title = "Getting around Indonesia: routes & transport";
    const description =
      "Island-hopping made simple: how to travel between Indonesia's islands and hubs, with journey times and working price estimates.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: TransportHub,
});

function TransportHub() {
  const [showAll, setShowAll] = useState(false);

  const itemListLD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Indonesia transport routes",
    itemListElement: LISTED.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://exploreindonesia.ai/transport/${r.slug}`,
      name: `${r.fromName} to ${r.toName}`,
    })),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <JsonLd data={itemListLD} />

      <header className="w-full px-6 pt-10 pb-12 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="text-sm" style={{ color: "var(--slate-muted)" }}>
            ← Home
          </Link>

          <div className="mt-10 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: "var(--slate-muted)" }}
            >
              Island hopping &amp; transport
            </p>
            <h1
              className="mt-3 font-serif text-3xl font-semibold sm:text-4xl"
              style={{ color: "var(--navy-deep)" }}
            >
              Getting around Indonesia
            </h1>

            {/* Kinetic, cycling route names. Decorative: aria-hidden, since the
                same routes appear as real links below. */}
            <div className="route-kin mt-5" aria-hidden="true">
              {KINETIC.map((p, i) => (
                <span key={i} style={{ animationDelay: `${i * 2.5}s` }}>
                  <span style={{ color: "var(--navy-deep)" }}>{p.from} to </span>
                  <span style={{ color: "var(--teal-link)" }}>{p.to}</span>
                </span>
              ))}
            </div>

            <p
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--slate-muted)" }}
            >
              Hopping between the islands? Here is how to make each crossing, with journey times and
              working price estimates. Every route ends at a trip you can book.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURED.map((r) => (
            <RouteCard key={r.slug} r={r} />
          ))}
        </ul>

        {/* Long tail: rendered (crawlable) but collapsed until expanded. */}
        <div className={`route-extra ${showAll ? "open" : ""}`}>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {REST.map((r) => (
              <RouteCard key={r.slug} r={r} />
            ))}
          </ul>
        </div>

        {!showAll && REST.length > 0 && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="group text-sm font-medium leading-relaxed"
              style={{ color: "var(--teal-link)" }}
            >
              <span style={{ color: "var(--slate-muted)" }}>
                Also from Lombok, Java, Flores and Sumatra.{" "}
              </span>
              Show all {LISTED.length} routes
              <span
                aria-hidden
                className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
