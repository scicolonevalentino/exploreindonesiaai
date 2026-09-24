// Source a hero image for an article from Wikimedia Commons, upload it to
// Sanity, attach it and (optionally) publish the article.
//
//   node scripts/hero-from-commons.mjs --slug <slug> --search "<terms>" [...]
//   node scripts/hero-from-commons.mjs --slug <slug> --search "..." --commit
//   node scripts/hero-from-commons.mjs --slug <slug> --search "..." --commit --publish
//
// Dry by default: it prints the shortlist and the one it would take, and
// writes nothing. --commit uploads and patches; --publish additionally flips
// contentStatus to "live".
//
// WHY COMMONS. The generator used to stop at proposing hero options, and the
// founder's upload was the approval gate. That gate jammed: four drafts sat
// unpublished between 2026-09-16 and 2026-09-23 with no hero. Commons needs no
// API key (we hold none for Unsplash or Pexels), carries machine-readable
// licence and author metadata, and covers named Indonesian landmarks well,
// which is exactly what an itinerary hero needs.
//
// LICENCE HANDLING IS THE POINT. Anything that forbids commercial use or
// derivative works is dropped, because this is a commercial site and the hero
// is cropped. Whatever survives and is not public domain gets a visible credit
// line, rendered by trips.$slug.tsx, because CC BY without attribution is a
// licence breach and "it's only a photo" is not a defence.
//
// The picker is deliberately conservative about shape: a hero renders as a
// 1600x900 crop, so portraits and Commons' panoramic "banner" files (e.g.
// 4272x616) are rejected rather than centre-cropped into nonsense.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------- config --------------------------------- */

function envFromFile() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    return Object.fromEntries(
      raw
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
  } catch {
    return {};
  }
}

const env = { ...envFromFile(), ...process.env };
const PROJECT = env.VITE_SANITY_PROJECT_ID || "u4ah1ore";
const DATASET = env.VITE_SANITY_DATASET || "production";
const TOKEN = env.SANITY_API_WRITE_TOKEN;
const API = "2024-01-01";

const UA = "ExploreIndonesia.ai hero-sourcing/1.0 (valentino.scicolone@gmail.com)";

const arg = (name, fallback = null) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const argAll = (name) =>
  process.argv.reduce((acc, v, i) => (v === `--${name}` ? [...acc, process.argv[i + 1]] : acc), []);
const flag = (name) => process.argv.includes(`--${name}`);

const SLUG = arg("slug");
const SEARCHES = argAll("search");
const COMMIT = flag("commit");
const PUBLISH = flag("publish");
const MIN_WIDTH = Number(arg("min-width", 1600));

if (!SLUG || SEARCHES.length === 0) {
  console.error(
    'Usage: node scripts/hero-from-commons.mjs --slug <slug> --search "<terms>" [--search "..."] [--commit] [--publish]',
  );
  process.exit(1);
}
if (COMMIT && !TOKEN) {
  console.error("SANITY_API_WRITE_TOKEN missing (see .env.local); cannot write.");
  process.exit(1);
}

/* ------------------------------ licensing -------------------------------- */

// Rejected outright: no commercial use, no derivatives, or Commons has flagged
// a non-copyright restriction (trademark, personality rights, property release).
const FORBIDDEN = /\bNC\b|NonCommercial|\bND\b|NoDeriv|Fair use|non-free|GFDL-only/i;
// Needs a visible credit line. Public domain and CC0 do not.
const NO_CREDIT_NEEDED = /^(CC0|Public domain|PD-|No restrictions)/i;

const strip = (html) =>
  (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* -------------------------------- search --------------------------------- */

async function searchCommons(term) {
  const u =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json" +
    `&generator=search&gsrsearch=${encodeURIComponent(`filetype:bitmap ${term}`)}` +
    "&gsrnamespace=6&gsrlimit=25&prop=imageinfo" +
    "&iiprop=url|size|extmetadata|mime&iiurlwidth=2400";
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`Commons search failed: ${r.status}`);
  const j = await r.json();
  return Object.values(j.query?.pages || {});
}

function evaluate(page) {
  const ii = page.imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata || {};
  const licence = strip(m.LicenseShortName?.value) || "unknown";
  const author = strip(m.Artist?.value).slice(0, 80);
  const restrictions = strip(m.Restrictions?.value);
  const ratio = ii.width / ii.height;

  const reasons = [];
  if (!/^image\/(jpeg|png|webp)$/.test(ii.mime || "")) reasons.push(`mime ${ii.mime}`);
  if (ii.width < MIN_WIDTH) reasons.push(`too small (${ii.width}px)`);
  if (ratio < 1.3) reasons.push(`not landscape enough (${ratio.toFixed(2)})`);
  if (ratio > 2.4) reasons.push(`banner-shaped (${ratio.toFixed(2)})`);
  if (FORBIDDEN.test(licence)) reasons.push(`licence ${licence}`);
  if (restrictions) reasons.push(`restrictions: ${restrictions.slice(0, 40)}`);
  if (licence === "unknown") reasons.push("no licence metadata");

  const needsCredit = !NO_CREDIT_NEEDED.test(licence);
  if (needsCredit && !author) reasons.push("credit required but no author named");

  return {
    title: page.title.replace(/^File:/, ""),
    descriptionUrl: ii.descriptionurl,
    downloadUrl: ii.thumburl || ii.url,
    width: ii.width,
    height: ii.height,
    ratio,
    licence,
    author,
    needsCredit,
    ok: reasons.length === 0,
    reasons,
  };
}

