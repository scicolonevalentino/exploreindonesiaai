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
    metaTitle: "Bali itineraries, bookable AI trip plans",
    metaDescription:
      "Hand-picked Bali itineraries, from short escapes to two-week routes through Ubud, Canggu, Uluwatu and the east. Turn any plan into a bookable trip.",
    intro:
      "From the rice terraces of Ubud to the surf breaks of Uluwatu, Bali rewards travellers who plan around its rhythm. Browse our curated itineraries, every route is structured day by day so you can review, adjust, and book stays, transfers, and experiences in one place.",
    highlights: ["Ubud & rice terraces", "Canggu surf", "Uluwatu cliffs", "East Bali volcanoes"],
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
  },
  {
    slug: "komodo-flores",
    value: "komodo_flores",
    name: "Komodo & Flores",
    shortName: "Komodo & Flores",
    metaTitle: "Komodo & Flores itineraries, boats, dragons, dives",
    metaDescription:
      "Multi-day Komodo boat trips, Flores overland routes, and dive itineraries. Every plan is structured day by day and ready to book.",
    intro:
      "Komodo National Park and Flores offer some of Indonesia's most cinematic landscapes, Padar Island, Pink Beach, and the dragons themselves. Our itineraries cover liveaboards, day boats from Labuan Bajo, and overland routes inland.",
    highlights: ["Padar Island", "Komodo dragons", "Pink Beach", "Kelimutu lakes"],
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
  },
  {
    slug: "raja-ampat",
    value: "raja_ampat",
    name: "Raja Ampat",
    shortName: "Raja Ampat",
    metaTitle: "Raja Ampat itineraries, diving & liveaboards",
    metaDescription:
      "Raja Ampat diving itineraries and liveaboard routes through the world's richest reefs. Plan and book your trip day by day.",
    intro:
      "Raja Ampat sits at the heart of the Coral Triangle, the most biodiverse marine ecosystem on Earth. These itineraries cover homestays in Arborek and Kri, plus liveaboard options for serious divers.",
    highlights: ["Wayag viewpoints", "Manta Sandy", "Misool", "Kri homestays"],
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
            ["North Sulawesi (Bunaken, Lembeh)", "Reef diving and muck diving", "3 to 5 days", "May to October"],
            ["Tana Toraja", "Highland culture, funeral ceremonies", "2 to 3 days", "Year-round; June to September for ceremony season"],
            ["Togean Islands", "Slow island time between the two ends", "3 to 4 days", "April to November"],
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
