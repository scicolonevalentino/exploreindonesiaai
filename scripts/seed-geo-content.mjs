// One-off seeder: writes the approved FAQ sets, the `visa` practical-info field,
// and an "Editorial Team" author document to the 20 trip articles in Sanity.
//
// Usage:
//   node scripts/seed-geo-content.mjs           # dry run (no writes)
//   node scripts/seed-geo-content.mjs --commit  # actually write
//
// Reads SANITY_API_WRITE_TOKEN from .env.local. Non-destructive: only sets
// `faq`, `author`, and `practicalInfo.visa`; never deletes existing fields.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMMIT = process.argv.includes("--commit");

const PROJECT_ID = "u4ah1ore";
const DATASET = "production";
const API = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07`;
const AUTHOR_ID = "author-editorial-team";

// --- token ---
const env = readFileSync(join(ROOT, ".env.local"), "utf8");
const TOKEN = (env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m) || [])[1]?.trim();
if (!TOKEN) {
  console.error("No SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

// --- author doc ---
const AUTHOR_DOC = {
  _id: AUTHOR_ID,
  _type: "author",
  name: "Editorial Team",
  schemaType: "Organization",
};

// --- visa text (Bali variant adds the levy) ---
const VISA_BASE =
  "Most visitors (around 90 nationalities, including the UK, EU, US and Australia) get a Visa on Arrival for Indonesia. The e-VOA costs IDR 500,000 (about US$35) for 30 days and can be extended once for another 30 days; apply online before you fly at evisa.imigrasi.go.id or get it on arrival at major airports.";
const VISA_BALI_SUFFIX =
  " Bali also charges a one-time tourist levy of IDR 150,000 (about US$10) — pay it via the official Love Bali portal. (Verify current rules at immigration.go.id before travel.)";
const VISA_PLAIN_SUFFIX = " (Verify current rules at immigration.go.id before travel.)";

const BALI_SLUGS = new Set([
  "7-days-bali-first-timers",
  "5-days-bali-ubud-canggu-uluwatu",
  "7-days-bali-solo-travellers",
  "7-days-bali-couples",
  "10-days-bali-gili-islands",
  "10-days-bali-lombok-gili-islands",
  "14-days-indonesia-bali-java-komodo",
  "15-days-java-bali",
  "14-days-bali-komodo-sumba",
  "15-days-indonesia-honeymoon",
  "20-days-across-indonesia",
  "30-days-indonesia-ultimate",
]);
const visaFor = (slug) => VISA_BASE + (BALI_SLUGS.has(slug) ? VISA_BALI_SUFFIX : VISA_PLAIN_SUFFIX);

// --- parse the approved FAQ markdown into slug -> [{question, answer}] ---
function parseFaqDoc() {
  const md = readFileSync(join(ROOT, "docs", "faq-drafts-for-review.md"), "utf8");
  const lines = md.split("\n");
  const bySlug = {};
  let slug = null;
  const headerRe = /^##\s+\d+\.\s+(\S+)\s*$/;
  const faqRe = /^(?:★\s*)?\*\*(.+?)\*\*\s*(.+)$/;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      const m = line.match(headerRe);
      slug = m ? m[1] : null; // any non-numbered H2 (e.g. "Also to be written") clears the slug
      if (slug) bySlug[slug] = [];
      continue;
    }
    if (!slug) continue;
    const m = line.match(faqRe);
    if (!m) continue;
    const question = m[1].trim();
    // strip markdown links [text](url) -> text
    const answer = m[2].trim().replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    bySlug[slug].push({ question, answer });
  }
  return bySlug;
}

// deterministic key per faq item (no Math.random)
const keyFor = (slug, i) => `faq-${slug}-${i}`.replace(/[^a-zA-Z0-9_-]/g, "");

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
  const faqBySlug = parseFaqDoc();
  const articles = await sanityQuery(
    `*[_type=="article"]{ "slug": slug.current, _id, "hasPI": defined(practicalInfo) }`,
  );
  const bySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

  console.log(
    `Parsed FAQs for ${Object.keys(faqBySlug).length} trips. ${articles.length} articles in Sanity.\n`,
  );

  const problems = [];
  const patches = [];
  for (const slug of Object.keys(faqBySlug)) {
    const art = bySlug[slug];
    const faqs = faqBySlug[slug];
    const status = art ? (faqs.length >= 4 ? "ok" : "FEW") : "NO-MATCH";
    console.log(`  ${status.padEnd(8)} ${slug.padEnd(36)} ${faqs.length} FAQs`);
    if (!art) {
      problems.push(`No article for slug ${slug}`);
      continue;
    }
    if (faqs.length < 4) problems.push(`Only ${faqs.length} FAQs for ${slug}`);
    patches.push({
      patch: {
        id: art._id,
        setIfMissing: { practicalInfo: {} },
        set: {
          author: { _type: "reference", _ref: AUTHOR_ID },
          "practicalInfo.visa": visaFor(slug),
          faq: faqs.map((f, i) => ({ _key: keyFor(slug, i), _type: "faqItem", ...f })),
        },
      },
    });
  }

  // articles present in Sanity but with no parsed FAQ (should be none)
  for (const a of articles)
    if (!faqBySlug[a.slug]) problems.push(`Sanity article ${a.slug} has no FAQ in doc`);

  console.log(`\nPlanned: 1 author doc + ${patches.length} article patches.`);
  if (problems.length) {
    console.log("\n⚠️ ISSUES:\n" + problems.map((p) => "  - " + p).join("\n"));
  }

  if (!COMMIT) {
    console.log("\nDRY RUN — no writes. Re-run with --commit to apply.");
    // show a sample
    const sample = patches[0];
    console.log("\nSample patch (first trip):");
    console.log(JSON.stringify(sample, null, 2).slice(0, 900));
    return;
  }

  if (problems.length) {
    console.log("\nRefusing to commit while there are issues. Fix the doc/slugs first.");
    process.exit(1);
  }

  // 1) author first (so the reference resolves)
  await sanityMutate([{ createOrReplace: AUTHOR_DOC }]);
  console.log("\n✓ author doc written");
  // 2) article patches (one transaction)
  const r = await sanityMutate(patches);
  console.log(`✓ patched ${r.results?.length ?? patches.length} articles`);
  console.log("\nDone.");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
