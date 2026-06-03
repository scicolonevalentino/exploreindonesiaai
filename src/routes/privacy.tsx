import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ExploreIndonesia.ai" },
      {
        name: "description",
        content:
          "How ExploreIndonesia.ai collects, uses, and protects your data. Cookies, analytics, email signups, and your rights.",
      },
      { property: "og:title", content: "Privacy Policy — ExploreIndonesia.ai" },
      { property: "og:url", content: "https://exploreindonesia.ai/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://exploreindonesia.ai/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--slate-muted)" }}>
          Last updated: June 2026
        </p>

        <div
          className="prose prose-sm sm:prose-base max-w-none"
          style={{ color: "var(--text-dark)" }}
        >
          <Section title="Who we are">
            <p>
              ExploreIndonesia.ai (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an independent
              travel-planning product. You can reach us via the contact form at the bottom of every
              page.
            </p>
          </Section>

          <Section title="What we collect">
            <ul>
              <li>
                <strong>Email address</strong>, only when you sign up for early access or contact
                us. Stored with our email provider (Brevo).
              </li>
              <li>
                <strong>Analytics data</strong> &mdash; pages viewed, basic device info, anonymised
                IP &mdash; via Google Analytics 4, Google Tag Manager, and Contentsquare. These load
                only after you accept cookies.
              </li>
              <li>
                <strong>Message content</strong> if you write to us through the contact form.
              </li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p>
              We default all non-essential cookies to &ldquo;denied&rdquo; using Google&rsquo;s
              Consent Mode. Until you click &ldquo;Accept all&rdquo; in the cookie banner, no
              analytics or measurement cookies are set. You can change your mind by clearing this
              site&rsquo;s storage in your browser and reloading.
            </p>
          </Section>

          <Section title="How we use your data">
            <ul>
              <li>Send you product updates if you joined the waitlist.</li>
              <li>Reply to messages you send via the contact form.</li>
              <li>Understand how visitors use the site, so we can improve it.</li>
            </ul>
            <p>We do not sell your personal data. We do not share it with advertisers.</p>
          </Section>

          <Section title="Affiliate links">
            <p>
              Some links on trip pages are affiliate links to partners like Booking.com, Viator,
              Klook, and others. If you book through one, we may earn a small commission &mdash; at
              no extra cost to you. These links are marked with{" "}
              <code>rel=&ldquo;sponsored&rdquo;</code>.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              Under GDPR you can ask us to access, correct, or delete your personal data, and to
              stop processing it. Email us and we&rsquo;ll respond within 30 days.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              If we materially change this policy, we&rsquo;ll update the date above and, where
              appropriate, notify waitlist subscribers.
            </p>
          </Section>
        </div>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
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
