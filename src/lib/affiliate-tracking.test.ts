import { describe, it, expect } from "vitest";
import { affiliatePartnerFor } from "@/lib/affiliate-tracking";

// Guards the single source of truth used both for GA4 click tracking and for
// the article rel="sponsored" decision (trips.$slug.tsx). A partner slipping
// back to null means a paid link ships without rel="sponsored" AND its click
// goes uncounted — so these cases are revenue-load-bearing.
describe("affiliatePartnerFor", () => {
  it("matches Booking.com and its CJ redirect domains", () => {
    expect(affiliatePartnerFor("https://www.booking.com/searchresults.html?ss=Ubud")).toBe(
      "booking",
    );
    expect(affiliatePartnerFor("https://www.jdoqocy.com/click-101767380-11891539?url=x")).toBe(
      "booking",
    );
  });

  it("matches Viator regardless of pid", () => {
    expect(affiliatePartnerFor("https://www.viator.com/tours/Bali/x?pid=P0099&mcid=42383")).toBe(
      "viator",
    );
  });

  it("matches GetYourGuide with any partner_id, and the legacy gygaff domain", () => {
    expect(affiliatePartnerFor("https://www.getyourguide.com/s/?q=komodo&partner_id=E2JIZZL")).toBe(
      "getyourguide",
    );
    expect(affiliatePartnerFor("https://gygaff.com/xyz")).toBe("getyourguide");
  });

  it("matches 12Go deep links (path form), not just the query form", () => {
    expect(affiliatePartnerFor("https://12go.asia/en/travel/bali/lombok?z=123")).toBe("12go");
  });

  it("matches Travelpayouts smart links and names the partner by subdomain", () => {
    expect(affiliatePartnerFor("https://airalo.tpx.lu/abc")).toBe("airalo");
    expect(affiliatePartnerFor("https://ektatraveling.tpx.lu/abc")).toBe("ekta");
  });

  it("matches stay22", () => {
    expect(affiliatePartnerFor("https://www.stay22.com/embed/x")).toBe("stay22");
  });

  it("returns null for non-affiliate links", () => {
    expect(affiliatePartnerFor("https://en.wikipedia.org/wiki/Bali")).toBeNull();
    expect(affiliatePartnerFor("https://www.google.com/maps")).toBeNull();
  });
});
