# PARTE 2, 2026-11-06 generator run: first Kei Islands (Southeast Maluku) itinerary.
# Gap: the site had zero coverage of the Kei Islands, and wild_indonesia x
# relaxed beach weeks lean on Sulawesi. GSC 2026-10-07..11-03 has no clean
# no-page query (visa, costs, transport and the closed Bali-islands cluster
# dominate; every itinerary query already maps to a page), so this is the
# matrix fallback in a preferred region, with Ambon as the shared gateway to the
# live Banda Islands route.
# Facts: Ambon-Langgur (LUV) flights about 1h10, one to two a day (12Go,
# browser-checked 2026-11-06, Sriwijaya / Lion); Jakarta-Ambon 33 departures a
# day, fastest 3h35; Makassar-Ambon 1h40; Jakarta-Langgur direct = 0 trips on
# 12Go. Ngurbloat entry Rp 10,000 per motorbike / Rp 20,000 per car (GNFI Oct
# 2025, same as Antara). Ngurtavur about 30 min by speedboat, Lonely Planet
# charter Rp 700,000 for about 1.5h from Debut. Bair 30-60 min by boat from
# Dullah. Goa Hawang in Letvuan, 30-40 min from Langgur. Elat-Langgur ferry
# about Rp 60,000 economy (Easybook listing). Pelni Ambon-Tual 18-24h,
# infrequent. Dry season roughly May to September/October per most guides,
# sources disagree by a month.
#   python3 scripts/build-kei-islands-2026-11-06.py
import json,re,datetime
SLUG="7-days-kei-islands-maluku-beaches"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_JAKARTA_AMBON",affiliateUrl="https://12go.asia/en/travel/jakarta/ambon?z=16022946",publicUrl="https://12go.asia/en/travel/jakarta/ambon",anchorText="Jakarta to Ambon flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_MAKASSAR_AMBON",affiliateUrl="https://12go.asia/en/travel/makassar/ambon?z=16022946",publicUrl="https://12go.asia/en/travel/makassar/ambon",anchorText="Makassar to Ambon flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_AMBON_LANGGUR",affiliateUrl="https://12go.asia/en/travel/ambon/langgur-airport?z=16022946",publicUrl="https://12go.asia/en/travel/ambon/langgur-airport",anchorText="Ambon to Langgur flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_LANGGUR_AMBON",affiliateUrl="https://12go.asia/en/travel/langgur-airport/ambon?z=16022946",publicUrl="https://12go.asia/en/travel/langgur-airport/ambon",anchorText="Langgur to Ambon flights on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_AMBON",affiliateUrl=BK%"Ambon",publicUrl=BK%"Ambon",anchorText="hotels in Ambon on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_LANGGUR",affiliateUrl=BK%"Langgur",publicUrl=BK%"Langgur",anchorText="Kei Islands stays on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"kei-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Are the Kei Islands worth the journey?
Yes, if what you want is long empty beaches and slow days more than sights. The Kei Islands in Southeast Maluku have powder-soft white sand, a sandbar that runs out into open sea and a karst lagoon on Bair, with almost no other foreign visitors. The price is two flights and at least one night in Ambon.
Kei sits far out in the Banda Sea, closer to Papua than to Bali, and it has never had a tourist industry to speak of. That is the whole appeal and the whole difficulty. There is no fast boat circuit, no beach club and very little English, and the flights from Ambon are few. What you get in return is a week where the beach in front of your room is three kilometres long and often has nobody on it. This plan gives Kei Kecil five nights, because anything shorter spends too much of the trip in airports.
## Who this trip is for, and who it is not
This route is for couples and friends who have already done Bali or Lombok and want a beach week that feels far away, for travellers who are happy with simple guesthouses, and for anyone who likes swimming, snorkelling from the shore and reading in the shade more than a full daily programme.
It is not for a first trip to Indonesia, for anyone on a tight schedule, or for travellers who need reliable Wi-Fi, varied restaurants and a dive shop on every corner. Flights to Langgur are few and get cancelled, so a missed connection can cost a day. If you want a quieter beach week that is easier to reach, look at [[6 days in Belitung|/trips/6-days-belitung-granite-beaches-island-hopping]] or [[Tanjung Bira in South Sulawesi|/trips/6-days-tanjung-bira-south-sulawesi-beaches]] first.
## Trip at a glance
**Duration:** 7 days, 6 nights: 1 in Ambon, 5 on Kei Kecil.
**Route:** Ambon, a short flight to Langgur on Kei Kecil, a base on the west coast near Ngurbloat beach, boat days to the Ngurtavur sandbar and Bair island, Goa Hawang, an optional day on Kei Besar, then back to Ambon.
**Pace:** relaxed. Two boat days and one road morning; the rest is beach time.
**Best for:** couples, friends and repeat visitors to Indonesia.
**Best time:** most guides put the drier months at roughly May to September or October, though sources disagree by a month either way. Ask your guesthouse about sea conditions before you book boat days.
**Budget:** moderate. Flights are the biggest cost; rooms, food and boats are cheap once you are there, but boats are priced per boat, so they cost more for two people than for six.
**Logistics:** complex for the distance, simple once you land. One regional flight each way and cash for nearly everything.
## Why this route makes sense
The route is built around the one fragile link, the Ambon to Langgur flight. You overnight in Ambon on the way in so that a late or cancelled connection costs you an evening, not a beach day. You then stay in one place on Kei Kecil for five nights, because the main sights are all within an hour of the west coast and moving bases would only add packing.
The boat days come early in the stay, on Days 3 and 4, so that if the sea is too rough you still have days in hand to move them. The optional Kei Besar day sits after them for the same reason. On the way out you fly back to Ambon with time to connect, rather than trying to reach Jakarta or Bali the same afternoon on a tight transfer.
## How do you get to the Kei Islands?
By air through Ambon. There are no direct flights from Jakarta or Bali to Langgur, the Kei airport, so most travellers fly to Ambon first and connect on a regional flight of about 1 hour 10 minutes. When we checked in November 2026, 12Go listed one or two Ambon to Langgur flights a day.
Ambon itself is easy to reach: 12Go listed 33 departures a day from Jakarta, the fastest about 3 hours 35 minutes, and a handful from Makassar at about 1 hour 40 minutes. The Langgur leg is the one to watch. Schedules on small regional routes change often, so confirm current flights before you book anything on Kei. Pelni ships also call at Tual, but only every week or two and the trip from Ambon takes roughly 18 to 24 hours, according to traveller guides, so it only works with time to spare.
^^ Getting to Kei Kecil: the realistic options, with working estimates
| Leg | How | Time | When we checked | Watch out for |
| Jakarta to Ambon | Flight | Fastest about 3h35 | About 33 departures a day | Red-eye timings are common |
| Makassar to Ambon | Flight | About 1h40 | A few departures a day | Early-morning departures |
| Ambon to Langgur | Flight | About 1h10 | One or two a day | Delays and cancellations; book a buffer night |
| Ambon to Tual | Pelni ship | About 18 to 24 hours | Every week or two | Schedules shift; cabins sell out |
## Day 1: Arrive in Ambon
**Morning.** Fly into Ambon. Compare [[Jakarta to Ambon flights on 12Go|TWELVEGO_JAKARTA_AMBON]] or [[Makassar to Ambon flights on 12Go|TWELVEGO_MAKASSAR_AMBON]] if you are coming from Sulawesi. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you leave home; coverage on Kei is patchy away from Langgur and you will want maps for the first day.
**Afternoon.** Check in and rest. Ambon is a working city rather than a beach town, so treat today as a buffer, not a sightseeing day. If you arrive early, Natsepa beach east of the city is the usual afternoon outing, known for its rujak fruit salad stalls.
**Evening.** Dinner in the city and an early night: the Langgur flight usually leaves in the morning.
**Base:** Ambon, 1 night. Compare [[hotels in Ambon on Booking.com|BOOKING_AMBON]] and choose something with an easy run to Pattimura airport, which sits across the bay from the city.
**Booking logic:** book the Ambon to Langgur flight as a separate ticket only if you are happy to lose it; better, book it for the morning after you land, which is what this plan does.
**Travel note:** withdraw enough cash in Ambon for the first days on Kei. There are ATMs in Langgur and Tual, but guesthouses, boats and warungs on Kei Kecil work in cash.
## Day 2: Fly to Langgur and the first afternoon on Ngurbloat
**Morning.** Take the regional flight from Ambon to Langgur, about 1 hour 10 minutes; compare [[Ambon to Langgur flights on 12Go|TWELVEGO_AMBON_LANGGUR]]. Langgur and Tual, the twin towns either side of a narrow strait, are where the airport, the market and the ATMs are.
**Afternoon.** Drive about 30 minutes to the west coast and check in near Ngurbloat, also called Pasir Panjang, the long beach that made Kei's name. Entry to the beach was Rp 10,000 per motorbike and Rp 20,000 per car in a 2025 report by Good News From Indonesia, the same rate Antara reported earlier. The sand here is famously fine, almost like flour, and the beach runs for several kilometres.
**Evening.** Ngurbloat faces west, so the sunset is the reason to be on the sand at the end of the day. Eat at your guesthouse; there are very few restaurants on this stretch.
**Base:** Kei Kecil west coast, 5 nights. Compare [[Kei Islands stays on Booking.com|BOOKING_LANGGUR]], but many of the best guesthouses near Ngurbloat and Ohoidertawun are booked by message rather than online.
**Booking logic:** ask your guesthouse to arrange the airport pickup and the two boat days when you book. They know the boatmen, the tide times and the current price.
**Travel note:** the tide range on this coast is large. At low tide some beaches, Ohoidertawun especially, turn into wide flats, so check tide times before planning a swim.
## Day 3: Boat day to the Ngurtavur sandbar
**Morning.** Leave early for Ngurtavur, the narrow sandbar that curves out into the sea off Pulau Warbal, about 30 minutes by speedboat from Kei Kecil. Lonely Planet gives a charter price of about Rp 700,000 for a trip of roughly an hour and a half from Debut; treat that as a working estimate and agree the price before you get in the boat. Australian pelicans are sometimes seen on the sandbar.
**Afternoon.** Swim and snorkel off the sandbar, then head back before the afternoon wind picks up. Many boatmen combine Ngurtavur with a stop at a nearby village or a second beach; ask what is included.
**Evening.** Back on the west coast for sunset and an early dinner.
**Booking logic:** boats are priced per boat, not per person, so pair up with other guests at your guesthouse if you can. Bring water, a hat and reef-safe sunscreen; there is no shade on the sandbar.
**Travel note:** Ngurtavur is at its best around low to mid tide, when the sandbar is long and exposed. Let your boatman pick the time.
## Day 4: Bair island and the lagoon
**Morning.** Drive to Dullah on the north of the island and take a boat to Bair, about 30 to 60 minutes depending on the boat and the sea. Bair is a karst island with a narrow inlet that opens into a calm green lagoon, often described as a small Raja Ampat, and it can only be reached by chartered boat.
**Afternoon.** Swim in the lagoon and snorkel at its mouth, then return to the west coast. The water inside is sheltered even on days when the open sea is choppy, which makes this the safer of the two boat days when the wind is up.
**Evening.** A slow evening at your guesthouse. Grilled fish is the standard dinner on Kei, usually with rice and a sambal of lime and chilli.
**Booking logic:** book the same boatman as Day 3 if he was good. A full day of boat hire on Kei is often quoted somewhere around Rp 1,000,000 to 1,500,000 in traveller guides, depending on distance and boat; confirm the current price locally.
**Travel note:** if Day 3 was rained off, swap the order. Bair is the better choice on a windy day, Ngurtavur on a calm one.
## Day 5: Goa Hawang and an easy afternoon
**Morning.** Go to Goa Hawang, a limestone cave with a clear blue freshwater pool inside, in the village of Letvuan, about 30 to 40 minutes by road from Langgur. It is small and you will not need more than an hour; the water is cold and swimming is usually allowed.
**Afternoon.** Back to the beach. If you want to snorkel without a boat, fishermen at Ohoidertawun can take you out to the outer reef for a short trip at high tide; agree the price on the beach.
**Evening.** Ask your guesthouse whether there is anything on in the nearby villages. Kei villages, called ohoi, still run much of daily life under their customary law, and visitors are welcome at church services and festivals if they dress modestly.
**Travel note:** cave entry is paid in cash at the site. Fees are small; confirm the current price on the day.
## Day 6: Kei Besar, or a second slow day
**Morning.** If the sea is calm and you want a change of scene, take the ferry to Elat on Kei Besar, the larger, steeper and even less visited island to the east. An economy ticket was listed at around Rp 60,000 on Easybook. Hire a car and driver at Elat for the coast road.
**Afternoon.** Kei Besar has quiet beaches and hill villages, but few facilities, and the ferry times mean a long day. If that sounds like hard work, stay on Kei Kecil instead and spend the day on Ngurbloat; on a trip this slow, that is a perfectly good choice.
**Evening.** Last night on the coast. Settle the bill in cash and confirm the airport transfer.
**Booking logic:** do not book Kei Besar in advance. Decide the evening before, after asking your guesthouse about the ferry and the weather.
**Travel note:** if your Langgur flight tomorrow is early, skip Kei Besar. Missing the ferry back would mean missing the flight.
## Day 7: Fly back to Ambon and onward
**Morning.** Drive to the airport in Langgur and fly back to Ambon; compare [[Langgur to Ambon flights on 12Go|TWELVEGO_LANGGUR_AMBON]].
**Afternoon.** Connect onward to Jakarta, Makassar or Bali, or stay another night in Ambon if your onward flight is the next day.
**Booking logic:** leave at least four hours between landing in Ambon and your onward flight, or book a second Ambon night. Do not put a non-refundable international flight on the same day as the Langgur leg.
**Travel note:** if you are flying on to the Banda Islands, Ambon is the gateway for both, so the two trips combine naturally.
## How do the Kei Islands compare with other remote beach weeks in Indonesia?
Kei is the most remote and least visited of the quiet beach weeks on this site, with the softest sand and the fewest facilities. Belitung and Tanjung Bira are easier to reach, Banda adds history and better diving, and all three have more choice of places to stay. Pick Kei for emptiness, not convenience.
^^ Four quiet beach weeks compared, with working estimates
| Trip | How you get there | Beach and water | What else is there | Facilities |
| Kei Islands | Two flights via Ambon | Long, very fine white sand, sandbar and lagoon | Villages, a cave pool, Kei Besar | Very simple, cash only |
| Belitung | One short flight from Jakarta | Granite boulder beaches, island hopping | Lighthouse island, easy drives | Good choice of hotels |
| Tanjung Bira | Flight to Makassar, then a long drive | White sand, reef close to shore | Phinisi boatyards | Simple to mid-range |
| Banda Islands | Flight or boat via Ambon | Small beaches, excellent reefs | Nutmeg history, forts, volcano hike | Simple guesthouses |
## What to book early, and what to keep flexible
Book early: the international or Jakarta flight to Ambon, your Ambon hotel for the first night, the Ambon to Langgur flight for the following morning, and your Kei guesthouse, which can fill around Indonesian holidays and the Pesona Meti Kei festival.
Keep flexible: the two boat days, which depend on the wind and the tide, the Kei Besar day, and your onward plans from Ambon. A refundable or changeable fare on the Langgur legs is worth paying for.
## What mistakes do travellers make in the Kei Islands?
The biggest mistake is connecting through Ambon on the same day as an international flight. The Langgur leg is short but fragile, and one delay can cost a day at each end. The others are arriving without enough cash, booking boat days for fixed dates, and expecting beaches to look the same at low tide.
Other mistakes we see in planning: treating Kei as a four-day trip, which leaves two of the four days in transit; hopping between guesthouses when everything is within an hour of one base; and packing for a resort. Bring a headtorch, a dry bag for the boats, reef-safe sunscreen and anything you need from a pharmacy, since choice on Kei is limited.
## What to cut, adapt or upgrade
**Cut:** with five days, drop the Kei Besar day and one beach day, and fly Ambon to Langgur on arrival day only if your first flight lands in Ambon early in the morning.
**Adapt:** divers should ask at their guesthouse about the outer reefs, but come with modest expectations; Kei is a snorkelling and beach trip first. If you have more time, add the [[Banda Islands spice route|/trips/9-days-banda-islands-spice-route]] through Ambon, which suits the same traveller.
**Upgrade:** hire one boat for your stay rather than booking day by day, so the same boatman can choose the tides and fit in an extra reef stop.
## Before you build this trip
Indonesia's visa on arrival rules apply at Jakarta, Bali and the other international gateways, not at Ambon or Langgur, so you will clear immigration before the domestic legs; check the latest official guidance before you fly. Kei is largely Catholic and Protestant with Muslim communities, and modest dress away from the beach is appreciated in every village.
Health and practicalities: there is basic medical care in Tual and Langgur but nothing for serious emergencies, so take travel insurance that covers evacuation. Drink bottled or filtered water, carry cash in small notes, and expect power cuts in the evenings at some guesthouses. Mobile data works around Langgur and is weaker on the coast.
## Final verdict: are the Kei Islands worth it?
Yes, for the right traveller. If you have a week, you have already seen the easier islands and you are happy trading comfort for empty sand, Kei is among Indonesia's most rewarding beach trips. If you have less than six days, or you need things to run on time, pick an easier beach and save Kei for later.
## Related itineraries
For the same Ambon gateway with more history, see the [[9-day Banda Islands spice route|/trips/9-days-banda-islands-spice-route]]. For quiet beaches that are easier to reach, try [[6 days in Belitung|/trips/6-days-belitung-granite-beaches-island-hopping]] or [[Tanjung Bira in South Sulawesi|/trips/6-days-tanjung-bira-south-sulawesi-beaches]].
'''
FAQ=[
("How do you get to the Kei Islands from Bali or Jakarta?","Fly to Ambon first, then take a regional flight to Langgur on Kei Kecil, about 1 hour 10 minutes. There were no direct flights from Jakarta or Bali to Langgur when we checked in November 2026. Most travellers spend a night in Ambon so that a delay on the short leg does not cost a day."),
("How many days do you need in the Kei Islands?","Seven days is a sensible minimum, with five nights on Kei Kecil. The flights take most of a day at each end, so a shorter trip leaves very little beach time. Five nights covers Ngurbloat, the Ngurtavur sandbar, Bair island, Goa Hawang and a spare day for weather."),
("What is the best time to visit the Kei Islands?","Most guides put the drier months at roughly May to September or October, though sources disagree by a month. Boat days depend on the wind and the tide in any month, so keep them flexible and ask your guesthouse about conditions before you go out."),
("Is Ngurbloat beach really the softest sand in the world?","It is often described that way, including by Lonely Planet, and the sand is unusually fine and pale. Whether it is the softest anywhere is impossible to prove, but it is the reason most people come to Kei. Entry was Rp 10,000 per motorbike and Rp 20,000 per car in 2025."),
("How much does a boat trip to Ngurtavur cost?","Lonely Planet gives about Rp 700,000 to charter a boat for roughly an hour and a half from Debut, and traveller guides quote around Rp 1,000,000 to 1,500,000 for a full day. Boats are priced per boat, so share with other guests if you can, and agree the price before you leave."),
("Can you use cards in the Kei Islands?","Rarely. Guesthouses, boats, warungs and entry fees on Kei Kecil are paid in cash. There are ATMs in Langgur and Tual, but withdraw enough in Ambon for the first few days in case they are empty or offline."),
("Can you combine the Kei Islands with the Banda Islands?","Yes. Both are reached through Ambon, so a two-week trip can do Banda and Kei back to back with a night in Ambon between them. Allow a buffer day for each regional connection, since flights and boats on both routes are infrequent."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"kei-{p}{cnt[0]}"
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
        cols=rows[0]
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
title="7 Days in the Kei Islands: Ngurbloat, Ngurtavur and Bair in Southeast Maluku"
intro="The Kei Islands sit far out in the Banda Sea, two flights beyond Bali, with flour-soft white sand, a sandbar that curls into open water and a karst lagoon on Bair. This seven-day plan routes through Ambon with a buffer night, gives Kei Kecil five slow nights from one base, and is honest about the fragile Langgur flight and the cash-only reality."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Kei Islands Itinerary: 7 Days in Southeast Maluku",
 metaDescription="A relaxed 7-day Kei Islands itinerary via Ambon: Ngurbloat beach, the Ngurtavur sandbar and Bair lagoon, with flights, boat costs and timing.",
 focusKeyword="Kei Islands itinerary",intro=intro,
 route="Ambon (1 night), flight to Langgur, Kei Kecil west coast near Ngurbloat (5 nights) with boat days to Ngurtavur and Bair, Goa Hawang, optional Kei Besar, fly back to Ambon",
 routeSummary="Ambon → Langgur → Ngurbloat → Ngurtavur → Bair → Goa Hawang → Ambon",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to October",logisticsComplexity="complex",
 destinationPrimary="wild_indonesia",travelStylePrimary="beach_islands",travelStyleSecondary=["remote_offbeat","diving_snorkeling"],
 travellerTypes=["couples","friends","repeat_travellers"],tripLengthBucket="one_week",tripLengthDays=7,vibe="relaxed",
 experienceTags=["beach","snorkeling","sandbar","island_hopping","maluku"],
 primaryAffiliatePartner="12go",secondaryAffiliatePartners=["booking","airalo"],
 body=body,affiliateLinks=AFF,faq=[dict(_key=K("f"),question=q,answer=a) for q,a in FAQ])
txt=json.dumps(doc,ensure_ascii=False)
bad=["—","–","hidden gem","must-see","must see","paradise","immerse yourself","unforgettable","something for everyone","vibrant culture","crystal-clear","crystal clear","breathtaking","rich history","local charm","authentic experience","off the beaten path","off-the-beaten-path","once-in-a-lifetime","bucket list","dream destination","(SEARCH"]
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
        n=len(" ".join(c["text"] for c in body[i+1]["children"]).split())
        print("  H2",b["children"][0]["text"],"->",n,"words", "" if 40<=n<=60 else "<-- OUT OF 40-60")
print("meta",len(doc["metaTitle"]),len(doc["metaDescription"]),"refs",sorted(refs),"unused",set(have)-refs,"words",words,"faq",len(FAQ),"blocks",len(body),"tables",sum(1 for b in body if b["_type"]=="comparisonTable"))
print("FAILS",fails)
json.dump(doc,open("content/articles/"+SLUG+".json","w"),indent=2,ensure_ascii=False)
