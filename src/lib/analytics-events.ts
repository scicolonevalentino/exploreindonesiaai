// Lightweight GTM dataLayer event push for prototype interaction tracking.
//
// GTM is already injected (after consent) by analytics-consent.ts, so this only
// pushes onto the existing window.dataLayer — no script tags are added here.
// Before consent is granted dataLayer events are simply queued/ignored by GTM,
// so callers don't need to gate on consent themselves.

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/**
 * Push a named event onto the GTM dataLayer. Always includes `event` as the key.
 * Undefined params are dropped so GA4 doesn't receive empty parameter values.
 */
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) clean[k] = v;
    }
    window.dataLayer.push({ event, ...clean });
  } catch {
    // Never let analytics break the UI.
  }
}
