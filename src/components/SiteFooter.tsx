import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { sendContactMessage } from "@/lib/contact.functions";
import { sanityClient } from "@/lib/sanity";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/lib/sanity-queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function useSiteSettings() {
  return useQuery({
    queryKey: ["sanity", "siteSettings"],
    queryFn: () => sanityClient.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
    staleTime: 5 * 60_000,
  });
}

const EMAIL_RE =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

function validateEmail(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Please enter your email address.";
  if (value.length > 254) return "Email is too long.";
  const [local, domain, ...rest] = value.split("@");
  if (!local || !domain || rest.length > 0) return "Email must contain a single \u201C@\u201D.";
  if (local.length > 64) return "The part before \u201C@\u201D is too long.";
  if (!EMAIL_RE.test(value)) return "That email doesn't look right. Check for typos.";
  return null;
}

function EmailCapture() {
  const { data: settings } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState(false);
  const mountedAtRef = useRef<number>(Date.now());
  const submit = useServerFn(joinWaitlist);

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  const liveError = touched ? validateEmail(email) : null;
  const showError = status === "error" || !!liveError;
  const message =
    status === "error" ? errorMsg || "Couldn't sign you up. Try again." : (liveError ?? "");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "done") return;
    setTouched(true);
    const validationError = validateEmail(email);
    if (validationError) {
      setStatus("error");
      setErrorMsg(validationError);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const result = await submit({
        data: {
          email: email.trim(),
          website,
          elapsedMs: Date.now() - mountedAtRef.current,
        },
      });
      setStatus("done");
      toast.success(
        result?.alreadySubscribed
          ? "You're already on the list — we'll keep you posted."
          : "You're on the list! Check your inbox soon.",
      );
    } catch (err) {
      setStatus("error");
      const raw = err instanceof Error ? err.message : "";
      const friendly = /too many/i.test(raw)
        ? "Too many attempts. Please try again in a minute."
        : /disposable/i.test(raw)
          ? "Please use a non-disposable email address."
          : /invalid.*email|email/i.test(raw) && raw.length < 200
            ? "That email doesn't look right. Check for typos."
            : "Couldn't sign you up. Please try again.";
      setErrorMsg(friendly);
      toast.error(friendly);
    }
  };

  return (
    <section
      id="early-access"
      className="w-full px-6 py-20 sm:py-28 scroll-mt-16"
      style={{ backgroundColor: "var(--navy-mid)" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        {settings?.tagline && (
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-white/60 mb-4">
            {settings.tagline}
          </p>
        )}
        <h2 className="font-serif text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
          Almost ready.
          {/* Always break after "Almost ready." so it sits on its own line. */}
          <br /> Be the first to book your AI itinerary to Indonesia.
        </h2>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              top: "auto",
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
          >
            <label>
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={254}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") {
                setStatus("idle");
                setErrorMsg("");
              }
            }}
            onBlur={() => setTouched(true)}
            placeholder="Enter your best email here"
            disabled={status === "loading" || status === "done"}
            aria-invalid={showError || undefined}
            aria-describedby="email-help"
            aria-label="Email address"
            className={`flex-1 px-5 py-3.5 rounded-lg bg-white text-base outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 ${
              showError ? "ring-2 ring-red-400" : ""
            }`}
            style={{ color: "var(--navy-mid)" }}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "done"}
            className="px-6 py-3.5 rounded-lg font-semibold text-white text-base transition-opacity hover:opacity-90 whitespace-nowrap disabled:opacity-70"
            style={{ backgroundColor: "var(--blue-bright)" }}
          >
            {status === "done"
              ? "You're on the list ✓"
              : status === "loading"
                ? "Adding…"
                : "Get early access →"}
          </button>
        </form>

        {status === "done" ? (
          <p
            id="email-help"
            role="status"
            aria-live="polite"
            className="mt-5 text-sm text-emerald-300"
          >
            🎉 Thanks! You're on the list — we'll email you as soon as early access opens.
          </p>
        ) : (
          <p
            id="email-help"
            role={showError ? "alert" : undefined}
            aria-live="polite"
            className={`mt-5 text-xs ${showError ? "text-red-300" : "text-white/55"}`}
          >
            {showError ? message : "No spam. Just updates when the booking experience is ready."}
          </p>
        )}
      </div>
    </section>
  );
}

