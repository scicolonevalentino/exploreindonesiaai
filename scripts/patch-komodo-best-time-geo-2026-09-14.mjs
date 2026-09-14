// One-off: make /destinations/komodo-flores/best-time-to-visit-komodo extractable
// (GSC review of 2026-09-14).
//
// WHY. The page takes 190 impressions at position 7.4 with zero clicks, and — the
// tell — GSC reports ZERO named queries for it. Not a small number: none. That is
// a page being surfaced very widely and very shallowly, i.e. read inside AI
// answers, exactly the profile documented for /indonesia-travel-costs. Its three
// siblings behave the same way: best-time-to-visit-lombok 119 impressions at 8.8
// with 0 clicks, best-time-to-visit-sumatra 71 at 8.9 with 0 clicks,
// best-time-to-visit-mount-bromo 113 at 17.6 with 1. Cluster total: 493
// impressions, 1 click.
//
// So the return here is citability, not CTR. Two things were missing:
//   1. The month-by-month section was six prose bullets. Comparative tables are
//      the single most-cited format in AI answers, and the body already supports
//      a comparisonTable block (used on best-islands-near-bali).
//   2. The mid-page H2s were labels ("Month by month", "Avoiding the crowds"),
//      not the questions people type. Answer engines match on the question.
//
// NOT touched: the opening "The short answer" H2. That is the house pattern
// across fifteen guides, and it already carries a self-contained answer — the one
// thing this page was doing right. Renaming it here alone would break the set.
//
// Every fact in the table is lifted from the prose already on the page (sea
// state, crowd peak mid-July to late August, highest prices in peak, "strong
// value" in April/May). Nothing new is asserted, and no rainfall or temperature
// figure is invented: this page's own argument is that sea state, not rain,
// decides a Komodo trip.
//
// Read on 2026-10-12: impressions holding or rising at a stable position, and
// presence in AI answers for "best time to visit Komodo". Clicks are NOT the
// metric here. If it works, apply the same shape to the three sibling guides.
//
// Dry run by default, writes with --commit.
//
//   node scripts/patch-komodo-best-time-geo-2026-09-14.mjs
//   node scripts/patch-komodo-best-time-geo-2026-09-14.mjs --commit

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMMIT = process.argv.includes("--commit");
const PROJECT = "u4ah1ore";
const DS = "production";
const API = `https://${PROJECT}.api.sanity.io/v2021-06-07`;

