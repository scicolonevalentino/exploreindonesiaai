import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ExploreIndonesia.ai" },
      {
        name: "description",
        content:
          "The terms that apply when you use ExploreIndonesia.ai — itinerary content, affiliate bookings, and limits of liability.",
      },
      { property: "og:title", content: "Terms of Service — ExploreIndonesia.ai" },
      { property: "og:url", content: "https://exploreindonesia.ai/terms" },
    ],
    links: [{ rel: "canonical", href: "https://exploreindonesia.ai/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link to="/" className="text-sm" style={{ color: "var(--teal-link)" }}>
          ← Home
        </Link>
        <h1
          className="font-serif text-4xl sm:text-5xl font-semibold mt-4 mb-2"
          style={{ color: "var(--navy-deep)" }}
        >
          Terms of Service
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--slate-muted)" }}>
          Last updated: June 2026
        </p>

        <div className="space-y-6" style={{ color: "var(--text-dark)" }}>
          <Section title="Acceptance">
            <p>
              By using ExploreIndonesia.ai you agree to these terms. If you do not agree, please
              don&rsquo;t use the site.
            </p>
          </Section>

          <Section title="What this site is">
            <p>
              ExploreIndonesia.ai is an editorial travel-planning product. We publish itineraries
              and help you turn them into bookable plans via third-party travel partners. We are not
              a travel agency, tour operator, or booking platform of record.
            </p>
          </Section>

          <Section title="Third-party bookings">
            <p>
              When you click through to a partner (Booking.com, Viator, Klook, GetYourGuide, 12Go,
              Agoda, and others), your booking is governed by that partner&rsquo;s terms. Pricing,
              availability, and cancellation policies are theirs &mdash; not ours.
            </p>
          </Section>

          <Section title="Content">
            <p>
              Itineraries, photos, and copy on this site are owned by ExploreIndonesia.ai or
              licensed from contributors. You&rsquo;re welcome to share short excerpts with
              attribution. Don&rsquo;t republish full articles without permission.
            </p>
          </Section>

          <Section title="No travel guarantee">
            <p>
              Travel involves risk. Routes, hours, prices, and safety conditions change. We do our
              best to keep things current, but you&rsquo;re responsible for checking visas,
              vaccinations, insurance, and on-the-ground conditions before you go.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the maximum extent permitted by law, ExploreIndonesia.ai is not liable for any
              indirect, incidental, or consequential damages arising from your use of the site or
              any third-party booking made through it.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update these terms. Continued use of the site after a change means you accept
              the new terms.
            </p>
          </Section>
        </div>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="font-serif text-2xl font-semibold mt-8 mb-3"
        style={{ color: "var(--navy-mid)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
