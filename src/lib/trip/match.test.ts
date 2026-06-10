import { afterEach, describe, expect, it, vi } from "vitest";
import { matchItem } from "@/lib/trip/match.server";
import { buildDeepLink } from "@/lib/trip/affiliates.server";
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

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
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

  it("accommodation has no fallback partner — no_match without Booking API", async () => {
    const result = await matchItem(
      item({ category: "accommodation", searchQuery: "Ubud jungle resort" }),
    );
    expect(result.matchStatus).toBe("no_match");
    expect(result.partner).toBeUndefined();
  });

  it("viator match uses the API's productUrl (carries tracking) and live price", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              products: {
                results: [
                  {
                    productCode: "5010BALI",
                    title: "Mount Batur Sunrise Trek",
                    productUrl: "https://www.viator.com/tours/5010BALI?pid=P00012345",
                    pricing: { summary: { fromPrice: 38 }, currency: "USD" },
                  },
                ],
              },
            }),
            { status: 200 },
          ),
      ),
    );
    const result = await matchItem(item({ searchQuery: "Mount Batur sunrise trek" }));
    expect(result.partner).toBe("viator");
    expect(result.matchStatus).toBe("matched");
    expect(result.deepLink).toBe("https://www.viator.com/tours/5010BALI?pid=P00012345");
    expect(result.price).toBe(38);
  });

  it("activity falls back to a GetYourGuide search deep-link when Viator has no match", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    vi.stubEnv("GETYOURGUIDE_PARTNER_ID", "E2JIZZL");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () => new Response(JSON.stringify({ products: { results: [] } }), { status: 200 }),
      ),
    );
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
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () => new Response(JSON.stringify({ products: { results: [] } }), { status: 200 }),
      ),
    );
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
