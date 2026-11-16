// Inbound link for the 2026-11-16 generator run. Same pattern as
// patch-inbound-links-2026-11-15.mjs: one normal block appended to the body, the
// whole body array rewritten with ifRevisionID, every write read back. Idempotent.
//   node scripts/patch-inbound-links-2026-11-16.mjs           # dry run
//   node scripts/patch-inbound-links-2026-11-16.mjs --commit
// 7-days-yogyakarta-east-java is where a reader adding days around Yogyakarta
// already is; it is not under test.
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
    from: "7-days-yogyakarta-east-java",
    to: "/trips/5-days-yogyakarta-gunungkidul-jomblang-cave-timang",
    id: "ygk5",
    spans: [
      "If you would rather trade the volcano drive for caves and a wild coast closer to the city, our ",
      "5-day Yogyakarta itinerary beyond the temples",
      " stays in the Gunungkidul karst, with Jomblang Cave, Pindul and the Timang gondola.",
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
