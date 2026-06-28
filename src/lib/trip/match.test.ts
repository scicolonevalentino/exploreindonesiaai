import { afterEach, describe, expect, it, vi } from "vitest";
import { matchItem } from "@/lib/trip/match.server";
import { buildDeepLink, __resetViatorDestinationCache } from "@/lib/trip/affiliates.server";
import type { ItineraryItem } from "@/lib/trip/types";

function item(overrides: Partial<ItineraryItem>): ItineraryItem {
  return {
    day: 1,
    type: "bookable",
    category: "activity",
    title: "Test",
    description: "Test",
    location: "Bali",
    searchQuery: "test",
    matchStatus: "pending",
    ...overrides,
  };
}

// Viator now calls TWO endpoints: the destination taxonomy + the freetext
// search. This mock routes by URL. The taxonomy marks Ubud (5467) Indonesian
// (lookupId contains ".15.") and Hoi An (5229) foreign.
function mockViator(freetextResults: unknown[]) {
  return vi.fn(async (url: string) => {
    if (String(url).includes("/partner/destinations")) {
      return new Response(
        JSON.stringify({
          destinations: [
            { destinationId: 5467, lookupId: "2.15.98.5467" }, // Ubud, Indonesia
            { destinationId: 5229, lookupId: "2.21.765.5229" }, // Hoi An, Vietnam
          ],
        }),
        { status: 200 },
      );
    }
    return new Response(JSON.stringify({ products: { results: freetextResults } }), {
      status: 200,
    });
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  __resetViatorDestinationCache();
});

describe("buildDeepLink (fallback construction)", () => {
  it("interpolates the Viator pid from env, never hardcoded", () => {
    vi.stubEnv("VIATOR_AFFILIATE_ID", "P00099999");
    expect(buildDeepLink("viator", "5010SYDNEY")).toBe(
      "https://www.viator.com/tours/5010SYDNEY?pid=P00099999&mcid=42383&medium=api",
    );
  });

  it("returns null when the env var is missing", () => {
    vi.stubEnv("VIATOR_AFFILIATE_ID", "");
    expect(buildDeepLink("viator", "12345")).toBeNull();
  });

  it("Travelpayouts partners never construct URLs — smart link only", () => {
    expect(buildDeepLink("klook", "x")).toBeNull();
    expect(buildDeepLink("airalo", "x")).toBeNull();
    expect(buildDeepLink("12go", "x")).toBeNull();
    expect(buildDeepLink("welcomepickups", "x")).toBeNull();
  });
});

describe("matchItem routing rules", () => {
  it("on_demand_transport is always informational, even if generated as bookable", async () => {
    const result = await matchItem(item({ category: "on_demand_transport", type: "bookable" }));
    expect(result.type).toBe("informational");
    expect(result.deepLink).toBeUndefined();
    expect(result.matchStatus).toBe("no_match");
  });

  it("tip is always informational", async () => {
    const result = await matchItem(item({ category: "tip", type: "bookable" }));
    expect(result.type).toBe("informational");
    expect(result.deepLink).toBeUndefined();
  });

  it("esim always matches the Airalo Travelpayouts smart link when configured", async () => {
    vi.stubEnv("AIRALO_AFFILIATE_LINK", "https://airalo.tpx.lu/test");
    const result = await matchItem(item({ category: "esim", searchQuery: "indonesia esim" }));
    expect(result.matchStatus).toBe("matched");
    expect(result.partner).toBe("airalo");
    expect(result.deepLink).toBe("https://airalo.tpx.lu/test");
  });

  it("ferry on a known route deep-links to the 12Go route page with the z code", async () => {
    vi.stubEnv("TWELVEGO_AFFILIATE_Z", "16022946");
    const result = await matchItem(
      item({
        category: "ferry_transport",
        searchQuery: "fast boat Sanur to Nusa Penida",
        location: "Sanur, Bali",
      }),
    );
    expect(result.matchStatus).toBe("matched");
    expect(result.deepLink).toBe("https://12go.asia/en/travel/sanur/nusa-penida?z=16022946");
  });

  it("ferry on an unknown remote route is no_match 'arrange locally' — even with the code set", async () => {
    vi.stubEnv("TWELVEGO_AFFILIATE_Z", "16022946");
    const result = await matchItem(
      item({
        category: "ferry_transport",
        searchQuery: "boat to remote Banda islands",
        location: "Maluku",
      }),
    );
    expect(result.matchStatus).toBe("no_match");
    expect(result.noMatchReason).toBe("arrange locally");
    expect(result.deepLink).toBeUndefined();
  });

  it("accommodation deep-links to a CJ-tracked Booking.com search for the location", async () => {
    const result = await matchItem(
      item({
        day: 2,
        category: "accommodation",
        searchQuery: "Ubud jungle resort",
        location: "Ubud",
      }),
    );
    expect(result.matchStatus).toBe("matched");
    expect(result.partner).toBe("booking");
    // CJ click wrapper, our day-level SID, and the booking.com target in ?url=.
    expect(result.deepLink).toContain("jdoqocy.com/click-101767380-11891539");
    expect(result.deepLink).toContain("sid=exploreindonesia_ubud_trip-planner-day2");
    expect(result.deepLink).toContain("url=https%3A%2F%2Fwww.booking.com%2Fsearchresults");
  });

  it("accommodation SID is day-specific — same place on different days tracks separately", async () => {
    const day1 = await matchItem(
      item({ day: 1, category: "accommodation", searchQuery: "Ubud stay", location: "Ubud" }),
    );
    const day5 = await matchItem(
      item({ day: 5, category: "accommodation", searchQuery: "Ubud stay", location: "Ubud" }),
    );
    expect(day1.deepLink).toContain("sid=exploreindonesia_ubud_trip-planner-day1");
    expect(day5.deepLink).toContain("sid=exploreindonesia_ubud_trip-planner-day5");
    expect(day1.deepLink).not.toBe(day5.deepLink);
  });

  it("viator match uses the API's productUrl (carries tracking) and live price", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    vi.stubGlobal(
      "fetch",
      mockViator([
        {
          productCode: "5010BALI",
          title: "Mount Batur Sunrise Trek",
          productUrl: "https://www.viator.com/tours/5010BALI?pid=P00012345",
          pricing: { summary: { fromPrice: 38 }, currency: "USD" },
          destinations: [{ ref: "5467", primary: true }], // Ubud, Indonesia
        },
      ]),
    );
    const result = await matchItem(item({ searchQuery: "Mount Batur sunrise trek" }));
    expect(result.partner).toBe("viator");
    expect(result.matchStatus).toBe("matched");
    expect(result.deepLink).toBe("https://www.viator.com/tours/5010BALI?pid=P00012345");
    expect(result.price).toBe(38);
  });

  it("rejects a foreign Viator result and skips to the first Indonesian one", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    vi.stubGlobal(
      "fetch",
      mockViator([
        {
          productCode: "VN-HOIAN",
          title: "Traditional Wood Carving Workshop",
          productUrl: "https://www.viator.com/tours/Hoi-An/x",
          destinations: [{ ref: "5229", primary: true }], // Hoi An, Vietnam — reject
        },
        {
          productCode: "ID-UBUD",
          title: "Ubud Craft Workshop",
          productUrl: "https://www.viator.com/tours/Ubud/x?pid=P0003",
          pricing: { summary: { fromPrice: 25 }, currency: "USD" },
          destinations: [{ ref: "5467", primary: true }], // Ubud, Indonesia — keep
        },
      ]),
    );
    const result = await matchItem(item({ searchQuery: "craft workshop" }));
    expect(result.partner).toBe("viator");
    expect(result.productId).toBe("ID-UBUD");
    expect(result.price).toBe(25);
  });

  it("falls back to GetYourGuide when EVERY Viator result is foreign", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    vi.stubEnv("GETYOURGUIDE_PARTNER_ID", "E2JIZZL");
    vi.stubGlobal(
      "fetch",
      mockViator([
        {
          productCode: "VN-HOIAN",
          title: "Traditional Wood Carving Workshop",
          productUrl: "https://www.viator.com/tours/Hoi-An/x",
          destinations: [{ ref: "5229", primary: true }], // Vietnam only
        },
      ]),
    );
    const result = await matchItem(
      item({ searchQuery: "ikat weaving workshop", location: "Sumba" }),
    );
    expect(result.partner).toBe("getyourguide");
    expect(result.deepLink).toContain("getyourguide.com");
  });

  it("activity falls back to a GetYourGuide search deep-link when Viator has no results", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    vi.stubEnv("GETYOURGUIDE_PARTNER_ID", "E2JIZZL");
    vi.stubGlobal("fetch", mockViator([]));
    const result = await matchItem(
      item({ searchQuery: "Mount Batur sunrise trek", location: "Kintamani" }),
    );
    expect(result.partner).toBe("getyourguide");
    expect(result.matchStatus).toBe("matched");
    expect(result.deepLink).toBe(
      "https://www.getyourguide.com/s/?q=Mount%20Batur%20sunrise%20trek%20Kintamani&partner_id=E2JIZZL&utm_medium=online_publisher",
    );
    expect(result.price).toBeUndefined();
  });

  it("activity falls through GetYourGuide to the Klook smart link when neither GYG nor Viator match", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    // No GETYOURGUIDE_PARTNER_ID set → GYG skipped.
    vi.stubEnv("KLOOK_AFFILIATE_LINK", "https://klook.tpx.lu/test");
    vi.stubGlobal("fetch", mockViator([]));
    const result = await matchItem(item({ searchQuery: "obscure village workshop" }));
    expect(result.partner).toBe("klook");
    expect(result.deepLink).toBe("https://klook.tpx.lu/test");
  });

  it("airport private transfer falls back to Welcome Pickups; city-to-city does not", async () => {
    vi.stubEnv("WELCOMEPICKUPS_AFFILIATE_LINK", "https://tpx.lu/test");
    const airport = await matchItem(
      item({
        category: "private_transfer",
        searchQuery: "private transfer Ngurah Rai airport to Ubud",
        location: "Denpasar",
      }),
    );
    expect(airport.partner).toBe("welcomepickups");
    expect(airport.deepLink).toBe("https://tpx.lu/test");

    const cityToCity = await matchItem(
      item({
        category: "private_transfer",
        searchQuery: "private driver Ubud to Canggu",
        location: "Bali",
      }),
    );
    expect(cityToCity.matchStatus).toBe("no_match");
  });

  it("survives partner API failure gracefully as no_match", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    const result = await matchItem(item({ searchQuery: "anything" }));
    expect(result.matchStatus).toBe("no_match");
  });
});
