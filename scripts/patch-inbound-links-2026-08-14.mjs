// One-off: two missing in-content internal links, both surfaced by the GSC review
// of 2026-08-14. Dry run by default, writes with --commit.
//
//   node scripts/patch-inbound-links-2026-08-14.mjs
//   node scripts/patch-inbound-links-2026-08-14.mjs --commit
//
// 7-days-west-sumatra-bukittinggi-harau-valley -> /transport/padang-to-bukittinggi
//    Five drive-time queries sit at position 7 to 11 with 0 clicks and 28 impressions
//    ("bukittinggi to harau valley drive time" and friends). They land on this
//    itinerary, whose title answers a different question. /transport/padang-to-bukittinggi
//    exists since 2026-08-10 and answers them directly, but has no inbound link and
//    0 impressions. The existing "Compare Padang to Bukittinggi transfers" link in
//    this article is an affiliate 12Go placeholder, not an internal link.
//
// Blocks are appended to, never rewritten: every existing span, mark and affiliate
// placeholder is preserved byte for byte.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { submitToIndexNow } from "./lib/indexnow.mjs";

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

/* --------------------------------- patches -------------------------------- */

// The fifth inbound link of docs/plan-islands-near-bali-cluster.md section 5.4,
// from 6-days-nusa-islands-honeymoon, was going to be patched here too. It is
// already live in Sanity on block nhb193 with the anchor the plan specifies —
// content/articles/6-days-nusa-islands-honeymoon.json is simply a stale snapshot.
// All five links are in place; the snapshot needs a resync, not a write.
const PATCHES = [
  {
    id: "itinerary-7-days-west-sumatra-bukittinggi-harau-valley",
    slug: "trips/7-days-west-sumatra-bukittinggi-harau-valley",
    blockKey: "k93",
    href: "/transport/padang-to-bukittinggi",
    markKey: "k2601",
    spans: [
      { key: "k2601s", text: " Full ", marks: [] },
      {
        key: "k2602s",
        text: "drive times across the Minangkabau highlands",
        marks: ["k2601"],
      },
      {
        key: "k2603s",
        text: ", including Batusangkar, Pagaruyung and Padang Panjang, are on the Padang to Bukittinggi route page.",
        marks: [],
      },
    ],
    expectLastSpanEndsWith: "walk out and get your bearings.",
  },
];

/* ---------------------------------- api ----------------------------------- */

async function fetchDoc(id) {
  const url = `${API}/data/query/${DS}?query=${encodeURIComponent(`*[_id=="${id}"][0]`)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}

async function mutate(mutations) {
  const res = await fetch(`${API}/data/mutate/${DS}?returnIds=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json;
}

/* ---------------------------------- run ----------------------------------- */

const touched = [];

for (const p of PATCHES) {
  const doc = await fetchDoc(p.id);
  if (!doc) {
    console.error(`✗ ${p.id}: document not found`);
    process.exitCode = 1;
    continue;
  }

  const idx = doc.body.findIndex((b) => b._key === p.blockKey);
  if (idx === -1) {
    console.error(`✗ ${p.id}: block ${p.blockKey} not found — content moved, patch aborted`);
    process.exitCode = 1;
    continue;
  }

  const block = doc.body[idx];
  const lastText = block.children.at(-1)?.text ?? "";
  if (!lastText.trimEnd().endsWith(p.expectLastSpanEndsWith)) {
    console.error(
      `✗ ${p.id}: block ${p.blockKey} does not end as expected.\n` +
        `   expected to end with: "${p.expectLastSpanEndsWith}"\n` +
        `   actually ends with:   "${lastText.slice(-70)}"`,
    );
    process.exitCode = 1;
    continue;
  }

  // Idempotent: a second run is a no-op rather than a duplicate paragraph.
  if ((block.markDefs ?? []).some((m) => m.href === p.href)) {
    console.log(`• ${p.id}: already links to ${p.href}, skipping`);
    continue;
  }

  const nextBlock = {
    ...block,
    children: [
      ...block.children,
      ...p.spans.map((s) => ({ _key: s.key, _type: "span", marks: s.marks, text: s.text })),
    ],
    markDefs: [
      ...(block.markDefs ?? []),
      { _key: p.markKey, _type: "externalLink", blank: false, href: p.href },
    ],
  };

  console.log(`\n${p.id} — block ${p.blockKey}`);
  console.log(`  + link  ${p.href}`);
  console.log(`  + text  ${p.spans.map((s) => s.text).join("")}`);

  if (COMMIT) {
    await mutate([{ patch: { id: p.id, set: { [`body[_key=="${p.blockKey}"]`]: nextBlock } } }]);
    // Re-read rather than trust the write: key-addressed patches on this dataset
    // have silently no-opped before (see the affiliateLinks case).
    const after = await fetchDoc(p.id);
    const verified = after.body
      .find((b) => b._key === p.blockKey)
      ?.markDefs?.some((m) => m.href === p.href);
    if (!verified) {
      console.error(`  ✗ WRITE DID NOT LAND for ${p.id} — check the block key`);
      process.exitCode = 1;
      continue;
    }
    console.log(`  ✓ written and verified`);
    touched.push(`https://exploreindonesia.ai/${p.slug}`);
  }
}

if (COMMIT && touched.length) {
  const res = await submitToIndexNow(touched);
  console.log(`\nIndexNow: ${JSON.stringify(res)}`);
} else if (!COMMIT) {
  console.log("\n(dry run — re-run with --commit to write)");
}
