import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { JsonLd } from "@/components/JsonLd";
import { setCdnCache } from "@/lib/cdn-cache";
import { trackEvent } from "@/lib/analytics-events";

// The Airalo eSIM CTA reuses the same Travelpayouts smart link the trip builder
// injects (env: AIRALO_AFFILIATE_LINK). One source of truth; if it is unset we
// fall back to a plain airalo.com link, which the Travelpayouts Drive loader
// still monetises client-side after marketing consent.
const getAiraloLink = createServerFn({ method: "GET" }).handler(() => {
  return process.env.AIRALO_AFFILIATE_LINK || "https://www.airalo.com/";
});

// Retargeted 2026-08-14 from the generic "visa" intent to "visa on arrival".
// On the head terms we are nowhere: "indonesia visa" sits at position 61.1 and
// "indonesia visit visa requirements" at 59.8. The visa-on-arrival family is the
// only sub-intent where we compete, led by "indonesia visa on arrival fee 2026"
// at position 10.0, and neither "visa on arrival" nor "fees" was in the title.
// Old values, for a fast revert:
//   TITLE:       Indonesia Visa Guide 2026: eVOA, Requirements & Entry Rules
//   DESCRIPTION: Everything EU, US and Australian travelers need to know about
//                entering Indonesia in 2026, eVOA, costs, extension rules and
//                the All Indonesia arrival card.
const TITLE = "Indonesia Visa on Arrival 2026: Fees, eVOA & Entry Rules";
const DESCRIPTION =
  "Indonesia's visa on arrival costs IDR 500,000 (about $32) for 30 days, extendable once. How to get the eVOA online, who needs one, and the 2026 entry rules.";
const URL = "https://exploreindonesia.ai/visa-guide";

// FAQ content, used for both the visible Q&A and the FAQPage JSON-LD so the two
// never drift apart.
const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "Do EU citizens need a visa for Indonesia?",
    answer:
      "Yes. EU citizens (including Dutch and German nationals) are not visa-free and must obtain an eVOA (B1) for IDR 500,000, valid for 30 days and extendable once.",
  },
  {
    question: "How much is the Indonesia visa on arrival in 2026?",
    answer:
      "IDR 500,000 per person, approximately $32 USD, $50 AUD, or 30 euros. The fee is the same whether you apply online or pay at the airport.",
  },
  {
    question: "Can I apply for an Indonesia visa before arriving?",
    answer:
      "Yes. The eVOA can be applied for online at molina.imigrasi.go.id or evisa.imigrasi.go.id before your flight. Online application lets you use the faster e-gates at the airport.",
  },
  {
    question: "How long can I stay in Indonesia on a tourist visa?",
    answer:
      "The eVOA gives you 30 days, extendable once for another 30 days at a local immigration office, a maximum of 60 days total.",
  },
  {
    question: "Is the Bali tourism tax included in the visa fee?",
    answer:
      "No. The Bali tourism levy (IDR 150,000, about $10) is separate from the eVOA fee and applies only when entering Bali.",
  },
  {
    question: "Do US citizens need a visa for Indonesia?",
    answer:
      "Yes. US passport holders are not eligible for visa-free entry and must obtain an eVOA, same as EU and Australian travelers.",
  },
];

type LoaderData = { airaloLink: string };

