// AI itinerary generation. Server-only. Requires ANTHROPIC_API_KEY.
//
// Streams the itinerary as newline-delimited JSON (NDJSON): a `meta` header line
// followed by one `item` line each. Streaming + NDJSON lets the frontend render
// days as they arrive (no 50s blank wait) and is robust to truncation — a cut-off
// last line is just skipped instead of failing the whole parse.
//
// The model's only job is structure: days, items, categories, and a precise
// searchQuery per bookable item. It must NOT produce product IDs, prices, or
// links — match.server.ts owns those.

import {
  ALWAYS_INFORMATIONAL,
  ItineraryItemSchema,
  type ItineraryItem,
  type TripPreferences,
} from "@/lib/trip/types";

export class GenerationFailedError extends Error {}

export type TripMeta = { title: string; summary: string; days: number };
export type TripPart = { kind: "meta"; meta: TripMeta } | { kind: "item"; item: ItineraryItem };

const SYSTEM_PROMPT = `You are the itinerary engine for exploreindonesia.ai, an Indonesia trip planner that turns plans into bookable day-by-day itineraries.

You receive a freeform user prompt (their trip idea, preferences, or a pasted itinerary):
- If an existing itinerary is included, structure it faithfully (keep their plan, fix only impossible logistics).
- If only preferences or a rough idea are given, design a realistic itinerary yourself that fits them.
- If almost nothing is provided, propose a classic first-timer route (e.g. Bali + one island hop) and say so in the summary.

OUTPUT FORMAT — newline-delimited JSON (NDJSON), nothing else. No markdown, no code fences, no array brackets, no commas between lines, no prose.
The FIRST line is the trip header:
{"kind":"meta","title":string,"summary":string,"days":number}
Then ONE line per itinerary item, each a complete JSON object on its own line, in day order (day 1 first):
{"kind":"item","day":number,"time":"Morning"|"Afternoon"|"Evening"|"Full day","type":"bookable"|"informational","category":"activity"|"spa_wellness"|"private_transfer"|"on_demand_transport"|"accommodation"|"ferry_transport"|"esim"|"tip","title":string,"description":string,"location":string,"searchQuery":string,"suggested":boolean}

Time-of-day structure:
- "time" MUST be one of "Morning", "Afternoon", "Evening", or "Full day".
- Build each day around these slots — typically Morning, Afternoon, often Evening (dinner area, sunset spot, night market).
- If an activity fills the whole day (full-day tour, long trek, island day-trip), use "Full day" and do NOT also add Morning/Afternoon items that day.
- Emit items within a day in order: Full day first if present, otherwise Morning -> Afternoon -> Evening.

Suggestions ("suggested":true):
- OPTIONAL bonus add-ons (a nearby spa, an optional cooking class, a sunset cocktail spot).
- Make them genuinely bookable where possible: type "bookable", a real searchQuery, category usually "activity" or "spa_wellness".
- Include 1-3 across the whole trip, not one per day. Core items use "suggested":false.

Rules:
- Every day gets 2-4 items across the time slots, mixing bookable and informational.
- type "bookable" only for things genuinely pre-bookable online: tours/activities, spa, private airport/inter-city transfers, hotels, ferries between major islands, eSIM.
- category "on_demand_transport" (Grab/Gojek rides, local taxis) is ALWAYS "informational"; its description MUST state mode, estimated price in IDR, and the app name.
- category "tip" is ALWAYS informational.
- Include exactly one "esim" item on day 1 (time "Morning").
- Ferries only between routes that actually exist; for remote crossings prefer informational guidance.
- searchQuery: a precise English partner-marketplace search phrase for the exact product (e.g. "Mount Batur sunrise trekking tour"). Never include dates or party size.
- Never output product IDs, prices, or URLs. Do NOT generate local-quirk "tip" insights — those are added separately.
- Descriptions: 1-2 concrete sentences. Realistic timing, travel times, and geography (don't zigzag between regions).`;

// Parse one NDJSON line into a TripPart, or null to skip (fences, blanks, a
// truncated final line, or an item that fails validation).
function parseLine(raw: string): TripPart | null {
  const line = raw.trim();
  if (!line.startsWith("{")) return null;
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(line);
  } catch {
    return null;
  }

  if (obj.kind === "meta") {
    return {
      kind: "meta",
      meta: {
        title: String(obj.title ?? "Your Indonesia Trip"),
        summary: String(obj.summary ?? ""),
        days: Number(obj.days) || 0,
      },
    };
  }

  const category = obj.category;
  const isInfo =
    typeof category === "string" && ALWAYS_INFORMATIONAL.has(category as ItineraryItem["category"]);
  try {
    const item = ItineraryItemSchema.parse({
      day: obj.day,
      time: obj.time,
      type: isInfo ? "informational" : obj.type,
      category: obj.category,
      title: obj.title,
      description: obj.description,
      location: obj.location,
      searchQuery: obj.searchQuery ?? "",
      suggested: obj.suggested === true ? true : undefined,
      matchStatus: "pending",
    });
    return { kind: "item", item };
  } catch {
    return null;
  }
}

// Stream the itinerary parts from Anthropic as they're generated.
export async function* streamTripParts(prefs: TripPreferences): AsyncGenerator<TripPart> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new GenerationFailedError("ANTHROPIC_API_KEY is not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(prefs) }],
    }),
  });

  if (!res.ok || !res.body) {
    throw new GenerationFailedError(`Anthropic API responded ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let sseBuffer = ""; // raw Server-Sent-Events text
  let ndjson = ""; // accumulated model output text
  let emitted = 0;

  const drainLines = function* (): Generator<TripPart> {
    let nl: number;
    while ((nl = ndjson.indexOf("\n")) !== -1) {
      const raw = ndjson.slice(0, nl);
      ndjson = ndjson.slice(nl + 1);
      const part = parseLine(raw);
      if (part) yield part;
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    sseBuffer += decoder.decode(value, { stream: true });

    const lines = sseBuffer.split("\n");
    sseBuffer = lines.pop() ?? ""; // keep the trailing partial line
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      let evt: { type?: string; delta?: { type?: string; text?: string } };
      try {
        evt = JSON.parse(data);
      } catch {
        continue;
      }
      if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
        ndjson += evt.delta.text ?? "";
        for (const part of drainLines()) {
          if (part.kind === "item") emitted += 1;
          yield part;
        }
      }
    }
  }

  // Flush any final complete line.
  const tail = parseLine(ndjson);
  if (tail) {
    if (tail.kind === "item") emitted += 1;
    yield tail;
  }

  if (emitted === 0) throw new GenerationFailedError("No itinerary items were produced");
}
