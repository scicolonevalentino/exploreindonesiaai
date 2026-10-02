// Add one contextual inbound link into the article published on 2026-10-02,
// from the sibling that a reader would plausibly be on.
//
//   node scripts/patch-inbound-links-2026-10-02.mjs           # dry run
//   node scripts/patch-inbound-links-2026-10-02.mjs --commit
//
// Same mechanics as patch-inbound-links-2026-09-25.mjs: idempotent, appends a
// single normal block, rewrites the whole body array (never a keyed selector,
// since array items in this dataset often have no _key) and reads every write
// back before reporting success.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = {
  ...Object.fromEntries(
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
  ),
  ...process.env,
};

const PROJECT = "u4ah1ore";
const DATASET = "production";
const API = "2024-01-01";
const TOKEN = env.SANITY_API_WRITE_TOKEN;
const COMMIT = process.argv.includes("--commit");

// from: the sibling that gets the new sentence. to: the article being linked.
// The three spans are [lead, anchor, tail]; the anchor carries the link.
const LINKS = [
  {
    from: "10-days-komodo-flores",
    to: "/trips/7-days-flores-wae-rebo-manggarai-highlands",
    id: "waerebo",
    spans: [
      "Ruteng is also the turn-off for Wae Rebo, the seven-house village that this route drives past. The ",
      "7-day Wae Rebo and Manggarai highlands loop",
      " spends a night up there and returns to Labuan Bajo instead of continuing east.",
    ],
  },
];

async function query(groq) {
  const u = `https://${PROJECT}.api.sanity.io/v${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const r = await fetch(u, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}

async function mutate(mutations) {
  const u = `https://${PROJECT}.api.sanity.io/v${API}/data/mutate/${DATASET}`;
  const r = await fetch(u, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(JSON.stringify(j));
  return j;
}

let changed = 0;
let skipped = 0;

for (const link of LINKS) {
  const doc = await query(
    `*[_type=="article" && slug.current=="${link.from}"][0]{_id, body, contentStatus}`,
  );
  if (!doc) {
    console.log(`SKIP ${link.from}: not found`);
    skipped++;
    continue;
  }

  const already = JSON.stringify(doc.body || []).includes(`"${link.to}"`);
  if (already) {
    console.log(`SKIP ${link.from}: already links ${link.to}`);
    skipped++;
    continue;
  }

  const markKey = `${link.id}-lnk`;
  const block = {
    _type: "block",
    _key: `${link.id}-inb`,
    style: "normal",
    markDefs: [{ _key: markKey, _type: "externalLink", href: link.to, blank: false }],
    children: [
      { _type: "span", _key: `${link.id}-s1`, marks: [], text: link.spans[0] },
      { _type: "span", _key: `${link.id}-s2`, marks: [markKey], text: link.spans[1] },
      { _type: "span", _key: `${link.id}-s3`, marks: [], text: link.spans[2] },
    ],
  };

  const sentence = link.spans.join("");
  if (/—|–/.test(sentence)) throw new Error(`em dash in the sentence for ${link.from}`);

  console.log(`\n${link.from} -> ${link.to}`);
  console.log(`  ${sentence}`);
  console.log(`  body ${doc.body.length} -> ${doc.body.length + 1} blocks`);

  if (!COMMIT) {
    changed++;
    continue;
  }

  // Whole-array rewrite, never a keyed selector.
  await mutate([{ patch: { id: doc._id, set: { body: [...doc.body, block] } } }]);

  const after = await query(
    `*[_id=="${doc._id}"][0]{"n": count(body), "has": count(body[].markDefs[href=="${link.to}"])}`,
  );
  if (after.n !== doc.body.length + 1 || !after.has) {
    console.error(`  FAILED to verify: ${JSON.stringify(after)}`);
    process.exit(1);
  }
  console.log(`  verified: ${after.n} blocks, link present`);
  changed++;
}

console.log(`\n${COMMIT ? "Applied" : "Would apply"} ${changed}, skipped ${skipped}.`);
if (!COMMIT) console.log("Re-run with --commit to write.");
