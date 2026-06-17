// Seeder for supporting-guide documents (Sanity `_type: "guide"`).
//
// The Sanity Studio web UI is unavailable for this project, so guides are
// authored as data here and written through the HTTP API (same pattern as
// scripts/seed-geo-content.mjs). This file is therefore the de-facto schema for
// the `guide` document type.
//
// GUIDE DOCUMENT SHAPE (what the frontend in src/lib/sanity-queries.ts reads):
//   _id              "guide-<destination>-<slug>" (deterministic, idempotent)
//   _type            "guide"
//   title            string
//   slug             { _type:"slug", current:string }   -> last URL segment
//   guideType        enum (GUIDE_TYPES in sanity-queries.ts)
//   destination      enum value (DESTINATIONS) e.g. "bali" -> maps to URL slug
//   subArea          optional string ("Ubud", "Canggu", ...)
//   intro            string (answer-first hero paragraph)
//   body             PortableText[] (built from the authoring DSL below)
//   faq              [{ _key, _type:"faqItem", question, answer }]
//   author           reference -> author-editorial-team
//   relatedTripSlugs string[]  -> /trips/<slug> itineraries
//   relatedRouteSlugs string[] -> /transport/<slug> routes
//   metaTitle, metaDescription, focusKeyword
//   contentStatus    "live" | "draft"   (only "live" shows on hubs + sitemap)
//
// AUTHORING DSL (per guide, in scripts/data/guides/*.mjs):
//   body: [ { h2:"..." }, { p:"text with **bold** and [label](/trips/x)" },
//           { h3:"..." }, { ul:["item", ...] }, { ol:[...] }, { quote:"..." } ]
//   Inline: **bold** -> strong decorator; [label](href) -> externalLink mark
//   (hrefs starting with "/" render as in-app links).
//
// HOUSE RULES (enforced softly with warnings): no em-dashes (use commas);
// hedged figures ("around", "working estimate"); meta title <= ~60, description
// <= ~155.
//
// USAGE:
//   node scripts/seed-guides.mjs                 # dry run, all guides
//   node scripts/seed-guides.mjs --only=bali     # filter by destination value
//   node scripts/seed-guides.mjs --only=best-time-to-visit-bali   # or by slug
//   node scripts/seed-guides.mjs --commit        # write to Sanity
//   node scripts/seed-guides.mjs --only=bali --commit

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { GUIDES } from "./data/guides/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMMIT = process.argv.includes("--commit");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1] || null;

