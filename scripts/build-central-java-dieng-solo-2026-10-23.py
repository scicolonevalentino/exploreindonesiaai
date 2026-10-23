# PARTE 2, 2026-10-23 generator run: first itinerary that leaves the Yogyakarta
# day-trip circuit for the rest of Central Java (Dieng Plateau and Solo, zero
# coverage on the site before today). GSC 2026-09-23..10-20 shows Central Java
# demand concentrated on Yogyakarta temples ("borobudur vs prambanan" ~100 impr
# across variants, "east java" 35, "day trips from yogyakarta..." 10) with no
# page going beyond the city. Matrix gap: Dieng and Solo, 0 articles.
# Builds the Sanity document, validates it, writes the snapshot to content/articles/.
#   python3 scripts/build-central-java-dieng-solo-2026-10-23.py
import json,re,datetime,urllib.parse
SLUG="6-days-central-java-borobudur-dieng-solo"
KL=lambda u:"https://klook.tpx.lu/QYeSR2G9?u="+urllib.parse.quote(u,safe="")
K1="https://www.klook.com/activity/18275-dieng-plateau-tour-yogyakarta/"
V1="https://www.viator.com/tours/Yogyakarta/Spectacular-Borobudur-Sunrise-from-Yogyakarta/d22560-105712P10"
VQ="?pid=P00303362&mcid=42383&medium=link&campaign=central-java-dieng-solo-6-days"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_JAKARTA_YOGYAKARTA",affiliateUrl="https://12go.asia/en/travel/jakarta/yogyakarta?z=16022946",publicUrl="https://12go.asia/en/travel/jakarta/yogyakarta",anchorText="Jakarta to Yogyakarta trains and flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_YOGYAKARTA_SOLO",affiliateUrl="https://12go.asia/en/travel/yogyakarta/solo?z=16022946",publicUrl="https://12go.asia/en/travel/yogyakarta/solo",anchorText="Yogyakarta to Solo trains on 12Go",experienceCategory="transport"),
 dict(partner="klook",placeholderId="KLOOK_DIENG_DAY_TRIP",affiliateUrl=KL(K1),publicUrl=K1,anchorText="Dieng Plateau day trip from Yogyakarta",experienceCategory="tour"),
 dict(partner="viator",placeholderId="VIATOR_BOROBUDUR_SUNRISE_PRIVATE",affiliateUrl=V1+VQ,publicUrl=V1,anchorText="private Punthuk Setumbu sunrise and Borobudur tour",experienceCategory="tour"),
 dict(partner="booking",placeholderId="BOOKING_YOGYAKARTA",affiliateUrl=BK%"Yogyakarta",publicUrl=BK%"Yogyakarta",anchorText="stays in Yogyakarta on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_DIENG",affiliateUrl=BK%"Dieng",publicUrl=BK%"Dieng",anchorText="guesthouses on the Dieng Plateau",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_SURAKARTA",affiliateUrl=BK%"Surakarta",publicUrl=BK%"Surakarta",anchorText="hotels in Solo on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"cj-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## What is there to see in Central Java beyond Yogyakarta?
Most visitors see Central Java as Yogyakarta plus two temples, Borobudur and Prambanan, done as day trips. The province holds much more: the Dieng Plateau, a cold volcanic highland about 2,000 metres up with some of Java's oldest Hindu temples, and Solo, the quieter royal city an hour east of Yogyakarta by commuter train.
This itinerary is built on that gap. It keeps the two temples everyone comes for, but it gives them a better rhythm, and it adds two places that change how the region feels: two cold nights among steaming craters and potato terraces on the plateau, and a final day in a court city where the palaces still matter and almost nobody is there on a tour bus.
## Who this trip is for
This six-day plan is for travellers who have a week in Java and want more than the classic Yogyakarta checklist: couples, solo travellers and repeat visitors who like culture, early mornings and a bit of road time, and who would rather see one cold mountain dawn than a third temple. It works as a standalone trip or as the Java half of a longer journey.
It is not for you if you want a single base and short drives; then the [[7-day Yogyakarta and East Java itinerary|/trips/7-days-yogyakarta-east-java]] or a slower city stay fits better. It is also the wrong plan for young children, because Dieng is cold, basic and reached on winding roads. Families should look at our [[8-day Yogyakarta and Central Java itinerary with kids|/trips/8-days-yogyakarta-central-java-with-kids]] instead.
## Trip at a glance
**Duration:** 6 days, 5 nights: Yogyakarta 1 night, Dieng 2 nights, Yogyakarta 1 night, Solo 1 night.
**Route:** Yogyakarta, Borobudur, the Dieng Plateau, back to Yogyakarta, Prambanan, then Solo (Surakarta).
**Pace:** balanced. Two early starts, two half-days in a car, and a gentle final day.
**Best for:** culture-minded couples, solo travellers and repeat visitors to Indonesia.
**Best time:** roughly May to September, the dry season, when Dieng mornings are clearest and coldest. Expect rain on many afternoons from November to March.
**Budget:** moderate. Temple tickets for foreign visitors are the biggest fixed cost; Dieng and Solo are cheap.
## Why this route makes sense
The usual Central Java plan sleeps four nights in Yogyakarta and returns every evening. It is efficient, but it turns the region into a commute. This route uses geography instead: Borobudur sits on the road to Dieng, so you see it on the way up, and Prambanan sits on the road to Solo, so you see it on the way out. Neither temple costs you a separate round trip.
Dieng gets two nights because one is not enough. The sunrise at Sikunir means a 3:30 a.m. start, and doing that after a four-hour drive and before another one is how people end up hating the plateau. With two nights you arrive, sleep, catch the dawn, and still have an afternoon for the craters and lakes. Ending in Solo means you finish somewhere calm, with a choice of flying out of its own airport or taking the train back.
## How long does it take to get from Yogyakarta to the Dieng Plateau?
As a working estimate, the drive from Yogyakarta to the Dieng Plateau takes three to four hours by car, via Magelang and Wonosobo, according to Indonesia's official tourism site. From Borobudur it is a little shorter, because the temple sits near Magelang on the same route. The last hour climbs steeply on narrow, winding roads above Wonosobo.
Public transport exists, with buses to Wonosobo and minibuses up to Dieng, but it turns one drive into a full day of changes. For this route a private car with a driver is the sensible choice: it carries your bags from Borobudur up to the plateau, waits while you walk, and costs far less than people expect when split between two. Arrange it through your Yogyakarta hotel and agree the price, the stops and the waiting time before you leave.
## Day 1: Arrive in Yogyakarta
**Morning.** Fly into Yogyakarta International Airport (YIA), about 45 kilometres west of the city in Kulon Progo, or arrive by train from Jakarta; compare [[Jakarta to Yogyakarta trains and flights on 12Go|TWELVEGO_JAKARTA_YOGYAKARTA]] and our [[Jakarta to Yogyakarta transport guide|/transport/jakarta-to-yogyakarta]]. The airport train reaches the central stations in about 40 minutes.
**Afternoon.** Check in, rest, and walk to the Kraton area if you arrive early enough. The Sultan's palace keeps short, morning-weighted hours, so do not race for it today.
**Evening.** Eat gudeg, the sweet jackfruit stew Yogyakarta is known for, at a warung near your hotel, then pack a small overnight bag: you will leave the big luggage in the car tomorrow, and it is cold where you are going.
**Base:** Yogyakarta, 1 night. Compare [[stays in Yogyakarta on Booking.com|BOOKING_YOGYAKARTA]]; the Prawirotaman area is quieter, and Malioboro or Tugu is closer to the station.
**Booking logic:** book tomorrow's car and driver tonight through your hotel, and book the Borobudur ticket online in advance if you want to climb the temple structure itself.
**Travel note:** set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you land. Drivers, guesthouses and ride-hailing all run on WhatsApp and data.
## Day 2: Borobudur, then up to the Dieng Plateau
**Morning.** Leave early for Borobudur, about an hour to an hour and a half from the city. Arrive at opening, before the heat and the school groups. Walk the grounds and, if you booked a climbing slot, the terraces with their mandatory guide and sandals.
**Afternoon.** Continue north through Magelang and Wonosobo and climb to Dieng, arriving by mid-afternoon. Stop in Wonosobo for lunch, since food options thin out on the plateau. Once you arrive, walk to the Arjuna temple complex, a cluster of small Hindu shrines from around the 8th century, sitting in a flat field of grass and mist.
**Evening.** Dinner at your guesthouse: try mie ongklok, the thick noodle dish of Wonosobo, and purwaceng tea, a local herbal drink. Go to bed early, in every layer you brought.
**Base:** Dieng, 2 nights. Compare [[guesthouses on the Dieng Plateau|BOOKING_DIENG]]; rooms are simple, heating is rare and hot water can be unreliable, so read recent reviews before you book.
**Booking logic:** foreign visitors pay a separate, higher Borobudur tariff. As a working estimate, budget around IDR 455,000 for the grounds, and treat the terrace climb as a separate, capped ticket bought ahead on the official Borobudur booking site, where the current price is listed.
**Travel note:** this is the longest road day of the trip. Motion sickness tablets help on the final climb.
## Day 3: Sikunir sunrise, the craters and the coloured lake
**Morning.** A 3:30 a.m. start for Sikunir, a short drive from Dieng village to Sembungan. From the car park it is a steep walk of roughly 30 to 45 minutes to the viewpoint, where on a clear dry-season morning the sun comes up behind the volcanoes Sindoro and Sumbing. Back at the guesthouse for a hot breakfast and a nap.
**Afternoon.** Kawah Sikidang, a steaming crater field with boardwalks, then the Arjuna temples again if you want them in a different light, and Telaga Warna, the lake that shifts colour with the sulphur and the sun. The viewpoint at Batu Pandang looks down over Telaga Warna and its twin lake, Telaga Pengilon.
**Evening.** Early dinner and an early night; you drive back down tomorrow.
**Booking logic:** fees on the plateau are small but charged separately. Travel guides from recent years put the combined Arjuna and Sikidang ticket at around IDR 30,000 for foreign visitors and Telaga Warna noticeably higher, so carry plenty of small rupiah notes and expect the prices to have moved.
**Travel note:** in the dry months the ground can frost at dawn, which locals call embun upas. Bring a warm jacket, a hat, gloves and a torch for the Sikunir climb.
## Day 4: Back down to Yogyakarta
**Morning.** A slow breakfast with the view, then drive back down via Wonosobo, about three to four hours. If the weather is clear, stop at the tea terraces on the Wonosobo side for photographs.
**Afternoon.** Back in Yogyakarta, walk Taman Sari, the old royal water castle, if you arrive before it closes in the afternoon, then wander the lanes around it.
**Evening.** If it is a Tuesday, Thursday or Saturday in the dry season, take the Ramayana ballet at Prambanan's open-air theatre, which runs from about 7:30 p.m.; otherwise catch a shadow-puppet performance or simply eat well near Malioboro.
**Base:** Yogyakarta, 1 night.
**Booking logic:** the official ticketing schedule lists the open-air Ramayana show from May to October, moving indoors in the wet season or when it rains before the start, with seats from about IDR 150,000. Check the current schedule before you plan the evening around it.
**Travel note:** the ballet ends late and the theatre is outside the city, so arrange a return car rather than hoping for a ride-hailing pickup at 9 p.m.
## Day 5: Prambanan, then on to Solo
**Morning.** Check out and drive east to Prambanan, around 17 kilometres from the city, and be there at opening. The tall Shiva temple carries the Ramayana in relief around its inner gallery. Spend the extra hour walking north to the smaller Sewu temple inside the same park, which most visitors skip.
**Afternoon.** Continue east to Solo, roughly an hour and a half by car, and check in. In the late afternoon, walk through Pasar Gede, the old covered market, then the batik lanes of Kampung Laweyan.
**Evening.** Eat nasi liwet, rice cooked in coconut milk with chicken and egg, Solo's signature dish, from a street stall.
**Base:** Solo, 1 night. Compare [[hotels in Solo on Booking.com|BOOKING_SURAKARTA]]; anywhere near the centre or the Mangkunegaran palace works.
**Booking logic:** as a working estimate, budget around IDR 375,000 to 400,000 for a foreign adult ticket to Prambanan, and check the current tariff before you go. The old Borobudur and Prambanan combination ticket has been reported discontinued for foreign visitors, so plan on paying for each.
**Travel note:** if you would rather not hire a car for this leg, go back into Yogyakarta and take the train: the commuter line to Solo has a flat fare of IDR 8,000 per trip, according to 2026 timetable reports, and long-distance trains run the same stretch; compare [[Yogyakarta to Solo trains on 12Go|TWELVEGO_YOGYAKARTA_SOLO]].
## Day 6: Solo's palaces and the way home
**Morning.** Visit the Pura Mangkunegaran, the smaller of Solo's two royal courts and the better kept, with a guided walk through its open pendopo hall. Then the Keraton Kasunanan, the main palace, whose museum section is open on a short schedule; outer areas can be seen without a ticket.
**Afternoon.** Leave from Solo's Adi Soemarmo airport, or take the train back to Yogyakarta for a flight out of YIA. With a spare morning instead, drive about an hour up Mount Lawu to Candi Sukuh, a 15th-century temple shaped like a stepped pyramid, unlike anything else in Java.
**Base:** none. You leave today.
**Booking logic:** CNN Indonesia lists Mangkunegaran as open daily from 9 a.m. to 2:30 p.m. with tickets around IDR 30,000; the Keraton's hours vary through the week. Confirm both on the day, and dress modestly, with shoulders and knees covered.
**Travel note:** check that your onward flight leaves from Solo before you rely on it, because the route network there is much smaller than Yogyakarta's.
## How much does a 6-day Central Java trip cost?
As a working estimate, the fixed costs per foreign visitor on this route come to roughly IDR 1 to 1.5 million in tickets: about IDR 455,000 for Borobudur grounds, IDR 375,000 to 400,000 for Prambanan, the small Dieng fees, the Solo palaces, and a Ramayana seat if you go. The car and driver is the other large cost.
Rooms are the flexible part. Yogyakarta has everything from guesthouses to resort hotels, Dieng is basic at every price, and Solo is one of the best-value cities in Java. Our [[Indonesia travel costs guide|/indonesia-travel-costs]] has daily budget ranges if you want to set them against the rest of a trip.
^^ The three bases on this route compared. Prices and conditions are working estimates from 2025 and 2026 sources; check current rates before you book.
| Base | Nights | Altitude and climate | What you do from there | The catch |
| Yogyakarta | 2 | Warm and humid, close to sea level | Borobudur, Prambanan, the Kraton, Taman Sari, the Ramayana ballet | Busy, and the airport is about an hour away |
| Dieng Plateau | 2 | About 2,000 metres, close to freezing at dawn in the dry months | Sikunir sunrise, Arjuna temples, Sikidang crater, Telaga Warna | Basic rooms, cold nights, three to four hours each way by road |
| Solo (Surakarta) | 1 | Warm, like Yogyakarta | Mangkunegaran and Keraton palaces, batik quarters, Candi Sukuh | Fewer flights, and the palaces keep short hours |
## Borobudur, Prambanan or Dieng: which temples are worth your time?
If you only have time for one, Borobudur is the one: the largest Buddhist monument in the world, and the reason most people come. Prambanan is the strongest second choice, taller and more dramatic. The Dieng temples are small and simple, but older, and their setting in a cold volcanic valley is what you remember.
The three are not really substitutes, which is why this route visits all of them. Our [[Borobudur vs Prambanan guide|/destinations/java/borobudur-vs-prambanan]] compares the two big temples in more detail if you have to choose.
^^ The temples on this route compared. Fees are working estimates for foreign adults; check current prices on the official channels.
| Temple | Religion and age | Fee, as a working estimate | Best time | Why go |
| Borobudur | Buddhist, around the 9th century | About IDR 455,000 grounds, climb extra | At opening | Scale, the reliefs, the setting among volcanoes |
| Prambanan | Hindu, around the 9th century | About IDR 375,000 to 400,000 | At opening, or for the evening ballet | Height, the Ramayana reliefs, Sewu temple next door |
| Arjuna complex, Dieng | Hindu, around the 8th century | Small, around IDR 30,000 with Sikidang | Early morning, in the mist | Among the oldest temples in Java, with almost no crowds |
| Candi Sukuh, Mount Lawu | Hindu-Javanese, 15th century | Small, check locally | Morning, before cloud | A stepped pyramid unlike any other temple in Java |
## What to book early, and what to keep flexible
**Book early:** the Borobudur climbing slot, if you want to climb, since daily numbers are capped and slots sell out in the high season; your flights into Yogyakarta; and the Dieng guesthouse in July and August, especially around the Dieng Culture Festival.
**Book early:** the car and driver for Days 2 to 4. A driver who knows the Dieng road is worth more than a cheaper one who does not.
**Keep flexible:** the Sikunir morning. If the forecast shows cloud, sleep in and use the afternoon for the craters instead.
**Keep flexible:** Candi Sukuh, which depends on the weather and your flight time.
## Mistakes travellers make in Central Java
The most common mistake is visiting Dieng as a day trip from Yogyakarta. It means seven or eight hours in a car for a few hours on the plateau, usually at midday when the mist has lifted and the light is flat. The second is packing for the tropics: people arrive at Dieng in shorts and spend the evening in a blanket.
Other mistakes: assuming the Borobudur ticket includes the climb, when the terraces are a separate, capped booking; arriving at Solo's palaces in the afternoon, when they are closing; and timing the trip for the Dieng Culture Festival without booking rooms months ahead. The 2026 festival ran from 28 to 30 August, according to Indonesia's public broadcaster RRI, and the plateau fills up for it.
## What to cut, adapt or upgrade
**Cut:** with only four days, drop Solo, and do Prambanan on Day 4 on the way back from Dieng. With three, skip the overnight and take a [[Dieng Plateau day trip from Yogyakarta|KLOOK_DIENG_DAY_TRIP]] instead; it runs about 14 hours with hotel pickup, which is long but saves organising a car.
**Adapt:** if Dieng sounds too cold or too far, replace it with a dawn at Borobudur: a [[private Punthuk Setumbu sunrise and Borobudur tour|VIATOR_BOROBUDUR_SUNRISE_PRIVATE]] handles the pre-dawn pickup, the hill and the temple after it.
**Adapt:** to continue east, swap Solo for Mount Bromo; our [[5-day Yogyakarta and Bromo itinerary|/trips/5-days-yogyakarta-bromo]] covers that leg.
**Upgrade:** stay a night near Borobudur, in one of the resort hotels among the rice fields, to see the temple at both ends of the day.
## Before you build this trip
Visa rules for Indonesia vary by nationality, so check the latest official guidance before you book flights. Carry cash in rupiah for Dieng and Solo, where small entry fees, parking and warungs rarely take cards. Temples and palaces expect modest clothing, and Borobudur supplies sandals for the climb.
Pack for two climates: light clothes for Yogyakarta and Solo, and a proper warm layer, a hat and gloves for Dieng. Confirm Borobudur and Prambanan prices close to travel, because foreign tariffs are set in rupiah and move with policy. For more to do in the city between legs, see our [[things to do in Yogyakarta guide|/destinations/java/things-to-do-in-yogyakarta]].
## Final verdict
Central Java is better as a journey than as a commute. Seeing Borobudur on the way up to Dieng, Prambanan on the way out to Solo, and two cold nights on the plateau in between gives you the same famous temples as everyone else, plus the two places most visitors never reach.
Keep the two Dieng nights, start early at every temple, and end in Solo rather than back in Yogyakarta. That turns six days into a trip with a shape, and it shows you a Java that most first-time visitors never see.
## Related itineraries
[[7 days in Yogyakarta and East Java|/trips/7-days-yogyakarta-east-java]] if you would rather combine the temples with Bromo and Ijen.
[[10 days across Java, from Jakarta to Bromo|/trips/10-days-java-jakarta-bandung-yogyakarta-bromo]] if you have more time and want the whole island by train.
[[8 days in Java for a honeymoon|/trips/8-days-java-honeymoon-borobudur-bromo]] for a slower, more comfortable version of the temple route.
'''
FAQ=[
("Is the Dieng Plateau worth visiting?","Yes, if you stay overnight. Dieng combines some of Java's oldest Hindu temples, steaming craters and a colour-changing lake at about 2,000 metres, with a sunrise at Sikunir that rivals Bromo's for a fraction of the crowds. As a day trip from Yogyakarta it is mostly time in a car."),
("How many days do you need for Central Java?","Three days covers Yogyakarta, Borobudur and Prambanan. Five to six days, as in this plan, lets you add two nights on the Dieng Plateau and a night in Solo, which is the version that shows you more than the classic temple circuit."),
("How cold does it get on the Dieng Plateau?","Cold for Indonesia. Nights are chilly all year, and in the dry months from about June to August the temperature near dawn can drop low enough for frost on the ground. Bring a warm jacket, a hat and gloves."),
("Can you visit Borobudur and Prambanan on the same day?","Yes, many day tours from Yogyakarta do it, but it makes for a long, hot day. This itinerary splits them, visiting Borobudur on the way to Dieng and Prambanan on the way to Solo, so neither is rushed."),
("How do you get from Yogyakarta to Solo?","By train is easiest. The commuter line between Yogyakarta and Solo takes about an hour to an hour and a half with a flat fare of IDR 8,000, according to 2026 timetable reports, and long-distance trains run the same route. By car it is roughly an hour and a half."),
("Is Solo worth visiting from Yogyakarta?","Yes, for a day or a night. Solo is calmer than Yogyakarta, with two royal palaces, the Pura Mangkunegaran and the Keraton Kasunanan, good batik quarters and some of the best street food in Java, and it sees far fewer foreign visitors."),
("When is the best time to visit Central Java?","Roughly May to September, the dry season, when skies are clearer for the Dieng and Borobudur sunrises and the open-air Ramayana ballet runs at Prambanan. The wet months bring afternoon rain but fewer visitors."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"cj-{p}{cnt[0]}"
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
title="6 Days in Central Java: Borobudur, the Dieng Plateau and Solo"
intro="Most Central Java trips are Yogyakarta plus two temples, done as day trips from the same hotel. This six-day route keeps Borobudur and Prambanan but puts them on the road: Borobudur on the way up to two cold nights on the Dieng Plateau, with a 3:30 a.m. sunrise at Sikunir, and Prambanan on the way out to Solo, the quieter royal city most visitors never reach. It covers the drive times, the 2026 ticket estimates and where the plan is fragile."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Central Java Itinerary: 6 Days, Borobudur, Dieng and Solo",
 metaDescription="A 6-day Central Java route past the Yogyakarta day trips: Borobudur, two cold nights on the Dieng Plateau, Prambanan and Solo's palaces, with 2026 costs.",
 focusKeyword="Central Java itinerary",intro=intro,
 route="Yogyakarta (1 night), Borobudur, Dieng Plateau (2 nights), Yogyakarta (1 night), Prambanan, Solo (1 night)",
 routeSummary="Yogyakarta → Borobudur → Dieng Plateau → Yogyakarta → Prambanan → Solo",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to September",logisticsComplexity="moderate",
 destinationPrimary="java",travelStylePrimary="culture_temples",travelStyleSecondary=["adventure_volcanoes"],
 travellerTypes=["couples","solo_travellers","repeat_travellers"],tripLengthBucket="one_week",tripLengthDays=6,vibe="balanced",
 experienceTags=["temples","volcanic_highlands","sunrise_hike","royal_palaces","train_travel","cultural_performance"],
 primaryAffiliatePartner="booking",secondaryAffiliatePartners=["klook","viator","12go","airalo"],
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
