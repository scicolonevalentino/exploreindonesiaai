#!/usr/bin/env python3
"""Build + validate the Nusa Penida & Lembongan draft article, write JSON snapshot."""
import json, re, sys

SLUG = "5-days-nusa-penida-lembongan"

# ---- key generator ----
_n = {"v": 0}
def k():
    _n["v"] += 1
    return f"k{_n['v']}"

# ---- affiliate registry ----
KLOOK_LEMBONGAN = ("https://klook.tpx.lu/QYeSR2G9?u="
    "https%3A%2F%2Fwww.klook.com%2Factivity%2F21676-nusa-lembongan-ceningan-tour-bali%2F")

AFFILIATES = [
    {
        "_key": k(), "_type": "affiliateLink",
        "placeholderId": "AIRALO_INDONESIA",
        "partner": "airalo",
        "anchorText": "Indonesia eSIM with Airalo",
        "affiliateUrl": "https://airalo.tpx.lu/ywUnFTCe",
        "publicUrl": "https://www.airalo.com/indonesia-esim",
        "experienceCategory": "esim_connectivity",
        "linkStatus": "live", "notes": "travelpayouts",
    },
    {
        "_key": k(), "_type": "affiliateLink",
        "placeholderId": "12GO_SANUR_NUSA_PENIDA",
        "partner": "12go",
        "anchorText": "fast boat tickets from Sanur to Nusa Penida",
        "affiliateUrl": "https://12go.asia/?z=16022946",
        "publicUrl": None,
        "experienceCategory": "transfer",
        "linkStatus": "live", "notes": None,
    },
    {
        "_key": k(), "_type": "affiliateLink",
        "placeholderId": "VIATOR_WEST_PENIDA_LAND",
        "partner": "viator",
        "anchorText": "guided West Penida tour with a driver",
        "affiliateUrl": "https://www.viator.com/tours/Nusa-Penida/Explore-West-Penida-Kelingking-Broken-Beach-Angels-Billabong-Crystal-Bay/d60448-122061P2?pid=P00303362&mcid=42383&medium=link&campaign=WestNusaPenidaLandTour",
        "publicUrl": "https://www.viator.com/tours/Nusa-Penida/Explore-West-Penida-Kelingking-Broken-Beach-Angels-Billabong-Crystal-Bay/d60448-122061P2",
        "experienceCategory": "tour",
        "linkStatus": "live", "notes": None,
    },
    {
        "_key": k(), "_type": "affiliateLink",
        "placeholderId": "VIATOR_NUSA_PENIDA_MANTA",
        "partner": "viator",
        "anchorText": "Nusa Penida manta snorkeling tour",
        "affiliateUrl": "https://www.viator.com/tours/Nusa-Penida/Nusa-Penida-Manta-Snorkeling-Tour/d60448-161518P1?pid=P00303362&mcid=42383&medium=link&campaign=NusaPenidaMantaSnorkel",
        "publicUrl": "https://www.viator.com/tours/Nusa-Penida/Nusa-Penida-Manta-Snorkeling-Tour/d60448-161518P1",
        "experienceCategory": "activity",
        "linkStatus": "live", "notes": None,
    },
    {
        "_key": k(), "_type": "affiliateLink",
        "placeholderId": "KLOOK_LEMBONGAN_CENINGAN",
        "partner": "klook",
        "anchorText": "Nusa Lembongan and Ceningan day tour",
        "affiliateUrl": KLOOK_LEMBONGAN,
        "publicUrl": "https://www.klook.com/activity/21676-nusa-lembongan-ceningan-tour-bali/",
        "experienceCategory": "tour",
        "linkStatus": "live", "notes": "travelpayouts",
    },
]

# ---- block builders ----
def h2(text):
    return {"_type": "block", "_key": k(), "style": "h2", "markDefs": [],
            "children": [{"_type": "span", "_key": k(), "marks": [], "text": text}]}

