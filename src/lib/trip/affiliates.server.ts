// Partner search clients + affiliate deep-link builders. Server-only.
//
// Two monetization models coexist here:
//  1. Viator — real catalog matching via their partner API: exact product,
//     live from-price, and the product URL (which carries our tracking).
//  2. Travelpayouts smart links (Klook, Welcome Pickups, Airalo, 12Go) —
//     static campaign links (tpx.lu): no product search, no price, but the
//     click is attributed and the partner site does the selling.
//
// Every partner exposes `search(query, location)` returning a ProductMatch or
// null. Partners without their env var configured return null — the matcher
// turns that into matchStatus "no_match" and the app still ships. Adding the
// env var in Vercel lights the partner up with no code change.
//
// All keys/links come from env vars only (read per-request, never at module
// scope — see config.server.ts for why).

import type { Partner } from "@/lib/trip/types";

export type ProductMatch = {
  partner: Partner;
  productId: string;
  title: string;
  price?: number;
  currency?: string;
  // Set when the partner owns the URL (Viator productUrl, Travelpayouts smart
  // links). When absent the matcher falls back to buildDeepLink().
  deepLink?: string;
};

const FETCH_TIMEOUT_MS = 8000;

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v : undefined;
}

/* ----------------------------- deep links ------------------------------- */

// Fallback URL construction for partners that don't return their own link.
export function buildDeepLink(partner: Partner, productId: string): string | null {
  switch (partner) {
    case "viator": {
      // Preferred path is the productUrl from the API response; this fallback
      // needs the affiliate pid configured.
      const pid = env("VIATOR_AFFILIATE_ID");
      if (!pid) return null;
      return `https://www.viator.com/tours/${productId}?pid=${pid}&mcid=42383&medium=api`;
    }
    case "booking": {
      const aid = env("BOOKING_AFFILIATE_ID");
      if (!aid) return null;
      return `https://www.booking.com/hotel/id/${productId}.html?aid=${aid}`;
    }
    // Travelpayouts partners are smart-link only — their search() already
    // returns the link, so there is nothing to build here.
    case "klook":
    case "12go":
    case "airalo":
    case "welcomepickups":
      return null;
  }
}

/* --------------------------- partner search ----------------------------- */

async function fetchJson(url: string, init: RequestInit): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // Network error / timeout — treat as no match, never crash the trip.
    return null;
  }
}

// Viator Partner API free-text search. Requires VIATOR_API_KEY (exp-api-key).
async function searchViator(query: string, location: string): Promise<ProductMatch | null> {
  const apiKey = env("VIATOR_API_KEY");
  if (!apiKey) return null;

  const data = (await fetchJson("https://api.viator.com/partner/search/freetext", {
    method: "POST",
    headers: {
      "exp-api-key": apiKey,
      "Accept-Language": "en-US",
      Accept: "application/json;version=2.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searchTerm: `${query} ${location}`,
      currency: "USD",
      searchTypes: [{ searchType: "PRODUCTS", pagination: { start: 1, count: 1 } }],
    }),
  })) as {
    products?: {
      results?: Array<{
        productCode: string;
        title: string;
        productUrl?: string;
        pricing?: { summary?: { fromPrice?: number }; currency?: string };
      }>;
    };
  } | null;

  const top = data?.products?.results?.[0];
  if (!top?.productCode) return null;
  return {
    partner: "viator",
    productId: top.productCode,
    title: top.title,
    price: top.pricing?.summary?.fromPrice,
    currency: top.pricing?.currency ?? "USD",
    // productUrl from the partner API already carries our tracking.
    deepLink: top.productUrl,
  };
}

// Klook via Travelpayouts smart link: no product search — a generic browse
// link used as the fallback when Viator has no match. No price shown; the
// click is still attributed.
async function searchKlook(_query: string, _location: string): Promise<ProductMatch | null> {
  const link = env("KLOOK_AFFILIATE_LINK");
  if (!link) return null;
  return { partner: "klook", productId: "smart-link", title: "Find it on Klook", deepLink: link };
}

