// Add one contextual inbound link into the article published on 2026-10-30,
// from the sibling a reader would plausibly be on. Same pattern as
// patch-inbound-links-2026-09-25.mjs: a single normal block appended to the end
// of the body, one sentence, one externalLink markDef with a relative href and
// blank:false. The whole body array is rewritten (items in this dataset often
// lack _key, so a keyed selector can silently match nothing), and every write
// is read back before the script reports success.
//
//   node scripts/patch-inbound-links-2026-10-30.mjs           # dry run
//   node scripts/patch-inbound-links-2026-10-30.mjs --commit
//
// The 15-day Sumatra page also links the new article from its new comparison
// section (reinforce-15-days-sumatra-2026-10-30.mjs), so the article starts
// with two in-content inbound links.

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
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);
const TOKEN = env.SANITY_API_WRITE_TOKEN;
const BASE = "https://u4ah1ore.api.sanity.io/v2024-01-01/data";
const COMMIT = process.argv.includes("--commit");

const LINKS = [
  {
    from: "7-days-bukit-lawang-lake-toba-orangutans",
    to: "/trips/10-days-sumatra-first-timers",
    id: "sft",
    spans: [
      "With three more days, the ",
      "10-day Sumatra itinerary for first-timers",
      " keeps this jungle-and-lake week and adds a flight to Banda Aceh and two nights on the reef at Pulau Weh.",
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
  const has = doc.body.some((b) => (b.markDefs || []).some((m) => m.href === L.to));
  if (has) {
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
  const text = L.spans.join("");
  if (/[—–]/.test(text)) throw new Error("dash in link text");
  console.log(`${L.from} (${doc._id}, ${doc.body.length} blocks) + "${text}"`);
  if (!COMMIT) continue;
  await mutate([{ patch: { id: doc._id, ifRevisionID: doc._rev, set: { body: [...doc.body, block] } } }]);
  const after = await query(
    `*[_type=="article" && slug.current=="${L.from}"][0]{"n":count(body),"ok":count(body[_key=="${k}-1"])}`,
  );
  if (after.n !== doc.body.length + 1 || after.ok !== 1) throw new Error(`VERIFY FAILED ${JSON.stringify(after)}`);
  console.log(`  verified: ${after.n} blocks, link block present`);
}
if (!COMMIT) console.log("Dry run. Re-run with --commit to write.");