def p(*parts, style="normal"):
    """parts: str | ('strong',t) | ('aff',placeholderId,t) | ('link',href,t)"""
    children, markDefs = [], []
    for part in parts:
        if isinstance(part, str):
            children.append({"_type": "span", "_key": k(), "marks": [], "text": part})
        elif part[0] == "strong":
            children.append({"_type": "span", "_key": k(), "marks": ["strong"], "text": part[1]})
        elif part[0] == "aff":
            mk = k()
            markDefs.append({"_key": mk, "_type": "affiliateLinkRef", "placeholderId": part[1]})
            children.append({"_type": "span", "_key": k(), "marks": [mk], "text": part[2]})
        elif part[0] == "link":
            mk = k()
            href = part[1]
            markDefs.append({"_key": mk, "_type": "externalLink", "href": href,
                             "blank": href.startswith("http")})
            children.append({"_type": "span", "_key": k(), "marks": [mk], "text": part[2]})
    return {"_type": "block", "_key": k(), "style": style, "markDefs": markDefs, "children": children}

body = []
B = body.append

# --- Who this trip is for ---
B(h2("Who this trip is for"))
B(p("This route suits couples and friends who want island scenery and good snorkeling without making mainland Bali the centre of the trip. You get the big west coast viewpoints on Nusa Penida, a tide-dependent manta snorkel, then a slower finish on Nusa Lembongan where you can walk, cycle and swim without a packed schedule. The pace is balanced, with two active driving days on Penida and a genuine wind-down at the end."))
B(p("It is not the right trip for families with young children. The famous Penida viewpoints sit at the top of steep, unfenced cliffs, and the island roads are slow and rough in places, which makes long touring days hard with toddlers. It is also not ideal if you want nightlife, fast transport between sights, or guaranteed wildlife. The manta snorkel depends on weather and tides that no operator controls."))
B(p("If you only have two or three days, this plan will feel rushed. Nusa Penida rewards a base of several nights so you are not timing every move around a return boat to Sanur. Travellers who want serious diving rather than snorkeling should look at a dedicated dive base instead, since this is a scenery-and-snorkel plan."))

# --- Trip at a glance ---
B(h2("Trip at a glance"))
B(p(("strong", "Duration:"), " 5 days, 4 nights."))
B(p(("strong", "Route:"), " Sanur to Nusa Penida for three nights, then Nusa Lembongan for one night before the boat back."))
B(p(("strong", "Pace:"), " Balanced. Two full touring days on Penida, then a slow Lembongan finish."))
B(p(("strong", "Best season:"), " The drier months, roughly April to October, tend to bring calmer crossings and clearer water, though conditions vary year to year. Manta sightings are never guaranteed in any season, so treat them as a bonus rather than a fixed plan, and confirm current conditions locally."))
B(p(("strong", "Getting in:"), " Most people reach the islands by fast boat from Sanur, a crossing of around 30 to 45 minutes as a working estimate. Fares and schedules change with operator and season, so check the latest before you travel."))

# --- Why this route makes sense ---
B(h2("Why this route makes sense"))
B(p("Nusa Penida and Nusa Lembongan are often squeezed into a single rushed day trip from Bali, which is how most people end up disappointed. The two islands reward different speeds. Penida is large, dramatic and tiring to get around, so it needs full days and a fixed base. Lembongan is smaller, flatter and easier, which makes it the right place to slow down at the end rather than the start."))
B(p("Putting Penida first means you tackle the demanding driving and the weather-dependent manta snorkel while you still have flexibility to shuffle days if conditions are poor. By the time you reach Lembongan, the hard logistics are behind you and the only real decision left is which beach to swim at. The short crossing between the two islands ties the plan together without a return trip to the mainland in the middle."))

# --- Day 1 ---
B(h2("Day 1: Sanur to Nusa Penida and settle in"))
B(p(("strong", "Morning."), " Sort connectivity before you leave. An ", ("aff", "AIRALO_INDONESIA", "Indonesia eSIM with Airalo"), " lets you activate data before you board, so maps, messaging and the boat operator's confirmation all work while you are still on the mainland. Then make the crossing from Sanur. Booking ", ("aff", "12GO_SANUR_NUSA_PENIDA", "fast boat tickets from Sanur to Nusa Penida"), " in advance locks a departure time and saves haggling at the pier on a busy morning."))
B(p(("strong", "Travel note."), " Foreign visitors are asked to pay the Bali tourist levy, a one-time charge of around 150,000 rupiah per person as a working estimate, which also covers the Nusa islands. It is easiest to pay through the official Love Bali app before you travel. Fees can change, so check the latest official guidance."))
B(p(("strong", "Afternoon."), " Arrive, drop your bags and keep the first day light. Crossings can be bumpy and the harbour is busy, so do not schedule a major sight for the same afternoon you land. Settle into your base near Toyapakeh or the north coast, arrange your scooter or driver for the next two days, and walk to a nearby beach or viewpoint within easy reach."))
B(p(("strong", "Base:"), " Pick one stay on Nusa Penida for all three nights. The north coast near Toyapakeh and Ped puts you closest to the harbour and to most tours, which shortens every transfer over the next two days."))

