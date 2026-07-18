import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { stashPendingProfile, markAuthPending } from "@/lib/supabase/profile";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleIcon } from "@/components/GoogleIcon";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  // Optional ?next=/path — where to land after auth completes.
  // Optional ?error=link — set by /auth/callback when a magic link is expired
  // or already used, so we can tell the user instead of showing a bare form.
  validateSearch: (search: Record<string, unknown>): { next?: string; error?: string } => ({
    ...(typeof search.next === "string" ? { next: search.next } : {}),
    ...(typeof search.error === "string" ? { error: search.error } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Log in or sign up, ExploreIndonesia.ai" },
      // Private page — keep it out of search engines.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { next, error: linkError } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState<"google" | "email" | "verify" | null>(null);

  // Returning users land on their trips; flows like the Save & Download wall
  // pass ?next= to come back where they started.
  const callback = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next ?? "/account")}`;

  // Carry the (optional) marketing opt-in through the auth redirect, the same
  // way the Save & Download modal does. Stash ONLY when ticked: a partial stash
  // never opts a returning user out, and flushPendingProfile leaves their name
  // and phone untouched. consent_at records when they agreed by continuing.
  const stashConsent = () => {
    if (!marketing) return;
    stashPendingProfile({
      marketing_opt_in: true,
      consent_at: new Date().toISOString(),
    });
  };

  async function withGoogle() {
    setBusy("google");
    markAuthPending("google");
    stashConsent();
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback() },
    });
    if (error) {
      setBusy(null);
      toast.error("Google sign-in didn't start, please try again.");
    }
  }

  async function withEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy("email");
    markAuthPending("email");
    stashConsent();
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: callback() },
    });
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  // Verify the 6-digit code in place (no redirect). On success the session is
  // set client-side; land the user where they were headed. /account (and /p1)
  // flush the pending consent and fire the login/sign_up event on arrival. The
  // magic link in the same email still works as a fallback.
  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    const token = otp.trim();
    if (token.length < 6) return;
    setBusy("verify");
    const supabase = getSupabaseBrowserClient();
    const addr = email.trim();
    // Existing users get an "email" (magic-link) OTP; brand-new signups (with
    // email confirmation on) get a "signup" OTP. A rejected verify doesn't
    // consume the token, so try "email" first and fall back to "signup".
    let { error } = await supabase.auth.verifyOtp({ email: addr, token, type: "email" });
    if (error) {
      ({ error } = await supabase.auth.verifyOtp({ email: addr, token, type: "signup" }));
    }
    setBusy(null);
    if (error) {
      toast.error("That code didn't work — check it and try again.");
      return;
    }
    // Full-page nav so the destination (/account or the ?next= page) runs its
    // signed-in effect: flush the pending consent and fire login/sign_up.
    window.location.assign(next ?? "/account");
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
          Log in or sign up
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access your saved itineraries, or create a free account to keep your trips and download
          them anytime.
        </p>

        {sent ? (
          <div
            className="mt-6 rounded-lg border p-4 text-sm"
            style={{ borderColor: "var(--teal-link)", color: "var(--navy-deep)" }}
          >
            <p className="font-medium">Enter your code 📩</p>
            <p className="mt-1 text-muted-foreground">
              We emailed a 6-digit code to <strong>{email}</strong>. Enter it below to continue — no
              need to leave this page. (The email also has a magic link if you prefer.)
            </p>
            <form onSubmit={verifyCode} className="mt-3 flex flex-col gap-3">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                aria-label="6-digit code"
                className="w-full rounded-md border border-[var(--border-cream)] bg-white px-4 py-2.5 text-center text-lg tracking-[0.4em] outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={busy !== null || otp.trim().length < 6}
                className="inline-flex w-full items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full text-white transition-all bg-[var(--blue-bright)] hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60"
              >
                {busy === "verify" ? "Verifying…" : "Verify & continue"} <span aria-hidden>→</span>
              </button>
            </form>
            <button
              onClick={() => {
                setSent(false);
                setOtp("");
              }}
              className="mt-3 text-sm underline"
              style={{ color: "var(--teal-link)" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {linkError === "link" && (
              <div
                role="alert"
                className="rounded-lg border p-3 text-sm"
                style={{ borderColor: "#e0533a", color: "#8a2c1c", backgroundColor: "#fdefec" }}
              >
                That sign-in link has expired or was already used. Request a new one below.
              </div>
            )}
            <button
              type="button"
              onClick={withGoogle}
              disabled={busy !== null}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border-cream)] bg-white px-5 py-3 text-sm font-semibold text-[var(--navy-deep)] transition-colors hover:bg-black hover:text-white disabled:opacity-60"
            >
              <GoogleIcon />
              {busy === "google" ? "Connecting…" : "Continue with Google"}
            </button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-[var(--border-cream)]" />
              or with your email
              <span className="h-px flex-1 bg-[var(--border-cream)]" />
            </div>

            <form onSubmit={withEmail} className="flex flex-col gap-3">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                autoComplete="email"
                className="w-full rounded-md border border-[var(--border-cream)] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={busy !== null}
                className="inline-flex w-full items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full text-white transition-all bg-[var(--blue-bright)] hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60"
              >
                {busy === "email" ? "Sending…" : "Email me a secure link"}{" "}
                <span aria-hidden>→</span>
              </button>
            </form>

            <label className="flex items-start gap-2.5 text-xs leading-relaxed">
              <Checkbox
                checked={marketing}
                onCheckedChange={(v) => setMarketing(v === true)}
                className="mt-0.5"
                aria-label="Receive travel tips and offers"
              />
              <span className="text-muted-foreground">
                Receive news about exclusive itinerary ideas &amp; hidden gems.
              </span>
            </label>

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              By continuing you agree to our{" "}
              <a href="/terms" className="underline" style={{ color: "var(--teal-link)" }}>
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline" style={{ color: "var(--teal-link)" }}>
                Privacy Policy
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
