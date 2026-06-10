// AI itinerary generation. Server-only. Requires ANTHROPIC_API_KEY.
//
// Calls the Anthropic Messages API directly via fetch (no SDK dependency).
// The model's only job is structure: days, items, categories, and a precise
// searchQuery per bookable item. It must NOT produce product IDs, prices, or
// links — match.server.ts owns those (LLM-invented IDs ship broken affiliate
// links, which is fatal for an affiliate business).

import {
  ALWAYS_INFORMATIONAL,
  TripSchema,
  type Trip,
  type TripPreferences,
} from "@/lib/trip/types";

export class GenerationFailedError extends Error {}

const SYSTEM_PROMPT = `You are the itinerary engine for exploreindonesia.ai, an Indonesia trip planner that turns plans into bookable day-by-day itineraries.

You receive a freeform user prompt (their trip idea, preferences, or a pasted itinerary), optionally with structured preferences:
- If an existing itinerary is included, structure it faithfully (keep their plan, fix only impossible logistics).
- If only preferences or a rough idea are given, design a realistic itinerary yourself that fits them.
- If almost nothing is provided, propose a classic first-timer route (e.g. Bali + one island hop) and say so in the summary.

Respond with ONLY a JSON object — no prose, no markdown fences — in this exact shape:
{
  "title": string,
  "summary": string,
  "days": number,
  "items": [
    {
      "day": number (1-based),
      "time": string (optional, e.g. "08:00" or "Afternoon"),
      "type": "bookable" | "informational",
      "category": "activity" | "spa_wellness" | "private_transfer" | "on_demand_transport" | "accommodation" | "ferry_transport" | "esim" | "tip",
      "title": string,
      "description": string,
      "location": string,
      "searchQuery": string,
      "matchStatus": "pending"
    }
  ]
}

Output rules:
- Every day gets 2-5 items mixing bookable and informational.
- type "bookable" only for things genuinely pre-bookable online: tours/activities, spa, private airport/inter-city transfers, hotels, ferries between major islands, eSIM.
- category "on_demand_transport" (Grab/Gojek rides, local taxis) is ALWAYS type "informational" and its description MUST state: mode, estimated price in IDR, and the app name.
- category "tip" is ALWAYS informational.
- Include exactly one "esim" item on day 1.
- Ferries only between routes that actually exist; for remote crossings prefer informational guidance.
- searchQuery: a precise English partner-marketplace search phrase for the exact product (e.g. "Mount Batur sunrise trekking tour", "private transfer Ngurah Rai airport to Ubud"). Never include dates or party size.
- matchStatus is always "pending". Never output product IDs, prices, or URLs.
- Descriptions: 1-2 concrete sentences a traveler can act on. Realistic timing, travel times, and geography (don't zigzag between regions).`;

// Strip ```json ... ``` fences in case the model wraps its JSON output.
function stripMarkdownFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export async function generateTrip(prefs: TripPreferences): Promise<Trip> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new GenerationFailedError("ANTHROPIC_API_KEY is not configured");

  const maxTokens = (prefs.days ?? 0) > 10 ? 6000 : 4000;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      // P1: Sonnet is the quality/cost sweet spot for structured generation.
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(prefs) }],
    }),
  });

  if (!res.ok) {
    throw new GenerationFailedError(`Anthropic API responded ${res.status}`);
  }

  let trip: Trip;
  try {
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const text = data.content?.[0]?.text ?? "";
    trip = TripSchema.parse(JSON.parse(stripMarkdownFences(text)));
  } catch {
    // No retry by design — the caller returns 500 generation_failed.
    throw new GenerationFailedError("Could not parse itinerary JSON");
  }

  // Enforce hard routing invariants in code regardless of model output.
  trip.items = trip.items.map((item) => ({
    ...item,
    type: ALWAYS_INFORMATIONAL.has(item.category) ? "informational" : item.type,
    partner: undefined,
    productId: undefined,
    price: undefined,
    currency: undefined,
    deepLink: undefined,
    matchStatus: "pending",
  }));

  return trip;
}
