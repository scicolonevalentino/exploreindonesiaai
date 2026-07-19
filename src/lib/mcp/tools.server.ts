// MCP tool definitions + dispatch for the ExploreIndonesia.ai connector.
//
// Server-only: pulls curated content from Sanity and resolves affiliate
// products via the existing trip matcher (match.server.ts). No LLM calls live
// here — the client's model composes the answer; these tools only return real,
// bookable data. That keeps the connector fast and free to run.

import { sanityClient } from "@/lib/sanity";
import { ARTICLES_LIST_QUERY, type ArticleListItem } from "@/lib/sanity-queries";
import { matchItems } from "@/lib/trip/match.server";
import { CATEGORIES, type Category, type ItineraryItem } from "@/lib/trip/types";
import { SITE_URL } from "@/lib/mcp/config";

// ── Taxonomy enums (kept inline so the JSON Schema is dependency-free) ──
const DESTINATION_VALUES = [
  "bali",
  "bali_nearby_islands",
  "java",
  "komodo_flores",
  "lombok_gili",
  "sumatra",
  "raja_ampat",
  "wild_indonesia",
] as const;

const TRAVEL_STYLE_VALUES = [
  "first_time_indonesia",
  "beach_islands",
  "culture_temples",
  "adventure_volcanoes",
  "wildlife_nature",
  "diving_snorkeling",
  "romantic_escape",
  "remote_offbeat",
] as const;

const TRAVELLER_TYPE_VALUES = [
  "solo_travellers",
  "couples",
  "honeymooners",
  "friends",
  "families",
  "divers",
  "repeat_travellers",
] as const;

const TRIP_LENGTH_VALUES = [
  "short_escape",
  "one_week",
  "ten_days",
  "two_weeks",
  "three_weeks_plus",
] as const;

// ── JSON Schema for each tool's input ──
// annotations carry the MCP behaviour hints the Anthropic connector directory
// requires: a human `title` plus readOnlyHint/destructiveHint. All three tools
// only read data (no writes), so readOnlyHint is true; openWorldHint is true
// because they reach external services (Sanity CMS, affiliate partner APIs).
export type ToolAnnotations = {
  title: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  openWorldHint?: boolean;
};

export type ToolDef = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: ToolAnnotations;
};

export const TOOLS: ToolDef[] = [
  {
    name: "search_itineraries",
    description:
      "Search ExploreIndonesia.ai's curated, human-written Indonesia itineraries " +
      "(Bali, Java, Komodo, Raja Ampat, Sumatra and more). Returns matching trips " +
      "with their public URL, length, destinations, travel style and a summary. " +
      "Use this to ground trip advice in real, published itineraries instead of " +
      "inventing one. All filters are optional; combine them to narrow results.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Free text matched against the itinerary title (e.g. 'blue fire', 'with kids').",
        },
        destination: {
          type: "string",
          enum: [...DESTINATION_VALUES],
          description: "Primary Indonesia region to filter by.",
        },
        travelStyle: {
          type: "string",
          enum: [...TRAVEL_STYLE_VALUES],
          description: "Travel style / theme.",
        },
        travellerType: {
          type: "string",
          enum: [...TRAVELLER_TYPE_VALUES],
          description: "Who the trip is for.",
        },
        tripLength: {
          type: "string",
          enum: [...TRIP_LENGTH_VALUES],
          description: "Trip length bucket.",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 6, max 20).",
        },
      },
      additionalProperties: false,
    },
    annotations: {
      title: "Search Indonesia itineraries",
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "match_trip",
    description:
      "Turn a list of itinerary items into BOOKABLE ones: for each item, resolves a " +
      "real affiliate product (Viator, GetYourGuide, Booking.com, 12Go, Airalo, etc.) " +
      "with a live from-price where available and a booking deep link. Call this after " +
      "you've drafted a day-by-day plan to make it actually reservable. Categories " +
      "'on_demand_transport' and 'tip' are always informational (no link).",
    inputSchema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          minItems: 1,
          maxItems: 60,
          description: "The itinerary items to make bookable.",
          items: {
            type: "object",
            properties: {
              day: { type: "number", description: "Day number in the trip (>= 1)." },
              title: { type: "string", description: "Short name of the activity/stay/transport." },
              location: { type: "string", description: "Place it happens (e.g. 'Ubud, Bali')." },
              category: {
                type: "string",
                enum: [...CATEGORIES],
                description:
                  "activity | spa_wellness | private_transfer | on_demand_transport | " +
                  "accommodation | ferry_transport | esim | tip",
              },
              searchQuery: {
                type: "string",
                description: "Optional search string to match the product; defaults to the title.",
              },
            },
            required: ["day", "title", "location", "category"],
            additionalProperties: false,
          },
        },
      },
      required: ["items"],
      additionalProperties: false,
    },
    annotations: {
      title: "Make an itinerary bookable",
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_booking_links",
    description:
      "Convenience single-item version of match_trip: given one activity, stay or " +
      "transport, return its bookable affiliate product + deep link. Use for quick " +
      "'where can I book X' answers.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Name of the activity/stay/transport." },
        location: { type: "string", description: "Place (e.g. 'Komodo National Park')." },
        category: {
          type: "string",
          enum: [...CATEGORIES],
          description: "What kind of thing it is (drives which partner is used).",
        },
      },
      required: ["title", "location", "category"],
      additionalProperties: false,
    },
    annotations: {
      title: "Get booking links for an activity",
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
];

