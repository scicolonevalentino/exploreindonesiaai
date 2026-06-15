// POST /api/credits/checkout
//
// Creates a Stripe Checkout session for a credit bundle and returns its URL.
// The browser POSTs { bundle: "starter" | "explorer" | "globetrotter" }; we
// authenticate from the session cookies, build a one-time payment session with
// inline price_data (no pre-created Stripe products needed), and stash
// user_id + credits in metadata so the webhook knows who to credit and by how
// much. We never grant credits here — only the webhook does, after Stripe
// confirms the payment.

import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getBundle } from "@/lib/credits/bundles";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/credits/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabase = getSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return json({ error: "not_authenticated" }, 401);

        let bundleId = "";
        try {
          bundleId = ((await request.json()) as { bundle?: string }).bundle ?? "";
        } catch {
          return json({ error: "bad_request" }, 400);
        }
        const bundle = getBundle(bundleId);
        if (!bundle) return json({ error: "unknown_bundle" }, 400);

        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) return json({ error: "server_misconfigured" }, 500);

        const origin = request.headers.get("origin") ?? new URL(request.url).origin;
        const stripe = new Stripe(secretKey);

        try {
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            client_reference_id: user.id,
            // Prefill + tie the receipt to the account email.
            customer_email: user.email ?? undefined,
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: bundle.currency,
                  unit_amount: bundle.priceCents,
                  product_data: {
                    name: `ExploreIndonesia.ai — ${bundle.name} (${bundle.credits} credits)`,
                  },
                },
              },
            ],
            // The webhook reads these to credit the right user. Stripe metadata
            // values must be strings.
            metadata: {
              user_id: user.id,
              bundle_id: bundle.id,
              credits: String(bundle.credits),
            },
            success_url: `${origin}/credits?status=success`,
            cancel_url: `${origin}/credits?status=cancelled`,
          });

          if (!session.url) return json({ error: "no_session_url" }, 502);
          return json({ url: session.url });
        } catch {
          return json({ error: "stripe_error" }, 502);
        }
      },
    },
  },
});