/* -------------------------------- sanity --------------------------------- */

async function sanityQuery(groq) {
  const u = `https://${PROJECT}.api.sanity.io/v${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const r = await fetch(u, { headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}

async function uploadAsset(buffer, filename, contentType) {
  const u =
    `https://${PROJECT}.api.sanity.io/v${API}/assets/images/${DATASET}` +
    `?filename=${encodeURIComponent(filename)}`;
  const r = await fetch(u, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": contentType },
    body: buffer,
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(`Asset upload failed: ${JSON.stringify(j)}`);
  return j.document._id;
}

async function mutate(mutations) {
  const u = `https://${PROJECT}.api.sanity.io/v${API}/data/mutate/${DATASET}?returnIds=true`;
  const r = await fetch(u, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(`Mutation failed: ${JSON.stringify(j)}`);
  return j;
}

/* ---------------------------------- run ---------------------------------- */

const article = await sanityQuery(
  `*[_type=="article" && slug.current=="${SLUG}"][0]{_id, title, contentStatus, "hasHero": defined(heroImage.asset), destinationPrimary}`,
);

if (!article) {
  console.error(`No article with slug "${SLUG}".`);
  process.exit(1);
}
console.log(`Article: ${article.title}`);
console.log(
  `  _id ${article._id} · status ${article.contentStatus} · hero ${article.hasHero ? "already set" : "none"}`,
);
if (article.hasHero) {
  console.error(
    "Refusing to overwrite an existing hero. Clear it by hand first if that is intended.",
  );
  process.exit(1);
}

let chosen = null;
const rejected = [];
for (const term of SEARCHES) {
  console.log(`\nSearching Commons: "${term}"`);
  const pages = await searchCommons(term);
  const scored = pages.map(evaluate).filter(Boolean);
  const good = scored.filter((c) => c.ok);
  for (const bad of scored.filter((c) => !c.ok)) rejected.push(bad);
  for (const c of good) {
    console.log(
      `  OK  ${String(c.width)}x${c.height} ${c.licence.padEnd(14)} ${c.title.slice(0, 60)}${c.author ? ` — ${c.author}` : ""}`,
    );
  }
  if (!good.length) {
    console.log("  (nothing usable from this term)");
    continue;
  }
  // Prefer an image needing no attribution, then the widest.
  good.sort((a, b) => Number(a.needsCredit) - Number(b.needsCredit) || b.width - a.width);
  chosen = good[0];
  break;
}

if (rejected.length) {
  console.log(`\nRejected ${rejected.length} candidate(s). A sample of why:`);
  for (const r of rejected.slice(0, 6)) {
    console.log(`  - ${r.title.slice(0, 50)}: ${r.reasons.join("; ")}`);
  }
}

if (!chosen) {
  console.error("\nNo usable image found. Try different search terms, or borrow a sibling hero.");
  process.exit(2);
}

const credit = chosen.needsCredit
  ? `Photo: ${chosen.author}, ${chosen.licence}, via Wikimedia Commons`
  : null;

console.log("\nChosen:");
console.log(`  ${chosen.title}`);
console.log(`  ${chosen.width}x${chosen.height} (${chosen.ratio.toFixed(2)}) · ${chosen.licence}`);
console.log(`  source  ${chosen.descriptionUrl}`);
console.log(`  credit  ${credit ?? "(none needed, public domain / CC0)"}`);

if (!COMMIT) {
  console.log("\nDry run. Re-run with --commit (and --publish to go live).");
  process.exit(0);
}

console.log("\nDownloading...");
const imgRes = await fetch(chosen.downloadUrl, { headers: { "User-Agent": UA } });
if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`);
const buffer = Buffer.from(await imgRes.arrayBuffer());
const contentType = imgRes.headers.get("content-type") || "image/jpeg";
console.log(`  ${(buffer.length / 1024).toFixed(0)} KB, ${contentType}`);

const assetId = await uploadAsset(buffer, `${SLUG}-hero.jpg`, contentType);
console.log(`  uploaded ${assetId}`);

const heroImage = {
  _type: "image",
  asset: { _type: "reference", _ref: assetId },
  alt: `${article.title.replace(/["']/g, "")} — ${chosen.title.replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/_/g, " ")}`.slice(
    0,
    160,
  ),
  ...(credit ? { credit, creditUrl: chosen.descriptionUrl } : {}),
};

const patch = { set: { heroImage, ...(PUBLISH ? { contentStatus: "live" } : {}) } };
await mutate([{ patch: { id: article._id, ...patch } }]);

// Never trust the mutation response; read it back.
const after = await sanityQuery(
  `*[_id=="${article._id}"][0]{contentStatus, "asset": heroImage.asset._ref, "alt": heroImage.alt, "credit": heroImage.credit}`,
);
console.log("\nVerified from the dataset:");
console.log(`  contentStatus ${after.contentStatus}`);
console.log(`  asset         ${after.asset}`);
console.log(`  credit        ${after.credit ?? "(none)"}`);

if (after.asset !== assetId) {
  console.error("Asset reference did not stick. Investigate before trusting this.");
  process.exit(3);
}
if (PUBLISH && after.contentStatus !== "live") {
  console.error("Article did not go live. Investigate.");
  process.exit(3);
}
console.log("\nDone.");
if (PUBLISH) {
  console.log(
    `Next: confirm https://exploreindonesia.ai/trips/${SLUG} is in the sitemap, then run:`,
  );
  console.log("  bun run indexnow:submit");
}
