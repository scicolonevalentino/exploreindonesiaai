// One-off generator for the Mount Rinjani 7-day itinerary draft.
// Builds Portable Text with unique keys, validates, writes JSON snapshot.
import { writeFileSync } from "node:fs";

let kc = 0;
const key = (p = "k") => `${p}${(kc++).toString(36)}`;

const SLUG = "7-days-lombok-rinjani-trek";

// ── Affiliate links (all REUSED real, founder-vetted URLs) ──
const AFF = {
  AIRALO_INDONESIA: {
    partner: "airalo",
    anchorText: "Indonesia eSIM with Airalo",
    affiliateUrl: "https://airalo.tpx.lu/ywUnFTCe",
  },
  VIATOR_LOMBOK_AIRPORT_TRANSFER: {
    partner: "viator",
    anchorText: "private airport transfer in Lombok",
    affiliateUrl:
      "https://www.viator.com/tours/Lombok/Lombok-Private-Airport-Transfers-To-Bangsal-Port-Lombok-and-Gili-Trawangan/d22869-146698P6?pid=P00303362&mcid=42383&medium=link&campaign=RinjaniLombokairporttransfer",
  },
  VIATOR_SENARU_WATERFALLS: {
    partner: "viator",
    anchorText: "Sendang Gile and Tiu Kelep waterfalls day trip",
    affiliateUrl:
      "https://www.viator.com/tours/Lombok/Day-Trip-Sembalun-Sendang-Gile-Waterfall-Tiu-Kelep-Waterfall/d22869-223745P7?pid=P00303362&mcid=42383&medium=link&campaign=RinjaniSenaruwaterfalls",
  },
  KLOOK_LOMBOK_GILI_BOAT: {
    partner: "klook",
    anchorText: "fast boat to Gili Air",
    affiliateUrl:
      "https://klook.tpx.lu/QYeSR2G9?u=https%3A%2F%2Fwww.klook.com%2Factivity%2F57635-fast-boat-ticket-bali-gili-islands-lombok%2F",
  },
  KLOOK_GILI_SNORKELING: {
    partner: "klook",
    anchorText: "3-island Gili snorkeling tour with turtles",
    affiliateUrl:
      "https://klook.tpx.lu/QYeSR2G9?u=https%3A%2F%2Fwww.klook.com%2Factivity%2F139720-sharing-snorkeling-day-tour-to-3-gilis-from-gili-trawangan%2F",
  },
  "12GO_GILI_TRAWANGAN_BALI": {
    partner: "12go",
    anchorText: "Gili Islands to Bali boat",
    affiliateUrl: "https://12go.asia/?z=16022946",
  },
};
const usedAff = new Set();

// ── Segment helpers ──
// "text"  -> plain span
// ["b", "text"] -> strong
// ["a", "text", "href"] -> external link
// ["aff", "PLACEHOLDER"] -> affiliate ref (anchorText from AFF)
// ["affx", "PLACEHOLDER", "custom anchor"] -> affiliate ref custom anchor
function block(style, segs) {
  const markDefs = [];
  const children = segs.map((seg) => {
    if (typeof seg === "string") {
      return { _type: "span", _key: key("s"), marks: [], text: seg };
    }
    const [t] = seg;
    if (t === "b") {
      return { _type: "span", _key: key("s"), marks: ["strong"], text: seg[1] };
    }
    if (t === "a") {
      const mk = key("ld");
      markDefs.push({
        _key: mk,
        _type: "externalLink",
        href: seg[2],
        blank: seg[2].startsWith("http"),
      });
      return { _type: "span", _key: key("s"), marks: [mk], text: seg[1] };
    }
    if (t === "aff" || t === "affx") {
      const pid = seg[1];
      const text = t === "affx" ? seg[2] : AFF[pid].anchorText;
      usedAff.add(pid);
      const mk = key("af");
      markDefs.push({ _key: mk, _type: "affiliateLinkRef", placeholderId: pid });
      return { _type: "span", _key: key("s"), marks: [mk], text };
    }
    throw new Error("bad seg " + JSON.stringify(seg));
  });
  return { _type: "block", _key: key("b"), style, markDefs, children };
}
const h2 = (t) => block("h2", [t]);
const p = (...segs) => block("normal", segs);