# --- Day 2 ---
B(h2("Day 2: West Penida viewpoints"))
B(p(("strong", "Morning."), " Start early for the west coast loop. The headline stops are the Kelingking cliff viewpoint, Broken Beach, Angel's Billabong and Crystal Bay. They are close together on the map and much further apart in practice, because the roads are narrow, steep and slow. A ", ("aff", "VIATOR_WEST_PENIDA_LAND", "guided West Penida tour with a driver"), " takes the navigation and the rough driving off your plate, which matters more here than on most Bali day trips."))
B(p(("strong", "Booking logic."), " If you are a confident scooter rider you can do this loop independently, but the gradients and road surface are unforgiving and accidents are common. Hiring a driver or joining a small-group tour is the safer call for most couples and first-time visitors, and it lets you actually look at the scenery instead of the potholes."))
B(p(("strong", "Afternoon."), " Finish at Crystal Bay for a swim and a rest before the drive back. Currents here can be strong, so stay close to shore and ask locally before going in. Build in more travel time than the distances suggest, because the return drive in the late afternoon is slow."))
B(p(("strong", "Travel note."), " The Kelingking descent to the beach is a long, exposed scramble on a rough path, not a quick walk. The viewpoint is the realistic goal for most people, and there is no shame in turning back at the top."))

# --- Day 3 ---
B(h2("Day 3: Manta snorkeling and the east coast"))
B(p(("strong", "Morning."), " This is the day to get in the water. A ", ("aff", "VIATOR_NUSA_PENIDA_MANTA", "Nusa Penida manta snorkeling tour"), " runs by boat to Manta Point and usually adds reef stops such as Gamat Bay or Crystal Bay. Manta rays are wild animals, so sightings are never guaranteed, and operators may switch the order of stops or skip Manta Point entirely if the swell is up. Treat the mantas as the hoped-for highlight, not the whole point of the morning."))
B(p(("strong", "Booking logic."), " Book a morning departure when seas are usually calmer, and keep this day movable in your plan. If the forecast is rough, swap Day 2 and Day 3 so you snorkel on the better weather window. This is the single most useful piece of flexibility on the trip."))
B(p(("strong", "Afternoon."), " If you still have energy, the east coast around Diamond Beach and Atuh is the other side of the island worth seeing, with steep stairways down to the sand. It is a long drive from the north coast, so only add it if the morning tour finished on time. Otherwise, rest. You have an island move tomorrow."))

# --- Day 4 ---
B(h2("Day 4: Cross to Nusa Lembongan and explore Ceningan"))
B(p(("strong", "Morning."), " Take a short local boat across to Nusa Lembongan, a crossing of roughly 15 to 30 minutes as a working estimate. Boats are small and run to a loose schedule, so confirm the day's departures the evening before and do not plan a tight connection. Once you arrive, the scale of the place is a relief after Penida."))
B(p(("strong", "Afternoon."), " Lembongan connects to tiny Nusa Ceningan by the yellow suspension bridge, and the two islands are easy to combine. A ", ("aff", "KLOOK_LEMBONGAN_CENINGAN", "Nusa Lembongan and Ceningan day tour"), " links the bridge, the Devil's Tear blowholes and the main viewpoints without the constant stopping and starting of doing it solo. If you would rather go at your own pace, a scooter handles Lembongan easily, since the roads here are far gentler than on Penida."))
B(p(("strong", "Base:"), " Shift your stay to Nusa Lembongan for the last night. Mushroom Bay and Jungutbatu are the two main bases, close to the beaches and the boats back to Sanur."))
B(p(("strong", "Travel note."), " The yellow bridge has a strict limit on how many people and scooters cross at once, so expect a short wait at busy times. Cross on foot if you are unsure."))

