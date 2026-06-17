// Lightweight event tracking for interaction analytics.
//
// gtag.js (GA4) and GTM are both injected after consent by analytics-consent.ts,
// so this adds no script tags; it forwards events to GA4 via the existing gtag
// (with a dataLayer fallback before gtag loads). Before consent is granted gtag
// is absent and dataLayer events are queued/ignored, so callers don't gate on
// consent themselves.

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

// GA4 is loaded directly via gtag.js (see analytics-consent.ts), NOT through
// GTM, so dataLayer pushes alone never reach GA4. Forward events to GA4 with
// gtag, exactly like the homepage beacon in src/routes/index.tsx. Must match the
// gtag('config', ...) ID in analytics-consent.ts / __root.tsx.
const GA4_MEASUREMENT_ID = "G-ZNEKVH2ETY";

/**
 * Send a named event to GA4. Undefined params are dropped so GA4 doesn't receive
 * empty parameter values. When gtag is ready (after consent) the event goes
 * straight to GA4; `send_to` scopes it to this stream so a future GTM-side GA4
 * tag can't re-forward and double-count it. Before gtag loads we fall back to the
 * dataLayer (which also feeds GTM). Do NOT add a GTM GA4 tag for these events.
 */
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) clean[k] = v;
    }
    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", event, { ...clean, send_to: GA4_MEASUREMENT_ID });
    } else {
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event, ...clean });
    }
  } catch {
    // Never let analytics break the UI.
  }
}
