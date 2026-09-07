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
  visaGuide: "2026-09-07",
  travelCosts: "2026-09-07",
  privacy: "2026-06-16",
  terms: "2026-06-13",
  // Every /transport page (index + the per-route pages) renders from
  // src/data/routes.ts, so they share that file's last content edit.
  transport: "2026-08-07",
  // Fallback for /destinations pages when a destination has no live Sanity
  // content yet: the last content edit to src/data/destinations.ts.
  destinations: "2026-08-28",
} as const;

/**
 * Render a PAGE_DATES value as the visible "Last updated" line.
 *
 * WHY THIS EXISTS: the dates above already fed the JSON-LD `dateModified` and
 * the sitemap `<lastmod>`, but each page also hard-coded the same date as prose
 * in its header, and the two drifted: on 2026-09-07 /visa-guide read
 * "14 August 2026" against a PAGE_DATES value of 2026-08-31, and
 * /indonesia-travel-costs read "29 August" against the same 2026-08-31. A
 * visible date that contradicts the structured one is worse than no date,
 * because freshness is a signal both Google and AI answers read. Format the
 * prose from the same constant and they cannot disagree again.
 */
export function formatPageDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
