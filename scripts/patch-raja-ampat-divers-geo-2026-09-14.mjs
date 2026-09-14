// One-off: give /trips/14-days-raja-ampat-divers question-shaped H2s in the body
// (GSC review of 2026-09-14).
//
// WHY. The page takes 273 impressions at position 8.6 with ZERO clicks — the
// highest-impression itinerary on the site, and the highest-ticket affiliate
// category we publish (diving, liveaboards). 250 of those 273 impressions are
// anonymised, which is the profile of a page being read inside AI answers rather
// than clicked. The body has 23 H2s and not one of them is a question: they are
// "Day 7", "Final verdict", "Trip at a glance". There is nothing an answer engine
// can lift.
//
// The answers already exist — six of them, good ones, in the faq array — but the
// FAQ block sits at the bottom behind a JSON-LD wrapper and is extracted far less
// than body prose under a matching heading. This promotes the three that carry
// real numbers into the body, verbatim where the wording already worked.
//
// Internal evidence for the format: 14-days-sulawesi-toraja-togean-bunaken is the
// only high-volume itinerary with question H2s (six of them) and it returns 2.42%
// CTR at position 7.3 — the best of any itinerary above 200 impressions, against
// this page's 0.00% at a better position. n=2, so this is a test, not a law.
//
// Every figure below is already published on this page: permits from the faq,
// $30-$60 homestays / $150-$400 lodges / $300+ liveaboards from the "Budget" and
// "Upgrade" lines in the body. Nothing new is asserted.
//
// The faq entries are deliberately LEFT IN PLACE: they feed the FAQPage JSON-LD,
// and body/FAQ overlap is normal and harmless.
//
// Read on 2026-10-12: first click on the page, and "raja ampat itinerary 14 days"
// under position 6 (7.1 today). If it is still at zero clicks with the position
// unmoved, the impressions are being consumed in-SERP and this page should be
// judged on citations, not clicks — same verdict as /indonesia-travel-costs.
//
// Dry run by default, writes with --commit.
//
//   node scripts/patch-raja-ampat-divers-geo-2026-09-14.mjs
//   node scripts/patch-raja-ampat-divers-geo-2026-09-14.mjs --commit

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

const SLUG = "14-days-raja-ampat-divers";
// Insert immediately before this block, so the three planning questions sit
// after "Why this route makes sense" and before the day-by-day.
const ANCHOR_KEY = "ky";
const ANCHOR_TEXT = "Day 1: Arrive in Sorong";
const MARKER_KEY = "geo0914h1"; // presence of this key means: already applied

const h2 = (key, text) => ({
  _key: key,
  _type: "block",
  style: "h2",
  markDefs: [],
  children: [{ _key: `${key}s`, _type: "span", marks: [], text }],
});
const p = (key, text) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: `${key}s`, _type: "span", marks: [], text }],
});

