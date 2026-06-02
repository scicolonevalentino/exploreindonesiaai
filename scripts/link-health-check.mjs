#!/usr/bin/env node
/**
 * Link Health Check
 * -----------------
 * Audits every outbound link in published Sanity articles:
 *   • article.affiliateLinks[*].affiliateUrl / publicUrl
 *   • body[*].markDefs[*].href  (externalLink marks)
 *   • body[*].markDefs[*] resolved via affiliateLinkRef → affiliateLinks
 *
 * For each URL:
 *   • performs HEAD (falls back to GET) following redirects
 *   • records final URL, status, and redirect chain length
 *   • flags: broken (>=400), redirect-to-different-domain, missing-affiliate-params
 *
 * Usage:
 *   node scripts/link-health-check.mjs                 # full audit
 *   node scripts/link-health-check.mjs --filter lombok # only URLs/articles matching substring
 *   node scripts/link-health-check.mjs --json out.json # write structured report
 *
 * Env: none required (reads public Sanity dataset via CDN).
 */

import { createClient } from "@sanity/client";
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const filterIdx = args.indexOf("--filter");
const filter = filterIdx >= 0 ? args[filterIdx + 1]?.toLowerCase() : null;
const jsonIdx = args.indexOf("--json");
const jsonOut = jsonIdx >= 0 ? args[jsonIdx + 1] : null;

const client = createClient({
  projectId: "u4ah1ore",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const PARTNER_DOMAINS = {
  klook: ["klook.com", "affiliate.klook.com"],
  viator: ["viator.com"],
  airalo: ["airalo.com", "airalo.tpx.lu", "tpx.lu"],
  "12go": ["12go.asia"],
  booking: ["booking.com"],
  agoda: ["agoda.com"],
};

const AFFILIATE_MARKERS = {
  klook: ["aff_adid", "aid="],
  viator: ["pid=", "mcid="],
  airalo: ["tpx.lu"],
  "12go": ["z="],
};

async function fetchArticles() {
  return client.fetch(`*[_type == "article"]{
    _id, title, "slug": slug.current, affiliateLinks, body
  }`);
}

function extractLinks(article) {
  const out = [];
  const affMap = new Map();
  for (const a of article.affiliateLinks ?? []) {
    if (a.placeholderId) affMap.set(a.placeholderId, a);
    if (a._key) affMap.set(a._key, a);
    if (a.affiliateUrl) {
      out.push({
        source: "affiliateLinks",
        key: a._key,
        partner: a.partner,
        anchor: a.anchorText,
        url: a.affiliateUrl,
        expectedPartner: a.partner,
      });
    }
  }
  for (const block of article.body ?? []) {
    if (block._type !== "block") continue;
    for (const md of block.markDefs ?? []) {
      if (md._type === "externalLink" && md.href) {
        out.push({
          source: "body.externalLink",
          key: md._key,
          blockKey: block._key,
          url: md.href,
          expectedPartner: guessPartner(md.href),
        });
      } else if (md._type === "affiliateLinkRef") {
        const ref = md.placeholderId || md.affiliateRef?._ref || md.ref;
        const a = ref ? affMap.get(ref) : null;
        if (a?.affiliateUrl) {
          out.push({
            source: "body.affiliateLinkRef",
            key: md._key,
            blockKey: block._key,
            ref,
            url: a.affiliateUrl,
            expectedPartner: a.partner,
            resolvedVia: "affiliateLinks",
          });
        } else {
          out.push({
            source: "body.affiliateLinkRef",
            key: md._key,
            blockKey: block._key,
            ref,
            url: null,
            error: "unresolved-affiliateLinkRef",
          });
        }
      }
    }
  }
  return out;
}

function guessPartner(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const [p, doms] of Object.entries(PARTNER_DOMAINS)) {
      if (doms.some((d) => host === d || host.endsWith("." + d))) return p;
    }
  } catch {}
  return null;
}

function hasAffiliateMarker(url, partner) {
  if (!partner || !AFFILIATE_MARKERS[partner]) return true; // unknown → don't flag
  return AFFILIATE_MARKERS[partner].some((m) => url.includes(m));
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const HEADERS = {
  "User-Agent": UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

async function check(url, { timeout = 15000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal, headers: HEADERS });
    if (res.status === 405 || res.status === 403 || res.status === 400) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal, headers: HEADERS });
    }
    return { ok: res.ok, status: res.status, finalUrl: res.url, redirected: res.redirected };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  } finally {
    clearTimeout(t);
  }
}

