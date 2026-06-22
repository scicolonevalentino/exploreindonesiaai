// One-off build + validate + create for the West Sumatra draft article.
import fs from "node:fs";

const SLUG = "7-days-west-sumatra-bukittinggi-harau-valley";
const NOW = new Date().toISOString();

// ── key generator ────────────────────────────────────────────
let _k = 0;
const key = () => "k" + _k++;

// ── span / block helpers ─────────────────────────────────────
// part forms: "plain string" | b("bold") | lnk("text","/href") | aff("text","PLACEHOLDER")
const b = (text) => ({ _t: "b", text });
const lnk = (text, href) => ({ _t: "lnk", text, href });
const aff = (text, placeholderId) => ({ _t: "aff", text, placeholderId });

function block(style, parts) {
  const children = [];
  const markDefs = [];
  for (const part of parts) {
    if (typeof part === "string") {
      children.push({ _type: "span", _key: key(), marks: [], text: part });
    } else if (part._t === "b") {
      children.push({ _type: "span", _key: key(), marks: ["strong"], text: part.text });
    } else if (part._t === "lnk") {
      const mk = key();
      markDefs.push({ _key: mk, _type: "externalLink", blank: part.href.startsWith("http"), href: part.href });
      children.push({ _type: "span", _key: key(), marks: [mk], text: part.text });
    } else if (part._t === "aff") {
      const mk = key();
      markDefs.push({ _key: mk, _type: "affiliateLinkRef", placeholderId: part.placeholderId });
      children.push({ _type: "span", _key: key(), marks: [mk], text: part.text });
    }
  }
  return { _type: "block", _key: key(), style, markDefs, children };
}
const h2 = (text) => block("h2", [text]);
const p = (...parts) => block("normal", parts);

