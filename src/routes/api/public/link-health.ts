// Pre-publish link-health gate.
//
// GET  /api/public/link-health        → 200 {ok:true, ...}  or  422 {ok:false, errors, summary}
// POST /api/public/link-health/check  → same, but designed to be called from a
//                                       Sanity Studio "publish" document action
//                                       to block publish on errors.
//
// This endpoint is the runtime counterpart to the CI workflow
// `.github/workflows/link-health.yml`. CI is the authoritative gate (it runs on
// every PR and on every Sanity webhook); this endpoint exists so the Sanity
// Studio publish dialog can also call it synchronously.
//
// SECURITY: read-only. Caller must include header `x-link-health-token` matching
// `LINK_HEALTH_TOKEN` env var. Keeps the endpoint cheap to host and prevents
// random callers from triggering 400+ outbound fetches.
//
// NOTE on cold-start cost: the audit performs ~500 outbound HEAD/GET requests.
// On Workers that comfortably fits within sub-request limits, but the call
// takes 20–40s. If you wire this into a Studio action, show a spinner.

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@sanity/client";

const sanity = createClient({
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
const BOT_SHIELDED_HOSTS = ["viator.com", "klook.com"];
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function safeHost(u: string | undefined | null) {
  try {
    return new URL(u as string).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
function stripDomain(h: string) {
  return h.split(".").slice(-2).join(".");
}
function isBotShielded(h: string | null) {
  if (!h) return false;
  return BOT_SHIELDED_HOSTS.some((d) => h === d || h.endsWith("." + d));
}
function guessPartner(url: string) {
  const host = safeHost(url);
  if (!host) return null;
  for (const [p, doms] of Object.entries(PARTNER_DOMAINS)) {
    if (doms.some((d) => host === d || host.endsWith("." + d))) return p;
  }
  return null;
}
function hasAffiliateMarker(url: string, partner: string | null) {
  if (!partner || !AFFILIATE_MARKERS[partner as keyof typeof AFFILIATE_MARKERS])
    return true;
  return AFFILIATE_MARKERS[partner as keyof typeof AFFILIATE_MARKERS].some((m) =>
    url.includes(m),
  );
}

type Link = {
  url: string | null;
  source: string;
  expectedPartner?: string | null;
  ref?: string;
  error?: string;
  articleId: string;
  articleTitle: string;
  slug: string;
  anchor?: string;
};

function extractLinks(article: Record<string, unknown>): Link[] {
  const out: Link[] = [];
  const affMap = new Map<string, { affiliateUrl?: string; partner?: string }>();
  for (const a of (article.affiliateLinks as Array<Record<string, string>>) ??
    []) {
    if (a.placeholderId) affMap.set(a.placeholderId, a);
    if (a._key) affMap.set(a._key, a);
    if (a.affiliateUrl) {
      out.push({
        url: a.affiliateUrl,
        source: "affiliateLinks",
        expectedPartner: a.partner,
        articleId: article._id as string,
        articleTitle: article.title as string,
        slug: (article as { slug?: string }).slug ?? "",
        anchor: a.anchorText,
      });
    }
  }
  for (const block of (article.body as Array<Record<string, unknown>>) ?? []) {
    if (block._type !== "block") continue;
    for (const md of (block.markDefs as Array<Record<string, unknown>>) ?? []) {
      if (md._type === "externalLink" && md.href) {
        out.push({
          url: md.href as string,
          source: "body.externalLink",
          expectedPartner: guessPartner(md.href as string),
          articleId: article._id as string,
          articleTitle: article.title as string,
          slug: (article as { slug?: string }).slug ?? "",
        });
      } else if (md._type === "affiliateLinkRef") {
        const ref =
          (md.placeholderId as string) ||
          ((md.affiliateRef as { _ref?: string })?._ref ?? "") ||
          (md.ref as string);
        const a = ref ? affMap.get(ref) : null;
        out.push({
          url: a?.affiliateUrl ?? null,
          source: "body.affiliateLinkRef",
          expectedPartner: a?.partner ?? null,
          ref,
          error: a?.affiliateUrl ? undefined : "unresolved-affiliateLinkRef",
          articleId: article._id as string,
          articleTitle: article.title as string,
          slug: (article as { slug?: string }).slug ?? "",
        });
      }
    }
  }
  return out;
}

async function check(url: string) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA },
    });
    if ([400, 403, 405].includes(res.status)) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "User-Agent": UA },
      });
    }
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
      redirected: res.redirected,
    };
  } catch (err) {
    return { ok: false, status: 0, error: (err as Error).message };
  } finally {
    clearTimeout(t);
  }
}

