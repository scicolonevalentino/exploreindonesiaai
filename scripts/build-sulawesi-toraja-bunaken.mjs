// One-off builder for the Sulawesi (Toraja + Bunaken) draft itinerary.
// Generates Portable Text with guaranteed-unique keys, validates against the
// house editorial rules, writes the document JSON snapshot, and prints it.
import { writeFileSync } from "node:fs";

const SLUG = "10-days-sulawesi-toraja-bunaken";

// ── key generator ────────────────────────────────────────────
let _k = 0;
const key = () => `k${_k++}`;

// span helpers
const span = (text, marks = []) => ({ _type: "span", _key: key(), marks, text });
const strong = (text) => span(text, ["strong"]);

// block builders
const h2 = (text) => ({ _type: "block", _key: key(), style: "h2", markDefs: [], children: [span(text)] });
// para: pass an array of spans + optional markDefs
const para = (children, markDefs = []) => ({ _type: "block", _key: key(), style: "normal", markDefs, children });
const p = (text) => para([span(text)]);
// lead line: bold lead + rest
const lead = (leadText, restText) => para([strong(leadText), span(restText)]);

// affiliate ref inside a paragraph
function affPara(parts) {
  // parts: array of {text} | {text, strong:true} | {text, aff:placeholderId} | {text, href}
  const markDefs = [];
  const children = parts.map((part) => {
    if (part.aff) {
      const mk = key();
      markDefs.push({ _key: mk, _type: "affiliateLinkRef", placeholderId: part.aff });
      return span(part.text, [mk]);
    }
    if (part.href) {
      const mk = key();
      markDefs.push({ _key: mk, _type: "externalLink", href: part.href, blank: part.href.startsWith("http") });
      return span(part.text, [mk]);
    }
    if (part.strong) return strong(part.text);
    return span(part.text);
  });
  return { _type: "block", _key: key(), style: "normal", markDefs, children };
}

const body = [];
const push = (...b) => body.push(...b);

// ── Who this trip is for ─────────────────────────────────────
push(h2("Who this trip is for"));
push(p(
  "This route suits travellers who treat the journey as part of the point. It pairs the highland funeral culture of Tana Toraja with the reef walls off Bunaken, two of the strongest reasons to fly all the way to Sulawesi, and it accepts that getting between them takes time. It works well for couples, small groups of friends and repeat visitors to Indonesia who have already done Bali or Lombok and want a trip with more cultural weight and fewer crowds. You should be comfortable with long overland drives, light tourism infrastructure and a region where English is limited outside the dive resorts."
));
push(p(
  "It is not the right trip for first-time Indonesia visitors who want effortless logistics, for families with very young children who will struggle with the mountain road to Toraja, or for anyone whose main goal is a polished beach resort. Those travellers are better served in Bali, the Gili Islands or Nusa Penida. Sulawesi rewards patience, and the single biggest mistake is underestimating the transfers."
));

// ── Trip at a glance ─────────────────────────────────────────
push(h2("Trip at a glance"));
push(lead("Route: ", "Makassar to Tana Toraja and the Rantepao highlands, back to Makassar, then a flight north to Manado and out to Bunaken."));
push(lead("Best for: ", "Toraja highland culture, Sulawesi food, and wall diving or snorkelling off Bunaken."));
push(lead("Pace: ", "Balanced, but front-loaded with travel. Two long transfer days bookend three full days in Toraja and three on the reef."));
push(lead("Base changes: ", "Three main bases. Rantepao for Toraja, one transit night in Makassar, and a Bunaken island resort for the diving stretch."));
push(lead("When to go: ", "The drier months from around May to October are the safest window for both the highlands and the reef. Toraja funeral ceremonies cluster in the July and August peak. Confirm timing locally, as ceremony dates are not fixed in advance."));

