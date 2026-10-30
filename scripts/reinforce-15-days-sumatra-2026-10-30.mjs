// PARTE 1 + PARTE 3, 2026-10-30 generator run, on /trips/15-days-sumatra.
// Log: docs/reinforce-15-days-sumatra-2026-10-30.md. Re-read on 2026-11-27.
//
// Baseline GSC 2026-09-30..10-27 (query + page): "sumatra itinerary" 22 impr,
// 1 click, pos 9.6; "sumatra travel itinerary" 1 impr pos 9; "sumatra road
// trip" 2 impr pos 23.5. The page had never been retouched (last edit
// 2026-08-29, no reinforce log). SERP for "sumatra itinerary" on 2026-10-30:
// Southeast Asia Backpacker ("10-Day & 2-Week routes"), Lonely Planet, Bucketlist
// Bri ("10-Day North Sumatra for First-Timers"), North Abroad, Museum of Wander,
// tour operators (G Adventures, Rickshaw). Editorial, winnable. The dominant
// format compares several trip lengths; this page offered one.
//
// Why it did not click: the metaTitle did not say "itinerary"; no section
// answered "which Sumatra itinerary / how many days"; no transfer overview;
// the only affiliate link was Airalo (no transport, trek or room links at all);
// bestSeason carried an en dash; one span leaked a generation artefact ("the
// FAQ is right that").
//
// OLD VALUES (exact, for rollback):
//   metaTitle       "Sumatra in 15 Days: Orangutans, Jungle & Lake Toba"
//   metaDescription "15 days across 5 stops in North Sumatra: Bukit Lawang orangutan treks from $30-60 a day, Berastagi volcanoes, Lake Toba and Samosir. Transfers explained."
//   bestSeason      "May–September"
//   body            123 blocks, faq 6, affiliateLinks 1: snapshot in
//                   docs/reinforce-15-days-sumatra-2026-10-30.body.json
//
//   node scripts/reinforce-15-days-sumatra-2026-10-30.mjs           # dry run
//   node scripts/reinforce-15-days-sumatra-2026-10-30.mjs --commit
//
// Rewrites the whole body / faq / affiliateLinks arrays (never a keyed
// selector, items in this dataset often lack _key) and reads them back.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(root, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);
const TOKEN = env.SANITY_API_WRITE_TOKEN;
const BASE = "https://u4ah1ore.api.sanity.io/v2024-01-01/data";
const COMMIT = process.argv.includes("--commit");
const SLUG = "15-days-sumatra";
const MARK = "s15-";

const NEW_META_TITLE = "Sumatra Itinerary: 15 Days from Orangutans to Lake Toba";
const NEW_META_DESC =
  "A 15-day Sumatra itinerary from Medan: Bukit Lawang orangutans, Berastagi volcanoes, Lake Toba and Samosir, with transfers, costs and a 10-day version.";
const NEW_BEST_SEASON = "May to September";
const SEO_NOTE =
  "2026-10-30 generator run (PARTE 1 + 3): metaTitle/metaDescription rewritten around 'sumatra itinerary' (GSC 22 impr, pos 9.6, 1 click), two question H2s with tables added, transport/trek/room affiliate links added, bestSeason en dash removed. Re-read GSC on 2026-11-27; do not retouch before. Log: docs/reinforce-15-days-sumatra-2026-10-30.md";