// Welcome Pickups via Travelpayouts smart link — airport transfers only.
// Gate on "airport" so a city-to-city private transfer doesn't get a link to
// a product WP doesn't sell.
async function searchWelcomePickups(query: string, location: string): Promise<ProductMatch | null> {
  const link = env("WELCOMEPICKUPS_AFFILIATE_LINK");
  if (!link) return null;
  if (!/airport|\bdps\b|\bcgk\b|ngurah rai|soekarno/i.test(`${query} ${location}`)) return null;
  return {
    partner: "welcomepickups",
    productId: "smart-link",
    title: "Private airport transfer (Welcome Pickups)",
    deepLink: link,
  };
}

// Booking.com Demand API requires an approved partnership; until BOOKING_API_KEY
// exists, accommodation resolves to no_match (rules forbid a fallback partner).
async function searchBooking(_query: string, _location: string): Promise<ProductMatch | null> {
  const apiKey = env("BOOKING_API_KEY");
  if (!apiKey) return null;
  // TODO(P2): wire Demand API hotel search → hotelSlug once partnership is live.
  return null;
}

// 12Go via Travelpayouts smart link. The route whitelist still gates WHICH
// ferries are bookable (only routes 12Go genuinely sells); the link itself is
// the static TP campaign link. Unknown/remote routes MUST stay no_match
// ("arrange locally") — a dead route page kills trust and conversions.
const TWELVEGO_ROUTES: Array<{ pattern: RegExp; route: string }> = [
  { pattern: /sanur.*(nusa\s*penida)|(nusa\s*penida).*sanur/i, route: "sanur/nusa-penida" },
  {
    pattern: /(bali|sanur|padang\s*bai).*(gili)|gili.*(bali|sanur|padang\s*bai)/i,
    route: "bali/gili-trawangan",
  },
  { pattern: /(bali|padang\s*bai).*lombok|lombok.*(bali|padang\s*bai)/i, route: "bali/lombok" },
  {
    pattern: /(bali|serangan).*(nusa\s*lembongan)|(nusa\s*lembongan).*(bali|serangan)/i,
    route: "bali/nusa-lembongan",
  },
  { pattern: /lombok.*gili|gili.*lombok/i, route: "lombok/gili-trawangan" },
  { pattern: /jakarta.*(yogya|jogja)|((yogya|jogja).*jakarta)/i, route: "jakarta/yogyakarta" },
  {
    pattern: /(yogya|jogja).*(surabaya|malang)|(surabaya|malang).*(yogya|jogja)/i,
    route: "yogyakarta/surabaya",
  },
  {
    pattern: /(bali|banyuwangi).*(java|ijen|surabaya)|(java|ijen|surabaya).*(bali|banyuwangi)/i,
    route: "banyuwangi/denpasar",
  },
  {
    pattern: /(labuan\s*bajo|komodo).*(bali|denpasar)|(bali|denpasar).*(labuan\s*bajo|komodo)/i,
    route: "bali/labuan-bajo",
  },
];

async function search12Go(query: string, location: string): Promise<ProductMatch | null> {
  // Any 12go.asia URL becomes an affiliate link by appending ?z=<code>, so we
  // deep-link straight to the matched route page instead of the agent home.
  const z = env("TWELVEGO_AFFILIATE_Z");
  if (!z) return null;
  const haystack = `${query} ${location}`;
  const hit = TWELVEGO_ROUTES.find((r) => r.pattern.test(haystack));
  if (!hit) return null;
  return {
    partner: "12go",
    productId: hit.route,
    title: `Tickets: ${hit.route.replace("/", " → ")}`,
    deepLink: `https://12go.asia/en/travel/${hit.route}?z=${z}`,
  };
}

// Airalo via Travelpayouts smart link — always matches when configured.
async function searchAiralo(_query: string, _location: string): Promise<ProductMatch | null> {
  const link = env("AIRALO_AFFILIATE_LINK");
  if (!link) return null;
  return {
    partner: "airalo",
    productId: "indonesia-esim",
    title: "Indonesia eSIM (Airalo)",
    deepLink: link,
  };
}

export const PARTNER_SEARCH: Record<
  Partner,
  (query: string, location: string) => Promise<ProductMatch | null>
> = {
  viator: searchViator,
  klook: searchKlook,
  booking: searchBooking,
  "12go": search12Go,
  airalo: searchAiralo,
  welcomepickups: searchWelcomePickups,
};