// ── Why this route makes sense ───────────────────────────────
push(h2("Why this route makes sense"));
push(p(
  "Sulawesi is shaped like a sprawling letter K, and its highlights sit far apart. Tana Toraja is in the south, reached overland from Makassar. Bunaken is in the far north, reached by sea from Manado. There is no quick way to connect the two, so the honest version of this trip routes you back through Makassar between them rather than pretending a shortcut exists."
));
push(p(
  "The payoff for that backtrack is range. You get a culture that organises life around elaborate funerals and cliff-carved graves, then a marine park where the reef drops away in vertical walls a short boat ride from your room. Trying to add the Togean Islands or Wakatobi on top would turn ten days into a transit marathon, so this version keeps two anchors and gives each enough time to be worth the airfare."
));

// ── Days ─────────────────────────────────────────────────────
push(h2("Day 1: Arrive in Makassar"));
push(lead("Afternoon. ", "Land at Sultan Hasanuddin International Airport in Makassar, airport code UPG. As a working guide, most travellers connect through Jakarta, Bali or Singapore and Kuala Lumpur, so confirm current flight routes before locking hotels. Makassar is the gateway for the whole south, and a night here lets you start the Toraja drive fresh rather than groggy from a long-haul connection."));
push(lead("Evening. ", "Eat at the Losari waterfront, where the seafood and the grilled fish stalls are the reason to be in the city at all. If you land early, Fort Rotterdam is a calm hour of Dutch-era history near the seafront."));
push(affPara([
  { text: "Travel note: ", strong: true },
  { text: "Set up an " },
  { text: "Indonesia eSIM with Airalo", aff: "AIRALO_INDONESIA" },
  { text: " before you leave the airport. Coverage holds in Makassar and Manado but thins on the Toraja road and around Bunaken, so having maps and translation working from the start saves real friction." },
]));
push(lead("Base: ", "Makassar, one night."));

push(h2("Day 2: Makassar to Tana Toraja"));
push(p("This is the trip's first long transfer, and it sets the tone. Tana Toraja sits roughly 300 to 310 kilometres north of Makassar on a winding mountain road, and the drive runs about eight to ten hours as a working estimate, depending on traffic out of the city, rest stops and roadworks. Leave early."));
push(affPara([
  { text: "Morning. ", strong: true },
  { text: "Decide your transfer before today. A private car with a driver is the most comfortable option and lets you stop at the Bambapuang viewpoint and the Kandora cliffs on the way. Long-distance buses also run the route, often overnight. You can " },
  { text: "compare Makassar to Toraja transfers", aff: "12GO_MAKASSAR_TORAJA" },
  { text: " to see current bus and shared-car options and rough prices, which can change, rather than negotiating cold at the terminal." },
]));
push(lead("Afternoon. ", "There is a seasonal alternative worth knowing about. Wings Air has run a short flight from Makassar to Toraja Airport, also called Buntu Kunik, at roughly 50 minutes. As a working note it has been a seasonal and low-frequency route, often only a couple of departures a week and not year-round, so treat it as a bonus rather than a plan. Check the latest official guidance and only build around it if you can confirm a flight on your dates."));
push(lead("Evening. ", "Arrive in Rantepao, the practical base for the highlands. Eat early and rest. Tomorrow is the first full day on foot and on small roads."));
push(lead("Base: ", "Rantepao, three nights."));
push(lead("Booking logic: ", "Stay in or near Rantepao rather than the smaller town of Makale. It puts you closer to most of the village sites and to the drivers and guides who arrange them."));

push(h2("Day 3: Southern Toraja, graves and the funeral landscape"));
push(lead("Morning. ", "Start with the classic southern loop. Lemo is a cliff face lined with carved burial niches and rows of tau tau, the wooden effigies that watch over the dead. Londa is a cave and cliff site where coffins and skulls sit in the rock, usually visited with a lamp-carrying local guide."));
push(lead("Afternoon. ", "Continue to Kete Kesu, a village of towering tongkonan houses with their boat-shaped roofs, rice barns and an old hillside burial ground behind. It is the most visited site in Toraja for good reason, and it explains the architecture you will keep seeing all week."));
push(lead("Travel note: ", "Sites in Toraja typically charge a small entry or village fee, often in the region of a few tens of thousands of rupiah each, paid in cash. Carry small notes, as card payment is rare outside Rantepao and fees can change."));
push(lead("Evening. ", "Back in Rantepao for dinner. If a funeral ceremony is taking place during your visit, your guide may raise it now, since attending one is a question of timing rather than booking."));

