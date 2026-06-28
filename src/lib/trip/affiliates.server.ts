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
import { buildBookingLink } from "@/lib/booking";

export type ProductMatch = {
  partner: Partner;
  productId: string;
  title: string;
  price?: number;
  currency?: string;
  // Set when the partner owns the URL (Viator productUrl, Travelpayouts smart
  // links). When absent the matcher falls back to buildDeepLink().
  deepLink?: string;
  // Product photo URL when the partner returns one (Viator).
  imageUrl?: string;
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
    // Booking.com, GetYourGuide and the Travelpayouts partners all build their
    // own URL in search() — nothing to construct here. (Booking is a CJ
    // destination deep link, see searchBooking + src/lib/booking.ts.)
    case "booking":
    case "getyourguide":
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

// Viator's free-text search spans its WHOLE global catalog and never says "no
// match" — for a query with no real Indonesian product it returns the nearest
// foreign one (e.g. a Vietnam or Peru workshop). We guard against that by only
// accepting products whose destination is inside Indonesia.
//
// Viator destinations carry a dotted `lookupId` hierarchy; Indonesia is id 15
// (e.g. Ubud = "2.15.98.5467"). We fetch the destination taxonomy once, cache
// the set of Indonesian destination ids, and reject any product outside it.
const VIATOR_INDONESIA_ID = "15";
let indoDestPromise: Promise<Set<number>> | null = null;

// Test-only: clear the cached Indonesian-destination set between cases.
export function __resetViatorDestinationCache() {
  indoDestPromise = null;
}

async function indonesianDestinationIds(apiKey: string): Promise<Set<number>> {
  if (!indoDestPromise) {
    indoDestPromise = (async () => {
      try {
        const res = await fetch("https://api.viator.com/partner/destinations", {
          headers: {
            "exp-api-key": apiKey,
            "Accept-Language": "en-US",
            Accept: "application/json;version=2.0",
          },
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) {
          indoDestPromise = null; // don't cache a failure — retry next time
          return new Set<number>();
        }
        const data = (await res.json()) as {
          destinations?: Array<{ destinationId: number; lookupId?: string }>;
        };
        const set = new Set<number>([15]);
        for (const d of data.destinations ?? []) {
          if ((d.lookupId ?? "").split(".").includes(VIATOR_INDONESIA_ID)) {
            set.add(d.destinationId);
          }
        }
        return set;
      } catch {
        indoDestPromise = null;
        return new Set<number>();
      }
    })();
  }
  return indoDestPromise;
}

type ViatorProduct = {
  productCode: string;
  title: string;
  productUrl?: string;
  pricing?: { summary?: { fromPrice?: number }; currency?: string };
  images?: Array<{ variants?: Array<{ width?: number; url?: string }> }>;
  destinations?: Array<{ ref?: string; primary?: boolean }>;
};

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
      // Pull several so we can skip foreign results and keep the first Indonesian one.
      searchTypes: [{ searchType: "PRODUCTS", pagination: { start: 1, count: 5 } }],
    }),
  })) as { products?: { results?: ViatorProduct[] } } | null;

  const results = data?.products?.results ?? [];
  if (results.length === 0) return null;

  // Keep only products whose destination is inside Indonesia. If the taxonomy
  // couldn't load (empty set), fall back to the top result rather than break
  // all Viator matching.
  const indoIds = await indonesianDestinationIds(apiKey);
  const isIndonesian = (p: ViatorProduct) =>
    (p.destinations ?? []).some((d) => d.ref && indoIds.has(Number(d.ref)));

  const top = indoIds.size > 0 ? results.find(isIndonesian) : results[0];
  if (!top?.productCode) return null; // nothing Indonesian -> fall through to next partner

  // Pick a mid-size image variant (~240-540px wide) for the card thumbnail.
  const variants = top.images?.[0]?.variants ?? [];
  const imageUrl =
    variants.find((v) => (v.width ?? 0) >= 240 && (v.width ?? 0) <= 540)?.url ??
    variants[variants.length - 1]?.url;
  return {
    partner: "viator",
    productId: top.productCode,
    title: top.title,
    price: top.pricing?.summary?.fromPrice,
    currency: top.pricing?.currency ?? "USD",
    // productUrl from the partner API already carries our tracking.
    deepLink: top.productUrl,
    imageUrl,
  };
}

// GetYourGuide: no product API, but the affiliate program lets us deep-link to
// a targeted SEARCH page for the activity, tracked with partner_id. Lands the
// user on relevant GYG results (better than a generic doorway); no price shown.
async function searchGetYourGuide(query: string, location: string): Promise<ProductMatch | null> {
  const pid = env("GETYOURGUIDE_PARTNER_ID");
  if (!pid) return null;
  const q = encodeURIComponent(`${query} ${location}`.trim());
  return {
    partner: "getyourguide",
    productId: "search",
    title: "Find it on GetYourGuide",
    deepLink: `https://www.getyourguide.com/s/?q=${q}&partner_id=${pid}&utm_medium=online_publisher`,
  };
}

// Klook via Travelpayouts smart link: no product search — a generic browse
// link used as the last-resort fallback. No price shown; click still attributed.
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

// Booking.com via the CJ Affiliate program. The Demand API (live hotel
// search/prices) is NOT available through CJ — invite-only on the direct
// program — so the supported model is a CJ-tracked DESTINATION deep link: we
// send the traveller to Booking.com's results for that day's location and the
// click is attributed. No specific hotel id, no price (like the Travelpayouts
// smart links). See src/lib/booking.ts for the CJ wrapper + the Welcome Pack
// rationale. Always matches when we have a location to search.
async function searchBooking(
  query: string,
  location: string,
  day?: number,
): Promise<ProductMatch | null> {
  const dest = (location || query).trim();
  if (!dest) return null;
  // Day-level SID granularity: tag each accommodation click with the itinerary
  // day so CJ reporting can tell day-2 stays from day-5 stays in the same place
  // (e.g. exploreindonesia_ubud_trip-planner-day2).
  const context = day != null ? `trip-planner-day${day}` : "trip-planner";
  return {
    partner: "booking",
    productId: "search", // destination deep link, not a single property
    title: `Find stays in ${dest}`,
    deepLink: buildBookingLink(dest, { context }),
  };
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
  // `day` is the itinerary day; only Booking.com uses it (for day-level SID
  // tracking). Other partners take the first two args and ignore the rest.
  (query: string, location: string, day?: number) => Promise<ProductMatch | null>
> = {
  viator: searchViator,
  getyourguide: searchGetYourGuide,
  klook: searchKlook,
  booking: searchBooking,
  "12go": search12Go,
  airalo: searchAiralo,
  welcomepickups: searchWelcomePickups,
};