# --- Day 5 ---
B(h2("Day 5: Slow Lembongan morning and the boat back"))
B(p(("strong", "Morning."), " Keep the last morning gentle. Swim or snorkel off Mushroom Bay, walk the coast path to Dream Beach and the Devil's Tear, or simply have a long breakfast. This is the part of the trip the rushed day-trippers never get, and it is the reason the route ends here rather than on Penida."))
B(p(("strong", "Afternoon."), " Take an early-afternoon fast boat from Lembongan back to Sanur. Give yourself a buffer before any onward flight or transfer, because afternoon seas can be choppier and departures occasionally shift. Confirm your return crossing the day before, and do not book the last boat of the day if you have a flight to catch."))
B(p(("strong", "Booking logic."), " If you are connecting to a flight out of Bali the same day, build in at least half a day of slack between the boat and the airport. The crossing plus the drive from Sanur to the airport can stack up, especially in traffic."))

# --- What to book early ---
B(h2("What to book early, and what to keep flexible"))
B(p(("strong", "Book early:"), " the Sanur fast boat for Day 1 and your return crossing, your Nusa Penida base for all three nights, and your Lembongan stay for the last night. In peak season these sell out, and a fixed boat time removes a lot of morning stress."))
B(p(("strong", "Keep flexible:"), " the manta snorkel and the west coast tour. These two days should move around the weather, not the other way around. Book the tours close to the date once you can see a forecast, or choose operators that allow a free change."))
B(p(("strong", "Decide on arrival:"), " whether to add the east coast on Day 3 and whether to rent a scooter or hire a driver. Both depend on how you feel after the first touring day and on the road conditions you see for yourself."))

# --- Mistakes ---
B(h2("Mistakes travellers make on Nusa Penida"))
B(p(("strong", "Treating it as a day trip."), " The single most common mistake is trying to see Penida and Lembongan in one day from Bali. You spend the day in boats and cars and see almost nothing properly. Several nights on the islands is the fix."))
B(p(("strong", "Underestimating the roads."), " The map makes the west coast sights look like a quick loop. The driving is slow and tiring, and inexperienced scooter riders crash here regularly. Plan fewer stops than you think, and consider a driver."))
B(p(("strong", "Banking on the mantas."), " Booking a non-refundable trip for the one morning you are free, then losing it to swell, is a familiar disappointment. Keep the snorkel day movable and your expectations honest."))
B(p(("strong", "Cutting it fine with the return boat."), " Afternoon crossings can be delayed, and the Sanur to airport drive is unpredictable. Travellers miss flights this way every season. Leave a real buffer."))

# --- What to cut, adapt or upgrade ---
B(h2("What to cut, adapt or upgrade"))
B(p(("strong", "Cut, if you are short on time:"), " drop Lembongan and run this as a focused three-night Nusa Penida trip, returning to Sanur on the last morning. You lose the slow finish but keep the scenery and the snorkel."))
B(p(("strong", "Adapt, for a calmer trip:"), " rebalance the nights to two on Penida and two on Lembongan. You give up one Penida touring day, which suits couples who want more beach time and less driving, and shifts the whole trip toward a relaxed pace."))
B(p(("strong", "Upgrade, if you have a sixth day:"), " add a night and slot in the east coast properly, so Diamond Beach and Atuh get their own half-day instead of being squeezed onto the snorkel day. This is the single best use of one extra night here."))

# --- Before you build this trip ---
B(h2("Before you build this trip"))
B(p("Check current fast boat schedules and fares before you lock in accommodation, since operators change times seasonally and the first and last departures shift. Confirm whether your Penida stay can arrange a scooter or driver, because sorting transport on arrival is far easier than negotiating it cold. Pay the Bali tourist levy through the official Love Bali app before you fly to skip the airport queue, and keep the confirmation on your phone."))
B(p("Pack for rough ground and strong sun. The viewpoints involve walking on uneven paths and stairs, and shade is limited. Bring reef-safe sunscreen, water shoes for rocky entries, and your own snorkel mask if you are particular about fit, since rental gear quality varies. Carry some cash, as card payment is patchy outside the larger places."))

# --- Final verdict ---
B(h2("Final verdict"))
B(p("Nusa Penida is worth far more than the day trip most people give it, but only if you respect how big and rough it is. Three nights lets you tour the west coast, chase the mantas on the best weather window, and still have something left for the boat ride. Finishing on Nusa Lembongan is the part that turns a tiring sightseeing sprint into a trip you actually enjoy. Keep the snorkel day flexible, do not gamble on the last boat before a flight, and this five-day plan holds together well. Try to do it in two days and it will not."))