const TOKEN = (readFileSync(join(ROOT, ".env.local"), "utf8").match(
  /^SANITY_API_WRITE_TOKEN=(.+)$/m,
) || [])[1]?.trim();
if (!TOKEN) {
  console.error("No SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const SLUG = "best-time-to-visit-komodo";
const ANCHOR_KEY = "b6"; // "Month by month" — the table and lead answer go after it
const MARKER_KEY = "geo0914kom1";

// Heading rewrites: key -> [expected old text, new text]
const HEADINGS = {
  b6: ["Month by month", "Which month is the best time to visit Komodo?"],
  b13: [
    "When to go for diving and manta rays",
    "When is the best time to dive Komodo and see manta rays?",
  ],
  b19: ["Avoiding the crowds", "When is Komodo least crowded?"],
};

const LEAD = {
  _key: MARKER_KEY,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [
    {
      _key: `${MARKER_KEY}s`,
      _type: "span",
      marks: [],
      text: "May, June, September and October are the best months. You get the dry season's calm seas and clear water without the July and August peak in boats and prices. July and August have the most reliable weather but the busiest anchorages. January and February are the wettest and roughest, when crossings get cancelled.",
    },
  ],
};

const TABLE = {
  _key: "geo0914komtbl",
  _type: "comparisonTable",
  caption:
    "What decides a Komodo trip is whether the boats can run, not the rain total. Conditions and operator schedules move year to year, so confirm before you book.",
  columns: ["Months", "Sea and weather", "Crowds and price", "Verdict"],
  rows: [
    {
      _key: "geo0914komr1",
      cells: [
        "April, May",
        "Early dry season. Seas settling, hills still green.",
        "Few boats, strong value.",
        "The best-value window.",
      ],
    },
    {
      _key: "geo0914komr2",
      cells: [
        "June, July, August",
        "Peak dry season, the most reliable weather.",
        "Busiest boats and highest prices. Book liveaboards and popular tours well ahead.",
        "Best conditions, worst crowds.",
      ],
    },
    {
      _key: "geo0914komr3",
      cells: [
        "September, October",
        "Warm, dry, calmer seas.",
        "Thinning out after the August peak.",
        "The other sweet spot.",
      ],
    },
    {
      _key: "geo0914komr4",
      cells: [
        "November, December",
        "Wet season begins. Trips still run on the calmer days.",
        "Quiet.",
        "Workable if you keep the plan flexible.",
      ],
    },
    {
      _key: "geo0914komr5",
      cells: [
        "January, February",
        "The wettest and roughest months. Open crossings can be uncomfortable.",
        "Quietest, and some operators scale back.",
        "Only if your dates are fixed.",
      ],
    },
    {
      _key: "geo0914komr6",
      cells: [
        "March",
        "The rains ease and conditions improve towards the dry season.",
        "Quiet.",
        "A shoulder gamble that often pays off.",
      ],
    },
  ],
};

const BLOCKS = [LEAD, TABLE];

async function fetchLive() {
  const query = encodeURIComponent(
    `*[_type == "guide" && slug.current == $slug][0]{_id, "keys": body[]._key, "heads": body[style == "h2"]{_key, "t": children[0].text}}`,
  );
  const params = encodeURIComponent(JSON.stringify(SLUG));
  const res = await fetch(`${API}/data/query/${DS}?query=${query}&$slug=${params}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

async function main() {
  const live = await fetchLive();
  if (!live) {
    console.error(`No live guide for slug "${SLUG}"`);
    process.exit(1);
  }
  if (live.keys.includes(MARKER_KEY)) {
    console.log("Already applied (marker key present). Nothing to do.");
    return;
  }

  // Guard every heading we are about to overwrite: if any has been edited since,
  // stop rather than clobber someone else's wording.
  const byKey = Object.fromEntries(live.heads.map((h) => [h._key, h.t]));
  for (const [key, [oldText, newText]] of Object.entries(HEADINGS)) {
    if (byKey[key] !== oldText) {
      console.error(`Heading ${key} reads "${byKey[key]}", expected "${oldText}". Aborting.`);
      process.exit(1);
    }
    console.log(`  H2 ${key}: "${oldText}"\n      -> "${newText}"`);
  }
  const clash = BLOCKS.map((b) => b._key).filter((k) => live.keys.includes(k));
  if (clash.length) {
    console.error("Key collision:", clash);
    process.exit(1);
  }
  console.log(
    `\n  + lead answer (${LEAD.children[0].text.split(/\s+/).length} words) and a ${TABLE.rows.length}-row table after "${HEADINGS[ANCHOR_KEY][1]}"`,
  );

  if (!COMMIT) {
    console.log("\nDry run. Re-run with --commit to write.");
    return;
  }

  const mutations = [
    {
      patch: {
        id: live._id,
        set: Object.fromEntries(
          Object.entries(HEADINGS).map(([key, [, newText]]) => [
            `body[_key=="${key}"].children[0].text`,
            newText,
          ]),
        ),
      },
    },
    {
      patch: {
        id: live._id,
        insert: { after: `body[_key=="${ANCHOR_KEY}"]`, items: BLOCKS },
      },
    },
  ];
  const res = await fetch(`${API}/data/mutate/${DS}?returnIds=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate failed: ${res.status} ${await res.text()}`);
  console.log("Written.", JSON.stringify(await res.json()));

  // Re-read: key-based patches can silently no-op on this dataset.
  const after = await fetchLive();
  const afterHeads = Object.fromEntries(after.heads.map((h) => [h._key, h.t]));
  const bad = Object.entries(HEADINGS).filter(([k, [, nt]]) => afterHeads[k] !== nt);
  const missing = BLOCKS.map((b) => b._key).filter((k) => !after.keys.includes(k));
  if (bad.length || missing.length) {
    console.error("VERIFY FAILED. headings:", bad, "blocks:", missing);
    process.exit(1);
  }
  console.log(
    `Verified: ${after.keys.length} blocks now (was ${live.keys.length}), 3 headings rewritten.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
