import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { JsonLd } from "@/components/JsonLd";
import { setCdnCache } from "@/lib/cdn-cache";
import { PAGE_DATES } from "@/data/page-dates";
import { trackAffiliateClick } from "@/lib/affiliate-tracking";
import { buildBookingLink } from "@/lib/booking";

const TITLE = "Indonesia Travel Costs 2026: Daily Budget Breakdown";
// The old description asked the question without answering it, and the page was
// taking 1994 impressions at position 9.1 for 6 clicks. Leading with the figures
// gives the snippet a reason to be clicked and gives an AI Overview something to
// cite us for rather than around us. Changed 2026-08-14; read the CTR on 11 Sep.
const DESCRIPTION =
  "Indonesia costs $30 to $50 a day on a budget, $70 to $100 mid-range, $150 to $250 in comfort. Full 2026 breakdown of rooms, food, transport and flights.";
const URL = "https://exploreindonesia.ai/indonesia-travel-costs";

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "How much does a trip to Indonesia cost per day?",
    answer:
      "Most travelers spend $30 to $50 a day on a budget, $70 to $100 a day mid-range, or $150 to $250 a day for comfortable travel including villas, private drivers and guided tours.",
  },
  {
    question: "Is Indonesia cheap to travel?",
    answer:
      "Yes. Indonesia has the lowest cost of living in Southeast Asia on Numbeo's mid-2026 index, at 26.1 against Vietnam's 26.4 and Thailand's 38.0. Food and accommodation are the cheapest part; island-hopping flights add $50 to $100 per move and are the biggest budget variable.",
  },
  {
    question: "Is Indonesia cheaper than Thailand?",
    answer:
      "Day to day, yes: Indonesia scores 26.1 on Numbeo's mid-2026 cost of living index against Thailand's 38.0, so everyday prices run roughly a third lower. A multi-island Indonesia trip can still total more than a Thailand trip, because Thailand is one landmass with cheap trains while Indonesia needs $40 to $70 domestic flights between islands.",
  },
  {
    question: "How much money should I bring to Bali for 2 weeks?",
    answer:
      "Budget $800 to $1,200 for two weeks in Bali mid-range (excluding flights), roughly $70 to $85 a day covering a private room, mixed dining, scooter rental and activities.",
  },
  {
    question: "What is the most expensive part of traveling Indonesia?",
    answer:
      "Inter-island flights. Food and accommodation are cheap, but domestic flights between islands cost $40 to $70 each and add up quickly on a multi-island itinerary.",
  },
  {
    question: "When is the cheapest time to visit Indonesia?",
    answer:
      "Shoulder months, May, June, and September to October, offer 20 to 30% cheaper accommodation than peak season (July, August, December) while still having reliable weather in most regions.",
  },
];