const PROJECT_ID = "u4ah1ore";
const DATASET = "production";
const API = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07`;
const AUTHOR_ID = "author-editorial-team";

const DESTINATION_VALUES = new Set([
  "bali",
  "bali_nearby_islands",
  "java",
  "komodo_flores",
  "lombok_gili",
  "sumatra",
  "raja_ampat",
  "wild_indonesia",
]);
const GUIDE_TYPE_VALUES = new Set([
  "best_time",
  "where_to_stay",
  "things_to_do",
  "decision_guide",
  "comparison",
  "activity_guide",
  "cost_guide",
  "logistics",
  "itinerary_guide",
]);

// --- token ---
const env = readFileSync(join(ROOT, ".env.local"), "utf8");
const TOKEN = (env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m) || [])[1]?.trim();
if (!TOKEN) {
  console.error("No SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

// --- DSL -> PortableText ---
function parseInline(text, bi) {
  const children = [];
  const markDefs = [];
  let si = 0;
  let mi = 0;
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m;
  const pushSpan = (t, marks) => {
    if (!t) return;
    children.push({ _type: "span", _key: `b${bi}s${si++}`, text: t, marks: marks || [] });
  };
  while ((m = re.exec(text))) {
    if (m.index > last) pushSpan(text.slice(last, m.index), []);
    if (m[1] !== undefined) {
      const key = `b${bi}m${mi++}`;
      markDefs.push({ _key: key, _type: "externalLink", href: m[2] });
      pushSpan(m[1], [key]);
    } else {
      pushSpan(m[3], ["strong"]);
    }
    last = re.lastIndex;
  }
  if (last < text.length) pushSpan(text.slice(last), []);
  if (children.length === 0) pushSpan(text, []);
  return { children, markDefs };
}

function makeBlock(bi, style, text, extra = {}) {
  const { children, markDefs } = parseInline(text, bi);
  return { _type: "block", _key: `b${bi}`, style, markDefs, children, ...extra };
}

function buildBody(items, slug) {
  const blocks = [];
  let bi = 0;
  for (const item of items) {
    if (item.h2 !== undefined) blocks.push(makeBlock(bi++, "h2", item.h2));
    else if (item.h3 !== undefined) blocks.push(makeBlock(bi++, "h3", item.h3));
    else if (item.p !== undefined) blocks.push(makeBlock(bi++, "normal", item.p));
    else if (item.quote !== undefined) blocks.push(makeBlock(bi++, "blockquote", item.quote));
    else if (item.ul)
      for (const li of item.ul)
        blocks.push(makeBlock(bi++, "normal", li, { listItem: "bullet", level: 1 }));
    else if (item.ol)
      for (const li of item.ol)
        blocks.push(makeBlock(bi++, "normal", li, { listItem: "number", level: 1 }));
    else throw new Error(`Unknown body item in ${slug}: ${JSON.stringify(item)}`);
  }
  return blocks;
}

function buildGuideDoc(g) {
  return {
    _id: `guide-${g.destination}-${g.slug}`,
    _type: "guide",
    title: g.title,
    slug: { _type: "slug", current: g.slug },
    guideType: g.guideType,
    destination: g.destination,
    ...(g.subArea ? { subArea: g.subArea } : {}),
    ...(g._heroImage ? { heroImage: g._heroImage } : {}),
    intro: g.intro,
    body: buildBody(g.body, g.slug),
    faq: (g.faq || []).map((f, i) => ({
      _key: `faq${i}`,
      _type: "faqItem",
      question: f.q,
      answer: f.a,
    })),
    author: { _type: "reference", _ref: AUTHOR_ID },
    ...(g.relatedTripSlugs?.length ? { relatedTripSlugs: g.relatedTripSlugs } : {}),
    ...(g.relatedRouteSlugs?.length ? { relatedRouteSlugs: g.relatedRouteSlugs } : {}),
    metaTitle: g.metaTitle,
    metaDescription: g.metaDescription,
    focusKeyword: g.focusKeyword,
    contentStatus: g.status || "draft",
  };
}

// --- validation (warnings, not fatal unless structural) ---
function validate(g) {
  const issues = [];
  const text = JSON.stringify(g);
  if (!DESTINATION_VALUES.has(g.destination)) issues.push(`bad destination "${g.destination}"`);
  if (!GUIDE_TYPE_VALUES.has(g.guideType)) issues.push(`bad guideType "${g.guideType}"`);
  if (!/^[a-z0-9-]+$/.test(g.slug)) issues.push(`bad slug "${g.slug}"`);
  if ((g.metaTitle || "").length > 62) issues.push(`metaTitle ${g.metaTitle.length} chars (>62)`);
  if ((g.metaDescription || "").length > 158)
    issues.push(`metaDescription ${g.metaDescription.length} chars (>158)`);
  if (text.includes("—")) issues.push("contains an em-dash (use a comma)");
  if (!g.body?.length) issues.push("empty body");
  if ((g.faq || []).length < 3) issues.push(`only ${(g.faq || []).length} FAQs (<3)`);
  return issues;
}

async function sanityQuery(query) {
  const res = await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await res.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}

async function sanityMutate(mutations) {
  const res = await fetch(`${API}/data/mutate/${DATASET}?returnIds=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  const j = await res.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j;
}