# --- Related itineraries ---
B(h2("Related itineraries"))
B(p("If you want to fold these islands into a longer trip, see our ",
    ("link", "/trips/10-days-bali-gili-islands", "10 days in Bali and the Gili Islands"),
    " itinerary, which pairs the mainland with island time. For a different island chain at a slower pace, the ",
    ("link", "/trips/7-days-lombok-gili-islands", "7-day Lombok and Gili Islands route"),
    " covers quieter beaches further east. You can also browse more options on our ",
    ("link", "/destinations/bali-nearby-islands", "Bali and nearby islands"),
    " destination guide."))

FAQ = [
    {"_key": k(), "question": "How many days do you need for Nusa Penida?",
     "answer": "Plan for at least two full days on Nusa Penida itself, which means three nights so you are not timing everything around the boat. The island is large and the roads are slow, so one day only lets you see a fraction of it. This itinerary gives Penida three nights, then adds a short stay on Nusa Lembongan."},
    {"_key": k(), "question": "Is the Nusa Penida manta snorkeling worth it, and is it guaranteed?",
     "answer": "The manta snorkel at Manta Point is the marquee in-water experience on Penida, but manta rays are wild animals and sightings are never guaranteed. Operators may reorder or skip stops if the swell is up. Book a morning departure for calmer seas, keep the day flexible so you can move it to better weather, and treat the mantas as a hoped-for highlight rather than a sure thing."},
    {"_key": k(), "question": "Should you rent a scooter or hire a driver on Nusa Penida?",
     "answer": "Nusa Penida's roads are steep, narrow and rough, and accidents involving inexperienced scooter riders are common. Confident, experienced riders can manage, but most couples and first-time visitors are safer and more relaxed hiring a driver or joining a small-group tour, which also lets you take in the scenery instead of concentrating on the road."},
    {"_key": k(), "question": "How do you get from Nusa Penida to Nusa Lembongan?",
     "answer": "A short local boat connects the two islands in roughly 15 to 30 minutes as a working estimate. Boats are small and run to a loose schedule, so confirm the day's departures the evening before and avoid planning a tight connection. Fares and times change, so check locally."},
    {"_key": k(), "question": "Do you have to pay the Bali tourist levy for Nusa Penida?",
     "answer": "Yes. The Bali tourist levy applies to foreign visitors and covers the Nusa islands as well as the mainland. It is a one-time charge of around 150,000 rupiah per person as a working estimate, paid most easily through the official Love Bali app before you travel. Fees can change, so check the latest official guidance."},
    {"_key": k(), "question": "Is Nusa Penida good for families with young children?",
     "answer": "It is a hard fit for families with young kids. The famous viewpoints sit on steep, unfenced cliffs, the descents to beaches like Kelingking are long and exposed, and the touring days involve slow, bumpy driving. Families looking for an easier island trip are usually better served by calmer beach-based destinations."},
    {"_key": k(), "question": "When is the best time to visit Nusa Penida and Lembongan?",
     "answer": "The drier months, roughly April to October, tend to bring calmer crossings and clearer water, which helps both the boat days and the snorkeling. Conditions vary year to year and manta sightings are seasonal and weather-dependent, so confirm current conditions before you lock in tour days."},
]