// ── Tool implementations ──

function articleUrl(slug: string | undefined): string | null {
  return slug ? `${SITE_URL}/trips/${slug}` : null;
}

function matches(field: string | undefined, want: string): boolean {
  return (field ?? "").toLowerCase() === want.toLowerCase();
}
function arrayHas(arr: string[] | undefined, want: string): boolean {
  return (arr ?? []).some((v) => v.toLowerCase() === want.toLowerCase());
}

async function searchItineraries(args: Record<string, unknown>): Promise<unknown> {
  const query = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
  const destination = typeof args.destination === "string" ? args.destination : undefined;
  const travelStyle = typeof args.travelStyle === "string" ? args.travelStyle : undefined;
  const travellerType = typeof args.travellerType === "string" ? args.travellerType : undefined;
  const tripLength = typeof args.tripLength === "string" ? args.tripLength : undefined;
  const limit = Math.min(20, Math.max(1, Number(args.limit) || 6));

  const all = await sanityClient.fetch<ArticleListItem[]>(ARTICLES_LIST_QUERY);

  const filtered = all.filter((a) => {
    if (
      destination &&
      !(matches(a.destinationPrimary, destination) || arrayHas(a.destinationSecondary, destination))
    )
      return false;
    if (
      travelStyle &&
      !(matches(a.travelStylePrimary, travelStyle) || arrayHas(a.travelStyleSecondary, travelStyle))
    )
      return false;
    if (travellerType && !arrayHas(a.travellerTypes, travellerType)) return false;
    if (tripLength && !matches(a.tripLengthBucket, tripLength)) return false;
    if (query && !a.title.toLowerCase().includes(query)) return false;
    return true;
  });

  const results = filtered.slice(0, limit).map((a) => ({
    title: a.title,
    url: articleUrl(a.slug?.current),
    days: a.tripLengthDays,
    tripLength: a.tripLengthBucket,
    destinationPrimary: a.destinationPrimary,
    destinationSecondary: a.destinationSecondary,
    travelStyle: a.travelStylePrimary,
    travellerTypes: a.travellerTypes,
    vibe: a.vibe,
    bestSeason: a.bestSeason,
    summary: a.metaDescription,
  }));

  return { count: results.length, totalLive: all.length, results };
}

// Build a full ItineraryItem from the caller's simplified shape so matchItems
// (which expects the internal type) can resolve affiliate products.
function toItineraryItem(raw: Record<string, unknown>, index: number): ItineraryItem {
  const title = String(raw.title ?? "").trim();
  const location = String(raw.location ?? "").trim();
  const category = String(raw.category ?? "activity") as Category;
  const searchQuery =
    typeof raw.searchQuery === "string" && raw.searchQuery.trim()
      ? raw.searchQuery.trim()
      : `${title} ${location}`.trim();
  const day = Number.isFinite(Number(raw.day))
    ? Math.max(1, Math.floor(Number(raw.day)))
    : index + 1;

  return {
    day,
    type: "bookable",
    category,
    title,
    description: "",
    location,
    searchQuery,
    matchStatus: "pending",
  };
}

function summarizeMatched(item: ItineraryItem) {
  return {
    day: item.day,
    title: item.title,
    location: item.location,
    category: item.category,
    matchStatus: item.matchStatus,
    partner: item.partner ?? null,
    price: item.price ?? null,
    currency: item.currency ?? null,
    bookingUrl: item.deepLink ?? null,
    noMatchReason: item.noMatchReason ?? null,
  };
}

async function matchTrip(args: Record<string, unknown>): Promise<unknown> {
  const rawItems = Array.isArray(args.items) ? args.items : [];
  if (rawItems.length === 0) {
    return { error: "Provide at least one item." };
  }
  const items = rawItems
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .slice(0, 60)
    .map(toItineraryItem);

  const matched = await matchItems(items);
  const results = matched.map(summarizeMatched);
  const bookable = results.filter((r) => r.matchStatus === "matched").length;
  return { count: results.length, bookable, items: results };
}

async function getBookingLinks(args: Record<string, unknown>): Promise<unknown> {
  const item = toItineraryItem(
    { title: args.title, location: args.location, category: args.category, day: 1 },
    0,
  );
  const [matched] = await matchItems([item]);
  return summarizeMatched(matched);
}

/**
 * Dispatch a tool call by name. Returns a JSON-serialisable result object.
 * Throws on unknown tool name.
 */
export async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "search_itineraries":
      return searchItineraries(args);
    case "match_trip":
      return matchTrip(args);
    case "get_booking_links":
      return getBookingLinks(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
