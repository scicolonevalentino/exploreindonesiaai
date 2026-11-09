// Inbound links for the 2026-11-09 generator run. Same pattern as
// patch-inbound-links-2026-11-06.mjs: one normal block appended to the body, the
// whole body array rewritten with ifRevisionID, every write read back. Idempotent.
//   node scripts/patch-inbound-links-2026-11-09.mjs           # dry run
//   node scripts/patch-inbound-links-2026-11-09.mjs --commit
// Wakatobi readers are the natural audience for another remote dive week (Alor).
// The 2-day Ijen article was the only live Java article with no link to the hub,
// which is the page being reinforced on "java itinerary".
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(root, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ""),
      ];
    }),
);
const TOKEN = env.SANITY_API_WRITE_TOKEN;
const BASE = "https://u4ah1ore.api.sanity.io/v2024-01-01/data";
const COMMIT = process.argv.includes("--commit");
const LINKS = [
  {
    from: "8-days-wakatobi-diving-southeast-sulawesi",
    to: "/trips/8-days-alor-island-diving-takpala-dugongs",
    id: "alor",
    spans: [
      "If you have current experience and want a quieter strait, our ",
      "8-day Alor itinerary",
      " routes through Kupang to the Pantar Strait, with Abui villages and the Mali dugongs on land days.",
    ],
  },
  {
    from: "2-days-kawah-ijen-blue-fire",
    to: "/destinations/java",
    id: "jav",
    spans: [
      "If you can give Java more than two days, our ",
      "Java itinerary guide",
      " compares 5, 7, 10 and 14 days, and lays out the 7-day route that links Ijen with Bromo and Yogyakarta.",
    ],
  },
];
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
for (const L of LINKS) {
  const doc = await query(`*[_type=="article" && slug.current=="${L.from}"][0]{_id,_rev,body}`);
  if (!doc) throw new Error(`source ${L.from} not found`);
  if (doc.body.some((b) => (b.markDefs || []).some((m) => m.href === L.to))) {
    console.log(`${L.from}: already links ${L.to}, skipped`);
    continue;
  }
  const k = `${L.id}-inb`;
  const block = {
    _type: "block",
    _key: `${k}-1`,
    style: "normal",
    markDefs: [{ _key: `${k}-m`, _type: "externalLink", href: L.to, blank: false }],
    children: [
      { _type: "span", _key: `${k}-s1`, marks: [], text: L.spans[0] },
      { _type: "span", _key: `${k}-s2`, marks: [`${k}-m`], text: L.spans[1] },
      { _type: "span", _key: `${k}-s3`, marks: [], text: L.spans[2] },
    ],
  };
  if (/[—–]/.test(L.spans.join(""))) throw new Error("dash in link text");
  console.log(`${L.from} (${doc._id}, ${doc.body.length} blocks) + "${L.spans.join("")}"`);
  if (!COMMIT) continue;
  await mutate([
    { patch: { id: doc._id, ifRevisionID: doc._rev, set: { body: [...doc.body, block] } } },
  ]);
  const after = await query(
    `*[_type=="article" && slug.current=="${L.from}"][0]{"n":count(body),"ok":count(body[_key=="${k}-1"])}`,
  );
  if (after.n !== doc.body.length + 1 || after.ok !== 1)
    throw new Error(`VERIFY FAILED ${JSON.stringify(after)}`);
  console.log(`  verified: ${after.n} blocks, link block present`);
}
if (!COMMIT) console.log("Dry run. Re-run with --commit to write.");
