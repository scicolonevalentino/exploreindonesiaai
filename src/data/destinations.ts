// Destination landing page content. Slugs are URL-safe and stable.
// `value` maps to the Sanity `destinationPrimary` / `destinationSecondary` enum
// in src/lib/sanity-queries.ts (DESTINATIONS).

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
  // Trailing sentence carrying one internal link.
  link?: { before: string; href: string; anchor: string; after: string };
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
          "Nine islands sit within easy reach of Bali. The three Nusa islands, Penida, Lembongan and Ceningan, are the closest, around 30 to 45 minutes by fast boat from Sanur. The three Gilis and Lombok are an hour or two further east. Komodo, Java and Sumbawa need a short flight.",
        ],
        table: {
          columns: ["Island", "Getting there from Bali", "Go for", "Skip it if"],
          rows: [
            [
              "Nusa Penida",
              "Fast boat from Sanur, about 30 to 45 minutes",
              "Cliff viewpoints and manta snorkelling",
              "You dislike rough roads, the island's tracks are hard work",
            ],
            [
              "Nusa Lembongan",
              "Same Sanur corridor, about 30 to 45 minutes",
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
        heading: "Which islands near Bali can you visit as a day trip?",
        body: [
          "Only the Nusa islands work as a day trip, and even then Nusa Penida is a long day: an early boat, a full schedule on poor roads, and a late return. Lembongan and Ceningan are the gentler choice. The Gilis, Lombok and Komodo all need at least one overnight to be worth the crossing.",
        ],
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
          "Gili Meno is the usual answer: the quietest of the three Gilis, a handful of bungalows and almost nothing to do. Gili Air suits couples who want calm plus somewhere to eat. Nusa Lembongan works if you want to stay close to Bali. Lombok's north coast holds the larger resorts.",
        ],
        link: {
          before: "For a route that puts those islands together, see our ",
          href: "/trips/9-days-lombok-gili-honeymoon",
          anchor: "9-day Lombok and Gili honeymoon",
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