const BLOCKS = [
  h2(MARKER_KEY, "How much do the Raja Ampat permits cost in 2026?"),
  p(
    "geo0914p1",
    "Two official fees apply in 2026: the Marine Park Entry Permit at IDR 700,000 for foreign visitors, valid 12 months, plus a IDR 300,000 Visitor Entry Ticket for a single visit. That is about IDR 1,000,000, roughly US$65, per diver. Both are mandatory, collected locally in cash, and fund conservation.",
  ),
  p(
    "geo0914p2",
    "Both are collected locally, in Waisai or through your homestay, and in cash. ATMs are scarce once you leave Sorong, and permits, boats and most homestays take nothing else, so draw what you need before the ferry. Keep the permit slip: it is checked at the park sites, and the marine park half stays valid for twelve months if you come back.",
  ),

  h2("geo0914h2", "When is the best time to dive Raja Ampat?"),
  p(
    "geo0914p3",
    "October to April is the best window. Seas are calm, water sits around 28 to 30°C, and manta season peaks between December and February. The reefs are diveable most of the year, but July and August bring stronger winds and rougher crossings to the outer sites at Wayag and Misool.",
  ),
  p(
    "geo0914p4",
    "This route stays in the Dampier Strait rather than running out to Wayag or Misool, which is why it holds up better in the shoulder months than a liveaboard itinerary does. Conditions move year to year, so confirm with your homestay before you fix flights.",
  ),

  h2("geo0914h3", "Liveaboard or homestay in Raja Ampat?"),
  p(
    "geo0914p5",
    "Homestays, for this trip. Liveaboards reach the remote sites at Misool and Wayag and suit serious divers, but cost from around US$300 a day as a working estimate. Homestays around Kri and Gam are far cheaper, support local families, and put you on excellent Dampier Strait diving from a fixed base.",
  ),
  {
    _key: "geo0914tbl",
    _type: "comparisonTable",
    caption:
      "Working estimates; prices move with season and operator. The Raja Ampat permits, about IDR 1,000,000 per diver, are on top of all three.",
    columns: ["Where you sleep", "Cost per night", "Sites you reach", "Best for"],
    rows: [
      {
        _key: "geo0914r1",
        cells: [
          "Homestay on Kri or Gam",
          "$30 to $60",
          "Dampier Strait: Cape Kri, Blue Magic, Manta Sandy, Arborek",
          "Independent divers on a budget. The model this itinerary is built on",
        ],
      },
      {
        _key: "geo0914r2",
        cells: [
          "Dive lodge or eco-resort",
          "$150 to $400, usually all-inclusive",
          "The same Dampier Strait sites, with the dive operation on site",
          "Divers who would rather not organise boats each morning",
        ],
      },
      {
        _key: "geo0914r3",
        cells: [
          "Liveaboard",
          "From $300 per day",
          "Misool, Wayag and the remote south",
          "Serious divers chasing the outer islands, with the budget for it",
        ],
      },
    ],
  },
];

async function fetchLive() {
  const query = encodeURIComponent(
    `*[_type == "article" && slug.current == $slug][0]{_id, "keys": body[]._key, "anchor": body[_key == "${ANCHOR_KEY}"][0].children[0].text}`,
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
    console.error(`No live document for slug "${SLUG}"`);
    process.exit(1);
  }

  if (live.keys.includes(MARKER_KEY)) {
    console.log("Already applied (marker key present). Nothing to do.");
    return;
  }
  // Guard: the anchor must still be the block we think it is. If someone has
  // restructured the body since, stop rather than insert in the wrong place.
  if (live.anchor !== ANCHOR_TEXT) {
    console.error(
      `Anchor block "${ANCHOR_KEY}" reads "${live.anchor}", expected "${ANCHOR_TEXT}".\n` +
        "The body has been restructured. Re-pick the anchor before running this.",
    );
    process.exit(1);
  }
  const clash = BLOCKS.map((b) => b._key).filter((k) => live.keys.includes(k));
  if (clash.length) {
    console.error("Key collision with existing blocks:", clash);
    process.exit(1);
  }

  console.log(
    `Doc ${live._id}: ${live.keys.length} blocks, inserting ${BLOCKS.length} before "${ANCHOR_TEXT}".`,
  );
  for (const b of BLOCKS) {
    const label =
      b._type === "comparisonTable" ? `[table: ${b.rows.length} rows]` : b.children[0].text;
    console.log(
      `  ${b.style === "h2" ? "H2" : b._type === "comparisonTable" ? "  " : "p "}  ${label.slice(0, 96)}`,
    );
  }

  if (!COMMIT) {
    console.log("\nDry run. Re-run with --commit to write.");
    return;
  }

  const mutation = {
    mutations: [
      {
        patch: {
          id: live._id,
          insert: { before: `body[_key=="${ANCHOR_KEY}"]`, items: BLOCKS },
        },
      },
    ],
  };
  const res = await fetch(`${API}/data/mutate/${DS}?returnIds=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(mutation),
  });
  if (!res.ok) throw new Error(`Mutate failed: ${res.status} ${await res.text()}`);
  console.log("Written.", JSON.stringify(await res.json()));

  // Re-read, because a key-based patch can silently no-op on this dataset.
  const after = await fetchLive();
  const missing = BLOCKS.map((b) => b._key).filter((k) => !after.keys.includes(k));
  if (missing.length) {
    console.error("VERIFY FAILED, these blocks are not on the document:", missing);
    process.exit(1);
  }
  console.log(`Verified: ${after.keys.length} blocks now (was ${live.keys.length}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
