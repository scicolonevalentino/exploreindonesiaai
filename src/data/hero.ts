// Single source of truth for the homepage hero copy + backdrop.
//
// Consumed by BOTH the live hero (src/routes/index.tsx, the <Hero/> component)
// and the social-preview card generator (src/routes/og[.]png.tsx). Keeping the
// copy here means a shared link preview can never drift from what the homepage
// actually says — change the hero wording in one place and the WhatsApp /
// Instagram / X card updates with it.
//
// `highlight1` / `highlight2` are the words that get the teal highlighter bar in
// the hero; the card reproduces the same treatment.

export const HERO = {
  eyebrow: "AI itinerary planning, powered by real experiences",
  title: {
    lead: "Have you planned your trip to ",
    highlight1: "Indonesia",
    q: "?",
    line2Lead: "We make it ",
    highlight2: "ready-to-book",
  },
  subtitle: {
    lead: "Paste an Indonesia itinerary from ChatGPT, a blog, or your own notes.",
    main: "We turn it into a structured, day-by-day trip with bookable stays, transfers, tours, and experiences.",
  },
  // Served from public/ at the site root; also the hero <video> poster frame.
  poster: "/hero-bg-poster.jpg",
} as const;