async function main() {
  let guides = GUIDES;
  if (ONLY) guides = guides.filter((g) => g.destination === ONLY || g.slug === ONLY);
  if (guides.length === 0) {
    console.error(`No guides matched --only=${ONLY}`);
    process.exit(1);
  }

  console.log(`Selected ${guides.length} guide(s)${ONLY ? ` (filter: ${ONLY})` : ""}.\n`);

  // Referential integrity: collect live article + route slugs to check links.
  const liveTripSlugs = new Set(
    await sanityQuery(`*[_type=="article" && contentStatus=="live"].slug.current`),
  );

  // Borrow itinerary hero images (we have no guide-specific images). Each guide
  // takes an image from its OWN destination's article pool, assigned round-robin
  // so a cluster's guide cards vary instead of repeating one photo. Nusa Penida
  // (bali_nearby_islands) has few articles, so its pool is topped up with Bali
  // images, which are visually coherent for the same island region. alt/caption
  // are dropped; the components label the image with the guide title.
  //
  // Multi-region itineraries (slug contains "indonesia", e.g.
  // 14-days-indonesia-bali-java-komodo) carry marquee heroes of OTHER islands
  // (Borobudur, Raja Ampat karst, etc.), so they're excluded from the pool — they
  // produced off-theme cards (a Java temple on a Bali "where to stay" guide).
  const arts = await sanityQuery(
    `*[_type=="article" && contentStatus=="live" && defined(heroImage.asset)] | order(slug.current asc){ "slug": slug.current, "dest": destinationPrimary, heroImage }`,
  );
  const poolByDest = {};
  for (const a of arts) {
    if (/indonesia/.test(a.slug)) continue; // skip multi-region marquee heroes
    (poolByDest[a.dest] ||= []).push(a.heroImage);
  }
  if (poolByDest.bali) {
    poolByDest.bali_nearby_islands = [
      ...(poolByDest.bali_nearby_islands || []),
      ...poolByDest.bali,
    ];
  }
  const destCounter = {};
  for (const g of guides) {
    // Explicit, hand-picked image (a real uploaded Sanity asset) wins over the
    // borrowed itinerary pool. Used where we have genuine destination photos
    // (e.g. Sumatra), so re-seeds keep them instead of reverting to a borrow.
    if (g.imageRef) {
      g._heroImage = {
        _type: "image",
        asset: { _type: "reference", _ref: g.imageRef },
        ...(g.imageAlt ? { alt: g.imageAlt } : {}),
      };
      continue;
    }
    const pool = poolByDest[g.destination] || poolByDest.bali || [];
    if (!pool.length) continue;
    const i = destCounter[g.destination] || 0;
    destCounter[g.destination] = i + 1;
    const src = pool[i % pool.length];
    g._heroImage = {
      _type: "image",
      asset: src.asset,
      ...(src.hotspot ? { hotspot: src.hotspot } : {}),
      ...(src.crop ? { crop: src.crop } : {}),
    };
  }

  const problems = [];
  const docs = [];
  const seenIds = new Set();
  for (const g of guides) {
    const issues = validate(g);
    issues.forEach((i) => problems.push(`${g.slug}: ${i}`));
    for (const s of g.relatedTripSlugs || [])
      if (!liveTripSlugs.has(s)) problems.push(`${g.slug}: related trip "${s}" not live in Sanity`);
    const doc = buildGuideDoc(g);
    if (seenIds.has(doc._id)) problems.push(`duplicate _id ${doc._id}`);
    seenIds.add(doc._id);
    docs.push(doc);
    const blocks = doc.body.length;
    const words = JSON.stringify(doc.body).split(/\s+/).length;
    console.log(
      `  ${(g.status || "draft").padEnd(5)} ${g.slug.padEnd(40)} ${String(blocks).padStart(3)} blocks  ~${words}w  ${g.faq?.length || 0} FAQ`,
    );
  }

  if (problems.length) {
    console.log(
      `\n⚠️  ${problems.length} issue(s):\n` + problems.map((p) => "  - " + p).join("\n"),
    );
  }

  if (!COMMIT) {
    console.log("\nDRY RUN — no writes. Re-run with --commit to apply.");
    console.log("\nSample document (first guide):");
    console.log(JSON.stringify(docs[0], null, 2).slice(0, 1400));
    return;
  }

  if (problems.some((p) => /bad |empty body|duplicate _id/.test(p))) {
    console.log("\nRefusing to commit with structural issues. Fix them first.");
    process.exit(1);
  }

  // Author doc must exist for the reference to resolve.
  await sanityMutate([
    {
      createIfNotExists: {
        _id: AUTHOR_ID,
        _type: "author",
        name: "Editorial Team",
        schemaType: "Organization",
      },
    },
  ]);
  const r = await sanityMutate(docs.map((doc) => ({ createOrReplace: doc })));
  console.log(`\n✓ wrote ${r.results?.length ?? docs.length} guide document(s).`);
  console.log("Note: live guides appear publicly only once this branch is deployed.");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
