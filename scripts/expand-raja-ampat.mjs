// One-off: expand the 14-day Raja Ampat itinerary's collapsed "Days 3–13" block
// into a real day-by-day (Days 3–13), grounded in researched dive sites/logistics.
// Replaces the blocks from the "Days 3–13" H2 up to (not incl.) the "Day 14" H2.
// Usage: node scripts/expand-raja-ampat.mjs [--commit]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMMIT = process.argv.includes("--commit");
const API = "https://u4ah1ore.api.sanity.io/v2021-06-07";
const DS = "production";
const SLUG = "14-days-raja-ampat-divers";
const TOKEN = (readFileSync(join(ROOT, ".env.local"), "utf8").match(/^SANITY_API_WRITE_TOKEN=(.+)$/m) || [])[1]?.trim();
if (!TOKEN) { console.error("No SANITY_API_WRITE_TOKEN"); process.exit(1); }

// [style, text] — h2 = day heading, normal = paragraph. Plain prose (Raja Ampat
// activities are arranged locally, not bookable on global platforms).
const NEW = [
  ["h2", "Day 3: Cape Kri and your house reef"],
  ["normal", "With permits sorted and gear checked, ease into the diving on home turf. Cape Kri, a short boat ride from most Kri and Mansuar lodges, holds the world record for the most fish species counted on a single dive — expect walls of snapper and fusilier, trevally, batfish, reef sharks and turtles riding the current. Your guide will time the dive to the tide, because the current is exactly what brings the spectacle. Non-divers can snorkel the same reef edges or the shallow sandbar between Kri and Mansuar, where blacktip reef sharks patrol at dusk."],
  ["h2", "Day 4: Manta Sandy and Arborek village"],
  ["normal", "Spend the morning at Manta Sandy, a shallow cleaning station where reef mantas queue over the sand to be groomed by cleaner wrasse. Divers settle behind a rope line and watch them circle overhead, while snorkellers can often see them from the surface. Mantas pass year-round, peaking from December to February. In the afternoon, stop at Arborek, one of Raja Ampat's friendliest villages — the snorkelling under its wooden jetty (giant clams, schooling jackfish, squid and soft coral) is some of the easiest, richest in-water time in the region, and a woven hat or a meal bought here supports the community directly."],
  ["h2", "Day 5: Blue Magic and Sardine Reef"],
  ["normal", "Two of the Dampier Strait's signature dives. Blue Magic is a current-swept seamount that pulls in pelagics — oceanic and reef mantas, schooling barracuda, giant trevally and, with luck, a wobbegong shark draped over the coral. Sardine Reef, despite the name, is simply one of the fishiest sites in Raja Ampat, with bait balls dense enough to dim the light. Both are current dives scheduled around slack tide, so listen carefully to your guide's briefing. On the same day, snorkellers are better served on the calmer reef tops nearby."],
  ["h2", "Day 6: Piaynemo viewpoint and Fam snorkelling"],
  ["normal", "Today is the classic Raja Ampat postcard. It's a longer run — roughly 90 minutes by speedboat from the Gam and Arborek area — out to Piaynemo, where a wooden staircase climbs to a viewpoint over a maze of jade lagoons and mushroom-shaped karst islets. Go early to beat the day-boats and the heat. On the way back, most trips snorkel Melissa's Garden in the nearby Fam islands, a shallow coral garden in dazzling visibility. It's a full day on the water, so bring sun protection, water and a dry bag."],
  ["h2", "Day 7: A slow day on your island"],
  ["normal", "Raja Ampat rewards a slower rhythm, and after several days of diving a rest day is sensible — both for off-gassing nitrogen and for soaking up where you actually are. Swim or freedive the house reef, paddle a kayak through the mangrove channels at high tide, read in a hammock over the water, and watch for hornbills crossing at dusk. If you're restless, ask your lodge about a gentle local snorkel or a sunset boat. Days like this are when the place gets under your skin."],
  ["h2", "Day 8: Red bird of paradise at dawn"],
  ["normal", "Set an early alarm for one of Raja Ampat's great land experiences. Before sunrise a boat drops you near Sawinggrai or a display tree on Gam, and a guide leads a short trek — around 30 minutes — to a hide beneath the canopy. From roughly 6:00 to 7:30am the male red birds of paradise perform their shimmering, flailing courtship display in the treetops. It takes patience and a little luck, but it is unforgettable. You're back at the lodge for a late breakfast, with an easy afternoon dive or snorkel to follow."],
  ["h2", "Day 9: Mike's Point and Chicken Reef"],
  ["normal", "An adventurous current day for divers. Mike's Point has some of the strongest flow in Raja Ampat, with crevices and overhangs sculpted by the tides and macro life tucked into every ledge — a site for confident divers on the right tide. Nearby Chicken Reef is an underrated favourite: reef sharks cruising the blue, turtles, schooling snapper and wobbegongs hiding under the coral shelves. Non-divers can spend the day on Friwen Wall, a sheer, soft-coral-draped reef close to Gam that drops straight from the surface — ideal for snorkelling."],
  ["h2", "Day 10: Gam Island, mangroves and reefs"],
  ["normal", "Devote a day to Gam. Snorkel or dive the reefs off Yenbuba and Yenkoranu, then have your boatman take you into the mangrove channels — at the right tide you drift over hard and soft coral growing right up to the mangrove roots, a rare sight anywhere on earth. Birdwatchers can look for hornbills, cockatoos and Raja Ampat's forest endemics along the fringe. Keep the afternoon gentle; the pleasure of Gam is how little you have to do."],
  ["h2", "Day 11: Back to your favourite sites"],
  ["normal", "By now you'll have a shortlist. Use today to repeat the dives that stole the show — a second pass at Cape Kri or Sardine Reef almost always turns up something the first missed, since conditions shift with every tide. It's also a good window to chase a specific encounter: another manta morning at Manta Sandy, a hunt for pygmy seahorses and wobbegongs with a sharp-eyed guide, or a relaxed photography dive on the house reef. Snorkellers can ask to return to Arborek's jetty for one more drift among the clams and jackfish."],
  ["h2", "Day 12: Sawandarek village and Yenbuba jetty"],
  ["normal", "Pair culture with easy water time. Sawandarek is a tidy Mansuar village where you can walk among stilted houses, glimpse everyday island life, and snorkel another superb jetty — giant clams the size of armchairs, turtles grazing the seagrass, and clouds of fish under the pilings. Take time to talk with people; community-run tourism is a big part of what keeps Raja Ampat's reefs protected, and your village fee goes straight back home. A short hop away, the Yenbuba drop-off is another reliable turtle and reef-shark snorkel."],
  ["h2", "Day 13: A last slow morning in the islands"],
  ["normal", "Make the most of your final full day. Fit in one last dive or a long snorkel over the house reef, settle your bill, and thank the family or crew who've looked after you. Spend the afternoon doing very little — a sandbar swim, a last sunset, photographs of the karst from the water — then charge cameras and pack a dry bag for tomorrow's transfers, keeping some cash aside for the boat and ferry. Note that Wayag and Aljui Bay, the far-north karst seascapes, have been closed to visitors since 2025; if they reopen, they deserve a dedicated multi-day trip rather than a rushed add-on."],
];