doc = {
    "_id": f"itinerary-{SLUG}",
    "_type": "article",
    "contentStatus": "draft",
    "title": "5 Days in Nusa Penida and Nusa Lembongan",
    "slug": {"_type": "slug", "current": SLUG},
    "metaTitle": "Nusa Penida & Lembongan in 5 Days: Itinerary",
    "metaDescription": "A practical 5-day Nusa Penida and Nusa Lembongan itinerary: west coast viewpoints, manta snorkeling and a slow Lembongan finish, with honest boat advice.",
    "focusKeyword": "5 days Nusa Penida Lembongan itinerary",
    "intro": "Nusa Penida shows up in most plans as a half-day boat trip from Bali. Spend real time there and you see why that is a mistake. The island is bigger and rougher than the photos suggest, the roads between the famous viewpoints are slow and broken in places, and the best snorkeling depends on tides and weather you cannot control from the mainland. This five-day plan gives Nusa Penida three nights, so you are not racing a return boat, then drops the pace with a short stay on Nusa Lembongan. It is built around the two things that go wrong most often here: underestimating transfer times on Penida, and treating the manta snorkel as guaranteed when it is not.",
    "route": "Sanur → Nusa Penida → Nusa Lembongan",
    "destinationPrimary": "bali_nearby_islands",
    "tripLengthBucket": "short_escape",
    "tripLengthDays": 5,
    "travelStylePrimary": "diving_snorkeling",
    "travellerTypes": ["couples", "friends"],
    "vibe": "balanced",
    "author": {"_type": "reference", "_ref": "author-editorial-team"},
    "articleCreatedDate": "2026-06-19T08:00:00.000Z",
    "affiliateLinks": AFFILIATES,
    "faq": FAQ,
    "body": body,
}

# ================= VALIDATION =================
errors = []
blob = json.dumps(doc, ensure_ascii=False)

# em-dash / en-dash
for ch, name in [("—", "em-dash"), ("–", "en-dash")]:
    if ch in blob:
        errors.append(f"found {name}")

BANNED = ["hidden gem","must-see","must see","paradise","immerse yourself","unforgettable",
    "something for everyone","vibrant culture","crystal-clear waters","crystal clear waters",
    "breathtaking","rich history","local charm","authentic experience","off the beaten path",
    "once-in-a-lifetime","once in a lifetime","bucket list","dream destination"]
low = blob.lower()
for b in BANNED:
    if b in low:
        errors.append(f"banned phrase: {b}")

if "(SEARCH" in blob:
    errors.append("SEARCH artifact present")
if re.search(r"\d[\d,]*\s+reviews", blob):
    errors.append("'<digits> reviews' artifact present")

# meta lengths
if len(doc["metaTitle"]) > 60:
    errors.append(f"metaTitle too long: {len(doc['metaTitle'])}")
if len(doc["metaDescription"]) > 155:
    errors.append(f"metaDescription too long: {len(doc['metaDescription'])}")

# key uniqueness across blocks/spans/markDefs/affiliates/faq
keys = []
def collect(o):
    if isinstance(o, dict):
        if "_key" in o: keys.append(o["_key"])
        for v in o.values(): collect(v)
    elif isinstance(o, list):
        for v in o: collect(v)
collect(doc)
dups = {x for x in keys if keys.count(x) > 1}
if dups:
    errors.append(f"duplicate _keys: {dups}")

# affiliateLinkRef placeholderIds all present in affiliateLinks
declared = {a["placeholderId"] for a in AFFILIATES}
used = set(re.findall(r'"placeholderId":\s*"([^"]+)"', json.dumps([b for b in body])))
# extract refs only
refs = set()
def find_refs(o):
    if isinstance(o, dict):
        if o.get("_type") == "affiliateLinkRef":
            refs.add(o["placeholderId"])
        for v in o.values(): find_refs(v)
    elif isinstance(o, list):
        for v in o: find_refs(v)
find_refs(body)
missing = refs - declared
if missing:
    errors.append(f"affiliateLinkRef without affiliateLinks entry: {missing}")

# day headings start "Day N:"
day_h2 = [b for b in body if b.get("style")=="h2" and b["children"][0]["text"].startswith("Day")]
bad_days = [b["children"][0]["text"] for b in day_h2 if not re.match(r"^Day \d+:", b["children"][0]["text"])]
if bad_days:
    errors.append(f"day headings not 'Day N:': {bad_days}")

print("=== VALIDATION ===")
print(f"blocks: {len(body)}  faq: {len(FAQ)}  affiliates: {len(AFFILIATES)}")
print(f"affiliateLinkRefs used: {sorted(refs)}")
print(f"metaTitle len: {len(doc['metaTitle'])}  metaDescription len: {len(doc['metaDescription'])}")
print(f"total keys: {len(keys)}  unique: {len(set(keys))}")
if errors:
    print("FAILURES:")
    for e in errors: print("  -", e)
    sys.exit(1)
print("ALL CHECKS PASSED")

out = f"/Users/valentinoscicolone/Desktop/ExploreIndonesiaAI/content/articles/{SLUG}.json"
import os
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)
print(f"snapshot written: {out}")