const body = [
  // INTRO is a separate field; body starts at first H2.
  h2("Who this trip is for"),
  p(
    "This is a trip built around one hard physical goal: standing on the 3,726 metre summit of Mount Rinjani at sunrise, then giving your body the days it needs to recover. It suits reasonably fit friends, couples and solo travellers who are happy to camp for two nights, walk for long hours on loose volcanic scree, and start one summit push in the cold dark around 2am. If you train a little before you come and you do not mind being uncomfortable for 72 hours, the reward is large.",
  ),
  p(
    [
      "b",
      "Who this trip is not for. ",
    ],
    "Families with young children, anyone with serious knee or ankle problems who cannot handle a long, steep descent, and travellers who want a comfortable bed every night should pick a different Lombok week. This is also the wrong trip if your dates fall between January and March, when the national park closes for the rainy season and trail recovery. If a relaxed island holiday is what you actually want, our beach-focused Lombok routes will serve you better than this one.",
  ),

  h2("Trip at a glance"),
  p(
    "Seven days, structured as three days of mountain and three days of coast, with a travel day in between. You fly into Lombok, transfer up to the village of Sembalun, then walk the classic three-day, two-night Sembalun to Senaru summit route. After the trek you drop to the coast, cross to Gili Air, and spend two slow days letting your legs recover before flying or boating onward. Expect real effort on the mountain and genuine rest at the end. The trek alone covers roughly 30 kilometres with a big altitude gain and an even bigger descent, so the recovery half of this week is not a luxury, it is part of the plan.",
  ),

  h2("Why this route makes sense"),
  p(
    "Starting from ",
    ["b", "Sembalun"],
    " rather than Senaru is the standard choice for a summit attempt, and for good reason. The Sembalun side opens with a long but gradual walk across savannah to the crater rim, which positions you for the summit push on the second morning without burning your legs on day one. You then descend to ",
    ["b", "Segara Anak"],
    ", the crater lake, with its hot springs, before climbing out to the Senaru rim and down through forest to finish. Walking Sembalun to Senaru means you summit early and end low, which is easier on tired knees than the reverse.",
  ),
  p(
    "Finishing near Senaru also puts you on the right side of the island for the northwest coast and the Gili Islands. We send you to ",
    ["b", "Gili Air"],
    " rather than Gili Trawangan for the recovery half because Air is quieter, flatter to walk, and has calmer evenings, which is what aching legs want. Trawangan is the party island and a poor place to rest a body that has just climbed a volcano.",
  ),

  h2("Day 1: Arrive in Lombok and acclimatise"),
  p(
    ["b", "Morning. "],
    "Fly into Lombok International Airport at Praya. Direct hops from Bali take roughly 45 to 50 minutes, and as a working estimate fares run from about 25 to 35 US dollars one way, though you should confirm current flight routes before locking anything else. Sort connectivity on arrival with an ",
    ["aff", "AIRALO_INDONESIA"],
    " so your guide and operator can reach you, then set up a ",
    ["aff", "VIATOR_LOMBOK_AIRPORT_TRANSFER"],
    " or arrange the pickup through your trekking operator, who can usually collect you from the airport.",
  ),
  p(
    ["b", "Afternoon. "],
    "Base yourself in Senggigi or go straight up to Sembalun village, which sits at around 1,150 metres and helps you start the climb a little acclimatised. Do not plan anything strenuous today. Eat well, drink water, and lay out your gear.",
  ),
  p(
    ["b", "Evening. "],
    "Meet your guide for the pre-trek briefing if your operator runs one tonight. Confirm the wake-up time, the porter arrangement, and what they carry versus what you carry. Repack so your daypack holds only water, layers, sun protection and a headtorch.",
  ),
  p(["b", "Base. "], "Senggigi or Sembalun village."),
  p(
    ["b", "Booking logic. "],
    "Foreign trekkers cannot climb Rinjani independently. You must go with a licensed guide and a registered operator, and the operator handles your park permit through the e-Rinjani system. Book the trek weeks ahead in peak season, not on arrival.",
  ),
  p(
    ["b", "Travel note. "],
    "If you would rather not rush, fly in a day earlier. A jammed same-day arrival followed by a 2am summit start two nights later leaves no slack if a flight slips.",
  ),

  h2("Day 2: Sembalun to the crater rim"),
  p(
    ["b", "Morning. "],
    "An early start and a drive to the Sembalun trailhead. The first stretch crosses open grassland with the cone of Rinjani ahead of you. It is long rather than steep, and the heat across the savannah is the main challenge of the morning, so pace yourself and keep drinking.",
  ),
  p(
    ["b", "Afternoon. "],
    "The trail tilts upward for the climb to the Sembalun crater rim at roughly 2,640 metres. This is where most people first feel the altitude and the weight of the day. Take it slowly. Your porters will usually reach camp well ahead of you and have tents and tea ready.",
  ),
  p(
    ["b", "Evening. "],
    "Camp on the rim with the crater lake below and the summit cone above. It gets genuinely cold up here after dark, often near freezing in peak season. Eat, layer up, and sleep early, because the summit push starts in the small hours.",
  ),
  p(["b", "Base. "], "Sembalun crater rim camp (tent)."),
  p(
    ["b", "Travel note. "],
    "Temperatures at the rim can drop close to zero overnight. A warm layer, a hat and gloves are not optional, and a sleeping bag rated for the cold makes the difference between resting and shivering. Check what your operator provides before you pack.",
  ),

  h2("Day 3: Rinjani summit, then down to Segara Anak lake"),
  p(
    ["b", "Morning. "],
    "The summit push begins around 2am. The final ridge is loose volcanic scree where you slide back with every step, and it is slow, cold and steep. Reaching the 3,726 metre summit for sunrise, with the caldera and the sea spread out below, is the hardest and best hour of the week. Turn-around discipline matters here, so follow your guide on timing.",
  ),
  p(
    ["b", "Afternoon. "],
    "Descend back to the rim camp for breakfast, then drop steeply into the caldera to Segara Anak lake at around 2,000 metres. The hot springs near the lake are the reward, and soaking tired legs in them is the single best thing you can do for the next day's walk.",
  ),
  p(
    ["b", "Evening. "],
    "Camp by the lake. It is lower, warmer and calmer than the rim, and after a 2am start you will sleep hard.",
  ),
  p(["b", "Base. "], "Segara Anak lakeside camp (tent)."),
  p(
    ["b", "Booking logic. "],
    "If a full summit attempt sounds like too much, say so when you book. Many operators run a two-day, one-night version to the crater rim that skips the summit, which is a sensible choice if you are unsure of your fitness.",
  ),

  h2("Day 4: Lake to Senaru, then down to the coast"),
  p(
    ["b", "Morning. "],
    "The final climb out of the caldera to the Senaru rim is short but steep on legs that are already spent. After that it is downhill the rest of the way, first across the rim and then into cooler forest as you lose altitude toward Senaru village.",
  ),
  p(
    ["b", "Afternoon. "],
    "The long descent through the trees is hard on knees, so trekking poles earn their keep here. Most groups reach the Senaru gate by early afternoon. Your operator drops you onward from there, usually to Senggigi or to a port for the Gili crossing.",
  ),
  p(
    ["b", "Evening. "],
    "Get to a real bed on the coast and do nothing. You have earned it. If your legs still object in the morning, the gentle ",
    ["aff", "VIATOR_SENARU_WATERFALLS"],
    " near Senaru is an easy way to loosen them up, but it is just as valid to skip it entirely.",
  ),
  p(["b", "Base. "], "Senggigi or Senaru area."),
  p(
    ["b", "Travel note. "],
    "The Senaru descent is where most trekking injuries actually happen, not on the summit. Go slow, use poles, and do not race the group ahead of you down the steep forest section.",
  ),

  h2("Day 5: Recover and cross to Gili Air"),
  p(
    ["b", "Morning. "],
    "A slow start. Eat properly, stretch, and make your way to the harbour for the short hop across to Gili Air. A ",
    ["aff", "KLOOK_LOMBOK_GILI_BOAT"],
    " from the northwest coast is quick, and the public boat from Bangsal is cheaper if you are not in a hurry.",
  ),
  p(
    ["b", "Afternoon. "],
    "Gili Air has no cars or motorbikes, so the pace drops the moment you land. Find your guesthouse, then do very little. Float in the shallows, eat, and let the trek settle into a good memory rather than a sore one.",
  ),
  p(
    ["b", "Evening. "],
    "Watch the sunset toward Bali with Mount Agung on the horizon. This is the payoff for three days on the mountain.",
  ),
  p(["b", "Base. "], "Gili Air."),
  p(
    ["b", "Booking logic. "],
    "Keep Gili accommodation flexible until you know how your trek timing lands. You can comfortably book it a day or two out, and prices are better than the airport-transfer-and-resort bundles sold in advance.",
  ),

  h2("Day 6: Gili Air, snorkelling and rest"),
  p(
    ["b", "Morning. "],
    "If your body is ready for gentle movement, the reefs off the Gilis are easy snorkelling, and a ",
    ["aff", "KLOOK_GILI_SNORKELING"],
    " loops the three islands with a good chance of seeing green turtles. If you would rather not move at all, that is a perfectly good plan too.",
  ),
  p(
    ["b", "Afternoon. "],
    "Walk the full loop of Gili Air on foot, which takes a couple of easy hours, or rent a bicycle. The east side has the best swimming and the quietest beach bars.",
  ),
  p(
    ["b", "Evening. "],
    "A long dinner and an early night. You will feel the trek in your legs for a few days, and that is normal.",
  ),
  p(["b", "Base. "], "Gili Air."),

  h2("Day 7: Gili Air to Bali or onward"),
  p(
    ["b", "Morning. "],
    "Catch a morning boat. A ",
    ["aff", "12GO_GILI_TRAWANGAN_BALI"],
    " runs across to several Bali ports, and as a working estimate fast boats cost roughly 23 to 42 US dollars and take between 1.5 and 3.5 hours depending on the operator and the port. Confirm the current schedule the day before, because sea conditions can move departures.",
  ),
  p(
    ["b", "Afternoon. "],
    "Connect to your onward flight from Bali, or fly directly out of Lombok if that suits your route better. Build in a buffer either way, since a missed boat or a delayed transfer should not put your international flight at risk.",
  ),
  p(["b", "Base. "], "In transit."),
  p(
    ["b", "Travel note. "],
    "Do not book an international departure for the same evening you leave Gili Air. Give yourself a night in Bali or near the airport. Boats are weather-dependent and a tight connection here is a needless gamble.",
  ),

  h2("What to book early, and what to keep flexible"),
  p(
    ["b", "Book early. "],
    "The trek itself comes first. Choose a licensed operator, confirm your guide and porter arrangement, and let them secure your park permit through the e-Rinjani system, which now also requires you to hold valid travel insurance for the climb. In peak season from July to August, both operators and the best summit-season dates fill up, so book weeks ahead. Lock your Lombok flights at the same time.",
  ),
  p(
    ["b", "Keep flexible. "],
    "Gili Air accommodation, snorkelling and the return boat to Bali can all wait until you are on the ground. Trek timing can shift by half a day, and you do not want a non-refundable resort booking forcing you off the mountain early.",
  ),

  h2("Mistakes travellers make on this route"),
  p(
    ["b", "Climbing in the closed season. "],
    "The park shuts from 1 January to 31 March each year for the rainy season and trail recovery, and reopened on 1 April for 2026. As a working estimate the reliable trekking window is May to October, with the clearest summit mornings from May to early October. Check the latest official guidance before you set your dates, because the closure window can move.",
  ),
  p(
    ["b", "Leaving no recovery time. "],
    "Bolting a summit trek onto a packed beach holiday is the classic error. A three-day climb wrecks your legs, and the two coast days here exist for a reason. Cutting them turns a good week into a miserable one.",
  ),
  p(
    ["b", "Underestimating the cold and the scree. "],
    "People picture a tropical island and pack for the beach. The rim camp can sit near freezing, and the summit ridge is loose volcanic gravel that doubles the effort. Warm layers and decent footwear are the difference between finishing and turning back.",
  ),
  p(
    ["b", "Choosing the cheapest operator. "],
    "The lowest quote often means thin food, worn tents and an overloaded porter. On a mountain this serious, the operator is not where to economise. Pay for a fair porter ratio and proper equipment.",
  ),

  h2("What to cut, adapt or upgrade"),
  p(
    ["b", "Cut the summit. "],
    "If you are not confident in your fitness, drop to the two-day, one-night route to the Sembalun crater rim. You still get the savannah walk, the rim camp and the view down to the lake, without the brutal pre-dawn scree. It is the honest choice for many travellers and there is no shame in it.",
  ),
  p(
    ["b", "Adapt the start. "],
    "Tight on time? Some operators run a shorter Senaru-side itinerary, though it makes the summit harder and is less commonly recommended. The Sembalun-start, three-day route in this plan remains the best balance of effort and reward for most fit trekkers.",
  ),
  p(
    ["b", "Upgrade the support. "],
    "If you want the climb to feel less punishing, pay for a private trek, a better porter-to-trekker ratio, and quality sleeping kit. It does not make the mountain shorter, but it makes every camp warmer and every meal better, which matters more than you expect on day three.",
  ),

  h2("Before you build this trip"),
  p(
    ["b", "Permits and the guide rule. "],
    "Foreign nationals must trek with a licensed guide and a registered operator. Independent climbing is not permitted, and the operator arranges your permit through the e-Rinjani system. As a working estimate the national park entrance fee runs around 250,000 rupiah per person per day for the main Sembalun and Senaru routes, though fees can change, so treat any figure your operator quotes as the current one.",
  ),
  p(
    ["b", "Insurance is now required. "],
    "For the 2026 season the park introduced a rule that all trekkers must hold valid travel insurance to enter. Buy a policy that explicitly covers high-altitude trekking, since standard travel cover often excludes it. Confirm the latest official requirement before you travel.",
  ),
  p(
    ["b", "Fitness and gear. "],
    "Train with hills and stairs in the weeks before you come. Bring or rent proper hiking boots, trekking poles, a warm layer, a windproof jacket, a headtorch and a cold-rated sleeping bag. Ask your operator exactly what they supply so you are not carrying or missing anything.",
  ),
  p(
    ["b", "Visa. "],
    "Most visitors enter Indonesia on a visa on arrival, valid for 30 days and extendable once. As a working estimate it costs around 500,000 rupiah, but confirm the current fee and your eligibility before you fly.",
  ),

  h2("Final verdict"),
  p(
    "Rinjani is not a casual side trip and this plan does not pretend otherwise. It is a hard three-day climb that asks for fitness, a cold night near the summit, and respect for a real mountain. Build it the way this week is built, with the days the climb needs and two genuine recovery days on Gili Air at the end, and it is one of the most rewarding weeks Indonesia offers a fit traveller. Try to shortcut the recovery or climb in the wrong season, and the same mountain will hand you a week you would rather forget. Come fit, come in the open season, and let the trek be the whole point.",
  ),

  h2("Related itineraries"),
  p(
    "If the trek sounds like more than you want, the gentler ",
    ["a", "7 days in Lombok and the Gili Islands", "/trips/7-days-lombok-gili-islands"],
    " keeps the beaches and skips the summit. Travelling with children, see ",
    ["a", "10 days in Lombok and the Gilis for families", "/trips/10-days-lombok-gili-families"],
    ". For the full picture of the region, including when to go and how to move around, start with our ",
    ["a", "Lombok and Gili Islands destination guide", "/destinations/lombok-gili"],
    ".",
  ),
];

