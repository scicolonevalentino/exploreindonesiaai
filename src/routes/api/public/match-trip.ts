// POST /api/public/match-trip
//
// Phase 2 of the two-phase trip build: receives itinerary items (from
// build-trip) and resolves each bookable one to a real affiliate product +
// deep link via match.server.ts. Stateless — the client holds the trip, so
// retrying or matching a subset (e.g. only still-pending items) is free.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ItineraryItemSchema } from "@/lib/trip/types";
import { matchItems } from "@/lib/trip/match.server";

const BodySchema = z.object({
  items: z.array(ItineraryItemSchema).min(1).max(150),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/match-trip")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let items;
        try {
          items = BodySchema.parse(await request.json()).items;
        } catch {
          return json({ error: "Invalid items payload" }, 400);
        }

        const matched = await matchItems(items);
        return json({ items: matched });
      },
    },
  },
});
