import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  OPEN_SETTINGS_EVENT,
  acceptAllConsent,
  getConsentCategories,
  hasConsentDecision,
  rejectAllConsent,
  saveConsent,
} from "@/lib/consent";

// Self-hosted consent banner (replaces Cookiebot's UI). Same behaviour as the
// CMP it replaces: shown on first visit, blocks nothing on its own — the actual
// gating lives in analytics-consent.ts, which reacts to the choice saved here.
//
// Re-openable from the footer "Cookie settings" link via OPEN_SETTINGS_EVENT.

function Toggle({
  id,
  checked,
  disabled,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: checked ? "var(--blue-bright)" : "#cbd5cf",
      }}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function CategoryRow({
  id,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="block text-sm font-semibold"
          style={{ color: "var(--text-dark)" }}
        >
          {title}
        </label>
        <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--navy-mid)" }}>
          {description}
        </p>
      </div>
      <Toggle id={id} checked={checked} disabled={disabled} onChange={onChange} label={title} />
    </div>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // First visit (no stored decision): show the banner in its compact form.
    if (!hasConsentDecision()) setVisible(true);

    // Footer "Cookie settings" link re-opens it, pre-filled with the current
    // choice and expanded to the granular panel.
    const open = () => {
      const c = getConsentCategories();
      setStatistics(c.statistics);
      setMarketing(c.marketing);
      setDetails(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    setDetails(false);
  };
  const onAcceptAll = () => {
    acceptAllConsent();
    close();
  };
  const onRejectAll = () => {
    rejectAllConsent();
    close();
  };
  const onSave = () => {
    saveConsent({ statistics, marketing });
    close();
  };

  const secondaryBtn =
    "w-full sm:w-auto whitespace-nowrap px-4 py-2.5 rounded-md text-sm font-semibold border transition-colors hover:bg-black/5";
  const primaryBtn =
    "w-full sm:w-auto whitespace-nowrap px-4 py-2.5 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie preferences"
      className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4"
    >
      <div
        className="mx-auto max-w-3xl rounded-2xl shadow-2xl border p-4 sm:p-5"
        style={{ backgroundColor: "#ffffff", borderColor: "var(--border-cream)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-dark)" }}>
          We use cookies to measure traffic and improve the site (Google Analytics, Contentsquare)
          and to attribute travel bookings. Nothing non-essential fires until you choose. Read our{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-2 font-medium"
            style={{ color: "var(--teal-link)" }}
          >
            Privacy Policy
          </Link>
          .
        </p>

        {details && (
          <div className="mt-3 divide-y" style={{ borderColor: "var(--border-cream)" }}>
            <CategoryRow
              id="consent-necessary"
              title="Strictly necessary"
              description="Required for the site to work (page routing, security, your saved choices). Always on."
              checked
              disabled
            />
            <CategoryRow
              id="consent-statistics"
              title="Statistics"
              description="Google Analytics 4, Google Tag Manager and Contentsquare — anonymous traffic and usage measurement."
              checked={statistics}
              onChange={setStatistics}
            />
            <CategoryRow
              id="consent-marketing"
              title="Marketing"
              description="Travel affiliate attribution (Travelpayouts, GetYourGuide) so partners can credit bookings you make."
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
          {!details && (
            <button
              type="button"
              onClick={() => {
                const c = getConsentCategories();
                setStatistics(c.statistics);
                setMarketing(c.marketing);
                setDetails(true);
              }}
              className="text-sm font-medium underline underline-offset-2 sm:mr-auto text-left px-1 py-1"
              style={{ color: "var(--teal-link)" }}
            >
              Customize
            </button>
          )}
          {/* Mobile: compact = 2 buttons side by side; Customize = 3 buttons
              stacked full-width (avoids cramped 3-across wrapping). sm+: inline row. */}
          <div
            className={`grid ${details ? "grid-cols-1" : "grid-cols-2"} gap-2 sm:flex sm:w-auto sm:ml-auto`}
          >
            <button
              type="button"
              onClick={onRejectAll}
              className={secondaryBtn}
              style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
            >
              Reject all
            </button>
            {details ? (
              <button
                type="button"
                onClick={onSave}
                className={secondaryBtn}
                style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
              >
                Save choices
              </button>
            ) : null}
            <button
              type="button"
              onClick={onAcceptAll}
              className={primaryBtn}
              style={{ backgroundColor: "var(--blue-bright)" }}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
