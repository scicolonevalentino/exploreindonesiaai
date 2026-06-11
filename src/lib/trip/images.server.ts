// Image enrichment for itinerary cards. Server-only.
//
// Priority per bookable item:
//   1. Viator product photo (already on the match — best, it's the real product)
//   2. eSIM / ferry  -> a fixed "standard" image (env override, else Pexels by a
//      stable keyword) so those categories look consistent every time
//   3. everything else -> a Pexels photo by destination/keyword
//
// Needs PEXELS_API_KEY. Without it (or on any error) we return undefined and the
// UI falls back to the branded gradient placeholder — never blocks a trip.

import type { ItineraryItem } from "@/lib/trip/types";

const FETCH_TIMEOUT_MS = 6000;

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v : undefined;
}

// Small in-memory cache so repeated keywords (e.g. several "Ubud" items, or the
// fixed eSIM/ferry queries) don't burn Pexels' rate limit within a run.
const cache = new Map<string, string | null>();

async function pexelsSearch(query: string): Promise<string | undefined> {
  const key = env("PEXELS_API_KEY");
  if (!key) return undefined;
  const q = query.trim().slice(0, 120);
  if (!q) return undefined;
  if (cache.has(q)) return cache.get(q) ?? undefined;

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      q,
    )}&per_page=1&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: key },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      cache.set(q, null);
      return undefined;
    }
    const data = (await res.json()) as {
      photos?: Array<{ src?: { large?: string; medium?: string; landscape?: string } }>;
    };
    const src = data.photos?.[0]?.src;
    const img = src?.landscape ?? src?.large ?? src?.medium;
    cache.set(q, img ?? null);
    return img;
  } catch {
    cache.set(q, null);
    return undefined;
  }
}

// The keyword we search Pexels with, tuned per category for relevance.
function imageQuery(item: ItineraryItem): string {
  switch (item.category) {
    case "esim":
      return env("ESIM_IMAGE_QUERY") ?? "esim sim card smartphone travel";
    case "ferry_transport":
      return env("FERRY_IMAGE_QUERY") ?? "ferry speedboat tropical sea";
    case "accommodation":
      return `${item.location} hotel resort Indonesia`;
    case "spa_wellness":
      return `${item.location} spa massage wellness`;
    case "private_transfer":
      return `${item.location} Indonesia road landscape`;
    case "activity":
    default:
      // The model's searchQuery is descriptive ("Mount Batur sunrise trek") and
      // yields the most relevant photo; fall back to the location.
      return item.searchQuery?.trim() || `${item.location} Indonesia travel`;
  }
}

// Resolve the best image for a bookable item. `viatorImage` is the photo already
// returned by the Viator match (if any); we only hit Pexels when it's missing.
export async function resolveImage(
  item: ItineraryItem,
  viatorImage?: string,
): Promise<string | undefined> {
  if (viatorImage) return viatorImage;
  if (item.type !== "bookable") return undefined;

  // Fixed-image override for eSIM / ferry (env: ESIM_IMAGE_URL / FERRY_IMAGE_URL).
  if (item.category === "esim") {
    const fixed = env("ESIM_IMAGE_URL");
    if (fixed) return fixed;
  }
  if (item.category === "ferry_transport") {
    const fixed = env("FERRY_IMAGE_URL");
    if (fixed) return fixed;
  }

  return pexelsSearch(imageQuery(item));
}
