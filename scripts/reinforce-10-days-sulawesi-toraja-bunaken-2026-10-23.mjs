// PARTE 1 + PARTE 3, generator run 2026-10-23, on /trips/10-days-sulawesi-toraja-bunaken.
// Log: docs/reinforce-10-days-sulawesi-toraja-bunaken-2026-10-23.md. Re-read on 2026-11-20.
//
// GSC baseline 2026-09-23..10-20 for this page:
//   "sulawesi itinerary"  15 impr, 1 click, pos 37.0  (was 53.7 before the 2026-09-05 plan)
//   "sulawesi route"      14 impr, 0 clicks, pos 56.4 (was 46.0; the 14-day page holds it at 13.5)
//
// OLD values, exact, for a ten-second revert:
//   metaTitle:       "Sulawesi Itinerary: 10 Days, and How to Pick a Region"
//   metaDescription: "How many days you need for Sulawesi, which of its four regions to pick, and a full 10-day route through Tana Toraja and Bunaken with honest drive times."
//   body: the four blocks with _key prefix "sr1023-" are new; delete them to revert.
//   faq:  the item with _key "sr1023-faq" is new; delete it to revert.
//
//   node scripts/reinforce-10-days-sulawesi-toraja-bunaken-2026-10-23.mjs           # dry run
//   node scripts/reinforce-10-days-sulawesi-toraja-bunaken-2026-10-23.mjs --commit
//
// Idempotent (skips if the sr1023 blocks exist). Rewrites the whole body and faq
// arrays, never a keyed selector, and reads the document back after writing.
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [
      l.slice(0, l.indexOf("=")).trim(),
      l
        .slice(l.indexOf("=") + 1)
        .trim()
        .replace(/^["']|["']$/g, ""),
    ]),
);
const TOKEN = env.SANITY_API_WRITE_TOKEN;
const BASE = "https://u4ah1ore.api.sanity.io/v2024-01-01/data";
const ID = "itinerary-10-days-sulawesi-toraja-bunaken";
const COMMIT = process.argv.includes("--commit");

const META_TITLE = "Sulawesi Itinerary: 1, 2 or 3 Weeks, Plus a 10-Day Route";
const META_DESC =
  "How long to spend in Sulawesi, which region fits one, two or three weeks, and a full 10-day route from Tana Toraja to Bunaken with honest drive times.";

const span = (k, text, marks = []) => ({ _type: "span", _key: k, marks, text });
const NEW_BLOCKS = [
  {
    _type: "block",
    _key: "sr1023-h2",
    style: "h2",
    markDefs: [],
    children: [span("sr1023-h2s", "Which Sulawesi itinerary should you choose?")],
  },
  {
    _type: "block",
    _key: "sr1023-p1",
    style: "normal",
    markDefs: [],
    children: [
      span(
        "sr1023-p1s",
        "Choose by time first, then by what you want from the island. With a week, pick one region: Toraja from Makassar, or the reefs around Manado. With ten days, combine the two, as this page does. With two weeks, add the Togean Islands. Divers, honeymooners and families each have a route that fits them better.",
      ),
    ],
  },
  {
    _type: "comparisonTable",
    _key: "sr1023-tbl",
    caption:
      "Our Sulawesi itineraries side by side. Days and trade-offs summarise each full itinerary; check each page for the details.",
    columns: ["Itinerary", "Days", "Regions", "Best for", "Main trade-off"],
    rows: [
      [
        "South Sulawesi, Makassar and Toraja",
        "7",
        "South",
        "A first visit focused on Toraja culture",
        "No reef time",
      ],
      [
        "Toraja and Bunaken (this page)",
        "10",
        "South and North",
        "Culture and reef in one trip",
        "The road back to Makassar and one internal flight",
      ],
      [
        "Toraja, the Togeans and Bunaken",
        "14",
        "South, Central and North",
        "Travellers with schedule slack",
        "Ferries on fixed days and long overland legs",
      ],
      [
        "North Sulawesi diving, Bunaken and Lembeh",
        "10",
        "North",
        "Divers, reef walls and macro life",
        "No Toraja",
      ],
      [
        "North Sulawesi honeymoon, Bunaken and Siladen",
        "8",
        "North",
        "Couples who want island resort time",
        "No Toraja",
      ],
      [
        "North Sulawesi with kids, Bunaken and Tangkoko",
        "8",
        "North",
        "Families: reef, tarsiers and highlands",
        "Basic rooms near Tangkoko",
      ],
      [
        "Wakatobi diving, Southeast Sulawesi",
        "8",
        "Southeast",
        "Experienced divers",
        "The hardest and costliest region to reach",
      ],
    ].map((cells, i) => ({ _key: `sr1023-r${i}`, cells })),
  },
  {
    _type: "block",
    _key: "sr1023-p2",
    style: "normal",
    markDefs: [
      {
        _key: "sr1023-l1",
        _type: "externalLink",
        href: "/trips/7-days-south-sulawesi-toraja-makassar",
        blank: false,
      },
      {
        _key: "sr1023-l2",
        _type: "externalLink",
        href: "/trips/8-days-north-sulawesi-honeymoon-bunaken-siladen",
        blank: false,
      },
      {
        _key: "sr1023-l3",
        _type: "externalLink",
        href: "/trips/8-days-north-sulawesi-with-kids-bunaken-tangkoko",
        blank: false,
      },
    ],
    children: [
      span("sr1023-a", "If Toraja is the whole point, the "),
      span("sr1023-b", "7-day South Sulawesi itinerary", ["sr1023-l1"]),
      span(
        "sr1023-c",
        " gives it a full week without the flight north. If the reef matters more than the highlands, the ",
      ),
      span("sr1023-d", "8-day North Sulawesi honeymoon", ["sr1023-l2"]),
      span("sr1023-e", " slows Bunaken down for two, and the "),
      span("sr1023-f", "8-day North Sulawesi itinerary with kids", ["sr1023-l3"]),
      span("sr1023-g", " adds the tarsiers at Tangkoko and the cool Minahasa highlands."),
    ],
  },
];
const NEW_FAQ = {
  _key: "sr1023-faq",
  question: "What is the best Sulawesi itinerary for two weeks?",
  answer:
    "For two weeks, the classic route runs from Makassar to Tana Toraja, then overland and by ferry through the Togean Islands, finishing at Bunaken off Manado. It needs one internal flight and ferries that run on fixed days, so build slack into the plan. With ten days, drop the Togeans and fly from Makassar to Manado instead.",
};

