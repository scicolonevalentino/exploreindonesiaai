// One-off: enrich 3 thin itineraries by INSERTING one extra detail paragraph per
// day (before that day's "WHERE TO STAY" block, else at the end of the day).
// Never edits existing blocks, so all inline affiliate links are preserved.
// Usage: node scripts/enrich-thin-trips.mjs [--commit]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMMIT = process.argv.includes("--commit");
const API = "https://u4ah1ore.api.sanity.io/v2021-06-07";
const DS = "production";
const TOKEN = (readFileSync(join(ROOT, ".env.local"), "utf8").match(/^SANITY_API_WRITE_TOKEN=(.+)$/m) || [])[1]?.trim();
if (!TOKEN) { console.error("No SANITY_API_WRITE_TOKEN"); process.exit(1); }

const ENRICH = {
  "5-days-bali-ubud-canggu-uluwatu": {
    1: "The drive from the airport to Ubud takes about 1.5 hours in normal traffic and up to two and a half in the late afternoon, so if you land late, eat near your hotel and save sightseeing for the morning. Central Ubud is easy on foot — Jalan Bisma and the Campuhan Ridge Walk are both a short stroll, and a slow walk along the ridge at dusk is a gentle way to shake off the flight.",
    2: "Start early to beat both the heat and the tour buses — Tegalalang's terraces and the Monkey Forest are calmest before 9am. Entry fees are small (a few dollars each), and at Tirta Empul you can join the holy-spring purification ritual if you bring a sarong and a change of clothes. Keep a hand on sunglasses and snacks around the macaques in the Monkey Forest; they are bold and quick.",
    3: "The Batur trek means a roughly 2am pickup and about a two-hour climb in the dark to reach the summit for sunrise over the lake and caldera — it's cold at the top, so bring a layer. You'll be back in Ubud by mid-morning, and the drive on to Canggu takes about 1 to 1.5 hours. Once there, Batu Bolong and Echo Beach are the classic spots for a first sunset drink.",
    4: "Uluwatu is about a 1 to 1.5 hour drive south of Canggu. Time your arrival for the late afternoon: the Kecak fire dance at the clifftop temple starts around 6pm as the sun drops behind the sea, and tickets sell out, so book ahead. Watch your belongings near the temple's resident monkeys, which are notorious for snatching glasses and phones from distracted visitors.",
    5: "Uluwatu is only about 30 to 45 minutes from the airport, so a relaxed final morning is easy. If you didn't pay the IDR 150,000 (about US$10) Bali tourist levy on arrival, settle it online before you leave to skip the queue, and build in buffer time for check-in on busy afternoon and evening flights.",
  },
  "5-days-labuan-bajo-komodo": {
    1: "Labuan Bajo's airport is only about ten minutes from the harbour, so you'll have time to settle in. Use the first evening to confirm your Komodo boat trip and check that your operator arranges the park permits and pre-booking for you. The hilltop bars and viewpoints above town are the local favourites for a first sunset over the bay.",
    2: "Budget for the 2026 park fees — around IDR 650,000 per person for the Komodo Island route, or IDR 900,000 for routes taking in Rinca and Padar — and note that from April 2026 every visitor must be pre-booked through the SiORA app or a licensed operator, with a 1,000-per-day cap. Beyond the dragons, a classic day takes in the Padar viewpoint at first light, snorkelling at Pink Beach and Manta Point, and the Taka Makassar sandbar. Go early, when the light and the seas are best.",
    3: "Rangko Cave is a tidal saltwater pool inside a limestone cavern, reached by a short boat ride south of town — aim for around midday, when sunlight beams through the opening onto the turquoise water. If you'd rather stay on land, the Cunca Wulang canyon and waterfall make a good half-day. Either way, keep the pace gentle to recover from the long park day.",
    4: "If you have the appetite for more water, a second boat day to the closer northern islands — Kanawa, Kelor, Sebayur — gives easy snorkelling and quiet beaches without another dawn start, and Komodo's dive sites (Batu Bolong, Castle Rock, Manta Alley) are world-class if you're certified. Prefer to slow down? Most harbour hotels have pools with sunset views, and a spa afternoon is a fair reward after the park.",
    5: "The airport's closeness makes the last morning easy, but Labuan Bajo's single terminal gets busy at peak times, so allow a comfortable buffer. With a later flight, a final harbour breakfast or a quick stop for handwoven Manggarai textiles rounds off the trip nicely.",
  },
  "7-days-yogyakarta-east-java": {
    1: "Yogyakarta's main airport (YIA) is about an hour west of the city, so factor in the transfer. If you arrive with energy, Malioboro Street is the place for an evening wander — street food, batik stalls and becak (cycle-rickshaw) rides — and a first taste of gudeg, the sweet jackfruit stew the city is famous for, is a fitting welcome to Java.",
    2: "Budget around IDR 455,000 for Borobudur and IDR 400,000 for Prambanan for foreign visitors; the old combined ticket was discontinued in 2025, so buy each separately. Access onto Borobudur's upper terraces is now capped and timed (a separate, pricier ticket) to protect the stone, so book ahead if you want to climb. Go early — both sites are far more pleasant before the midday heat.",
    3: "The Kraton and Taman Sari open mornings only and close in the early afternoon, so tackle them first; both are compact and walkable. A batik workshop is one of Yogyakarta's most rewarding few hours — you make a small piece to take home and learn to tell hand-drawn batik tulis from printed copies before you shop. Keep the evening easy ahead of the long transfer to Bromo.",
    4: "Plan this as a full transfer day. Most travellers take a train from Yogyakarta toward Probolinggo or Malang and continue by car and jeep to the crater-rim villages, or go door-to-door by private car in roughly 8 to 10 hours. Aim to sleep in Cemoro Lawang on the rim itself — it's cold at altitude, around 5–10°C before dawn, so pack warm layers, a hat and gloves you won't regret.",
    5: "The standard plan is a 3:30am jeep to the Penanjakan-area viewpoint for sunrise over the caldera, then down across the Sea of Sand to climb the steps to Bromo's smoking crater rim — wear a mask or buff for the volcanic dust. By late morning you'll begin the 5 to 6 hour transfer east toward the Ijen area near Banyuwangi, which is why the rest of the day stays simple.",
    6: "Ijen's entrance fee is modest (roughly IDR 100,000–150,000). To see the electric-blue flames you start the hike around 1 to 2am — about a 1.5 hour climb to the rim, then a steep optional descent into the crater where guides provide gas masks for the sulphur fumes. As dawn breaks, the turquoise acid lake and the sulphur miners hauling their baskets are unforgettable. Dress warmly and bring a head torch.",
    7: "From Banyuwangi, the Ketapang–Gilimanuk ferry to Bali runs around the clock and the crossing itself takes under an hour, though loading and the time difference (Bali is an hour ahead) add up — book via 12Go and allow a buffer. Prefer to fly or take the train onward? Banyuwangi has both an airport and a station with connections west across Java.",
  },
};

