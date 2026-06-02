// Client-side analytics consent helper.
//
// We default GA4 / GTM / Contentsquare to "denied" via consent mode, and only
// inject the loaders once the user explicitly accepts cookies. Stored in
// localStorage under `cookie-consent-v1`.

export const CONSENT_KEY = "cookie-consent-v1";
export type ConsentState = "accepted" | "rejected" | null;

const GA4_ID = "G-ZNEKVH2ETY";
const GTM_ID = "GTM-MNZHRZ79";
const CS_SRC = "https://t.contentsquare.net/uxa/2fe350eb44674.js";

let loaded = false;

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: "accepted" | "rejected") {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // ignore
  }
  if (value === "accepted") {
    loadAnalytics();
    updateGtagConsent("granted");
  } else {
    updateGtagConsent("denied");
  }
}

function updateGtagConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  }
  gtag("consent", "update", {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

function injectScript(src: string, attrs: Record<string, string | boolean> = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  for (const [k, v] of Object.entries(attrs)) {
    if (v === true) s.setAttribute(k, "");
    else if (typeof v === "string") s.setAttribute(k, v);
  }
  document.head.appendChild(s);
}

export function loadAnalytics() {
  if (typeof window === "undefined" || loaded) return;
  loaded = true;

  // GA4
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", GA4_ID);

  // GTM
  if (!document.querySelector(`script[data-gtm="${GTM_ID}"]`)) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    s.setAttribute("data-gtm", GTM_ID);
    document.head.appendChild(s);
    w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  }

  // Contentsquare
  injectScript(CS_SRC);
}

// Set defaults — call once at app boot before anything else.
export function initConsentDefaults() {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  }
  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  const existing = getConsent();
  if (existing === "accepted") loadAnalytics();
}
