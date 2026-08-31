// Hand-maintained "last meaningfully changed" dates for the static, non-CMS
// pages. Single source of truth: these feed BOTH the page's Article JSON-LD
// (`dateModified`) and the `<lastmod>` in sitemap.xml, so the two can never
// drift apart.
//
// WHY HAND-MAINTAINED: these pages are React/TS source, not Sanity docs, so
// there is no `_updatedAt` to read. Pages whose content DOES come from Sanity
// (/trips, /destinations, /destinations/<slug>) derive lastmod from the real
// `_updatedAt` of the content they list, in sitemap[.]xml.tsx.
//
// HOUSE RULE: bump the date here when you change the page's actual content
// (prices, rules, copy, sections). Do NOT bump it for a styling tweak, a
// refactor, or a dependency change. Google only trusts <lastmod> if it is
// consistently accurate, and a date that moves on every deploy is worth less
// than no date at all.
//
// Format: W3C date, YYYY-MM-DD.

export const PAGE_DATES = {
  home: "2026-06-26",
  connect: "2026-08-03",
  visaGuide: "2026-08-31",
  travelCosts: "2026-08-31",
  privacy: "2026-06-16",
  terms: "2026-06-13",
  // Every /transport page (index + the per-route pages) renders from
  // src/data/routes.ts, so they share that file's last content edit.
  transport: "2026-08-07",
  // Fallback for /destinations pages when a destination has no live Sanity
  // content yet: the last content edit to src/data/destinations.ts.
  destinations: "2026-08-28",
} as const;
