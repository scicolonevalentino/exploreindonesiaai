import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { SITEMAP_GUIDES_QUERY } from "@/lib/sanity-queries";
import { PAGE_DATES } from "@/data/page-dates";
import groq from "groq";

const BASE_URL = "https://exploreindonesia.ai";

type SitemapArticle = {
  slug?: { current?: string };
  _updatedAt?: string;
  destinationPrimary?: string;
  destinationSecondary?: string[];
};

type SitemapGuide = {
  slug?: string;
  destination?: string;
  _updatedAt?: string;
};

// `destinationPrimary` / `destinationSecondary` are not rendered in the sitemap;
// they exist so a destination hub can inherit the freshest `_updatedAt` of the
// articles it actually lists (same filter as ARTICLES_BY_DESTINATION_QUERY in
// destinations.$destination.tsx).
const SITEMAP_ARTICLES_QUERY = groq`*[_type == "article" && contentStatus == "live" && defined(slug.current)] {
  slug, _updatedAt, destinationPrimary, destinationSecondary
}`;

/** Latest of the given W3C dates, or undefined if none are usable. */
function latest(...dates: Array<string | undefined>): string | undefined {
  let best: string | undefined;
  let bestMs = -Infinity;
  for (const d of dates) {
    if (!d) continue;
    const ms = Date.parse(d);
    if (Number.isNaN(ms) || ms <= bestMs) continue;
    best = d;
    bestMs = ms;
  }
  return best;
}

function urlEntry(opts: {
  path: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
}): string {
  return [
    "  <url>",
    `    <loc>${BASE_URL}${opts.path}</loc>`,
    opts.lastmod ? `    <lastmod>${opts.lastmod}</lastmod>` : null,
    `    <changefreq>${opts.changefreq}</changefreq>`,
    `    <priority>${opts.priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let articles: SitemapArticle[] = [];
        try {
          articles = await sanityClient.fetch<SitemapArticle[]>(SITEMAP_ARTICLES_QUERY);
        } catch (e) {
          console.error("sitemap: failed to fetch articles", e);
        }

        let guides: SitemapGuide[] = [];
        try {
          guides = await sanityClient.fetch<SitemapGuide[]>(SITEMAP_GUIDES_QUERY);
        } catch (e) {
          console.error("sitemap: failed to fetch guides", e);
        }

        // Freshness of the CMS-backed listings, so hub pages get a real
        // <lastmod> instead of none. A listing genuinely changes when the
        // content it lists changes.
        const newestArticle = latest(...articles.map((a) => a._updatedAt));
        const newestGuide = latest(...guides.map((g) => g._updatedAt));

        const staticEntries: Array<{
          path: string;
          changefreq: string;
          priority: string;
          lastmod?: string;
        }> = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: PAGE_DATES.home },
          {
            path: "/trips",
            changefreq: "weekly",
            priority: "0.9",
            lastmod: newestArticle,
          },
          {
            path: "/destinations",
            changefreq: "weekly",
            priority: "0.7",
            lastmod: latest(newestArticle, newestGuide, PAGE_DATES.destinations),
          },
          { path: "/connect", changefreq: "monthly", priority: "0.7", lastmod: PAGE_DATES.connect },
          {
            path: "/visa-guide",
            changefreq: "monthly",
            priority: "0.8",
            lastmod: PAGE_DATES.visaGuide,
          },
          {
            path: "/indonesia-travel-costs",
            changefreq: "monthly",
            priority: "0.8",
            lastmod: PAGE_DATES.travelCosts,
          },
          { path: "/privacy", changefreq: "yearly", priority: "0.3", lastmod: PAGE_DATES.privacy },
          { path: "/terms", changefreq: "yearly", priority: "0.3", lastmod: PAGE_DATES.terms },
        ];

        // Destination landing pages. Each one lists the articles and guides for
        // its destination, so it inherits the freshest `_updatedAt` among them
        // and falls back to the static data file's own date.
        const { DESTINATION_CONTENT } = await import("@/data/destinations");
        for (const d of DESTINATION_CONTENT) {
          const destArticles = articles.filter(
            (a) =>
              a.destinationPrimary === d.value || (a.destinationSecondary ?? []).includes(d.value),
          );
          const destGuides = guides.filter((g) => g.destination === d.value);
          staticEntries.push({
            path: `/destinations/${d.slug}`,
            changefreq: "weekly",
            priority: "0.8",
            lastmod: latest(
              ...destArticles.map((a) => a._updatedAt),
              ...destGuides.map((g) => g._updatedAt),
              PAGE_DATES.destinations,
            ),
          });
        }

        // Map a guide's `destination` enum value to its URL slug.
        const destSlugByValue = new Map(DESTINATION_CONTENT.map((d) => [d.value, d.slug]));

        // Transport route pages (built routes only; "todo" backlog excluded).
        // All of them render from src/data/routes.ts, so they share its date.
        const { TRANSPORT_ROUTES } = await import("@/data/routes");
        staticEntries.push({
          path: "/transport",
          changefreq: "weekly",
          priority: "0.5",
          lastmod: PAGE_DATES.transport,
        });
        for (const r of TRANSPORT_ROUTES) {
          if (r.status === "todo") continue;
          staticEntries.push({
            path: `/transport/${r.slug}`,
            changefreq: "monthly",
            priority: "0.6",
            lastmod: PAGE_DATES.transport,
          });
        }

        const urls: string[] = [];

        for (const e of staticEntries) {
          urls.push(urlEntry(e));
        }

        for (const a of articles) {
          const slug = a.slug?.current;
          if (!slug) continue;
          urls.push(
            urlEntry({
              path: `/trips/${slug}`,
              changefreq: "monthly",
              priority: "0.8",
              lastmod: a._updatedAt,
            }),
          );
        }

        // Supporting guides, nested under their destination.
        for (const g of guides) {
          const destSlug = g.destination ? destSlugByValue.get(g.destination) : undefined;
          if (!g.slug || !destSlug) continue;
          urls.push(
            urlEntry({
              path: `/destinations/${destSlug}/${g.slug}`,
              changefreq: "monthly",
              priority: "0.7",
              lastmod: g._updatedAt,
            }),
          );
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