push(h2("Day 4: Highland villages and a possible ceremony"));
push(lead("Morning. ", "Drive up to Batutumonga on the slopes of Mount Sesean. The road climbs through terraced rice fields to viewpoints over the whole Rantepao valley, and the megalithic site at Bori with its standing stones sits along the way. The air up here is noticeably cooler."));
push(lead("Afternoon. ", "If a Toraja funeral ceremony is happening, this is the kind of day to attend. These are large multi-day community events, not performances, and visitors are generally welcome with a guide and a respectful gift such as cigarettes or sugar for the host family. They are most common in the July and August peak but can fall in other months too. Your guide will know what is on. If nothing is scheduled, spend the afternoon walking between highland hamlets instead."));
push(lead("Travel note: ", "Ceremonies involve animal sacrifice, including buffalo, which some visitors find confronting. Decide in advance whether you want to attend, and follow your guide's lead on where to stand and when to photograph."));
push(lead("Evening. ", "Return to Rantepao."));

push(h2("Day 5: A slower Toraja day, markets and trekking"));
push(lead("Morning. ", "If your visit lines up with it, the Bolu livestock market near Rantepao is the social and economic engine of the region, busiest on its rotating market days when prized buffalo change hands for serious money. It runs on a six-day cycle rather than a fixed weekday, so ask locally."));
push(lead("Afternoon. ", "Use this day to slow down. A half-day walk through the rice terraces and villages around Batutumonga or Tikala is the best way to see daily Toraja life away from the main sites. A local guide turns a pretty walk into an explanation of houses, graves and family lines."));
push(lead("Evening. ", "Last night in the highlands. Pack and confirm tomorrow's transfer back to Makassar, as your onward flight north depends on it."));

push(h2("Day 6: Toraja back to Makassar"));
push(p("Today you give back the eight to ten hours you spent getting up here. There is no way around it on this route, which is the main reason Sulawesi takes longer than its map distances suggest."));
push(lead("Morning. ", "Leave Rantepao early for the drive south. If you managed to confirm the seasonal Wings Air flight, this is where it saves you most, turning a full travel day into a short hop, but only if it runs on your date."));
push(lead("Evening. ", "Arrive back in Makassar and overnight near the airport. You want to be close to the terminal for an early flight to Manado, not fighting city traffic at dawn."));
push(lead("Base: ", "Makassar, one transit night."));
push(lead("Booking logic: ", "Book an airport-area hotel for tonight specifically. The convenience matters more than the location on a pure transit night."));

push(h2("Day 7: Fly to Manado and cross to Bunaken"));
push(lead("Morning. ", "Fly from Makassar to Sam Ratulangi Airport in Manado, airport code MDC. As a working estimate the flight runs about one hour 45 minutes nonstop, and several carriers serve the route with frequent departures, so you have flexibility on timing. Confirm current schedules before you commit to a morning flight."));
push(lead("Afternoon. ", "From Manado, transfer to the harbour and take a boat out to Bunaken Island, usually around 45 minutes to an hour depending on the boat and sea state. Most island resorts arrange the transfer as part of your stay, which is simpler than chasing the public boat that runs to a fixed local schedule."));
push(lead("Travel note: ", "Bunaken sits inside a national marine park, and there is an entry fee for visitors, in the region of 150,000 rupiah as a working figure, sometimes collected as a daily or trip pass. Fees can change, so confirm the current rate and whether your resort handles it on arrival."));
push(lead("Evening. ", "Settle into your resort. The pace shifts completely here from road days to reef days."));
push(lead("Base: ", "Bunaken, three nights."));

