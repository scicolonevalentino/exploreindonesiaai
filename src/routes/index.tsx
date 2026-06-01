import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

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
          Indonesia AI Trip Planner
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
        "We match every activity to a real experience with a live price, and combine your stops into the tours operators actually sell.",
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

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const submit = useServerFn(joinWaitlist);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await submit({ data: { email } });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section
      className="w-full px-6 py-20 sm:py-28"
      style={{ backgroundColor: "var(--navy-mid)" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
          Join the waitlist
        </h2>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={status === "loading" || status === "done"}
            className="flex-1 px-5 py-3.5 rounded-lg bg-white text-base outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70"
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

        {status === "error" ? (
          <p className="mt-5 text-xs text-red-300">{errorMsg || "Couldn't sign you up. Try again."}</p>
        ) : (
          <p className="mt-5 text-xs text-white/55">
            No spam. Just your bookable Indonesia plan.
          </p>
        )}
      </div>
    </section>
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
    </main>
  );
}