// ── BODY ─────────────────────────────────────────────────────
const body = [
  h2("Who this trip is for"),
  p("This route suits travellers who choose culture and landscape over nightlife and beach clubs, who do not mind a few half-day drives, and who are comfortable in a region where English is limited and tourism infrastructure is light. It works well for couples, small groups of friends and solo travellers who want a calmer corner of Indonesia. Minangkabau society is matrilineal, the food is among the best in the country, and the scenery shifts from canyon to lake to cliff-walled valley inside a single week."),
  p("It is not the right trip for first-time Indonesia visitors who want effortless logistics, for families with very young children who will struggle with the winding drives, or for anyone whose main goal is diving or a polished resort. Those travellers are better served in Bali or the Gili Islands. West Sumatra rewards patience more than it rewards convenience, and it helps to arrive knowing that."),

  h2("Trip at a glance"),
  p(b("Route: "), "Padang to Bukittinggi to Lake Maninjau, then Pagaruyung and Harau Valley, then back to Padang."),
  p(b("Best for: "), "Minangkabau culture, highland scenery and some of the best food in Indonesia."),
  p(b("Pace: "), "Balanced, built around two or three half-day drives rather than long daily transfers."),
  p(b("Base changes: "), "Three. Bukittinggi for the first nights, Harau Valley in the middle, and one night near Padang at the end."),
  p(b("When to go: "), "The drier stretch from roughly May to September tends to be easier for viewpoints and valley walks, as a working guide. Sumatra is wet for much of the year, so pack a rain layer whatever the month."),
  p(b("Getting there: "), "Fly into Minangkabau International Airport near Padang, airport code PDG, which has regular connections from Jakarta and Kuala Lumpur. Confirm current routes before locking hotels, since regional schedules change."),

  h2("Why this route makes sense"),
  p("West Sumatra is compact in a way the north is not. Bukittinggi sits in the middle of the highlands and works as a natural hub, with Lake Maninjau about ninety minutes to the southwest down the Kelok 44 road, and the Pagaruyung area and Harau Valley to the east. By basing in Bukittinggi first you can run day trips in both directions without packing and unpacking, then move to Harau Valley for two nights to slow down and sleep inside the scenery rather than visiting it on a day trip."),
  p("The loop ends back in Padang on purpose. The drive from the highlands down to the coast takes a few hours and Sumatran roads do not reward tight connections, so an overnight near the airport removes the risk of missing a morning flight. The whole route is a triangle that avoids backtracking the same road twice, which matters when each leg is winding and slow."),

  h2("Day 1: Arrive in Padang, transfer to Bukittinggi"),
  p(b("Morning. "), "Land at Minangkabau International Airport near Padang. Most international arrivals route through Jakarta or Kuala Lumpur, so plan for a connection rather than a direct long-haul flight, and confirm the current routing before you book."),
  p(b("Afternoon. "), "Head straight up to Bukittinggi. The drive takes around two to three hours as a working estimate, climbing out of the coastal heat into cooler highland air. You can arrange a private car or take a shared minibus. ", aff("Compare Padang to Bukittinggi transfers", "12GO_PADANG_BUKITTINGGI"), " before you arrive so you are not negotiating at the airport curb after a flight."),
  p(b("Evening. "), "Settle in around Jam Gadang, the Dutch-era clock tower that anchors the town centre, and walk the Pasar Atas market lanes nearby for a first Minangkabau meal. Padang food is served rendang, gulai and sambal laid out in small dishes, and you pay only for what you eat."),
  p(b("Base: "), "Bukittinggi, for three nights."),
  p(b("Travel note: "), "Mobile coverage thins out in the valleys and on the mountain roads. An ", aff("Indonesia eSIM with Airalo", "AIRALO_INDONESIA"), " set up before you land saves hunting for a local SIM in Padang and keeps maps and translation working between towns."),

  h2("Day 2: Bukittinggi on foot and around the canyon"),
  p(b("Morning. "), "Start at Ngarai Sianok, the green canyon that drops away on the edge of town. The entrance fee is small, around IDR 15,000 as a working estimate, and prices can change. From the rim, the Janjang Koto Gadang stairway, sometimes called the great wall of Koto Gadang, runs down and across the canyon and back up the far side, which makes a good half-day walk for anyone who likes their sightseeing on foot."),
  p(b("Afternoon. "), "Visit Panorama Park and the Japanese tunnels dug into the hillside during the occupation, which carry a token entry fee of a few thousand rupiah. Fort de Kock and the Kinantan park sit a short walk away across a footbridge if you want to fill the afternoon, with a separate ticket of around IDR 50,000 as a working estimate."),
  p(b("Evening. "), "Eat well. Bukittinggi is a strong place to work through Minangkabau cooking, from rendang to dendeng balado, and to try kopi from the surrounding highlands."),
  p(b("Travel note: "), "Bukittinggi sits high enough that evenings are genuinely cool. A light layer is worth having, which surprises travellers arriving from Bali."),

  h2("Day 3: Lake Maninjau and the Kelok 44 road"),
  p(b("Morning. "), "Drive southwest to Lake Maninjau, a caldera lake reached by the Kelok 44 road, a sequence of forty-four numbered hairpin bends that switchback down the crater wall. The drive from Bukittinggi takes around ninety minutes as a working estimate, and the descent itself is the reason to go. Ask your driver to stop at the upper bends for the view back over the lake."),
  p(b("Afternoon. "), "Spend time at the lakeshore. Maninjau is quiet and rural, with small warungs and swimming spots rather than resorts, so this is a slow afternoon by design. Return to Bukittinggi by late afternoon, since the bends are best driven in daylight."),
  p(b("Evening. "), "Back in Bukittinggi for a second highland dinner and an early night before the move east."),
  p(b("Booking logic: "), "A private car with a driver for the day makes Maninjau far easier than piecing together public transport, and lets you control the stops. Agree the price and the waiting time in advance."),
  p(b("Travel note: "), "If anyone in your group is prone to motion sickness, the forty-four bends are no joke. Sit in front and take something before you leave."),

  h2("Day 4: Pagaruyung Palace, then move to Harau Valley"),
  p(b("Morning. "), "Check out of Bukittinggi and drive east toward Batusangkar to see Istana Basa Pagaruyung, the reconstructed royal palace of the old Minangkabau kingdom. It is a working model of rumah gadang architecture, the horn-roofed great houses of the region, rather than an ancient ruin, and the modest entry ticket goes toward upkeep. Confirm opening hours and the current fee on the day, since both can change."),
  p(b("Afternoon. "), "Continue to Harau Valley, near Payakumbuh, around one and a half to two hours from Bukittinggi as a working estimate. The valley opens up as sheer rock walls rising straight out of rice fields, with homestays and small guesthouses set among the paddies. Arrive with enough daylight to walk out and get your bearings."),
  p(b("Evening. "), "Eat at your guesthouse. Harau is rural and options are limited after dark, which is part of why people come."),
  p(b("Base: "), "Harau Valley, for two nights."),
  p(b("Booking logic: "), "Harau homestays are small and the good ones fill in peak months. Book ahead rather than assuming you can choose on arrival."),

  h2("Day 5: A full day inside Harau Valley"),
  p(b("Morning. "), "Walk or cycle the valley floor between the cliffs. There is a small entrance or maintenance fee to access parts of the valley as a working estimate, and it can change. The waterfalls running off the rock walls are the obvious targets, and the rice terraces between them are the quieter pleasure."),
  p(b("Afternoon. "), "Harau is one of the few places in Sumatra set up for rock climbing, with bolted routes on the cliff faces, so this is the day to try it if that appeals. Otherwise, keep walking, find a viewpoint, and let the pace drop. This is the slow centre of the trip and it is meant to feel that way."),
  p(b("Evening. "), "A second quiet night in the valley. The cliffs catch the last light, and there is very little to do after dark beyond eat and rest, which is the point."),
  p(b("Travel note: "), "Distances inside the valley are walkable but spread out. A cheap bicycle or scooter rental from your guesthouse opens up the far end without a long walk back."),

  h2("Day 6: Down to Padang and a night on the coast"),
  p(b("Morning. "), "Leave Harau early enough to enjoy the drive back down to the coast. The run from the valley to Padang takes roughly three to four hours as a working estimate, depending on traffic and stops, so this is mostly a travel morning."),
  p(b("Afternoon. "), "Arrive in Padang and use the afternoon for the city. Air Manis beach and the Malin Kundang rock, tied to the local legend of the ungrateful son turned to stone, make an easy outing, and Padang itself is the home of the food you have been eating all week, so it is worth one proper sit-down meal at the source."),
  p(b("Evening. "), "Stay near the airport or in central Padang for the night, depending on your morning flight time."),
  p(b("Base: "), "Padang, for one night."),
  p(b("Booking logic: "), "If your flight out is early, a hotel near Minangkabau International Airport is worth more than a more characterful one in town. The road in from the city is short but you do not want to gamble on it before a dawn departure."),

  h2("Day 7: Departure from Padang"),
  p(b("Morning. "), "Fly out from Minangkabau International Airport, usually connecting through Jakarta or Kuala Lumpur. Build in buffer time, since regional flights here can shift and a missed connection is harder to recover from than in Bali. Confirm your routing the day before."),

  h2("What to book early, and what to keep flexible"),
  p(b("Book early: "), "Your first night in Bukittinggi and both nights in Harau Valley, because the better guesthouses are small and fill in the drier months. A car and driver for the Maninjau day and for the Harau transfer are also worth arranging ahead, since on-the-spot prices are higher and the good drivers get booked."),
  p(b("Keep flexible: "), "The Bukittinggi sightseeing days, your Padang afternoon, and meals throughout. None of these need reservations, and weather in the highlands can rearrange a day, so leave room to swap the canyon walk and the Maninjau drive if the cloud comes in."),

  h2("Mistakes travellers make on this route"),
  p(b("Underestimating the drives. "), "Every leg here is winding mountain road, not highway. A transfer that looks like ninety minutes on a map can run longer with road works or rain, so do not stack two big drives into one day."),
  p(b("Skipping Harau as a base. "), "Visiting Harau Valley on a day trip from Bukittinggi is possible but misses the point. The valley is best in the early morning and late afternoon, which only the overnight gets you."),
  p(b("Treating Padang as a throwaway. "), "Many itineraries rush through Padang to reach the highlands. Giving it the final afternoon and one proper meal closes the loop on the food culture you have been sampling all week."),
  p(b("Assuming everywhere takes cards. "), "Outside Bukittinggi and Padang, cash is king. Draw enough rupiah in town before heading to Maninjau and Harau, where ATMs are scarce."),

  h2("What to cut, adapt or upgrade"),
  p(b("If you have less time, "), "cut Lake Maninjau and keep the trip to five or six days. The Bukittinggi base plus two nights in Harau is the core, and Maninjau is the most expendable day trip if the schedule tightens."),
  p(b("If you want more, "), "add a night in Harau for climbing or slow walking, or extend toward the Mentawai-bound coast and the Mandeh area south of Padang if islands and boats appeal more than highlands. That turns a one-week loop into a ten-day trip."),
  p(b("If you want to upgrade, "), "spend on a good private driver for the whole week rather than piecing transport together leg by leg. In a region with light public transport and few signs in English, a reliable driver is the single biggest comfort upgrade, more than any hotel."),
  p("If you want to pair this with the better-known north, the ", lnk("15-day Sumatra itinerary", "/trips/15-days-sumatra"), " covers Bukit Lawang, Berastagi and Lake Toba, and the two routes barely overlap, so they combine into a longer Sumatra trip without repeating ground."),

  h2("Before you build this trip"),
  p(b("Visa. "), "Most visitors enter Indonesia on a visa on arrival or e-VOA, which costs around IDR 500,000, roughly USD 35 as a working estimate, and is valid for thirty days with one extension possible. Fees and rules change, so check the latest official guidance before you travel."),
  p(b("Money. "), "Carry cash. Bukittinggi and Padang have ATMs, but Maninjau and Harau are thin on them, and most small warungs and homestays are cash only."),
  p(b("Connectivity. "), "Coverage is patchy in the valleys. Set up data before you arrive and download offline maps for the highland roads, where signage is limited."),
  p(b("Language and respect. "), "English is limited outside hotels. A few words of Indonesian go a long way, and West Sumatra is a conservative, predominantly Muslim region, so dress modestly away from the lakeshore and ask before photographing people."),
  p(b("Health and roads. "), "The drives are long and winding. Bring motion-sickness remedies if you are prone, and do not plan to drive yourself unless you are confident on mountain roads."),

  h2("Final verdict"),
  p("West Sumatra is not the easiest week in Indonesia, and that is the case for it. The drives are slow, the infrastructure is light, and you will see very few other foreign travellers, which is exactly why the Minangkabau highlands still feel like themselves. If you want culture, canyons, a caldera lake and a cliff-walled valley, all within a tight loop and backed by some of the best food in the country, this route delivers more than its length suggests. Go for the highlands and the food, accept the transfers as part of the deal, and end on the coast where the cooking comes from. It is a trip for people who would rather work a little for a place that has not been smoothed over."),

  h2("Related itineraries"),
  p("For the better-known northern half of the island, see the ", lnk("15 days in Sumatra itinerary", "/trips/15-days-sumatra"), " covering orangutans at Bukit Lawang, the Berastagi highlands and Lake Toba."),
  p("For another culture-and-volcano week with easier logistics, compare ", lnk("7 days in Yogyakarta and East Java", "/trips/7-days-yogyakarta-east-java"), ", which pairs temples with Java's volcanoes."),
  p("For the wider region and where this route fits, browse the ", lnk("Sumatra destination guide", "/destinations/sumatra"), "."),
];

