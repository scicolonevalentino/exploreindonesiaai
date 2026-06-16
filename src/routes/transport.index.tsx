import { createFileRoute, Link } from "@tanstack/react-router";

import { JsonLd } from "@/components/JsonLd";
import { TRANSPORT_ROUTES, type TransportRoute } from "@/data/routes";

// Built routes only (live + draft). "todo" backlog rows are not listed.
const LISTED = TRANSPORT_ROUTES.filter((r) => r.status !== "todo");

// Group routes by origin hub, preserving first-seen order (Bali first).
const GROUPS: { from: string; routes: TransportRoute[] }[] = (() => {
  const byFrom = new Map<string, TransportRoute[]>();
  for (const r of LISTED) {
    const list = byFrom.get(r.fromName);
    if (list) list.push(r);
    else byFrom.set(r.fromName, [r]);
  }
  return [...byFrom.entries()].map(([from, routes]) => ({ from, routes }));
})();

// Curated phrases for the kinetic headline (decorative; the real, crawlable
// links live in the grouped list below). Six phrases -> 15s loop (see styles.css).
const KINETIC = [
  { from: "Bali", to: "Gili Islands" },
  { from: "Jakarta", to: "Yogyakarta" },
  { from: "Bali", to: "Nusa Penida" },
  { from: "Lombok", to: "Gili Islands" },
  { from: "Bali", to: "Labuan Bajo" },
  { from: "Medan", to: "Lake Toba" },
];

export const Route = createFileRoute("/transport/")({
  head: () => {
    const url = "https://exploreindonesia.ai/transport";
    const title = "Getting around Indonesia: routes & transport | ExploreIndonesia.ai";
    const description =
      "How to travel between Indonesia's islands and hubs — ferries, fast boats and flights, with journey times and working price estimates.";
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
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="text-sm" style={{ color: "var(--slate-muted)" }}>
            ← Home
          </Link>

          <div className="mt-10 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: "var(--slate-muted)" }}
            >
              Routes &amp; transport
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
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--slate-muted)" }}
            >
              Practical, no-nonsense guides to the routes travellers actually take between
              Indonesia's islands and hubs. Each one ends at a trip you can book.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 sm:pb-20">
        {GROUPS.map((g) => (
          <section key={g.from} className="mb-10">
            <h2
              className="mb-4 font-serif text-xl font-semibold"
              style={{ color: "var(--navy-deep)" }}
            >
              From {g.from}
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {g.routes.map((r) => (
                <li key={r.slug}>
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
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
