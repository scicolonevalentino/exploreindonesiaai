// IndexNow submission helper.
//
// IndexNow instantly notifies Bing, Yandex, DuckDuckGo (via Bing), Seznam, Naver
// and any future participant that URLs have changed, instead of waiting for crawl
// budget. A single POST to one endpoint fans out to every participating engine —
// this is the Bing/AI-answer-engine equivalent of Google's Indexing API, and it
// directly targets the crawl-starvation problem on the non-Google side.
//
// The key is PUBLIC by design: it proves domain ownership via the key file at
// https://exploreindonesia.ai/<key>.txt (sibling of llms.txt / robots.txt).
// Docs: https://www.indexnow.org/documentation

export const INDEXNOW_HOST = "exploreindonesia.ai";
export const INDEXNOW_KEY = "5f8e11e30a0f02a44fd6c20b536be21e";
export const SITE_ORIGIN = `https://${INDEXNOW_HOST}`;
export const INDEXNOW_KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

// Submitting to any one IndexNow endpoint shares the URLs with all participants.
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// Protocol cap per request. The sitemap is far smaller, but we guard anyway.
export const MAX_URLS_PER_REQUEST = 10000;

/**
 * Submit one or more URLs to IndexNow.
 *
 * Only well-formed https URLs on INDEXNOW_HOST are sent; anything else is
 * reported back via `skipped` (IndexNow rejects the whole batch if any URL is
 * off-host, so we filter defensively).
 *
 * @param {string[]} urls absolute URLs
 * @param {{ dryRun?: boolean }} [opts]
 * @returns {Promise<{ ok: boolean, status: number, statusText?: string, submitted: number, skipped: string[], body?: string }>}
 */
export async function submitToIndexNow(urls, opts = {}) {
  const { dryRun = false } = opts;

  const skipped = [];
  const clean = [];
  const seen = new Set();
  for (const raw of urls) {
    let u;
    try {
      u = new URL(String(raw).trim());
    } catch {
      skipped.push(raw);
      continue;
    }
    if (u.protocol !== "https:" || u.hostname !== INDEXNOW_HOST) {
      skipped.push(raw);
      continue;
    }
    if (seen.has(u.href)) continue;
    seen.add(u.href);
    clean.push(u.href);
  }

  if (clean.length === 0) {
    return { ok: false, status: 0, statusText: "no valid URLs", submitted: 0, skipped };
  }
  if (clean.length > MAX_URLS_PER_REQUEST) {
    throw new Error(
      `IndexNow accepts at most ${MAX_URLS_PER_REQUEST} URLs per request (got ${clean.length}); batch the submission.`,
    );
  }

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: clean,
  };

  if (dryRun) {
    return {
      ok: true,
      status: 0,
      statusText: "dry-run (not sent)",
      submitted: clean.length,
      skipped,
      body: JSON.stringify(payload, null, 2),
    };
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let body = "";
  try {
    body = await res.text();
  } catch {
    /* body is optional */
  }

  // 200 = submitted, 202 = received (key validation pending). Both are success.
  const ok = res.status === 200 || res.status === 202;
  return {
    ok,
    status: res.status,
    statusText: res.statusText,
    submitted: clean.length,
    skipped,
    body,
  };
}
