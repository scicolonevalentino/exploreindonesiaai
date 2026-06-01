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
          <span className="italic font-normal" style={{ color: "var(--gold-warm)" }}>
            We make it bookable.
          </span>
        </h1>

        <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-white/85 font-light">
          Paste the Indonesia itinerary you already have — from ChatGPT, a blog, or
          your notes — and we turn it into a day-by-day plan you can actually book,
          through the world's most trusted travel companies. You approve every booking.
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
        "Drop in the itinerary you already have. No starting over, no forms to fill — just paste and go.",
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
        "See your whole trip in one place. Approve what you want, one tap at a time. Free tips and self-guided stops stay in too.",
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

        <p
          className="text-center mt-16 text-base sm:text-lg font-semibold"
          style={{ color: "var(--blue-bright)" }}
        >
          You approve every booking. Nothing is ever booked automatically.
        </p>
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
    { name: "12Go", color: "#2f4fe0" },
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
          Bookable with the world's most trusted travel companies
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

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      className="w-full px-6 py-20 sm:py-28"
      style={{ backgroundColor: "var(--navy-mid)" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
          Already have an Indonesia itinerary?
        </h2>
        <p
          className="mt-5 text-base sm:text-lg"
          style={{ color: "var(--blue-soft)" }}
        >
          Paste it in and see your bookable trip in seconds. Join the early access list.
        </p>

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
            className="flex-1 px-5 py-3.5 rounded-lg bg-white text-base outline-none focus:ring-2 focus:ring-offset-2"
            style={{ color: "var(--navy-mid)" }}
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-lg font-semibold text-white text-base transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "var(--blue-bright)" }}
          >
            {submitted ? "You're on the list ✓" : "Get early access →"}
          </button>
        </form>

        <p className="mt-5 text-xs text-white/55">
          No spam. Just your bookable Indonesia plan.
        </p>
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
      <EmailCapture />
    </main>
  );
}
