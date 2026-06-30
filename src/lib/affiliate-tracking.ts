// Universal affiliate-click tracking.
//
// A SINGLE delegated click listener on <document> fires `affiliate_click` for
// EVERY outbound link to a known affiliate domain — article bodies (Sanity
// portable text), the trip builder, the partner strip, the footer, the map
// popups, and any future link — not just the handful with their own onClick.
//
// Render sites that already fire a richer affiliate_click (with category / price
// / source) call `trackAffiliateClick(params, href)` instead of trackEvent: it
// tags that URL as just-handled so the global listener SKIPS it and the event is
// never double-counted. Everything else is caught automatically by domain.

import { trackEvent } from "@/lib/analytics-events";

// CJ Affiliate redirect domains — every one wraps Booking.com for us (the CJ
// click URL has no secrets; see src/lib/booking.ts). Kept in sync with that file.
const CJ_HOSTS = [
  "jdoqocy.com",
  "tkqlhce.com",
  "kqzyfj.com",
  "dpbolvw.com",
  "anrdoezrs.net",
  "emjcd.com",
  "ftjcfx.com",
  "awltovhc.com",
  "qksrv.net",
];

// host (sans leading "www.") -> partner slug. endsWith match so subdomains count.
const PARTNER_HOSTS: Array<{ match: (h: string) => boolean; partner: string }> = [
  { match: (h) => h === "booking.com" || h.endsWith(".booking.com"), partner: "booking" },
  { match: (h) => CJ_HOSTS.some((d) => h === d || h.endsWith("." + d)), partner: "booking" },
  { match: (h) => h === "viator.com" || h.endsWith(".viator.com"), partner: "viator" },
  { match: (h) => h.endsWith("getyourguide.com"), partner: "getyourguide" },
  { match: (h) => h.endsWith("klook.com"), partner: "klook" },
  { match: (h) => h === "12go.asia" || h.endsWith(".12go.asia"), partner: "12go" },
];

// Travelpayouts shortener (tpx.lu) is shared by several partners; the subdomain
// names the partner when present (ektatraveling.tpx.lu -> ekta), else generic.
function travelpayoutsPartner(host: string): string | null {
  if (host === "tpx.lu" || host.endsWith(".tpx.lu")) {
    const sub = host.replace(/\.?tpx\.lu$/, "");
    if (/ekta/.test(sub)) return "ekta";
    if (/airalo/.test(sub)) return "airalo";
    if (/welcome/.test(sub)) return "welcomepickups";
    if (/klook/.test(sub)) return "klook";
    return "travelpayouts";
  }
  if (host.endsWith("tp.media") || host.endsWith("emrldtp.cc")) return "travelpayouts";
  return null;
}

function hostOf(href: string): string | null {
  try {
    return new URL(href, window.location.href).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

// Resolve the affiliate partner for an href, or null if it isn't an affiliate link.
export function affiliatePartnerFor(href: string): string | null {
  const host = hostOf(href);
  if (!host) return null;
  const tp = travelpayoutsPartner(host);
  if (tp) return tp;
  for (const { match, partner } of PARTNER_HOSTS) if (match(host)) return partner;
  return null;
}

// URLs whose affiliate_click a render site just fired via its own onClick.
// Cleared on the next macrotask: long enough to span the same click dispatch
// (React's onClick runs before this document listener), short enough to never
// suppress a later genuine click on the same link.
const recentlyHandled = new Set<string>();

function markHandled(url: string) {
  recentlyHandled.add(url);
  setTimeout(() => recentlyHandled.delete(url), 0);
}

/**
 * Fire affiliate_click from a render site that has richer context than the URL
 * alone (category, price, source, item_name). Pass the link's `href` so the
 * global listener dedupes this same click. Use this instead of
 * trackEvent("affiliate_click", …) anywhere an explicit handler already exists.
 */
export function trackAffiliateClick(params: Record<string, unknown>, href?: string) {
  if (href) markHandled(href);
  trackEvent("affiliate_click", params);
}

let initialized = false;

/** Attach the one global affiliate-click listener. Call once on app mount (client only). */
export function initAffiliateClickTracking() {
  if (typeof document === "undefined" || initialized) return;
  initialized = true;

  const onClick = (e: Event) => {
    const target = e.target as Element | null;
    const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;

    const rawHref = anchor.getAttribute("href") || "";
    if (!rawHref || rawHref.startsWith("#")) return;

    // An explicit data-affiliate-partner override wins (e.g. an ambiguous
    // tpx.lu link whose partner the render site knows); else derive by domain.
    const partner = anchor.dataset.affiliatePartner || affiliatePartnerFor(anchor.href);
    if (!partner) return;

    // A render site's own onClick already fired the (richer) event for this URL.
    if (recentlyHandled.has(anchor.href) || recentlyHandled.has(rawHref)) return;

    trackEvent("affiliate_click", {
      partner,
      link_url: anchor.href,
      link_domain: hostOf(anchor.href) ?? undefined,
      link_text: (anchor.textContent || "").trim().slice(0, 100) || undefined,
      context: anchor.dataset.affiliateContext || undefined,
      page_path: window.location.pathname,
    });
  };

  // Bubble phase (capture:false) so React's onClick — which calls
  // trackAffiliateClick and marks the URL handled — runs first within the same
  // click dispatch. auxclick covers middle-click "open in new tab".
  document.addEventListener("click", onClick);
  document.addEventListener("auxclick", onClick);
}
