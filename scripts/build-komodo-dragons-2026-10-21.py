# PARTE 2, 2026-10-21 generator run: first itinerary built around WHERE to see
# Komodo dragons (Komodo, Rinca and the Wae Wuul reserve on mainland Flores).
# GSC 2026-09-21..10-18: a scattered cluster ("are there komodo dragons on flores
# island", "komodo dragons flores", "where to see komodo dragons in indonesia",
# "best place to see komodo dragons"...) with no page that answers it.
# Builds the Sanity document, validates it, writes the snapshot to content/articles/.
#   python3 scripts/build-komodo-dragons-2026-10-21.py
import json,re,datetime,urllib.parse
SLUG="5-days-komodo-dragons-rinca-wae-wuul-flores"
KL=lambda u:"https://klook.tpx.lu/QYeSR2G9?u="+urllib.parse.quote(u,safe="")
K1="https://www.klook.com/en-US/activity/55119-full-day-speedboat-tour-komodo-labuan-bajo/"
V1="https://www.viator.com/tours/Labuan-Bajo/1-Day-Tour-Komodo-by-Fast-Boat-Private/d50484-200061P12"
V2="https://www.viator.com/tours/East-Nusa-Tenggara/Komodo-Private-Tour-3Days-2Nights-by-Semi-Phinisi-Boat/d23784-200061P9"
VQ="?pid=P00303362&mcid=42383&medium=link&campaign=komodo-dragons-5-days"
TG="https://12go.asia/en/travel/bali/labuan-bajo?z=16022946"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_BALI_LABUAN_BAJO",affiliateUrl=TG,publicUrl="https://12go.asia/en/travel/bali/labuan-bajo",anchorText="Bali to Labuan Bajo flights on 12Go",experienceCategory="transport"),
 dict(partner="klook",placeholderId="KLOOK_KOMODO_SPEEDBOAT_GROUP",affiliateUrl=KL(K1),publicUrl=K1,anchorText="shared Komodo speedboat day tour",experienceCategory="tour"),
 dict(partner="viator",placeholderId="VIATOR_KOMODO_PRIVATE_SPEEDBOAT",affiliateUrl=V1+VQ,publicUrl=V1,anchorText="private Komodo speedboat day",experienceCategory="tour"),
 dict(partner="viator",placeholderId="VIATOR_RINCA_PRIVATE_SPEEDBOAT",affiliateUrl=V2+VQ,publicUrl=V2,anchorText="private Rinca speedboat trip",experienceCategory="tour"),
 dict(partner="booking",placeholderId="BOOKING_LABUAN_BAJO",affiliateUrl=BK%"Labuan+Bajo",publicUrl=BK%"Labuan+Bajo",anchorText="stays in Labuan Bajo on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"kd-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Where can you see Komodo dragons in the wild?
Wild Komodo dragons live only in a small corner of eastern Indonesia: Komodo and Rinca islands inside Komodo National Park, a few smaller park islands, and two reserves on the island of Flores itself. For a visitor, Rinca and Komodo give near-certain sightings with a ranger. The Flores reserves are real but sightings there are a gamble.
That is the whole decision this itinerary is built on. Almost every traveller who wants to see the dragons flies into Labuan Bajo, the harbour town on the western tip of Flores, and takes a boat into the park. Few realise that dragons also live on the Flores mainland, a short drive out of town, or that Rinca, not Komodo Island, is often the more reliable place to find them.
## Who this trip is for
This five-day plan is for travellers whose main reason to come this far east is the dragons themselves: wildlife people, photographers, couples or friends who want to see the animal properly, on two islands, at the right hour, rather than for ten rushed minutes between snorkel stops. It suits anyone with five days and a flight from Bali.
It is not for you if the dragons are a box to tick on a beach holiday. Then one day trip covers it, and the [[5-day Labuan Bajo and Komodo itinerary|/trips/5-days-labuan-bajo-komodo]] gives you more water time. It is also the wrong trip for anyone who hates early starts, because every good dragon sighting in this plan happens before 10 in the morning.
## Trip at a glance
**Duration:** 5 days, 4 nights in Labuan Bajo.
**Route:** Bali to Labuan Bajo by air, a full day to Komodo Island and Padar, a morning on Rinca, a morning in the Wae Wuul reserve on mainland Flores, then back to Bali.
**Pace:** balanced. Three early mornings, three easy afternoons, and a fifth day that doubles as a weather buffer.
**Best for:** wildlife-focused couples, friends and solo travellers, and photographers.
**Best time:** roughly April to November, the dry season, when the sea is calmer and boats run reliably. The dragons are visible all year; the weather decides whether you can reach them.
**Budget:** the boats are the big cost. Park fees are modest by comparison, and Labuan Bajo has rooms at every price.
## Komodo, Rinca or Flores: which is the best place to see Komodo dragons?
Rinca is the best single place for most visitors: it is closer to Labuan Bajo, the ranger walk is short, and dragons are regularly seen around the ranger post. Komodo Island has the bigger, more famous population and longer trails. Wae Wuul on mainland Flores is for travellers who want a try outside the park, without a boat.
The table below sets out the honest trade-offs. Population figures are deliberately left out of it, because published counts vary widely by year and by source; park surveys in recent years have put the total population in the low thousands, with Komodo and Rinca holding most of them.
^^ Where to see Komodo dragons from Labuan Bajo. Times and chances are working estimates from 2025 and 2026 operator listings and reports; check current conditions locally.
| Place | How you get there | Sighting chance | What the walk is like | Best for |
| Rinca Island (Loh Buaya) | About 1 to 1.5 hours by speedboat from Labuan Bajo, longer by wooden boat | High | Short guided loop and raised boardwalk near the ranger post | First sighting, shorter days, photography |
| Komodo Island (Loh Liang) | About 1.5 to 2 hours by speedboat, usually combined with Padar and Pink Beach | High | Short, medium or long ranger treks through dry forest | Seeing the famous island, longer walks |
| Wae Wuul reserve, mainland Flores | Under an hour by car from Labuan Bajo, last stretch on a rough road | Low to moderate | Unmarked trails through savanna and dry forest with a local guide | A second, wilder attempt without a boat |
| Riung and Ontoloe, north Flores | A long day's drive east, or more | Low | Boat to the island, then on foot | Overland Flores trips only |
| Padar Island | On every Komodo day tour | Very low | A steep viewpoint climb | The view, not the dragons |
## Are there Komodo dragons on Flores island?
Yes. A small population of wild Komodo dragons lives on the island of Flores itself, mainly in the Wae Wuul nature reserve near Labuan Bajo on the west coast and around Riung on the north coast, including the island of Ontoloe. These are protected reserves outside the national park, and the dragons there are fewer and much shier.
Indonesia's conservation agency for the province has put the combined number in the Wae Wuul and Riung reserves at around fifty animals, though that figure is not recent and should be read as a rough order of size. A camera-trap study published in 2012 recorded several individuals on Ontoloe. The practical point is that you can walk where dragons live on Flores, but nobody can promise you will see one.
## Why this route makes sense
Most Komodo day tours treat the dragons as one stop out of six, squeezed between the Padar viewpoint, Pink Beach and Manta Point. That works if the dragons are a side note. If they are the reason you came, it gives you one short ranger walk, often in the late-morning heat when the animals are lying still in the shade.
This plan gives the dragons three separate mornings in three different places. Komodo Island on a classic day tour, so you still get Padar and the reef. Rinca on its own morning, which is where the closest, calmest sightings usually happen. And Wae Wuul on the mainland, which is a different experience entirely: no boardwalk, no crowd, and the chance to see where a dragon lives rather than where tourists gather. Basing all four nights in Labuan Bajo means no packing, and the fifth day protects the plan from a cancelled boat.
## Day 1: Fly into Labuan Bajo and set up the week
**Morning.** Fly from Bali. Direct flights to Komodo Airport in Labuan Bajo take a little over an hour, with several departures a day; compare [[Bali to Labuan Bajo flights on 12Go|TWELVEGO_BALI_LABUAN_BAJO]] and the transport details in our [[Bali to Labuan Bajo guide|/transport/bali-to-labuan-bajo]].
**Afternoon.** Check in, then confirm your two boat days with the operators in person or by message. Ask each one to confirm that you have been registered on SiORA, the national park's online ticketing system, and which entry session your ticket is for.
**Evening.** Watch the sun go down over the harbour from one of the hillside viewpoints above town, then eat at the night fish market stalls along the waterfront. Go to bed early. Tomorrow starts before dawn.
**Base:** Labuan Bajo, 4 nights. Compare [[stays in Labuan Bajo on Booking.com|BOOKING_LABUAN_BAJO]]; a hotel near the harbour saves time on every early pickup.
**Booking logic:** book the boats before you book the flight's return leg, because the boats are the part that sells out in July and August.
**Travel note:** set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly. Boat operators coordinate pickups by WhatsApp, and coverage at sea is patchy, so you want data the moment you land.
## Day 2: Komodo Island, Padar and the classic park day
**Morning.** A hotel pickup around 5 to 6 a.m. and a speedboat into the park. Most tours climb Padar first for the viewpoint while it is still cool, then head to Loh Liang on Komodo Island for the ranger walk. A [[shared Komodo speedboat day tour|KLOOK_KOMODO_SPEEDBOAT_GROUP]] runs about 9 to 11 hours with pickup; a [[private Komodo speedboat day|VIATOR_KOMODO_PRIVATE_SPEEDBOAT]] lets you ask for more time on Komodo and less elsewhere.
**Afternoon.** Pink Beach for a swim, then a snorkel stop such as Manta Point or Taka Makassar if the current allows. Mantas are seasonal and never guaranteed.
**Evening.** Back in town by late afternoon. A light dinner and an early night.
**Booking logic:** on a shared tour the order of stops is fixed. If seeing the dragons in the cooler part of the day matters to you, ask before booking whether Komodo comes before or after Padar.
**Travel note:** this is a long day in strong sun with a steep climb on Padar. Bring more water than you think, a hat and reef-safe sunscreen.
## Day 3: Rinca, the morning for close sightings
**Morning.** Leave early for Rinca and land at Loh Buaya while the dragons are still moving. The ranger walk here is short and partly on a raised boardwalk built during the redevelopment of the ranger area, and dragons are often seen resting or patrolling close to the station. This is usually the morning for your best photographs. A [[private Rinca speedboat trip|VIATOR_RINCA_PRIVATE_SPEEDBOAT]] runs about seven hours and adds snorkel and beach stops at Kelor and Manjarite on the way back.
**Afternoon.** Back in Labuan Bajo early enough for a long lunch and a rest. You have earned it.
**Evening.** If you have chartered your own boat, ask whether it can stay out until dusk at Kalong Island, where thousands of flying foxes leave the mangroves at sunset. Otherwise, go to bed early again.
**Booking logic:** Rinca can be booked as part of a day tour or separately. Book it separately, as this plan does, so it gets the morning instead of the leftover slot.
**Travel note:** the ranger leads and sets the distance. Dragons are fast over short distances and their bite is dangerous, so stay behind the ranger, never approach for a photograph, and tell the ranger beforehand if you have an open wound.
## Day 4: Wae Wuul, dragons on mainland Flores
**Morning.** Leave Labuan Bajo by car at first light for the Wae Wuul nature reserve, under an hour away on a road that becomes rough and narrow for the last stretch. Walk the savanna and dry forest with a local guide, looking for dragons, their tracks and the deer they hunt. Treat a sighting as a bonus, not a promise.
**Afternoon.** Swim it off at Cunca Wulang, a river canyon with pools east of town, or keep it simple with a slow afternoon by the hotel pool.
**Evening.** A final dinner in town, ideally grilled fish by the harbour.
**Booking logic:** arrange Wae Wuul through your hotel or a local driver the day before, and ask for a guide who knows the reserve. It is not a ticketed attraction like the national park, and walking in alone is a poor idea.
**Travel note:** the reserve has no boardwalk and little shade. Wear closed shoes and long trousers, and go early, when the animals are active and the heat is bearable.
## Day 5: Buffer morning and the flight out
**Morning.** This is your weather buffer. If either boat day was cancelled for rough seas, this is when it runs. If not, sleep in, or take a short morning on the water.
**Afternoon.** Fly back to Bali, leaving at least a two-hour margin between landing and any international departure.
**Base:** none. You leave today.
**Travel note:** flights between Labuan Bajo and Bali are short but can be delayed or rescheduled, so never book a same-day international connection without that buffer.
## How much are Komodo National Park fees in 2026?
As a working estimate, the fee schedule that licensed operators publish for 2026 is a daily park entry of about IDR 250,000 per foreign visitor, a harbour fee of about IDR 25,000, and a ranger fee of roughly IDR 200,000 per group of up to five on Komodo or Rinca. Your operator registers you through the park's SiORA system.
The structure has changed several times since 2022, and you will still find older quotes online with different bundled prices, so treat these numbers as a budgeting guide and check the current tariff with your operator or on the park's official channels before you pay. Two practical points survive every change: register early, because operators need your passport details in advance, and confirm whether your boat price includes the park fees or adds them on.
^^ What the boats cost from Labuan Bajo. Prices are working estimates from 2026 listings at the time of writing; they move with the season, and park fees are usually extra.
| Option | Typical price | Time | Good for | Weak point |
| Shared speedboat day tour | From about US$120 to 130 per person | 9 to 11 hours | Budget, solo travellers | Fixed order of stops, crowded at Padar |
| Private speedboat, Komodo day | From about US$990 per group | About 10.5 hours | Groups of four or five, control of timing | Expensive for two |
| Private speedboat, Rinca morning | From about US$800 per group | About 7 hours | A focused dragon morning | Costly unless shared |
| Overnight phinisi or liveaboard | Varies widely | 2 to 3 days | Sunrise and sunset in the park | Less time on land with the dragons |
## When is the best time to see Komodo dragons?
The dragons can be seen all year, so the best time is decided by the sea. April to November, the dry season, brings calmer water and the most reliable boat days. Within any day, early morning is best, because the animals are active in the cooler hours and lie still in the shade by late morning.
Rangers often note that behaviour shifts around the mating season in the middle of the year and the nesting season that follows, so some animals are less visible then; sightings near the ranger posts remain likely regardless. From December to March, the rainy season brings rougher crossings and more cancellations, which is exactly why this plan keeps a buffer day. For the full month-by-month picture, read our [[guide to the best time to visit Komodo|/destinations/komodo-flores/best-time-to-visit-komodo]].
## What to book early, and what to keep flexible
**Book early:** the two boat days, especially between June and September, and your Labuan Bajo hotel. Both fill up in high season, and the boats need time to register you on SiORA.
**Book early:** the flights. There are several a day from Bali, but fares rise sharply close to departure.
**Keep flexible:** Wae Wuul. Arrange it a day ahead, once you know the boat days have run.
**Keep flexible:** the fifth morning. Do not fill it until you know you do not need it.
## Mistakes travellers make when trying to see Komodo dragons
The most common mistake is expecting Padar to be a dragon stop. It is a viewpoint climb, and dragons are rarely, if ever, seen there. The second is booking a tour that reaches Komodo or Rinca at midday, when the animals are motionless in the shade and the walk is at its hottest.
Other mistakes: assuming you can buy park tickets on arrival, when registration now goes through operators in advance; walking into Wae Wuul without a guide; and treating a cancelled boat as bad luck rather than something to plan for. Weather closes the crossing more often than people expect, especially outside the dry season.
## What to cut, adapt or upgrade
**Cut:** with only three days, drop Wae Wuul and the buffer, and do Komodo and Rinca on back-to-back mornings. You keep the two near-certain sightings.
**Adapt:** travelling with children? Rinca is the easier island for small legs, and our [[8-day Komodo and Flores itinerary with kids|/trips/8-days-komodo-flores-with-kids]] paces the whole region for families.
**Adapt:** a diver in your group? Swap the Wae Wuul morning for a dive day; the [[7-day Komodo diving itinerary|/trips/7-days-komodo-diving]] covers the sites and the season.
**Upgrade:** charter a private wooden boat for Rinca and stay out for the flying foxes at Kalong at sunset, or spend two nights on a phinisi to wake up inside the park before the day boats arrive.
## Before you build this trip
Check the current park tariff and registration rules close to travel, because both have changed more than once. Carry cash in rupiah for drivers, the Wae Wuul guide and small purchases, since card payments are not universal outside hotels. Visa rules for Indonesia vary by nationality, so check the latest official guidance before you book flights.
Pack for heat and sun rather than rain in the dry season: closed walking shoes for the ranger treks and Wae Wuul, sandals for the boats, a hat, sunscreen and a refillable bottle. And keep your expectations honest about wildlife. Dragons on Rinca and Komodo are seen almost every day; dragons on Flores are seen some days. That difference is the point of doing both.
## Final verdict
If the dragons are why you are coming, give them more than a stop on a day tour. Five days from Labuan Bajo, with Komodo, Rinca and the Flores mainland on three separate mornings, is the most reliable way to see them well, and the buffer day means the weather cannot take that away from you.
Book Rinca on its own morning, start every wildlife day early, and treat Wae Wuul as the wild bonus rather than the main event. Do that, and you will have seen the world's largest lizard in three different settings, which very few visitors to Komodo ever do.
## Related itineraries
[[5 days in Labuan Bajo and Komodo|/trips/5-days-labuan-bajo-komodo]] if you want more snorkelling and island time around the dragons.
[[10 days across Komodo and Flores|/trips/10-days-komodo-flores]] if you would rather keep going overland to Kelimutu.
[[Labuan Bajo to Komodo Island transport guide|/transport/labuan-bajo-to-komodo-island]] for the boat options in detail.
'''
FAQ=[
("Where is the best place to see Komodo dragons?","Rinca Island in Komodo National Park, for most visitors. It is close to Labuan Bajo, the ranger walk is short, and dragons are regularly seen near the ranger post. Komodo Island is the other near-certain option, usually combined with Padar on a day tour."),
("Are there Komodo dragons on Flores island?","Yes, a small wild population lives on Flores, mainly in the Wae Wuul nature reserve near Labuan Bajo and around Riung on the north coast. They are fewer and shyer than in the national park, so sightings are possible but not guaranteed."),
("Is Rinca or Komodo Island better for seeing dragons?","Rinca is usually better for a quick, reliable sighting because it is closer and the walk is short. Komodo Island has longer treks and the bigger name. If you can, do both on separate mornings, as this itinerary does."),
("How much does it cost to see Komodo dragons in 2026?","As a working estimate, budget a park entry of about IDR 250,000 per foreign visitor per day, a harbour fee of about IDR 25,000 and a ranger fee of about IDR 200,000 per group, plus the boat. Shared speedboat tours start around US$120 per person. Check the current tariff before you pay."),
("Can you see Komodo dragons without a tour?","Not inside the national park: entry is registered through licensed operators on the SiORA system and every walk is led by a ranger. On mainland Flores you can visit the Wae Wuul reserve by car, but go with a local guide."),
("How many days do you need in Labuan Bajo to see the dragons?","One full day covers a single sighting on a day tour. Three days lets you visit Komodo and Rinca on separate mornings. Five days, as here, adds the Flores mainland and a buffer for cancelled boats."),
("Are Komodo dragons dangerous to visitors?","They can be. Their bite is dangerous and they move fast over short distances, which is why every walk in the park is led by a ranger. Stay behind the ranger, keep your distance and follow instructions, and the walk is safe."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"kd-{p}{cnt[0]}"
def spans(text,markdefs):
    out=[];pat=re.compile(r"\*\*(.+?)\*\*|\[\[(.+?)\|(.+?)\]\]");pos=0
    for m in pat.finditer(text):
        if m.start()>pos: out.append(dict(_type="span",_key=K("s"),marks=[],text=text[pos:m.start()]))
        if m.group(1): out.append(dict(_type="span",_key=K("s"),marks=["strong"],text=m.group(1)))
        else:
            k=K("m"); tgt=m.group(3)
            if tgt.startswith("/"): markdefs.append(dict(_key=k,_type="externalLink",href=tgt,blank=False))
            else: markdefs.append(dict(_key=k,_type="affiliateLinkRef",placeholderId=tgt))
            out.append(dict(_type="span",_key=K("s"),marks=[k],text=m.group(2)))
        pos=m.end()
    if pos<len(text): out.append(dict(_type="span",_key=K("s"),marks=[],text=text[pos:]))
    return out
body=[];tbl=[];cap=[None]
def flush():
    global tbl
    if tbl:
        rows=[[c.strip() for c in r.strip().strip("|").split("|")] for r in tbl if not set(r.strip())<=set("|-: ")]
        cols=rows[0]; cols[0]=cols[0] or "Factor"
        assert all(len(r)==len(cols) for r in rows), "ragged table"
        body.append(dict(_type="comparisonTable",_key=K("t"),caption=cap[0],columns=cols,rows=[dict(_key=K("r"),cells=r) for r in rows[1:]]))
        tbl=[];cap[0]=None
for l in SRC.strip().split("\n"):
    if l.startswith("|"): tbl.append(l); continue
    flush()
    if l.startswith("^^ "): cap[0]=l[3:]; continue
    md=[]
    if l.startswith("## "): body.append(dict(_type="block",_key=K("b"),style="h2",markDefs=md,children=spans(l[3:],md)))
    elif l.strip(): body.append(dict(_type="block",_key=K("b"),style="normal",markDefs=md,children=spans(l,md)))
flush()
title="Where to See Komodo Dragons: 5 Days on Komodo, Rinca and Flores"
intro="Most visitors see a Komodo dragon for ten minutes, at midday, between a viewpoint and a beach. This five-day plan from Labuan Bajo does it properly: Komodo Island on a classic park day, Rinca on its own early morning for the closest sightings, and the Wae Wuul reserve on mainland Flores, where wild dragons live outside the national park. It answers where you actually see them, what the 2026 park fees look like, and how to keep a cancelled boat from costing you the trip."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Where to See Komodo Dragons: A 5-Day Labuan Bajo Plan",
 metaDescription="Komodo, Rinca or mainland Flores? Where you actually see Komodo dragons, the 2026 park fees, and a 5-day plan from Labuan Bajo with a weather buffer.",
 focusKeyword="where to see Komodo dragons",intro=intro,
 route="Bali, Labuan Bajo (4 nights), Komodo Island and Padar (day trip), Rinca Island (morning trip), Wae Wuul reserve on mainland Flores, Bali",
 routeSummary="Bali → Labuan Bajo → Komodo Island → Rinca → Wae Wuul → Bali",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="April to November",logisticsComplexity="moderate",
 destinationPrimary="komodo_flores",travelStylePrimary="wildlife_nature",travelStyleSecondary=["beach_islands","adventure_volcanoes"],
 travellerTypes=["couples","friends","solo_travellers"],tripLengthBucket="short_escape",tripLengthDays=5,vibe="balanced",
 experienceTags=["komodo_dragons","wildlife","ranger_trek","boat_day_trip","snorkelling","viewpoint_hike"],
 primaryAffiliatePartner="viator",secondaryAffiliatePartners=["klook","12go","booking","airalo"],
 body=body,affiliateLinks=AFF,faq=[dict(_key=K("f"),question=q,answer=a) for q,a in FAQ])
txt=json.dumps(doc,ensure_ascii=False)
bad=["—","–","hidden gem","must-see","must see","paradise","immerse yourself","unforgettable","something for everyone","vibrant culture","crystal-clear","crystal clear","breathtaking","rich history","local charm","authentic experience","off the beaten path","once-in-a-lifetime","bucket list","dream destination","(SEARCH"]
fails=[b for b in bad if b.lower() in txt.lower()]
if re.search(r"\d[\d,]* reviews",txt): fails.append("reviews artefact")
keys=re.findall(r'"_key": "([^"]+)"',json.dumps(doc))
if len(keys)!=len(set(keys)): fails.append("dup keys")
refs={m["placeholderId"] for b in body for m in b.get("markDefs",[]) if m["_type"]=="affiliateLinkRef"}
have={a["placeholderId"]:a["affiliateUrl"] for a in AFF}
for r in refs:
    if not have.get(r): fails.append("aff "+r)
if len(doc["metaTitle"])>60 or len(doc["metaDescription"])>155: fails.append("meta")
words=len(re.findall(r"\w+"," ".join(c["text"] for b in body if b["_type"]=="block" for c in b["children"])))
for i,b in enumerate(body):
    if b.get("style")=="h2" and "?" in b["children"][0]["text"]:
        print("  H2",b["children"][0]["text"],"->",len(" ".join(c["text"] for c in body[i+1]["children"]).split()),"words")
print("meta",len(doc["metaTitle"]),len(doc["metaDescription"]),"refs",sorted(refs),"unused",set(have)-refs,"words",words,"faq",len(FAQ),"blocks",len(body))
print("FAILS",fails)
json.dump(doc,open("content/articles/"+SLUG+".json","w"),indent=2,ensure_ascii=False)