export const Route = createFileRoute("/visa-guide")({
  loader: async (): Promise<LoaderData> => {
    const airaloLink = await getAiraloLink();
    await setCdnCache();
    return { airaloLink };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: VisaGuidePage,
});

/* -------------------------------------------------------------------------- */
/*  Small presentational helpers                                              */
/* -------------------------------------------------------------------------- */

function Callout({
  tone = "default",
  title,
  children,
}: {
  tone?: "default" | "highlight";
  title: string;
  children: ReactNode;
}) {
  const accent = tone === "highlight" ? "var(--gold-warm)" : "var(--blue-bright)";
  return (
    <section
      className="rounded-2xl border p-6 sm:p-8"
      style={{
        backgroundColor: "#fff",
        borderColor: "var(--border-cream)",
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <h2
        className="font-serif text-lg sm:text-xl font-semibold mb-3"
        style={{ color: "var(--navy-deep)" }}
      >
        {title}
      </h2>
      <div className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--slate-muted)" }}>
        {children}
      </div>
    </section>
  );
}

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-serif text-2xl sm:text-3xl font-semibold mt-14 mb-5 scroll-mt-24"
      style={{ color: "var(--navy-deep)" }}
    >
      {children}
    </h2>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th
      className="text-left font-semibold px-4 py-3 text-xs uppercase tracking-[0.12em]"
      style={{ color: "var(--navy-deep)", borderBottom: "2px solid var(--border-cream)" }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return (
    <td
      className="px-4 py-3 align-top text-sm"
      style={{ color: "var(--slate-muted)", borderBottom: "1px solid var(--border-cream)" }}
    >
      {children}
    </td>
  );
}

// Official government portal link: opens in a new tab and fires an outbound_click
// GA4 event (a useful "did this page drive action" signal). No nofollow: these
// are authoritative .go.id citations, good for trust/E-E-A-T, not affiliate links.
function OfficialLink({ domain }: { domain: string }) {
  return (
    <a
      href={`https://${domain}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent("outbound_click", { destination: domain, link_type: "official_portal" })
      }
      className="underline underline-offset-2"
      style={{ color: "var(--teal-link)" }}
    >
      {domain}
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function VisaGuidePage() {
  const { airaloLink } = Route.useLoaderData() as LoaderData;

  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://exploreindonesia.ai" },
      { "@type": "ListItem", position: 2, name: "Visa Guide", item: URL },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <JsonLd data={faqLD} />
      <JsonLd data={breadcrumbLD} />

      {/* Header */}
      <header
        className="w-full px-6 py-12 sm:py-16"
        style={{ background: "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%)" }}
      >
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            &larr; exploreindonesia.ai
          </Link>
          <p
            className="mt-4 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--blue-soft)" }}
          >
            Before you go
          </p>
          <h1 className="mt-2 font-serif text-white text-4xl sm:text-5xl font-semibold leading-tight">
            {/* Was "Indonesia Visa Guide 2026" until 2026-08-14, aligned with the
                title on the visa-on-arrival intent. Revert both together. */}
            Indonesia Visa on Arrival 2026
          </h1>
          <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed">
            What EU, US and Australian travelers need to enter Indonesia in 2026: the eVOA, what it
            costs, how to extend it, and the new All Indonesia arrival card.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* 1. TL;DR */}
        <Callout tone="highlight" title="The short version">
          <ul className="space-y-2 list-disc pl-5">
            <li>
              Most EU, US and Australian nationals need a Visa on Arrival (eVOA / B1). You are not
              visa-free.
            </li>
            <li>Cost: IDR 500,000 (about $32 USD, $50 AUD, or 30 euros) per person.</li>
            <li>Stay: 30 days, extendable once for another 30 days (60 days maximum).</li>
            <li>
              Apply online before you fly at <OfficialLink domain="molina.imigrasi.go.id" /> or{" "}
              <OfficialLink domain="evisa.imigrasi.go.id" />.
            </li>
            <li>Passport must be valid for 6 or more months from your arrival date.</li>
            <li>A return or onward ticket is required.</li>
            <li>
              Since September 2025, the All Indonesia app (
              <OfficialLink domain="allindonesia.imigrasi.go.id" />) is mandatory for the electronic
              arrival card at major ports.
            </li>
          </ul>
          <p className="mt-4">
            Working out the rest of your budget too? See our{" "}
            <Link
              to="/indonesia-travel-costs"
              className="font-medium underline underline-offset-2"
              style={{ color: "var(--teal-link)" }}
            >
              Indonesia travel costs guide
            </Link>
            .
          </p>
        </Callout>

        {/* 2. The fee question, phrased as people search it. This is the one
            sub-intent where we already rank inside the top 10 ("indonesia visa
            on arrival fee 2026", position 10.0), and it had no heading of its
            own: the figure only existed in a bullet and in the FAQ. A
            self-contained 40-to-60-word answer under a question H2 is the shape
            AI answers extract. */}
        <SectionHeading id="fee">
          How much does the Indonesia visa on arrival cost in 2026?
        </SectionHeading>
        <div
          className="space-y-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--slate-muted)" }}
        >
          <p>
            The Indonesia visa on arrival costs <strong>IDR 500,000 per person</strong>, roughly $32
            USD, $50 AUD or 30 euros. The fee is identical whether you buy the eVOA online
            beforehand or pay at the airport counter. It covers a 30-day stay, and extending once
            for a further 30 days costs another IDR 500,000, so the maximum you pay for 60 days is
            IDR 1,000,000.
          </p>
          <p>
            One charge is often confused with it and is separate: the Bali tourism levy of IDR
            150,000, about $10, which applies only when you enter Bali. The All Indonesia arrival
            card is a separate requirement too, and is not part of the visa fee.
          </p>
        </div>

        {/* 3. Visa options table */}
        <SectionHeading id="visa-options">Visa options at a glance</SectionHeading>
        <div
          className="overflow-x-auto rounded-2xl border"
          style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
        >
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Visa type</Th>
                <Th>Stay</Th>
                <Th>Extendable</Th>
                <Th>Cost</Th>
                <Th>Who it is for</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Visa-Free</Td>
                <Td>30 days</Td>
                <Td>No</Td>
                <Td>Free</Td>
                <Td>About 19 nationalities (EU, US and AU are not included)</Td>
              </tr>
              <tr>
                <Td>eVOA / B1</Td>
                <Td>30 days</Td>
                <Td>Yes, once for +30 days</Td>
                <Td>IDR 500,000</Td>
                <Td>EU, US, AU and 90 or more nationalities</Td>
              </tr>
              <tr>
                <Td>C1 eVisa</Td>
                <Td>60 days</Td>
                <Td>Yes, up to twice for +30 days each</Td>
                <Td>IDR 500,000</Td>
                <Td>Longer stays</Td>
              </tr>
              <tr>
                <Td>Business / Long-stay</Td>
                <Td>Varies</Td>
                <Td>Varies</Td>
                <Td>Varies</Td>
                <Td>Work, study or retirement (KITAS required)</Td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. Nationality sections */}
        <SectionHeading id="netherlands-germany">
          Netherlands &amp; Germany (and most of the EU)
        </SectionHeading>
        <div
          className="space-y-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--slate-muted)" }}
        >
          <p>
            An eVOA is required. EU nationals are not visa-free; the EU lost visa-free status after
            COVID and it has not been restored as of 2026. You can apply online or pay at the
            airport counter.
          </p>
          <p>
            Applying online (eVOA) is faster, enables the e-gates at the airport, and costs the same
            as paying on arrival.
          </p>
          <p>
            Note: Indonesia is working toward restoring visa-free access for high-spending tourist
            nations, including the Netherlands and Germany, but it is not yet in effect.
          </p>
        </div>

        <SectionHeading id="australia">Australia</SectionHeading>
        <div
          className="space-y-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--slate-muted)" }}
        >
          <p>An eVOA is required, with the same process as the EU.</p>
          <p>Cost is about $50 AUD.</p>
          <p>
            Note: Australia is on the list of countries Indonesia is considering for restored
            visa-free access, but it is not yet confirmed.
          </p>
        </div>

        <SectionHeading id="united-states">United States</SectionHeading>
        <div
          className="space-y-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--slate-muted)" }}
        >
          <p>An eVOA is required. The US is not visa-free.</p>
          <p>The process and cost are the same as for EU and Australian travelers.</p>
          <p>
            Apply at <OfficialLink domain="evisa.imigrasi.go.id" />.
          </p>
        </div>

        {/* 5. How to apply */}
        <SectionHeading id="how-to-apply">How to apply, step by step</SectionHeading>
        <ol
          className="space-y-3 text-sm sm:text-base leading-relaxed list-decimal pl-5"
          style={{ color: "var(--slate-muted)" }}
        >
          <li>
            Go to <OfficialLink domain="molina.imigrasi.go.id" /> or{" "}
            <OfficialLink domain="evisa.imigrasi.go.id" />. Use the official government portals only
            and be wary of third-party scam sites charging inflated fees.
          </li>
          <li>
            Create an account, one per traveler. Children need their own separate applications.
          </li>
          <li>
            Upload your passport bio page (JPG or PNG, valid 6 or more months), a passport photo,
            your return ticket, and accommodation details.
          </li>
          <li>Pay IDR 500,000 by Mastercard, Visa or JCB credit card.</li>
          <li>
            Receive your eVOA by email within 24 to 48 hours (allow a 7-day buffer to be safe).
          </li>
          <li>
            Show your eVOA at immigration. Use the e-gates if you applied online and hold a
            biometric passport.
          </li>
        </ol>

        {/* 6 + 7. Callouts */}
        <div className="mt-12 space-y-6">
          <Callout title="Bali tourism levy">
            Since February 2024, all international visitors to Bali pay an additional IDR 150,000
            (about $10 USD) tourism levy. Pay online at{" "}
            <OfficialLink domain="lovebali.baliprov.go.id" /> or on arrival. This is separate from
            the visa fee.
          </Callout>
          <Callout title="All Indonesia arrival card">
            Since September 2025, all arrivals at major Indonesian ports must complete an electronic
            arrival card via the All Indonesia platform (
            <OfficialLink domain="allindonesia.imigrasi.go.id" />) before landing. It replaces the
            old paper card.
          </Callout>
        </div>

        {/* 8. Extension */}
        <SectionHeading id="extensions">Extending your stay</SectionHeading>
        <ul
          className="space-y-2 text-sm sm:text-base leading-relaxed list-disc pl-5"
          style={{ color: "var(--slate-muted)" }}
        >
          <li>Apply before your first 30 days expire.</li>
          <li>
            Visit a local immigration office in person. This has been required since June 2025 under
            Circular IMI-417.
          </li>
          <li>The extension fee is IDR 500,000.</li>
          <li>You can extend only once. After 60 days you must leave.</li>
          <li>You cannot apply for a new visa while inside Indonesia.</li>
        </ul>

        {/* 9. Quick facts */}
        <SectionHeading id="quick-facts">Quick facts</SectionHeading>
        <div
          className="overflow-x-auto rounded-2xl border"
          style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
        >
          <table className="w-full border-collapse text-sm">
            <tbody>
              {[
                ["Passport validity required", "6 months from arrival"],
                ["Return ticket required", "Yes"],
                ["Emergency passports accepted", "No"],
                ["Overstay fine", "IDR 1,000,000 (about $65) per day"],
                ["Max stay with eVOA", "60 days (30 plus one extension)"],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td
                    className="px-4 py-3 font-semibold align-top w-1/2 text-sm"
                    style={{
                      color: "var(--navy-deep)",
                      borderBottom: "1px solid var(--border-cream)",
                    }}
                  >
                    {k}
                  </td>
                  <Td>{v}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 10. Q&A */}
        <SectionHeading id="faq">Common questions</SectionHeading>
        <dl className="flex flex-col gap-5">
          {FAQS.map((f, i) => (
            <div key={i}>
              <dt className="font-semibold text-base mb-1" style={{ color: "var(--navy-deep)" }}>
                {f.question}
              </dt>
              <dd className="text-sm leading-relaxed" style={{ color: "var(--slate-muted)" }}>
                {f.answer}
              </dd>
            </div>
          ))}
        </dl>

        {/* 11. CTA */}
        <section
          className="mt-16 rounded-2xl border p-6 sm:p-8"
          style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
        >
          <h2
            className="font-serif text-xl sm:text-2xl font-semibold mb-3"
            style={{ color: "var(--navy-deep)" }}
          >
            Ready to plan your Indonesia trip?
          </h2>
          <p
            className="text-sm sm:text-base leading-relaxed mb-5"
            style={{ color: "var(--slate-muted)" }}
          >
            Use our AI planner to build a day-by-day itinerary, with every tour, transfer and stay
            already bookable.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/#try-it"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--blue-bright)" }}
            >
              Plan my Indonesia trip &rarr;
            </a>
          </div>
          <p className="mt-6 text-sm leading-relaxed" style={{ color: "var(--slate-muted)" }}>
            Get your{" "}
            <a
              href={airaloLink}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="font-medium underline underline-offset-2"
              style={{ color: "var(--teal-link)" }}
            >
              Indonesia eSIM
            </a>{" "}
            before you fly, no airport SIM queues.
          </p>
        </section>

        <p className="mt-10 text-xs leading-relaxed" style={{ color: "var(--slate-muted)" }}>
          Visa rules and fees change. Confirm the current requirements at the official portals (
          <OfficialLink domain="evisa.imigrasi.go.id" />,{" "}
          <OfficialLink domain="molina.imigrasi.go.id" />) before you travel. Some links are
          affiliate links; booking through them helps fund the site at no extra cost to you.
        </p>
      </main>
    </div>
  );
}
