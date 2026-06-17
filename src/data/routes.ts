// Transport route pages — one dedicated page per high-value "how to get from A to B"
// query (e.g. /transport/bali-to-gili-islands).
//
// WHY THIS EXISTS (read before editing): transport queries are a separate search
// intent from itineraries. Someone searching "Bali to Gili ferry" wants options +
// price + duration, NOT a 7-day plan. Burying that answer inside an itinerary
// article means we never rank for it. So each route is its own URL that captures
// the transport query and links back to the itineraries that use it (and vice
// versa) — that interlinking is the internal-linking authority lever.
//
// PATTERN: mirrors src/data/destinations.ts — a static, version-controlled data
// file (NOT a Sanity doc type). The route component renders this data and emits
// FAQPage + BreadcrumbList JSON-LD (transport pages do NOT reuse TouristTrip).
//
// DATA DISCIPLINE (same house rules as the itinerary generator): no invented exact
// numbers — use hedged ranges and "working estimate / confirm current"; no
// em-dashes (use commas); ranges written as "X to Y", not "X-Y". Prices/durations
// move, so they are text, not numbers. Figures are 2025-2026 estimates and must be
// re-checked over time. `status: "todo"` rows are backlog stubs (not rendered).

const TWELVEGO = "https://12go.asia/?z=16022946";

export type TransportModeKey =
  | "fast-boat"
  | "public-ferry"
  | "flight"
  | "private-car"
  | "shared-shuttle"
  | "train"
  | "speedboat-tour";

export type TransportMode = {
  mode: TransportModeKey;
  label: string; // "Fast boat", "Domestic flight"
  durationText: string; // "1.5 to 2.5 hours"
  priceUsdText: string; // "$35 to $55 one way (working estimate)"
  frequencyText: string; // "Several departures, roughly 8am to 4pm"
  bookingPartner: "12go" | "klook" | "viator" | null; // which affiliate sells it
  bookingUrl?: string; // the real affiliate URL (set for 12Go ground/sea segments)
  notes?: string; // honest caveats: rough seas, early start, fragile connection
};

export type RouteFaq = { question: string; answer: string };

export type TransportRoute = {
  slug: string; // "bali-to-gili-islands" -> /transport/bali-to-gili-islands
  fromName: string; // "Bali"
  toName: string; // "Gili Islands"
  fromDestinationSlug?: string; // links to /destinations/<slug> where one exists
  toDestinationSlug?: string;
  metaTitle: string; // <= 60 chars
  metaDescription: string; // <= 155 chars
  focusKeyword: string; // "bali to gili islands"
  summary: string; // 1-2 sentence answer-first POV (the AI-snippet / TL;DR)
  recommendation: string; // which option most travellers should pick, and why
  modes: TransportMode[]; // every realistic way to make the trip
  faqs: RouteFaq[]; // 4-6 real questions -> FAQPage schema
  relatedTripSlugs: string[]; // /trips/<slug> itineraries that use this route
  relatedGuideSlugs?: string[]; // /destinations/<dest>/<slug> supporting guides for endpoints
  priority: 1 | 2 | 3;
  status: "live" | "draft" | "todo";
};

