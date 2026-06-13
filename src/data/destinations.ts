// Destination landing page content. Slugs are URL-safe and stable.
// `value` maps to the Sanity `destinationPrimary` / `destinationSecondary` enum
// in src/lib/sanity-queries.ts (DESTINATIONS).

export type DestinationContent = {
  slug: string;
  value: string;
  name: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  highlights: string[];
};

export const DESTINATION_CONTENT: DestinationContent[] = [
  {
    slug: "bali",
    value: "bali",
    name: "Bali",
    shortName: "Bali",
    metaTitle: "Bali itineraries, bookable AI trip plans | ExploreIndonesia.ai",
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
    metaTitle: "Bali + Nusa Islands itineraries | ExploreIndonesia.ai",
    metaDescription:
      "Pair Bali with Nusa Penida, Nusa Lembongan and Gili, itineraries designed for island-hopping with bookable ferries, stays, and snorkel tours.",
    intro:
      "Bali is best paired with the islands at its doorstep. These itineraries combine the mainland with Nusa Penida, Lembongan and the Gilis, with the ferries, transfers and dive spots already mapped out for you.",
    highlights: ["Nusa Penida", "Nusa Lembongan", "Gili Islands", "Manta dives"],
  },
  {
    slug: "java",
    value: "java",
    name: "Java",
    shortName: "Java",
    metaTitle: "Java itineraries, Yogyakarta, Bromo & Ijen | ExploreIndonesia.ai",
    metaDescription:
      "Java trip plans covering Yogyakarta, Borobudur, Prambanan, Mount Bromo and the Ijen blue flames. Bookable day-by-day routes.",
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
    metaTitle: "Komodo & Flores itineraries, boats, dragons, dives | ExploreIndonesia.ai",
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
    metaTitle: "Lombok & Gili Islands itineraries | ExploreIndonesia.ai",
    metaDescription:
      "Surf Lombok's south coast, climb Mount Rinjani, and unwind on the Gili Islands. Bookable, day-by-day Indonesia trip plans.",
    intro:
      "Lombok is Bali's quieter cousin, empty surf, the Rinjani volcano trek, and the three Gilis just offshore. These itineraries balance adventure days with reef time.",
    highlights: ["Mount Rinjani", "Kuta Lombok surf", "Gili Trawangan", "Gili Meno"],
  },
  {
    slug: "sumatra",
    value: "sumatra",
    name: "Sumatra",
    shortName: "Sumatra",
    metaTitle: "Sumatra itineraries, Orangutans, jungle, Lake Toba | ExploreIndonesia.ai",
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
    metaTitle: "Raja Ampat itineraries, diving & liveaboards | ExploreIndonesia.ai",
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
    metaTitle: "Off-the-beaten-path Indonesia itineraries | ExploreIndonesia.ai",
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