// ── affiliate links ──────────────────────────────────────────
const affiliateLinks = [
  {
    affiliateUrl: "https://airalo.tpx.lu/ywUnFTCe",
    anchorText: "Indonesia eSIM with Airalo",
    experienceCategory: "other",
    linkStatus: "live",
    notes: "travelpayouts",
    partner: "airalo",
    placeholderId: "AIRALO_INDONESIA",
    publicUrl: "https://www.airalo.com/indonesia-esim",
  },
  {
    affiliateUrl: "https://12go.asia/?z=16022946",
    anchorText: "Compare Padang to Bukittinggi transfers",
    experienceCategory: "airport_transfer",
    linkStatus: "live",
    notes: null,
    partner: "12go",
    placeholderId: "12GO_PADANG_BUKITTINGGI",
    publicUrl: "https://12go.asia/en/travel/padang/bukittinggi",
  },
];

// ── FAQ ──────────────────────────────────────────────────────
const faq = [
  {
    question: "Is one week enough for West Sumatra?",
    answer:
      "One week is enough for the core highland loop of Bukittinggi, Lake Maninjau, Pagaruyung and Harau Valley, ending in Padang. It is not enough to add the northern orangutan region or the Mentawai islands. If you have less time, drop Lake Maninjau and keep five or six days around Bukittinggi and Harau.",
  },
  {
    question: "How do you get to West Sumatra?",
    answer:
      "Fly into Minangkabau International Airport near Padang, airport code PDG. As a working guide it has regular connections from Jakarta and Kuala Lumpur, so most travellers route through one of those. Confirm current flight routes before locking hotels, since regional schedules change.",
  },
  {
    question: "Should I base in Bukittinggi or Padang?",
    answer:
      "Base in Bukittinggi. It sits in the middle of the highlands with Lake Maninjau, Pagaruyung and Harau Valley all within a couple of hours, while Padang is the coastal arrival and departure point. This route keeps Bukittinggi as the hub, moves to Harau Valley for two nights, and uses Padang only for the final night before flying out.",
  },
  {
    question: "Do I need a car and driver?",
    answer:
      "It is the single biggest comfort upgrade here. Public transport exists but is slow and hard to piece together, English is limited, and the mountain roads are winding. Hiring a private car and driver, ideally for the whole week, removes most of the friction. Agree prices and waiting times in advance.",
  },
  {
    question: "What is the Kelok 44 road?",
    answer:
      "Kelok 44 is the road down to Lake Maninjau, made up of forty-four numbered hairpin bends switchbacking down the crater wall. The descent takes around ninety minutes from Bukittinggi as a working estimate and is worth doing in daylight. If anyone gets motion sick, sit in front and take something beforehand.",
  },
  {
    question: "Is West Sumatra suitable for families?",
    answer:
      "It is better for couples, friends and solo travellers than for families with very young children, mainly because of the long winding drives and the light tourist infrastructure. Families wanting easier logistics are usually happier in Bali or the Gili Islands. Older children who travel well can manage this route.",
  },
  {
    question: "What should I budget for entry fees and the visa?",
    answer:
      "Most attractions here are cheap. As a working estimate, Sianok Canyon is around IDR 15,000, the Japanese tunnels a few thousand rupiah, and the Kinantan park around IDR 50,000, while Pagaruyung Palace and Harau Valley charge modest fees that go toward upkeep. The visa on arrival or e-VOA costs around IDR 500,000, roughly USD 35. All of these can change, so confirm current prices on the day.",
  },
];

