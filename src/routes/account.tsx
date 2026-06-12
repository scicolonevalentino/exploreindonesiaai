import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/lib/supabase/useUser";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { listTrips, deleteTrip, type SavedTripRow } from "@/lib/supabase/trips";
import { downloadItineraryPdf } from "@/lib/trip/pdf";
import { QuoteRequestModal } from "@/components/QuoteRequestModal";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — ExploreIndonesia.ai" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<SavedTripRow[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  // The trip whose "arrange for me" quote popup is open (null = closed).
  const [quoteTrip, setQuoteTrip] = useState<SavedTripRow | null>(null);

  // Client-side guard: bounce signed-out visitors to the login page.
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  const loadTrips = useCallback(() => {
    if (!user) return;
    setTripsLoading(true);
    listTrips()
      .then(setTrips)
      .catch(() => toast.error("Couldn't load your saved trips."))
      .finally(() => setTripsLoading(false));
  }, [user]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    navigate({ to: "/login" });
  }

  const [deleting, setDeleting] = useState(false);

  async function deleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) throw new Error("delete_failed");
      // Server already cleared the session cookies; reset the client too.
      await getSupabaseBrowserClient().auth.signOut();
      toast.success("Your account and all your data have been deleted.");
      navigate({ to: "/" });
    } catch {
      toast.error("Couldn't delete your account — please try again or contact us.");
      setDeleting(false);
    }
  }

  function downloadRow(row: SavedTripRow) {
    const { trip, insights, added } = row.trip_json;
    downloadItineraryPdf(trip, new Set(added ?? []), insights ?? []);
  }

  async function removeRow(row: SavedTripRow) {
    const prev = trips;
    setTrips((t) => t.filter((x) => x.id !== row.id)); // optimistic
    try {
      await deleteTrip(row.id);
      toast.success("Trip removed.");
    } catch {
      setTrips(prev); // roll back
      toast.error("Couldn't remove that trip.");
    }
  }

  if (loading || !user) {
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
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <Link to="/" className="text-sm" style={{ color: "var(--teal-link)" }}>
          ← Home
        </Link>

        <h1
          className="mt-4 font-serif text-4xl font-semibold"
          style={{ color: "var(--navy-deep)" }}
        >
          My account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <strong>{user.email}</strong>
        </p>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--navy-deep)" }}>
            Saved itineraries
          </h2>
          <Link to="/p1" className="text-sm font-medium" style={{ color: "var(--teal-link)" }}>
            + Build a new trip
          </Link>
        </div>

        {tripsLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your trips…</p>
        ) : trips.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              No saved trips yet. Build one in the planner and hit{" "}
              <strong>Save &amp; Download</strong> — it'll appear here.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {trips.map((row) => {
              const days = row.trip_json?.trip?.days;
              const created = new Date(row.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return (
                <li
                  key={row.id}
                  className="rounded-2xl bg-white p-5 shadow-sm flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p
                      className="font-serif text-lg font-semibold truncate"
                      style={{ color: "var(--navy-deep)" }}
                    >
                      {row.title || "Untitled trip"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {days ? `${days} days · ` : ""}Saved {created}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => downloadRow(row)}>
                      Download PDF
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        trackEvent("quote_cta_click", { trip_id: row.id, title: row.title });
                        setQuoteTrip(row);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors hover:brightness-95"
                      style={{ backgroundColor: "var(--gold-warm)", color: "var(--navy-deep)" }}
                    >
                      Get this trip arranged for you
                    </button>
                    <Button size="sm" variant="ghost" onClick={() => removeRow(row)}>
                      Delete
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={deleting}
                className="text-xs text-red-600/80 underline-offset-2 hover:underline disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete my account"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes your account, all saved itineraries, and your profile
                  data. It cannot be undone. Itineraries you already downloaded as PDF stay on your
                  device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my account</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteAccount}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <QuoteRequestModal
        trip={quoteTrip}
        open={!!quoteTrip}
        onOpenChange={(o) => {
          if (!o) setQuoteTrip(null);
        }}
        userEmail={user.email ?? ""}
        userName={(user.user_metadata?.full_name as string | undefined) ?? ""}
      />
    </main>
  );
}
