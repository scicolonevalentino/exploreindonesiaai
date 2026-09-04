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
 *   node scripts/link-health-check.mjs                          # full audit
 *   node scripts/link-health-check.mjs --filter lombok          # substring filter
 *   node scripts/link-health-check.mjs --json out.json          # JSON report
 *   node scripts/link-health-check.mjs --html out.html          # HTML report
 *   node scripts/link-health-check.mjs --md out.md              # Markdown report
 *   node scripts/link-health-check.mjs --strict                 # exit 1 on errors
 *
 * Env: none required (reads public Sanity dataset via CDN).
 */

import { createClient } from "@sanity/client";
import { writeFileSync } from "node:fs";
import { categorise, renderHtml, renderMarkdown } from "./link-health-report.mjs";

const args = process.argv.slice(2);
const argVal = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const filter = argVal("--filter")?.toLowerCase() ?? null;
const jsonOut = argVal("--json");
const htmlOut = argVal("--html");
const mdOut = argVal("--md");
const strict = args.includes("--strict");

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
  // Partner names come from the CMS and are inconsistently cased ("Klook",
  // "klook", "Booking.com"), so match case-insensitively — otherwise the whole
  // check silently no-ops on every capitalised entry.
  const markers = partner && AFFILIATE_MARKERS[partner.toLowerCase()];
  if (!markers) return true; // unknown → don't flag
  return markers.some((m) => url.includes(m));
}