// ── document ─────────────────────────────────────────────────
const doc = {
  _id: "itinerary-" + SLUG,
  _type: "article",
  contentStatus: "draft",
  slug: { _type: "slug", current: SLUG },
  title: "7 Days in West Sumatra: Bukittinggi, Harau Valley and the Minangkabau Highlands",
  metaTitle: "7 Days in West Sumatra: Bukittinggi & Harau Valley",
  metaDescription:
    "A 7-day West Sumatra itinerary through Bukittinggi, Lake Maninjau, Pagaruyung and Harau Valley. Minangkabau culture, highland food and route logic.",
  focusKeyword: "West Sumatra itinerary",
  destinationPrimary: "sumatra",
  tripLengthBucket: "one_week",
  tripLengthDays: 7,
  travelStylePrimary: "culture_temples",
  travellerTypes: ["couples", "friends", "solo_travellers"],
  vibe: "balanced",
  author: { _type: "reference", _ref: "author-editorial-team" },
  articleCreatedDate: NOW,
  intro:
    "Most travellers who reach Sumatra go north for the orangutans and never turn west, which is how the Minangkabau highlands stay quiet even in high season. West Sumatra is a different trip from the jungle north. It runs on highland air, matrilineal Minangkabau culture, and a tight string of canyons, lakes and cliff-walled valleys that sit within a couple of hours of each other. This 7-day route from Padang keeps Bukittinggi as its base, adds two nights inside Harau Valley, and treats the long volcanic drives as part of the trip rather than a tax on it. If you want temples and beach clubs, this is not your week. If you want culture, cliffs and rice terraces with very few other foreigners around, it earns its place.",
  route: "Padang → Bukittinggi → Lake Maninjau → Pagaruyung → Harau Valley → Padang",
  faq,
  affiliateLinks,
  body,
};