async function pool<T, R>(
  items: T[],
  n: number,
  fn: (item: T, i: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

async function runAudit() {
  const articles = await sanity.fetch<Array<Record<string, unknown>>>(
    `*[_type == "article"]{_id, title, "slug": slug.current, affiliateLinks, body}`,
  );
  const all: Link[] = [];
  for (const a of articles) all.push(...extractLinks(a));

  const checked = await pool(all, 10, async (l) => {
    if (!l.url) {
      const c: { ok: boolean; status?: number; finalUrl?: string; redirected?: boolean; error?: string } = { ok: false, error: l.error };
      return { ...l, check: c, flags: [l.error ?? "no-url"] };
    }
    const r: { ok: boolean; status?: number; finalUrl?: string; redirected?: boolean; error?: string } = await check(l.url);
    const flags: string[] = [];
    const finalHost = safeHost(r.finalUrl);
    if (!r.ok) {
      if ((r.status === 403 || r.status === 429) && isBotShielded(finalHost)) {
        flags.push(`bot-shield-${r.status}`);
      } else {
        flags.push(`http-${r.status || "err"}`);
      }
    }
    if (r.redirected) {
      const fromHost = safeHost(l.url);
      if (
        fromHost &&
        finalHost &&
        stripDomain(fromHost) !== stripDomain(finalHost) &&
        !(stripDomain(fromHost) === "tpx.lu" && stripDomain(finalHost) === "airalo.com")
      ) {
        flags.push(`redirect-domain-change:${finalHost}`);
      }
    }
    if (l.expectedPartner && !hasAffiliateMarker(l.url, l.expectedPartner)) {
      flags.push("missing-affiliate-params");
    }
    return { ...l, check: r, flags };
  });

  const errors = checked.filter((c) =>
    c.flags.some(
      (f) =>
        (f.startsWith("http-") && !f.startsWith("http-403") && !f.startsWith("http-429")) ||
        f.startsWith("redirect-domain-change") ||
        f === "missing-affiliate-params" ||
        f === "unresolved-affiliateLinkRef",
    ),
  );
  const warnings = checked.filter(
    (c) => c.flags.length && !errors.includes(c),
  );

  return {
    ok: errors.length === 0,
    summary: {
      total: checked.length,
      errors: errors.length,
      warnings: warnings.length,
      articles: articles.length,
    },
    errors: errors.slice(0, 50).map((e) => ({
      article: e.articleTitle,
      slug: e.slug,
      anchor: e.anchor,
      source: e.source,
      url: e.url,
      finalUrl: e.check?.finalUrl,
      status: e.check?.status,
      flags: e.flags,
    })),
  };
}

function authorise(request: Request) {
  const expected = process.env.LINK_HEALTH_TOKEN;
  if (!expected) return true; // open if not configured (dev convenience)
  const got = request.headers.get("x-link-health-token");
  return got === expected;
}

export const Route = createFileRoute("/api/public/link-health")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!authorise(request)) return new Response("Unauthorized", { status: 401 });
        const result = await runAudit();
        return new Response(JSON.stringify(result, null, 2), {
          status: result.ok ? 200 : 422,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      },
      POST: async ({ request }) => {
        if (!authorise(request)) return new Response("Unauthorized", { status: 401 });
        const result = await runAudit();
        return new Response(JSON.stringify(result, null, 2), {
          status: result.ok ? 200 : 422,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
