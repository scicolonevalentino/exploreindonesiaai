// Shared trip-builder types — safe for both client and server bundles.
// Keep this file free of secrets and server-only imports.

import { z } from "zod";

export const CATEGORIES = [
  "activity",
  "spa_wellness",
  "private_transfer",
  "on_demand_transport",
  "accommodation",
  "ferry_transport",
  "esim",
  "tip",
] as const;

export const PARTNERS = ["viator", "klook", "booking", "12go", "airalo", "welcomepickups"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Partner = (typeof PARTNERS)[number];

export const ItineraryItemSchema = z.object({
  day: z.number().int().min(1),
  time: z.string().optional(),
  type: z.enum(["bookable", "informational"]),
  category: z.enum(CATEGORIES),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  searchQuery: z.string(),
  partner: z.enum(PARTNERS).optional(),
  productId: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  deepLink: z.string().optional(),
  matchStatus: z.enum(["pending", "matched", "no_match"]),
  noMatchReason: z.string().optional(),
});

export type ItineraryItem = z.infer<typeof ItineraryItemSchema>;

export const TripSchema = z.object({
  title: z.string(),
  summary: z.string(),
  days: z.number().int().min(1),
  items: z.array(ItineraryItemSchema),
});

export type Trip = z.infer<typeof TripSchema>;

export const TripPreferencesSchema = z.object({
  // P1 UX is prompt-first: the user pastes a freeform trip idea or itinerary
  // and we build from that. The granular fields below are optional and unused
  // by the P1 page — kept for the future granular-input CTA.
  prompt: z.string().max(20000).optional(),
  destinations: z.array(z.string()).optional(),
  days: z.number().int().min(1).max(30).optional(),
  month: z.string().optional(),
  budget: z.enum(["budget", "mid", "luxury"]).optional(),
  travelers: z.number().int().min(1).max(12).optional(),
  interests: z.array(z.string()).optional(),
  pace: z.enum(["relaxed", "balanced", "packed"]).optional(),
  notes: z.string().max(4000).optional(),
  existingItinerary: z.string().max(20000).optional(),
});

export type TripPreferences = z.infer<typeof TripPreferencesSchema>;

// "Local Insights" tip produced by the second Claude call (insights.server.ts).
// Client-safe type — the zod validation lives server-side.
export type InsightLabel = "ai_blind_spot" | "local_knowledge" | "easy_to_miss";

export type Insight = {
  destination: string;
  tip: string;
  label: InsightLabel;
};

// Categories that may never carry a booking link, regardless of what the
// model emits. Enforced in code after generation (defense in depth).
export const ALWAYS_INFORMATIONAL: ReadonlySet<Category> = new Set(["on_demand_transport", "tip"]);

// Partner routing per category: try in order, stop at first match.
export const PARTNER_ROUTING: Record<Category, Partner[]> = {
  activity: ["viator", "klook"],
  spa_wellness: ["viator", "klook"],
  // Airport transfers: Viator gives a real product + price; Welcome Pickups
  // (Travelpayouts smart link, airport-gated) is the fallback.
  private_transfer: ["viator", "welcomepickups"],
  on_demand_transport: [],
  accommodation: ["booking"],
  ferry_transport: ["12go"],
  esim: ["airalo"],
  tip: [],
};