// ── VALIDATE ─────────────────────────────────────────────────
const errors = [];
const serialized = JSON.stringify(doc);

// 1. em-dashes
if (/[—–]/.test(serialized)) errors.push("contains em/en dash");

// 2. banned phrases
const banned = [
  "hidden gem", "must-see", "must see", "paradise", "immerse yourself", "something for everyone",
  "vibrant culture", "crystal-clear", "crystal clear", "breathtaking", "rich history",
  "local charm", "authentic experience", "off the beaten path", "once-in-a-lifetime",
  "once in a lifetime", "bucket list", "dream destination", "unforgettable",
];
const low = serialized.toLowerCase();
for (const ph of banned) if (low.includes(ph)) errors.push("banned phrase: " + ph);

// 3. artifacts
if (/\(SEARCH/i.test(serialized)) errors.push("SEARCH artifact");
if (/\d[\d,]*\s+reviews/i.test(serialized)) errors.push("reviews artifact");

// 4. unique keys
const keys = [];
(function walk(o) {
  if (Array.isArray(o)) o.forEach(walk);
  else if (o && typeof o === "object") {
    if (typeof o._key === "string") keys.push(o._key);
    for (const k of Object.keys(o)) walk(o[k]);
  }
})(doc);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dupes.length) errors.push("duplicate _keys: " + [...new Set(dupes)].join(","));

