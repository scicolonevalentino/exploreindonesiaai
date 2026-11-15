#!/usr/bin/env node
// Deterministic publish gate for Sanity content (articles and guides).
// No model judgement here: every check is a rule that either passes or fails.
// Exit code 0 = may publish, 1 = blocking failures, 2 = usage / fetch error.
//
//   node scripts/seo-validate.mjs --file content/articles/<slug>.json
//   node scripts/seo-validate.mjs --slug <slug>            # reads the live dataset
//   node scripts/seo-validate.mjs --file new.json --baseline-slug <slug>
//        # patching an old document: only failures that are NEW block
//   node scripts/seo-validate.mjs --meta-title "..." --meta-description "..."
//   add --json for machine-readable output, --offline to skip network checks

import { readFileSync } from "node:fs";

const PROJECT = "u4ah1ore";
const API = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/production`;

export const BANNED = [
  "hidden gem",
  "must-see",
  "must see",
  "paradise",
  "immerse yourself",
  "unforgettable",
  "something for everyone",
  "vibrant culture",
  "crystal-clear",
  "crystal clear",
  "breathtaking",
  "rich history",
  "local charm",
  "authentic experience",
  "off the beaten path",
  "off-the-beaten-path",
  "once-in-a-lifetime",
  "bucket list",
  "dream destination",
];
const META_TITLE_MAX = 60;
const META_DESC_MAX = 155;

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const v = argv[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
};

const groq = async (query) => {
  const res = await fetch(`${API}?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Sanity ${res.status}`);
  return (await res.json()).result;
};

/** Every string in the document, with a readable path, skipping technical fields. */
const strings = (node, path = "", out = []) => {
  if (typeof node === "string") out.push([path, node]);
  else if (Array.isArray(node)) node.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("_") || ["href", "affiliateUrl", "url", "asset", "credit"].includes(k))
        continue;
      strings(v, path ? `${path}.${k}` : k, out);
    }
  }
  return out;
};

const textChecks = (pairs, fails) => {
  for (const [path, s] of pairs) {
    if (/[—–]/.test(s)) fails.push(`dash (— or –) in ${path}: "${s.slice(0, 70)}"`);
    // "bird of paradise" is a species name, not the banned cliché.
    const low = s.toLowerCase().replace(/birds?[-_ ]of[-_ ]paradise/g, "");
    for (const b of BANNED) if (low.includes(b)) fails.push(`banned phrase "${b}" in ${path}`);
    if (s.includes("(SEARCH")) fails.push(`artefact "(SEARCH" in ${path}`);
    if (/\d[\d,]* reviews/.test(s)) fails.push(`artefact "<n> reviews" in ${path}`);
  }
};

const metaChecks = (title, desc, fails) => {
  if (!title) fails.push("metaTitle is empty");
  else if (title.length > META_TITLE_MAX)
    fails.push(`metaTitle is ${title.length} chars, max ${META_TITLE_MAX}`);
  if (!desc) fails.push("metaDescription is empty");
  else if (desc.length > META_DESC_MAX)
    fails.push(`metaDescription is ${desc.length} chars, max ${META_DESC_MAX}`);
};

const affiliateUrlChecks = (id, url, fails) => {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return fails.push(`affiliate ${id}: not a URL ("${url}")`);
  }
  if (host.includes("affiliate.klook.com"))
    fails.push(`affiliate ${id}: direct affiliate.klook.com, must be klook.tpx.lu`);
  if (host.endsWith("viator.com") && !url.includes("pid=P00303362"))
    fails.push(`affiliate ${id}: Viator link without pid=P00303362`);
  if (host.endsWith("12go.asia") && !url.includes("z=16022946"))
    fails.push(`affiliate ${id}: 12Go link without z=16022946`);
  if (host.includes("jdoqocy.com"))
    fails.push(`affiliate ${id}: hand-built CJ URL, store the plain booking.com search URL`);
};

const validateDoc = async (doc, { offline }) => {
  const fails = [];
  const warns = [];
  textChecks(strings(doc), fails);
  metaChecks(doc.metaTitle, doc.metaDescription, fails);

  // unique _key across the document
  const keys = [];
  const walk = (n) => {
    if (Array.isArray(n)) n.forEach(walk);
    else if (n && typeof n === "object") {
      if (n._key) keys.push(n._key);
      Object.values(n).forEach(walk);
    }
  };
  walk(doc);
  const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dup.length) fails.push(`duplicate _key: ${[...new Set(dup)].slice(0, 5).join(", ")}`);

  const body = Array.isArray(doc.body) ? doc.body : [];
  const marks = body.flatMap((b) => b.markDefs || []);

  // affiliate integrity
  const have = new Map((doc.affiliateLinks || []).map((a) => [a.placeholderId, a.affiliateUrl]));
  for (const m of marks.filter((x) => x._type === "affiliateLinkRef")) {
    if (!have.has(m.placeholderId))
      fails.push(`affiliateLinkRef ${m.placeholderId} has no entry in affiliateLinks`);
    else if (!have.get(m.placeholderId))
      fails.push(`affiliateLinks ${m.placeholderId} has an EMPTY affiliateUrl (dead CTA)`);
  }
  for (const [id, url] of have) if (url) affiliateUrlChecks(id, url, fails);

  // internal links must point at something that exists and is live
  const internal = [
    ...new Set(
      marks
        .filter((m) => m._type === "externalLink" && m.href?.startsWith("/"))
        .map((m) => m.href.split("#")[0].split("?")[0]),
    ),
  ];
  const tripSlugs = internal.filter((h) => h.startsWith("/trips/")).map((h) => h.slice(7));
  if (tripSlugs.length && !offline) {
    const live = await groq(
      `*[_type=="article" && contentStatus=="live" && slug.current in ${JSON.stringify(tripSlugs)}].slug.current`,
    );
    for (const s of tripSlugs)
      if (!live.includes(s)) fails.push(`internal link /trips/${s} is not a live article`);
  }

  if (doc._type === "article") {
    if (!["live", "draft", "archived"].includes(doc.contentStatus))
      fails.push(`contentStatus "${doc.contentStatus}" is not valid`);
    if (doc.contentStatus === "live") {
      if (!doc.heroImage?.asset) fails.push("live article without heroImage");
      else if (!doc.heroImage.alt) fails.push("heroImage without alt text");
      else if (!doc.heroImage.credit)
        warns.push("heroImage has no credit: fine only for public domain / CC0");
    }
    const faq = doc.faq?.length ?? 0;
    if (faq < 5 || faq > 8) warns.push(`faq has ${faq} items, house standard is 5-8`);
    if (!body.some((b) => b._type === "comparisonTable")) warns.push("no comparison table");
  }

  // GEO: the block under a question H2 should be a 40-60 word self-contained answer
  body.forEach((b, i) => {
    const text = (x) => (x?.children || []).map((c) => c.text).join("");
    if (b.style === "h2" && text(b).includes("?") && body[i + 1]?._type === "block") {
      const n = text(body[i + 1])
        .split(/\s+/)
        .filter(Boolean).length;
      if (n < 40 || n > 60) warns.push(`answer under H2 "${text(b)}" is ${n} words, target 40-60`);
    }
  });

  return { fails, warns };
};

const main = async () => {
  const offline = Boolean(flag("offline"));
  let result;
  let label;
  if (flag("meta-title") !== undefined || flag("meta-description") !== undefined) {
    const fails = [];
    const t = flag("meta-title");
    const d = flag("meta-description");
    const pairs = [];
    if (typeof t === "string") {
      pairs.push(["metaTitle", t]);
      if (t.length > META_TITLE_MAX)
        fails.push(`metaTitle is ${t.length} chars, max ${META_TITLE_MAX}`);
    }
    if (typeof d === "string") {
      pairs.push(["metaDescription", d]);
      if (d.length > META_DESC_MAX)
        fails.push(`metaDescription is ${d.length} chars, max ${META_DESC_MAX}`);
    }
    textChecks(pairs, fails);
    result = { fails, warns: [] };
    label = "meta";
  } else {
    let doc;
    if (typeof flag("file") === "string") doc = JSON.parse(readFileSync(flag("file"), "utf8"));
    else if (typeof flag("slug") === "string") {
      doc = await groq(
        `*[_type in ["article","guide"] && slug.current==${JSON.stringify(flag("slug"))}][0]`,
      );
      if (!doc) throw new Error(`no article or guide with slug ${flag("slug")}`);
    } else
      throw new Error("usage: --file <json> | --slug <slug> | --meta-title/--meta-description");
    label = doc.slug?.current ?? doc._id;
    result = await validateDoc(doc, { offline });
    // Patching an old document: failures that already exist live are legacy, not
    // caused by this change. They are reported, but only NEW failures block.
    const base = flag("baseline-slug");
    if (typeof base === "string") {
      const liveDoc = await groq(
        `*[_type in ["article","guide"] && slug.current==${JSON.stringify(base)}][0]`,
      );
      if (!liveDoc) throw new Error(`no live document with slug ${base} to use as baseline`);
      const legacy = new Set((await validateDoc(liveDoc, { offline })).fails);
      const strip = (f) => f.replace(/\[\d+\]/g, "[]");
      const legacyLoose = new Set([...legacy].map(strip));
      const fresh = result.fails.filter((f) => !legacyLoose.has(strip(f)));
      const old = result.fails.filter((f) => legacyLoose.has(strip(f)));
      result = {
        fails: fresh,
        warns: [...result.warns, ...old.map((f) => `legacy (already live): ${f}`)],
      };
    }
  }
  if (flag("json"))
    console.log(JSON.stringify({ target: label, ok: !result.fails.length, ...result }, null, 2));
  else {
    console.log(`seo-validate ${label}: ${result.fails.length ? "FAIL" : "PASS"}`);
    result.fails.forEach((f) => console.log(`  FAIL  ${f}`));
    result.warns.forEach((w) => console.log(`  warn  ${w}`));
  }
  process.exit(result.fails.length ? 1 : 0);
};

main().catch((e) => {
  console.error(`seo-validate: ${e.message}`);
  process.exit(2);
});