const intro =
  "Most Lombok itineraries treat Mount Rinjani as an optional side quest. This plan treats it as the whole point. Rinjani is a hard, cold, three-day climb to a 3,726 metre summit, and the biggest mistake travellers make is bolting it onto a beach holiday with no time to recover. This 7-day route does the opposite: it gives the mountain the days it needs, then sends you to Gili Air to let your legs forgive you. If you are reasonably fit and willing to suffer through one pre-dawn summit push, this is one of the most satisfying weeks in Indonesia. If you want a relaxed island week, book a different trip.";

const faq = [
  {
    question: "How fit do I need to be to climb Mount Rinjani?",
    answer:
      "Reasonably fit, with some hill or stair training behind you. The three-day summit route covers roughly 30 kilometres with a large altitude gain and a long, steep descent, plus a pre-dawn summit push on loose scree. You do not need to be an athlete, but you do need stamina and healthy knees. If you are unsure, the two-day route to the crater rim skips the summit and is a sensible alternative.",
  },
  {
    question: "When is Mount Rinjani open, and when is the best time to trek?",
    answer:
      "The national park closes each year from 1 January to 31 March for the rainy season and trail recovery, and it reopened on 1 April for the 2026 season. As a working estimate the reliable trekking window is May to October, with the clearest summit mornings from May to early October. Closure dates can shift, so check the latest official guidance before booking flights.",
  },
  {
    question: "Can I climb Rinjani without a guide?",
    answer:
      "No. Foreign trekkers must climb with a licensed guide and a registered operator, and independent climbing is not permitted. The operator arranges your park permit through the e-Rinjani system. As a working estimate the park entrance fee is around 250,000 rupiah per person per day for the main routes, though fees can change.",
  },
  {
    question: "Do I need travel insurance to trek Mount Rinjani?",
    answer:
      "Yes. For the 2026 season the park introduced a rule that all trekkers must hold valid travel insurance to enter. Buy a policy that specifically covers high-altitude trekking, since standard travel cover often excludes it. Confirm the current requirement with your operator before you travel.",
  },
  {
    question: "Should I start the trek from Sembalun or Senaru?",
    answer:
      "Sembalun is the standard start for a summit attempt. It opens with a gradual savannah walk to the crater rim, sets you up for the summit on the second morning, and lets you finish with a long descent to Senaru, which is easier on tired knees than the reverse. The three-day Sembalun to Senaru route is the one most fit trekkers should choose.",
  },
  {
    question: "How do I get from the trek to the Gili Islands?",
    answer:
      "Most operators drop you on the northwest coast after the descent at Senaru. From there a fast boat reaches Gili Air in a short crossing, or the public boat from Bangsal harbour is cheaper if you are not in a hurry. We send recovering trekkers to Gili Air rather than Gili Trawangan because it is quieter and flatter to walk.",
  },
];

