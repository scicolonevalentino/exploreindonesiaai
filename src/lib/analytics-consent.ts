// Cookiebot-driven consent (Usercentrics CMP), manual blocking mode.
//
// Cookiebot owns the consent banner and persists the visitor's choice — we no
// longer render a custom banner or store a `cookie-consent-v1` localStorage key.
// Our only job here is to BRIDGE Cookiebot's consent categories onto Google
// Consent Mode v2 signals and lazy-load GA4 / GTM / Contentsquare once the
// visitor grants the relevant category.
//
// Flow:
//   1. __root.tsx head sets Consent Mode default = denied (runs before Cookiebot).
//   2. __root.tsx head injects the Cookiebot loader (uc.js, data-blockingmode="manual").
//   3. Cookiebot shows the banner on first visit and fires consent events.
//   4. initCookiebotConsent() (called once on mount) maps those events ->
//      gtag('consent','update', …) and loads the trackers.
//
// Category mapping (Cookiebot -> Consent Mode v2):
//   statistics -> analytics_storage   (GA4 + GTM + Contentsquare)
//   marketing  -> ad_storage, ad_user_data, ad_personalization

const GA4_ID = "G-ZNEKVH2ETY";
const GTM_ID = "GTM-MNZHRZ79";
const CS_SRC = "https://t.contentsquare.net/uxa/2fe350eb44674.js";
// Travelpayouts Drive affiliate loader. Sets persistent cookies/localStorage
// (am_user_session, storage_f, …) so it's a marketing-tier tracker, not
// strictly necessary — load only after marketing consent is granted.
const TRAVELPAYOUTS_SRC = "https://emrldtp.cc/NTM1Mzc0.js?t=535374";
// GetYourGuide Partner Analytics — attribution/conversion tracker (sets cookies),
// so marketing-tier: loaded only after marketing consent, alongside Travelpayouts.
const GETYOURGUIDE_SRC = "https://widget.getyourguide.com/dist/pa.umd.production.min.js";
const GETYOURGUIDE_PARTNER_ID = "E2JIZZL";

type CookiebotConsent = {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
};

declare global {
  interface Window {
    Cookiebot?: { consent: CookiebotConsent };
  }
}

let analyticsLoaded = false;
let affiliateLoaded = false;

// `dataLayer`'s element type is declared in analytics-events.ts; access it
// untyped here to push gtag command tuples and GTM init events without clashing.
function dataLayer(): unknown[] {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  return w.dataLayer;
}

function gtag(..._args: unknown[]) {
  // Google Consent Mode requires the raw `arguments` object on the dataLayer,
  // not a plain array — gtag.js reads it positionally.
  // eslint-disable-next-line prefer-rest-params
  dataLayer().push(arguments);
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
  if (typeof window === "undefined" || analyticsLoaded) return;
  analyticsLoaded = true;

  // GA4
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);
  gtag("js", new Date());
  gtag("config", GA4_ID);

  // GTM
  if (!document.querySelector(`script[data-gtm="${GTM_ID}"]`)) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    s.setAttribute("data-gtm", GTM_ID);
    document.head.appendChild(s);
    dataLayer().push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  }

  // Contentsquare
  injectScript(CS_SRC);
}

// Affiliate loaders — marketing-tier, loaded only on consent.
export function loadAffiliate() {
  if (typeof window === "undefined" || affiliateLoaded) return;
  affiliateLoaded = true;
  injectScript(TRAVELPAYOUTS_SRC);
  // GetYourGuide Partner Analytics (data-gyg-partner-id drives attribution).
  injectScript(GETYOURGUIDE_SRC, {
    defer: true,
    "data-gyg-partner-id": GETYOURGUIDE_PARTNER_ID,
  });
}

function applyConsent(consent: CookiebotConsent) {
  const statistics = consent.statistics ? "granted" : "denied";
  const marketing = consent.marketing ? "granted" : "denied";

  gtag("consent", "update", {
    analytics_storage: statistics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  });

  // GTM/GA4/Contentsquare are statistics-tier trackers. GTM itself further
  // honours Consent Mode for any downstream marketing tags.
  if (consent.statistics) loadAnalytics();

  // Travelpayouts affiliate loader is marketing-tier (sets persistent cookies).
  if (consent.marketing) loadAffiliate();
}

// Bridge Cookiebot -> Consent Mode. Call once on app mount (client only).
export function initCookiebotConsent() {
  if (typeof window === "undefined") return;

  const apply = () => {
    if (window.Cookiebot?.consent) applyConsent(window.Cookiebot.consent);
  };

  // Returning visitors: Cookiebot may have already restored a stored response
  // (and fired its event) before this listener attached — apply immediately.
  apply();

  // First visit + subsequent changes via the banner / "renew consent" link.
  window.addEventListener("CookiebotOnConsentReady", apply);
  window.addEventListener("CookiebotOnAccept", apply);
  window.addEventListener("CookiebotOnDecline", apply);
}
