// POST /api/stripe/webhook
//
// Stripe calls this after a Checkout payment. It is the ONLY place credits are
// granted — never trust the browser. We verify the Stripe signature against the
// raw body, and on a paid checkout.session.completed we append a +credits row to
// credit_ledger via the service-role client. Idempotent on stripe_session_id
// (Stripe retries / may deliver an event twice), so a user is credited once.
//
// Register the endpoint in Stripe → Developers → Webhooks (event:
// checkout.session.completed) and put the signing secret in STRIPE_WEBHOOK_SECRET.

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secretKey || !webhookSecret) {
          return new Response("server_misconfigured", { status: 500 });
        }

        const sig = request.headers.get("stripe-signature");
        if (!sig) return new Response("missing_signature", { status: 400 });

        // Signature verification needs the EXACT raw body, not a parsed object.
        const rawBody = await request.text();
        const stripe = new Stripe(secretKey);

        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
        } catch {
          return new Response("invalid_signature", { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          // Only grant on an actually-paid session.
          if (session.payment_status === "paid") {
            const userId = session.metadata?.user_id;
            const credits = Number(session.metadata?.credits);
            if (userId && Number.isFinite(credits) && credits > 0) {
              const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
              if (!serviceKey) return new Response("server_misconfigured", { status: 500 });
              const admin = createClient(import.meta.env.VITE_SUPABASE_URL as string, serviceKey, {
                auth: { persistSession: false, autoRefreshToken: false },
              });
              // Idempotent: the unique stripe_session_id means a retried event
              // silently no-ops instead of double-crediting.
              const { error } = await admin.from("credit_ledger").upsert(
                {
                  user_id: userId,
                  delta: credits,
                  reason: "purchase",
                  stripe_session_id: session.id,
                },
                { onConflict: "stripe_session_id", ignoreDuplicates: true },
              );
              if (error) return new Response("ledger_write_failed", { status: 500 });
            }
          }
        }

        // 200 so Stripe stops retrying. Unhandled event types fall through here.
        return new Response("ok", { status: 200 });
      },
    },
  },
});
