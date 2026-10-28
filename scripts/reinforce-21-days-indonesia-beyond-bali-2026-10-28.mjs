// PARTE 1 + PARTE 3, 2026-10-28 generator run, on /trips/21-days-indonesia-beyond-bali.
// Log: docs/reinforce-21-days-indonesia-beyond-bali-2026-10-28.md. Re-read on 2026-11-25.
//
// Baseline GSC 2026-09-28..10-25: "indonesia beyond bali" 32 impr, 0 clicks,
// pos 19.8, the only query on the page with more than one impression. SERP is
// editorial (Fodor's, Remote Lands, Selective Asia, Substack), so winnable.
// Why it did not rank: the metaTitle did not contain "Indonesia" and carried a
// banned phrase ("Off-the-Beaten-Path"); no section answered "where should I go
// beyond Bali" or "how many days" directly; four spans leaked generation
// artefacts ("the article suggests", "as the article notes"); one inbound link.
//
// OLD VALUES (exact, for rollback):
//   metaTitle       "Beyond Bali: 21-Day Off-the-Beaten-Path Trip"
//   metaDescription "A practical 21-day Indonesia beyond Bali itinerary: Yogyakarta, Bromo, Ijen, Komodo, Lombok, the Gilis and Sumatra, with day-by-day booking logic."
//   bestSeason      "April–October"
//   body            103 blocks, snapshot in docs/reinforce-21-days-indonesia-beyond-bali-2026-10-28.body.json
//
//   node scripts/reinforce-21-days-indonesia-beyond-bali-2026-10-28.mjs           # dry run
//   node scripts/reinforce-21-days-indonesia-beyond-bali-2026-10-28.mjs --commit
//
// Rewrites the whole body array (never a keyed selector) and reads it back.

import { readFileSync, writeFileSync } from "node:fs";
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
const SLUG = "21-days-indonesia-beyond-bali";