const txt = (b) => (b?.children || []).map((c) => c.text || "").join("");
const blk = (text, slug, day) => ({ _type: "block", _key: `enr-${slug}-${day}`, style: "normal", markDefs: [],
  children: [{ _type: "span", _key: `enrs-${slug}-${day}`, text, marks: [] }] });

async function q(query) {
  const r = await fetch(`${API}/data/query/${DS}?query=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json(); if (j.error) throw new Error(JSON.stringify(j.error)); return j.result;
}

const mutations = [];
for (const [slug, byDay] of Object.entries(ENRICH)) {
  const doc = await q(`*[_type=="article" && slug.current=="${slug}"][0]{_id, body}`);
  const body = doc.body;
  const h2idx = body.map((b, i) => (b.style === "h2" ? i : -1)).filter((i) => i >= 0);
  const inserts = []; // {at, block}
  for (let k = 0; k < h2idx.length; k++) {
    const i = h2idx[k];
    const m = txt(body[i]).match(/^Day\s+(\d+)\b/i);
    if (!m) continue;
    const day = Number(m[1]);
    if (!byDay[day]) continue;
    const sectionEnd = k + 1 < h2idx.length ? h2idx[k + 1] : body.length;
    let at = sectionEnd;
    for (let j = i + 1; j < sectionEnd; j++) {
      if (txt(body[j]).startsWith("WHERE TO STAY")) { at = j; break; }
    }
    inserts.push({ at, day, block: blk(byDay[day], slug, day) });
  }
  // apply high->low so indices stay valid
  const next = body.slice();
  inserts.sort((a, b) => b.at - a.at).forEach((ins) => next.splice(ins.at, 0, ins.block));
  const before = body.reduce((n, b) => n + (b._type === "block" ? txt(b).trim().split(/\s+/).filter(Boolean).length : 0), 0);
  const after = next.reduce((n, b) => n + (b._type === "block" ? txt(b).trim().split(/\s+/).filter(Boolean).length : 0), 0);
  console.log(`\n${slug}: inserted ${inserts.length} day paragraphs  (~${before} -> ~${after} words)`);
  inserts.sort((a, b) => a.day - b.day).forEach((ins) => console.log(`  + Day ${ins.day}`));
  mutations.push({ patch: { id: doc._id, set: { body: next } } });
}

if (!COMMIT) { console.log("\nDRY RUN — no writes. Re-run with --commit."); process.exit(0); }
const r = await fetch(`${API}/data/mutate/${DS}`, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ mutations }) });
const j = await r.json(); if (j.error) throw new Error(JSON.stringify(j.error));
console.log(`\n✓ committed ${j.results?.length ?? mutations.length} article(s)`);
