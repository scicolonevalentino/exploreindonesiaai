# PARTE 2, 2026-11-02 generator run: first South Sulawesi beach itinerary.
# Gap: the Sulawesi cluster has eight articles (Toraja, Bunaken, Togean,
# Wakatobi, Lembeh) and none on the south coast beaches; the 7-day Toraja and
# Makassar article says plainly that it is "a weak one for anyone hoping for
# beaches". GSC 2026-10-03..10-30 shows no clean no-page query this week (the
# demand is visa, costs and transport, all served), so the topic comes from the
# matrix, inside the Sulawesi cluster where "sulawesi itinerary" (41 impr, pos
# 46) and "sulawesi route" (40 impr, pos 33.7) show the region has demand and
# thin footprint.
# Facts: DAMRI airport-Bira bus (Kompas TV, 29/02/2024), ASDP Bira-Selayar fares
# and ferizy-only ticketing (detikSulsel, 2025), UNESCO 12.COM 11.b.13 (phinisi
# boatbuilding, Tana Beru/Bira/Batu Licin), 12Go jakarta/makassar (97/day,
# fastest 2h25) and bali/makassar (102/day, 1h20) browser-checked 2026-11-02;
# 12Go makassar/bira-port, makassar-airport/bira-port, bira-port/makassar = 0 trips.
#   python3 scripts/build-tanjung-bira-2026-11-02.py
import json,re,datetime
SLUG="6-days-tanjung-bira-south-sulawesi-beaches"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_JAKARTA_MAKASSAR",affiliateUrl="https://12go.asia/en/travel/jakarta/makassar?z=16022946",publicUrl="https://12go.asia/en/travel/jakarta/makassar",anchorText="Jakarta to Makassar flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_BALI_MAKASSAR",affiliateUrl="https://12go.asia/en/travel/bali/makassar?z=16022946",publicUrl="https://12go.asia/en/travel/bali/makassar",anchorText="Bali to Makassar flights on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_MAKASSAR",affiliateUrl=BK%"Makassar",publicUrl=BK%"Makassar",anchorText="hotels in Makassar on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_TANJUNG_BIRA",affiliateUrl=BK%"Tanjung+Bira",publicUrl=BK%"Tanjung+Bira",anchorText="Tanjung Bira stays on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"tb-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Is Tanjung Bira worth the drive from Makassar?
Yes, if you want a quiet beach week rather than a scene. Tanjung Bira, at the southern tip of South Sulawesi, has soft white sand, a reef ten minutes offshore and the boatyards where Indonesia's wooden phinisi ships are still built by hand. The price is a five to six hour drive each way.
Most travellers who reach South Sulawesi go north to Tana Toraja and never see the south coast. That leaves Bira as a beach known mostly to people from Makassar, busy on Indonesian holidays and quiet the rest of the time. This route gives it four nights, which is what the drive deserves. It pairs the beach and the snorkelling with the one thing nowhere else in Indonesia offers in the same way: walking among half-built wooden ships taller than a house, on the beach where they are made.
## Who this trip is for, and who it is not
This route is for couples, friends and repeat Indonesia travellers who already know Bali or the Gilis and want a slower, less visited coast, and who are happy with simple resorts, early nights and one long road day at each end. It works well added to a Toraja trip, since both start from Makassar.
It is not for travellers who want nightlife, a choice of restaurants or a short transfer. South Sulawesi is a conservative, largely Muslim region, the evenings in Bira are quiet, and there is no fast boat or flight to cut the drive. If you want a beach with an easy arrival, the [[6-day Belitung itinerary|/trips/6-days-belitung-granite-beaches-island-hopping]] is one hour from Jakarta by plane.
## Trip at a glance
**Duration:** 6 days, 5 nights: 1 in Makassar, 4 in Tanjung Bira.
**Route:** Makassar (Sultan Hasanuddin airport, UPG), the south coast road through Gowa, Takalar, Jeneponto, Bantaeng and Bulukumba, Tanjung Bira, and back the same way.
**Pace:** relaxed. Two long road days, one boat morning, one boatyard morning and two slow beach days.
**Best for:** couples, friends and repeat visitors who want a quiet beach and a reason to be there beyond the sand.
**Best time:** broadly May to October, the drier months in South Sulawesi. From around November to March the west monsoon brings rain and rougher water, and boat days are more often cancelled.
**Budget:** moderate. The private car for the two road days is the largest single cost; rooms, food and boat hire in Bira are modest by Indonesian standards.
**Logistics:** moderate. One long transfer each way, no online booking for the coast road, and a flight home that must be timed around the drive.
## Why this route makes sense
Bira is a dead end, and that decides the shape of the trip. The south coast road runs about 200 kilometres from Makassar to the tip of the peninsula and stops, so there is no loop to make and nothing gained by moving between bases. The plan is one night in Makassar to absorb the flight, one long drive, four nights in one place and the same drive back.
Four nights is the right number. Fewer, and the two road days eat most of the trip; more, and you will have done the reef, the boatyards and the beaches twice. Putting the boatyards on Day 4 rather than on the drive in means you see them in the morning, when the builders are working and you are not tired from the road.
## How do you get from Makassar to Tanjung Bira?
By road, about 200 kilometres along the south coast, which travellers report takes five to six hours by car without long stops. The options are a private car with driver, the DAMRI bus from Makassar airport, or a shared car or bus from Terminal Malengkeri. None is sold on 12Go; you arrange it locally.
^^ Makassar to Tanjung Bira: the three ways, with working estimates
| Option | Where it leaves | Time | Working cost | Best for |
| Private car with driver | Your Makassar hotel or the airport | About 5 to 6 hours | Priced per car per day; get a quote from your hotel | Couples and groups, and anyone with luggage |
| DAMRI airport bus | Sultan Hasanuddin airport, 20:00 daily | Most of the night | Rp 200,000 per person at launch in 2024 | Arriving late, on a budget |
| Shared car or bus | Terminal Malengkeri, early morning | 5 to 6 hours plus waiting | Low, paid per seat in cash | Solo travellers on a tight budget |
The DAMRI service was launched in March 2024 at Rp 200,000 on a 288 kilometre route, with one departure a day at 20:00 from the airport and from Bira, according to Kompas TV's report of the launch. Check that it is still running before you plan around it. Shared cars and buses leave Malengkeri when full, so start early. For most visitors the private car is the sensible choice, and it lets you stop for lunch in Bantaeng.
## Day 1: Land in Makassar
**Morning.** Fly into Sultan Hasanuddin International Airport (UPG). Makassar is one of the best-connected cities in eastern Indonesia: compare [[Jakarta to Makassar flights on 12Go|TWELVEGO_JAKARTA_MAKASSAR]], with the fastest around 2 hours 25 minutes, or [[Bali to Makassar flights on 12Go|TWELVEGO_BALI_MAKASSAR]] at about 1 hour 20 minutes. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you land.
**Afternoon.** Taxi into the city, about 30 to 45 minutes depending on traffic, and walk Fort Rotterdam, the old Dutch fort on the waterfront, in the cooler late afternoon.
**Evening.** Watch the sunset from Losari Beach, the city's seafront promenade, then eat coto Makassar, the beef and offal soup the city is named for, or konro, grilled ribs.
**Base:** Makassar, 1 night. Compare [[hotels in Makassar on Booking.com|BOOKING_MAKASSAR]] and stay near Losari or Fort Rotterdam so the morning pickup is simple.
**Booking logic:** book tomorrow's private car through your hotel tonight and agree what the price covers: fuel, tolls, parking and the driver's meals.
**Travel note:** if you land after mid afternoon, do not try to drive south the same day. The coast road is slow, and arriving in Bira after dark wastes the first view.
## Day 2: The south coast road to Bira
**Morning.** If you are up early, the Paotere harbour in north Makassar is where wooden cargo boats unload, a preview of the ships you will see being built. Leave the city by about 8:00 to stay ahead of the traffic.
**Afternoon.** The road runs through Gowa, Takalar, Jeneponto, Bantaeng and Bulukumba, past salt pans and maize fields with the sea on your right. Stop for lunch in Bantaeng, roughly the halfway point. Allow five to six hours in total, more with stops or on a holiday weekend.
**Evening.** Arrive in Tanjung Bira in the late afternoon and walk straight onto the beach. The sand on the main Bira beach is fine and pale enough that Indonesian travel writers compare it to flour.
**Base:** Tanjung Bira, 4 nights. Look at [[Tanjung Bira stays on Booking.com|BOOKING_TANJUNG_BIRA]] and choose by beach: the main strip is livelier and close to the boats, while Pantai Bara, a little further north, is quieter.
**Booking logic:** book the Bira rooms before you fly. There are not many good ones, and on Indonesian long weekends and school holidays the town fills with visitors from Makassar.
**Travel note:** carry cash from Makassar. Bira has limited ATMs, and boats, warungs and small guesthouses are paid in rupiah.
## Day 3: Liukang Loe and the reef
**Morning.** Hire a boat from the beach to Liukang Loe, the small island about ten minutes off Bira, and snorkel the reef around it, adding a stop at Pulau Kambing if the sea is calm. As a working estimate, boat hire runs IDR 250,000 to 500,000 for a boat that takes five or six people, agreed with the boatman before you leave.
**Afternoon.** Back on the main beach by lunch. Swim, sleep, read; this is the reason you drove.
**Evening.** Sunset from the beach, then dinner at your resort or one of the warungs on the main road.
**Booking logic:** nothing to pre-book. Ask your resort the evening before which boatman they use, and settle the price, the stops and the return time on the sand.
**Travel note:** bring your own mask if you care about the fit; rental gear on the beach is basic. Go in the morning, when the water is usually calmer.
## Day 4: Tana Beru boatyards and Ara
**Morning.** Drive or take a scooter to Tana Beru, on the coast road shortly before Bira, where phinisi schooners are built on the beach from timber, by hand and largely without plans. UNESCO added the art of boatbuilding in South Sulawesi to its Intangible Cultural Heritage list in 2017, naming Tana Beru, Bira and Batu Licin as its centres. Go in the morning, when the crews are working.
**Afternoon.** Continue to Ara, the village most of the master builders come from, and then to the Apparalang cliffs east of Bira, where the limestone drops straight into deep blue water. Swim only where locals do and only on a calm day.
**Evening.** Back in Bira for a slow dinner.
**Booking logic:** no tickets. Ask permission before you walk into a yard or photograph the builders, and a small tip to whoever shows you around is the polite way to say thank you.
**Travel note:** many of the hulls now on the slipways are tour boats for Komodo and Raja Ampat rather than cargo ships. The building method is the same, and it is still worth seeing.
## Day 5: A slow day, or two dives
**Morning.** Walk or ride north to Pantai Bara for a quieter stretch of sand, or, if you are a certified diver, take two dives with a Bira dive shop. Bira's dive sites are known for current and cooler water than Bali, so they suit divers with some experience; let the shop choose the sites for the day's conditions.
**Afternoon.** Nothing scheduled. If the sea is flat, go back out to the reef.
**Evening.** Pack, settle your bills in cash, and confirm tomorrow's pickup time with your driver.
**Booking logic:** message a dive shop a day or two ahead in busy periods. Ask how they brief currents and whether they have oxygen on the boat.
**Travel note:** if you dive, the long drive tomorrow is a good surface interval, but your flight home should not be on the same day as the dives.
## Day 6: Back to Makassar and fly out
**Morning.** Leave Bira by about 7:00. The drive back takes the same five to six hours.
**Afternoon.** Go straight to the airport. Book nothing that departs before about 17:00, and later is safer; the coast road has no shortcuts if a truck breaks down in front of you.
**Travel note:** if the only flight that suits you leaves in the morning, spend the last night in Makassar instead and cut a night in Bira. Confirm current flight routes and times before you lock either hotel.
## How does Tanjung Bira compare with the Gili Islands and Belitung?
Bira is the quietest and the hardest to reach of the three. The Gilis have the easiest snorkelling and the most going on after dark; Belitung is one short flight from Jakarta with calm water and granite boulders. Bira offers soft sand, a working boatbuilding coast and very few foreign visitors, in exchange for a long drive.
^^ Three beach weeks in Indonesia, compared
| | Tanjung Bira | Gili Islands | Belitung |
| Getting there | Fly to Makassar, then 5 to 6 hours by road | Fast boat from Bali or a short boat from Lombok | About 1 hour by plane from Jakarta |
| Beach | Soft white sand, open to the sea | Sandy, with reef close to shore | Calm bays among granite boulders |
| Snorkelling | Liukang Loe by boat, 10 minutes | Turtles from the beach | Island-hopping day by boat |
| Evenings | Very quiet | Lively on Trawangan, quiet on Air and Meno | Quiet |
| Foreign visitors | Few | Many | Few |
| Best for | A slow week with a reason beyond the sand | An easy first island trip | A short beach break from Jakarta |
For the Gilis, see our [[4-day Gili Islands itinerary|/trips/4-days-gili-islands-trawangan-meno-air]].
## What to book early, and what to keep flexible
Book early: the flight into Makassar, the flight home timed for the afternoon of Day 6, the Bira rooms, and the private car for both road days. These are the parts that cannot be fixed once you are there, and the car is easiest to arrange through your Makassar hotel.
Keep flexible: the boat to Liukang Loe, the boatyard morning, the dives and the Apparalang afternoon. All are arranged in Bira on the day, in cash, and should move around the weather.
## What mistakes do travellers make in Tanjung Bira?
The most common is giving Bira two nights. With five to six hours of road at each end, two nights leaves one real day on the beach, and the drive starts to feel like the trip. The second is booking a morning flight home, which forces a pre-dawn start or a missed plane.
The third is arriving on an Indonesian long weekend without a room; the town fills from Makassar. The fourth is treating the reef as a beginner's dive site: the current is real, and the shop's judgement beats your plan. The fifth is visiting the boatyards in the heat of the afternoon, when the crews have stopped and the beach is empty.
## What to cut, adapt or upgrade
**Cut:** Day 1 in Makassar if your flight lands by late morning; drive south the same day and gain a fifth night in Bira.
**Adapt:** put this trip after a week in Tana Toraja. Both start from Makassar, so you add one night in the city between them and fly home from the same airport. The [[7-day South Sulawesi itinerary through Toraja and Makassar|/trips/7-days-south-sulawesi-toraja-makassar]] is the natural first half.
**Upgrade:** cross to Selayar Island. The ASDP ferry from Bira takes a few hours, with two or three sailings a day in 2025 and an adult fare of about Rp 33,900, according to the timetables the operator published through detikSulsel; tickets were sold only online through trip.ferizy.com. Selayar is the gateway to Taka Bonerate National Park, one of the largest atolls in the world, which needs at least three extra days.
**Do not add:** Toraja as a day trip, or a same-day return from Bira. Both are long overland days that leave you seeing more road than place.
## Before you build this trip
**Visa:** most visitors enter on the visa on arrival or e-VOA, listed at IDR 500,000 on the official Indonesian e-visa portal and valid for 30 days. See our [[Indonesia visa guide|/visa-guide]] and check the latest official guidance before you travel.
**Money:** draw cash in Makassar. Bira's ATMs are few and not something to rely on, and most small businesses take only rupiah.
**Respect:** South Sulawesi is conservative. Swimwear is fine on the beach, but cover shoulders and knees in town and in the villages, and ask before photographing people, especially in Ara and at the boatyards.
**Health:** there is no hospital in Bira; the nearest larger facilities are in Bulukumba and Makassar. Divers should keep conservative profiles and carry insurance that covers diving.
**When to go:** May to October is the drier, calmer period. Avoid Indonesian long weekends and the Eid holidays if you want the beach quiet, or book well ahead if you cannot.
## Final verdict: is Tanjung Bira worth it?
Go if you want a beach week that feels like your own and you will trade two long drives for it. Bira's sand and reef are good rather than exceptional; what makes the trip is the combination, a quiet coast where the wooden boats that carry so many of Indonesia's liveaboard divers are still built by hand on the beach.
If you want ease, choose the Gilis or Belitung. If you are already flying to Makassar for Toraja, add these four nights and finish the trip on the sand.
## Related itineraries
For the highland half of South Sulawesi, the [[7-day Toraja and Makassar itinerary|/trips/7-days-south-sulawesi-toraja-makassar]] starts from the same airport. With more time, the [[10-day Sulawesi route through Toraja and Bunaken|/trips/10-days-sulawesi-toraja-bunaken]] adds the north, and divers who want the region's best reefs should look at the [[8-day Wakatobi diving trip|/trips/8-days-wakatobi-diving-southeast-sulawesi]].
'''
FAQ=[
("How long is the drive from Makassar to Tanjung Bira?","About 200 kilometres along the south coast road, which travellers report takes five to six hours by car without long stops. The route runs through Gowa, Takalar, Jeneponto, Bantaeng and Bulukumba. Allow longer on holiday weekends, and leave Makassar by about 8:00."),
("Is there a bus from Makassar airport to Tanjung Bira?","DAMRI launched a bus from Sultan Hasanuddin airport to Tanjung Bira in March 2024, at Rp 200,000 per person, with one departure a day at 20:00 from each end, according to Kompas TV. Check that it still runs before relying on it. Shared cars and buses also leave Terminal Malengkeri in Makassar early in the morning."),
("How many days do you need in Tanjung Bira?","Four nights is the right amount. The drive from Makassar takes five to six hours each way, so two nights leaves you only one real day on the beach. Four nights gives you a snorkelling morning at Liukang Loe, a morning at the Tana Beru boatyards and two slow beach days."),
("Can you snorkel in Tanjung Bira?","Yes. The best snorkelling is around Liukang Loe, a small island about ten minutes off Bira by boat, often combined with Pulau Kambing. As a working estimate, a boat for five or six people costs IDR 250,000 to 500,000, agreed with the boatman. Go in the morning, when the sea is usually calmer."),
("Where are phinisi boats built in South Sulawesi?","On the beaches of Tana Beru, near Bira in Bulukumba regency, where crews build wooden schooners by hand. UNESCO listed the art of boatbuilding in South Sulawesi as Intangible Cultural Heritage in 2017 and names Tana Beru, Bira and Batu Licin as its centres. Visit in the morning, when the builders are working."),
("When is the best time to visit Tanjung Bira?","Broadly May to October, the drier months in South Sulawesi, when the sea is calmer for boat trips and diving. From around November to March the west monsoon brings more rain and rougher water. Avoid Indonesian long weekends and Eid if you want the beach quiet."),
("Can you get from Tanjung Bira to Selayar Island?","Yes, by the ASDP car ferry from Bira harbour. In 2025 it ran two or three times a day each way, with an adult fare of about Rp 33,900, and tickets were sold only online through trip.ferizy.com, according to timetables reported by detikSulsel. Schedules change with demand, so check before you go."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"tb-{p}{cnt[0]}"
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
title="6 Days in Tanjung Bira: South Sulawesi's Beach Coast and Phinisi Boatyards"
intro="Almost everyone who flies into Makassar heads north to Tana Toraja and never sees the south coast. This six-day plan goes the other way: one night in the city, a long drive to Tanjung Bira at the tip of the peninsula, and four slow nights of white sand, a reef ten minutes offshore and the beaches where Indonesia's wooden phinisi ships are still built by hand, with every transfer costed as a working estimate."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Tanjung Bira Itinerary: 6 Days from Makassar",
 metaDescription="A relaxed 6-day Tanjung Bira itinerary from Makassar: white sand, Liukang Loe snorkelling and the Tana Beru phinisi boatyards, with transfers and costs.",
 focusKeyword="Tanjung Bira itinerary",intro=intro,
 route="Makassar (1 night), south coast road via Bantaeng and Bulukumba, Tanjung Bira (4 nights), Liukang Loe, Tana Beru and Ara, back to Makassar and fly out",
 routeSummary="Makassar → Bantaeng → Bulukumba → Tanjung Bira → Tana Beru → Makassar",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to October",logisticsComplexity="moderate",
 destinationPrimary="wild_indonesia",travelStylePrimary="beach_islands",travelStyleSecondary=["culture_temples","diving_snorkeling"],
 travellerTypes=["couples","friends","repeat_travellers"],tripLengthBucket="one_week",tripLengthDays=6,vibe="relaxed",
 experienceTags=["beach","snorkeling","boatbuilding","road_trip","sulawesi"],
 primaryAffiliatePartner="booking",secondaryAffiliatePartners=["12go","airalo"],
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
