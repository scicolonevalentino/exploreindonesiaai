import { describe, it, expect } from "vitest";
import {
  buildBookingLink,
  buildBookingSearchUrl,
  bookingSid,
  wrapCjBookingUrl,
  normalizeBookingHref,
  isBookingLink,
  CJ_CLICK_BASE,
} from "@/lib/booking";

// Pull the decoded inner booking.com URL out of a CJ click link.
function innerUrl(cjLink: string): URL {
  const raw = new URL(cjLink).searchParams.get("url");
  if (!raw) throw new Error(`no url= param in ${cjLink}`);
  return new URL(raw); // searchParams.get already percent-decodes once
}
function sidOf(cjLink: string): string | null {
  return new URL(cjLink).searchParams.get("sid");
}

describe("bookingSid", () => {
  it("formats exploreindonesia_<destination>_<context>", () => {
    expect(bookingSid("Bali", "article")).toBe("exploreindonesia_bali_article");
    expect(bookingSid("Labuan Bajo", "trip-planner")).toBe(
      "exploreindonesia_labuan-bajo_trip-planner",
    );
  });
  it("drops empty segments", () => {
    expect(bookingSid()).toBe("exploreindonesia");
    expect(bookingSid("Bali")).toBe("exploreindonesia_bali");
    expect(bookingSid(undefined, "article")).toBe("exploreindonesia_article");
  });
});

describe("buildBookingSearchUrl", () => {
  it("biases a free-text place toward Indonesia and sets default occupancy", () => {
    const u = new URL(buildBookingSearchUrl("Sumba"));
    expect(u.origin + u.pathname).toBe("https://www.booking.com/searchresults.html");
    expect(u.searchParams.get("ss")).toBe("Sumba, Indonesia");
    expect(u.searchParams.get("group_adults")).toBe("2");
    expect(u.searchParams.get("group_children")).toBe("0");
    expect(u.searchParams.get("no_rooms")).toBe("1");
  });

  it("uses the curated registry ss for known destinations", () => {
    expect(new URL(buildBookingSearchUrl("Komodo")).searchParams.get("ss")).toBe(
      "Labuan Bajo, Indonesia",
    );
    expect(new URL(buildBookingSearchUrl("Ubud")).searchParams.get("ss")).toBe(
      "Ubud, Bali, Indonesia",
    );
  });

  it("maps dates, guests, rooms and currency to Booking.com params", () => {
    const u = new URL(
      buildBookingSearchUrl("Ubud", {
        checkIn: "2026-08-01",
        checkOut: "2026-08-05",
        adults: 3,
        children: 2,
        rooms: 2,
        currency: "USD",
      }),
    );
    expect(u.searchParams.get("checkin")).toBe("2026-08-01");
    expect(u.searchParams.get("checkout")).toBe("2026-08-05");
    expect(u.searchParams.get("group_adults")).toBe("3");
    expect(u.searchParams.get("group_children")).toBe("2");
    expect(u.searchParams.getAll("age")).toEqual(["8", "8"]); // one age per child
    expect(u.searchParams.get("no_rooms")).toBe("2");
    expect(u.searchParams.get("selected_currency")).toBe("USD");
  });

  it("uses dest_id + dest_type for a numeric destination", () => {
    const u = new URL(buildBookingSearchUrl(900040094));
    expect(u.searchParams.get("dest_id")).toBe("900040094");
    expect(u.searchParams.get("dest_type")).toBe("city");
    expect(u.searchParams.get("ss")).toBeNull();
  });
});

describe("buildBookingLink", () => {
  it("wraps the booking URL in the CJ click base with an encoded url= and a SID", () => {
    const link = buildBookingLink("Ubud", { context: "trip-planner" });
    expect(link.startsWith(`${CJ_CLICK_BASE}?`)).toBe(true);
    expect(sidOf(link)).toBe("exploreindonesia_ubud_trip-planner");
    const inner = innerUrl(link);
    expect(inner.hostname).toBe("www.booking.com");
    expect(inner.searchParams.get("ss")).toBe("Ubud, Bali, Indonesia");
    // The encoded url= must not leak raw inner separators into the outer query.
    const outerQuery = link.slice(link.indexOf("?") + 1);
    expect(outerQuery.split("&").length).toBe(2); // exactly sid=... and url=...
  });

  it("accepts an explicit SID override", () => {
    const link = buildBookingLink("Bali", { sid: "custom_sid_123" });
    expect(sidOf(link)).toBe("custom_sid_123");
  });
});

describe("wrapCjBookingUrl", () => {
  it("matches the Welcome Pack structure: ?sid=...&url=<encoded>", () => {
    const link = wrapCjBookingUrl("https://www.booking.com/x.html?a=1&b=2", "exploreindonesia_x");
    expect(link).toBe(
      `${CJ_CLICK_BASE}?sid=exploreindonesia_x&url=${encodeURIComponent(
        "https://www.booking.com/x.html?a=1&b=2",
      )}`,
    );
  });
});

describe("normalizeBookingHref", () => {
  it("upgrades a bare Booking.com homepage link to a destination search using the hint", () => {
    const out = normalizeBookingHref("https://www.booking.com/", {
      destinationHint: "Bali",
      context: "article",
    });
    expect(out).not.toBeNull();
    expect(sidOf(out!)).toBe("exploreindonesia_bali_article");
    expect(innerUrl(out!).searchParams.get("ss")).toBe("Bali, Indonesia");
  });

  it("wraps a direct Booking.com destination link and keeps its target", () => {
    const out = normalizeBookingHref(
      "https://www.booking.com/searchresults.html?ss=Ubud%2C%20Bali",
      { context: "article" },
    );
    expect(out!.startsWith(CJ_CLICK_BASE)).toBe(true);
    expect(innerUrl(out!).searchParams.get("ss")).toBe("Ubud, Bali");
    expect(sidOf(out!)).toBe("exploreindonesia_ubud-bali_article");
  });

  it("re-wraps an already-CJ-wrapped booking link onto our click base", () => {
    const out = normalizeBookingHref(
      "https://www.tkqlhce.com/click-PID11795693?url=https://www.booking.com/hotel/id/x.html",
      { context: "article" },
    );
    expect(out!.startsWith(CJ_CLICK_BASE)).toBe(true);
    expect(innerUrl(out!).hostname).toBe("www.booking.com");
  });

  it("returns null for non-Booking links (leave them untouched)", () => {
    expect(normalizeBookingHref("https://www.viator.com/tours/x")).toBeNull();
    expect(normalizeBookingHref("https://12go.asia/?z=123")).toBeNull();
    // CJ link pointing at a different advertiser is not ours to rewrite.
    expect(
      normalizeBookingHref("https://www.tkqlhce.com/click-PID1?url=https://www.agoda.com/x"),
    ).toBeNull();
    expect(normalizeBookingHref("not a url")).toBeNull();
  });
});

describe("isBookingLink", () => {
  it("recognises direct and CJ-wrapped booking links", () => {
    expect(isBookingLink("https://www.booking.com/searchresults.html?ss=Bali")).toBe(true);
    expect(
      isBookingLink("https://www.jdoqocy.com/click-101767380-11891539?url=https://booking.com/x"),
    ).toBe(true);
    expect(isBookingLink("https://www.viator.com/x")).toBe(false);
  });
});