const now = new Date().toISOString();

const affiliateLinks = [...usedAff].map((pid) => ({
  _key: key("aff"),
  placeholderId: pid,
  partner: AFF[pid].partner,
  anchorText: AFF[pid].anchorText,
  affiliateUrl: AFF[pid].affiliateUrl,
  linkStatus: "active",
}));

const doc = {
  _id: `itinerary-${SLUG}`,
  _type: "article",
  contentStatus: "draft",
  title: "7 Days in Lombok: Mount Rinjani Trek and Gili Air Recovery",
  slug: { _type: "slug", current: SLUG },
  metaTitle: "7 Days in Lombok: Mount Rinjani Trek + Gili Recovery",
  metaDescription:
    "Climb Mount Rinjani on the 3-day Sembalun to Senaru summit route, then recover on Gili Air. A realistic 7-day Lombok plan with permits, timing and cost.",
  focusKeyword: "Mount Rinjani trek itinerary",
  intro,
  route:
    "Lombok (Senggigi) → Sembalun → Mount Rinjani Summit → Segara Anak Lake → Senaru → Gili Air",
  destinationPrimary: "lombok_gili",
  travelStylePrimary: "adventure_volcanoes",
  travelStyleSecondary: ["beach_islands"],
  travellerTypes: ["friends", "solo_travellers", "couples"],
  vibe: "active",
  tripLengthBucket: "one_week",
  tripLengthDays: 7,
  experienceTags: ["mount-rinjani", "volcano-trek", "summit-hike", "gili-air"],
  bestSeason: "May to October",
  articleCreatedDate: now,
  author: { _type: "reference", _ref: "author-editorial-team" },
  faq,
  body,
  affiliateLinks,
};