async function q(groq) {
  const r = await fetch(`${BASE}/query/production?query=${encodeURIComponent(groq)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}

const doc = await q(`*[_id=="${ID}"][0]{metaTitle, metaDescription, body, faq}`);
if (JSON.stringify(doc.body).includes("sr1023-h2")) {
  console.log("SKIP: already applied");
  process.exit(0);
}
const all = JSON.stringify([META_TITLE, META_DESC, NEW_BLOCKS, NEW_FAQ]);
if (/—|–/.test(all)) throw new Error("em dash");
for (const b of [
  "hidden gem",
  "must-see",
  "paradise",
  "unforgettable",
  "breathtaking",
  "crystal-clear",
])
  if (all.toLowerCase().includes(b)) throw new Error(b);
if (META_TITLE.length > 60 || META_DESC.length > 155) throw new Error("meta length");
if (doc.metaTitle !== "Sulawesi Itinerary: 10 Days, and How to Pick a Region")
  throw new Error("unexpected old metaTitle: " + doc.metaTitle);

// Insert after the "What is the best route through Sulawesi?" section, i.e. before "Day 1".
const day1 = doc.body.findIndex(
  (b) => b.style === "h2" && (b.children?.[0]?.text || "").startsWith("Day 1"),
);
if (day1 < 0) throw new Error("Day 1 heading not found");
const body = [...doc.body.slice(0, day1), ...NEW_BLOCKS, ...doc.body.slice(day1)];
const faq = [...doc.faq.slice(0, 1), NEW_FAQ, ...doc.faq.slice(1)];
const keys = JSON.stringify(body).match(/"_key":"[^"]+"/g);
if (keys.length !== new Set(keys).size) throw new Error("duplicate _key");

console.log(`metaTitle ${META_TITLE.length}c, metaDescription ${META_DESC.length}c`);
console.log(
  `body ${doc.body.length} -> ${body.length} (insert at ${day1}), faq ${doc.faq.length} -> ${faq.length}`,
);
if (!COMMIT) process.exit(0);

const r = await fetch(`${BASE}/mutate/production`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    mutations: [
      { patch: { id: ID, set: { metaTitle: META_TITLE, metaDescription: META_DESC, body, faq } } },
    ],
  }),
});
if (!r.ok) throw new Error(await r.text());
const after = await q(
  `*[_id=="${ID}"][0]{metaTitle, metaDescription, "n": count(body), "f": count(faq), "h": count(body[_key=="sr1023-h2"]), "l": count(body[].markDefs[href=="/trips/8-days-north-sulawesi-with-kids-bunaken-tangkoko"])}`,
);
if (
  after.metaTitle !== META_TITLE ||
  after.metaDescription !== META_DESC ||
  after.n !== body.length ||
  after.f !== faq.length ||
  !after.h ||
  !after.l
) {
  console.error("FAILED to verify", after);
  process.exit(1);
}
console.log("verified", after);
