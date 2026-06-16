import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/lib/supabase/useUser";
import { getTrip, updateTripItinerary } from "@/lib/supabase/trips";
import { getCreditBalance } from "@/lib/supabase/credits";
import type { ItineraryItem, Insight, Trip } from "@/lib/trip/types";
import { trackEvent } from "@/lib/analytics-events";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/edit/$id")({
  head: () => ({
    meta: [
      { title: "Edit with AI, ExploreIndonesia.ai" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EditPage,
});

function EditPage() {
  const { id } = useParams({ from: "/edit/$id" });
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const [instruction, setInstruction] = useState("");
  const [editing, setEditing] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  // null until we know; true if this trip's next edit is still the free one.
  const [freeNext, setFreeNext] = useState<boolean | null>(null);
  const [dirty, setDirty] = useState(false); // an edit has been applied but not saved
  const [saving, setSaving] = useState(false);
  // After an edit, which items changed vs the previous version (by global index),
  // so the user can see what the AI actually did.
  const [changes, setChanges] = useState<Map<number, "new" | "updated">>(new Map());
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    void getCreditBalance().then(setBalance);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingTrip(true);
    getTrip(id)
      .then((row) => {
        if (!row) {
          toast.error("Trip not found.");
          navigate({ to: "/account" });
          return;
        }
        setTrip(row.trip_json.trip);
        setInsights(row.trip_json.insights ?? []);
        setFreeNext((row.ai_edits_used ?? 0) === 0);
      })
      .catch(() => toast.error("Couldn't load that trip."))
      .finally(() => setLoadingTrip(false));
  }, [user, id, navigate]);

  const toggleLock = useCallback((key: string) => {
    setLocked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const runEdit = useCallback(async () => {
    const text = instruction.trim();
    if (text.length < 3 || editing) return;
    setEditing(true);
    setChanges(new Map());
    const prevItems = trip?.items ?? [];
    trackEvent("trip_edit_start", { trip_id: id, locked: locked.size });

    let meta: { title: string; summary: string; days: number } | null = null;
    const collected: ItineraryItem[] = [];
    let refusal = "";
    let streamError = false;

    try {
      const res = await fetch("/api/trip/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: id, instruction: text, locked: [...locked] }),
      });

      if (res.status === 402) {
        toast.error("You're out of credits. Top up to keep refining.");
        navigate({ to: "/credits" });
        return;
      }
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "edit_failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() ?? "";
        for (const evt of events) {
          const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          let msg: {
            type: string;
            meta?: typeof meta;
            item?: ItineraryItem;
            insights?: Insight[];
            reason?: string;
            free?: boolean;
          };
          try {
            msg = JSON.parse(dataLine.slice(5).trim());
          } catch {
            continue;
          }
          if (msg.type === "meta" && msg.meta) meta = msg.meta;
          else if (msg.type === "item" && msg.item) collected.push(msg.item);
          else if (msg.type === "insights") setInsights(msg.insights ?? []);
          else if (msg.type === "refusal") refusal = msg.reason ?? "Couldn't apply that change.";
          else if (msg.type === "charged") {
            toast.success(msg.free ? "Free edit applied." : "1 credit used.");
            setFreeNext(false);
          } else if (msg.type === "error") streamError = true;
        }
      }

      if (refusal) {
        toast.error(refusal);
        return;
      }
      if (streamError || !meta || collected.length === 0) {
        throw new Error("edit_failed");
      }
      const finalMeta = meta as { title: string; summary: string; days: number };

      // Re-price the revised plan (same matcher as generation).
      let items = collected;
      try {
        const matchRes = await fetch("/api/public/match-trip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: collected }),
        });
        if (matchRes.ok) items = ((await matchRes.json()) as { items: ItineraryItem[] }).items;
      } catch {
        // keep unmatched plan, still useful
      }

      // Tag what changed vs the previous version so the user can spot the AI's
      // edits. Match by (normalized) title: a title not seen before is "new",
      // a same-title item with a different description is "updated".
      const norm = (s: string) => s.trim().toLowerCase();
      // Word-set similarity, so trivial rewording isn't flagged as a change —
      // only a substantially different description counts as "updated".
      const wordsOf = (s: string) =>
        new Set(
          (s ?? "")
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .split(/\s+/)
            .filter(Boolean),
        );
      const substantiallyDifferent = (a: string, b: string) => {
        const wa = wordsOf(a);
        const wb = wordsOf(b);
        if (wa.size === 0 && wb.size === 0) return false;
        const union = new Set([...wa, ...wb]).size;
        const inter = [...wa].filter((w) => wb.has(w)).length;
        return union ? inter / union < 0.6 : false; // <60% overlap = real change
      };
      const prevByTitle = new Map(prevItems.map((it) => [norm(it.title), it]));
      const changeMap = new Map<number, "new" | "updated">();
      items.forEach((it, i) => {
        const prev = prevByTitle.get(norm(it.title));
        if (!prev) changeMap.set(i, "new");
        else if (substantiallyDifferent(prev.description ?? "", it.description ?? ""))
          changeMap.set(i, "updated");
      });
      setChanges(changeMap);

      setTrip({ ...finalMeta, items });
      setLocked(new Set()); // indices shifted, clear locks
      setInstruction("");
      setDirty(true);
      void getCreditBalance().then(setBalance);
      trackEvent("trip_edit_applied", { trip_id: id });
    } catch {
      toast.error("Couldn't apply that change, please try again.");
    } finally {
      setEditing(false);
    }
  }, [instruction, editing, id, locked, navigate, trip]);

  // Gate before spending: the free first edit runs straight away; a paid edit
  // asks for confirmation, or routes to /credits when the wallet is empty.
  const handleApply = useCallback(() => {
    if (instruction.trim().length < 3 || editing) return;
    if (freeNext) {
      void runEdit();
      return;
    }
    if (balance !== null && balance < 1) {
      toast.error("You're out of credits. Top up to keep refining.");
      navigate({ to: "/credits" });
      return;
    }
    setConfirmOpen(true);
  }, [instruction, editing, freeNext, balance, runEdit, navigate]);

  const save = useCallback(async () => {
    if (!trip) return;
    setSaving(true);
    try {
      await updateTripItinerary(id, { trip, insights });
      toast.success("Trip saved.");
      navigate({ to: "/account" });
    } catch {
      toast.error("Couldn't save. Please try again.");
      setSaving(false);
    }
  }, [trip, insights, id, navigate]);

  if (loading || !user || loadingTrip || !trip) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/account"
            className="text-sm font-semibold"
            style={{ color: "var(--teal-link)" }}
          >
            ← My trips
          </Link>
          <span className="text-xs text-muted-foreground">
            {balance === null ? "…" : `${balance} credit${balance === 1 ? "" : "s"}`}
          </span>
        </div>

        <h1
          className="mt-4 font-serif text-3xl sm:text-4xl font-semibold"
          style={{ color: "var(--navy-deep)" }}
        >
          {trip.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lock anything you love, then tell the AI what to change. {""}
          {freeNext ? "Your first edit on this trip is free." : "Each edit uses 1 credit."}
        </p>

        {/* The edit prompt */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. make day 3 cheaper, add a dive day, I'm vegetarian, lock the Ubud hotel and re-plan the rest"
            rows={3}
            className="w-full text-sm leading-6 p-3 rounded-lg border bg-white resize-y focus:outline-none focus:ring-2 focus:ring-[var(--blue-bright)]"
            style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {locked.size > 0
                ? `${locked.size} item${locked.size === 1 ? "" : "s"} locked`
                : "Nothing locked"}
            </span>
            <Button
              onClick={handleApply}
              disabled={editing || instruction.trim().length < 3}
              className="text-white font-semibold"
              style={{ backgroundColor: "#7c3aed" }}
            >
              {editing ? "Refining…" : freeNext ? "✦ Apply with AI (free)" : "✦ Apply with AI"}
            </Button>
          </div>
        </div>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Use 1 credit for this edit?</AlertDialogTitle>
              <AlertDialogDescription>
                Refining this trip will use 1 credit. You have {balance ?? 0} credit
                {balance === 1 ? "" : "s"} left. Changing one thing or several in this prompt still
                counts as a single edit.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setConfirmOpen(false);
                  void runEdit();
                }}
                style={{ backgroundColor: "#7c3aed" }}
              >
                Use 1 credit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {dirty && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm">
            <span className="text-sm" style={{ color: "var(--navy-deep)" }}>
              {(() => {
                const added = [...changes.values()].filter((c) => c === "new").length;
                const updated = [...changes.values()].filter((c) => c === "updated").length;
                const parts = [];
                if (added) parts.push(`${added} added`);
                if (updated) parts.push(`${updated} updated`);
                return parts.length
                  ? `Edit applied (${parts.join(", ")}, highlighted below). Save to keep it.`
                  : "Edit applied. Save to keep it.";
              })()}
            </span>
            <Button
              onClick={() => void save()}
              disabled={saving}
              className="text-white font-semibold"
              style={{ backgroundColor: "var(--teal-link)" }}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        )}

        {/* The itinerary, grouped by day, each item lockable */}
        <div className="mt-6 space-y-6">
          {Array.from(new Set(trip.items.map((i) => i.day)))
            .sort((a, b) => a - b)
            .map((day) => (
              <section key={day}>
                <h2
                  className="font-serif text-lg font-semibold mb-2"
                  style={{ color: "var(--navy-deep)" }}
                >
                  Day {day}
                </h2>
                <ul className="space-y-2">
                  {trip.items.map((item, gi) => {
                    if (item.day !== day) return null;
                    const isLocked = locked.has(String(gi));
                    const tag = changes.get(gi);
                    return (
                      <li
                        key={gi}
                        className="rounded-xl p-3 shadow-sm border"
                        style={{
                          borderColor:
                            tag === "new"
                              ? "#16a34a"
                              : tag === "updated"
                                ? "#d97706"
                                : "var(--border-cream)",
                          backgroundColor:
                            tag === "new" ? "#f0fdf4" : tag === "updated" ? "#fffbeb" : "#fff",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground flex flex-wrap items-center gap-2">
                              <span>
                                {item.time}
                                {item.suggested ? " · Recommended" : ""}
                              </span>
                              {tag && (
                                <span
                                  className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                                  style={{
                                    backgroundColor: tag === "new" ? "#16a34a" : "#d97706",
                                  }}
                                >
                                  {tag === "new" ? "NEW" : "UPDATED"}
                                </span>
                              )}
                            </p>
                            <p
                              className="font-semibold text-sm"
                              style={{ color: "var(--navy-deep)" }}
                            >
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            aria-pressed={isLocked}
                            onClick={() => toggleLock(String(gi))}
                            className="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border transition-colors"
                            style={
                              isLocked
                                ? {
                                    backgroundColor: "var(--navy-deep)",
                                    color: "#fff",
                                    borderColor: "var(--navy-deep)",
                                  }
                                : {
                                    backgroundColor: "#fff",
                                    color: "var(--navy-deep)",
                                    borderColor: "var(--border-cream)",
                                  }
                            }
                            title={
                              isLocked
                                ? "Locked: the AI will keep this exactly as-is"
                                : "Lock: keep this item unchanged when the AI re-plans"
                            }
                          >
                            {isLocked ? "🔒 Locked" : "🔓 Lock"}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
        </div>
      </div>
    </main>
  );
}