// ── VALIDATION ──
const errs = [];
const json = JSON.stringify(doc);

// em-dashes
if (/[—–]/.test(json)) errs.push("em/en-dash present");

// banned phrases
const banned = [
  "hidden gem", "must-see", "must see", "paradise", "immerse yourself",
  "unforgettable", "something for everyone", "vibrant culture",
  "crystal-clear", "crystal clear", "breathtaking", "rich history",
  "local charm", "authentic experience", "off the beaten path",
  "once-in-a-lifetime", "bucket list", "dream destination",
];
const lc = json.toLowerCase();
for (const b of banned) if (lc.includes(b)) errs.push(`banned phrase: ${b}`);

// artifacts
if (/\(SEARCH/i.test(json)) errs.push("(SEARCH artifact");
if (/\d+\s+reviews/i.test(json)) errs.push("reviews-count artifact");

// meta lengths
if (doc.metaTitle.length > 60) errs.push(`metaTitle ${doc.metaTitle.length}>60`);
if (doc.metaDescription.length > 155)
  errs.push(`metaDescription ${doc.metaDescription.length}>155`);

// unique keys
const keys = [];
const collect = (o) => {
  if (Array.isArray(o)) o.forEach(collect);
  else if (o && typeof o === "object") {
    if (o._key) keys.push(o._key);
    Object.values(o).forEach(collect);
  }
};
collect(doc);
const dupe = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dupe.length) errs.push(`dupe keys: ${[...new Set(dupe)].join(",")}`);

