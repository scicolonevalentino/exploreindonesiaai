// Add one contextual inbound link into each of the four articles published on
// 2026-09-25, from the sibling that a reader would plausibly be on.
//
//   node scripts/patch-inbound-links-2026-09-25.mjs           # dry run
//   node scripts/patch-inbound-links-2026-09-25.mjs --commit
//
// Idempotent: a target already carrying the href is skipped. Follows the house
// pattern for an inbound link (see the "nsd-inb-1" block on
// 10-days-sulawesi-toraja-bunaken): a single normal block appended to the end
// of the body, one sentence, one externalLink markDef with a relative href and
// blank:false.
//
// The whole body array is rewritten rather than patched by key, because array
// items in this dataset frequently have no _key and a [_key=="..."] selector
// then matches nothing while still returning HTTP 200 with document ids. Every
// write is read back before the script reports success.

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
    from: "10-days-sulawesi-toraja-bunaken",
    to: "/trips/7-days-south-sulawesi-toraja-makassar",
    id: "ssul",
    spans: [
      "If ten days is more than you have, the ",
      "7-day South Sulawesi route",
      " keeps Tana Toraja and adds the Rammang-Rammang karst outside Makassar, without the long haul north to Bunaken.",
    ],
  },
  {
    from: "9-days-banda-islands-spice-route",
    to: "/trips/7-days-ternate-tidore-volcano-sultanates",
    id: "tern",
    spans: [
      "The clove half of the same trade sits further north. The ",
      "7-day Ternate and Tidore itinerary",
      " covers the two rival volcano sultanates that supplied the cloves while Banda held the nutmeg.",
    ],
  },
  {
    from: "4-days-bromo-ijen-volcano-crossing",
    to: "/trips/7-days-east-java-wildlife-baluran-alas-purwo",
    id: "ejw",
    spans: [
      "Ijen leaves you in the corner of Java the wildlife parks start from. The ",
      "7-day Baluran, Alas Purwo and Sukamade route",
      " picks up from there and trades craters for savanna, jungle and turtle beaches.",
    ],
  },
  // Fifth entry: the 08:14 generator run on 2026-09-25 produced one more draft
  // while this was in flight. Published the same way, so it gets the same link.
  {
    from: "10-days-north-sulawesi-diving-bunaken-lembeh",
    to: "/trips/8-days-north-sulawesi-with-kids-bunaken-tangkoko",
    id: "nskids",
    spans: [
      "Travelling with children rather than a dive computer? The ",
      "8-day North Sulawesi route for families",
      " keeps Bunaken but swaps the Lembeh muck dives for Tangkoko's tarsiers and the Minahasa highlands.",
    ],
  },
  {
    from: "7-days-south-lombok-kuta-beaches",
    to: "/trips/8-days-sasak-lombok-villages-temples",
    id: "sasak",
    spans: [
      "Sade is a short drive inland from Kuta, and if the Sasak side of the island is what pulls you, the ",
      "8-day Sasak Lombok route",
      " builds a whole trip around the villages and temples instead of the beaches.",
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
