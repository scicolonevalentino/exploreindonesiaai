// POST /api/public/trip-insights
//
// Optional third call in the trip build: reads the assembled itinerary and
// returns 4-6 "Local Insights" tips from the Indonesia-insider prompt
// (insights.server.ts). Best-effort by contract — the frontend fires this in
// parallel with affiliate matching and silently omits the section on any
// failure, so this endpoint never needs to be up for the itinerary to work.

import { createFileRoute } from "@tanstack/react-router";
import { TripSchema } from "@/lib/trip/types";
import { generateInsights } from "@/lib/trip/insights.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/trip-insights")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let trip;
        try {
          trip = TripSchema.parse(await request.json());
        } catch {
          return json({ error: "Invalid trip payload" }, 400);
        }

        try {
          const insights = await generateInsights(trip);
          return json({ insights });
        } catch (err) {
          console.error("trip-insights generation failed:", err);
          return json({ error: "insights_failed" }, 502);
        }
      },
    },
  },
});
