import json,re,datetime
SLUG="7-days-west-sumbawa-whale-sharks-moyo-kenawa"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
T1="https://12go.asia/en/travel/bali/sumbawa-besar"
T2="https://12go.asia/en/travel/lombok/sumbawa-besar"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="12GO_BALI_SUMBAWA_BESAR",affiliateUrl=T1+"?z=16022946",publicUrl=T1,anchorText="Bali to Sumbawa Besar flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="12GO_LOMBOK_SUMBAWA_BESAR",affiliateUrl=T2+"?z=16022946",publicUrl=T2,anchorText="Lombok to Sumbawa Besar flights and transfers on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_SUMBAWA_BESAR",affiliateUrl=BK%"Sumbawa+Besar",publicUrl=BK%"Sumbawa+Besar",anchorText="stays in Sumbawa Besar on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_MOYO_ISLAND",affiliateUrl=BK%"Moyo+Island",publicUrl=BK%"Moyo+Island",anchorText="stays on Moyo Island on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"sw-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Who is this Sumbawa trip for, and who should skip it?
This seven-day West Sumbawa trip is for couples, friends and repeat visitors to Indonesia who have done Bali and Lombok and want the next island east: whale sharks at dawn in Saleh Bay, a waterfall and quiet reef on Moyo Island, and a small uninhabited island off the ferry port. It suits strong swimmers and people who are fine with basic rooms.
It is not for you if you want beach clubs, polished resorts at every stop or an easy week with no early starts. Sumbawa has few hotels outside Sumbawa Besar, the whale shark morning starts in the dark, and boats run on local timing. If that sounds tiring, the Gili Islands or south Lombok will give you a gentler week.
## Trip at a glance
**Route:** fly into Sumbawa Besar, Saleh Bay and Labuhan Jambu (1 night), back to Sumbawa Besar, Moyo Island (2 nights), then west by road to Poto Tano, Kenawa Island and the ferry back to Lombok.
**Pace:** one pre-dawn start, two boat crossings and one long road day, with two slow days on Moyo in between.
**Getting there:** Wings Air flies to Sumbawa Besar (SWQ) from Bali in about an hour and from Lombok in about 40 minutes, according to current 12Go listings.
**Best season:** roughly May to November, when operators report whale sharks gathering around the fishing platforms in Saleh Bay and the sea to Moyo is calmer.
**Best for:** couples, friends and repeat travellers who swim well and want wildlife over nightlife.
## Where is Sumbawa, and why go there after Lombok?
Sumbawa is the large island directly east of Lombok, in the same province of West Nusa Tenggara, with Komodo and Flores beyond it. The western half, around the town of Sumbawa Besar, is reachable in under an hour by plane from Bali or by a car ferry of about one hour 40 minutes from Lombok.
The reason to go is that Saleh Bay, on its north coast, is one of the few places in Indonesia where you can snorkel with whale sharks without a liveaboard. Add Moyo Island, a protected forest island with a terraced waterfall, and you have a week that feels very different from Lombok for a short extra flight.
## How do you get to Sumbawa from Bali or Lombok?
Fly into Sumbawa Besar and leave by the ferry, or the other way round. Wings Air runs direct flights from Denpasar to Sumbawa Besar in about an hour and from Lombok in about 40 minutes; 12Go listed one-way fares from roughly 56 to 90 US dollars in October 2026, which you should treat as a working estimate.
Overland, the public car ferry crosses from Kayangan on Lombok's east coast to Poto Tano on Sumbawa in about one hour 40 minutes, with departures roughly every hour, and the road from Poto Tano to Sumbawa Besar takes around two hours. Compare [[Bali to Sumbawa Besar flights on 12Go|12GO_BALI_SUMBAWA_BESAR]] and [[Lombok to Sumbawa Besar flights and transfers on 12Go|12GO_LOMBOK_SUMBAWA_BESAR]], and see our [[Bali to Sumbawa transport guide|/transport/bali-to-sumbawa]] for the full ferry chain.
^^ Three ways into West Sumbawa. Times and fares are working estimates from current listings, so check schedules before you book.
| | Flight from Bali | Flight from Lombok | Ferry from Lombok |
|---|---|---|---|
| Lands or arrives at | Sumbawa Besar (SWQ) | Sumbawa Besar (SWQ) | Poto Tano, west coast |
| Time | About 1 hour in the air | About 40 minutes in the air | About 1 hour 40 minutes crossing, plus roads on both sides |
| Fare | Roughly 70 to 90 US dollars one way | Roughly 56 US dollars one way | A few dollars for a foot passenger |
| Frequency | Thin, usually one direct flight a day | Thin, usually one flight a day | Roughly hourly |
| Best for | Starting the trip fast | Starting from Lombok or the Gilis | The return leg, with a stop at Kenawa |
## Day 1: Fly into Sumbawa Besar
**Morning.** Fly from Bali or Lombok to Sumbawa Besar. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you leave, because you will arrange drivers and boats by WhatsApp from here on.
**Afternoon.** Check in and walk to Istana Dalam Loka, the wooden palace of the former Sumbawa sultanate, built in the late nineteenth century on stilts. It takes under an hour and gives you a sense of the island beyond the sea.
**Evening.** Eat at the night stalls in town and confirm tomorrow's driver and the whale shark boat with your operator.
**Base:** Sumbawa Besar. Compare [[stays in Sumbawa Besar on Booking.com|BOOKING_SUMBAWA_BESAR]].
**Booking logic:** book the whale shark trip before you fly. Operators run small groups and the boats leave before dawn, so you cannot sort it out on the morning.
**Travel note:** Wings Air uses small turboprop planes with tight baggage allowances. Check what your fare includes and pay for checked luggage in advance.
## Day 2: Drive east to Saleh Bay
**Morning.** Slow start in town. Buy snacks, cash and anything you need for a night in a village.
**Afternoon.** Drive east to Labuhan Jambu in the Tarano district, on the shore of Saleh Bay. Operators put the drive at around two hours, and one lists it at 117 kilometres.
**Evening.** Sleep in Labuhan Jambu or nearby. Rooms here are basic homestays or whatever your operator arranges, and you go to bed early.
**Booking logic:** sleeping near the bay rather than in Sumbawa Besar removes a 1 a.m. departure. Some day tours from town leave that early, which is a poor trade for one extra hour of sleep in a nicer bed.
## Day 3: Whale sharks at dawn, then back to Sumbawa Besar
**Morning.** Leave Labuhan Jambu by boat around 4 to 5 a.m. for the bagan, the floating fishing platforms in Saleh Bay. Operators describe a ride of about an hour. Whale sharks feed on the small fish around the nets as the fishermen lift them at first light, which is why the timing matters. You swim from the boat with mask and fins.
**Afternoon.** Return to the shore, eat, and drive back to Sumbawa Besar.
**Evening.** Rest. This is the earliest and longest day of the trip.
**Booking logic:** shared trips from Labuhan Jambu were listed from about 120 US dollars per person, and private day tours from Sumbawa Besar from about 190 US dollars, according to operator listings. Ask what is included: boat, guide, gear, breakfast and the transfer.
**Travel note:** sightings are likely in season but not guaranteed, and operators say so. Keep at least two metres away, never touch the animals and do not use flash. Non-swimmers and people prone to seasickness should think twice.
## Day 4: Boat to Moyo Island and Mata Jitu waterfall
**Morning.** Transfer to the north coast and take a boat to Moyo. Boats leave from the coast near Sumbawa Besar, including Pantai Goa, and the crossing takes from about 30 minutes by private speedboat to around two hours by slower local boat, depending on where you land.
**Afternoon.** Go to Mata Jitu, a waterfall that drops through a series of turquoise limestone pools in the forest. From Labuhan Aji village it is roughly an hour's walk through farmland or about 20 minutes by motorbike. Swim in the lower pools.
**Evening.** Dinner where you sleep. Moyo is quiet after dark.
**Base:** Moyo Island, with village homestays in Labuhan Aji at one end and a small number of high-end resorts at the other. Compare [[stays on Moyo Island on Booking.com|BOOKING_MOYO_ISLAND]].
**Booking logic:** agree your return boat and time before you go. Public boats run on no fixed schedule, and travellers have been stuck on Moyo for days waiting for one.
## Day 5: A slow day on Moyo
**Morning.** Snorkel off the beach or take a short boat to a nearby reef. Most of the island is protected forest, so the coast is where the activity is.
**Afternoon.** Rest, or walk to a second waterfall or a viewpoint with a local guide.
**Evening.** Sunset from the jetty.
**Travel note:** this is your spare day. If the sea was too rough on day 4, use today to cross instead.
## Day 6: West to Poto Tano and Kenawa Island
**Morning.** Boat back to the Sumbawa coast and drive west to Poto Tano, around two hours from Sumbawa Besar. Leave early; this is the long day.
**Afternoon.** Hire a boat at Poto Tano for Kenawa, a small uninhabited island of grass and white sand a short ride offshore. Climb the hill for the view over the strait, then snorkel. Travellers report paying roughly 500,000 to 600,000 rupiah for a whole boat that can also visit Paserang and other islets, an informal price, so agree the route and return time first.
**Evening.** Take the car ferry from Poto Tano to Kayangan and drive across Lombok, or camp on Kenawa with an organised trip and cross in the morning.
**Base:** Lombok, or a tent on Kenawa.
**Travel note:** buses thin out on Sumbawa in the afternoon, so do this day with a hired car and driver, not public transport.
## Day 7: Back on Lombok
**Morning.** If you camped, take the first ferry. Drive to Lombok airport or on to Bangsal for the Gili Islands.
**Afternoon.** Fly home or continue your trip.
**Travel note:** do not book a same-day international flight after a morning ferry from Poto Tano. Leave a night in Lombok in between.
## Which part of West Sumbawa is best for what?
Saleh Bay is for whale sharks and nothing else; you go for one dawn swim. Moyo Island is for forest, a waterfall and reef, and needs two nights to be worth the boat. Kenawa is a short stop by the ferry port that suits a half day or one night in a tent.
^^ What each stop gives you, and how long it needs.
| Stop | What it gives you | Time it needs | Weak point |
|---|---|---|---|
| Saleh Bay, Labuhan Jambu | Snorkelling with whale sharks at the fishing platforms | One night and a pre-dawn start | Basic rooms, sightings not guaranteed |
| Moyo Island | Mata Jitu waterfall, forest, quiet reef | Two nights | Boat times are informal |
| Kenawa Island | Hilltop view, snorkelling, camping | Half a day or one night | No facilities, bring water and shade |
| Sumbawa Besar | Flights, the wooden palace, food | One night | Little reason to stay longer |
## What to book early, and what to keep flexible
Book early: your flight into Sumbawa Besar, since there is usually one direct flight a day, and your whale shark trip with an operator in Labuhan Jambu or Sumbawa Besar. Book a car and driver for days 2, 3 and 6.
Keep flexible: the Moyo boat and your Moyo room if you are going budget, which can be arranged a day ahead, and the Kenawa boat, which you hire at Poto Tano on the day.
## What mistakes do travellers make on Sumbawa?
The first is going outside the season. Operators report the most reliable whale shark months as roughly May to November, and the sea to Moyo gets rougher from December. The second is trying to do Saleh Bay as a day trip from Sumbawa Besar, which means a 1 a.m. start.
The third is arriving without enough cash. ATMs exist in Sumbawa Besar but not on Moyo, Kenawa or in the villages. The fourth is relying on buses for the road days, which run on local timing and thin out in the afternoon.
## What should you cut, adapt or upgrade?
Cut Kenawa and fly out of Sumbawa Besar if you are short of time. Adapt the trip by doing it in reverse, ferry in and fly out, which suits anyone already on Lombok or the Gilis; start from our [[Southwest Lombok and the secret Gilis|/trips/8-days-southwest-lombok-sekotong-secret-gilis]] route if you want more of that coast first.
Upgrade with a night at one of Moyo's high-end resorts, or by continuing east. Surfers head to Lakey Peak in Dompu, and hikers can arrange a multi-day trek up Mount Tambora, whose 1815 eruption was one of the largest in recorded history. For Komodo beyond that, see our [[10-day Komodo and Flores itinerary|/trips/10-days-komodo-flores]].
## Before you build this trip
Check the visa rules for your passport on our [[Indonesia visa guide|/visa-guide]]; Sumbawa has no separate entry rules. Bring cash in rupiah, reef-safe sunscreen, your own mask if you have one, and a light jacket for the pre-dawn boat.
Get travel insurance that covers snorkelling and small boats. Prices, schedules and boat routes here change often, so confirm current flights and tour prices with operators before you lock in rooms.
## Final verdict: is Sumbawa worth it?
Yes, if you want to snorkel with whale sharks without paying for a liveaboard, and you are happy with basic rooms and early starts. West Sumbawa gives you one remarkable morning in Saleh Bay, two quiet days on Moyo and a ferry home past Kenawa, all within an hour of Bali or Lombok.
Skip it if you want comfort, restaurants and nightlife, or if you travel outside roughly May to November. In that case stay on the Gilis, or go to Komodo for big marine life with better tourist infrastructure.
## Related itineraries
[[8 days in southwest Lombok and the secret Gilis|/trips/8-days-southwest-lombok-sekotong-secret-gilis]] for the quiet side of Lombok before you cross.
[[10 days in Komodo and Flores|/trips/10-days-komodo-flores]] for the next islands east.
[[The Wild Indonesia hub|/destinations/wild-indonesia]] for more routes beyond the main islands.
'''
FAQ=[
("Is Sumbawa worth visiting?","Yes, if you want wildlife and quiet over comfort. West Sumbawa offers snorkelling with whale sharks in Saleh Bay, the Mata Jitu waterfall on Moyo Island and small islands like Kenawa, within an hour of Bali or Lombok. Rooms are basic outside Sumbawa Besar and some days start before dawn."),
("When is the best time to see whale sharks in Sumbawa?","Operators report whale sharks gathering around the fishing platforms in Saleh Bay from roughly May to November. Trips leave before dawn because the sharks feed as fishermen lift their nets at first light. Sightings are likely in season but never guaranteed."),
("How do you get from Lombok to Sumbawa?","Either fly or take the ferry. Wings Air flies from Lombok to Sumbawa Besar in about 40 minutes. The public car ferry from Kayangan to Poto Tano takes about one hour 40 minutes and runs roughly hourly, followed by about two hours by road to Sumbawa Besar."),
("How much does a whale shark tour in Sumbawa cost?","As a working estimate, shared trips from Labuhan Jambu have been listed from about 120 US dollars per person and private day tours from Sumbawa Besar from about 190 US dollars, based on operator listings. Two-day packages from Lombok cost more. Check what is included before you book."),
("How do you get to Moyo Island?","By boat from the north coast near Sumbawa Besar, including Pantai Goa. A private speedboat takes about 30 minutes; slower local boats take around two hours and run on no fixed schedule. Agree your return boat before you go so you are not stuck on the island."),
("How many days do you need in Sumbawa?","Six to seven days covers West Sumbawa well: one night near Saleh Bay for the whale sharks, two nights on Moyo Island, and a day for Kenawa and the ferry back to Lombok. With four days, pick Saleh Bay and Moyo and fly in and out of Sumbawa Besar."),
("Is Sumbawa safe for tourists?","West Sumbawa is generally calm and welcoming, and the main risks are practical: small boats, early starts in the dark and long roads. Use licensed operators for the whale shark trip, wear a life jacket on boats, carry cash and check current travel advice for your country before you go."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"sw-{p}{cnt[0]}"
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
title="7 Days in West Sumbawa: Whale Sharks, Moyo Island and Kenawa"
intro="Sumbawa is the island most travellers see only from the deck of a Komodo boat, which is a shame, because its western half holds one of the best wildlife mornings in Indonesia. In Saleh Bay, whale sharks feed around the fishing platforms at first light, and you can swim beside them from a small wooden boat. Add two quiet nights on Moyo Island and a ferry home past Kenawa, and you have a week that starts an hour from Bali. The price is basic rooms, one very early alarm and boats that keep local time."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Sumbawa Itinerary: Whale Sharks, Moyo and Kenawa in 7 Days",
 metaDescription="A 7-day West Sumbawa itinerary: whale sharks in Saleh Bay, Moyo Island's Mata Jitu waterfall and Kenawa, with flights, ferries, costs and seasons.",
 focusKeyword="Sumbawa itinerary",intro=intro,
 route="Bali or Lombok, Sumbawa Besar, Labuhan Jambu (Saleh Bay), Sumbawa Besar, Moyo Island, Poto Tano, Kenawa Island, Kayangan, Lombok",
 routeSummary="Sumbawa Besar → Saleh Bay → Moyo Island → Kenawa → Lombok",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to November",logisticsComplexity="moderate",
 destinationPrimary="wild_indonesia",destinationSecondary=["lombok_gili"],travelStylePrimary="wildlife_nature",travelStyleSecondary=["diving_snorkeling","remote_offbeat"],
 travellerTypes=["couples","friends","repeat_travellers"],tripLengthBucket="one_week",tripLengthDays=7,vibe="remote",
 experienceTags=["wildlife","snorkeling","waterfalls","island_day_trip","domestic_flights","homestays"],
 primaryAffiliatePartner="12go",secondaryAffiliatePartners=["booking","airalo"],
 body=body,affiliateLinks=AFF,faq=[dict(_key=K("f"),question=q,answer=a) for q,a in FAQ])
txt=json.dumps(doc,ensure_ascii=False)
bad=["—","–","hidden gem","must-see","paradise","immerse yourself","unforgettable","something for everyone","vibrant culture","crystal-clear","breathtaking","rich history","local charm","authentic experience","off the beaten path","once-in-a-lifetime","bucket list","dream destination","(SEARCH"]
fails=[b for b in bad if b.lower() in txt.lower() and not (b=="–" and False)]
if re.search(r"\d[\d,]* reviews",txt): fails.append("reviews artefact")
keys=re.findall(r'"_key": "([^"]+)"',json.dumps(doc))
if len(keys)!=len(set(keys)): fails.append("dup keys")
refs={m["placeholderId"] for b in body for m in b.get("markDefs",[]) if m["_type"]=="affiliateLinkRef"}
have={a["placeholderId"]:a["affiliateUrl"] for a in AFF}
for r in refs:
    if not have.get(r): fails.append("aff "+r)
if len(doc["metaTitle"])>60 or len(doc["metaDescription"])>155: fails.append("meta")
words=len(re.findall(r"\w+"," ".join(c["text"] for b in body if b["_type"]=="block" for c in b["children"])))
print("meta",len(doc["metaTitle"]),len(doc["metaDescription"]),"refs",sorted(refs),"unused",set(have)-refs,"words",words,"faq",len(FAQ))
print("FAILS",fails)
json.dump(doc,open("content/articles/"+SLUG+".json","w"),indent=2,ensure_ascii=False)
