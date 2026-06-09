// Partner search clients + affiliate deep-link builders. Server-only.
//
// Design: every partner exposes `search(query, location)` returning a
// ProductMatch or null. Partners without a configured API key return null —
// the matcher turns that into matchStatus "no_match" and the app still ships.
// Adding a key in Vercel env lights the partner up with no code change.
//
// Affiliate IDs come from env vars only (read per-request, never at module
// scope — see config.server.ts for why).

import type { Partner } from "@/lib/trip/types";

export type ProductMatch = {
  partner: Partner;
  productId: string;
  title: string;
  price?: number;
  currency?: string;
};

const FETCH_TIMEOUT_MS = 8000;

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v : undefined;
}

/* ----------------------------- deep links ------------------------------- */

export function buildDeepLink(partner: Partner, productId: string): string | null {
  switch (partner) {
    case "viator": {
      const pid = env("VIATOR_AFFILIATE_ID");
      if (!pid) return null;
      return `https://www.viator.com/tours/${productId}?pid=${pid}&mcid=42383&medium=api`;
    }
    case "klook": {
      const aid = env("KLOOK_AFFILIATE_ID");
      if (!aid) return null;
      return `https://www.klook.com/activity/${productId}/?aid=${aid}`;
    }
    case "booking": {
      const aid = env("BOOKING_AFFILIATE_ID");
      if (!aid) return null;
      return `https://www.booking.com/hotel/id/${productId}.html?aid=${aid}`;
    }
    case "12go": {
      const ref = env("TWELVEGO_AFFILIATE_ID");
      if (!ref) return null;
      return `https://12go.asia/en/travel/${productId}?ref=${ref}`;
    }
    case "airalo": {
      const ref = env("AIRALO_AFFILIATE_ID");
      if (!ref) return null;
      return `https://www.airalo.com/indonesia-esim?partner=${ref}`;
    }
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
  };
}

// Klook affiliate open API. Requires KLOOK_API_KEY; returns null until provisioned.
async function searchKlook(query: string, location: string): Promise<ProductMatch | null> {
  const apiKey = env("KLOOK_API_KEY");
  if (!apiKey) return null;

  const params = new URLSearchParams({ query: `${query} ${location}`, limit: "1" });
  const data = (await fetchJson(`https://affiliate-api.klook.com/v3/activities/search?${params}`, {
    headers: { "X-API-KEY": apiKey, Accept: "application/json" },
  })) as {
    activities?: Array<{
      activity_id: number | string;
      title: string;
      sell_price?: string;
      currency?: string;
    }>;
  } | null;

  const top = data?.activities?.[0];
  if (!top?.activity_id) return null;
  const price = top.sell_price ? Number(top.sell_price) : undefined;
  return {
    partner: "klook",
    productId: String(top.activity_id),
    title: top.title,
    price: Number.isFinite(price) ? price : undefined,
    currency: top.currency,
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

// 12Go has no public search API. Routes are deterministic, so we match against
// a curated whitelist of Indonesian routes known to be sellable on 12go.asia.
// Unknown/remote routes MUST stay no_match ("arrange locally") — never guess a
// slug, a dead 12Go page kills trust and conversions.
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
  const haystack = `${query} ${location}`;
  const hit = TWELVEGO_ROUTES.find((r) => r.pattern.test(haystack));
  if (!hit) return null;
  return {
    partner: "12go",
    productId: hit.route,
    title: `Tickets: ${hit.route.replace("/", " → ")}`,
  };
}

// Airalo is a static link — always matches when the affiliate ID is configured.
async function searchAiralo(_query: string, _location: string): Promise<ProductMatch | null> {
  if (!env("AIRALO_AFFILIATE_ID")) return null;
  return { partner: "airalo", productId: "indonesia-esim", title: "Indonesia eSIM (Airalo)" };
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
};