push(h2("Day 8: Bunaken's walls"));
push(lead("Morning. ", "Bunaken's signature is the wall dive. The reef drops vertically into deep blue along sites like Lekuan and Fukui, and the visibility, turtles and reef fish are the reason divers fly here specifically. Two morning dives is the standard rhythm. Certified divers can get straight in; resorts also run courses if you want to start."));
push(lead("Afternoon. ", "If you do not dive, the snorkelling here is genuinely strong, because the wall starts close to the surface and you can drift along the top of it from a boat. You do not need a tank to see why the park has its reputation. Book a snorkelling boat through your resort."));
push(lead("Evening. ", "Quiet island evening. Bunaken has limited nightlife by design, which is part of the appeal after the road days."));

push(h2("Day 9: More reef, or Siladen and the wider park"));
push(lead("Morning. ", "Spend a second day on the water. Dive or snorkel a different stretch of the park, or take a boat across to nearby Siladen, a smaller, quieter island with its own reef, for a change of scene."));
push(lead("Afternoon. ", "Keep one afternoon genuinely free. Three days of boats and salt water is tiring, and a slow afternoon in a hammock is part of why this stretch balances the cultural intensity of Toraja."));
push(lead("Travel note: ", "Leave at least a full day, ideally more, between your last dive and any onward flight, to stay within standard no-fly guidance after diving. Plan your final-day flight time with that in mind."));
push(lead("Evening. ", "Last night on the island. Confirm your morning boat back to Manado."));

push(h2("Day 10: Bunaken to Manado and onward"));
push(lead("Morning. ", "Take the boat back to Manado and connect to your onward flight, usually via Jakarta or another hub for international travellers. Build in a generous buffer for the boat crossing, which depends on weather more than a road transfer does."));
push(lead("Afternoon. ", "If you have a late flight, Manado has good Minahasan food worth a final meal, though the spicier local dishes are an acquired taste. Otherwise, head straight to the airport."));
push(lead("Booking logic: ", "Do not book a tight same-day international connection out of Manado. A weather-delayed boat or a held domestic flight can unravel it, and a night in Jakarta on the way out is cheap insurance."));

// ── What to book early ───────────────────────────────────────
push(h2("What to book early, and what to keep flexible"));
push(p(
  "Book your domestic flights and your Bunaken resort early. The Makassar to Manado leg and the island resorts both fill in the dry-season peak, and the resort transfer is the cleanest way onto the island. Lock the long-haul connections into and out of Sulawesi too, since Makassar and Manado are not daily-direct from most countries."
));
push(p(
  "Keep the Toraja days flexible. Whether you attend a funeral ceremony, catch the Bolu market or trek depends on dates you cannot fully control, so arrange a local driver and guide for the three highland days and let them shape the itinerary around what is actually happening. The seasonal Toraja flight is the one thing not to count on. Treat it as a possible upgrade you confirm late, not a fixed leg."
));

// ── Mistakes ─────────────────────────────────────────────────
push(h2("Mistakes travellers make on a Sulawesi trip"));
push(p(
  "The first mistake is underestimating the Makassar to Toraja drive. It is long, it is winding, and doing it as a same-day round trip ruins both ends. Give Toraja at least three nights so the eight-to-ten-hour drives each way are worth it."
));
push(p(
  "The second is trying to add the Togean Islands or Wakatobi to a ten-day trip. Both are wonderful and both are slow to reach, and bolting them on turns this into a transfer schedule with a holiday attached. Save them for a longer trip."
));
push(p(
  "The third is cutting the no-fly buffer after diving Bunaken to make an earlier flight. That is a safety call, not a scheduling one. Build the gap in and protect it."
));