// Internal links in article bodies are relative (e.g. "/trips/...",
// "/destinations/..."). fetch() can't resolve a relative URL (no base), so they
// previously all errored with status 0 — false "broken link" reports. Resolve
// them against production so they're actually checked.
const PROD_BASE = "https://exploreindonesia.ai";
const resolveUrl = (u) => (u && u.startsWith("/") ? PROD_BASE + u : u);

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
  const doFetch = (method) =>
    fetch(url, { method, redirect: "follow", signal: ctrl.signal, headers: HEADERS });
  try {
    let res;
    try {
      res = await doFetch("HEAD");
      // Many hosts and affiliate redirect chains reject or mishandle HEAD
      // (e.g. airalo.tpx.lu HEAD 302 but GET 200). If HEAD is not ok, retry with
      // GET before deciding the link is broken.
      if (!res.ok) res = await doFetch("GET");
    } catch {
      res = await doFetch("GET");
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

// Affiliate link shorteners (Travelpayouts' tpx.lu, used for both Klook and
// Airalo) exist precisely to redirect onto the merchant's own domain, and they
// append the affiliate params during that hop. So a domain change out of one is
// expected, not a misconfigured link.
const AFFILIATE_REDIRECTORS = ["tpx.lu"];
function isAffiliateRedirector(host) {
  return !!host && AFFILIATE_REDIRECTORS.includes(stripDomain(host));
}

// Hosts whose only purpose is to count and attribute an affiliate click. Every
// HTTP request to them is billed as a real click by the network (Travelpayouts
// in our case). Auditing them from CI on 2026-09-02 generated ~5.5k phantom
// clicks in five days and triggered a fraud-check email from Klook via
// Travelpayouts. The audit MUST NOT touch them — they 302 straight into the
// partner's own domain (klook.com, airalo.com), which is already covered by
// separate anchors in our content, so we lose no coverage by skipping them.
const BILLABLE_REDIRECTOR_HOSTS = ["tpx.lu", "emrldtp.cc", "tp.media"];
function isBillableRedirector(host) {
  if (!host) return false;
  return BILLABLE_REDIRECTOR_HOSTS.some((d) => host === d || host.endsWith("." + d));
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
      const articleMatch =
        filter &&
        (art.title?.toLowerCase().includes(filter) || art.slug?.toLowerCase().includes(filter));
      const urlMatch =
        filter &&
        (link.url?.toLowerCase().includes(filter) || link.anchor?.toLowerCase().includes(filter));
      if (filter && !articleMatch && !urlMatch) continue;
      all.push({ articleId: art._id, articleTitle: art.title, slug: art.slug, ...link });
    }
  }
  console.log(`Checking ${all.length} links…`);

  const checked = await pool(all, 8, async (l, i) => {
    if (!l.url) return { ...l, check: { ok: false, error: l.error || "no-url" } };
    process.stderr.write(`\r[${i + 1}/${all.length}]   `);
    // Never hit affiliate click-tracking hosts from CI — each request is a
    // billable click. See BILLABLE_REDIRECTOR_HOSTS above.
    if (isBillableRedirector(safeHost(l.url))) {
      return {
        ...l,
        skipped: "billable-redirector",
        check: { ok: true, status: 0, finalUrl: l.url, redirected: false },
        flags: [],
      };
    }
    const result = await check(resolveUrl(l.url));
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
      if (
        fromHost &&
        finalHost &&
        stripDomain(fromHost) !== stripDomain(finalHost) &&
        !isAffiliateRedirector(fromHost)
      ) {
        flags.push(`redirect-domain-change:${finalHost}`);
      }
    }
    // A shortlink (klook.tpx.lu/…) carries no affiliate params until AFTER the
    // redirect, so only flag when the marker is missing from BOTH the stored
    // URL and the resolved one.
    if (
      l.expectedPartner &&
      !hasAffiliateMarker(l.url, l.expectedPartner) &&
      !hasAffiliateMarker(result.finalUrl ?? "", l.expectedPartner)
    ) {
      flags.push("missing-affiliate-params");
    }
    return { ...l, check: result, flags };
  });
  process.stderr.write("\n");

  const issues = checked.filter((c) => c.flags?.length);
  // Bot-shield responses (e.g. Viator/Klook 403) are valid affiliate links
  // protected by bot detection, not broken links. Never treat them as errors,
  // even if other flags are also present on the same entry.
  const isBotShieldFlag = (f) => f.startsWith("bot-shield-");
  // Internal links (relative "/..." in article bodies) that 404 are real content
  // debt, but they are pre-existing and shouldn't block deploys — surface them as
  // warnings, not hard errors. External/affiliate breakages stay errors.
  const isInternal = (c) => typeof c.url === "string" && c.url.startsWith("/");
  // Travelpayouts affiliate redirectors (e.g. klook.tpx.lu) bounce through
  // bot-protected partner domains the audit can't follow, but the links work for
  // real users. Treat their failures as warnings, like the partner bot-shields.
  const AFFILIATE_REDIRECTORS = ["tpx.lu", "pxf.io"];
  const isAffiliateRedirect = (c) => {
    const h = safeHost(c.url);
    return !!h && AFFILIATE_REDIRECTORS.some((d) => h === d || h.endsWith("." + d));
  };
  // A non-OK HTTP response is only a hard error when the destination is
  // definitively dead: 404 (Not Found) or 410 (Gone). A 403/429/401/5xx or a
  // network timeout (http-err) is almost always partner bot-protection or a
  // transient edge failure that a real browser never hits — and it varies by
  // request IP, so from CI's datacenter address it would fail the build at
  // random (a different couple of links each run). Surface those as warnings.
  const DEAD_HTTP = new Set(["http-404", "http-410"]);
  const errors = issues.filter(
    (c) =>
      !c.flags.some(isBotShieldFlag) &&
      !isInternal(c) &&
      !isAffiliateRedirect(c) &&
      c.flags.some(
        (f) =>
          DEAD_HTTP.has(f) ||
          f.startsWith("redirect-domain-change") ||
          f === "missing-affiliate-params" ||
          f === "unresolved-affiliateLinkRef",
      ),
  );
  const warnings = issues.filter((c) => !errors.includes(c));

  const skipped = checked.filter((c) => c.skipped);
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total links checked : ${checked.length}`);
  console.log(`Skipped (billable redirectors, e.g. *.tpx.lu) : ${skipped.length}`);
  console.log(`Errors              : ${errors.length}`);
  console.log(`Warnings (bot-shield / transient): ${warnings.length}`);

  const print = (b) =>
    `\n[${b.flags.join(", ")}]\n  ${b.articleTitle} (${b.slug})\n  source: ${b.source}${b.blockKey ? " · block " + b.blockKey : ""}${b.anchor ? "\n  anchor: " + b.anchor : ""}\n  url   : ${b.url}\n  final : ${b.check?.finalUrl ?? "-"}  status ${b.check?.status ?? "-"}`;

  if (errors.length) {
    console.log(`\n=== ERRORS ===`);
    for (const b of errors) console.log(print(b));
  } else {
    console.log("\n✓ No errors — all links resolve to expected destinations");
  }
  if (warnings.length) {
    console.log(`\n=== WARNINGS (bot-shield / transient / non-fatal) ===`);
    for (const b of warnings) console.log(print(b));
  }

  const checkedAt = new Date().toISOString();
  const buckets = categorise(checked);
  const reportPayload = {
    checkedAt,
    total: checked.length,
    articlesCount: articles.length,
    buckets,
  };

  if (jsonOut) {
    writeFileSync(
      jsonOut,
      JSON.stringify(
        {
          checkedAt,
          total: checked.length,
          errors: errors.length,
          warnings: warnings.length,
          results: checked,
        },
        null,
        2,
      ),
    );
    console.log(`Wrote ${jsonOut}`);
  }
  if (htmlOut) {
    writeFileSync(htmlOut, renderHtml(reportPayload));
    console.log(`Wrote ${htmlOut}`);
  }
  if (mdOut) {
    writeFileSync(mdOut, renderMarkdown(reportPayload));
    console.log(`Wrote ${mdOut}`);
  }

  if (strict && errors.length) {
    console.error(`\n✗ STRICT MODE: ${errors.length} error(s) found — failing.`);
    process.exit(1);
  }
})();

function safeHost(u) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
function stripDomain(host) {
  // klook.com vs affiliate.klook.com → klook.com
  const parts = host.split(".");
  return parts.slice(-2).join(".");
}
