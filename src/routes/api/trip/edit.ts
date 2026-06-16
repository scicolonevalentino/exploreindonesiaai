// POST /api/trip/edit
//
// The Pro "edit with AI" loop. Takes a saved trip id + a plain-language change +
// any locked item keys, and STREAMS a revised itinerary as Server-Sent Events,
// the SAME protocol as /api/public/build-trip (meta -> items -> insights -> done),
// so the client reuses its generation handling and then calls match-trip.
//
// Credit gating is server-enforced and cannot be bypassed from the browser:
//   - the FIRST edit on a trip is free (saved_trips.ai_edits_used === 0),
//   - the 2nd+ spends one credit; with no credits the endpoint refuses up front
//     (402 insufficient_credits) and never calls the model.
// A credit is spent (and ai_edits_used incremented) ONLY after a successful edit,
// so a refusal or failure never charges the user.
//
// Requires supabase/credits.sql + supabase/trip-edits.sql to be applied.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { streamTripEdit } from "@/lib/trip/generate.server";
import { selectInsights } from "@/lib/trip/insights";
import type { ItineraryItem, Trip } from "@/lib/trip/types";

const BodySchema = z.object({
  tripId: z.string().min(1),
  instruction: z.string().trim().min(3).max(500),
  locked: z.array(z.string()).max(200).optional(),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/trip/edit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabase = getSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return json({ error: "not_authenticated" }, 401);

        let body;
        try {
          body = BodySchema.parse(await request.json());
        } catch (err) {
          const message = err instanceof z.ZodError ? err.issues[0]?.message : "Invalid request";
          return json({ error: message ?? "Invalid request" }, 400);
        }

        // Load the trip (RLS scopes this to the owner). ai_edits_used drives the
        // free-first-edit rule.
        const { data: row, error: loadErr } = await supabase
          .from("saved_trips")
          .select("id, trip_json, ai_edits_used")
          .eq("id", body.tripId)
          .single();
        if (loadErr || !row) return json({ error: "trip_not_found" }, 404);

        const trip = (row.trip_json as { trip: Trip }).trip;
        const editsUsed = (row.ai_edits_used as number | null) ?? 0;
        const isFree = editsUsed === 0;

        // Paid edit with an empty wallet: refuse before spending an Anthropic call.
        if (!isFree) {
          const { data: balance } = await supabase.rpc("credit_balance");
          if ((typeof balance === "number" ? balance : 0) < 1) {
            return json({ error: "insufficient_credits" }, 402);
          }
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const send = (obj: unknown) =>
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
            const items: ItineraryItem[] = [];
            let meta: { title: string; summary: string; days: number } | undefined;
            let refused = false;
            try {
              for await (const part of streamTripEdit({
                trip,
                instruction: body.instruction,
                locked: body.locked ?? [],
              })) {
                if (part.kind === "refusal") {
                  refused = true;
                  send({ type: "refusal", reason: part.reason });
                  break;
                } else if (part.kind === "meta") {
                  meta = part.meta;
                  send({ type: "meta", meta });
                } else {
                  items.push(part.item);
                  send({ type: "item", item: part.item });
                }
              }

              if (refused || items.length === 0) {
                if (!refused) send({ type: "error", error: "generation_failed" });
                send({ type: "done" });
                return;
              }

              // The edit succeeded: charge (unless this was the free first edit)
              // and bump the per-trip counter so the next edit costs a credit.
              // Best-effort, never block returning the result the user can see.
              try {
                if (!isFree) await supabase.rpc("spend_credit", { p_reason: "agent_iteration" });
                await supabase
                  .from("saved_trips")
                  .update({ ai_edits_used: editsUsed + 1 })
                  .eq("id", body.tripId);
              } catch (e) {
                console.error("edit-trip post-charge failed:", e);
              }

              let insights: ReturnType<typeof selectInsights> = [];
              try {
                insights = selectInsights({
                  title: meta?.title ?? trip.title,
                  summary: meta?.summary ?? "",
                  days: meta?.days || items.reduce((m, i) => Math.max(m, i.day), 0),
                  items,
                });
              } catch {
                insights = [];
              }
              send({ type: "insights", insights });
              send({ type: "charged", free: isFree });
              send({ type: "done" });
            } catch (err) {
              console.error("edit-trip stream failed:", err);
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
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
