import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { sendContactMessage } from "@/lib/contact.functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "exploreindonesia.ai — Turn your Indonesia itinerary into a bookable trip" },
      {
        name: "description",
        content:
          "Paste the Indonesia itinerary you already have and we turn it into a day-by-day plan you can actually book through the world's most trusted travel companies.",
      },
      { property: "og:title", content: "exploreindonesia.ai — Indonesia AI Trip Planner" },
      {
        property: "og:description",
        content:
          "Paste your Indonesia itinerary and get a bookable, day-by-day plan in seconds.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <div className="font-sans text-base sm:text-lg font-bold tracking-tight">
      <span className="text-white">exploreindonesia</span>
      <span style={{ color: "var(--blue-ice)" }}>.ai</span>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--navy-deep) 0%, var(--blue-bright) 100%)",
      }}
    >
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10">
        <Logo />
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 text-center">
        <p
          className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-6"
          style={{ color: "var(--blue-soft)" }}
        >
          AI itinerary planning, powered by real experiences
        </p>

        <h1 className="font-serif text-white leading-[1.1] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold">
          You've planned the trip.
          <br />
          <span className="italic font-normal bg-transparent text-lime-950" style={{ color: "var(--gold-warm)" }}>
            We make it bookable.
          </span>
        </h1>

        <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-white/85 font-light">
          Paste the Indonesia itinerary you already have - from ChatGPT, a blog, or
          your notes - and we turn it into a day-by-day plan you can actually book,
          through the world's most trusted travel organizations.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Paste your plan",
      body:
        "Drop in the itinerary you already have. No starting over, no forms to fill, just paste and go.",
    },
    {
      n: 2,
      title: "We make it bookable",
      body:
        "We match your itinerary with vetted experiences from trusted travel platforms and local operators",
    },
    {
      n: 3,
      title: "Review and book",
      body:
        "See your whole trip in one place. Approve what you want, one tap at a time.",
    },
  ];

  return (
    <section
      className="w-full px-6 py-20 sm:py-28"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-center mb-14"
          style={{ color: "var(--teal-link)" }}
        >
          How it works
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {steps.map((s) => (
            <div key={s.n} className="text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg mb-6 mx-auto md:mx-0"
                style={{ backgroundColor: "var(--blue-bright)" }}
              >
                {s.n}
              </div>
              <h3
                className="font-serif text-2xl font-semibold mb-3"
                style={{ color: "var(--navy-mid)" }}
              >
                {s.title}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-dark)" }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const partners = [
    { name: "Viator", color: "#1f9e87" },
    { name: "Klook", color: "#ef7a23" },
    { name: "Booking.com", color: "#1b3aa0" },
    { name: "GetYourGuide", color: "#e0533a" },
    { name: "12Go", color: "#0d9488" },
  ];

  return (
    <section
      className="w-full px-6 pb-24 pt-4"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-center mb-10 max-w-3xl mx-auto"
          style={{ color: "var(--slate-muted)" }}
        >
          Outstanding experiences and real-time prices. From the brands you already trust.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
          {partners.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-xl px-5 py-3 sm:px-7 sm:py-4 border"
              style={{ borderColor: "var(--border-cream)" }}
            >
              <span className="font-bold text-base sm:text-lg" style={{ color: p.color }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>

        <p
          className="text-center text-base"
          style={{ color: "var(--text-dark)" }}
        >
          Behind these names sit thousands of vetted local operators across Indonesia.
        </p>
      </div>
    </section>
  );
}

function Inspiration() {
  const trips = [
    { title: "Bali & Nusa Islands", days: "10 days", tag: "Beaches · Temples · Cliffs" },
    { title: "Yogyakarta & Java", days: "7 days", tag: "Borobudur · Prambanan · Bromo" },
    { title: "Raja Ampat", days: "9 DAYS", tag: "Diving · Reefs · Remote" },
    { title: "Komodo & Flores", days: "8 days", tag: "Dragons · Reefs · Wilderness" },
  ];

  return (
    <section
      className="w-full px-6 py-20 sm:py-28"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "var(--teal-link)" }}
          >
            Need inspiration?
          </p>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
            style={{ color: "var(--navy-mid)" }}
          >
            Browse our top selection of Indonesia trips
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-dark)" }}>
            Hand-picked routes across the archipelago. Start from one, make it yours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trips.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border p-6 transition-colors hover:border-current"
              style={{ borderColor: "var(--border-cream)", backgroundColor: "var(--cream)" }}
            >
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "var(--teal-link)" }}>
                {t.days}
              </p>
              <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: "var(--navy-mid)" }}>
                {t.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--slate-muted)" }}>
                {t.tag}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/trips"
            className="inline-flex items-center gap-2 font-semibold text-base px-7 py-3.5 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--blue-bright)" }}
          >
            Explore all trips →
          </a>
        </div>
      </div>
    </section>
  );
}

// Stricter than the browser's built-in: requires a TLD of 2+ letters,
// rejects consecutive dots, leading/trailing dots, and spaces.
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
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
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
    status === "error"
      ? errorMsg || "Couldn't sign you up. Try again."
      : liveError ?? "";

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
      className="w-full px-6 py-20 sm:py-28"
      style={{ backgroundColor: "var(--navy-mid)" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
          Almost ready. Be the first to book your AI itinerary to Indonesia.
        </h2>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
        >
          {/* Honeypot — hidden from humans, visible to bots */}
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
            {showError ? message : "No spam. Just your bookable plan in Indonesia."}
          </p>
        )}
      </div>
    </section>
  );
}


function Footer() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
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


  const validate = () => {
    if (!name.trim()) return "Please enter your name.";
    if (name.trim().length > 100) return "Name is too long.";
    if (!validateEmail(contactEmail)) {
      // re-use existing validator (returns null when valid)
    }
    const emailErr = validateEmail(contactEmail);
    if (emailErr) return emailErr;
    const m = msg.trim();
    if (m.length < 10) return "Please write at least 10 characters.";
    if (m.length > 2000) return "Message is too long.";
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "done") return;
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
          : "Couldn't send your message. Please try again."
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
              <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400" />
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
                    Ideas, feedback, or want to support the project? Drop a note: it goes straight to the founder.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 pt-2">
                {/* Honeypot field — hidden from humans, visible to bots */}
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
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="email"
                  required
                  maxLength={254}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your email"
                  className="px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Your message…"
                  className="px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />

                {status === "error" && errorMsg && (
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

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} exploreindonesia.ai
        </p>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Trust />
      <Inspiration />
      <EmailCapture />
      <Footer />
    </main>
  );
}
