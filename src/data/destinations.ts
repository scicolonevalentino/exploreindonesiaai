// Destination landing page content. Slugs are URL-safe and stable.
// `value` maps to the Sanity `destinationPrimary` / `destinationSecondary` enum
// in src/lib/sanity-queries.ts (DESTINATIONS).

// One internal link carried by a trailing sentence.
export type DestinationLink = { before: string; href: string; anchor: string; after: string };

// An h3 under a section. Used where a question needs an entry per item (the nine
// islands near Bali) rather than one block of prose: the competing listicles all
// give each island its own section, and a single table row per island is not
// enough weight to rank against them.
export type DestinationSubsection = {
  heading: string;
  body: string[];
  link?: DestinationLink;
};

// An editorial section rendered on the hub above the itinerary list. Hubs used
// to be a bare listing with a one-sentence intro, which is why a page like
// bali-nearby-islands could take 563 impressions and no clicks: it never
// answered the question people were actually asking. Optional, so the hubs that
// have nothing to say stay exactly as they were.
export type DestinationSection = {
  // Phrased the way someone types it into a search box, not as a label.
  heading: string;
  // The first paragraph must answer the heading on its own, in 40 to 60 words.
  body: string[];
  table?: { columns: string[]; rows: string[][]; caption?: string };
  subsections?: DestinationSubsection[];
  // Trailing sentence carrying one internal link.
  link?: DestinationLink;
};

export type DestinationContent = {
  slug: string;
  value: string;
  name: string;
  shortName: string;
  // Overrides the H1 when the nav-friendly `name` is not what people search.
  h1?: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  highlights: string[];
  sections?: DestinationSection[];
};

