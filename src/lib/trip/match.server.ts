// Deterministic affiliate matcher. Server-only.
//
// The LLM never invents product IDs, prices, or links, it only emits a good
// searchQuery per item. This module routes each bookable item through the
// category's partner chain (types.ts PARTNER_ROUTING) and builds the deep link
// from env-configured affiliate IDs.

import { ALWAYS_INFORMATIONAL, PARTNER_ROUTING, type ItineraryItem } from "@/lib/trip/types";
import { buildDeepLink, PARTNER_SEARCH } from "@/lib/trip/affiliates.server";
import { resolveImage } from "@/lib/trip/images.server";

export async function matchItem(item: ItineraryItem): Promise<ItineraryItem> {
  // Hard rules first, these categories never get a booking link.
  if (ALWAYS_INFORMATIONAL.has(item.category) || item.type === "informational") {
    return {
      ...item,
      type: "informational",
      partner: undefined,
      productId: undefined,
      price: undefined,
      currency: undefined,
      deepLink: undefined,
      matchStatus: "no_match",
      noMatchReason:
        item.category === "on_demand_transport"
          ? "Book on the spot via the app (Grab/Gojek)"
          : undefined,
    };
  }

  const chain = PARTNER_ROUTING[item.category];
  for (const partner of chain) {
    const product = await PARTNER_SEARCH[partner](item.searchQuery, item.location, item.day);
    if (!product) continue;
    // Prefer the partner-provided URL (Viator productUrl, Travelpayouts smart
    // links); fall back to constructing one from the affiliate ID.
    const deepLink = product.deepLink ?? buildDeepLink(partner, product.productId);
    if (!deepLink) continue; // no usable link, try next partner
    return {
      ...item,
      partner,
      productId: product.productId,
      price: product.price,
      currency: product.currency,
      deepLink,
      // Viator photo when present, else a Pexels image (or eSIM/ferry standard).
      imageUrl: await resolveImage(item, product.imageUrl),
      matchStatus: "matched",
      noMatchReason: undefined,
    };
  }

  return {
    ...item,
    // Even unmatched bookables (e.g. accommodation) get a representative photo.
    imageUrl: await resolveImage(item),
    matchStatus: "no_match",
    noMatchReason:
      item.category === "ferry_transport"
        ? "arrange locally"
        : "No bookable product found, search the partner site directly",
  };
}

export async function matchItems(items: ItineraryItem[]): Promise<ItineraryItem[]> {
  // All partner calls in parallel; a single slow/failed partner never blocks
  // the rest. matchItem itself never throws, but allSettled is belt-and-braces.
  const settled = await Promise.allSettled(items.map((item) => matchItem(item)));
  return settled.map((result, i) =>
    result.status === "fulfilled"
      ? result.value
      : {
          ...items[i],
          matchStatus: "no_match" as const,
          noMatchReason: "Matching failed, try again",
        },
  );
}