const NEW_META_TITLE = "Indonesia Beyond Bali: 21 Days from Java to Sumatra";
const NEW_META_DESC =
  "Indonesia beyond Bali in 21 days: Yogyakarta, Bromo and Ijen, Komodo, Lombok and the Gilis, then Sumatra's orangutans, with the flights and what to cut.";

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
const K = (p) => `bb28-${p}${++n}`;
// parts: strings, or [text, href] for an internal link.
function block(style, parts) {
  const markDefs = [];
  const children = parts.map((p) => {
    if (typeof p === "string") return { _type: "span", _key: K("s"), marks: [], text: p };
    const mk = K("m");
    markDefs.push({ _key: mk, _type: "externalLink", href: p[1], blank: false });
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

const TOP = [
  block("h2", ["Where should you go in Indonesia beyond Bali?"]),
  block("normal", [
    "The four regions that reward a first trip beyond Bali are Java for temples and volcanoes, Flores for the Komodo dragons, Lombok and the Gili Islands for quieter beaches, and North Sumatra for wild orangutans. All four connect through domestic flights or short boat crossings, and together they show Indonesia's range in three weeks.",
  ]),
  table(
    "The four regions on this route, compared",
    ["Region", "What it gives you", "Days on this route", "How you get there", "Skip it if"],
    [
      ["Java (Yogyakarta, Bromo, Ijen)", "Borobudur, Prambanan and two active volcanoes", "Days 1 to 7", "Fly into Yogyakarta, then overland east", "You cannot face pre-dawn starts"],
      ["Flores (Labuan Bajo, Komodo)", "Komodo dragons, Padar, reef snorkelling", "Days 8 to 10", "Flight from Bali to Labuan Bajo", "The sea is rough in your month"],
      ["Lombok and the Gili Islands", "South Lombok beaches, Senaru waterfalls, car-free islands", "Days 11 to 16", "Flight to Lombok, fast boat to the Gilis", "You already know the Gilis well"],
      ["North Sumatra (Bukit Lawang, Lake Toba)", "Wild orangutans in Gunung Leuser, a crater lake", "Days 17 to 21", "Flight to Medan, then about three hours by road", "You have fewer than 18 days"],
    ],
  ),
  block("normal", [
    "Each region also works as a trip of its own: see the ",
    ["7-day Yogyakarta and East Java itinerary", "/trips/7-days-yogyakarta-east-java"],
    ", ",
    ["10 days in Komodo and Flores", "/trips/10-days-komodo-flores"],
    " and the ",
    ["7-day Bukit Lawang and Lake Toba itinerary", "/trips/7-days-bukit-lawang-lake-toba-orangutans"],
    ".",
  ]),
];

const DAYS = [
  block("h2", ["How many days do you need to see Indonesia beyond Bali?"]),
  block("normal", [
    "Three weeks is the comfortable minimum for four regions beyond Bali, because each regional hop costs most of a day in flights and transfers. With two weeks, keep Java and Flores and drop Sumatra. With ten days, pick two regions that share a flight hub, such as Java and Komodo, and leave the rest for another trip.",
  ]),
  table(
    "How to shorten this route",
    ["Trip length", "Keep", "Drop", "Closest ready-made plan"],
    [
      ["10 days", "Java and Flores, or Lombok and the Gilis", "Sumatra and one island region", "10 days in Komodo and Flores"],
      ["14 days", "Java, Flores, and Lombok or the Gilis", "Sumatra", "14 days across Bali, Java and Komodo"],
      ["21 days (this plan)", "All four regions", "Nothing, but rest days are thin", "This itinerary"],
    ],
  ),
  block("normal", [
    "For the two-week version with Bali included, see ",
    ["14 days in Indonesia: Bali, Java and Komodo", "/trips/14-days-indonesia-bali-java-komodo"],
    ". If Sumatra is the part you care about most, give it a week of its own instead of the last five days of a long trip.",
  ]),
];

// Leaked generation artefacts: [blockKey, spanKey, from, to]
const FIXES = [
  ["ko", "kn", "as a working guide the article puts mid-range travellers at roughly", "as a working guide, mid-range travellers spend roughly"],
  ["ko", "kn", "and budget travellers at around", "and budget travellers around"],
  ["k13", "k12", "As the article is honest about, this is", "To be honest about it, this is"],
  ["k1a", "k19", "The article suggests seeing a travel-health clinic", "See a travel-health clinic"],
  ["k77", "k74", " as the article notes, Bukit Lawang jungle activities", " Bukit Lawang jungle activities"],
];

const doc = await query(`*[_type=="article" && slug.current=="${SLUG}"][0]`);
if (doc.body.some((b) => b._key?.startsWith("bb28-"))) {
  console.log("Already applied, nothing to do.");
  process.exit(0);
}
writeFileSync(
  join(root, "docs/reinforce-21-days-indonesia-beyond-bali-2026-10-28.body.json"),
  JSON.stringify({ metaTitle: doc.metaTitle, metaDescription: doc.metaDescription, bestSeason: doc.bestSeason, body: doc.body }, null, 2),
);

const body = structuredClone(doc.body);
for (const [bk, sk, from, to] of FIXES) {
  const span = body.find((b) => b._key === bk)?.children.find((c) => c._key === sk);
  if (!span || !span.text.includes(from)) throw new Error(`fix not applicable: ${bk}/${sk} "${from}"`);
  span.text = span.text.replace(from, to);
}
const at = body.findIndex((b) => b._key === "k7q"); // "What to book early, and what to keep flexible"
if (at < 0) throw new Error("anchor k7q not found");
const newBody = [...TOP, ...body.slice(0, at), ...DAYS, ...body.slice(at)];

const out = JSON.stringify({ newBody, NEW_META_TITLE, NEW_META_DESC });
if (/—|–/.test(out)) throw new Error("em/en dash in new content");
if (/the article|paradise|off.the.beaten|must.see|hidden gem/i.test(out)) throw new Error("banned phrase or artefact");
if (NEW_META_TITLE.length > 60 || NEW_META_DESC.length > 155) throw new Error("meta too long");
const words = (blocks) =>
  blocks.filter((b) => b._type === "block").flatMap((b) => b.children.map((c) => c.text)).join(" ").split(/\s+/).length;
console.log(`metaTitle ${NEW_META_TITLE.length}c, metaDescription ${NEW_META_DESC.length}c`);
console.log(`answer blocks: ${words([TOP[1]])} and ${words([DAYS[1]])} words`);
console.log(`body ${doc.body.length} -> ${newBody.length} blocks, words ${words(doc.body)} -> ${words(newBody)}`);

if (!COMMIT) {
  console.log("Dry run. Re-run with --commit.");
  process.exit(0);
}
await mutate([
  {
    patch: {
      id: doc._id,
      set: { metaTitle: NEW_META_TITLE, metaDescription: NEW_META_DESC, bestSeason: "April to October", body: newBody },
    },
  },
]);
const after = await query(
  `*[_id=="${doc._id}"][0]{metaTitle, metaDescription, bestSeason, "n": count(body), "leak": count(body[].children[text match "*article*"])}`,
);
console.log(after);
if (after.n !== newBody.length || after.metaTitle !== NEW_META_TITLE || after.bestSeason !== "April to October")
  throw new Error("verification failed");
console.log("verified");