export const Route = createFileRoute("/indonesia-travel-costs")({
  loader: async () => {
    await setCdnCache();
    return {};
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
  component: TravelCostsPage,
});

/* -------------------------------------------------------------------------- */
/*  Small presentational helpers                                              */
/* -------------------------------------------------------------------------- */

function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      className="rounded-2xl border p-6 sm:p-8"
      style={{
        backgroundColor: "#fff",
        borderColor: "var(--border-cream)",
        borderLeft: "4px solid var(--gold-warm)",
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

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3
      className="font-serif text-lg font-semibold mt-6 mb-2"
      style={{ color: "var(--navy-deep)" }}
    >
      {children}
    </h3>
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

function TableShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="overflow-x-auto rounded-2xl border"
      style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
    >
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="space-y-3 text-sm sm:text-base leading-relaxed"
      style={{ color: "var(--slate-muted)" }}
    >
      {children}
    </div>
  );
}

const teal = { color: "var(--teal-link)" } as const;

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function TravelCostsPage() {
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
      { "@type": "ListItem", position: 2, name: "Indonesia Travel Costs", item: URL },
    ],
  };
  const articleLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    datePublished: "2026-06-12",
    dateModified: PAGE_DATES.travelCosts,
    author: { "@type": "Organization", name: "ExploreIndonesia.ai" },
    publisher: { "@type": "Organization", name: "ExploreIndonesia.ai" },
    mainEntityOfPage: URL,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <JsonLd data={faqLD} />
      <JsonLd data={breadcrumbLD} />
      <JsonLd data={articleLD} />

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
            Indonesia Travel Costs 2026
          </h1>
          <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed">
            Real daily budgets for backpackers, mid-range and comfortable travelers, with what you
            actually spend on accommodation, food, transport and activities.
          </p>
          <p className="mt-3 text-xs text-white/60">
            Last updated 29 August 2026 &middot; prices verified against 2026 operator rates
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* 1. TL;DR */}
        <Callout title="The short version">
          <ul className="space-y-2 list-disc pl-5">
            <li>Budget traveler: $30 to $50 a day (hostel dorm, street food, local transport).</li>
            <li>
              Mid-range traveler: $70 to $100 a day (private room with AC, mix of dining, occasional
              tours).
            </li>
            <li>
              Comfortable: $150 to $250 a day (villa or resort, private driver, guided experiences).
            </li>
            <li>Luxury: $250 to $400 or more a day.</li>
            <li>Bali tourist areas cost 30 to 50% more than Java or the eastern islands.</li>
            <li>
              Travelling alone costs roughly a third more per head, because a room costs the same
              for one as for two. See{" "}
              <Link
                to="/trips/$slug"
                params={{ slug: "7-days-bali-solo-travellers" }}
                className="underline underline-offset-2"
                style={teal}
              >
                what a week in Bali costs on your own
              </Link>
              .
            </li>
            <li>
              Biggest hidden costs: island-hopping flights, alcohol (high import tax), and peak
              season (July, August, December add 30 to 50% on accommodation).
            </li>
          </ul>
        </Callout>

        {/* 2. Cheap or expensive — the comparative answer.
            Added 2026-08-31. The page ranked 5-10 on ~128 named impressions of
            "is indonesia cheap / expensive / how cheap is indonesia" for one
            click, and never used those words in a heading or compared Indonesia
            to anything. A neighbour-by-neighbour table is the format that has
            worked on this domain (borobudur-vs-prambanan sits at position 8) and
            is what AI answers quote. Read the cluster on 28 Sep. */}
        <SectionHeading id="cheap-or-expensive">
          Is Indonesia cheap or expensive to travel in 2026?
        </SectionHeading>
        <Prose>
          <p>
            Indonesia is the cheapest country in Southeast Asia on local prices. Numbeo&apos;s
            mid-2026 cost of living index puts it at 26.1, just below Vietnam at 26.4 and well under
            Thailand at 38.0. A mid-range day still costs $70 to $100, because the saving on food
            and rooms is offset by the domestic flights an island-hopping trip needs.
          </p>
        </Prose>
        <TableShell>
          <thead>
            <tr>
              <Th>Country</Th>
              <Th>Cost of living index</Th>
              <Th>Including rent</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Indonesia</Td>
              <Td>26.1</Td>
              <Td>18.5</Td>
            </tr>
            <tr>
              <Td>Vietnam</Td>
              <Td>26.4</Td>
              <Td>19.1</Td>
            </tr>
            <tr>
              <Td>Philippines</Td>
              <Td>30.1</Td>
              <Td>20.2</Td>
            </tr>
            <tr>
              <Td>Malaysia</Td>
              <Td>34.0</Td>
              <Td>22.9</Td>
            </tr>
            <tr>
              <Td>Thailand</Td>
              <Td>38.0</Td>
              <Td>27.2</Td>
            </tr>
          </tbody>
        </TableShell>
        <Prose>
          <p className="text-xs sm:text-sm">
            Source: Numbeo Cost of Living Index by Country, South-Eastern Asia, mid-2026. New York =
            100, so an index of 26.1 means everyday prices are roughly a quarter of New York&apos;s.
          </p>
          <p>
            The caveat that matters for planning: this measures what things cost once you are there,
            not what the trip costs. Thailand is a third more expensive day to day, but it is one
            landmass with cheap trains. Indonesia spreads 17,000 islands across three time zones, so
            a two-week, three-island route can end up costing more than a two-week Thailand trip
            despite everything on the ground being cheaper. The flights are the difference, and they
            are covered in{" "}
            <a href="#transport" className="underline underline-offset-2" style={teal}>
              the transport section
            </a>{" "}
            below.
          </p>
        </Prose>

        {/* 3. Daily budget table */}
        <SectionHeading id="daily-budget">
          How much does Indonesia cost per day in 2026?
        </SectionHeading>
        <TableShell>
          <thead>
            <tr>
              <Th>Category</Th>
              <Th>Budget ($30 to $50)</Th>
              <Th>Mid-range ($70 to $100)</Th>
              <Th>Comfortable ($150 to $250)</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Accommodation</Td>
              <Td>Dorm $6 to $10</Td>
              <Td>Private room with AC $25 to $50</Td>
              <Td>Villa or resort $80 to $200</Td>
            </tr>
            <tr>
              <Td>Food</Td>
              <Td>Warung / street food $6 to $10</Td>
              <Td>Mix of local and restaurant $15 to $25</Td>
              <Td>Restaurant and beach club $30 to $60</Td>
            </tr>
            <tr>
              <Td>Transport</Td>
              <Td>Local bus / scooter $5 to $8</Td>
              <Td>Grab / scooter $10 to $20</Td>
              <Td>Private driver $40 to $60</Td>
            </tr>
            <tr>
              <Td>Activities</Td>
              <Td>$5 to $15</Td>
              <Td>$20 to $40</Td>
              <Td>$50 to $100</Td>
            </tr>
            <tr>
              <Td>
                <strong style={{ color: "var(--navy-deep)" }}>Total a day</strong>
              </Td>
              <Td>~$30 to $50</Td>
              <Td>~$70 to $100</Td>
              <Td>~$150 to $250</Td>
            </tr>
          </tbody>
        </TableShell>

        {/* 4. Accommodation */}
        {/* Four headings here used to be labels ("Accommodation costs", "Food
            costs", "Activities & entrance fees", "Money & payments") above a
            bare bullet list. The page takes 4515 impressions at position 7.5
            with 92% of its queries anonymised, which is what being read inside
            an AI answer looks like, and a bullet list under a label is the
            worst thing to hand an extractor. Each now asks the question people
            type ("indonesia food cost per day", pos 8.5) and answers it in one
            self-contained paragraph before the list. Same figures, no new
            claims. Changed 2026-08-29. */}
        <SectionHeading id="accommodation">
          How much does accommodation cost in Indonesia?
        </SectionHeading>
        <Prose>
          <p>
            Accommodation in Indonesia runs $6 to $10 for a hostel dorm, $10 to $20 for a budget
            guesthouse, and $25 to $50 for a mid-range room with a pool. Bali villas in Seminyak and
            Canggu cost $50 to $150 a night. Expect prices 30 to 50% higher in July, August and
            December.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Hostel dorms: $6 to $10 a night (Yogyakarta and less touristy areas of Lombok).</li>
            <li>Budget guesthouses: $10 to $20 a night.</li>
            <li>Mid-range private room with pool: $25 to $50 a night.</li>
            <li>Bali villas (Seminyak, Canggu): $50 to $150 a night.</li>
            <li>Luxury resorts: $150 to $400 or more a night.</li>
          </ul>
          <p>
            Book via{" "}
            <a
              href={buildBookingLink("Indonesia", { context: "travel-costs" })}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="underline underline-offset-2"
              style={teal}
            >
              Booking.com
            </a>{" "}
            for the best rates. Prices rise 30 to 50% in July, August and December.
          </p>
        </Prose>

        {/* 5. Food */}
        <SectionHeading id="food">How much does food cost per day in Indonesia?</SectionHeading>
        <Prose>
          <p>
            Food in Indonesia costs $8 to $10 a day if you eat warung-style, and $25 to $40 a day in
            tourist restaurants. A street-food plate of nasi goreng runs $1 to $3, a mid-range cafe
            meal $5 to $10, and a Bali beach-club main $15 to $30. Beer adds $5 to $10 a round.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Street food and warungs: $1 to $3 a meal (nasi goreng, mie goreng, gado-gado).</li>
            <li>Mid-range cafe or restaurant: $5 to $10 a meal.</li>
            <li>Tourist restaurants (Bali beach clubs and similar): $15 to $30 a meal.</li>
            <li>
              Alcohol is expensive because of high import taxes, budget $5 to $10 a beer at bars.
            </li>
          </ul>
          <p>
            Eating warung-style keeps daily food under $10. Switching to tourist restaurants
            inflates it to $25 to $40 a day.
          </p>
        </Prose>

        {/* 6. Transport */}
        <SectionHeading id="transport">
          How much does it cost to travel between Indonesian islands?
        </SectionHeading>
        <Prose>
          <p>
            Inter-island flights are the single biggest cost in Indonesia, at $40 to $70 per hop.
            Ferries between neighbouring islands cost $2 to $25 and take four to twelve times
            longer. On the ground, budget $5 a day for a scooter, $35 to $50 for a private driver,
            and under $2 for a Grab ride.
          </p>

          <SubHeading>Getting around each day</SubHeading>
          <p>
            Scooter rental $4 to $5 a day; Grab or Gojek motorbike taxi $1 to $3 a ride; Grab car $3
            to $8; private driver with car $40 to $60 a day. Use Grab or Gojek and never negotiate
            with independent drivers, where price gouging is common.
          </p>

          <SubHeading>Between islands (domestic flights)</SubHeading>
          <p>
            $40 to $70 one way booked 2 to 4 weeks ahead; same-week booking is roughly double. Lion
            Air, Citilink and Garuda are the main carriers.
          </p>

          <SubHeading>Ferries and overland</SubHeading>
          <p>
            <Link
              to="/transport/$route"
              params={{ route: "bali-to-lombok" }}
              className="underline underline-offset-2"
              style={teal}
            >
              Bali to Lombok
            </Link>{" "}
            fast ferry is about $20 to $25;{" "}
            <Link
              to="/transport/$route"
              params={{ route: "bali-to-gili-islands" }}
              className="underline underline-offset-2"
              style={teal}
            >
              Bali to the Gili Islands
            </Link>{" "}
            about $25 to $35;{" "}
            <Link
              to="/transport/$route"
              params={{ route: "bali-to-nusa-penida" }}
              className="underline underline-offset-2"
              style={teal}
            >
              Bali to Nusa Penida
            </Link>{" "}
            less again; and{" "}
            <Link
              to="/transport/$route"
              params={{ route: "jakarta-to-yogyakarta" }}
              className="underline underline-offset-2"
              style={teal}
            >
              Java trains (Jakarta to Yogyakarta)
            </Link>{" "}
            run $8 to $32 depending on class. Book ferries via{" "}
            <a
              href="https://12go.asia/?z=16022946"
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() =>
                trackAffiliateClick(
                  { partner: "12go", category: "ferries", source: "costs_page" },
                  "https://12go.asia/?z=16022946",
                )
              }
              className="underline underline-offset-2"
              style={teal}
            >
              12Go Asia
            </a>
            .
          </p>

          <p style={{ color: "var(--navy-deep)" }}>
            <strong>Key warning:</strong> island-hopping is the number one budget-killer. Budget $50
            to $100 per inter-island move, and see our{" "}
            <Link to="/transport" className="underline underline-offset-2" style={teal}>
              full getting-around guide
            </Link>{" "}
            for route-by-route times and prices.
          </p>
        </Prose>

        {/* 7. Activities */}
        <SectionHeading id="activities">
          How much do activities and entrance fees cost in Indonesia?
        </SectionHeading>
        <Prose>
          <p>
            Budget $20 to $80 for a typical paid activity in Indonesia. Entrance fees are modest, $4
            to $10 for Ubud Monkey Forest and $25 for Borobudur, while boat-based days cost most: a
            Komodo day trip from Labuan Bajo is $50 to $80 and a scuba diving day trip $60 to $100.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Borobudur temple: $25 (foreign visitor rate).</li>
            <li>Komodo day trip from Labuan Bajo: $50 to $80.</li>
            <li>Komodo liveaboard, 3 to 4 days: $300 to $865.</li>
            <li>Mount Bromo sunrise tour: $80 from Malang.</li>
            <li>Ubud Monkey Forest: $4 to $10.</li>
            <li>Bali swing or rice terrace: $5 to $20.</li>
            <li>Surf lesson in Kuta: about $20 an hour.</li>
            <li>Scuba diving day trip: $60 to $100.</li>
          </ul>
          <p>Bali activity prices rose about 15% after 2024 because of visitor volumes.</p>
        </Prose>

        {/* 8. Regional comparison */}
        <SectionHeading id="regional">Which parts of Indonesia are most expensive?</SectionHeading>
        <Prose>
          <p>
            Bali's tourist strips (Seminyak, Canggu, Ubud) run 30 to 50% above the rest of the
            country. Java and Yogyakarta are the cheapest region for cultural travel, while Lombok
            and the Gili Islands sit in between and are getting pricier as tourism grows.
          </p>
        </Prose>
        <TableShell>
          <thead>
            <tr>
              <Th>Destination</Th>
              <Th>Relative cost</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Bali (Seminyak, Canggu, Ubud)</Td>
              <Td>$$$</Td>
              <Td>Most expensive; tourist infrastructure adds a 30 to 50% premium.</Td>
            </tr>
            <tr>
              <Td>Bali (off the tourist trail)</Td>
              <Td>$$</Td>
              <Td>Cheaper once you leave the main strips.</Td>
            </tr>
            <tr>
              <Td>Lombok / Gili Islands</Td>
              <Td>$$</Td>
              <Td>More affordable; growing fast.</Td>
            </tr>
            <tr>
              <Td>Yogyakarta / Java</Td>
              <Td>$</Td>
              <Td>Cheapest; best value for cultural sites.</Td>
            </tr>
            <tr>
              <Td>Flores / Komodo</Td>
              <Td>$$ to $$$</Td>
              <Td>Remote, so higher logistics costs; liveaboards add up.</Td>
            </tr>
            <tr>
              <Td>Raja Ampat</Td>
              <Td>$$$$</Td>
              <Td>Least infrastructure; the most expensive region in Indonesia.</Td>
            </tr>
          </tbody>
        </TableShell>
        {/* Contextual links into the two hubs with the most impressions and no
            clicks: bali-nearby-islands (622 impr, position 44.8) and lombok-gili
            (352 impr, position 25.2). This is the strongest page we have to point
            at them, and both anchors are the query verbatim. Same move as the
            solo-traveller link above (commit c7e95fa). */}
        <Prose>
          <p className="mt-4">
            Costs drop as soon as you leave the mainland: the{" "}
            <Link
              to="/destinations/$destination"
              params={{ destination: "bali-nearby-islands" }}
              className="underline underline-offset-2"
              style={teal}
            >
              islands near Bali
            </Link>{" "}
            run 20 to 30% cheaper than Seminyak or Canggu for the same standard of room, and the
            Nusa crossing from Sanur takes 25 to 45 minutes. Further east,{" "}
            <Link
              to="/destinations/$destination"
              params={{ destination: "lombok-gili" }}
              className="underline underline-offset-2"
              style={teal}
            >
              Lombok and the Gili Islands
            </Link>{" "}
            sit a rung cheaper again, with the same room costing less than it does anywhere in
            Bali's tourist south.
          </p>
        </Prose>

        {/* 9. Seasonal */}
        <SectionHeading id="seasonal">When is the cheapest time to visit Indonesia?</SectionHeading>
        <Prose>
          <p>
            Shoulder months, May, June and September to October, offer 20 to 30% cheaper
            accommodation and flights than peak season, with 70 to 80% of the dry-season weather.
            Wet season (November to April) is cheapest of all, though some destinations are harder
            to reach.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              Peak season: July, August and December add 30 to 50% on accommodation and flights, and
              are the most crowded.
            </li>
            <li>
              Best value: shoulder months May, June and September to October, 20 to 30% cheaper with
              70 to 80% of the dry-season weather.
            </li>
            <li>
              Wet season (November to April): the cheapest rates; some destinations are harder to
              reach, and Bali surfing is at its best in these months.
            </li>
          </ul>
        </Prose>

        {/* 10. Money */}
        <SectionHeading id="money">Can you pay by card in Indonesia?</SectionHeading>
        <Prose>
          <p>
            Cards work at hotels, malls and larger restaurants, but Indonesia still runs on cash at
            warungs, markets and small guesthouses. ATM withdrawals are capped low, around IDR
            1,500,000 to 3,000,000 per transaction, so carry a Wise or Revolut card and change money
            in town rather than at the airport.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Currency: Indonesian Rupiah (IDR). As of 2026, roughly 15,000 IDR to $1 USD.</li>
            <li>Cash is widely used, especially at warungs, markets and small guesthouses.</li>
            <li>
              ATM limits are low (about IDR 1,500,000 to 3,000,000 per transaction); bring a Wise or
              Revolut card to avoid fees.
            </li>
            <li>Use city money changers, not the airport, for 2 to 3% better rates.</li>
            <li>Cards are accepted at hotels, malls and larger restaurants.</li>
            <li>
              Alcohol import taxes make booze expensive; this is not a budget destination for
              nightlife.
            </li>
          </ul>
        </Prose>

        {/* 11. Sample budgets */}
        <SectionHeading id="sample-budgets">Sample trip budgets</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
          >
            <h3
              className="font-serif text-lg font-semibold mb-3"
              style={{ color: "var(--navy-deep)" }}
            >
              7 days in Bali, mid-range
            </h3>
            <ul className="space-y-1.5 text-sm" style={{ color: "var(--slate-muted)" }}>
              <li>Accommodation (7 nights, private room): ~$280</li>
              <li>Food (mix of local and restaurant): ~$140</li>
              <li>Transport (scooter plus 2 Grab rides): ~$60</li>
              <li>Activities (3 paid, 2 free): ~$80</li>
              <li>
                Visa (
                <Link to="/visa-guide" className="underline underline-offset-2" style={teal}>
                  eVOA
                </Link>
                ): $32
              </li>
              <li>Bali levy: $10</li>
            </ul>
            <p className="mt-3 font-semibold text-sm" style={{ color: "var(--navy-deep)" }}>
              Total: ~$600 excluding flights
            </p>
            <Link
              to="/trips/$slug"
              params={{ slug: "7-days-bali-first-timers" }}
              className="inline-flex mt-3 text-sm font-medium underline underline-offset-2"
              style={teal}
            >
              See this week as a day-by-day itinerary &rarr;
            </Link>
          </div>

          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
          >
            <h3
              className="font-serif text-lg font-semibold mb-3"
              style={{ color: "var(--navy-deep)" }}
            >
              14 days Bali plus Lombok, budget
            </h3>
            <ul className="space-y-1.5 text-sm" style={{ color: "var(--slate-muted)" }}>
              <li>Accommodation (hostels and guesthouses): ~$140</li>
              <li>Food (warung-heavy): ~$100</li>
              <li>
                Transport (scooter plus{" "}
                <Link
                  to="/transport/$route"
                  params={{ route: "bali-to-lombok" }}
                  className="underline underline-offset-2"
                  style={teal}
                >
                  Bali to Lombok ferry
                </Link>
                ): ~$100
              </li>
              <li>Activities: ~$100</li>
              <li>
                Visa (
                <Link to="/visa-guide" className="underline underline-offset-2" style={teal}>
                  eVOA
                </Link>
                ): $32
              </li>
            </ul>
            <p className="mt-3 font-semibold text-sm" style={{ color: "var(--navy-deep)" }}>
              Total: ~$470 excluding flights
            </p>
            <Link
              to="/trips/$slug"
              params={{ slug: "10-days-bali-lombok-gili-islands" }}
              className="inline-flex mt-3 text-sm font-medium underline underline-offset-2"
              style={teal}
            >
              See the Bali plus Lombok route day by day &rarr;
            </Link>
          </div>
        </div>

        {/* This page takes ~8.200 GSC impressions a month at position 7 and is the
            site's largest single traffic source, but it is pure cost research: it
            carried no route out to the itineraries, which are the pages that hold
            the affiliate links. These three are the priced itineraries whose own
            budget figures match the ranges above. */}
        <Callout title="What these budgets look like as a real trip">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <Link
                to="/trips/$slug"
                params={{ slug: "14-days-indonesia-bali-java-komodo" }}
                className="underline underline-offset-2"
                style={teal}
              >
                14 days across Bali, Java and Komodo
              </Link>{" "}
              — US$1,800 to 3,000 mid-range, or US$1,100 to 1,600 sharing boats and tours.
            </li>
            <li>
              <Link
                to="/trips/$slug"
                params={{ slug: "20-days-across-indonesia" }}
                className="underline underline-offset-2"
                style={teal}
              >
                20 days across Bali, Java, Komodo and Lombok
              </Link>{" "}
              — US$2,500 to 4,000 mid-range, or US$1,500 to 2,200 on guesthouses and shared tours.
            </li>
            <li>
              <Link to="/trips" className="underline underline-offset-2" style={teal}>
                All Indonesia itineraries
              </Link>{" "}
              — filter by length, style and destination.
            </li>
          </ul>
        </Callout>

        {/* 12. Q&A */}
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

        {/* 13. CTA */}
        <section
          className="mt-16 rounded-2xl border p-6 sm:p-8"
          style={{ borderColor: "var(--border-cream)", backgroundColor: "#fff" }}
        >
          <h2
            className="font-serif text-xl sm:text-2xl font-semibold mb-3"
            style={{ color: "var(--navy-deep)" }}
          >
            Build your Indonesia trip with a realistic budget in mind
          </h2>
          <p
            className="text-sm sm:text-base leading-relaxed mb-5"
            style={{ color: "var(--slate-muted)" }}
          >
            Our AI planner assembles a day-by-day itinerary, with bookable tours, transfers and
            stays already matched to your travel style.
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
            Crossing borders first? Check the{" "}
            <Link to="/visa-guide" className="underline underline-offset-2" style={teal}>
              Indonesia visa guide
            </Link>{" "}
            for entry rules and the eVOA.
          </p>
        </section>

        <p className="mt-10 text-xs leading-relaxed" style={{ color: "var(--slate-muted)" }}>
          Prices are working estimates and change with season, operator and exchange rate. Confirm
          current costs before you book. Some links are affiliate links; booking through them helps
          fund the site at no extra cost to you.
        </p>
      </main>
    </div>
  );
}
