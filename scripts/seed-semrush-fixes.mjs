// One-off: applies SEMrush-audit content fixes to Sanity.
//  (1) Rewrites 20 trip metaTitles -> <=60 chars AND distinct from the H1
//      (clears "Title too long" + "Duplicate content in h1 and title").
//  (2) Rewrites Booking.com anchor text from generic ("(link)", "Search
//      Booking.com", "Booking.com") to "Search <Area> stays on Booking.com",
//      deriving <Area> from the link's ?ss= param (clears "non-descriptive
//      anchor text"). Booking.com externalLink marks only; affiliate links and
//      already-descriptive anchors are untouched.
//
// Usage: node scripts/seed-semrush-fixes.mjs [--commit]   (dry run without --commit)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMMIT = process.argv.includes("--commit");
const API = "https://u4ah1ore.api.sanity.io/v2021-06-07";
const DS = "production";
const TOKEN = (readFileSync(join(ROOT, ".env.local"), "utf8").match(
  /^SANITY_API_WRITE_TOKEN=(.+)$/m,
) || [])[1]?.trim();
if (!TOKEN) {
  console.error("No SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

// (1) metaTitle rewrites (verified <=60 chars, distinct from each H1 title)
const META_TITLES = {
  "7-days-lombok-gili-islands": "Lombok & Gili Islands in 7 Days: Full Itinerary",
  "15-days-sumatra": "Sumatra in 15 Days: Orangutans, Jungle & Lake Toba",
  "10-days-komodo-flores": "Komodo & Flores in 10 Days: Day-by-Day Itinerary",
  "7-days-bali-first-timers": "First-Timer Bali in 7 Days: Easy Itinerary",
  "30-days-indonesia-ultimate": "Ultimate 30-Day Indonesia Trip: Bali to Raja Ampat",
  "15-days-java-bali": "Java & Bali in 15 Days: Temples, Volcanoes & Beaches",
  "21-days-indonesia-beyond-bali": "Beyond Bali: 21-Day Off-the-Beaten-Path Trip",
  "20-days-wild-indonesia": "Wild Indonesia in 20 Days: Off-Grid Adventure",
  "7-days-yogyakarta-east-java": "Yogyakarta & East Java in 7 Days: Temples & Volcanoes",
  "15-days-indonesia-honeymoon": "Indonesia Honeymoon: 15-Day Bali, Komodo & Sumba",
  "7-days-bali-solo-travellers": "Solo Bali in 7 Days: Safe, Social Itinerary",
  "7-days-bali-couples": "Romantic Bali in 7 Days: Couples Itinerary",
  "20-days-across-indonesia": "Indonesia in 20 Days: Bali, Java, Komodo & Lombok",
  "14-days-raja-ampat-divers": "Raja Ampat Diving Trip: 14-Day Liveaboard Itinerary",
  "10-days-bali-gili-islands": "Bali & the Gili Islands in 10 Days: Itinerary",
  "5-days-labuan-bajo-komodo": "Komodo & Labuan Bajo in 5 Days: Boat Trip Guide",
  "10-days-bali-lombok-gili-islands": "Bali, Lombok & Gili in 10 Days: Island-Hop Plan",
  "14-days-indonesia-bali-java-komodo": "Indonesia in 14 Days: Bali, Java & Komodo Plan",
  "5-days-bali-ubud-canggu-uluwatu": "Bali in 5 Days: Ubud, Canggu & Uluwatu Trip Plan",
  "14-days-bali-komodo-sumba": "Bali, Komodo & Sumba in 14 Days: Day-by-Day Guide",
};

const GENERIC_ANCHORS = new Set(["(link)", "search booking.com", "booking.com", "link"]);

function areaFromHref(href) {
  try {
    const u = new URL(href);
    if (!/booking\.com/i.test(u.hostname)) return null;
    let ss = u.searchParams.get("ss");
    if (!ss) return null;
    ss = decodeURIComponent(ss.replace(/\+/g, " "));
    const area = ss.split(",")[0].trim();
    return area || null;
  } catch {
    return null;
  }
}

async function q(query) {
  const r = await fetch(`${API}/data/query/${DS}?query=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}
async function mutate(mutations) {
  const r = await fetch(`${API}/data/mutate/${DS}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j;
}

const arts = await q('*[_type=="article"]{_id, "slug": slug.current, metaTitle, body}');
const bySlug = Object.fromEntries(arts.map((a) => [a.slug, a]));
const mutations = [];

// (1) metaTitle
console.log("=== metaTitle changes ===");
for (const [slug, newTitle] of Object.entries(META_TITLES)) {
  const a = bySlug[slug];
  if (!a) {
    console.log(`  MISSING article for ${slug}`);
    continue;
  }
  const len = newTitle.length;
  const flag = len > 60 ? " !!OVER60!!" : "";
  console.log(`  ${slug}  (${len})${flag}\n      old: ${a.metaTitle}\n      new: ${newTitle}`);
  mutations.push({ patch: { id: a._id, set: { metaTitle: newTitle } } });
}

// (2) booking.com anchors
console.log("\n=== anchor-text changes (Booking.com) ===");
let totalAnchors = 0,
  leftoverLink = 0;
for (const a of arts) {
  if (!Array.isArray(a.body)) continue;
  let changed = 0;
  const samples = [];
  for (const block of a.body) {
    if (block._type !== "block" || !Array.isArray(block.children)) continue;
    const defs = Object.fromEntries((block.markDefs || []).map((d) => [d._key, d]));
    for (const span of block.children) {
      if (span._type !== "span" || typeof span.text !== "string") continue;
      const txt = span.text.trim();
      if (!GENERIC_ANCHORS.has(txt.toLowerCase())) continue;
      const md = (span.marks || [])
        .map((k) => defs[k])
        .find((d) => d && d._type === "externalLink" && /booking\.com/i.test(d.href || ""));
      if (!md) {
        if (txt.toLowerCase() === "(link)" || txt.toLowerCase() === "link") leftoverLink++;
        continue;
      }
      const area = areaFromHref(md.href);
      if (!area) continue;
      const next = `Search ${area} stays on Booking.com`;
      if (span.text === next) continue;
      if (samples.length < 3) samples.push(`"${span.text}" -> "${next}"`);
      span.text = next;
      changed++;
      totalAnchors++;
    }
  }
  if (changed) {
    console.log(`  ${a.slug}: ${changed} anchors  e.g. ${samples.join(" | ")}`);
    mutations.push({ patch: { id: a._id, set: { body: a.body } } });
  }
}
console.log(
  `\nTotal anchor rewrites: ${totalAnchors}. Unmatched "(link)" anchors (non-Booking, left as-is): ${leftoverLink}.`,
);
console.log(
  `\nPlanned mutations: ${mutations.length} (note: some articles get both a metaTitle and a body patch — they merge per id).`,
);

if (!COMMIT) {
  console.log("\nDRY RUN — no writes. Re-run with --commit.");
  process.exit(0);
}
// merge patches per id so body+metaTitle on same doc go in one patch
const byId = {};
for (const m of mutations) {
  const id = m.patch.id;
  byId[id] = byId[id] || { patch: { id, set: {} } };
  Object.assign(byId[id].patch.set, m.patch.set);
}
const merged = Object.values(byId);
const res = await mutate(merged);
console.log(`\n✓ committed ${res.results?.length ?? merged.length} document patches`);