export const TRANSPORT_ROUTES: TransportRoute[] = [
  // ----------------------------------------------------------------- P1
  {
    slug: "bali-to-gili-islands",
    fromName: "Bali",
    toName: "Gili Islands",
    fromDestinationSlug: "bali",
    toDestinationSlug: "lombok-gili",
    metaTitle: "Bali to Gili Islands: Fast Boat, Times & Prices",
    metaDescription:
      "How to get from Bali to the Gili Islands. Fast boat routes, journey times, working price estimates, and which departure point to choose.",
    focusKeyword: "bali to gili islands",
    summary:
      "Most travellers reach the Gilis by fast boat. The crossing takes roughly 1.5 to 2.5 hours depending on departure point and sea conditions, so build a buffer and avoid booking a same-day onward connection.",
    recommendation:
      "Take a fast boat. Departures from the east coast (Padangbai or Amed) are shorter than those from the south near Sanur or Serangan, but the south is closer to most Bali hotels, so weigh the transfer time on land against the time at sea. Book the morning crossing: afternoon seas are rougher and a cancelled boat can cost you a day.",
    modes: [
      {
        mode: "fast-boat",
        label: "Fast boat",
        durationText: "1.5 to 2.5 hours at sea, plus the road transfer to the port",
        priceUsdText: "Around $35 to $60 one way as a working estimate; confirm current fares",
        frequencyText: "Multiple daily departures, mostly morning to early afternoon",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
        notes:
          "Seas are calmer in the morning. Crossings can be cancelled in bad weather, especially in the windier months, so keep the day you land flexible.",
      },
      {
        mode: "private-car",
        label: "Private car to the port",
        durationText: "1 to 3 hours by road to the departure point, depending on your Bali base",
        priceUsdText: "Varies by distance; often bundled with the boat ticket",
        frequencyText: "On demand",
        bookingPartner: null,
        notes: "Factor the land transfer into your total door-to-door time, not just the boat.",
      },
    ],
    faqs: [
      {
        question: "How long does it take to get from Bali to the Gili Islands?",
        answer:
          "Roughly 1.5 to 2.5 hours on the fast boat, plus the road transfer to the departure port. Door to door it is often a half-day, so do not schedule anything fixed for arrival day.",
      },
      {
        question: "How much is the fast boat from Bali to the Gilis?",
        answer:
          "As a working estimate, around $35 to $60 one way. Prices move with season and operator, so confirm the current fare when you book.",
      },
      {
        question: "Which departure point is best?",
        answer:
          "East-coast ports like Padangbai and Amed mean less time at sea; southern departures near Sanur are closer to most hotels. Trade the land transfer against the sea time for your specific base.",
      },
      {
        question: "Is the crossing safe?",
        answer:
          "Reputable operators run it daily, but seas get rougher in the afternoon and in the windier months. Take a morning boat and keep arrival day flexible in case of weather cancellations.",
      },
    ],
    relatedTripSlugs: ["10-days-bali-gili-islands", "7-days-bali-first-timers"],
    relatedGuideSlugs: [
      "best-time-to-visit-bali",
      "gili-islands-comparison",
      "best-time-to-visit-lombok",
    ],
    priority: 1,
    status: "live",
  },
  {
    slug: "bali-to-nusa-penida",
    fromName: "Bali",
    toName: "Nusa Penida",
    fromDestinationSlug: "bali",
    toDestinationSlug: "bali-nearby-islands",
    metaTitle: "Bali to Nusa Penida: Fast Boat Times & Prices",
    metaDescription:
      "How to get from Bali to Nusa Penida. Fast boats from Sanur, journey times, working price estimates, and the jetty gotcha to know before you go.",
    focusKeyword: "bali to nusa penida",
    summary:
      "Fast boats from Sanur reach Nusa Penida in about 30 to 45 minutes. They are cheap and frequent, so this is one of the easier island hops in Bali.",
    recommendation:
      "Take any reputable Sanur fast boat. Book the morning sailing so a weather cancellation still leaves you same-day options, and pre-book a round-trip to lock your return seat, since afternoon boats fill up in high season.",
    modes: [
      {
        mode: "fast-boat",
        label: "Fast boat from Sanur",
        durationText: "25 to 45 minutes at sea",
        priceUsdText: "Around $10 to $20 one way (working estimate); round-trip often $20 to $35",
        frequencyText: "Roughly every 30 to 60 minutes, first sailing about 7:30am",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
        notes:
          "Most boats use a beach landing, not a jetty, so you wade to and from the boat. Pack light and expect wet feet.",
      },
      {
        mode: "private-car",
        label: "Hotel transfer to Sanur",
        durationText: "20 minutes to 1.5 hours by road, depending on your base",
        priceUsdText: "Around $15 to $30 for the land transfer (working estimate)",
        frequencyText: "On demand",
        bookingPartner: "klook",
      },
    ],
    faqs: [
      {
        question: "How long is the boat from Bali to Nusa Penida?",
        answer:
          "About 25 to 45 minutes from Sanur, with the typical fast boats around half an hour. Add your road transfer to Sanur on top.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $10 to $20 each way, or roughly $20 to $35 round-trip. Confirm current fares when you book.",
      },
      {
        question: "Is it reliable?",
        answer:
          "Yes in the dry season, with very frequent departures. Crossings get choppy and are occasionally cancelled in the wet season, so take a morning boat.",
      },
      {
        question: "Is there a proper jetty?",
        answer:
          "Often not. Many boats use a beach landing where you step into shallow water, so wear sandals and keep your bag dry.",
      },
    ],
    relatedTripSlugs: ["10-days-bali-gili-islands", "7-days-bali-first-timers"],
    relatedGuideSlugs: [
      "things-to-do-in-nusa-penida",
      "nusa-penida-vs-nusa-lembongan",
      "best-time-to-visit-bali",
    ],
    priority: 1,
    status: "live",
  },
  {
    slug: "bali-to-lombok",
    fromName: "Bali",
    toName: "Lombok",
    fromDestinationSlug: "bali",
    toDestinationSlug: "lombok-gili",
    metaTitle: "Bali to Lombok: Fast Boat or Flight?",
    metaDescription:
      "How to get from Bali to Lombok. Compare the domestic flight, fast boat and slow ferry by time and price, and which to pick for your destination.",
    focusKeyword: "bali to lombok",
    summary:
      "You can fly in about 45 minutes or take a fast boat in 2 to 3.5 hours. The right choice depends on where in Lombok you are heading.",
    recommendation:
      "Fly if your destination is south or central Lombok, since the airport is there and flying is weather-proof. Take a fast boat only if you are heading to the Gili Islands or the northwest coast, because boats land near Bangsal and save a long land transfer. Open-water crossings get rough from November to March.",
    modes: [
      {
        mode: "flight",
        label: "Domestic flight (DPS to LOP)",
        durationText: "About 30 to 45 minutes in the air, near 2 hours door to door",
        priceUsdText: "Around $60 to $90 one way (working estimate)",
        frequencyText: "Multiple daily",
        bookingPartner: null,
      },
      {
        mode: "fast-boat",
        label: "Fast boat",
        durationText: "2 to 3.5 hours including land transfers",
        priceUsdText: "Around $20 to $40 one way (working estimate)",
        frequencyText: "Several daily, mostly morning",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
        notes: "Best if you are heading to the Gilis or northwest Lombok, not the south.",
      },
      {
        mode: "public-ferry",
        label: "Slow car ferry (Padangbai to Lembar)",
        durationText: "4 to 5 hours crossing, plus transfers",
        priceUsdText: "Around $5 to $10 as a foot passenger (working estimate)",
        frequencyText: "Roughly hourly",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
      },
    ],
    faqs: [
      {
        question: "What is the fastest way from Bali to Lombok?",
        answer:
          "The flight, at about 45 minutes in the air versus 2 to 3 hours by boat. Door to door the gap narrows once you add airport time.",
      },
      {
        question: "What is the cheapest way?",
        answer:
          "The slow car ferry or a fast boat, roughly $5 to $40 one way depending on the option, versus around $60 to $90 to fly.",
      },
      {
        question: "Is the boat safe?",
        answer:
          "Generally yes, but the open-water crossing gets rough and is occasionally cancelled in the wet season. Check the operator's safety record.",
      },
      {
        question: "Should I fly or take the boat?",
        answer:
          "Fly for south or central Lombok. Take the boat if you want the Gili Islands or the northwest coast, since boats land closer to them than the airport does.",
      },
    ],
    relatedTripSlugs: ["7-days-lombok-gili-islands", "10-days-bali-lombok-gili-islands"],
    relatedGuideSlugs: ["best-time-to-visit-lombok", "where-to-stay-in-kuta-lombok"],
    priority: 1,
    status: "live",
  },
  {
    slug: "bali-to-labuan-bajo",
    fromName: "Bali",
    toName: "Labuan Bajo (Komodo)",
    fromDestinationSlug: "bali",
    toDestinationSlug: "komodo-flores",
    metaTitle: "Bali to Labuan Bajo (Komodo): Flights & Times",
    metaDescription:
      "How to get from Bali to Labuan Bajo, the gateway to Komodo. Flight times, working price estimates, and why to book the morning departure.",
    focusKeyword: "bali to labuan bajo",
    summary:
      "Flying is the only sensible option. The direct flight from Bali to Labuan Bajo takes about 1 hour 15 minutes.",
    recommendation:
      "Just fly. The sea alternative is a multi-day liveaboard, not a transfer. Book early, since limited daily capacity pushes fares up in June to September and December. Take a morning flight: afternoon delays are common at this small airport.",
    modes: [
      {
        mode: "flight",
        label: "Domestic flight (DPS to LBJ)",
        durationText: "About 1 hour 15 minutes",
        priceUsdText: "Around $60 to $120 one way (working estimate), higher in peak months",
        frequencyText: "Several daily on the main carriers",
        bookingPartner: null,
        notes:
          "Do not book a same-day Komodo tour connection too tight, since flights can be delayed.",
      },
    ],
    faqs: [
      {
        question: "How long is the flight from Bali to Labuan Bajo?",
        answer: "About 1 hour 15 minutes direct.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $60 to $120 one way, depending on season and how far ahead you book.",
      },
      {
        question: "Is there a way to get there by boat?",
        answer:
          "Only as a multi-day liveaboard across the islands, which is an experience in itself rather than a transfer. For a straightforward trip, fly.",
      },
      {
        question: "Anything to watch out for?",
        answer:
          "Labuan Bajo airport is small, afternoon weather can delay flights, and seats sell out in peak months, so book ahead and favour a morning departure.",
      },
    ],
    relatedTripSlugs: ["5-days-labuan-bajo-komodo", "10-days-komodo-flores"],
    relatedGuideSlugs: [
      "best-time-to-visit-komodo",
      "where-to-stay-in-labuan-bajo",
      "liveaboard-vs-day-trip-labuan-bajo",
    ],
    priority: 1,
    status: "live",
  },
  {
    slug: "lombok-to-gili-islands",
    fromName: "Lombok",
    toName: "Gili Islands",
    fromDestinationSlug: "lombok-gili",
    toDestinationSlug: "lombok-gili",
    metaTitle: "Lombok to the Gili Islands: Boats & Prices",
    metaDescription:
      "How to get from Lombok to the Gili Islands. Cheap public boats from Bangsal, journey times, and how to avoid the charter touts.",
    focusKeyword: "lombok to gili islands",
    summary:
      "The public boat from Bangsal harbour reaches the Gilis in 15 to 30 minutes for just a few dollars. It is the cheapest, simplest hop in the area.",
    recommendation:
      "Use the public boat from Bangsal. Buy your ticket only at the official Karya Bahari counter to avoid touts. The slow boats leave when they fill, so allow a buffer, and note that the last departures are mid-afternoon.",
    modes: [
      {
        mode: "public-ferry",
        label: "Public boat from Bangsal",
        durationText: "15 to 30 minutes",
        priceUsdText: "Around $2 to $4 (working estimate)",
        frequencyText: "Leaves when roughly 20 passengers fill the boat",
        bookingPartner: null,
        notes: "Buy at the official Karya Bahari counter, not from touts on the approach.",
      },
      {
        mode: "fast-boat",
        label: "Private speedboat charter",
        durationText: "10 to 15 minutes",
        priceUsdText: "From around $35 per boat (working estimate)",
        frequencyText: "On demand",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
      },
    ],
    faqs: [
      {
        question: "How long is the boat from Lombok to the Gilis?",
        answer:
          "About 15 to 30 minutes on the public boat from Bangsal, and a little less by private speedboat.",
      },
      {
        question: "How much does it cost?",
        answer:
          "Around $2 to $4 on the public boat, or from about $35 for a private charter that you do not share.",
      },
      {
        question: "Is it reliable?",
        answer: "Very, in daylight. Service thins out after about 4pm, so do not arrive late.",
      },
      {
        question: "Anything to watch out for?",
        answer:
          "Public boats leave only when full, so there is no fixed timetable. Ignore touts pushing inflated private charters and buy at the official counter.",
      },
    ],
    relatedTripSlugs: ["7-days-lombok-gili-islands", "10-days-bali-lombok-gili-islands"],
    relatedGuideSlugs: ["gili-islands-comparison", "best-time-to-visit-lombok"],
    priority: 1,
    status: "live",
  },
  {
    slug: "jakarta-to-yogyakarta",
    fromName: "Jakarta",
    toName: "Yogyakarta",
    toDestinationSlug: "java",
    metaTitle: "Jakarta to Yogyakarta: Train vs Flight",
    metaDescription:
      "How to get from Jakarta to Yogyakarta. Compare the executive train and the flight by time and price, and why the train often wins door to door.",
    focusKeyword: "jakarta to yogyakarta",
    summary:
      "The executive train runs city centre to city centre in about 6 to 7.5 hours. A flight is faster in the air but loses much of that edge once you add airport transfers.",
    recommendation:
      "Take an executive train such as the Taksaka or Argo services. It is scenic, comfortable and barely pricier than a budget flight once airport transfers are counted. Fly only if you are genuinely time-pressed. Note that the YIA airport is about an hour from central Yogyakarta.",
    modes: [
      {
        mode: "train",
        label: "Executive train (Gambir to Yogyakarta)",
        durationText: "About 6 to 7.5 hours",
        priceUsdText: "Around $22 to $35 (working estimate), premium services higher",
        frequencyText: "Many daily, around 19 trains",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
        notes: "Book executive seats ahead in peak and holiday periods.",
      },
      {
        mode: "flight",
        label: "Domestic flight (CGK to YIA/JOG)",
        durationText: "About 1 hour 10 minutes in the air",
        priceUsdText: "Around $45 to $80 one way (working estimate)",
        frequencyText: "Many daily",
        bookingPartner: null,
        notes:
          "YIA airport is about an hour from central Yogyakarta, which erodes the time saving.",
      },
    ],
    faqs: [
      {
        question: "Is the train or the flight faster?",
        answer:
          "The flight is faster in the air, but the train often wins door to door once you add the trip to and from airports.",
      },
      {
        question: "How much does it cost?",
        answer:
          "An executive train is around $22 to $35 as a working estimate, while flights run about $45 to $80 one way.",
      },
      {
        question: "Is the train reliable?",
        answer:
          "Yes. Indonesian intercity trains are punctual and frequent on this route, with around 19 departures a day.",
      },
      {
        question: "Anything to watch out for?",
        answer:
          "Book executive seats ahead in busy periods, and remember the new YIA airport sits well outside town, which narrows the flight's advantage.",
      },
    ],
    relatedTripSlugs: ["7-days-yogyakarta-east-java", "15-days-java-bali"],
    relatedGuideSlugs: ["things-to-do-in-yogyakarta", "borobudur-vs-prambanan"],
    priority: 1,
    status: "live",
  },
  // ----------------------------------------------------------------- P2
  {
    slug: "bali-to-yogyakarta",
    fromName: "Bali",
    toName: "Yogyakarta",
    fromDestinationSlug: "bali",
    toDestinationSlug: "java",
    metaTitle: "Bali to Yogyakarta: Flights, Time & Price",
    metaDescription:
      "How to get from Bali to Yogyakarta. Flight time, working price estimates, and the airport detail to know before you book.",
    focusKeyword: "bali to yogyakarta",
    summary: "Flying is the practical choice. The direct flight takes about 1 hour 25 minutes.",
    recommendation:
      "Fly direct. There is no sensible overland route across Bali and Java for most travellers. Budget carriers carry the cheapest fares, so book midweek and a few weeks out. Confirm whether you land at the larger YIA airport, which is about an hour from town, or the older JOG.",
    modes: [
      {
        mode: "flight",
        label: "Domestic flight (DPS to YIA/JOG)",
        durationText: "About 1 hour 25 minutes",
        priceUsdText: "Around $55 to $100 one way (working estimate)",
        frequencyText: "Several daily across multiple carriers",
        bookingPartner: null,
        notes: "Most flights use YIA, which is around 40 to 60 minutes from central Yogyakarta.",
      },
    ],
    faqs: [
      {
        question: "How long is the flight from Bali to Yogyakarta?",
        answer: "About 1 hour 25 minutes direct.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $55 to $100 one way, cheaper midweek and booked ahead.",
      },
      {
        question: "Is there an overland option?",
        answer:
          "Not a practical one for most travellers. The flight is the standard way to connect Bali and Yogyakarta.",
      },
      {
        question: "Which airport will I use?",
        answer:
          "Most flights land at YIA in Kulon Progo, about an hour from central Yogyakarta, so budget transfer time and cost.",
      },
    ],
    relatedTripSlugs: ["7-days-yogyakarta-east-java", "15-days-java-bali"],
    relatedGuideSlugs: ["things-to-do-in-yogyakarta", "borobudur-vs-prambanan"],
    priority: 2,
    status: "live",
  },
  {
    slug: "yogyakarta-to-mount-bromo",
    fromName: "Yogyakarta",
    toName: "Mount Bromo",
    toDestinationSlug: "java",
    metaTitle: "Yogyakarta to Mount Bromo: How to Get There",
    metaDescription:
      "How to get from Yogyakarta to Mount Bromo. Why most travellers book a 2-day tour rather than the long same-day drive, with time and price estimates.",
    focusKeyword: "yogyakarta to mount bromo",
    summary:
      "It is a long drive, about 8 to 10 hours each way, so almost everyone does it as a 2-day tour rather than a same-day round trip.",
    recommendation:
      "Book a 2-day, 1-night package rather than attempting a brutal same-day return. The drive is roughly 8 to 10 hours each way and the Bromo sunrise jeep leaves around 3am. Go in the dry season, April to October, for clear skies. Private tours are priced per car, not per person, so the per-person cost drops sharply with a group; solo travellers are better off on a shared join-in tour.",
    modes: [
      {
        mode: "private-car",
        label: "Private car or 2-day tour",
        durationText: "About 8 to 10 hours of driving each way, usually split over 2 days",
        priceUsdText:
          "Around $215 to $290 per car (up to 4 people), so roughly $55 to $150 per person by group size (working estimate)",
        frequencyText: "On demand",
        bookingPartner: "klook",
        notes:
          "The sunrise jeep starts around 3am, so an overnight near Bromo is far easier than a day trip.",
      },
      {
        mode: "private-car",
        label: "Multi-day Bromo and Ijen package",
        durationText: "2 to 3 days",
        priceUsdText: "Around $200 to $500 per person (working estimate)",
        frequencyText: "On request",
        bookingPartner: "viator",
      },
    ],
    faqs: [
      {
        question: "How long does it take to get from Yogyakarta to Bromo?",
        answer:
          "About 8 to 10 hours of driving one way, which is why it is usually done as a 2-day trip rather than a single day.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, a private 2-day tour is around $215 to $290 per car for up to four people, which works out to roughly $55 to $150 per person depending on group size. Solo travellers do better on a shared tour.",
      },
      {
        question: "Is it reliable?",
        answer:
          "Yes overland, though it is a long drive. Fog and landslides are possible in the wet season.",
      },
      {
        question: "Should I do it in one day?",
        answer:
          "Better not to. The 3am sunrise start plus around 16 hours of round-trip driving is exhausting, so overnight near Bromo.",
      },
    ],
    relatedTripSlugs: ["7-days-yogyakarta-east-java"],
    relatedGuideSlugs: ["best-time-to-visit-mount-bromo"],
    priority: 2,
    status: "live",
  },
  {
    slug: "gili-islands-to-nusa-penida",
    fromName: "Gili Islands",
    toName: "Nusa Penida",
    fromDestinationSlug: "lombok-gili",
    toDestinationSlug: "bali-nearby-islands",
    metaTitle: "Gili Islands to Nusa Penida: Boats & Routes",
    metaDescription:
      "How to get from the Gili Islands to Nusa Penida. Direct boats versus connecting through Bali, with times, price estimates and the connection risk.",
    focusKeyword: "gili islands to nusa penida",
    summary:
      "Operators sell a through-ticket in about 2 to 4 hours, but there is no genuine non-stop sailing: boats from the Gilis must clear port at Bangsal or route via a Bali hub, so it is really a timed connection. This is the most fragile route in the region.",
    recommendation:
      "Book a through-ticketed operator that connects the Gilis to Nusa Penida in one booking, so a single company owns the connection. Do not expect an uninterrupted direct boat: port rules force a clearance or transfer stop on the way. Build in a buffer, since the open-water leg is the rough part and a delay can break the onward Nusa Penida boat. Many travellers simply route through a Bali port instead.",
    modes: [
      {
        mode: "fast-boat",
        label: "Through-ticket (with a clearance or transfer stop)",
        durationText: "About 2 to 4 hours, including the mandatory port stop",
        priceUsdText: "Around $35 to $60 (working estimate)",
        frequencyText: "Limited daily, seasonal and weather dependent",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
        notes:
          "Sold as direct, but it always involves a port-clearance or transfer stop. Services are thin and seasonal, so verify the day's schedule.",
      },
      {
        mode: "fast-boat",
        label: "Two legs via Bali",
        durationText: "Half a day to a full day",
        priceUsdText: "Around $50 to $90 combined (working estimate)",
        frequencyText: "Daily but connection dependent",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
      },
    ],
    faqs: [
      {
        question: "How long does it take?",
        answer:
          "About 2.5 to 4 hours on a direct boat, or up to a full day if you connect through Bali.",
      },
      {
        question: "How much does it cost?",
        answer:
          "Around $35 to $60 direct as a working estimate, or roughly $50 to $90 if you connect.",
      },
      {
        question: "Is it reliable?",
        answer:
          "This is the weakest-link route in the area, with fragile connections and rough open water. Plan loosely.",
      },
      {
        question: "Direct boat or via Bali?",
        answer:
          "Few true direct sailings exist, so most travellers route through Bali. Book both legs with one operator to reduce the risk of a missed connection.",
      },
    ],
    relatedTripSlugs: ["10-days-bali-gili-islands"],
    relatedGuideSlugs: ["gili-islands-comparison", "things-to-do-in-nusa-penida"],
    priority: 2,
    status: "live",
  },
  {
    slug: "labuan-bajo-to-komodo-island",
    fromName: "Labuan Bajo",
    toName: "Komodo Island",
    fromDestinationSlug: "komodo-flores",
    toDestinationSlug: "komodo-flores",
    metaTitle: "Labuan Bajo to Komodo Island: Tours & Boats",
    metaDescription:
      "How to get from Labuan Bajo to Komodo Island. Day boat tours versus liveaboards, with times, price estimates and the park fee to budget for.",
    focusKeyword: "labuan bajo to komodo island",
    summary:
      "You reach Komodo on a boat tour from Labuan Bajo, either a shared day trip or a multi-day liveaboard. There is no scheduled ferry to the island itself.",
    recommendation:
      "For most travellers a shared one-day speedboat tour covering Padar, the dragons at Komodo or Rinca, Pink Beach and Manta Point is the best value. Choose a liveaboard only if you are diving or want remote sites. Budget the Komodo National Park entry fee on top, since it is usually charged separately.",
    modes: [
      {
        mode: "speedboat-tour",
        label: "Shared day boat tour",
        durationText: "A full day, about 10 to 12 hours",
        priceUsdText: "Around $50 to $120 per person (working estimate)",
        frequencyText: "Daily",
        bookingPartner: "viator",
        notes: "National park entry, around IDR 250k per day, is usually extra.",
      },
      {
        mode: "speedboat-tour",
        label: "Liveaboard (2 to 3 days)",
        durationText: "2 nights, 3 days typical",
        priceUsdText: "Around $300 to $660 per person (working estimate), dive boats higher",
        frequencyText: "Regular departures",
        bookingPartner: "klook",
      },
    ],
    faqs: [
      {
        question: "How do you get to Komodo Island?",
        answer:
          "By boat tour from Labuan Bajo, either a shared day trip of about 10 to 12 hours or a 2 to 3 day liveaboard. There is no scheduled passenger ferry to the island.",
      },
      {
        question: "How much does it cost?",
        answer:
          "Around $50 to $120 per person for a day tour, or roughly $300 to $660 per person for a liveaboard, as working estimates.",
      },
      {
        question: "Is it safe?",
        answer: "Yes, but boat quality varies a lot, so pick a well-reviewed operator.",
      },
      {
        question: "Are park fees included?",
        answer:
          "Often not. Komodo National Park entry, around IDR 250k per day, is frequently charged on top of the tour price, so confirm before booking.",
      },
    ],
    relatedTripSlugs: ["5-days-labuan-bajo-komodo", "10-days-komodo-flores"],
    relatedGuideSlugs: ["diving-in-komodo", "liveaboard-vs-day-trip-labuan-bajo"],
    priority: 2,
    status: "live",
  },
  {
    slug: "bali-to-raja-ampat",
    fromName: "Bali",
    toName: "Raja Ampat",
    fromDestinationSlug: "bali",
    toDestinationSlug: "raja-ampat",
    metaTitle: "Bali to Raja Ampat: Flights, Ferry & Route",
    metaDescription:
      "How to get from Bali to Raja Ampat. The flight to Sorong, the ferry to Waisai, the permit you need, and why not to rush the connection.",
    focusKeyword: "bali to raja ampat",
    summary:
      "It is a half to full travel day: fly from Bali to Sorong, usually with one connection, then take the express ferry to Waisai in about 2 hours.",
    recommendation:
      "Fly Bali to Sorong, overnight in Sorong if your flight lands late, then catch the morning express ferry to Waisai. Do not try a same-day late-flight to ferry connection, because if you miss the last boat around 2pm you are stuck. The ferry is cash at the counter only, and a separate Raja Ampat marine park permit is required.",
    modes: [
      {
        mode: "flight",
        label: "Flight (DPS to Sorong, often via a hub)",
        durationText: "About 3 to 6 hours including a layover",
        priceUsdText: "Around $120 to $250 and up (working estimate)",
        frequencyText: "Daily across several carriers",
        bookingPartner: null,
        notes: "Routings often connect through Makassar or Manado, so total time varies.",
      },
      {
        mode: "public-ferry",
        label: "Express ferry (Sorong to Waisai)",
        durationText: "About 2 hours",
        priceUsdText: "Around $6 to $10 (economy to VIP, working estimate)",
        frequencyText: "Roughly 2 daily; times shift periodically, so confirm locally",
        bookingPartner: null,
        notes: "Tickets are cash at the port counter, with no online booking.",
      },
    ],
    faqs: [
      {
        question: "How do you get from Bali to Raja Ampat?",
        answer:
          "Fly from Bali to Sorong, usually with one connection, then take the express ferry from Sorong to Waisai, which takes about 2 hours.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $120 to $250 and up for the flight, plus about $6 to $10 for the ferry (economy to VIP).",
      },
      {
        question: "Is the ferry reliable?",
        answer:
          "Yes, it runs roughly twice a day, but tickets are cash at the counter only and the last boat is in the early afternoon. Departure times shift periodically, so confirm locally and take an early Bali flight to make the connection.",
      },
      {
        question: "Anything else to plan for?",
        answer:
          "A delayed flight can mean an unplanned night in Sorong, and a separate Raja Ampat marine park permit, around IDR 1 million, is required.",
      },
    ],
    relatedTripSlugs: ["14-days-raja-ampat-divers", "7-days-raja-ampat-snorkeling-islands"],
    relatedGuideSlugs: ["how-to-get-to-raja-ampat", "best-time-to-visit-raja-ampat"],
    priority: 2,
    status: "live",
  },
  {
    slug: "jakarta-to-bali",
    fromName: "Jakarta",
    toName: "Bali",
    toDestinationSlug: "bali",
    metaTitle: "Jakarta to Bali: Flight Time & Prices",
    metaDescription:
      "How to get from Jakarta to Bali. Flight time, working price estimates, and why flying is the only practical option.",
    focusKeyword: "jakarta to bali",
    summary:
      "Fly. The flight from Jakarta to Bali takes about 1 hour 45 minutes to 2 hours and runs very frequently.",
    recommendation:
      "Fly, since it is frequent, cheap and the only practical option. The overland route is a 24-hour-plus slog with multiple ferries. Budget carriers have the lowest fares, so book around six weeks out and fly midweek for the best price.",
    modes: [
      {
        mode: "flight",
        label: "Domestic flight (CGK to DPS)",
        durationText: "About 1 hour 45 minutes to 2 hours",
        priceUsdText: "Around $45 to $90 one way (working estimate)",
        frequencyText: "Very frequent across many carriers",
        bookingPartner: null,
        notes: "Jakarta's CGK airport is large and far from the city, so allow a generous buffer.",
      },
    ],
    faqs: [
      {
        question: "How long is the flight from Jakarta to Bali?",
        answer: "About 1 hour 45 minutes to 2 hours.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $45 to $90 one way, cheaper midweek and booked ahead.",
      },
      {
        question: "Is it reliable?",
        answer: "Very. This is one of Indonesia's busiest air routes, with frequent daily flights.",
      },
      {
        question: "Anything to watch out for?",
        answer:
          "Jakarta's CGK airport is large and well outside the city, so allow generous time to reach it.",
      },
    ],
    relatedTripSlugs: ["7-days-bali-first-timers", "15-days-java-bali"],
    priority: 2,
    status: "live",
  },
  {
    slug: "surabaya-to-mount-bromo",
    fromName: "Surabaya",
    toName: "Mount Bromo",
    toDestinationSlug: "java",
    metaTitle: "Surabaya to Mount Bromo: How to Get There",
    metaDescription:
      "How to get from Surabaya to Mount Bromo. The closest gateway to Bromo, with transfer and tour options, times and price estimates.",
    focusKeyword: "surabaya to mount bromo",
    summary:
      "Surabaya is the closest major gateway to Bromo, about 3 to 4 hours by road, so a one-day tour is feasible from here.",
    recommendation:
      "Because Surabaya is close, a one-day tour works here in a way it does not from Yogyakarta. Door-to-door shuttles via Cemoro Lawang are easiest. Go in the dry season, April to October, for clear sunrise views. Even from Surabaya, an overnight near the crater is more comfortable than the very early start a day trip demands.",
    modes: [
      {
        mode: "private-car",
        label: "Private shuttle or car transfer",
        durationText: "About 3 to 4 hours",
        priceUsdText:
          "Around $40 to $90 per car, or about $80 to $200 per person for a 2-day package (working estimate)",
        frequencyText: "On demand",
        bookingPartner: "klook",
      },
      {
        mode: "private-car",
        label: "One-day Bromo tour (round trip)",
        durationText: "About 12 hours",
        priceUsdText: "Around $60 to $130 per person, jeep and entry included (working estimate)",
        frequencyText: "Daily",
        bookingPartner: "viator",
        notes: "The sunrise jeep leaves around 3am, so even a day trip means a very early start.",
      },
    ],
    faqs: [
      {
        question: "How long from Surabaya to Bromo?",
        answer: "About 3 to 4 hours each way, which is why a day trip is realistic from here.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $40 to $90 for a transfer, or roughly $60 to $130 per person for a day tour with a jeep.",
      },
      {
        question: "Is it reliable?",
        answer: "Yes, it is a short, well-served route to the most popular Bromo gateway.",
      },
      {
        question: "Should I overnight?",
        answer:
          "It helps. The sunrise jeep leaves around 3am, so an overnight at Cemoro Lawang is more comfortable than a single long day.",
      },
    ],
    relatedTripSlugs: ["7-days-yogyakarta-east-java"],
    relatedGuideSlugs: ["best-time-to-visit-mount-bromo"],
    priority: 2,
    status: "live",
  },
  // ----------------------------------------------------------------- P3
  {
    slug: "medan-to-bukit-lawang",
    fromName: "Medan",
    toName: "Bukit Lawang",
    toDestinationSlug: "sumatra",
    metaTitle: "Medan to Bukit Lawang: Transfers & Times",
    metaDescription:
      "How to get from Medan to Bukit Lawang for orangutan trekking. Private car versus shuttle, journey times and working price estimates.",
    focusKeyword: "medan to bukit lawang",
    summary:
      "Bukit Lawang, the base for orangutan trekking, is about 3 to 5 hours from Medan by road. A private car is the comfortable standard.",
    recommendation:
      "Book a private car or door-to-door shuttle. At around $40 to $55 split between up to four people it is far comfier than the slow local bus, and trekking lodges arrange it readily. Roads are winding, so allow up to 5 hours with traffic, and note that wet-season landslides can lengthen the drive.",
    modes: [
      {
        mode: "private-car",
        label: "Private car (up to 4 passengers)",
        durationText: "About 3 to 5 hours",
        priceUsdText: "Around $40 to $55 per car (working estimate)",
        frequencyText: "On demand",
        bookingPartner: "klook",
      },
      {
        mode: "shared-shuttle",
        label: "Shared shuttle or public bus",
        durationText: "About 4 to 6 hours",
        priceUsdText: "Around $5 to $15 per person (working estimate)",
        frequencyText: "Limited daily",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
      },
    ],
    faqs: [
      {
        question: "How long from Medan to Bukit Lawang?",
        answer: "About 3 to 5 hours depending on traffic and road conditions.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $40 to $55 for a private car, or roughly $5 to $15 per person on a shared service.",
      },
      {
        question: "Is it reliable?",
        answer: "Yes. It is the standard tourist transfer to the orangutan trekking base.",
      },
      {
        question: "Is the private car good value?",
        answer:
          "Quotes are usually per car for up to four people, so it is excellent value for groups and a little pricier solo.",
      },
    ],
    relatedTripSlugs: ["15-days-sumatra"],
    priority: 3,
    status: "live",
  },
  {
    slug: "medan-to-lake-toba",
    fromName: "Medan",
    toName: "Lake Toba",
    toDestinationSlug: "sumatra",
    metaTitle: "Medan to Lake Toba: Car, Bus & Ferry",
    metaDescription:
      "How to get from Medan to Lake Toba and Samosir Island. Private car versus bus to Parapat, plus the onward ferry, with times and prices.",
    focusKeyword: "medan to lake toba",
    summary:
      "It is about 3.5 to 4.5 hours by road from Medan to Parapat on Lake Toba, then a short ferry to Samosir Island.",
    recommendation:
      "A private car is the sweet spot: around $45 to $55 per vehicle gets you door to door in about 4 hours, versus a slower bus from Amplas terminal. From Parapat, take the 30 to 45 minute public ferry to Samosir Island, so build in that onward leg.",
    modes: [
      {
        mode: "private-car",
        label: "Private car or taxi (Medan to Parapat)",
        durationText: "About 3.5 to 4.5 hours",
        priceUsdText: "Around $45 to $55 per car (working estimate)",
        frequencyText: "On demand",
        bookingPartner: "klook",
      },
      {
        mode: "shared-shuttle",
        label: "Public bus or shared minivan",
        durationText: "About 4.5 to 7 hours",
        priceUsdText: "Around $3 to $20 per person (working estimate)",
        frequencyText: "Roughly hourly during the day",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
      },
    ],
    faqs: [
      {
        question: "How long from Medan to Lake Toba?",
        answer: "About 3.5 to 4.5 hours to Parapat by private car, and up to 7 hours by bus.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $45 to $55 per car, or roughly $3 to $20 per person by bus.",
      },
      {
        question: "Is it reliable?",
        answer: "Yes. It is a well-trodden route with hourly buses through the day.",
      },
      {
        question: "How do I reach Samosir Island?",
        answer:
          "Parapat is not the final stop if you want Samosir. Add the 30 to 45 minute public ferry across to Tomok or Tuktuk.",
      },
    ],
    relatedTripSlugs: ["15-days-sumatra"],
    priority: 3,
    status: "live",
  },
  {
    slug: "labuan-bajo-to-kelimutu",
    fromName: "Labuan Bajo",
    toName: "Kelimutu (Ende)",
    fromDestinationSlug: "komodo-flores",
    toDestinationSlug: "komodo-flores",
    metaTitle: "Labuan Bajo to Kelimutu: Crossing Flores",
    metaDescription:
      "How to get from Labuan Bajo to Kelimutu across Flores. Why it is a multi-day overland journey, not a transfer, with realistic time and cost.",
    focusKeyword: "labuan bajo to kelimutu",
    summary:
      "This is a journey, not a transfer. It is about 545km broken into daily 3 to 6 hour driving legs, so realistically a 5 to 7 day overland trip across Flores, not one long drive.",
    recommendation:
      "Do not treat this as a quick hop. Book a 5 to 7 day private overland tour that breaks the journey at Ruteng, Bajawa and Riung and times Kelimutu's coloured lakes for sunrise. Private cars are priced per day, not per person, so the cost drops sharply with a group. Pricing is usually quoted on request. Many travellers fly one leg between Ende and Labuan Bajo to skip the return drive.",
    modes: [
      {
        mode: "private-car",
        label: "Private car and driver, multi-day overland",
        durationText: "Daily 3 to 6 hour legs over 5 to 7 days (about 545km total)",
        priceUsdText:
          "Around $30 to $65 per day for the car; a 6 to 7 day trip totals roughly $300 to $550 and up per person, less with a group (working estimate)",
        frequencyText: "On request",
        bookingPartner: "viator",
        notes:
          "Roads are paved but slow and winding, with landslide risk in the wet season. Hotels and meals are often extra on driver-only deals.",
      },
      {
        mode: "shared-shuttle",
        label: "Local buses, segment by segment",
        durationText: "Several days",
        priceUsdText: "Cheap, around $15 to $30 total (working estimate), but slow and basic",
        frequencyText: "Varies by segment",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
      },
    ],
    faqs: [
      {
        question: "How long does it take?",
        answer:
          "There is no single long leg: it is about 545km split into daily 3 to 6 hour drives, so realistically a 5 to 7 day trip with stops, not a single travel day.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, the private car runs about $30 to $65 per day, so a 6 to 7 day overland trip totals roughly $300 to $550 and up per person, dropping with a larger group. Most operators quote on request.",
      },
      {
        question: "Is it reliable?",
        answer:
          "The roads are paved but slow and winding, and the wet season brings landslide risk.",
      },
      {
        question: "Can I avoid the long drive back?",
        answer:
          "Yes. Many travellers fly between Ende and Labuan Bajo for one direction to skip the return overland journey.",
      },
    ],
    relatedTripSlugs: ["10-days-komodo-flores"],
    relatedGuideSlugs: ["kelimutu-guide"],
    priority: 3,
    status: "live",
  },
  {
    slug: "bali-to-sumbawa",
    fromName: "Bali",
    toName: "Sumbawa",
    fromDestinationSlug: "bali",
    metaTitle: "Bali to Sumbawa: Ferry or Flight?",
    metaDescription:
      "How to get from Bali to Sumbawa. Compare the multi-leg ferry route and the direct flight to Bima by time and price.",
    focusKeyword: "bali to sumbawa",
    summary:
      "You can fly to Bima in about 1 hour 15 minutes, or take a chain of ferries and a bus over a full day or more. The flight is far faster.",
    recommendation:
      "Fly to Bima if you are going deep into eastern Sumbawa, since the overland route is three separate legs over a full day. For western Sumbawa, flying to Sumbawa Besar is an option. Take the ferry chain only if you are island-hopping slowly. Use the standard slow public ferries, not the pricier fast boats, to keep it cheap.",
    modes: [
      {
        mode: "flight",
        label: "Domestic flight (DPS to Bima)",
        durationText: "About 1 hour 15 minutes",
        priceUsdText: "Around $60 to $110 one way (working estimate)",
        frequencyText: "Roughly daily",
        bookingPartner: null,
        notes: "Bima serves eastern Sumbawa; for the west, Sumbawa Besar is the closer airport.",
      },
      {
        mode: "public-ferry",
        label: "Slow public ferries and bus via Lombok",
        durationText: "The better part of a day or more",
        priceUsdText:
          "Around $15 to $35 total: about $3 to $5 Padangbai to Lembar, road across Lombok, then $4 to $7 Kayangan to Poto Tano (working estimate)",
        frequencyText: "Frequent crossings on both ferry legs",
        bookingPartner: "12go",
        bookingUrl: TWELVEGO,
        notes:
          "Use the standard slow public ferries, not the marketed fast boats, which are a pricier product.",
      },
    ],
    faqs: [
      {
        question: "What is the fastest way to Sumbawa?",
        answer:
          "The flight to Bima, at about 75 minutes, versus a full overland day by ferry and bus.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $60 to $110 to fly, or roughly $15 to $35 total via the slow public ferries and a bus. The cheap figure is the public ferry, not the marketed fast boat.",
      },
      {
        question: "Is the ferry route reliable?",
        answer:
          "The crossings are reliable but slow, and the flight schedule is thin, so book the flight ahead.",
      },
      {
        question: "Which should I choose?",
        answer:
          "Fly if you are heading deep into Sumbawa. The overland chain of two ferries and a bus is really only worth it for budget or slow travellers.",
      },
    ],
    relatedTripSlugs: ["14-days-bali-komodo-sumba"],
    priority: 3,
    status: "live",
  },
  {
    slug: "denpasar-airport-to-ubud",
    fromName: "Denpasar Airport",
    toName: "Ubud",
    toDestinationSlug: "bali",
    metaTitle: "Denpasar Airport to Ubud: Transfers & Time",
    metaDescription:
      "How to get from Denpasar Airport (DPS) to Ubud. Private transfer versus ride-hail, journey time, traffic to avoid, and price estimates.",
    focusKeyword: "denpasar airport to ubud",
    summary:
      "It is about 75 minutes to 2 hours from the airport to Ubud, depending on traffic. A pre-booked private transfer is the simplest arrival option.",
    recommendation:
      "Pre-book a private transfer at around $25 to $35 per car. It is fixed-price with a meet-and-greet, simplest after a long flight, and barely more than ride-hail once airport pickup surcharges are factored in. Avoid the late-afternoon window if you can, since traffic pushes the trip toward 2 hours.",
    modes: [
      {
        mode: "private-car",
        label: "Private car transfer",
        durationText: "About 75 minutes off-peak, up to 2 hours in traffic",
        priceUsdText: "Around $25 to $35 per car (working estimate)",
        frequencyText: "On demand, around the clock",
        bookingPartner: "klook",
        notes: "Fixed price with meet-and-greet, which is easiest straight off a flight.",
      },
      {
        mode: "private-car",
        label: "Ride-hail (Grab or Gojek)",
        durationText: "About 75 minutes to 2 hours",
        priceUsdText: "Around $15 to $30 (working estimate)",
        frequencyText: "On demand",
        bookingPartner: null,
        notes: "Pickups at the airport are restricted and surcharged, which narrows the saving.",
      },
    ],
    faqs: [
      {
        question: "How long from Denpasar Airport to Ubud?",
        answer: "About 75 minutes off-peak, and up to 2 hours in afternoon traffic.",
      },
      {
        question: "How much does it cost?",
        answer:
          "As a working estimate, around $25 to $35 per car for a private transfer, or roughly $15 to $30 by ride-hail.",
      },
      {
        question: "Is it reliable?",
        answer: "Yes. It is the most common arrival transfer in Bali, available around the clock.",
      },
      {
        question: "Transfer or ride-hail?",
        answer:
          "Ride-hail pickups at the airport are restricted and surcharged, so a pre-booked private transfer often avoids the hassle for little extra cost.",
      },
    ],
    relatedTripSlugs: ["7-days-bali-first-timers", "5-days-bali-ubud-canggu-uluwatu"],
    priority: 3,
    status: "live",
  },
];

// All backlog routes have been built into TRANSPORT_ROUTES above. This type +
// array stay for future expansion (add a stub here, then promote it to a full
// TransportRoute when researched).
export type RouteSeed = {
  slug: string;
  fromName: string;
  toName: string;
  priority: 1 | 2 | 3;
  note: string;
};

export const ROUTE_BACKLOG: RouteSeed[] = [];

export function findRouteBySlug(slug: string): TransportRoute | undefined {
  return TRANSPORT_ROUTES.find((r) => r.slug === slug);
}