async function query(groq) {
  const r = await fetch(`${BASE}/query/production?query=${encodeURIComponent(groq)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}
async function mutate(mutations) {
  const r = await fetch(`${BASE}/mutate/production`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(JSON.stringify(j));
  return j;
}

let n = 0;
const K = (p) => `${MARK}${p}${++n}`;
// parts: strings, [text, "/relative"] for an internal link, [text, "PLACEHOLDER_ID", "aff"] for an affiliate link.
function block(style, parts) {
  const markDefs = [];
  const children = parts.map((p) => {
    if (typeof p === "string") return { _type: "span", _key: K("s"), marks: [], text: p };
    const mk = K("m");
    if (p[2] === "aff") markDefs.push({ _key: mk, _type: "affiliateLinkRef", placeholderId: p[1] });
    else markDefs.push({ _key: mk, _type: "externalLink", href: p[1], blank: false });
    return { _type: "span", _key: K("s"), marks: [mk], text: p[0] };
  });
  return { _type: "block", _key: K("b"), style, markDefs, children };
}
const table = (caption, columns, rows) => ({
  _type: "comparisonTable",
  _key: K("t"),
  caption,
  columns,
  rows: rows.map((cells) => ({ _key: K("r"), cells })),
});

const BK = (place) =>
  `https://www.booking.com/searchresults.html?ss=${place}%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1`;
const NEW_AFF = [
  {
    partner: "12go",
    placeholderId: "TWELVEGO_MEDAN_PARAPAT",
    affiliateUrl: "https://12go.asia/en/travel/medan/parapat?z=16022946",
    publicUrl: "https://12go.asia/en/travel/medan/parapat",
    anchorText: "Medan to Parapat transfers on 12Go",
    experienceCategory: "transport",
  },
  {
    partner: "viator",
    placeholderId: "VIATOR_BUKIT_LAWANG_DAY_TREK",
    affiliateUrl:
      "https://www.viator.com/tours/Medan/Full-Day-Jungle-Trek-Bukit-Lawang-Tour/d4866-193061P1?pid=P00303362&mcid=42383&medium=link&campaign=sumatra15",
    publicUrl: "https://www.viator.com/tours/Medan/Full-Day-Jungle-Trek-Bukit-Lawang-Tour/d4866-193061P1",
    anchorText: "full-day Bukit Lawang jungle trek",
    experienceCategory: "wildlife_tour",
  },
  {
    partner: "booking",
    placeholderId: "BOOKING_BUKIT_LAWANG",
    affiliateUrl: BK("Bukit+Lawang"),
    publicUrl: BK("Bukit+Lawang"),
    anchorText: "Bukit Lawang guesthouses on Booking.com",
    experienceCategory: "hotel",
  },
  {
    partner: "booking",
    placeholderId: "BOOKING_BERASTAGI",
    affiliateUrl: BK("Berastagi"),
    publicUrl: BK("Berastagi"),
    anchorText: "Berastagi hotels on Booking.com",
    experienceCategory: "hotel",
  },
  {
    partner: "booking",
    placeholderId: "BOOKING_TUK_TUK",
    affiliateUrl: BK("Tuk+Tuk%2C+Samosir"),
    publicUrl: BK("Tuk+Tuk%2C+Samosir"),
    anchorText: "Tuk Tuk and Samosir stays on Booking.com",
    experienceCategory: "hotel",
  },
].map((a, i) => ({ ...a, _key: `${MARK}aff${i}`, _type: "affiliateLink", linkStatus: "live", notes: null }));

// Inserted at the very top of the body.
const TOP = [
  block("h2", ["Which Sumatra itinerary should you choose: 7, 10 or 15 days?"]),
  block("normal", [
    "Choose by how many regions you want and how much road you can take. Seven days covers Bukit Lawang and Lake Toba; ten days adds a flight to Pulau Weh for the reef; fifteen days, this route, adds the Berastagi volcanoes and gives Lake Toba five nights. West Sumatra and the Mentawai Islands need a separate trip.",
  ]),
  table(
    "Sumatra itineraries compared by trip length",
    ["Trip length", "Route", "What you get", "What you give up", "Best for"],
    [
      ["5 days", "Medan, Lake Toba and Samosir", "Four nights on the lake, two road days", "Orangutans, volcanoes", "A short add-on to another trip"],
      ["7 days", "Medan, Bukit Lawang, Lake Toba", "Orangutan treks and three lake nights", "Berastagi, the coast, any buffer", "Wildlife first, limited time"],
      ["10 days", "Bukit Lawang, Lake Toba, flight to Banda Aceh, Pulau Weh", "Jungle, lake and a walk-in reef", "Berastagi, slow days", "A first visit that wants the range"],
      ["15 days (this plan)", "Medan, Bukit Lawang, Berastagi, Lake Toba, Medan", "All of North Sumatra by road, five lake nights, buffer days", "The coast; it stays inland", "Overland travellers, photographers, repeat visitors"],
      ["7 days, West Sumatra", "Padang, Bukittinggi, Harau Valley", "Minangkabau culture, canyon walls, Lake Maninjau", "Orangutans and Lake Toba, a separate flight", "A second Sumatra trip"],
    ],
  ),
  block("normal", [
    "Each length has its own plan: the ",
    ["7-day Bukit Lawang and Lake Toba itinerary", "/trips/7-days-bukit-lawang-lake-toba-orangutans"],
    ", the ",
    ["10-day Sumatra itinerary for first-timers", "/trips/10-days-sumatra-first-timers"],
    " and, for the other side of the island, the ",
    ["7-day West Sumatra route through Bukittinggi and Harau", "/trips/7-days-west-sumatra-bukittinggi-harau-valley"],
    ". The rest of this page is the fifteen-day version.",
  ]),
];

// Inserted before "What to book early, and what to keep flexible" (key k6z).
const MOVE = [
  block("h2", ["How do you get around Sumatra on this route?"]),
  block("normal", [
    "Entirely by road and one lake ferry. Private cars with drivers or shared tourist minibuses cover the four transfers between Medan, Bukit Lawang, Berastagi and Parapat, each three to four hours on slow roads, and the public ferry crosses from Parapat to Tuk Tuk on Samosir in 30 to 45 minutes. Each leg is arranged locally, in cash.",
  ]),
  table(
    "Every transfer on the 15-day Sumatra route, with working estimates",
    ["Leg", "How", "Time", "Working cost"],
    [
      ["Medan to Bukit Lawang", "Private car, or shared minibus from Pinang Baris terminal", "3 to 4 hours", "About $40 to $55 per car"],
      ["Bukit Lawang to Berastagi", "Private car arranged by your guesthouse", "About 4 hours", "Per vehicle; shared minibuses exist but add changes"],
      ["Berastagi to Parapat (Lake Toba)", "Private car or shared minibus", "3 to 4 hours", "Per vehicle or per seat; ask your hotel"],
      ["Parapat to Tuk Tuk (Samosir)", "Public passenger ferry from Tigaraja pier", "30 to 45 minutes", "IDR 15,000 to 25,000 per person"],
      ["Tuk Tuk to Medan", "First ferry, then private car to the city or Kualanamu", "4 to 5 hours door to door", "About $45 to $55 per car"],
    ],
  ),
  block("normal", [
    "Every road figure here is optimistic, so add an hour to each. If you would rather fix the lake leg before you fly, compare ",
    ["Medan to Parapat transfers on 12Go", "TWELVEGO_MEDAN_PARAPAT", "aff"],
    "; the same journey is listed as a fixed-price private transfer. For the orangutan day, a licensed guide through your guesthouse is the usual route, as a working estimate $30 to $60 per person including the park permit, or a ",
    ["full-day Bukit Lawang jungle trek", "VIATOR_BUKIT_LAWANG_DAY_TREK", "aff"],
    " can be booked ahead for a little more. Rooms are the easy part: ",
    ["Bukit Lawang guesthouses", "BOOKING_BUKIT_LAWANG", "aff"],
    ", ",
    ["Berastagi hotels", "BOOKING_BERASTAGI", "aff"],
    " and ",
    ["Tuk Tuk and Samosir stays", "BOOKING_TUK_TUK", "aff"],
    " are all on Booking.com, and only the lakefront fills in July and August.",
  ]),
];

// Leaked generation artefact: [blockKey, spanKey, from, to]
const FIXES = [
  ["k81", null, ", and the FAQ is right that 15 days is about the ceiling", ", and 15 days is about the ceiling"],
];

const NEW_FAQ = {
  _key: `${MARK}faq1`,
  question: "How many days do you need for Sumatra?",
  answer:
    "Seven days covers Bukit Lawang and Lake Toba. Ten days adds a flight to Banda Aceh and the reef at Pulau Weh. Fifteen days, this route, adds the Berastagi volcanoes and gives Lake Toba five nights with buffer days, which is about the ceiling for North Sumatra at a humane pace. West Sumatra, Kerinci and the Mentawai Islands need a trip of their own.",
};

const BANNED = [
  "—", "–", "hidden gem", "must-see", "paradise", "immerse yourself", "unforgettable", "something for everyone",
  "vibrant culture", "crystal-clear", "crystal clear", "breathtaking", "rich history", "local charm",
  "authentic experience", "off the beaten path", "once-in-a-lifetime", "bucket list", "dream destination", "(SEARCH",
];

const doc = await query(`*[_type=="article" && slug.current=="${SLUG}"][0]`);
if (!doc) throw new Error("article not found");
if (doc.body.some((b) => String(b._key).startsWith(MARK))) {
  console.log("Already applied (marker blocks present). Nothing to do.");
  process.exit(0);
}
if (doc.metaTitle !== "Sumatra in 15 Days: Orangutans, Jungle & Lake Toba") {
  throw new Error(`Unexpected live metaTitle: ${doc.metaTitle}. Not overwriting.`);
}

const snapPath = join(root, "docs", "reinforce-15-days-sumatra-2026-10-30.body.json");
if (!existsSync(snapPath)) {
  writeFileSync(
    snapPath,
    JSON.stringify(
      {
        _id: doc._id,
        _rev: doc._rev,
        metaTitle: doc.metaTitle,
        metaDescription: doc.metaDescription,
        bestSeason: doc.bestSeason,
        body: doc.body,
        faq: doc.faq,
        affiliateLinks: doc.affiliateLinks,
      },
      null,
      2,
    ),
  );
  console.log("Snapshot written:", snapPath);
}

const body = doc.body.map((b) => ({ ...b, children: b.children ? b.children.map((c) => ({ ...c })) : b.children }));
for (const [bk, , from, to] of FIXES) {
  const b = body.find((x) => x._key === bk);
  if (!b) throw new Error(`fix anchor ${bk} missing`);
  const span = b.children.find((c) => c.text.includes(from));
  if (!span) throw new Error(`fix text not found in ${bk}`);
  span.text = span.text.replace(from, to);
}
const idx = body.findIndex((b) => b._key === "k6z");
if (idx < 0) throw new Error("anchor k6z (What to book early) missing");
const newBody = [...TOP, ...body.slice(0, idx), ...MOVE, ...body.slice(idx)];

const haveIds = new Set((doc.affiliateLinks || []).map((a) => a.placeholderId));
const newAff = [...(doc.affiliateLinks || []), ...NEW_AFF.filter((a) => !haveIds.has(a.placeholderId))];
const newFaq = [...(doc.faq || []), NEW_FAQ];

const patch = {
  metaTitle: NEW_META_TITLE,
  metaDescription: NEW_META_DESC,
  bestSeason: NEW_BEST_SEASON,
  seoNote: SEO_NOTE,
  body: newBody,
  faq: newFaq,
  affiliateLinks: newAff,
};

// Validate.
const all = JSON.stringify({ ...doc, ...patch });
const fails = BANNED.filter((w) => all.toLowerCase().includes(w.toLowerCase()));
if (NEW_META_TITLE.length > 60) fails.push(`metaTitle ${NEW_META_TITLE.length}`);
if (NEW_META_DESC.length > 155) fails.push(`metaDescription ${NEW_META_DESC.length}`);
const keys = [...all.matchAll(/"_key":"([^"]+)"/g)].map((m) => m[1]);
if (new Set(keys).size !== keys.length) fails.push("duplicate _key");
const affIds = new Map(newAff.map((a) => [a.placeholderId, a.affiliateUrl]));
for (const b of newBody)
  for (const m of b.markDefs || [])
    if (m._type === "affiliateLinkRef" && !affIds.get(m.placeholderId)) fails.push(`aff ${m.placeholderId}`);
for (const [i, b] of newBody.entries())
  if (b.style === "h2" && b.children[0].text.includes("?")) {
    const w = newBody[i + 1].children.map((c) => c.text).join("").split(/\s+/).length;
    console.log(`  H2 "${b.children[0].text}" -> ${w} words${w < 40 || w > 60 ? "  <-- OUT OF 40-60" : ""}`);
  }
console.log(`metaTitle ${NEW_META_TITLE.length} / metaDescription ${NEW_META_DESC.length}`);
console.log(`body ${doc.body.length} -> ${newBody.length} blocks, faq ${doc.faq.length} -> ${newFaq.length}, affiliateLinks ${(doc.affiliateLinks || []).length} -> ${newAff.length}`);
if (fails.length) {
  console.error("VALIDATION FAILED:", fails);
  process.exit(1);
}
if (!COMMIT) {
  console.log("Dry run. Re-run with --commit to write.");
  process.exit(0);
}

await mutate([{ patch: { id: doc._id, ifRevisionID: doc._rev, set: patch } }]);
const after = await query(
  `*[_type=="article" && slug.current=="${SLUG}"][0]{metaTitle,metaDescription,bestSeason,seoNote,"n":count(body),"nf":count(faq),"na":count(affiliateLinks),"marks":count(body[_key match "${MARK}*"]),"k81":body[_key=="k81"][0].children[0].text}`,
);
const ok =
  after.metaTitle === NEW_META_TITLE &&
  after.metaDescription === NEW_META_DESC &&
  after.bestSeason === NEW_BEST_SEASON &&
  after.n === newBody.length &&
  after.nf === newFaq.length &&
  after.na === newAff.length &&
  after.marks === TOP.length + MOVE.length &&
  !after.k81.includes("the FAQ is right");
console.log(ok ? "VERIFIED after re-read:" : "VERIFY FAILED:", JSON.stringify(after));
if (!ok) process.exit(1);
