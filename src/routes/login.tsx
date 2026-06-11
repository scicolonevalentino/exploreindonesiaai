import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  // Optional ?next=/path — where to land after the magic link is confirmed.
  validateSearch: (search: Record<string, unknown>): { next?: string } =>
    typeof search.next === "string" ? { next: search.next } : {},
  head: () => ({
    meta: [
      { title: "Sign in — ExploreIndonesia.ai" },
      // Private page — keep it out of search engines.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { next } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const callback = `${window.location.origin}/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ""
    }`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <Link to="/" className="text-sm" style={{ color: "var(--teal-link)" }}>
          ← Home
        </Link>

        <h1
          className="mt-4 font-serif text-3xl font-semibold"
          style={{ color: "var(--navy-deep)" }}
        >
          Sign in
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          To save your itineraries and download them as a PDF. We'll email you a secure sign-in link
          — no password needed.
        </p>

        {sent ? (
          <div
            className="mt-6 rounded-lg border p-4 text-sm"
            style={{ borderColor: "var(--teal-link)", color: "var(--navy-deep)" }}
          >
            <p className="font-medium">Check your inbox 📩</p>
            <p className="mt-1 text-muted-foreground">
              We sent a sign-in link to <strong>{email}</strong>. Open it on this device to
              continue.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-3 text-sm underline"
              style={{ color: "var(--teal-link)" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              type="email"
              required
              autoFocus
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Email me a sign-in link"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
