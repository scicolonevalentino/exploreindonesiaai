// Self-hosted cookie consent store — replaces the Cookiebot / Usercentrics CMP.
//
// The visitor's category choices live in localStorage under `cookie-consent-v1`
// and every change is broadcast on a `CONSENT_EVENT` window event. Two other
// modules build on this store:
//   - analytics-consent.ts bridges the choices onto Google Consent Mode v2 and
//     lazy-loads GA4 / GTM / Contentsquare / affiliate trackers.
//   - CookieConsent.tsx renders the banner UI and writes decisions here.
//
// Category -> Consent Mode v2 mapping:
//   statistics -> analytics_storage                       (GA4 + GTM + Contentsquare)
//   marketing  -> ad_storage / ad_user_data / ad_personalization
//                 (+ Travelpayouts & GetYourGuide affiliate loaders)
// "necessary" cookies are implicit and always on — we never gate essential
// behaviour, so there is no toggle to store for it.

export const CONSENT_KEY = "cookie-consent-v1";

// Bump when the category set or its meaning changes: a record written by an
// older version is treated as "no decision" so the banner re-prompts.
export const CONSENT_VERSION = 1;

// Dispatched on `window` whenever the stored decision changes (save / accept /
// reject). Listen to re-apply Consent Mode and (re)load trackers.
export const CONSENT_EVENT = "ei:consentchange";

// Dispatched on `window` to ask the banner to re-open (footer "Cookie settings"
// link). The banner mounts a listener for it.
export const OPEN_SETTINGS_EVENT = "ei:opencookiesettings";

export type ConsentCategories = {
  statistics: boolean;
  marketing: boolean;
};

export type StoredConsent = ConsentCategories & {
  version: number;
  // ISO timestamp of the decision — our proof-of-consent record.
  timestamp: string;
};

const DENY_ALL: ConsentCategories = { statistics: false, marketing: false };
const GRANT_ALL: ConsentCategories = { statistics: true, marketing: true };

// Read the stored decision, or null when none exists / it's from an older
// version / storage is unavailable.
export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      statistics: !!parsed.statistics,
      marketing: !!parsed.marketing,
      timestamp: typeof parsed.timestamp === "string" ? parsed.timestamp : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// True once the visitor has made an explicit choice for the current version.
export function hasConsentDecision(): boolean {
  return readConsent() !== null;
}

// Effective categories — everything denied until an explicit decision exists.
export function getConsentCategories(): ConsentCategories {
  const stored = readConsent();
  return stored ? { statistics: stored.statistics, marketing: stored.marketing } : { ...DENY_ALL };
}

export function hasStatisticsConsent(): boolean {
  return getConsentCategories().statistics;
}

export function hasMarketingConsent(): boolean {
  return getConsentCategories().marketing;
}

// Persist a decision and broadcast it. Storage may throw in private mode; the
// choice still applies for this page load via the event.
export function saveConsent(categories: ConsentCategories): StoredConsent {
  const record: StoredConsent = {
    version: CONSENT_VERSION,
    statistics: !!categories.statistics,
    marketing: !!categories.marketing,
    timestamp: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    } catch {
      // Private mode / storage disabled — nothing to persist, event still fires.
    }
    window.dispatchEvent(new CustomEvent<StoredConsent>(CONSENT_EVENT, { detail: record }));
  }
  return record;
}

export const acceptAllConsent = () => saveConsent(GRANT_ALL);
export const rejectAllConsent = () => saveConsent(DENY_ALL);

// Subscribe to consent changes; returns an unsubscribe fn.
export function onConsentChange(cb: (c: StoredConsent) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<StoredConsent>).detail);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

// Ask the banner to re-open (footer "Cookie settings" link). Safe to call
// whether or not a decision already exists.
export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
