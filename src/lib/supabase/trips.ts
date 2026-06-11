// Saved-trip persistence via the browser Supabase client. Row-Level Security
// (policy "own saved_trips") scopes every read/write to the signed-in user, so
// these helpers never pass user_id for reads and only set it on insert.

import { getSupabaseBrowserClient } from "./client";
import type { Insight, Trip } from "@/lib/trip/types";

// Everything needed to re-render / re-download a trip later. Stored in the
// jsonb `trip_json` column. `added` is the serialized Set of "${day}-${i}" keys
// the user had toggled on at save time.
export type SavedTripPayload = {
  trip: Trip;
  insights: Insight[];
  added: string[];
};

export type SavedTripRow = {
  id: string;
  title: string | null;
  prompt: string | null;
  trip_json: SavedTripPayload;
  created_at: string;
};

export async function saveTrip(args: {
  trip: Trip;
  insights: Insight[];
  added: Set<string>;
  prompt: string;
}): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const payload: SavedTripPayload = {
    trip: args.trip,
    insights: args.insights,
    added: [...args.added],
  };

  const { data, error } = await supabase
    .from("saved_trips")
    .insert({
      user_id: user.id,
      title: args.trip.title,
      prompt: args.prompt,
      trip_json: payload,
    })
    .select("id")
    .single();

  if (error) throw error;
  return (data as { id: string }).id;
}

export async function listTrips(): Promise<SavedTripRow[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("saved_trips")
    .select("id,title,prompt,trip_json,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as SavedTripRow[];
}

export async function deleteTrip(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("saved_trips").delete().eq("id", id);
  if (error) throw error;
}
