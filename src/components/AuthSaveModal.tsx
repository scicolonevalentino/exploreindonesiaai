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
import { stashPendingProfile } from "@/lib/supabase/profile";
import { trackEvent } from "@/lib/analytics-events";
import { toast } from "sonner";

export function AuthSaveModal({
  open,
  onOpenChange,
  onBeforeAuth,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Caller stashes the built trip to localStorage so it survives the redirect.
  onBeforeAuth: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState<"google" | "email" | null>(null);

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
      toast.error("Google sign-in didn't start — please try again.");
    }
    // On success the browser navigates away; no further state needed.
  };

  const withEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !requireConsent()) return;
    setBusy("email");
    trackEvent("signup_start", { method: "email" });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: "var(--cream)" }}>
        {sent ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl" style={{ color: "var(--navy-deep)" }}>
                Check your inbox 📩
              </DialogTitle>
              <DialogDescription>
                We sent a secure link to <strong>{email}</strong>. Open it on this device — your
                itinerary will be saved and the download will start automatically.
              </DialogDescription>
            </DialogHeader>
            <button
              type="button"
              onClick={() => setSent(false)}
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
                Save your itinerary
              </DialogTitle>
              <DialogDescription>
                Create a free account to download the PDF and keep your trips in one place.
              </DialogDescription>
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
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
