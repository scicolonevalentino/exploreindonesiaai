// "Local Insights" generation. Server-only. Requires ANTHROPIC_API_KEY.
//
// Second Claude call, different persona: not the itinerary engine but an
// Indonesia insider. It reads the assembled itinerary and produces 4-6 tips
// specific to those exact places — the kind of thing generic AI tools miss or
// get wrong. Failure here must never affect the itinerary: callers swallow
// errors and the UI simply omits the section.

import { z } from "zod";
import type { Insight, Trip } from "@/lib/trip/types";

// Mirrors the client-safe Insight type in types.ts.
export const InsightSchema: z.ZodType<Insight> = z.object({
  day: z.number().int().min(1),
  destination: z.string(),
  tip: z.string(),
  label: z.enum(["ai_blind_spot", "local_knowledge", "easy_to_miss"]),
});

const InsightsResponseSchema = z.object({
  insights: z.array(InsightSchema).min(1).max(8),
});

const SYSTEM_PROMPT = `You are a long-time Indonesia travel insider working for exploreindonesia.ai. You receive a traveler's assembled day-by-day itinerary (title, summary, and the list of places and activities).

Your job: produce 4-6 short insider tips STRICTLY about the exact destinations and activities in this itinerary — the kind of specific, verifiable knowledge that generic AI tools commonly miss or get wrong.

Good tips are concrete and surprising-but-true. Examples of the right flavor:
- "On Komodo island, the deer and wild boar wandering near the ranger station are the dragons' prey — that's why they look unbothered by humans but the rangers keep you in groups."
- "The Tegalalang rice terraces 'entrance fees' at multiple checkpoints are informal — only the first ticket booth is official."
- "Mount Batur 'sunrise from the summit' often means watching from below the rim in cloudy season (Dec-Feb); book the jeep variant if hiking in rain isn't your thing."

Rules:
- Every tip must name-check a destination or activity that actually appears in the itinerary. No generic Indonesia advice, no visa/vaccine boilerplate.
- 1-2 sentences per tip, max ~40 words. Concrete facts, not vibes.
- Never invent prices, opening hours, or regulations you are not confident about.
- Label each tip:
  - "ai_blind_spot" — something AI assistants and blogs typically get wrong about this place
  - "local_knowledge" — something locals know that tourists rarely do
  - "easy_to_miss" — a detail travelers overlook that changes the experience
- "day" is the day number of the itinerary item the tip relates to — it MUST be one of the day numbers present in the itinerary, because the tip is rendered inside that day's section. At most 2 tips per day.

Respond with ONLY a JSON object, no prose, no markdown fences:
{"insights": [{"day": number, "destination": string, "tip": string, "label": "ai_blind_spot" | "local_knowledge" | "easy_to_miss"}]}`;

export async function generateInsights(trip: Trip): Promise<Insight[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  // Send only what the insider needs — keeps tokens (and cost) minimal.
  const digest = {
    title: trip.title,
    summary: trip.summary,
    places: trip.items.map((i) => ({
      day: i.day,
      title: i.title,
      location: i.location,
      category: i.category,
    })),
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-fable-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(digest) }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic API responded ${res.status}`);

  const data = (await res.json()) as { content?: Array<{ text?: string }> };
  const text = (data.content?.[0]?.text ?? "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return InsightsResponseSchema.parse(JSON.parse(text)).insights;
}
