import { beforeEach, describe, expect, it, vi } from "vitest";

// Guards the migration off Cookiebot: the self-hosted store must produce EXACTLY
// the consent behaviour the CMP gave us — nothing fires before a choice, GA4 only
// after statistics, affiliate trackers only after marketing.
//
// analytics-consent.ts guards each loader with a module-level "already loaded"
// flag (load once per page). Reset the module graph before every test so those
// flags don't leak across cases; import both modules fresh inside each test.

type ConsentMod = typeof import("@/lib/consent");
type BridgeMod = typeof import("@/lib/analytics-consent");

async function load(): Promise<ConsentMod & Pick<BridgeMod, "initConsent">> {
  const consent = await import("@/lib/consent");
  const bridge = await import("@/lib/analytics-consent");
  return { ...consent, initConsent: bridge.initConsent };
}

const CONSENT_KEY = "cookie-consent-v1";

function ga4Loaded() {
  return !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
}
function affiliateLoaded() {
  return !!document.querySelector('script[src*="emrldtp.cc"]');
}
function consentUpdates() {
  const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
  return dl
    .map((row) =>
      typeof row === "object" && row !== null ? Array.from(row as ArrayLike<unknown>) : [],
    )
    .filter((args) => args[0] === "consent" && args[1] === "update")
    .map((args) => args[2] as Record<string, string>);
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
  document.querySelectorAll("script").forEach((s) => s.remove());
});

describe("consent store", () => {
  it("has no decision and denies everything until the visitor chooses", async () => {
    const { hasConsentDecision, getConsentCategories, hasStatisticsConsent, hasMarketingConsent } =
      await load();
    expect(hasConsentDecision()).toBe(false);
    expect(getConsentCategories()).toEqual({ statistics: false, marketing: false });
    expect(hasStatisticsConsent()).toBe(false);
    expect(hasMarketingConsent()).toBe(false);
  });

  it("persists a versioned, timestamped record with a proof-of-consent timestamp", async () => {
    const { saveConsent, readConsent } = await load();
    saveConsent({ statistics: true, marketing: false });
    const raw = JSON.parse(localStorage.getItem(CONSENT_KEY)!);
    expect(raw.version).toBe(1);
    expect(raw.statistics).toBe(true);
    expect(raw.marketing).toBe(false);
    expect(typeof raw.timestamp).toBe("string");
    expect(readConsent()).toMatchObject({ statistics: true, marketing: false });
  });

  it("ignores a record written by an older schema version (re-prompts)", async () => {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ version: 0, statistics: true, marketing: true }),
    );
    const { hasConsentDecision, getConsentCategories } = await load();
    expect(hasConsentDecision()).toBe(false);
    expect(getConsentCategories()).toEqual({ statistics: false, marketing: false });
  });

  it("broadcasts a consent-change event on save", async () => {
    const { rejectAllConsent } = await load();
    const seen: unknown[] = [];
    const handler = (e: Event) => seen.push((e as CustomEvent).detail);
    window.addEventListener("ei:consentchange", handler);
    rejectAllConsent();
    window.removeEventListener("ei:consentchange", handler);
    expect(seen).toHaveLength(1);
    expect(seen[0]).toMatchObject({ statistics: false, marketing: false });
  });
});

describe("consent -> Google Consent Mode bridge (initConsent)", () => {
  it("loads nothing before a decision exists", async () => {
    const { initConsent } = await load();
    initConsent();
    expect(ga4Loaded()).toBe(false);
    expect(affiliateLoaded()).toBe(false);
    // No premature consent update — Consent Mode stays at its denied default.
    expect(consentUpdates()).toHaveLength(0);
  });

  it("grants analytics_storage and loads GA4 (only) when statistics is accepted", async () => {
    const { initConsent, saveConsent } = await load();
    initConsent();
    saveConsent({ statistics: true, marketing: false });
    const last = consentUpdates().at(-1)!;
    expect(last.analytics_storage).toBe("granted");
    expect(last.ad_storage).toBe("denied");
    expect(last.ad_user_data).toBe("denied");
    expect(last.ad_personalization).toBe("denied");
    expect(ga4Loaded()).toBe(true);
    expect(affiliateLoaded()).toBe(false);
  });

  it("grants ad_* and loads affiliate trackers when marketing is accepted", async () => {
    const { initConsent, saveConsent } = await load();
    initConsent();
    saveConsent({ statistics: false, marketing: true });
    const last = consentUpdates().at(-1)!;
    expect(last.ad_storage).toBe("granted");
    expect(last.ad_user_data).toBe("granted");
    expect(last.ad_personalization).toBe("granted");
    expect(affiliateLoaded()).toBe(true);
  });

  it("Accept all grants both and loads everything; Reject all keeps all denied", async () => {
    const { initConsent, acceptAllConsent, rejectAllConsent } = await load();
    initConsent();
    acceptAllConsent();
    let last = consentUpdates().at(-1)!;
    expect(last).toEqual({
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    expect(ga4Loaded()).toBe(true);
    expect(affiliateLoaded()).toBe(true);

    rejectAllConsent();
    last = consentUpdates().at(-1)!;
    expect(last).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("applies a stored decision on mount for returning visitors", async () => {
    const first = await load();
    first.saveConsent({ statistics: true, marketing: true });
    // Simulate a fresh page load: clear the DOM/dataLayer and reset module state
    // so the loader guards start fresh, then re-import and mount.
    (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
    document.querySelectorAll("script").forEach((s) => s.remove());
    vi.resetModules();
    const { initConsent } = await load();
    initConsent();
    expect(ga4Loaded()).toBe(true);
    expect(affiliateLoaded()).toBe(true);
    expect(consentUpdates().at(-1)!.analytics_storage).toBe("granted");
  });
});
