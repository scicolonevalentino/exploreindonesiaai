// Pro credit bundles (P3). Shared by client (pricing UI) and server (checkout).
// No secrets here. 1 credit = 1 agent iteration; the first iteration per trip is
// free (see the edit-loop logic). Prices are one-time, USD only (see the
// currency decision — the whole site quotes USD).
//
// `priceCents` is what Stripe charges; `credits` is what we grant on a completed
// payment. The webhook reads `credits` from the session metadata, so these
// numbers are the single source of truth — never hardcode them elsewhere.

export type CreditBundle = {
  id: "starter" | "explorer" | "globetrotter";
  name: string;
  credits: number;
  priceCents: number;
  currency: "usd";
  blurb: string;
  popular?: boolean;
};

export const CREDIT_BUNDLES: readonly CreditBundle[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 3,
    priceCents: 499,
    currency: "usd",
    blurb: "Three targeted adjustments. For the traveler who knows exactly what needs changing.",
  },
  {
    id: "explorer",
    name: "Explorer",
    credits: 15,
    priceCents: 1999,
    currency: "usd",
    blurb: "A full planning session. Enough to take a rough draft to a finished trip.",
    popular: true,
  },
  {
    id: "globetrotter",
    name: "Globetrotter",
    credits: 100,
    priceCents: 4999,
    currency: "usd",
    blurb: "A hundred iterations. Plan trip after trip with room to spare.",
  },
] as const;

export function getBundle(id: string): CreditBundle | undefined {
  return CREDIT_BUNDLES.find((b) => b.id === id);
}

// "$4.99" from 499. Whole-dollar amounts drop the .00 ("$50" not "$50.00").
export function formatPrice(cents: number, currency = "usd"): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(dollars);
}
