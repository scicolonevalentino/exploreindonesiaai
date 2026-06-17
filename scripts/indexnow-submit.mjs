#!/usr/bin/env node
// Submit URLs to IndexNow (Bing, Yandex, DuckDuckGo, Seznam, Naver, ...).
//
// Usage:
//   node scripts/indexnow-submit.mjs                  # submit every live URL in the sitemap
//   node scripts/indexnow-submit.mjs --urls https://exploreindonesia.ai/trips/new-article [more...]
//   node scripts/indexnow-submit.mjs --dry-run        # print the payload, send nothing
//   node scripts/indexnow-submit.mjs --sitemap https://<preview-url>/sitemap.xml
//
// IMPORTANT: run this only AFTER the IndexNow key file is live in production
// (i.e. this branch merged to main and deployed). IndexNow validates the key by
// fetching https://exploreindonesia.ai/<key>.txt before honoring submissions.

import { submitToIndexNow, SITE_ORIGIN, MAX_URLS_PER_REQUEST } from "./lib/indexnow.mjs";

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueFor = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const dryRun = has("--dry-run");

function explicitUrls() {
  const i = args.indexOf("--urls");
  if (i < 0) return [];
  return args.slice(i + 1).filter((a) => !a.startsWith("--"));
}

async function urlsFromSitemap(sitemapUrl) {
  const res = await fetch(sitemapUrl, { headers: { Accept: "application/xml" } });
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap ${sitemapUrl}: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  let urls = explicitUrls();
  let source = "--urls argument";
  if (urls.length === 0) {
    const sitemapUrl = valueFor("--sitemap") || `${SITE_ORIGIN}/sitemap.xml`;
    source = sitemapUrl;
    console.log(`Reading URLs from sitemap: ${sitemapUrl}`);
    urls = await urlsFromSitemap(sitemapUrl);
  }

  if (urls.length === 0) {
    console.error("No URLs to submit.");
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow${dryRun ? " (dry-run)" : ""}...`);

  let submitted = 0;
  for (const batch of chunk(urls, MAX_URLS_PER_REQUEST)) {
    const r = await submitToIndexNow(batch, { dryRun });
    if (r.skipped.length) {
      console.warn(
        `  Skipped ${r.skipped.length} off-host/invalid URL(s): ${r.skipped.slice(0, 3).join(", ")}${r.skipped.length > 3 ? " ..." : ""}`,
      );
    }
    if (dryRun) {
      console.log(r.body);
      submitted += r.submitted;
      continue;
    }
    if (r.ok) {
      console.log(`  ✓ ${r.submitted} URL(s) accepted (HTTP ${r.status}).`);
      submitted += r.submitted;
    } else {
      console.error(`  ✗ IndexNow rejected the batch: HTTP ${r.status} ${r.statusText || ""}`);
      if (r.body) console.error(`    ${r.body}`);
      process.exit(2);
    }
  }

  console.log(`Done. ${submitted} URL(s) ${dryRun ? "would be " : ""}submitted from ${source}.`);
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