// ── What to cut, adapt or upgrade ────────────────────────────
push(h2("What to cut, adapt or upgrade"));
push(lead("Short on time? ", "Cut a Bunaken night before you cut a Toraja one. Two nights on the reef still gives a full day of diving or snorkelling, whereas Toraja loses its meaning if you rush the cultural sites and skip a possible ceremony."));
push(lead("Not a diver? ", "Keep Bunaken anyway and snorkel. The wall starts shallow, so the best of the park is visible from the surface, and you can always do a discover-scuba session to test the water."));
push(lead("Want it gentler? ", "If the long drives are the dealbreaker, build the trip around the seasonal Toraja flight once you can confirm it, or consider a North Sulawesi only trip pairing Bunaken with the Tangkoko reserve for tarsiers and not attempting Toraja at all."));
push(lead("Have more time? ", "With two weeks you can add the Togean Islands after Toraja for a slower, more remote island stretch, or extend in the north with Tangkoko wildlife and the Minahasa highlands around Tomohon."));

// ── Before you build this trip ───────────────────────────────
push(h2("Before you build this trip"));
push(affPara([
  { text: "Visa. ", strong: true },
  { text: "Most visitors enter Indonesia on a visa on arrival, around 500,000 rupiah for a 30-day stay that can usually be extended once, and ten days sits comfortably inside that. Rules and prices change, so check the latest official guidance for your nationality before you travel. An " },
  { text: "Indonesia eSIM", aff: "AIRALO_INDONESIA" },
  { text: " also lets you handle any online visa or arrival paperwork the moment you land." },
]));
push(lead("Cash. ", "Carry enough rupiah in cash for the Toraja days and the marine park fee. ATMs are reliable in Makassar, Rantepao and Manado but scarce on Bunaken and at village sites, where almost everything is cash only."));
push(lead("Health and timing. ", "This is a dry-season trip. The roads, the highland walks and the boat crossings are all easier from roughly May to October. Travel insurance that covers diving is worth it if you plan to dive Bunaken."));
push(lead("Guides. ", "A good local guide is close to essential in Toraja, both for access to ceremonies and for the meaning behind the graves and houses. It is one of the few places where a guide changes the trip rather than just easing it."));

// ── Final verdict ────────────────────────────────────────────
push(h2("Final verdict"));
push(p(
  "This is a strong second or third trip to Indonesia, not a first one. The reward is genuine range, a highland culture you will not find anywhere else and a marine park that earns its reputation, and the price you pay for it is time on the road and a backtrack through Makassar. If you accept the transfers as part of the deal and give both Toraja and Bunaken room to breathe, ten days is enough to do justice to a side of Indonesia most visitors never reach. If long drives and light infrastructure sound like work rather than adventure, this is not your trip, and there is no shame in choosing Bali instead."
));

// ── Related itineraries ──────────────────────────────────────
push(h2("Related itineraries"));
push(affPara([
  { text: "If you want even more remote Sulawesi and the wider east, our " },
  { text: "20-day wild Indonesia route", href: "/trips/20-days-wild-indonesia" },
  { text: " strings several frontier regions together at a slower pace. For a different reef-led trip in the far east, the " },
  { text: "7-day Raja Ampat snorkelling islands itinerary", href: "/trips/7-days-raja-ampat-snorkeling-islands" },
  { text: " trades Toraja's culture for the richest marine life in the country. You can also browse more options on our " },
  { text: "Wild Indonesia destination guide", href: "/destinations/wild-indonesia" },
  { text: "." },
]));

// ── intro (POV lead, separate field) ─────────────────────────
const intro =
  "Most travellers who reach Sulawesi do one thing and fly out, either the highland funerals of Toraja or the reef walls off Bunaken, because connecting the two feels like too much road for one trip. It is a lot of road. But ten days is enough to do both honestly if you accept the backtrack through Makassar instead of pretending there is a shortcut. This is a trip about range rather than ease, and it suits travellers who have already done easy Indonesia and want the harder, richer version.";

