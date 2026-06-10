// POST /api/public/build-trip
//
// Phase 1 of the two-phase trip build: generate a structured itinerary from
// user preferences (and/or a pasted itinerary) and return it immediately with
// every item matchStatus "pending". The frontend then calls
// /api/public/match-trip to fill in affiliate products progressively — keeps
// this request inside serverless timeouts and the UI responsive, with no queue
// infrastructure.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TripPreferencesSchema } from "@/lib/trip/types";
import { generateTrip } from "@/lib/trip/generate.server";
import { selectInsights } from "@/lib/trip/insights";

// Best-effort per-instance rate limit (same approach as waitlist.functions.ts).
// Generation is the expensive call — keep abuse cheap to deflect.
const RATE_LIMIT = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(key: string) {
  const now = Date.now();
  const arr = (RATE_LIMIT.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) return true;
  arr.push(now);
  RATE_LIMIT.set(key, arr);
  return false;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/build-trip")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        if (rateLimited(ip)) {
          return json({ error: "Too many requests — try again in a minute." }, 429);
        }

        let prefs;
        try {
          prefs = TripPreferencesSchema.parse(await request.json());
        } catch (err) {
          const message = err instanceof z.ZodError ? err.issues[0]?.message : "Invalid JSON body";
          return json({ error: message ?? "Invalid request" }, 400);
        }

        const hasAnyInput =
          (prefs.prompt?.trim().length ?? 0) > 0 ||
          (prefs.destinations?.length ?? 0) > 0 ||
          prefs.days !== undefined ||
          (prefs.existingItinerary?.trim().length ?? 0) > 0 ||
          (prefs.notes?.trim().length ?? 0) > 0;
        if (!hasAnyInput) {
          return json(
            {
              error: "Tell us something about your trip — describe it or paste an itinerary.",
            },
            400,
          );
        }

        try {
          const trip = await generateTrip(prefs);
          // Local Insights come from the curated static library — instant, free,
          // no second model call. Never let a lookup hiccup fail the build.
          let insights: ReturnType<typeof selectInsights> = [];
          try {
            insights = selectInsights(trip);
          } catch {
            insights = [];
          }
          return json({ trip, insights });
        } catch (err) {
          // No retry by design — generation either parses or fails fast.
          console.error("build-trip generation failed:", err);
          return json({ error: "generation_failed" }, 500);
        }
      },
    },
  },
});
