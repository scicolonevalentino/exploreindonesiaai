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

describe("buildDeepLink", () => {
  it("interpolates affiliate IDs from env, never hardcoded", () => {
    vi.stubEnv("VIATOR_AFFILIATE_ID", "P00099999");
    expect(buildDeepLink("viator", "5010SYDNEY")).toBe(
      "https://www.viator.com/tours/5010SYDNEY?pid=P00099999&mcid=42383&medium=api",
    );
    vi.stubEnv("AIRALO_AFFILIATE_ID", "air123");
    expect(buildDeepLink("airalo", "indonesia-esim")).toBe(
      "https://www.airalo.com/indonesia-esim?partner=air123",
    );
  });

  it("returns null when the affiliate ID env var is missing", () => {
    vi.stubEnv("KLOOK_AFFILIATE_ID", "");
    expect(buildDeepLink("klook", "12345")).toBeNull();
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

  it("esim always matches Airalo with the static link when the ID is set", async () => {
    vi.stubEnv("AIRALO_AFFILIATE_ID", "air123");
    const result = await matchItem(item({ category: "esim", searchQuery: "indonesia esim" }));
    expect(result.matchStatus).toBe("matched");
    expect(result.partner).toBe("airalo");
    expect(result.deepLink).toContain("partner=air123");
  });

  it("ferry on a known route matches 12Go", async () => {
    vi.stubEnv("TWELVEGO_AFFILIATE_ID", "tg123");
    const result = await matchItem(
      item({
        category: "ferry_transport",
        searchQuery: "fast boat Sanur to Nusa Penida",
        location: "Sanur, Bali",
      }),
    );
    expect(result.matchStatus).toBe("matched");
    expect(result.deepLink).toBe("https://12go.asia/en/travel/sanur/nusa-penida?ref=tg123");
  });

  it("ferry on an unknown remote route is no_match 'arrange locally' — never a fallback link", async () => {
    vi.stubEnv("TWELVEGO_AFFILIATE_ID", "tg123");
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

  it("activity falls back from Viator to Klook when Viator has no key", async () => {
    vi.stubEnv("KLOOK_API_KEY", "k-key");
    vi.stubEnv("KLOOK_AFFILIATE_ID", "k-aff");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              activities: [
                {
                  activity_id: 777,
                  title: "Mount Batur Sunrise",
                  sell_price: "35",
                  currency: "USD",
                },
              ],
            }),
            { status: 200 },
          ),
      ),
    );
    const result = await matchItem(item({ searchQuery: "Mount Batur sunrise trek" }));
    expect(result.partner).toBe("klook");
    expect(result.matchStatus).toBe("matched");
    expect(result.deepLink).toBe("https://www.klook.com/activity/777/?aid=k-aff");
    expect(result.price).toBe(35);
  });

  it("survives partner API failure gracefully as no_match", async () => {
    vi.stubEnv("VIATOR_API_KEY", "v-key");
    vi.stubEnv("VIATOR_AFFILIATE_ID", "v-aff");
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