function FooterBar() {
  const { data: settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; msg: boolean }>({
    name: false,
    email: false,
    msg: false,
  });
  const mountedAtRef = useRef<number>(Date.now());
  const send = useServerFn(sendContactMessage);

  useEffect(() => {
    if (open) mountedAtRef.current = Date.now();
  }, [open]);

  const reset = () => {
    setName("");
    setContactEmail("");
    setMsg("");
    setWebsite("");
    setStatus("idle");
    setErrorMsg("");
    setTouched({ name: false, email: false, msg: false });
  };

  const nameError = (() => {
    const v = name.trim();
    if (!v) return "Please enter your name.";
    if (v.length > 100) return "Name is too long.";
    return null;
  })();
  const emailError = validateEmail(contactEmail);
  const msgError = (() => {
    const m = msg.trim();
    if (m.length < 10) return "Please write at least 10 characters.";
    if (m.length > 2000) return "Message is too long.";
    return null;
  })();
  const validate = () => nameError ?? emailError ?? msgError;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "done") return;
    setTouched({ name: true, email: true, msg: true });
    const v = validate();
    if (v) {
      setStatus("error");
      setErrorMsg(v);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await send({
        data: {
          name: name.trim(),
          email: contactEmail.trim(),
          message: msg.trim(),
          website,
          elapsedMs: Date.now() - mountedAtRef.current,
        },
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      const raw = err instanceof Error ? err.message : "";
      setErrorMsg(
        /too many/i.test(raw)
          ? "Too many messages. Please try again in a minute."
          : "Couldn't send your message. Please try again.",
      );
    }
  };

  return (
    <footer
      className="w-full px-6 py-10 border-t"
      style={{ backgroundColor: "var(--navy-mid)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="mx-auto max-w-2xl flex flex-col items-center text-center gap-4">
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) reset();
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white border border-white/15 hover:bg-white/5 transition-colors"
            >
              <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400" aria-hidden="true" />
              Support the Project — contact us
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            {status === "done" ? (
              <>
                <DialogHeader>
                  <DialogTitle className="sr-only">Message sent</DialogTitle>
                  <DialogDescription className="sr-only">
                    Your message has been received.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 text-center text-base text-foreground">
                  Thanks for reaching out, we'll get back to you soon. 💚
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Write to the founder</DialogTitle>
                  <DialogDescription>
                    Ideas, feedback, or want to support the project? Drop a note: it goes straight
                    to the founder.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 pt-2">
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-10000px",
                      top: "auto",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                    }}
                  >
                    <label>
                      Website
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      placeholder="Your name"
                      aria-label="Your name"
                      aria-invalid={(touched.name && !!nameError) || undefined}
                      className={`w-full px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring ${
                        touched.name && nameError ? "border-red-500 ring-1 ring-red-400" : ""
                      }`}
                    />
                    {touched.name && nameError && (
                      <p role="alert" className="mt-1 text-xs text-red-500">
                        {nameError}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      required
                      maxLength={254}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      placeholder="Your email"
                      aria-label="Your email"
                      aria-invalid={(touched.email && !!emailError) || undefined}
                      className={`w-full px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring ${
                        touched.email && emailError ? "border-red-500 ring-1 ring-red-400" : ""
                      }`}
                    />
                    {touched.email && emailError && (
                      <p role="alert" className="mt-1 text-xs text-red-500">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <textarea
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={5}
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, msg: true }))}
                      placeholder="Your message…"
                      aria-label="Your message"
                      aria-invalid={(touched.msg && !!msgError) || undefined}
                      className={`w-full px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none ${
                        touched.msg && msgError ? "border-red-500 ring-1 ring-red-400" : ""
                      }`}
                    />
                    {touched.msg && msgError && (
                      <p role="alert" className="mt-1 text-xs text-red-500">
                        {msgError}
                      </p>
                    )}
                  </div>

                  {status === "error" && errorMsg && !nameError && !emailError && !msgError && (
                    <p role="alert" className="text-xs text-red-500">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-1 px-5 py-2.5 rounded-md font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-70"
                    style={{ backgroundColor: "var(--blue-bright)" }}
                  >
                    {status === "loading" ? "Sending…" : "Send message"}
                  </button>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>

        <nav className="flex gap-4 text-xs text-white/60">
          <a href="/privacy" className="hover:text-white underline-offset-2 hover:underline">
            Privacy
          </a>
          <a href="/terms" className="hover:text-white underline-offset-2 hover:underline">
            Terms
          </a>
        </nav>
        <p className="text-xs text-white/50 max-w-xl whitespace-pre-line leading-relaxed">
          {(settings?.footerText ?? `© ${new Date().getFullYear()} exploreindonesia.ai`)
            .replace(/\s*We may earn a commission[^.]*\.\s*/gi, " ")
            .trim()}
        </p>
      </div>
    </footer>
  );
}

export function SiteFooter() {
  return (
    <>
      <EmailCapture />
      <FooterBar />
    </>
  );
}