export const DESTINATION_CONTENT: DestinationContent[] = [
  {
    slug: "bali",
    value: "bali",
    name: "Bali",
    shortName: "Bali",
    // Retouch 2026-08-31. The hub took 34 impressions at position 21.1 with zero
    // clicks while seven of its own itineraries outranked it: a snippet problem,
    // not a ranking one. The old title sold the product ("bookable AI trip
    // plans") and the old H1 was the bare word "Bali", neither of which matches
    // how people search. Naming the lengths gives the snippet a reason to be
    // clicked. Read the CTR on 28 Sep before touching this again.
    // Old metaTitle: "Bali itineraries, bookable AI trip plans"
    // Old metaDescription: "Hand-picked Bali itineraries, from short escapes to two-week routes through Ubud, Canggu, Uluwatu and the east. Turn any plan into a bookable trip."
    // Old H1: none set, so it fell back to name, "Bali".
    h1: "Bali Itineraries",
    metaTitle: "Bali Itineraries: 5, 7, 10 and 14 Days, Day by Day",
    metaDescription:
      "Seventeen Bali routes from 5 to 30 days, through Ubud, Canggu, Uluwatu, the east coast and the Nusa islands. Pick the length, then read the days.",
    intro:
      "From the rice terraces of Ubud to the surf breaks of Uluwatu, Bali rewards travellers who plan around its rhythm. Browse our curated itineraries, every route is structured day by day so you can review, adjust, and book stays, transfers, and experiences in one place.",
    highlights: ["Ubud & rice terraces", "Canggu surf", "Uluwatu cliffs", "East Bali volcanoes"],
    // Section 6 of docs/reinforce-bali.md, applied 2026-08-31 after the founder
    // approved the plan. The hub took 34 impressions and 0 clicks at position
    // 21.1 while five of its own itineraries outranked it, and it was the last
    // hub on the site with no editorial section at all: five generated
    // scaffolding headings, no question, no self-contained answer.
    //
    // Two constraints specific to Bali, not present on the other hubs:
    //   1. where-to-stay-in-bali already sits at position 8.9 and
    //      best-time-to-visit-bali exists, so sections 2 and 3 answer in one
    //      paragraph and hand off. Duplicating a guide already in the top 10 is
    //      the real risk here, not thinness.
    //   2. Six sections is the deliberate ceiling. bali-nearby-islands went to
    //      nine sections and 2,500 words and its position got WORSE, 45.3 to
    //      50.5. Depth alone is not the lever on Bali.
    //
    // Costs come from /indonesia-travel-costs, the levy from /visa-guide, and
    // every transfer time from src/data/routes.ts. Keep them in sync.
    sections: [
      {
        heading: "How many days do you need in Bali?",
        body: [
          "Five days covers one region properly, seven covers two, and ten to fourteen lets you add an island or the east coast without living in a car. Bali is small on a map and slow on the road, so the working limit on a first trip is one base change every three nights or so.",
          "The mistake that costs the most is treating Bali as a single place you can day-trip across. Ubud to Uluwatu is under 50 kilometres and routinely takes two hours, so a plan built on four bases in a week spends its afternoons in a car rather than anywhere you came to see.",
          "The other variable is what kind of trip you want. A five-day stay in one region reads as a holiday. The same five days split three ways reads as a transfer schedule, and travellers almost always report back that they should have moved less.",
        ],
        table: {
          columns: ["Days", "What fits", "Bases", "Best for"],
          rows: [
            [
              "5",
              "One region, properly",
              "One, or two at a push",
              "A first taste, or a stopover on a longer Asia trip",
            ],
            [
              "7",
              "Two regions plus one island day trip",
              "Two",
              "The most common first trip, and the one most itineraries describe",
            ],
            [
              "10",
              "Bali plus the Gilis or a night on Nusa Penida",
              "Two on Bali, one island",
              "Travellers who want a distinct beach half rather than a day trip",
            ],
            [
              "14",
              "Bali plus Komodo, or a crossing into Java",
              "Three, with one flight",
              "A second visit, or a long and unhurried first one",
            ],
          ],
          caption:
            "How a Bali trip behaves by length, based on the routes we publish. Treat these as working shapes rather than fixed plans, because traffic decides more here than distance does.",
        },
        link: {
          before: "If a week is what you have, ",
          href: "/trips/5-days-bali-ubud-canggu-uluwatu",
          anchor: "what five days in Ubud, Canggu and Uluwatu actually looks like",
          after: " is the honest version of it.",
        },
      },
      {
        heading: "Where should you base yourself in Bali?",
        body: [
          "Ubud for rice terraces and temples, Canggu for surf and cafes, Uluwatu for cliffs and sunsets, Sanur or Amed for a quieter coast. Most first trips work best split between two of those, one inland and one on the coast, because every extra move costs you an afternoon in traffic.",
          "The pairing that works for the largest number of people is Ubud first and somewhere on the south coast second. It puts the temples, the walking and the inland days at the start, and the beach at the end, which is the order almost everyone prefers once they have tried both.",
        ],
        link: {
          before: "Each area, with what it costs you to be there, is compared in ",
          href: "/destinations/bali/where-to-stay-in-bali",
          anchor: "our full where to stay in Bali guide",
          after: ".",
        },
      },
      {
        heading: "When is the best time to visit Bali?",
        body: [
          "April to October is the dry season and the reliable window. July, August and the fortnight around Christmas are the busiest and the most expensive. April, May, June and September give you close to the same weather with fewer people. The wet season brings afternoon rain rather than washed out days.",
          "Price moves further than weather does. A villa in shoulder season and the same villa in August are often a different trip financially, and the roads in the south change character entirely between the two. If your dates are flexible at all, the shoulder months are where the value sits.",
        ],
        link: {
          before: "Month by month, including what the sea does, is set out in ",
          href: "/destinations/bali/best-time-to-visit-bali",
          anchor: "our best time to visit Bali guide",
          after: ".",
        },
      },
      {
        heading: "How much does a week in Bali cost?",
        body: [
          "Budget travel in Bali runs about $30 to $50 a day, mid range $70 to $100, and comfortable travel with a villa and a driver $150 to $250. A mid range fortnight lands near $800 to $1,200 before flights. Every arriving visitor also pays the IDR 150,000 Bali tourism levy.",
          "The line that moves your total is not accommodation, which is cheap at every level here. It is how you travel between places. A private driver by the day and a string of island transfers can quietly double a week, which is another reason the base count in the first section matters.",
        ],
        link: {
          before: "The full breakdown, by category and by traveller type, is in ",
          href: "/indonesia-travel-costs",
          anchor: "our Indonesia travel costs guide",
          after: ".",
        },
      },
      {
        heading: "Should you add Nusa Penida, the Gilis or Komodo?",
        body: [
          "Add Nusa Penida at seven days or more, the Gili Islands at ten, and Komodo only at fourteen. The first is a fast boat and half a day, the second costs you a travel day each way, and the third is a flight that needs three days of its own to be worth taking.",
          "The rule underneath all three is the same. An island add-on is worth it when you sleep there and a poor idea when you do not, because the crossing eats the part of the day you came for. A rushed Nusa Penida day trip is the single most common regret on a Bali week.",
        ],
        table: {
          columns: ["Add-on", "How you get there", "Days it really costs", "Add it from"],
          rows: [
            [
              "Nusa Penida",
              "Fast boat from Sanur, about 30 to 45 minutes",
              "Half a day each way, or one night to do it properly",
              "7 days",
            ],
            [
              "Gili Islands",
              "Fast boat from Padangbai or Amed, roughly 1.5 to 2.5 hours",
              "A travel day each way",
              "10 days",
            ],
            [
              "Komodo",
              "Flight to Labuan Bajo",
              "Three days minimum, including the park boat day",
              "14 days",
            ],
          ],
          caption:
            "The three add-ons travellers ask about most, priced in days rather than money. Crossing times come from our transport pages and shift with the sea, so confirm the day before.",
        },
        subsections: [
          {
            heading: "Is Nusa Penida worth a day trip or a night?",
            body: [
              "A night, if you can spare it. The famous viewpoints sit at opposite ends of a small island with rough roads between them, and a day trip means seeing two of them at the busiest hour and spending the rest on a boat. One night turns the same island into an unhurried day and an empty morning.",
            ],
            link: {
              before: "The unrushed version is our ",
              href: "/trips/5-days-nusa-penida-lembongan",
              anchor: "5-day Nusa Penida and Lembongan route",
              after: ".",
            },
          },
          {
            heading: "How long does it take to reach the Gili Islands from Bali?",
            body: [
              "The fast boat runs roughly 1.5 to 2.5 hours depending on where you leave from and what the sea is doing. Padangbai and Amed are the usual departure points, and crossings get cancelled in bad weather, so never book a same-day onward flight against one.",
            ],
            link: {
              before: "The combined route, with the crossing built in, is our ",
              href: "/trips/10-days-bali-gili-islands",
              anchor: "10-day Bali and Gili Islands itinerary",
              after: ".",
            },
          },
        ],
        link: {
          before: "Every island within reach of Bali, compared side by side, is in ",
          href: "/destinations/bali-nearby-islands",
          anchor: "our guide to the islands near Bali",
          after: ".",
        },
      },
      {
        heading: "How do you get around Bali?",
        body: [
          "Most travellers cover Bali with a driver hired by the day, a scooter for short local hops, or ride hailing in the south. Denpasar airport to Ubud is about 75 minutes off peak and up to two hours in traffic, at roughly $25 to $35 per car for a pre-booked private transfer.",
          "Ride hailing works in much of the south and is restricted or unwelcome in some areas, which is why a driver for the day remains the default for anything beyond a short hop. Scooters are cheap and are also how most travel insurance claims in Bali begin, so ride one only if you already ride one at home and have the licence to match.",
        ],
        link: {
          before: "The arrival leg, compared option by option, is in ",
          href: "/transport/denpasar-airport-to-ubud",
          anchor: "Denpasar airport to Ubud",
          after: ".",
        },
      },
    ],
  },
  {
    slug: "bali-nearby-islands",
    value: "bali_nearby_islands",
    name: "Bali + Nearby Islands",
    shortName: "Bali & Islands",
    h1: "Islands Near Bali",
    metaTitle: "Islands Near Bali: Which to Visit and How to Get There",
    metaDescription:
      "Which islands sit near Bali, how long each takes to reach by fast boat or plane, and how to pick the one that fits your trip. Honest trade-offs.",
    intro:
      "Bali is best paired with the islands at its doorstep. These itineraries combine the mainland with Nusa Penida, Lembongan and the Gilis, with the ferries, transfers and dive spots already mapped out for you.",
    highlights: ["Nusa Penida", "Nusa Lembongan", "Gili Islands", "Manta dives"],
    // Journey times below are the ones already published on our /transport/*
    // pages, kept in sync deliberately rather than re-researched.
    sections: [
      {
        heading: "Which islands are near Bali?",
        body: [
          "Nine islands sit within easy reach of Bali. The three Nusa islands, Penida, Lembongan and Ceningan, are the closest, around 25 to 45 minutes by fast boat from Sanur. The three Gilis and Lombok are an hour or two further east. Komodo, Java and Sumbawa need a short flight.",
        ],
        table: {
          columns: ["Island", "Getting there from Bali", "Go for", "Skip it if"],
          rows: [
            [
              "Nusa Penida",
              "Fast boat from Sanur, about 25 to 45 minutes",
              "Cliff viewpoints and manta snorkelling",
              "You dislike rough roads, the island's tracks are hard work",
            ],
            [
              "Nusa Lembongan",
              "Same Sanur corridor, about 25 to 45 minutes",
              "An easy first island, walkable and calm",
              "You want variety, it is small",
            ],
            [
              "Nusa Ceningan",
              "Bridge from Lembongan, a few minutes",
              "A quiet half day next door",
              "You need it to fill a whole trip",
            ],
            [
              "Gili Trawangan",
              "Fast boat, roughly 1.5 to 2.5 hours",
              "Restaurants, bars and easy reef swims",
              "You want quiet",
            ],
            [
              "Gili Air",
              "Fast boat, roughly 1.5 to 2.5 hours",
              "The balance of calm and somewhere to eat",
              "You want full seclusion",
            ],
            [
              "Gili Meno",
              "Fast boat, roughly 1.5 to 2.5 hours",
              "Seclusion, very little on the schedule",
              "Three nights would bore you",
            ],
            [
              "Lombok",
              "Flight about 45 minutes, or fast boat 2 to 3.5 hours",
              "Empty surf beaches and the Rinjani trek",
              "Your trip is under a week",
            ],
            [
              "Komodo (via Labuan Bajo)",
              "Flight about 1 hour 15 minutes",
              "Dragons, Padar, and the best boat days in Indonesia",
              "You cannot spare three days",
            ],
            [
              "Java",
              "Flight to Yogyakarta about 1 hour 25 minutes",
              "Borobudur, Prambanan and volcano sunrises",
              "You want beach time",
            ],
          ],
          caption:
            "Working estimates. Sea crossings depend on conditions and operators change schedules, so confirm before you book.",
        },
      },
      {
        heading: "How far is each island from Bali?",
        body: [
          "The closest islands to Bali are the three Nusas, 25 to 45 minutes by fast boat from Sanur. The Gilis are one and a half to two and a half hours at sea, plus the road transfer to the port. Lombok is about 45 minutes by air, Komodo and Java a little over an hour.",
          "The number that catches people out is the transfer to the port rather than the crossing itself. Sanur is close to Denpasar and Seminyak but a long way from Uluwatu or Ubud, and the Gili boats leave from Padangbai or Serangan, which can add well over an hour before you board. Count the whole door-to-door time, not the time at sea.",
        ],
        table: {
          columns: ["Island", "Leaves from", "How you get there", "Time"],
          rows: [
            ["Nusa Penida", "Sanur", "Fast boat", "25 to 45 minutes at sea"],
            ["Nusa Lembongan", "Sanur", "Fast boat", "25 to 45 minutes at sea"],
            ["Nusa Ceningan", "Lembongan", "Bridge, on foot or by scooter", "A few minutes"],
            [
              "Gili Trawangan",
              "Padangbai or Serangan",
              "Fast boat",
              "1.5 to 2.5 hours at sea, plus the road transfer",
            ],
            [
              "Gili Air",
              "Padangbai or Serangan",
              "Fast boat",
              "1.5 to 2.5 hours at sea, plus the road transfer",
            ],
            [
              "Gili Meno",
              "Padangbai or Serangan",
              "Fast boat, often via Trawangan",
              "1.5 to 2.5 hours at sea, plus the road transfer",
            ],
            [
              "Lombok",
              "Denpasar (DPS)",
              "Domestic flight",
              "30 to 45 minutes in the air, near 2 hours door to door",
            ],
            [
              "Komodo (Labuan Bajo)",
              "Denpasar (DPS)",
              "Domestic flight",
              "About 1 hour 15 minutes",
            ],
            ["Java (Yogyakarta)", "Denpasar (DPS)", "Domestic flight", "About 1 hour 25 minutes"],
          ],
          caption:
            "These are the journey times published on our transport pages. Sea crossings depend on conditions and operators change schedules, so confirm before you book.",
        },
      },
      {
        heading: "What are the Nusa Islands?",
        body: [
          "The Nusa Islands are three small islands off Bali's south-east coast: Nusa Penida, Nusa Lembongan and Nusa Ceningan. Penida is the largest and most dramatic, Lembongan the easiest to spend a few slow days on, and Ceningan is joined to Lembongan by a bridge. All three run from Sanur.",
        ],
        link: {
          before: "If you are choosing between the first two, we compare them in detail in ",
          href: "/destinations/bali-nearby-islands/nusa-penida-vs-nusa-lembongan",
          anchor: "Nusa Penida vs Nusa Lembongan",
          after: ".",
        },
      },
      {
        heading: "Which island near Bali should you choose?",
        body: [
          "Choose by how much time you have, not by photographs. Two or three days means the Nusa islands. Four or five means the Gilis. A week or more opens up Lombok, and anything longer makes Komodo or Java worth the flight. Each island below comes with what it is good for and who should leave it out.",
        ],
        subsections: [
          {
            heading: "Nusa Penida",
            body: [
              "Nusa Penida is the largest of the three Nusas and the one people have already seen in photographs, usually Kelingking and its cliff shaped like a dinosaur's head. It is also the hardest work. The island is big, the interior roads are steep, narrow and in poor repair, and the west coast viewpoints fill with day-trippers between ten and two.",
              "Two or three nights turns it from a queue into a proper trip, because you can reach the viewpoints early and snorkel or dive the Manta Point cleaning stations in the same window. Manta sightings are seasonal and never guaranteed. Leave Penida out if rough roads and long transfer days are the part of travel you like least.",
            ],
            link: {
              before: "Our ",
              href: "/destinations/bali-nearby-islands/nusa-penida-itinerary",
              anchor: "Nusa Penida itinerary",
              after: " covers both the two and three-day versions.",
            },
          },
          {
            heading: "Nusa Lembongan",
            body: [
              "Nusa Lembongan is the easiest island near Bali to arrive on and immediately enjoy. It is small enough to cross by scooter in twenty minutes, the strip at Jungutbatu has places to eat without feeling built up, and the mangroves at the north end and the Devil's Tear blowhole on the west coast are a short ride from anywhere you would stay.",
              "It is the right first island for travellers who want the water and the pace without the driving Penida demands. The trade-off is variety: three nights is comfortable, five will drag unless you are diving or surfing. The boat from Sanur takes the same 25 to 45 minutes as Penida.",
            ],
            link: {
              before: "The ",
              href: "/trips/5-days-nusa-penida-lembongan",
              anchor: "5-day Nusa Penida and Lembongan route",
              after: " pairs it with its bigger neighbour.",
            },
          },
          {
            heading: "Nusa Ceningan",
            body: [
              "Nusa Ceningan is the smallest of the three and is joined to Lembongan by a narrow yellow suspension bridge you cross in a couple of minutes on foot or by scooter, which is why almost nobody treats it as a separate destination. What it gives you is a quiet half day: the Blue Lagoon inlet on the east side, a cliff jump for those who want one, seaweed farms in the shallows and a handful of warungs.",
              "Stay on Lembongan and come here for an afternoon. Ceningan on its own does not have enough to fill a trip, and the accommodation is limited.",
            ],
            link: {
              before: "It works well with children, which is the shape of our ",
              href: "/trips/7-days-nusa-lembongan-ceningan-with-kids",
              anchor: "7-day Lembongan and Ceningan family route",
              after: ".",
            },
          },
          {
            heading: "Gili Trawangan",
            body: [
              "Gili Trawangan is the largest and busiest of the three Gilis, and the only one with real nightlife. No cars or motorbikes are allowed on any of the Gilis, so everything moves by bicycle, on foot or by pony cart, which changes the feel of the place more than you expect it to.",
              "Trawangan has the widest choice of restaurants and dive schools, a reef you can swim to from the beach and green turtles that turn up on it regularly. Go for company and options. Leave it out if quiet is the point of your trip, because the south-east strip runs loud well past midnight in high season.",
            ],
            link: {
              before: "Our ",
              href: "/trips/4-days-gili-islands-trawangan-meno-air",
              anchor: "4-day route across all three Gilis",
              after: " gives each island a fair share.",
            },
          },
          {
            heading: "Gili Air",
            body: [
              "Gili Air is the compromise of the three and, for most travellers, the right one. It is quiet enough to hear the water at night and has enough restaurants, dive shops and beach bars that you never feel stranded, which is the balance Trawangan and Meno each miss in opposite directions.",
              "The island takes about an hour and a half to walk around. Snorkelling straight off the east and south beaches is good, and the same fast boats that serve Trawangan stop here. Choose Air if you cannot decide between the other two, because it is the one nobody regrets.",
            ],
            link: {
              before: "It anchors the first half of our ",
              href: "/trips/7-days-lombok-gili-islands",
              anchor: "7-day Lombok and Gili route",
              after: ".",
            },
          },
          {
            heading: "Gili Meno",
            body: [
              "Gili Meno is the quietest Gili and the one couples are usually pointed towards. There is a salt lake in the middle, a turtle hatchery on the beach, a scattering of bungalows and very little else, which is the appeal rather than a shortcoming.",
              "Snorkelling on the west side is the best of the three islands, and the underwater statue circle off the north-west beach draws most of the boats that come. Three nights is plenty. Meno is the wrong choice if you want variety in where you eat or anything at all after dark, and accommodation runs from very simple to expensive with little in between.",
            ],
            link: {
              before: "For a route built around the quiet islands, see the ",
              href: "/trips/9-days-lombok-gili-honeymoon",
              anchor: "9-day Lombok and Gili honeymoon",
              after: ".",
            },
          },
          {
            heading: "Lombok",
            body: [
              "Lombok is not a side trip, it is a destination that happens to sit next to Bali. It is large, the drives are long, and it holds three quite different trips: the south coast around Kuta Lombok and Selong Belanak with the emptiest good surf beaches in the region, the Rinjani trek which needs three days and real fitness, and the quieter west coast beaches.",
              "A flight from Denpasar takes 30 to 45 minutes in the air and close to two hours door to door, and fast boats run to the west and north. Give Lombok a week or leave it out, because four days spent driving between its corners is the version travellers come back disappointed by.",
            ],
            link: {
              before: "The ",
              href: "/trips/7-days-south-lombok-kuta-beaches",
              anchor: "7-day south Lombok route",
              after: " is the one to start with if beaches are the reason you are going.",
            },
          },
          {
            heading: "Komodo, via Labuan Bajo",
            body: [
              "Komodo needs a flight rather than a boat, about an hour and a quarter from Denpasar to Labuan Bajo, and it repays the effort more than anything else on this list. The draw is the boat days: Padar's three-bay viewpoint, the pink sand beach, Manta Point, and the dragons themselves on Rinca or Komodo island with a ranger.",
              "Three days is the working minimum and a liveaboard of two or three nights is the better version. Budget for national park fees, which were restructured across Indonesian parks during 2026 and are worth confirming before you book. Leave Komodo out if you cannot spare three clear days, because a rushed version is mostly airport.",
            ],
            link: {
              before: "Our ",
              href: "/trips/5-days-labuan-bajo-komodo",
              anchor: "5-day Labuan Bajo and Komodo route",
              after: " is the shortest version that still works.",
            },
          },
          {
            heading: "Java",
            body: [
              "Java is the cultural counterweight to Bali and the flight is short, about an hour and 25 minutes from Denpasar to Yogyakarta. You go for Borobudur and Prambanan, two enormous temple complexes an hour apart, and for the volcanoes: Bromo's caldera at sunrise, and Ijen's sulphur miners and blue flame, which means a one in the morning start and a genuinely hard walk.",
              "Yogyakarta itself is the best city in Indonesia to spend two days in. Java is the wrong choice if you want beach time, because the good beaches sit a long way from everything else, and the distances between the highlights are larger than the map suggests.",
            ],
            link: {
              before: "The ",
              href: "/trips/5-days-yogyakarta-bromo",
              anchor: "5-day Yogyakarta and Bromo route",
              after: " is the tightest way to see both halves.",
            },
          },
        ],
      },
      {
        heading: "Which islands near Bali can you visit as a day trip?",
        body: [
          "Only the Nusa islands work as a day trip, and even then Nusa Penida is a long day: an early boat, a full schedule on poor roads, and a late return. Lembongan and Ceningan are the gentler choice. The Gilis, Lombok and Komodo all need at least one overnight to be worth the crossing.",
        ],
      },
      {
        heading: "Can you island hop between them?",
        body: [
          "Along two corridors, yes. Sanur to the three Nusa islands is one, and Bali to the Gilis and Lombok is the other. Crossing directly between the Nusas and the Gilis is sold, but it is the unreliable one: it involves a mandatory port stop that stretches the day to somewhere between two and four hours.",
          "The practical consequence is that most routes go back through Bali rather than stake a day on a single connection with no alternative if the sea is up. Build the change of islands around a night in Sanur or Padangbai instead of treating the two groups as one chain, and take the morning crossing, when conditions are usually calmer and there is a later boat to fall back on.",
        ],
        link: {
          before: "We break the awkward one down in ",
          href: "/transport/gili-islands-to-nusa-penida",
          anchor: "Gili Islands to Nusa Penida",
          after: ".",
        },
      },
      {
        heading: "Nusa Penida or Lombok?",
        body: [
          "Pick Nusa Penida if you have two or three days and want the famous cliff viewpoints close to Bali. Pick Lombok if you have a week or more and want beaches, surf and a volcano trek with far fewer people. Penida is a side trip from Bali. Lombok is a destination of its own.",
        ],
      },
      {
        heading: "Which island near Bali is best for a honeymoon?",
        body: [
          "Gili Meno is the usual answer: the quietest of the three Gilis, a handful of bungalows and almost nothing to do. Gili Air suits couples who want calm plus somewhere to eat. Nusa Lembongan works if you want to stay close to Bali. Lombok's south coast holds the larger resorts.",
          "The real decision is how much travel time you are willing to give up. Every hour spent reaching a quieter island is an hour not spent on it, and on a one-week honeymoon that maths turns quickly. Lembongan costs you almost nothing to reach and is the least secluded. Lombok costs you the best part of a day each way and is the most private. The Gilis sit in between and are where most couples land.",
          "One practical warning that applies to all of them: the Gilis have no cars, no hospital and limited power infrastructure, which is charming for three nights and stops being charming if something goes wrong. Couples who want seclusion and a safety net are better served on Lombok or in Bali itself.",
        ],
        table: {
          columns: ["Island", "Why it works", "The trade-off", "Best for"],
          rows: [
            [
              "Gili Meno",
              "The quietest Gili, and the best snorkelling of the three",
              "Almost nothing to do after dark",
              "Couples who want the days empty on purpose",
            ],
            [
              "Gili Air",
              "Calm, with restaurants and a beach bar or two",
              "Never fully secluded",
              "A first honeymoon in Indonesia",
            ],
            [
              "Nusa Lembongan",
              "25 to 45 minutes from Bali, so no day is lost to travel",
              "The least remote of the four",
              "Short trips, or pairing with time in Bali",
            ],
            [
              "South Lombok",
              "Larger resorts, real privacy and empty beaches",
              "A long transfer, and it needs a week to justify",
              "Couples who want a resort rather than a bungalow",
            ],
          ],
          caption:
            "Judgements rather than prices, because what each costs moves with the season. Confirm before you commit.",
        },
        link: {
          before: "For the version that stays close to Bali, see our ",
          href: "/trips/6-days-nusa-islands-honeymoon",
          anchor: "6-day Nusa islands honeymoon",
          after: ".",
        },
      },
    ],
  },
  {
    slug: "java",
    value: "java",
    name: "Java",
    shortName: "Java",
    // "Java" alone is the nav label and an ambiguous H1 (the language outranks
    // the island). The hub takes 128 impressions and no clicks, and its biggest
    // query is "java itinerary" at position 69, so the H1 and title now carry
    // that wording instead of a bare comma list of landmarks.
    h1: "Java Itineraries",
    metaTitle: "Java Itineraries: Yogyakarta, Bromo and Ijen, Day by Day",
    metaDescription:
      "How many days Java needs, the order that saves the most road time, and where Borobudur, Bromo and Ijen fit. Day-by-day routes with transfer times.",
    intro:
      "Java is volcanoes, temples, and overnight trains. From the sunrise over Borobudur to the blue flames of Kawah Ijen, these itineraries get you across the island without losing days to logistics.",
    highlights: [
      "Yogyakarta & Borobudur",
      "Mount Bromo sunrise",
      "Ijen blue flames",
      "Jakarta gateway",
    ],
    // PARTE 4 of docs/reinforce-java.md, applied 2026-08-17. The hub took 128
    // impressions and 0 clicks at position 29.0, and 43% of that cluster is one
    // query, "java itinerary", sitting at position 69. It was a bare intro plus
    // four highlights: it answered none of the three questions that SERP is
    // built on, how many days, in what order, and whether the train works. The
    // competing set is entirely editorial blogs, no institutional sites, so it
    // is winnable on content.
    //
    // Train and transfer times below come from src/data/routes.ts, which is the
    // published source. Keep the two in sync if either changes.
    sections: [
      {
        heading: "How many days do you need in Java?",
        body: [
          "Five days covers Yogyakarta and one volcano. Seven to eight gets Yogyakarta, Bromo and Ijen in a single east-bound line. Ten days adds Jakarta or Bandung at the western end without rushing. Two weeks lets you cross into Bali overland at the end instead of flying back. Below three days, pick one city.",
          "The number that decides everything is how many pre-dawn starts you are willing to accept. Borobudur at sunrise, Bromo at sunrise and Ijen at 1am are three of them inside a week, and travellers who plan all three back to back usually cut one on the day.",
        ],
        table: {
          columns: ["Days", "Route", "What you get", "What you give up"],
          rows: [
            [
              "5",
              "Yogyakarta, then Bromo via Surabaya",
              "Borobudur, Prambanan and one sunrise volcano",
              "Ijen, and any time in Jakarta or Bandung",
            ],
            [
              "7 to 8",
              "Yogyakarta, Bromo, Ijen, exit to Bali",
              "The classic east-bound crossing, both volcanoes",
              "West Java entirely, and unhurried temple days",
            ],
            [
              "10",
              "Jakarta, Bandung, Yogyakarta, Bromo",
              "The western half plus the temples and one volcano",
              "Ijen, unless you cut a night in Bandung",
            ],
            [
              "14",
              "Jakarta to Bali overland, west to east",
              "Everything above, with room for a rest day",
              "Very little, this is the comfortable version",
            ],
          ],
          caption:
            "How the common Java trip lengths trade off. Treat these as working shapes rather than fixed plans, since one cancelled crater morning changes the whole line.",
        },
        subsections: [
          {
            heading: "How long should you spend in Yogyakarta itself?",
            body: [
              "Two full days is the honest minimum. One goes to Borobudur and Prambanan, which sit on opposite sides of the city, and the second to the kraton, Malioboro and the batik and silver workshops. A third day is what turns it from a temple stop into a city you have actually seen.",
            ],
            link: {
              before: "We list the city day by day in ",
              href: "/destinations/java/things-to-do-in-yogyakarta",
              anchor: "things to do in Yogyakarta",
              after: ".",
            },
          },
        ],
        link: {
          before: "The version most people end up booking is the ",
          href: "/trips/7-days-yogyakarta-east-java",
          anchor: "7-day Yogyakarta and East Java route",
          after: ".",
        },
      },
      {
        heading: "What order should you travel Java in?",
        body: [
          "West to east, almost always. Jakarta or Bandung first, then Yogyakarta, then Bromo, then Ijen, then the ferry or a short flight into Bali. That direction puts the long train legs at the start while you are fresh, ends the trip on a beach rather than in traffic, and keeps the two pre-dawn volcano starts close together.",
          "Going the other way is not wrong, it is just harder to end well. Arriving in Jakarta on your last day means a large, slow city and an airport run in traffic, instead of a ferry into Bali with a week of coast still ahead of you.",
        ],
        link: {
          before: "The full crossing, west coast to Bali, is the ",
          href: "/trips/15-days-java-bali",
          anchor: "15-day Java to Bali route",
          after: ".",
        },
      },
      {
        heading: "Can you cross Java by train?",
        body: [
          "Yes, and for most of the island it is the better choice. Java's rail network is the best in Indonesia, and an executive train such as the Taksaka or Argo services covers Jakarta to Yogyakarta in about six to seven and a half hours, city centre to city centre. The volcanoes are the exception, and both need a road transfer.",
          "Book executive class rather than economy for the long legs, and book it ahead in the Indonesian holiday weeks, when the trains genuinely sell out. Seats are assigned, luggage is your own problem, and the carriages are cold enough that a layer is worth carrying.",
        ],
        table: {
          columns: ["Leg", "Best way", "Working time", "Note"],
          rows: [
            [
              "Jakarta to Yogyakarta",
              "Executive train",
              "About 6 to 7.5 hours, around 19 trains daily",
              "Often wins door to door, since YIA airport is about an hour from town",
            ],
            [
              "Yogyakarta to Bromo",
              "Two-day, one-night road package",
              "About 8 to 10 hours of driving each way, usually split over 2 days",
              "The sunrise jeep leaves around 3am, so a same-day return is brutal",
            ],
            [
              "Surabaya to Bromo",
              "Road transfer or shuttle",
              "About 3 to 4 hours",
              "The closest gateway, and the only one where a single-day trip makes sense",
            ],
            [
              "Bali to Yogyakarta",
              "Direct flight",
              "About 1 hour 25 minutes",
              "There is no sensible overland version coming the other way",
            ],
          ],
          caption:
            "These are the journey times published on our transport pages. Schedules and operators change, so confirm before you book.",
        },
        link: {
          before: "We compare the two options in full in ",
          href: "/transport/jakarta-to-yogyakarta",
          anchor: "Jakarta to Yogyakarta, train against flight",
          after: ".",
        },
      },
      {
        heading: "Borobudur or Prambanan, and can you do both?",
        body: [
          "Both, and in one day if you plan it. They sit on opposite sides of Yogyakarta, roughly an hour apart by road, and the usual pairing is Borobudur at sunrise and Prambanan in the late afternoon. If you only have time for one, Borobudur is the more famous and the more crowded, Prambanan the quieter visit.",
          "Doing both in a day means a 4am start and a long stretch in a car in between, so it suits travellers on a tight week more than it suits anyone with three days in the city. Ticket rules and access to the upper levels of Borobudur have changed more than once, so check the current conditions before you build the morning around them.",
        ],
        link: {
          before: "The trade-offs are laid out in ",
          href: "/destinations/java/borobudur-vs-prambanan",
          anchor: "our full Borobudur against Prambanan comparison",
          after: ".",
        },
      },
      {
        heading: "When is the best time to visit Java?",
        body: [
          "The dry season, roughly April to October. That window gives the clearest sunrises at Bromo and the most reliable conditions at Ijen, where the blue flames need a pre-dawn hike and cloud ruins it. The wet months bring haze and cancelled crater access more often than travellers expect.",
          "July and August are dry but busy, and Bromo's viewpoints fill with jeeps well before dawn. May, June and September are the balance most people are looking for without knowing to ask for them.",
        ],
        subsections: [
          {
            heading: "How hard is the Ijen blue flames hike?",
            body: [
              "It is a steady 3 kilometre climb starting around 1am, then a steep and loose descent into the crater to reach the flames themselves. Most reasonably fit walkers manage the climb. The sulphur is the real issue, and a proper gas mask rather than a paper one is not optional.",
            ],
            link: {
              before: "What to expect, hour by hour, is in ",
              href: "/destinations/java/ijen-crater-guide",
              anchor: "our Ijen crater guide",
              after: ".",
            },
          },
        ],
        link: {
          before: "For the volcano specifically, see ",
          href: "/destinations/java/best-time-to-visit-mount-bromo",
          anchor: "when to visit Mount Bromo",
          after: ".",
        },
      },
    ],
  },
  {
    slug: "komodo-flores",
    value: "komodo_flores",
    name: "Komodo & Flores",
    shortName: "Komodo & Flores",
    h1: "Komodo Dragons and Flores",
    metaTitle: "Komodo Dragons on Flores: Where to See Them, Day by Day",
    metaDescription:
      "Komodo dragons live on Komodo, Rinca and parts of Flores. Where to see them from Labuan Bajo, plus day-by-day Komodo and Flores itineraries.",
    intro:
      "Komodo National Park and Flores offer some of Indonesia's most cinematic landscapes, Padar Island, Pink Beach, and the dragons themselves. Our itineraries cover liveaboards, day boats from Labuan Bajo, and overland routes inland.",
    highlights: ["Padar Island", "Komodo dragons", "Pink Beach", "Kelimutu lakes"],
    // PARTE 4 of docs/reinforce-komodo-flores.md, applied 2026-08-24. The hub took
    // 43 impressions and 0 clicks at position 34.2 across 16 queries, and twelve of
    // those sixteen ask the same thing: whether the dragons live on Flores. The page
    // offered an intro and a card grid and never answered it, which is why three
    // queries sat at position 16 to 22 with no clicks. The SERP is a conservation
    // NGO, travel blogs and Labuan Bajo operators, no institutional sites, so it is
    // winnable on content.
    //
    // Two deviations from the plan as written, both deliberate:
    //
    // 1. Park fees. The plan quoted IDR 250,000 per day plus a IDR 200,000 ranger
    //    fee. That is the older unbundled structure. Five documents already live
    //    (5-days-labuan-bajo-komodo, 10-days-komodo-flores, 14-days-bali-komodo-sumba,
    //    7-days-komodo-honeymoon-private-boat and their FAQs) publish the 2026
    //    bundled ticket instead, around IDR 650,000 or IDR 900,000 per route through
    //    the SiORA app. The published value wins. Note 7-days-komodo-diving keeps the
    //    per-day marine park figure on purpose: divers pay a different structure.
    // 2. Season. The plan implied the dry season improves your chances of seeing a
    //    dragon. best-time-to-visit-komodo already says the opposite and is right:
    //    dragons are seen year-round on ranger walks, and the season decides the
    //    crossings, not the sightings. Rewritten to match.
    sections: [
      {
        heading: "Do Komodo dragons live on Flores?",
        body: [
          "Yes, but almost nobody sees them there. The wild population lives inside Komodo National Park, on Komodo, Rinca, Nusa Kode and Gili Motang, and in scattered pockets on the west and north coasts of Flores itself. There is no organised way to see the Flores animals, so every visitor meets them in the park.",
          "The confusion in the question is geographic, and it is reasonable. Labuan Bajo, the town every Komodo boat leaves from, sits on the western tip of Flores. So you do fly to Flores to see the dragons, you sleep on Flores the night before, and then you cross to a different island to actually meet one.",
        ],
        link: {
          before: "For what fills the days either side of the boat trip, see ",
          href: "/destinations/komodo-flores/things-to-do-in-labuan-bajo",
          anchor: "what there is to do in Labuan Bajo",
          after: ".",
        },
      },
      {
        heading: "Where do you actually see the dragons, Komodo or Rinca?",
        body: [
          "Rinca, for most people. Loh Buaya on Rinca is the closer of the two ranger posts to Labuan Bajo, the trails are short and flat, and the dragon density is high. Komodo Island has the name and the longer crossing, and it suits an overnight boat trip better than a day trip.",
          "Either way the walk is guided. Ranger-led trails are the only way to see the dragons on both islands, and the rangers are there for safety as much as for spotting, since these are large, fast wild predators. Padar, the island on every photograph of this region, has the viewpoint and no resident dragons.",
        ],
        table: {
          columns: ["Island", "Crossing from Labuan Bajo", "The walk", "Pick it if"],
          rows: [
            [
              "Rinca (Loh Buaya)",
              "The shorter run, roughly 1 to 2 hours by boat",
              "Short, flat, ranger-led, high chance of a sighting",
              "You have one day and want the dragons to be the point",
            ],
            [
              "Komodo (Loh Liang)",
              "The longer run, commonly 2 to 4 hours depending on the boat",
              "Longer ranger-led trails on a much bigger island",
              "You are on an overnight or multi-day boat anyway",
            ],
            [
              "Padar",
              "Usually paired with the Komodo route",
              "A steep climb to the viewpoint, no dragons",
              "You want the photograph, not the animal",
            ],
            [
              "Flores coast",
              "You are already on it",
              "Nothing organised, no ranger posts, no access",
              "Never. Treat a sighting here as an accident, not a plan",
            ],
          ],
          caption:
            "Crossing times are working estimates and depend on the vessel and the sea, which is the single biggest variable in this park.",
        },
        link: {
          before:
            "Whether to do this on a day boat or sleep aboard is its own decision, covered in our ",
          href: "/destinations/komodo-flores/liveaboard-vs-day-trip-labuan-bajo",
          anchor: "liveaboard versus day trip comparison",
          after: ".",
        },
      },
      {
        heading: "How much does it cost to enter Komodo National Park?",
        body: [
          "Komodo now sells one bundled ticket per route rather than stacked fees. As a working estimate for 2026, budget around IDR 650,000 per person for the Komodo Island route, or around IDR 900,000 for routes taking in Rinca and Padar. Divers pay a different per-day structure. Fees change, so check the current official guidance.",
          "The bigger change is not the price, it is the booking. Tickets are pre-booked through the SiORA app or a licensed operator, and walk-up sales at the ranger post are no longer the route in. Most travellers never touch the app because their boat operator holds the slots, which is the practical argument for booking the boat rather than assembling the day yourself.",
        ],
        subsections: [
          {
            heading: "Is there a daily limit on visitors to Komodo National Park?",
            body: [
              "Yes. The park applies a cap of around 1,000 visitors per day across the whole park, with published per-site limits of roughly 250 at Loh Liang on Komodo, 150 at Loh Buaya on Rinca and 60 on Padar. Book several days ahead in high season, and treat a same-week plan as optimistic.",
              "This is the part that catches independent travellers. A boat operator with allocated slots is not selling you convenience, it is selling you entry, and in peak months that is the difference between a park day and a day in Labuan Bajo. Caps and quotas are adjusted by the park authority, so confirm the current numbers before you build a trip around them.",
            ],
            link: {
              before: "A route that already has the park days sequenced around this is our ",
              href: "/trips/5-days-labuan-bajo-komodo",
              anchor: "5-day Labuan Bajo and Komodo itinerary",
              after: ".",
            },
          },
        ],
      },
      {
        heading: "How many days do you need for Komodo and Flores?",
        body: [
          "Three days covers Komodo National Park from Labuan Bajo and nothing else. Five to seven adds a second boat day, better snorkelling and room for a cancelled crossing. Ten days is the point at which overland Flores becomes possible, with Kelimutu and the villages inland, and that is a slower and much harder trip.",
          "The mistake is treating Flores as a bolt-on. The overland road east from Labuan Bajo is long, winding and slow, and it deserves its own week rather than two rushed days at the end of a boat trip. If the dragons are what you came for, stay west and use the extra days on the water.",
        ],
        link: {
          before: "If the overland stretch tempts you, start with ",
          href: "/destinations/komodo-flores/kelimutu-guide",
          anchor: "the Kelimutu crater lakes",
          after: ".",
        },
      },
      {
        heading: "When is the best time to see Komodo dragons?",
        body: [
          "Any month, as far as the dragons are concerned. They are seen year-round on ranger walks, so the season does not decide whether you spot one. What the season decides is the boat: the dry months, broadly April to October, bring smooth predictable crossings, while the wet months can turn choppy enough to cancel a day on the water.",
          "Within the day, timing does matter. Dragons are most active in the cooler morning hours, which is one reason park boats leave Labuan Bajo before dawn. If you travel in the wet season, build slack into the itinerary rather than booking the park day on the morning of your flight out.",
        ],
        link: {
          before: "Month by month, including diving and manta season, see ",
          href: "/destinations/komodo-flores/best-time-to-visit-komodo",
          anchor: "when to go to Komodo",
          after: ".",
        },
      },
    ],
  },
  {
    slug: "lombok-gili",
    value: "lombok_gili",
    name: "Lombok & Gili Islands",
    shortName: "Lombok & Gili",
    h1: "Lombok and the Gili Islands",
    metaTitle: "Lombok and the Gili Islands: Day-by-Day Itineraries",
    metaDescription:
      "Which Gili to stay on, how the boats connect to Lombok, and how many days each leg needs. Day-by-day routes with transfer times and booking notes.",
    intro:
      "Lombok is Bali's quieter cousin, empty surf, the Rinjani volcano trek, and the three Gilis just offshore. These itineraries balance adventure days with reef time.",
    highlights: ["Mount Rinjani", "Kuta Lombok surf", "Gili Trawangan", "Gili Meno"],
    // PARTE 4 of docs/reinforce-lombok-gili.md, applied 2026-08-14. The hub took
    // 208 impressions and 0 clicks at position 30.7 across 50 queries while
    // offering a two-sentence intro and a card grid: it answered none of the
    // questions the cluster implies. The SERP here is entirely blogs, no
    // institutional sites and no large aggregator, so it is winnable on content.
    //
    // Journey times and prices below come from src/data/routes.ts rather than the
    // plan, which quoted 1.5 to 2.5 hours for the Lombok crossing as well as the
    // Gili one. The route pages have them apart: Gilis 1.5 to 2.5 hours, Lombok 2
    // to 3.5. Keep the two in sync if either changes.
    sections: [
      {
        heading: "Which Gili island should you stay on?",
        body: [
          "Gili Air is the safest choice for most travellers: quiet enough to unwind, but with enough restaurants and dive shops to fill a week. Gili Trawangan is the largest and the only one with nightlife. Gili Meno is the smallest and stillest, best for couples who want almost nothing on the schedule.",
          "All three are car-free and small enough to walk around in a couple of hours. The choice is about how much company you want at dinner, not about the snorkelling, which is good from all three.",
        ],
        table: {
          columns: ["Island", "What it feels like", "Pick it if", "The trade-off"],
          rows: [
            [
              "Gili Trawangan",
              "Largest and liveliest, with bars, dive shops and a beachfront strip",
              "You want restaurants and some nightlife",
              "The east strip is busy and loud in peak season",
            ],
            [
              "Gili Air",
              "Quiet, with a working village and real choice for dinner",
              "You want calm without isolation",
              "The south beachfront gets crowded mid-morning",
            ],
            [
              "Gili Meno",
              "Smallest and stillest, a handful of bungalows",
              "You are a couple and want almost nothing on the schedule",
              "Few places to eat and patchy card payment",
            ],
          ],
        },
        link: {
          before:
            "For the longer version, with beaches, diving and where each island falls down, see ",
          href: "/destinations/lombok-gili/gili-islands-comparison",
          anchor: "our full Gili islands comparison",
          after: ".",
        },
      },
      {
        heading: "Can you learn to dive in the Gili Islands?",
        body: [
          "Yes, and it is one of the most common places in Indonesia to do it. A PADI Open Water course takes three to four days, costs roughly IDR 5,000,000 to 6,900,000 as a working estimate, and runs on shallow, sheltered sites. Warm water and gentle conditions are why so many people certify here rather than at home.",
          "Prices barely vary between schools. Most established centres on Gili Trawangan belong to the Gili Indah Dive Alliance, which sets minimum prices across its members, so compare group size, instructors and gear rather than quotes. Allow more days than the course itself needs, because a cancelled crossing from Bali eats the buffer first.",
        ],
        link: {
          before: "The full week, course plus fun dives afterwards, is mapped out in our ",
          href: "/trips/7-days-gili-islands-learn-to-dive",
          anchor: "7-day Gili Islands diving itinerary",
          after: ".",
        },
      },
      {
        heading: "How do you get from Bali to Lombok and the Gili Islands?",
        body: [
          "Fast boats leave Bali's east coast ports daily and reach the Gili Islands in roughly 1.5 to 2.5 hours at sea, or Lombok in 2 to 3.5 hours. Lombok also has an international airport near Praya, about 45 minutes' flying from Denpasar, which is faster if you are starting in the south.",
        ],
        table: {
          columns: ["Crossing", "How", "Journey time", "Worth knowing"],
          rows: [
            [
              "Bali to the Gili Islands",
              "Fast boat from Padangbai, Amed, Sanur or Serangan",
              "1.5 to 2.5 hours at sea",
              "Add 1 to 3 hours by road to the port, depending on your Bali base",
            ],
            [
              "Bali to Lombok",
              "Domestic flight, Denpasar to Praya",
              "30 to 45 minutes in the air, near 2 hours door to door",
              "Around $60 to $90 one way, and weather-proof",
            ],
            [
              "Bali to Lombok",
              "Fast boat",
              "2 to 3.5 hours",
              "Worth it only for the northwest coast or the Gilis",
            ],
            [
              "Lombok to the Gili Islands",
              "Public boat from Bangsal",
              "15 to 30 minutes",
              "Around $2 to $4, leaves when it fills, last departures mid-afternoon",
            ],
          ],
          caption: "Times are working estimates and depend on sea conditions.",
        },
        subsections: [
          {
            // Carries the Italian query "da lombok a isole gili", 16 impressions
            // at position 27.8, which lands on this hub while the answer lives on
            // the transport route page with no link between them.
            heading: "How do you get from Lombok to the Gili Islands?",
            body: [
              "The public boat from Bangsal harbour on Lombok's northwest coast reaches Gili Air, Gili Meno and Gili Trawangan in 15 to 30 minutes for around $2 to $4. It leaves when roughly twenty passengers have filled it, so allow a buffer, and buy at the official counter rather than from the touts outside.",
            ],
            link: {
              before: "Fares, the counter to use and the last sailings are on our ",
              href: "/transport/lombok-to-gili-islands",
              anchor: "Lombok to Gili Islands route page",
              after: ".",
            },
          },
        ],
        link: {
          before:
            "Flight against fast boat, with prices and which to pick for your side of the island, is on our ",
          href: "/transport/bali-to-lombok",
          anchor: "Bali to Lombok route page",
          after: ".",
        },
      },
      {
        heading: "How many days do you need in Lombok and the Gilis?",
        body: [
          "Seven days is the working minimum for both, with three or four nights in Lombok and three on one Gili. Four days is enough if you only do the Gilis. Ten days is where the Rinjani trek and the south coast beaches fit without the trip becoming a chain of transfers.",
        ],
        table: {
          columns: ["Trip length", "What fits", "What you give up"],
          rows: [
            [
              "4 days",
              "The Gilis on their own, one or two islands",
              "Lombok entirely: no Rinjani, no south coast",
            ],
            [
              "7 days",
              "Three or four nights in Lombok and three on one Gili",
              "Rinjani, which needs two to three days of its own",
            ],
            [
              "10 days",
              "Lombok, the Gilis, and either the Rinjani trek or the Kuta Lombok beaches",
              "Little, unless you are adding Bali at the front",
            ],
          ],
        },
        subsections: [
          {
            // Added 2026-09-05 from docs/reinforce-10-days-bali-gili-islands.md,
            // item 1 of section 7. This hub is our strongest Gili page (222
            // impressions, position 28.0) and it did not link the Bali-plus-Gili
            // itinerary at all, while that page sits at 57.3 on the growing query
            // "bali and gili islands". The 10-day row of the table above already
            // ends on "unless you are adding Bali at the front", so the question
            // is one the reader is holding when they get here.
            heading: "Can you combine Bali and the Gili Islands in one trip?",
            body: [
              "Yes, and ten days is the length where it stops being a rush. The fast boat costs you the better part of two days out of the total, so a week spent on Bali plus the Gilis leaves you two nights on the islands and a lot of transit. Ten days buys three.",
            ],
            link: {
              before: "The route that does it, three bases in Bali and one island stop, is our ",
              href: "/trips/10-days-bali-gili-islands",
              anchor: "combine Bali and the Gili Islands in ten days",
              after: " itinerary.",
            },
          },
        ],
        link: {
          before: "The seven-day version is mapped out day by day in our ",
          href: "/trips/7-days-lombok-gili-islands",
          anchor: "7-day Lombok and Gili route",
          after: ", with the transfers and boat times already placed.",
        },
      },
      {
        heading: "Lombok or Bali: which one should you pick?",
        body: [
          "Choose Bali if you want variety, restaurants and short transfers between very different places. Choose Lombok if the point of the trip is quiet. Lombok has emptier beaches and lower prices, but fewer places to eat, longer drives, and less to fall back on when the weather turns.",
          "Most travellers with ten days or more do not choose. Bali first, then the boat east, is the usual shape, and it puts the busiest part of the trip at the start when you still have energy for it.",
        ],
        table: {
          columns: ["What matters", "Bali", "Lombok"],
          rows: [
            [
              "Beaches",
              "Busier, with beach clubs and full services",
              "Emptier, especially along the south coast",
            ],
            ["Eating out", "Wide choice at every price", "Thin outside Kuta Lombok and Senggigi"],
            [
              "Getting around",
              "Short hops, but heavy traffic in the south",
              "Longer drives on lighter roads",
            ],
            ["Cost", "Higher across the tourist south", "Lower for the same standard of room"],
            [
              "A rainy day",
              "Temples, museums, cafes, plenty to fall back on",
              "Much less to do indoors",
            ],
          ],
        },
        link: {
          before: "If the answer is both, the ",
          href: "/trips/10-days-bali-lombok-gili-islands",
          anchor: "10-day Bali, Lombok and Gili Islands route",
          after: " runs them in the order that works.",
        },
      },
      {
        heading: "When is the best time to visit Lombok and the Gilis?",
        body: [
          "Roughly May to October, the drier months, when the fast boat crossings are calmest and the water is clearest for snorkelling. November to March brings rougher seas and more cancelled sailings. Conditions vary year to year, so check the forecast in the week before you travel.",
          "The crossing, not the rain, is what usually breaks a plan here. A cancelled boat costs a day, so avoid booking a same-day onward flight out of Bali on the day you cross back.",
        ],
        link: {
          before: "Month by month, including the Rinjani trekking window, see ",
          href: "/destinations/lombok-gili/best-time-to-visit-lombok",
          anchor: "the best time to visit Lombok",
          after: ".",
        },
      },
    ],
  },
  {
    slug: "sumatra",
    value: "sumatra",
    name: "Sumatra",
    shortName: "Sumatra",
    metaTitle: "Sumatra itineraries, orangutans, jungle, Lake Toba",
    metaDescription:
      "Bukit Lawang orangutan trekking, Lake Toba, and remote Sumatran jungle routes. Bookable Indonesia itineraries.",
    intro:
      "Sumatra is wild. Orangutans in Bukit Lawang, the vast caldera of Lake Toba, and the surf of Mentawai. Our itineraries give structure to a region that rewards travellers who plan ahead.",
    highlights: ["Bukit Lawang orangutans", "Lake Toba", "Mentawai surf", "Banda Aceh diving"],
    // Section 6.2 of docs/reinforce-7-days-pulau-weh-sabang-diving-beach.md,
    // applied 2026-08-17. The hub named Pulau Weh nowhere and passed it nothing,
    // while the article sat at position 33.2 with 136 impressions and no page of
    // ours competing for the cluster. Regions and gateways below match the
    // `route` field of the six live Sumatra itineraries, kept in sync on purpose.
    sections: [
      {
        heading: "Which part of Sumatra should you pick?",
        body: [
          "Sumatra is too big for one trip, so you pick a region and fly into its own gateway. North Sumatra out of Medan is the orangutan and Lake Toba half. West Sumatra out of Padang is Minangkabau culture and the Harau Valley. Aceh, in the far north, is the diving. Kerinci is the trekking.",
          "The mistake is trying to join two of them overland. The distances are long, the roads are slow, and a domestic flight between gateways almost always beats the bus. If you have one week, take one region. If you have two, take two and fly between them.",
        ],
        table: {
          columns: ["Region", "Gateway", "What it is for", "A route we publish"],
          rows: [
            [
              "North Sumatra",
              "Medan (KNO)",
              "Bukit Lawang orangutans, Tangkahan, Berastagi and Lake Toba",
              "The 15-day Sumatra loop, or 9 days with kids",
            ],
            [
              "West Sumatra",
              "Padang (PDG)",
              "Bukittinggi, Lake Maninjau, Pagaruyung and the Harau Valley",
              "The 7-day West Sumatra route",
            ],
            [
              "Aceh and Pulau Weh",
              "Banda Aceh (BTJ)",
              "Quiet, warm-water diving and snorkelling, plus the tsunami memorial sites",
              "The 7-day Pulau Weh trip",
            ],
            [
              "Kerinci",
              "Padang (PDG), then a long road transfer",
              "Indonesia's highest volcano and the Gunung Tujuh crater lake",
              "The 8-day Kerinci trek",
            ],
          ],
          caption:
            "The four regions our Sumatra itineraries cover, with the airport each one actually runs from. Flight routes change, so confirm current connections before you fix dates.",
        },
        link: {
          before: "The one most travellers have never considered is the far north: our ",
          href: "/trips/7-days-pulau-weh-sabang-diving-beach",
          anchor: "7-day Pulau Weh diving and beach itinerary",
          after: " covers the ferry from Banda Aceh, the dive sites and what a week there costs.",
        },
      },
    ],
  },
  {
    slug: "raja-ampat",
    value: "raja_ampat",
    name: "Raja Ampat",
    shortName: "Raja Ampat",
    h1: "Raja Ampat Itineraries",
    metaTitle: "Raja Ampat Itineraries: Which Route, How Many Days",
    metaDescription:
      "Five Raja Ampat routes compared, 7 to 14 days: homestays, diving, family and honeymoon. Ferry times from Sorong and what to book first.",
    intro:
      "Raja Ampat sits at the heart of the Coral Triangle, the most biodiverse marine ecosystem on Earth. These itineraries cover Papuan homestays around Kri, Gam and Mansuar as well as dive resorts, with the Sorong flights and the Waisai ferry planned in.",
    highlights: ["Wayag viewpoints", "Manta Sandy", "Misool", "Kri homestays"],
    // PARTE 4 of docs/reinforce-raja-ampat.md, applied 2026-08-29. The hub took 39
    // impressions and 0 clicks at position 60.7, and 36 of those 39 are a single
    // cluster: "kri island", "raja ampat kri island", "kri raja ampat". Until today
    // this was one of only two hubs left with no sections at all, so the page
    // answered none of it. The SERP is stayrajaampat.com, papua-diving.com, travel
    // blogs and TripAdvisor, no institutional sites, so it is winnable on content.
    //
    // Deliberately NOT targeted at "Kri": 8-days-raja-ampat-homestays-kri-island was
    // published 2026-08-24 and must own that query. The subsection under section 4
    // exists to hand the Kri traffic to it. Do not put Kri in this hub's metaTitle.
    //
    // Two corrections against the plan as written, both verified first:
    //
    // 1. Inbound links needed nothing. All five raja_ampat articles already link
    //    this hub from their body, confirmed by GROQ. The gap was outbound: with no
    //    sections the hub carried no in-content link at all. The five sections and
    //    four subsections below add nine, covering every trip and every guide.
    // 2. Permit figures and season are taken from what is already published, not
    //    from the plan's own research. IDR 700,000 plus IDR 300,000 appears in
    //    three live articles, and best-time-to-visit-raja-ampat already says
    //    October to April. Matching them avoids the internal contradiction the
    //    komodo-flores plan produced once.
    sections: [
      {
        heading: "How many days do you need in Raja Ampat?",
        body: [
          "Seven days is the realistic minimum once the flights are counted, and ten to fourteen is where the trip stops feeling rushed. Two of those days go to getting in and out through Sorong and Waisai, so a seven-day trip buys you roughly four full days on the water. Anything shorter is mostly transit.",
          "Almost everything people picture when they think of Raja Ampat sits in the Dampier Strait, the stretch of water between Waisai, Gam, Mansuar and Kri. Basing in one place there, rather than repacking every night, is what makes a short trip work. Wayag in the far north and Misool in the south are separate expeditions, not extensions, and each one wants days of its own.",
        ],
        subsections: [
          {
            heading: "What changes if you have two weeks?",
            body: [
              "Two weeks buys depth rather than distance. You can add a liveaboard leg, reach the northern islands, and still keep a fixed base for part of the trip. For divers it also means enough repeat days to justify the flights, and enough slack that one bad-weather day costs you nothing.",
            ],
            link: {
              before: "The long version is laid out in ",
              href: "/trips/14-days-raja-ampat-divers",
              anchor: "the 14-day Raja Ampat route for divers",
              after: ".",
            },
          },
        ],
        link: {
          before: "For the shortest version that still works, see ",
          href: "/trips/7-days-raja-ampat-snorkeling-islands",
          anchor: "the 7-day Raja Ampat snorkelling route",
          after: ".",
        },
      },
      {
        heading: "How do you actually get to Raja Ampat?",
        body: [
          "Fly to Sorong, usually via Jakarta or Makassar, then take the fast ferry to Waisai, which runs around two hours. From Waisai your homestay or resort sends a local boat. Ferries commonly run twice a day in each direction, and the whole chain has to line up, so one missed flight can cost a full day.",
          "Ferry tickets are generally bought in person at the port rather than online, and schedules shift, so treat any timetable you read in advance as provisional and confirm locally. Published fares vary by class and by source, so budget generously rather than to the rupiah, and check the latest official guidance before you travel.",
        ],
        link: {
          before: "The full chain, flight by flight and boat by boat, is in ",
          href: "/destinations/raja-ampat/how-to-get-to-raja-ampat",
          anchor: "our guide to getting to Raja Ampat via Sorong",
          after: ".",
        },
      },
      {
        heading: "How much are the Raja Ampat permits, and what do they cover?",
        body: [
          "Two official fees apply and both are mandatory, even for a short stay. The marine park entry permit runs around IDR 700,000 per person and is valid for a year, and a visitor entry ticket adds roughly IDR 300,000. Together that is about IDR 1,000,000, or around 65 US dollars per person, usually paid in cash on arrival.",
          "The permit is a physical card and guides do check it, so keep it with you rather than in a bag left at the homestay. Children under twelve are generally exempt. Fees and collection methods change, so confirm the current amounts before you travel. Bring the cash from Sorong: ATMs are scarce once you are past Waisai, and boats, village fees and most homestays are cash only.",
        ],
        link: {
          before: "For what the rest of a trip costs on top of the permits, see ",
          href: "/destinations/raja-ampat/raja-ampat-cost-guide",
          anchor: "our Raja Ampat cost guide",
          after: ".",
        },
      },
      {
        heading: "Homestay or dive resort: which should you book?",
        body: [
          "Papuan homestays cost roughly 27 to 30 US dollars per person per night with three meals included, and put you on the beach the reef sits off. Dive resorts cost several times that and buy you hot water, reliable boats and a dive operation on site. The reef itself is the same from either one.",
          "The honest way to choose is by how much diving you plan to do. If you want two or three tanks a day, every day, a resort removes a daily negotiation and a lot of chartering. If you mostly want to snorkel, swim and sit still, a homestay puts you closer to the water for a fraction of the price, and the money you save covers the flights.",
        ],
        table: {
          columns: ["", "Papuan homestay", "Dive resort"],
          rows: [
            [
              "Cost per person, per night",
              "Roughly $27 to $30, three meals included",
              "Several times that, usually sold as a package",
            ],
            [
              "Rooms",
              "Wooden bungalows, often over the water, shared or mandi bathroom",
              "Rooms with hot water and steady power",
            ],
            [
              "Diving",
              "Arranged separately, boat charters roughly $100 to $200 a day",
              "In-house dive centre, scheduled daily boats",
            ],
            [
              "Power and wifi",
              "Generator for part of the day, patchy signal, no reliable wifi",
              "Generally continuous, wifi slow but present",
            ],
            [
              "Best for",
              "Snorkelling, a low budget and a slow pace",
              "Divers who want daily tanks and no logistics",
            ],
          ],
          caption:
            "The reef is identical from either. What you are paying for is logistics, not access.",
        },
        subsections: [
          {
            heading: "Which island should you base on: Kri, Gam or Mansuar?",
            body: [
              "Kri is the busiest and best connected, with the largest concentration of homestays and the shortest boat times to the best-known sites. Gam is quieter and stronger for birdlife, including the birds of paradise. Mansuar sits between the two. For a first trip, Kri wins on convenience and loses on solitude.",
            ],
            link: {
              before: "For what a week based on one island actually looks like, see ",
              href: "/trips/8-days-raja-ampat-homestays-kri-island",
              anchor: "the 8-day Kri Island homestay route",
              after: ".",
            },
          },
          {
            heading: "Does Raja Ampat work with kids?",
            body: [
              "It can, with one base and realistic expectations. The travel in is long and the boats are small, so the trip suits families who are comfortable in the water and happy to stay put once they arrive. Calm house reefs matter more than the famous dive sites, and a resort usually beats a homestay here.",
            ],
            link: {
              before: "The family version, with the calmer reefs picked out, is ",
              href: "/trips/9-days-raja-ampat-with-kids",
              anchor: "the 9-day Raja Ampat route with kids",
              after: ".",
            },
          },
        ],
        link: {
          before: "If you are weighing a boat against a fixed base, read ",
          href: "/destinations/raja-ampat/liveaboard-vs-basing-in-waisai",
          anchor: "liveaboard versus basing in Waisai",
          after: ".",
        },
      },
      {
        heading: "When is the best time to visit Raja Ampat?",
        body: [
          "Roughly October to April, when the seas are calmest, the rain eases and underwater visibility is at its clearest. The middle of the year brings stronger wind and rougher crossings. Raja Ampat has no clean dry season the way Bali does, so expect rain in any month and judge the window by wind and swell instead.",
          "Manta season shifts by site rather than following one calendar, so if mantas are the reason you are going, ask your resort or homestay which sites are producing that month rather than booking to a fixed date.",
        ],
        subsections: [
          {
            heading: "Does Raja Ampat work as a honeymoon?",
            body: [
              "Yes, if you both get in the water and you accept a long journey in. The scenery and the reef are the strongest in Indonesia, and the trade is cost, distance and a short list of properties. Couples who want a spa, a choice of restaurants and easy transfers will be happier elsewhere.",
            ],
            link: {
              before: "The couple's version of this route is ",
              href: "/trips/10-days-raja-ampat-honeymoon",
              anchor: "the 10-day Raja Ampat honeymoon",
              after: ".",
            },
          },
        ],
        link: {
          before: "Month by month, including how manta season moves, see ",
          href: "/destinations/raja-ampat/best-time-to-visit-raja-ampat",
          anchor: "the best time to visit Raja Ampat",
          after: ".",
        },
      },
    ],
  },
  {
    slug: "wild-indonesia",
    value: "wild_indonesia",
    name: "Wild Indonesia",
    shortName: "Wild Indonesia",
    metaTitle: "Off-the-beaten-path Indonesia itineraries",
    metaDescription:
      "Remote and offbeat Indonesia routes, Sulawesi, Maluku, Papua. For travellers who want the archipelago beyond Bali.",
    intro:
      "Beyond the well-trodden routes lies the rest of the archipelago, 17,000 islands of it. These itineraries cover Sulawesi, Maluku, Papua and other remote corners for travellers who want depth, not crowds.",
    highlights: ["Sulawesi", "Maluku spice islands", "Papua highlands", "Banda Sea"],
    sections: [
      {
        heading: "Sulawesi itinerary: which route fits your trip?",
        body: [
          "Sulawesi splits into four trips, not one. North Sulawesi is world-class diving at Bunaken and Lembeh. Tana Toraja is highland culture and funeral ceremonies. Wakatobi is remote reef in the southeast. The Togean Islands are the slow middle. Ten days covers two; fourteen covers three.",
        ],
        table: {
          columns: ["Region", "Best for", "Suggested days", "Best season"],
          rows: [
            [
              "North Sulawesi (Bunaken, Lembeh)",
              "Reef diving and muck diving",
              "3 to 5 days",
              "May to October",
            ],
            [
              "Tana Toraja",
              "Highland culture, funeral ceremonies",
              "2 to 3 days",
              "Year-round; June to September for ceremony season",
            ],
            [
              "Togean Islands",
              "Slow island time between the two ends",
              "3 to 4 days",
              "April to November",
            ],
            ["Wakatobi", "Remote reef, fewer boats", "4 to 6 days", "April to November"],
          ],
        },
        subsections: [
          {
            heading: "10 days: Toraja + North Sulawesi",
            body: [
              "The standard first Sulawesi trip: highland culture in Tana Toraja, then diving at Bunaken. Enough time in each without a rushed handover.",
            ],
            link: {
              before: "Full day-by-day plan on the ",
              href: "/trips/10-days-sulawesi-toraja-bunaken",
              anchor: "10-day Toraja and Bunaken itinerary",
              after: ".",
            },
          },
          {
            heading: "10 days: North Sulawesi diving focus",
            body: [
              "Skips Toraja for more time underwater, splitting days between Bunaken's reef walls and Lembeh's muck diving, a different style of dive from anywhere else in Indonesia.",
            ],
            link: {
              before: "Full day-by-day plan on the ",
              href: "/trips/10-days-north-sulawesi-diving-bunaken-lembeh",
              anchor: "10-day North Sulawesi diving itinerary",
              after: ".",
            },
          },
          {
            heading: "14 days: Toraja, Togean and Bunaken",
            body: [
              "The full traverse: highlands, the slow middle islands of the Togeans, then North Sulawesi diving to close. Two weeks is the minimum to do all three without feeling rushed.",
            ],
            link: {
              before: "Full day-by-day plan on the ",
              href: "/trips/14-days-sulawesi-toraja-togean-bunaken",
              anchor: "14-day Sulawesi itinerary",
              after: ".",
            },
          },
          {
            heading: "8 days: Wakatobi diving",
            body: [
              "A dedicated trip to the southeast, further from the Bunaken crowds and built around one of Indonesia's most intact reef systems.",
            ],
            link: {
              before: "Full day-by-day plan on the ",
              href: "/trips/8-days-wakatobi-diving-southeast-sulawesi",
              anchor: "8-day Wakatobi diving itinerary",
              after: ".",
            },
          },
        ],
      },
    ],
  },
];

export function findDestinationBySlug(slug: string): DestinationContent | undefined {
  return DESTINATION_CONTENT.find((d) => d.slug === slug);
}

// Look up a destination by its Sanity enum `value` (e.g. "bali_nearby_islands")
// rather than its URL slug. Used to turn an article's `destinationPrimary` into a
// destination URL for cross-linking to guides.
export function findDestinationByValue(value: string): DestinationContent | undefined {
  return DESTINATION_CONTENT.find((d) => d.value === value);
}
