// Server-side input guard for the trip builder (Layer 1).
//
// This is the cheap, deterministic first line of defence: it runs BEFORE any
// Anthropic call and rejects crude/offensive input for free. It does NOT judge
// topicality ("is this actually a trip?") — that nuance is handled by the
// in-call guard in generate.server.ts, which can refuse off-topic, political,
// or abusive prompts the wordlist can't catch.
//
// Deliberately conservative: word-boundary matches only, so place names and
// ordinary words ("Scunthorpe", "assistance", "Bangkok") never trip it.

import type { TripPreferences } from "@/lib/trip/types";

// Hard-blocked terms: slurs + explicit profanity. Kept lowercase; matched
// case-insensitively with word boundaries. Extend as needed — keep entries
// specific enough not to collide with legitimate travel vocabulary.
const BLOCKLIST = [
  "fuck",
  "shit",
  "bitch",
  "cunt",
  "asshole",
  "bastard",
  "dickhead",
  "motherfucker",
  "nigger",
  "nigga",
  "faggot",
  "retard",
  "rape",
  "rapist",
  "kike",
  "spic",
  "chink",
  "tranny",
];

// Build one case-insensitive regex: a word boundary BEFORE the stem (so "grape"
// never trips "rape", "Bangkok" never trips a slur), plus optional common
// inflections AFTER it (so "fucking", "fucked", "bitches" are caught, not just
// the bare stem). The in-call guard backstops anything that still slips through.
const BLOCK_RE = new RegExp(`\\b(${BLOCKLIST.join("|")})(s|es|ing|ed|er|ers|in)?\\b`, "i");

function gatherText(prefs: TripPreferences): string {
  return [prefs.prompt, prefs.notes, prefs.existingItinerary, ...(prefs.destinations ?? [])]
    .filter(Boolean)
    .join(" \n ");
}

export type GuardResult = { ok: true } | { ok: false; message: string };

// Screen the raw user input. Returns ok:false with a user-facing message when
// the input contains blocked language. Topicality is NOT checked here.
export function screenInput(prefs: TripPreferences): GuardResult {
  const text = gatherText(prefs);
  if (BLOCK_RE.test(text)) {
    return {
      ok: false,
      message:
        "Let's keep it about the trip. Please describe your Indonesia plans without offensive language.",
    };
  }
  return { ok: true };
}