// ── FAQ ──────────────────────────────────────────────────────
const faq = [
  {
    question: "How many days do you need for Sulawesi?",
    answer:
      "Ten days is a sensible minimum to pair Tana Toraja with Bunaken without rushing, because two of those days go to transfers. With less time, focus on one region, either Toraja from Makassar or Bunaken from Manado, rather than trying to link both. With two weeks you could add the Togean Islands or North Sulawesi wildlife.",
  },
  {
    question: "How long is the drive from Makassar to Tana Toraja?",
    answer:
      "As a working estimate the drive runs about eight to ten hours over roughly 300 to 310 kilometres of winding mountain road, depending on traffic and rest stops. There is also a seasonal, low-frequency Wings Air flight to Toraja Airport at around 50 minutes, but it does not run year-round, so confirm current schedules before relying on it.",
  },
  {
    question: "When is the best time to see a Toraja funeral ceremony?",
    answer:
      "Toraja funeral ceremonies are most common in the July and August peak, when many families hold them, but they can fall in other months too. Dates are set by families rather than a fixed calendar, so you cannot book one in advance. A local guide in Rantepao will know which ceremonies are happening during your visit and can arrange a respectful way to attend.",
  },
  {
    question: "Do you need to dive to enjoy Bunaken?",
    answer:
      "No. Bunaken is famous for wall diving, but the reef wall starts close to the surface, so snorkellers drift along the top of it and see turtles and reef fish without a tank. Divers get more out of the deeper walls, and resorts run courses if you want to start, but snorkelling alone is well worth the trip north.",
  },
  {
    question: "What does it cost to enter Bunaken National Marine Park?",
    answer:
      "There is a marine park entry fee for visitors, in the region of 150,000 rupiah as a working figure, sometimes collected as a daily or per-trip pass. Boat transfers and dive packages are separate. Fees can change and are usually paid in cash, so carry rupiah and confirm the current rate, since many resorts handle the fee on arrival.",
  },
  {
    question: "Do you need a visa for Indonesia?",
    answer:
      "Most visitors enter on a visa on arrival, around 500,000 rupiah for a 30-day stay that can usually be extended once, which comfortably covers a ten-day trip. Rules and prices vary by nationality and change over time, so check the latest official guidance before you travel.",
  },
  {
    question: "Is this Sulawesi trip suitable for families with young children?",
    answer:
      "It is a stretch for families with very young children. The long mountain drive to Toraja, the limited infrastructure and the boat crossing to Bunaken make it tiring for small kids. Older children who travel well may enjoy it, but families wanting an easier first trip are better served in Bali, the Gili Islands or Nusa Penida.",
  },
];

// ── affiliate links array ────────────────────────────────────
const affiliateLinks = [
  {
    placeholderId: "AIRALO_INDONESIA",
    partner: "airalo",
    affiliateUrl: "https://airalo.tpx.lu/ywUnFTCe",
    publicUrl: "https://www.airalo.com/indonesia-esim",
    anchorText: "Indonesia eSIM with Airalo",
    experienceCategory: "other",
    linkStatus: "live",
    notes: "travelpayouts",
  },
  {
    placeholderId: "12GO_MAKASSAR_TORAJA",
    partner: "12go",
    affiliateUrl: "https://12go.asia/?z=16022946",
    publicUrl: "https://12go.asia/en/travel/makassar/tana-toraja",
    anchorText: "Compare Makassar to Toraja transfers",
    experienceCategory: "airport_transfer",
    linkStatus: "live",
    notes: null,
  },
];

