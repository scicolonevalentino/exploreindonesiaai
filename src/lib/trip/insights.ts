// Static "Local Insights" selection. No API call — tips come from the curated
// src/data/insights.json library (authored offline, see scripts/export-insights.mjs).
//
// Rules (P1):
//  - up to 1 tip per location (so 3 days in Ubud still yields at most 1 Ubud tip)
//  - max 3 tips per itinerary
//  - each tip attaches to the day where its location first appears, so the UI
//    can weave it into that day block.

import insightsData from "@/data/insights.json";
import type { Insight, Trip } from "@/lib/trip/types";

const MAX_INSIGHTS = 3;

type LibraryEntry = { aliases?: string[]; tips: Array<{ label: string; tip: string }> };
const LIBRARY = insightsData as Record<string, LibraryEntry>;

// Match an itinerary location string against a library key + its aliases.
function matchesLocation(itineraryLocation: string, key: string, aliases: string[]): boolean {
  const hay = itineraryLocation.toLowerCase();
  return [key, ...aliases].some((needle) => hay.includes(needle.toLowerCase()));
}

export function selectInsights(trip: Trip): Insight[] {
  const out: Insight[] = [];
  const usedKeys = new Set<string>();

  // Walk items in day order so tips attach to the first day a place appears.
  const items = [...trip.items].sort((a, b) => a.day - b.day);

  for (const item of items) {
    if (out.length >= MAX_INSIGHTS) break;

    for (const [key, entry] of Object.entries(LIBRARY)) {
      if (usedKeys.has(key)) continue;
      if (!matchesLocation(item.location, key, entry.aliases ?? [])) continue;
      const first = entry.tips[0];
      if (!first) continue;

      out.push({
        day: item.day,
        destination: key.replace(/\b\w/g, (c) => c.toUpperCase()),
        tip: first.tip,
        label: first.label as Insight["label"],
      });
      usedKeys.add(key);
      break; // at most one library entry per item
    }
  }

  return out;
}
