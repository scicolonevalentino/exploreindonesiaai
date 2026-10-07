// Add one contextual inbound link to the article published 2026-10-07
// (6-days-bali-volcanoes-sidemen-batur-munduk). Idempotent; rewrites the whole body
// array (never a _key selector) and reads back after writing.
//   node scripts/patch-inbound-links-2026-10-05.mjs [--commit]
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
const TOKEN = env.SANITY_API_WRITE_TOKEN;
const COMMIT = process.argv.includes("--commit");
const base = "https://u4ah1ore.api.sanity.io/v2024-01-01/data";
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const TO = "/trips/6-days-bali-volcanoes-sidemen-batur-munduk";
const LINKS = [
  {
    from: "7-days-bali-first-timers",
    id: "v7a",
    spans: [
      "Back for a second Bali with less beach and more altitude? The ",
      "6-day volcano and highlands route",
      " covers Sidemen, a Batur sunrise and Munduk.",
    ],
  },
  {
    from: "7-days-lombok-rinjani-trek",
    id: "v7b",
    spans: [
      "Want a gentler volcano warm-up before Rinjani? The ",
      "6-day Bali volcano and highlands route",
      " includes a two-hour Mount Batur sunrise trek.",
    ],
  },
];
const q = async (query) =>
  (
    await (
      await fetch(`${base}/query/production?query=${encodeURIComponent(query)}`, { headers: H })
    ).json()
  ).result;
for (const l of LINKS) {
  const doc = await q(`*[_type=="article" && slug.current=="${l.from}"][0]{_id,body}`);
  if (JSON.stringify(doc.body).includes(TO)) {
    console.log("skip (already linked)", l.from);
    continue;
  }
  const mk = `${l.id}-m`;
  const block = {
    _type: "block",
    _key: `${l.id}-b`,
    style: "normal",
    markDefs: [{ _key: mk, _type: "externalLink", href: TO, blank: false }],
    children: [
      { _type: "span", _key: `${l.id}-1`, marks: [], text: l.spans[0] },
      { _type: "span", _key: `${l.id}-2`, marks: [mk], text: l.spans[1] },
      { _type: "span", _key: `${l.id}-3`, marks: [], text: l.spans[2] },
    ],
  };
  if (!COMMIT) {
    console.log("dry", l.from, doc.body.length, "->", doc.body.length + 1);
    continue;
  }
  const r = await fetch(`${base}/mutate/production`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      mutations: [{ patch: { id: doc._id, set: { body: [...doc.body, block] } } }],
    }),
  });
  console.log(l.from, r.status);
  const back = await q(`*[_id=="${doc._id}"][0].body`);
  console.log(" verified:", JSON.stringify(back).includes(TO));
}