// Hosts known to block bots even on GET — a 403 after redirect to the canonical
// destination domain is benign (bot-shield), not a broken link.
const BOT_SHIELDED_HOSTS = ["viator.com", "klook.com"];
function isBotShielded(host) {
  if (!host) return false;
  return BOT_SHIELDED_HOSTS.some((d) => host === d || host.endsWith("." + d));
}

async function pool(items, n, fn) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return results;
}

(async () => {
  console.log("Fetching articles…");
  const articles = await fetchArticles();
  console.log(`Loaded ${articles.length} articles`);

  const all = [];
  for (const art of articles) {
    for (const link of extractLinks(art)) {
      const articleMatch = filter && (art.title?.toLowerCase().includes(filter) || art.slug?.toLowerCase().includes(filter));
      const urlMatch = filter && (link.url?.toLowerCase().includes(filter) || link.anchor?.toLowerCase().includes(filter));
      if (filter && !articleMatch && !urlMatch) continue;
      all.push({ articleId: art._id, articleTitle: art.title, slug: art.slug, ...link });
    }
  }
  console.log(`Checking ${all.length} links…`);

  const checked = await pool(all, 8, async (l, i) => {
    if (!l.url) return { ...l, check: { ok: false, error: l.error || "no-url" } };
    process.stderr.write(`\r[${i + 1}/${all.length}]   `);
    const result = await check(l.url);
    const flags = [];
    const finalHost = safeHost(result.finalUrl);
    const shielded = isBotShielded(finalHost);
    if (!result.ok) {
      // 403 from Klook/Viator after a redirect to their canonical domain is
      // bot-protection, not a broken link — surface as warning, not error.
      if ((result.status === 403 || result.status === 429) && shielded) {
        flags.push(`bot-shield-${result.status}`);
      } else {
        flags.push(`http-${result.status || "err"}`);
      }
    }
    if (result.redirected) {
      const fromHost = safeHost(l.url);
      if (fromHost && finalHost && stripDomain(fromHost) !== stripDomain(finalHost)) {
        // tpx.lu → airalo.com is the expected affiliate redirect for Airalo
        const expectedAiraloHop = stripDomain(fromHost) === "tpx.lu" && stripDomain(finalHost) === "airalo.com";
        if (!expectedAiraloHop) flags.push(`redirect-domain-change:${finalHost}`);
      }
    }
    if (l.expectedPartner && !hasAffiliateMarker(l.url, l.expectedPartner)) {
      flags.push("missing-affiliate-params");
    }
    return { ...l, check: result, flags };
  });
  process.stderr.write("\n");

  const issues = checked.filter((c) => c.flags?.length);
  const errors = issues.filter((c) => c.flags.some((f) => f.startsWith("http-") || f.startsWith("redirect-domain-change") || f === "missing-affiliate-params" || f === "unresolved-affiliateLinkRef"));
  const warnings = issues.filter((c) => !errors.includes(c));

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total links checked : ${checked.length}`);
  console.log(`Errors              : ${errors.length}`);
  console.log(`Warnings (bot-shield): ${warnings.length}`);

  const print = (b) =>
    `\n[${b.flags.join(", ")}]\n  ${b.articleTitle} (${b.slug})\n  source: ${b.source}${b.blockKey ? " · block " + b.blockKey : ""}${b.anchor ? "\n  anchor: " + b.anchor : ""}\n  url   : ${b.url}\n  final : ${b.check?.finalUrl ?? "-"}  status ${b.check?.status ?? "-"}`;

  if (errors.length) {
    console.log(`\n=== ERRORS ===`);
    for (const b of errors) console.log(print(b));
  } else {
    console.log("\n✓ No errors — all links resolve to expected destinations");
  }
  if (warnings.length) {
    console.log(`\n=== WARNINGS (partner bot-shield, not broken) ===`);
    for (const b of warnings) console.log(print(b));
  }

  if (jsonOut) {
    writeFileSync(jsonOut, JSON.stringify({ checkedAt: new Date().toISOString(), total: checked.length, errors: errors.length, warnings: warnings.length, results: checked }, null, 2));
    console.log(`\nWrote ${jsonOut}`);
  }
})();

function safeHost(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } }
function stripDomain(host) {
  // klook.com vs affiliate.klook.com → klook.com
  const parts = host.split(".");
  return parts.slice(-2).join(".");
}