const doc = {
  _type: "article",
  _id: `itinerary-${SLUG}`,
  contentStatus: "draft",
  slug: { _type: "slug", current: SLUG },
  title: "10 Days in Sulawesi: Tana Toraja, Bunaken and the Long Road Between",
  metaTitle: "10 Days in Sulawesi: Tana Toraja & Bunaken",
  metaDescription:
    "A 10-day Sulawesi itinerary pairing Tana Toraja's highland culture with the reef walls of Bunaken. Route logic, the long drives and what to book first.",
  focusKeyword: "Sulawesi itinerary",
  author: { _type: "reference", _ref: "author-editorial-team" },
  articleCreatedDate: new Date().toISOString(),
  destinationPrimary: "wild_indonesia",
  tripLengthBucket: "ten_days",
  tripLengthDays: 10,
  travelStylePrimary: "remote_offbeat",
  travellerTypes: ["couples", "friends", "repeat_travellers"],
  vibe: "balanced",
  route: "Makassar → Tana Toraja (Rantepao) → Makassar → Manado → Bunaken",
  intro,
  faq,
  affiliateLinks,
  body,
};

// ── VALIDATION ───────────────────────────────────────────────
const errors = [];
const allText = JSON.stringify(doc);

// em-dashes
if (/—/.test(allText)) errors.push("contains em-dash");
// banned phrases
const banned = [
  "hidden gem", "must-see", "must see", "paradise", "immerse yourself", "unforgettable",
  "something for everyone", "vibrant culture", "crystal-clear", "crystal clear",
  "breathtaking", "rich history", "local charm", "authentic experience",
  "off the beaten path", "once-in-a-lifetime", "once in a lifetime", "bucket list", "dream destination",
];
for (const b of banned) {
  if (new RegExp(b.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i").test(allText)) errors.push(`banned phrase: ${b}`);
}
// artifacts
if (/\(SEARCH/i.test(allText)) errors.push("contains (SEARCH artifact");
if (/\d+\s+reviews/i.test(allText)) errors.push("contains 'N reviews' artifact");

// unique keys
const keys = [];
const collectKeys = (node) => {
  if (Array.isArray(node)) node.forEach(collectKeys);
  else if (node && typeof node === "object") {
    if (typeof node._key === "string") keys.push(node._key);
    Object.values(node).forEach(collectKeys);
  }
};
collectKeys(body);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dupes.length) errors.push(`duplicate keys: ${[...new Set(dupes)].join(",")}`);

// meta lengths
if (doc.metaTitle.length > 60) errors.push(`metaTitle ${doc.metaTitle.length} > 60`);
if (doc.metaDescription.length > 155) errors.push(`metaDescription ${doc.metaDescription.length} > 155`);

// every affiliateLinkRef placeholderId present in affiliateLinks
const declared = new Set(affiliateLinks.map((a) => a.placeholderId));
const used = new Set();
const collectAff = (node) => {
  if (Array.isArray(node)) node.forEach(collectAff);
  else if (node && typeof node === "object") {
    if (node._type === "affiliateLinkRef") used.add(node.placeholderId);
    Object.values(node).forEach(collectAff);
  }
};
collectAff(body);
for (const u of used) if (!declared.has(u)) errors.push(`affiliateLinkRef ${u} not in affiliateLinks`);

// day headings
const dayHeadings = body.filter((b) => b.style === "h2" && /^Day \d+:/.test(b.children[0].text)).length;

console.log("=== VALIDATION ===");
console.log("metaTitle len:", doc.metaTitle.length);
console.log("metaDescription len:", doc.metaDescription.length);
console.log("body blocks:", body.length);
console.log("day headings:", dayHeadings);
console.log("unique keys:", keys.length, "all unique:", dupes.length === 0);
console.log("affiliate placeholders used:", [...used].join(","));
console.log("faq count:", faq.length);
if (errors.length) {
  console.error("VALIDATION FAILED:\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log("VALIDATION PASSED");

writeFileSync(`content/articles/${SLUG}.json`, JSON.stringify(doc, null, 2));
writeFileSync(`/tmp/${SLUG}-mutation.json`, JSON.stringify({ mutations: [{ create: doc }] }));
console.log(`\nWrote content/articles/${SLUG}.json and /tmp/${SLUG}-mutation.json`);
