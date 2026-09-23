// One-off, ALREADY APPLIED on 2026-09-23 (txn py6aRUHSThGwaqIRPjGh0N).
// PARTE 1 of the scheduled content run. Kept in the repo so the change is
// reversible in ten seconds and so the reasoning survives.
//
// PAGE. /destinations/komodo-flores/best-time-to-visit-komodo
// 174 impressions, position 7.3, ZERO clicks over 2026-08-24 to 2026-09-20.
//
// WHY. List B (real demand, our page beyond position 30) was effectively empty
// this run: the only page past position 30 with meaningful volume is
// /destinations/bali-nearby-islands, and it was reworked on 2026-09-12, so the
// 28-day rule blocks it. Everything else past position 30 is dust (43, 35, 33
// impressions) on queries owned by dive operators. So the retouch went to the
// largest eligible CTR failure instead, and the report says so.
//
// The defect is specific, not a guess. The live SERP for "best time to visit
// komodo" is ten blogs and Labuan Bajo operators, no institutional sites, and
// their titles are near-identical: 7 of 10 carry "Komodo Island", 8 of 10 carry
// "Month by Month", 5 of 10 carry 2026. Ours carried none of the three, and was
// also byte-identical to the H1, i.e. no differentiation at all at position 7.
//
// CAVEAT, stated plainly. patch-komodo-best-time-geo-2026-09-14.mjs diagnosed
// this page's zero clicks as AI-answer surfacing (zero NAMED queries in GSC),
// and concluded the return here is citability rather than CTR. That diagnosis
// still stands and caps the upside. This change is orthogonal: it fixes a real
// snippet defect for the share of impressions that are ordinary blue links. The
// 2026-10-12 read scheduled by that earlier script measures impressions and
// position, which a metaTitle change does not move, so that read stays clean.
//
// The H1 (`title`) was NOT touched. On a guide, as on an article, title drives
// more than the tag.
//
// TO REVERT, restore the two OLD strings below.
//
//   OLD metaTitle       : "Best Time to Visit Komodo and Flores"
//   OLD metaDescription : "April to October is the dry season in Komodo, but what decides your trip is whether the boats can run. Month by month, with sea state, crowds and prices."
//
//   NEW metaTitle       : "Best Time to Visit Komodo Island: Month by Month (2026)"   (55 chars)
//   NEW metaDescription : "Dragons are visible year round. The season decides the sea, and whether boats reach Padar and Komodo. Month by month, with crowds, fees and prices."  (147 chars)
//
// NB the year in the title needs bumping in January, or dropping.
//
//   node scripts/patch-komodo-best-time-meta-2026-09-23.mjs          # dry run
//   node scripts/patch-komodo-best-time-meta-2026-09-23.mjs --revert # put the old strings back

import { readFileSync } from "node:fs";

const ID = "guide-komodo_flores-best-time-to-visit-komodo";
const OLD = {
  metaTitle: "Best Time to Visit Komodo and Flores",
  metaDescription:
    "April to October is the dry season in Komodo, but what decides your trip is whether the boats can run. Month by month, with sea state, crowds and prices.",
};
const NEW = {
  metaTitle: "Best Time to Visit Komodo Island: Month by Month (2026)",
  metaDescription:
    "Dragons are visible year round. The season decides the sea, and whether boats reach Padar and Komodo. Month by month, with crowds, fees and prices.",
};

const revert = process.argv.includes("--revert");
const set = revert ? OLD : NEW;

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

if (!process.argv.includes("--commit") && !revert) {
  console.log("Dry run. Would set:\n", set);
  console.log("\nPass --commit to write, or --revert to restore the old strings.");
  process.exit(0);
}

const res = await fetch(
  "https://u4ah1ore.api.sanity.io/v2024-01-01/data/mutate/production",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations: [{ patch: { id: ID, set } }] }),
  },
);
console.log(await res.text());
