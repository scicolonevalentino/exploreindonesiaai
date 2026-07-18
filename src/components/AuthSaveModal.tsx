// Signup/login modal shown when a signed-out visitor clicks "Save & Download"
// on a built itinerary. The whole registration happens in this popup:
// Google OAuth or email magic link, data-consent tick (required), marketing
// opt-in (optional, unticked — GDPR), optional phone. Before redirecting to
// auth, the caller stashes the built trip and this modal stashes the profile
// fields; both are restored + persisted when the user lands back signed in.

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleIcon } from "@/components/GoogleIcon";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { stashPendingProfile, markAuthPending } from "@/lib/supabase/profile";
import { trackEvent } from "@/lib/analytics-events";
import { toast } from "sonner";

export function AuthSaveModal({
  open,
  onOpenChange,
  onBeforeAuth,
  title = "Save your itinerary",
  description = "Create a free account to download the PDF and keep your trips in one place.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Caller stashes whatever must survive the redirect (a built trip, or the
  // pending prompt when this is the signup wall).
  onBeforeAuth: () => void;
  // Override the heading/subtitle so the same auth flow can serve both the
  // "save & download" moment and the anonymous generation-cap signup wall.
  title?: string;
  description?: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState<"google" | "email" | "verify" | null>(null);

  const stashAll = () => {
    onBeforeAuth();
    stashPendingProfile({
      first_name: firstName.trim() || undefined,
      last_name: lastName.trim() || undefined,
      phone: phone.trim() || undefined,
      marketing_opt_in: marketing,
      consent_at: new Date().toISOString(),
    });
  };

  const requireConsent = () => {
    if (!consent) {
      toast.error("Please agree to the Privacy Policy and Terms to continue.");
      return false;
    }
    return true;
  };

  const withGoogle = async () => {
    if (!requireConsent()) return;
    setBusy("google");
    trackEvent("signup_start", { method: "google" });
    markAuthPending("google");
    stashAll();
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
      },
    });
    if (error) {
      setBusy(null);
      toast.error("Google sign-in didn't start, please try again.");
    }
    // On success the browser navigates away; no further state needed.
  };

  const withEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !requireConsent()) return;
    setBusy("email");
    trackEvent("signup_start", { method: "email" });
    markAuthPending("email");
    stashAll();
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        // Mirror Google signups, which carry the name in user_metadata.
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        },
      },
    });
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  // Verify the 6-digit code IN PLACE — no redirect, so the built trip stashed in
  // localStorage always survives (the magic link could open in a different
  // browser, e.g. the Gmail in-app viewer on mobile, and lose it). On success
  // the session is set client-side; the page's signed-in effect finishes the
  // save + PDF download. The magic link in the same email still works as a
  // fallback for anyone who prefers it.
  const verifyCode = async (e: React.FormEvent) => {
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: "var(--cream)" }}>
        {sent ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl" style={{ color: "var(--navy-deep)" }}>
                Enter your code 📩
              </DialogTitle>
              <DialogDescription>
                We emailed a 6-digit code to <strong>{email}</strong>. Enter it below to finish — no
                need to leave this page. (The email also has a magic link if you prefer.)
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={verifyCode} className="flex flex-col gap-3 pt-1">
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
                className="w-full rounded-md border bg-white px-4 py-2.5 text-center text-lg tracking-[0.4em] outline-none focus:ring-2 focus:ring-ring"
                style={{ borderColor: "var(--border-cream)" }}
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
              type="button"
              onClick={() => {
                setSent(false);
                setOtp("");
              }}
              className="text-sm underline self-start"
              style={{ color: "var(--teal-link)" }}
            >
              Use a different email
            </button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl" style={{ color: "var(--navy-deep)" }}>
                {title}
              </DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 pt-1">
              <button
                type="button"
                onClick={withGoogle}
                disabled={busy !== null}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border bg-white px-5 py-3 text-sm font-semibold transition-colors hover:bg-black hover:text-white disabled:opacity-60"
                style={{ borderColor: "var(--border-cream)", color: "var(--navy-deep)" }}
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
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Name"
                    aria-label="First name"
                    autoComplete="given-name"
                    className="w-full rounded-md border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    style={{ borderColor: "var(--border-cream)" }}
                  />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    aria-label="Last name"
                    autoComplete="family-name"
                    className="w-full rounded-md border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    style={{ borderColor: "var(--border-cream)" }}
                  />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  autoComplete="email"
                  className="w-full rounded-md border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  style={{ borderColor: "var(--border-cream)" }}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile phone (optional)"
                  aria-label="Mobile phone (optional)"
                  autoComplete="tel"
                  className="w-full rounded-md border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  style={{ borderColor: "var(--border-cream)" }}
                />

                <label className="flex items-start gap-2.5 text-xs leading-relaxed">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                    aria-label="Agree to Privacy Policy and Terms"
                  />
                  <span style={{ color: "var(--navy-deep)" }}>
                    I agree to the{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                      style={{ color: "var(--teal-link)" }}
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                      style={{ color: "var(--teal-link)" }}
                    >
                      Terms
                    </a>
                    . *
                  </span>
                </label>

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

                <button
                  type="submit"
                  disabled={busy !== null}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full text-white transition-all bg-[var(--blue-bright)] hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60"
                >
                  {busy === "email" ? "Sending…" : "Email me a secure link"}{" "}
                  <span aria-hidden>→</span>
                </button>
              </form>

              <p className="text-center text-[11px] text-muted-foreground">
                🔒 Free account, no credit card ever, delete anytime.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