function blk(style, text, i) {
  return { _type: "block", _key: `ra2-${i}`, style, markDefs: [],
    children: [{ _type: "span", _key: `ra2s-${i}`, text, marks: [] }] };
}
const newBlocks = NEW.map(([s, t], i) => blk(s, t, i));

async function q(query) {
  const r = await fetch(`${API}/data/query/${DS}?query=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json(); if (j.error) throw new Error(JSON.stringify(j.error)); return j.result;
}
const doc = await q(`*[_type=="article" && slug.current=="${SLUG}"][0]{_id, body}`);
const body = doc.body;
const txt = (b) => (b?.children || []).map((c) => c.text || "").join("");
const start = body.findIndex((b) => b.style === "h2" && /^days?\s*3/i.test(txt(b)));
const end = body.findIndex((b) => b.style === "h2" && /^day\s*14/i.test(txt(b)));
if (start < 0 || end < 0 || end <= start) { console.error("anchor blocks not found", { start, end }); process.exit(1); }

const removed = body.slice(start, end);
const next = [...body.slice(0, start), ...newBlocks, ...body.slice(end)];

console.log(`Removing ${removed.length} blocks (the collapsed Days 3–13):`);
removed.forEach((b) => console.log(`  - [${b.style}] ${txt(b).slice(0, 70)}`));
console.log(`\nInserting ${newBlocks.length} blocks (Days 3–13 expanded):`);
newBlocks.filter((b) => b.style === "h2").forEach((b) => console.log(`  + ${txt(b)}`));
const words = next.reduce((n, b) => n + (b._type === "block" ? txt(b).trim().split(/\s+/).filter(Boolean).length : 0), 0);
const dayHeads = next.filter((b) => b.style === "h2" && /^days?\s*\d/i.test(txt(b))).length;
console.log(`\nResult: ${next.length} blocks, ~${words} words, ${dayHeads} day headings (was 3 → now ${dayHeads}).`);

if (!COMMIT) { console.log("\nDRY RUN — no writes. Re-run with --commit."); process.exit(0); }
const r = await fetch(`${API}/data/mutate/${DS}`, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ mutations: [{ patch: { id: doc._id, set: { body: next } } }] }) });
const j = await r.json(); if (j.error) throw new Error(JSON.stringify(j.error));
console.log("\n✓ committed — body updated");
