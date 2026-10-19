# PARTE 2, 2026-10-19 generator run: first dedicated Jakarta itinerary.
# Builds the Sanity document, validates it, writes the snapshot to content/articles/.
#   python3 scripts/build-jakarta-2026-10-19.py
import json,re,datetime,urllib.parse
SLUG="4-days-jakarta-old-batavia-thousand-islands"
KL=lambda u:"https://klook.tpx.lu/QYeSR2G9?u="+urllib.parse.quote(u,safe="")
K1="https://www.klook.com/en-US/airport-transfers/service/cgk-soekarnohatta-international-airport/"
K2="https://www.klook.com/en-US/activity/123358-watersport-experience-in-kepulauan-seribu-from-jakarta/"
V1="https://www.viator.com/tours/Jakarta/Hello-Jakarta/d4633-163186P2"
VQ="?pid=P00303362&mcid=42383&medium=link&campaign=jakarta-4-days"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="klook",placeholderId="KLOOK_JAKARTA_AIRPORT_TRANSFER",affiliateUrl=KL(K1),publicUrl=K1,anchorText="private Soekarno-Hatta airport transfer",experienceCategory="airport_transfer"),
 dict(partner="viator",placeholderId="VIATOR_JAKARTA_OLD_BATAVIA",affiliateUrl=V1+VQ,publicUrl=V1,anchorText="private Old Batavia heritage tour",experienceCategory="tour"),
 dict(partner="klook",placeholderId="KLOOK_PULAU_PAYUNG_DAY_TRIP",affiliateUrl=KL(K2),publicUrl=K2,anchorText="Pulau Payung island-hopping day trip",experienceCategory="tour"),
 dict(partner="booking",placeholderId="BOOKING_MENTENG",affiliateUrl=BK%"Menteng%2C+Jakarta",publicUrl=BK%"Menteng%2C+Jakarta",anchorText="stays in Menteng on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_PULAU_PARI",affiliateUrl=BK%"Pulau+Pari",publicUrl=BK%"Pulau+Pari",anchorText="guesthouses on Pulau Pari on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"jk-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Who is this 4-day Jakarta itinerary for?
This four-day Jakarta trip is for travellers who land in the capital anyway, at the start of a Java route or on a long stopover, and want to use those days well instead of hiding in a mall hotel. It covers the old Dutch port of Batavia, Chinatown, the national landmarks around Merdeka Square and one day at sea in the Thousand Islands.
It is not for you if you came to Indonesia for beaches and rice terraces and Jakarta is only an airport. Then give it one night and move on. It is also a hard sell in January and February, when the rainy season peaks and floods can close roads, and it does not suit anyone who will not plan around traffic.
## Trip at a glance
**Duration:** 4 days, 3 nights, ending with an evening flight or an onward train.
**Route:** Soekarno-Hatta airport, central Jakarta (Menteng) for three nights, a day trip by boat to the Thousand Islands, back to the airport or to Gambir station.
**Pace:** balanced. One heritage day, one island day, one landmark day, with every move planned around the MRT and the airport train rather than the roads.
**Best for:** first-time visitors starting a Java trip, couples, friends and solo travellers on a stopover.
**Best time:** the drier months, roughly May to September. The rainy season peaks from about December to February.
**Budget:** entry fees here are low. Most museums cost a few thousand rupiah, the big exception being the National Museum's foreign-visitor ticket. Hotels, the island day and drivers are where the money goes.
## Is Jakarta worth visiting for a few days?
Yes, for two to four days, if you plan it by neighbourhood and travel by rail. Jakarta has the country's best museum, the old Dutch port of Batavia, Southeast Asia's largest mosque facing a cathedral, and islands an hour or two offshore. What makes people hate it is trying to cross the city by car at rush hour.
The trick is to stay central and treat the city as three separate districts: Kota Tua in the north, the Merdeka Square landmarks in the middle, and the harbour for the islands. Each gets its own day. Do that, and the traffic stories stay stories.
## Day 1: Land, take the airport train, settle into Menteng
**Afternoon.** From Soekarno-Hatta, the airport train runs to BNI City (Sudirman Baru) and Manggarai in roughly 45 to 55 minutes. The operator's published fare is IDR 70,000 to those central stations, and trains ran about every 30 minutes on weekdays in 2025, so check the current timetable. With heavy luggage or a late landing, a [[private Soekarno-Hatta airport transfer|KLOOK_JAKARTA_AIRPORT_TRANSFER]] is easier, as long as you avoid the evening rush.
**Evening.** Walk Menteng, the leafy colonial-era district south of Merdeka Square, and eat close to the hotel. A bowl of soto Betawi, the city's own coconut-milk beef soup, is the right first meal.
**Base:** Menteng, 3 nights. It sits between the MRT, the commuter rail and the landmarks. Compare [[stays in Menteng on Booking.com|BOOKING_MENTENG]].
**Travel note:** set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly, because Grab, Gojek and the transit apps all need data from the arrivals hall.
## Day 2: Kota Tua, Sunda Kelapa and Glodok
**Morning.** Take the commuter line or a Transjakarta bus north to Kota Tua, the old core of Batavia, and get there early, before the heat. Fatahillah Square is ringed by the old city hall, now the Jakarta History Museum, plus the Wayang Museum next door. As reported in 2025, both charge around IDR 5,000 and close on Mondays.
**Afternoon.** Walk or take a short ride to Sunda Kelapa, the old harbour where wooden pinisi schooners still load cargo on most days. Then head to Glodok, Jakarta's Chinatown, for the lanes of Petak Sembilan and Vihara Dharma Bhakti, one of the city's oldest Chinese temples.
**Booking logic:** Kota Tua is easy alone, but the history behind it is not signposted well. A [[private Old Batavia heritage tour|VIATOR_JAKARTA_OLD_BATAVIA]] runs 5 to 6 hours with pickup and starts from about 65 US dollars per person on the listing, which is worth it if you want the story rather than the photos.
**Evening.** Eat in Glodok before it closes up, then take the train back south rather than a car.
**Travel note:** check the day of the week before you plan. Most Jakarta museums close on Mondays, so make Monday your island day or your arrival day.
## Day 3: A day at sea in the Thousand Islands
**Morning.** The Thousand Islands, Kepulauan Seribu, are a chain of small coral islands north of the city. The simplest way to see them in a day is a [[Pulau Payung island-hopping day trip|KLOOK_PULAU_PAYUNG_DAY_TRIP]]: hotel pickup, the boat and a day on a small, quiet island in about ten hours, with no boat tickets to sort yourself.
**Afternoon.** Swim, snorkel if the water is calm and do nothing for a few hours. The water near Jakarta is not Raja Ampat, and the closest islands can collect rubbish after rain, but the further islands are clean enough to make the day feel like a break from the city.
**Evening.** Back in the city by evening. Eat in Menteng and sleep early.
**Travel note:** the boat is the weather risk. Seas get rougher in the rainy season, and operators cancel when they have to, so keep this day flexible and swap it with Day 4 if the forecast is bad.
## How do you get to the Thousand Islands from Jakarta?
By boat from the north coast, and the realistic choices are a packaged day tour, the government boat from Kali Adem (Muara Angke), or a speedboat from Marina Ancol. For a single day a tour is easiest. The public boats leave around 8am and come back early in the afternoon, which suits an overnight stay far better than a day trip.
As a working estimate from 2026 traveller and operator reports, the government speedboats cost around IDR 44,000 to 55,000 one way, depending on the island zone, and are booked through the JakeT Boat app, usually from the day before. Marina Ancol speedboats cost several times that, and Ancol charges a gate fee on top. Fares and schedules change, so confirm before you go.
^^ Thousand Islands from Jakarta: the three ways to do it. Prices and times are working estimates from 2025 and 2026 listings and reports; check the current fare before you pay.
| Option | How it works | Cost | Best for | Weak point |
|---|---|---|---|---|
| Packaged day tour | Hotel pickup, boat and island time, about 10 hours | From the tour listing price, per person | Anyone with one day and no wish to plan | Fixed island and fixed schedule |
| Government boat from Kali Adem | Early morning departure, return early afternoon | Around IDR 44,000 to 55,000 one way | An overnight on Pari or Tidung | Too little island time for a day trip, booked by app |
| Speedboat from Marina Ancol | Faster boats to Pari, Pramuka and nearby islands | Several times the public fare, plus the Ancol gate fee | Groups who want their own timing | Most expensive way to go |
## Day 4: Merdeka Square, Istiqlal and the National Museum
**Morning.** Start at Monas, the National Monument in Merdeka Square. A ticket to the top was reported at IDR 24,000 for adults in 2025, paid with a JakCard bought at the counter, and the summit has a daily quota that sells out on holidays, so go early. Across the square, the National Museum reopened in October 2024 after a fire. From January 2026 the foreign-visitor ticket is IDR 150,000, and it closes on Mondays.
**Afternoon.** Walk to Istiqlal Mosque, the largest in Southeast Asia, which runs free guided visits for non-Muslims, with robes lent at the entrance. Jakarta Cathedral stands directly opposite, and the two are linked by an underground passage. Allow an hour for both.
**Evening.** Leave for the airport from BNI City or Manggarai on the airport train, or take an onward train from Gambir if you are heading to Bandung or Yogyakarta.
**Travel note:** leave a long buffer for an evening flight. Never plan to cross Jakarta by car between about 4pm and 8pm.
## Where should you stay in Jakarta for a short trip?
Central Jakarta, ideally Menteng or the Sudirman corridor. Both sit on the MRT or commuter rail, a short ride from the landmarks and a direct airport-train stop away from the airport. Kota Tua is atmospheric for an afternoon but poorly placed for everything else, and the south of the city adds an hour to every trip.
If the Thousand Islands are the point of your trip rather than one day of it, spend a night on Pulau Pari instead. Look at [[guesthouses on Pulau Pari on Booking.com|BOOKING_PULAU_PARI]], take the morning public boat, and you get a sunset and a quiet morning that the day trippers never see.
## What to book early, and what to keep flexible
**Book early:** the island day, because tours run on set days and the boat needs good weather, and your Menteng hotel. If you want the Monas summit on a weekend or public holiday, arrive at opening.
**Keep flexible:** the order of Days 2 to 4. Swap them around Monday closures and the marine forecast, and keep restaurants and the Glodok afternoon open.
## Mistakes travellers make in Jakarta
Staying near the airport or in the far south and commuting in. Jakarta punishes distance, so the hotel location matters more than the hotel.
Planning a museum day on a Monday. The History Museum, the Wayang Museum and the National Museum are all closed.
Treating the public boat to the Thousand Islands as a day trip. You spend most of the day on the water and get a couple of hours on land.
Using taxis for everything. The MRT and Transjakarta are cheap, with Transjakarta at a flat IDR 3,500 and MRT fares from about IDR 4,000 to 14,000 according to early 2026 reporting, and they skip most of the traffic.
## What to cut, adapt or upgrade
**Cut:** with three days, drop the Thousand Islands and keep the two city days. With two, do Kota Tua and Merdeka Square only.
**Adapt:** if you are going on to Bandung, the high-speed train from Halim takes under an hour. Our [[10-day Java route from Jakarta to Bromo|/trips/10-days-java-jakarta-bandung-yogyakarta-bromo]] starts exactly where this trip ends.
**Upgrade:** turn Day 3 into an overnight on Pulau Pari, or add a day for Bogor's botanical garden if rain is unlikely.
## Before you build this trip
**Entry:** most nationalities use the e-VOA, listed at IDR 500,000 for 30 days. Check our [[Indonesia visa guide|/visa-guide]] and the latest official guidance before you fly.
**Money:** buy a JakCard or another prepaid e-money card for the MRT, Transjakarta and Monas, and some cash for street food and Glodok.
**Weather:** the rainy season peaks from about December to February, and January floods are common. Build a spare half day into any trip in those months.
**Dress:** cover shoulders and knees for Istiqlal and the temples in Glodok. The mosque lends robes.
**Costs:** our [[Indonesia travel costs guide|/indonesia-travel-costs]] has daily ranges for Java.
## Final verdict
Do this trip if Jakarta is already on your route. Four days, planned by district and travelled by rail, turn the city from a layover into a worthwhile start: the best museum in the country, the oldest streets in the city, a mosque and cathedral side by side, and a day on the water.
Skip it if you have fewer than two days, or if you are visiting in the heart of the rainy season. Then give Jakarta one night and put the time into Yogyakarta.
## Related itineraries
[[10 days across Java from Jakarta to Bromo|/trips/10-days-java-jakarta-bandung-yogyakarta-bromo]] continues by train through Bandung and Yogyakarta.
[[5 days in Yogyakarta and Mount Bromo|/trips/5-days-yogyakarta-bromo]] if you are flying straight on from Jakarta.
[[Jakarta to Yogyakarta transport guide|/transport/jakarta-to-yogyakarta]] for trains and flights out of the city.
'''
FAQ=[
("How many days do you need in Jakarta?","Two to four days. Two cover Kota Tua and the landmarks around Merdeka Square; four add a day in the Thousand Islands and some slack for Monday museum closures and traffic. Under two days, do one district well rather than crossing the city."),
("Is Jakarta worth visiting?","Yes, if you are already flying in. Jakarta has Indonesia's best museum, the old Dutch port of Batavia, Istiqlal Mosque facing the cathedral, and islands offshore. It is a poor choice as a main destination for beach or nature trips."),
("How do you get from Soekarno-Hatta airport to central Jakarta?","The airport train runs to BNI City (Sudirman Baru) and Manggarai in roughly 45 to 55 minutes, with a published fare of IDR 70,000 to those stations. A pre-booked private car is easier with luggage but slow in rush hour."),
("Can you do the Thousand Islands as a day trip from Jakarta?","Yes, most easily on a packaged tour with hotel pickup that runs about ten hours. The government boats from Kali Adem leave around 8am and return early afternoon, so they suit an overnight on Pari or Tidung better than a day trip."),
("Are Jakarta museums open on Mondays?","Mostly not. The Jakarta History Museum (Fatahillah), the Wayang Museum and the National Museum all close on Mondays, so plan your island day or arrival day for Monday. Hours change, so confirm before you go."),
("How much does it cost to go up Monas?","A ticket to the top of the National Monument was reported at IDR 24,000 for adults in 2025, paid by JakCard bought at the counter. The summit has a daily visitor quota and can sell out on holidays."),
("Where is the best area to stay in Jakarta for tourists?","Menteng or the Sudirman corridor in central Jakarta. Both are on the rail network, close to Merdeka Square and a direct airport-train stop away from the airport, which matters more in Jakarta than the hotel itself."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"jk-{p}{cnt[0]}"
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
title="4 Days in Jakarta: Old Batavia, the Thousand Islands and Monas"
intro="Most travellers treat Jakarta as an airport and leave the same night. That is a mistake if your route starts in Java anyway, because four days here, planned district by district and travelled by rail, cover the old Dutch port of Batavia, Chinatown, Indonesia's best museum, Istiqlal Mosque and a day at sea in the Thousand Islands. The catch is traffic, and this route is built around avoiding it rather than pretending it is not there."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Jakarta Itinerary: 4 Days, Old Town and Thousand Islands",
 metaDescription="A 4-day Jakarta itinerary: Kota Tua and Glodok, a Thousand Islands boat day, Monas and the National Museum, with 2026 fares and Monday closures.",
 focusKeyword="4 days in Jakarta itinerary",intro=intro,
 route="Soekarno-Hatta airport, Menteng (central Jakarta), Kota Tua and Glodok, Thousand Islands (day trip), Merdeka Square, Soekarno-Hatta or Gambir",
 routeSummary="Airport → Menteng → Kota Tua → Thousand Islands → Merdeka Square",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to September",logisticsComplexity="easy",
 destinationPrimary="java",travelStylePrimary="culture_temples",travelStyleSecondary=["first_time_indonesia","beach_islands"],
 travellerTypes=["couples","friends","solo_travellers"],tripLengthBucket="short_escape",tripLengthDays=4,vibe="balanced",
 experienceTags=["city","museums","colonial_heritage","island_day_trip","snorkelling","street_food"],
 primaryAffiliatePartner="klook",secondaryAffiliatePartners=["viator","booking","airalo"],
 body=body,affiliateLinks=AFF,faq=[dict(_key=K("f"),question=q,answer=a) for q,a in FAQ])
txt=json.dumps(doc,ensure_ascii=False)
bad=["—","–","hidden gem","must-see","paradise","immerse yourself","unforgettable","something for everyone","vibrant culture","crystal-clear","crystal clear","breathtaking","rich history","local charm","authentic experience","off the beaten path","once-in-a-lifetime","bucket list","dream destination","(SEARCH"]
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
