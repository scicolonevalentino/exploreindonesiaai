import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { SITEMAP_GUIDES_QUERY } from "@/lib/sanity-queries";
import groq from "groq";

const BASE_URL = "https://exploreindonesia.ai";

type SitemapArticle = {
  slug?: { current?: string };
  _updatedAt?: string;
};

type SitemapGuide = {
  slug?: string;
  destination?: string;
  _updatedAt?: string;
};

const SITEMAP_ARTICLES_QUERY = groq`*[_type == "article" && contentStatus == "live" && defined(slug.current)] {
  slug, _updatedAt
}`;

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

        const staticEntries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/trips", changefreq: "weekly", priority: "0.9" },
          { path: "/destinations", changefreq: "weekly", priority: "0.7" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
        ];

        // Destination landing pages.
        const { DESTINATION_CONTENT } = await import("@/data/destinations");
        for (const d of DESTINATION_CONTENT) {
          staticEntries.push({
            path: `/destinations/${d.slug}`,
            changefreq: "weekly",
            priority: "0.8",
          });
        }

        // Map a guide's `destination` enum value to its URL slug.
        const destSlugByValue = new Map(DESTINATION_CONTENT.map((d) => [d.value, d.slug]));

        // Transport route pages (built routes only; "todo" backlog excluded).
        const { TRANSPORT_ROUTES } = await import("@/data/routes");
        staticEntries.push({ path: "/transport", changefreq: "weekly", priority: "0.5" });
        for (const r of TRANSPORT_ROUTES) {
          if (r.status === "todo") continue;
          staticEntries.push({
            path: `/transport/${r.slug}`,
            changefreq: "monthly",
            priority: "0.6",
          });
        }

        const urls: string[] = [];

        for (const e of staticEntries) {
          urls.push(
            [
              "  <url>",
              `    <loc>${BASE_URL}${e.path}</loc>`,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              "  </url>",
            ].join("\n"),
          );
        }

        for (const a of articles) {
          const slug = a.slug?.current;
          if (!slug) continue;
          urls.push(
            [
              "  <url>",
              `    <loc>${BASE_URL}/trips/${slug}</loc>`,
              a._updatedAt ? `    <lastmod>${a._updatedAt}</lastmod>` : null,
              "    <changefreq>monthly</changefreq>",
              "    <priority>0.8</priority>",
              "  </url>",
            ]
              .filter(Boolean)
              .join("\n"),
          );
        }

        // Supporting guides, nested under their destination.
        for (const g of guides) {
          const destSlug = g.destination ? destSlugByValue.get(g.destination) : undefined;
          if (!g.slug || !destSlug) continue;
          urls.push(
            [
              "  <url>",
              `    <loc>${BASE_URL}/destinations/${destSlug}/${g.slug}</loc>`,
              g._updatedAt ? `    <lastmod>${g._updatedAt}</lastmod>` : null,
              "    <changefreq>monthly</changefreq>",
              "    <priority>0.7</priority>",
              "  </url>",
            ]
              .filter(Boolean)
              .join("\n"),
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