// affiliate ref <-> affiliateLinks parity
const refPids = new Set();
collect; // noop
const walkRefs = (o) => {
  if (Array.isArray(o)) o.forEach(walkRefs);
  else if (o && typeof o === "object") {
    if (o._type === "affiliateLinkRef" && o.placeholderId)
      refPids.add(o.placeholderId);
    Object.values(o).forEach(walkRefs);
  }
};
walkRefs(doc);
const linkPids = new Set(affiliateLinks.map((l) => l.placeholderId));
for (const pid of refPids)
  if (!linkPids.has(pid)) errs.push(`ref ${pid} missing in affiliateLinks`);
for (const pid of linkPids)
  if (!refPids.has(pid)) errs.push(`affiliateLink ${pid} unused in body`);

// day headings
const dayH2 = body
  .filter((b) => b.style === "h2" && b.children[0].text.startsWith("Day "))
  .map((b) => b.children[0].text);
dayH2.forEach((t) => {
  if (!/^Day \d+:/.test(t)) errs.push(`bad day heading: ${t}`);
});

const wordCount = body
  .flatMap((b) => b.children.map((c) => c.text))
  .join(" ")
  .split(/\s+/).length;

console.log("metaTitle len:", doc.metaTitle.length);
console.log("metaDescription len:", doc.metaDescription.length);
console.log("body blocks:", body.length, "| h2:", body.filter((b) => b.style === "h2").length);
console.log("day headings:", dayH2.length);
console.log("affiliate links:", [...linkPids].join(", "));
console.log("approx body words:", wordCount);
console.log("keys total:", keys.length, "unique:", new Set(keys).size);

if (errs.length) {
  console.error("\nVALIDATION FAILED:");
  errs.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("\nVALIDATION PASSED");

writeFileSync(
  new URL(`../content/articles/${SLUG}.json`, import.meta.url),
  JSON.stringify(doc, null, 2),
);
console.log(`Wrote content/articles/${SLUG}.json`);