// 5. meta lengths
if (doc.metaTitle.length > 60) errors.push("metaTitle " + doc.metaTitle.length + " > 60");
if (doc.metaDescription.length > 155) errors.push("metaDescription " + doc.metaDescription.length + " > 155");

// 6. every affiliateLinkRef placeholderId present in affiliateLinks
const declared = new Set(affiliateLinks.map((a) => a.placeholderId));
const used = new Set();
(function walkAff(o) {
  if (Array.isArray(o)) o.forEach(walkAff);
  else if (o && typeof o === "object") {
    if (o._type === "affiliateLinkRef") used.add(o.placeholderId);
    for (const k of Object.keys(o)) walkAff(o[k]);
  }
})(doc);
for (const u of used) if (!declared.has(u)) errors.push("affiliateLinkRef missing in affiliateLinks: " + u);

// 7. day headings start "Day N:"
const dayHeads = body.filter((bl) => bl.style === "h2" && /^Day/.test(bl.children[0].text) && /^Day \d/.test(bl.children[0].text) === false && /day/i.test(bl.children[0].text));
// informational only

// report
console.log("metaTitle len:", doc.metaTitle.length);
console.log("metaDescription len:", doc.metaDescription.length);
console.log("total keys:", keys.length, "unique:", new Set(keys).size);
console.log("affiliate used:", [...used].join(", "));
console.log("body blocks:", body.length, "| faq:", faq.length);
console.log("h2 headings:", body.filter((x) => x.style === "h2").map((x) => x.children[0].text).join(" | "));

if (errors.length) {
  console.error("\nVALIDATION FAILED:\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log("\nVALIDATION PASSED");

fs.writeFileSync("/tmp/west-sumatra-doc.json", JSON.stringify(doc, null, 2));
console.log("wrote /tmp/west-sumatra-doc.json");
