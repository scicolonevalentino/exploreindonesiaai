// Best-effort capture of the trip prompt people submit, for product insight
// (what trips are folks asking for?). Sends a fire-and-forget GET beacon to a
// Google Apps Script web app (doGet) that appends a row to a Google Sheet.
//
// Privacy: only fires AFTER Cookiebot "statistics" consent is granted (the
// prompt is free text and may contain personal details), truncates to 2000
// chars, and never throws. An <img> beacon is used so there is no CORS read.

const CAPTURE_URL =
  "https://script.google.com/macros/s/AKfycbxzLezZiEor-vzjsdanpjvIsKAYaMU9aN3Dpw2_M5Df7PIgiZgYLcjuZ2y6bFLmJDLK/exec";

function hasStatisticsConsent(): boolean {
  try {
    const cb = (window as unknown as { Cookiebot?: { consent?: { statistics?: boolean } } })
      .Cookiebot;
    return !!cb?.consent?.statistics;
  } catch {
    return false;
  }
}

function sessionId(): string {
  try {
    const key = "ei_capture_sid";
    let s = localStorage.getItem(key);
    if (!s) {
      s = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(key, s);
    }
    return s;
  } catch {
    return "no-session";
  }
}

// Log the submitted prompt. No-op without analytics consent, empty input, or on
// the server. Never blocks or breaks the build flow.
export function capturePrompt(text: string): void {
  try {
    if (typeof window === "undefined") return;
    const t = (text || "").trim();
    if (!t || !hasStatisticsConsent()) return;
    const params = new URLSearchParams({
      sessionId: sessionId(),
      pastedText: t.slice(0, 2000),
      referrer: document.referrer || "",
      pageUrl: location.href,
    });
    new Image().src = `${CAPTURE_URL}?${params.toString()}`;
  } catch {
    // Capture is best-effort; never surface errors to the user.
  }
}
