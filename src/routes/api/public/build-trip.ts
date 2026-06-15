// POST /api/public/build-trip
//
// Phase 1 of the trip build: STREAM a structured itinerary as it's generated.
// The response is Server-Sent Events, a `meta` line, then one `item` line per
// itinerary item as the model writes them, then `insights` and `done`. The
// frontend renders days as they arrive (no long blank wait). The frontend then
// calls /api/public/match-trip to fill in affiliate products + prices.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { type ItineraryItem, TripPreferencesSchema, recommendedCap } from "@/lib/trip/types";
import { streamTripParts, type TripMeta } from "@/lib/trip/generate.server";
import { selectInsights } from "@/lib/trip/insights";
import { screenInput } from "@/lib/trip/guard";

// Best-effort per-instance rate limit (same approach as waitlist.functions.ts).
// Generation is the expensive call, keep abuse cheap to deflect.
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
          return json({ error: "Too many requests, try again in a minute." }, 429);
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
              error: "Tell us something about your trip, describe it or paste an itinerary.",
            },
            400,
          );
        }

        // Layer 1 guard: reject crude/offensive input for free, before any
        // Anthropic call. Topicality is enforced separately by the in-call
        // guard in generate.server.ts (it can emit a refusal mid-stream).
        const screen = screenInput(prefs);
        if (!screen.ok) {
          return json({ error: screen.message }, 400);
        }

        // Stream the itinerary as Server-Sent Events.
        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const send = (obj: unknown) =>
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
            const items: ItineraryItem[] = [];
            let meta: TripMeta | undefined;
            let refused = false;
            // Deterministic cap on "Recommended" add-ons (suggested:true): the
            // prompt asks for a few, but LLMs approximate counts, so we keep the
            // first N (scaled to trip length, max 3) and DROP the rest. Dropping
            // keeps the itinerary lean; demoting would pad the core plan.
            let recCap = 3;
            let recKept = 0;
            try {
              for await (const part of streamTripParts(prefs)) {
                if (part.kind === "refusal") {
                  // Layer 2 guard tripped: off-topic/abusive/political input.
                  // Tell the client and stop, no itinerary will follow.
                  refused = true;
                  send({ type: "refusal", reason: part.reason });
                  break;
                } else if (part.kind === "meta") {
                  meta = part.meta;
                  recCap = recommendedCap(meta.days || 0);
                  send({ type: "meta", meta });
                } else {
                  const item = part.item;
                  if (item.suggested) {
                    if (recKept >= recCap) continue; // drop surplus add-on
                    recKept += 1;
                  }
                  items.push(item);
                  send({ type: "item", item });
                }
              }
              if (refused) {
                send({ type: "done" });
                return;
              }
              // Local Insights come from the curated static library, instant
              // and free; never let a lookup hiccup fail the build.
              let insights: ReturnType<typeof selectInsights> = [];
              try {
                insights = selectInsights({
                  title: meta?.title ?? "Your Indonesia Trip",
                  summary: meta?.summary ?? "",
                  days: meta?.days || items.reduce((m, i) => Math.max(m, i.day), 0),
                  items,
                });
              } catch {
                insights = [];
              }
              send({ type: "insights", insights });
              send({ type: "done" });
            } catch (err) {
              console.error("build-trip stream failed:", err);
              send({ type: "error", error: "generation_failed" });
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no", // disable proxy buffering so chunks flush
          },
        });
      },
    },
  },
});
