import json,re,sys,datetime
SLUG="6-days-bali-volcanoes-sidemen-batur-munduk"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
KL="https://www.klook.com/en-US/activity/22005-mount-batur-sunrise-experience-4wd-jeep-bali/"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",day="Day 1",experienceCategory="esim_connectivity",notes="travelpayouts"),
 dict(partner="klook",placeholderId="KLOOK_MOUNT_BATUR_SUNRISE",affiliateUrl="https://klook.tpx.lu/QYeSR2G9?u=https%3A%2F%2Fwww.klook.com%2Fen-US%2Factivity%2F22005-mount-batur-sunrise-experience-4wd-jeep-bali%2F",publicUrl=KL,anchorText="Mount Batur sunrise with a 4WD jeep",day="Day 4",experienceCategory="volcano_sunrise",notes="travelpayouts"),
 dict(partner="booking",placeholderId="BOOKING_SIDEMEN",affiliateUrl=BK%"Sidemen",publicUrl=BK%"Sidemen",anchorText="Sidemen stays on Booking.com",day="Day 1",experienceCategory="accommodation",notes="cj"),
 dict(partner="booking",placeholderId="BOOKING_KINTAMANI",affiliateUrl=BK%"Kintamani",publicUrl=BK%"Kintamani",anchorText="Kintamani and Batur stays on Booking.com",day="Day 3",experienceCategory="accommodation",notes="cj"),
 dict(partner="booking",placeholderId="BOOKING_MUNDUK",affiliateUrl=BK%"Munduk",publicUrl=BK%"Munduk",anchorText="Munduk stays on Booking.com",day="Day 4",experienceCategory="accommodation",notes="cj"),
]
for a in AFF: a.update(_key="a"+a["placeholderId"][:6].lower()+str(AFF.index(a)),_type="affiliateLink",linkStatus="live")
SRC='''
## Who is this Bali volcano and highlands week for, and who should skip it?
This week suits travellers who want Bali's cooler, greener interior: a sunrise on an active volcano, rice terrace villages with almost no beach-club traffic, and the northern lakes and waterfalls. It works well for friends, couples and solo travellers who are comfortable with a 2am alarm and a lot of time in a car.
It is not for you if you want sand, surf or nightlife, because there is no coast on this route at all. Skip it as well if you have a bad knee or a fear of loose volcanic gravel, or if you are travelling with children under about 8, since the Batur path is steep and the transfers are long.
## Trip at a glance
**Route:** Denpasar airport, Sidemen (2 nights), Batur area (1 night), Munduk (2 nights), back to the airport.
**Pace:** Active. Three bases, one pre-dawn start, and roughly 7 to 9 hours of driving across the week as a working estimate.
**Best for:** First-timers on a second week, repeat visitors who have done Ubud and the south coast, and anyone adding Bali to a Lombok or Java trip.
**Not included:** The beaches. If you want them, pair this with the [[10-day Bali and Gili Islands route|/trips/10-days-bali-gili-islands]].
## Why does this route run east, then centre, then north?
The route follows the volcanic spine of the island so that every transfer is short and every base has a different view. Sidemen looks at Mount Agung, Batur sits inside its own caldera, and Munduk faces the crater lakes of the north, so the week never repeats a landscape.
Going east first also means your longest day, the road out of the east, happens when you are fresh. Doing it in reverse puts the Batur alarm after a tiring drive. The only real cost is that you give up Ubud, which sits conveniently between these places but pulls the whole week back towards crowds. If you want Ubud, see the [[7-day first-timers route|/trips/7-days-bali-first-timers]].
## How many days do you need for Bali's volcanoes and highlands?
Six days is the realistic minimum for three bases without feeling hurried. Five days forces you to drop Munduk or Sidemen, and seven or more lets you add a second night near Batur or a day trip to the Sekumpul waterfalls.
Each night you remove saves you one repack but costs you a morning of slow village life, which is the point of the interior. If you have only four days, pick Sidemen plus the Batur sunrise and stop there.
## Day 1: Denpasar to Sidemen
**Morning.** Land, clear immigration and pay the Bali tourist levy through the official Love Bali portal before you arrive (IDR 150,000 per person as a working estimate for 2026, so check the current rate). Buy a local eSIM before you leave home, for example an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]], so your maps work on the road.
**Afternoon.** Drive to Sidemen, roughly 1.5 to 2 hours depending on traffic. Check in, then walk the terraces near your stay while the light is low. Sidemen is a valley of rice fields facing Mount Agung, and the walking is gentle.
**Evening.** Eat at your accommodation or a nearby warung and go to bed early.
**Base:** Sidemen. Compare options in the [[Sidemen stays on Booking.com|BOOKING_SIDEMEN]] search.
**Booking logic:** Choose a room with a terrace view, because clouds on Agung usually lift at dawn and clear again late afternoon.
## Day 2: Sidemen's villages and terraces
**Morning.** Do a self-guided terrace walk, then visit a traditional weaving workshop, where songket and endek cloth are made on hand looms. Ask the price before you start and compare it with a second workshop.
**Afternoon.** Rest, swim at your stay if it has a pool, or take a short drive to the viewpoint areas around Sidemen. Mount Agung is Bali's highest volcano, and its summit climb is a separate, hard, midnight-start effort that is often closed during volcano alerts, so we do not build it into this week.
**Evening.** Early dinner and an early night, because tomorrow you move to Batur.
**Travel note:** Besakih temple sits above Sidemen and is worth a stop only if you go with a licensed guide at the official ticket office. Informal touts at the gate are a known annoyance.
## Day 3: Sidemen to the Batur caldera
**Morning.** Leave after breakfast for the Kintamani highlands, roughly 1.5 to 2 hours by car.
**Afternoon.** Check in near Lake Batur and relax. Many travellers soak in a hot spring on the lake's edge, but confirm the entry price on the day. Pack a warm layer, because the caldera rim can be genuinely cold at night and at dawn.
**Evening.** Dinner, then bed by about 8:30pm. Your pickup tomorrow is in the dark.
**Base:** Kintamani or the lake's shore. See the [[Kintamani and Batur stays on Booking.com|BOOKING_KINTAMANI]] search.
**Booking logic:** Sleeping near the trailhead cuts the transfer in the dark to under half an hour, instead of the 1.5 hours of a pickup from Ubud.
## What is the Mount Batur sunrise trek really like?
The Batur sunrise trek is a roughly two-hour pre-dawn climb to a summit at about 1,717 metres, with a local guide required in practice and arranged through the village trekking association. Group prices for 2026 run around IDR 600,000 to 800,000 per person, and private treks cost more, so treat these as working estimates.
Expect a 2am to 3am start, a head torch, and loose gravel near the top. The crowd at the summit can be large on clear mornings, so move away from the first viewpoint for space. If a pre-dawn climb is not for you, a [[Mount Batur sunrise with a 4WD jeep|KLOOK_MOUNT_BATUR_SUNRISE]] reaches a viewing area with far less walking.
## Day 4: Batur sunrise, then Munduk
**Morning.** Climb, watch the sun come up over Agung and Lake Batur, descend and eat the breakfast most tours include. Be back at your hotel by about 10am to shower and pack.
**Afternoon.** Drive north to Munduk, roughly 2 hours. Stop at Ulun Danu Beratan temple on Lake Beratan near Bedugul, which sits on the water and takes 30 to 45 minutes to visit. Check the current entry fee at the gate.
**Evening.** You will be tired. Eat at your accommodation and sleep.
**Base:** Munduk. Compare the [[Munduk stays on Booking.com|BOOKING_MUNDUK]] results.
**Travel note:** If you are not a morning person, you can do the sunrise on Day 3 instead, but then you lose the long afternoon rest that makes the climb enjoyable.
## Day 5: Munduk's waterfalls and clove country
**Morning.** Walk to the nearby waterfalls, such as Munduk Waterfall and Banyumala, which are reached on short forest paths. Go early, because the paths are slippery after rain and the light is better.
**Afternoon.** Wander the village's clove and coffee plantations. The air is noticeably cooler than the south coast.
**Evening.** Dinner with a view of the twin lakes if your stay has one. Early night, because tomorrow is a travel day.
**Booking logic:** Munduk has far fewer rooms than Ubud. Book early for the dry months, roughly April to October.
## Day 6: Munduk to the airport
**Morning.** Leave Munduk. The road to the airport takes roughly 3 hours or more depending on traffic, and often well over that in busy periods.
**Afternoon.** Aim to be at the airport at least 3 hours before an international departure, and book a flight in the evening if you can.
**Travel note:** Do not schedule a same-day long-haul connection from a Munduk checkout unless your flight is after dark.
## What to book early, and what to keep flexible
Book Sidemen and Munduk rooms early in the dry season, since both have a limited number of rooms. Keep the Batur trek flexible: reserve a day or two before, then confirm the weather the evening before, because clouds at the summit remove the point of climbing.
A private driver for the whole week usually makes more sense than separate transfers, because it removes three negotiations and the road between these bases has little public transport. Confirm the day rate and fuel in writing.
## What does it cost compared with a beach week?
A volcano and highlands week is cheaper than a south-coast week for rooms and meals, but pricier for transport, because you will rely on a private driver. Entry fees and the Batur trek are the main extra costs.
| Item | Volcano week (6 days) | Beach week (6 days) |
|---|---|---|
| Rooms | Lower in Sidemen and Munduk | Higher in Seminyak, Canggu, Uluwatu |
| Transport | Private driver, higher | Scooters and short rides, lower |
| Activities | Batur trek, temple and waterfall fees | Surf lessons, beach clubs |
| Crowds | Low, except the Batur summit | High |
Treat all of this as relative, since prices move with season and exchange rates, and check current fares before you book.
## What mistakes do travellers make on this route?
The most common mistake is pairing the Batur sunrise with a booking in Ubud. The 1.5-hour pre-dawn pickup costs you sleep and puts you in a crowd of tour vans. The second is packing for a tropical beach and arriving cold at the rim, so bring a fleece or a jacket.
The third is booking a flight out of Bali on the morning you leave Munduk. The fourth is trusting touts who offer a cheaper Batur trek at the roadside, since the legitimate association sets prices and the cheap offers often skip the guide.
## What should you cut, adapt or upgrade?
Cut Day 2's afternoon if you want a lighter week. Adapt the route by swapping Munduk for Ubud if you need cafes and cooking classes. Upgrade by adding the Sekumpul waterfalls for an extra half day, or by adding a night near Lovina on the north coast.
If you want diving at the end of the week, the [[Bali diving route|/trips/7-days-bali-diving-tulamben-amed-menjangan]] picks up from the north-east. If a bigger volcano trek appeals, the [[Rinjani trek on Lombok|/trips/7-days-lombok-rinjani-trek]] is the next step up.
## Before you build this trip
Check the Mount Agung and Mount Batur alert status through the Indonesian volcano agency, and confirm any trail closures with your guide. Pack a warm layer, a head torch and shoes with grip, not sandals.
Get travel insurance that covers volcano trekking, and carry some cash for village entry fees and warungs, because small places do not take cards. Fees and rules change, so check the latest official guidance.
## Final verdict: is a Bali volcano week worth it?
Yes, if you have already done the beach and Ubud circuit, because this is the version of Bali that most visitors skip and it takes only six days. Do it at its own pace, accept the early alarm, and you get cool air, empty terraces and one genuinely good sunrise.
Skip it if the beach is the point of your trip. For that, the [[10-day Bali and Gili Islands route|/trips/10-days-bali-gili-islands]] is a better fit.
## Related itineraries
See also the [[7-day Bali first-timers route|/trips/7-days-bali-first-timers]], the [[7-day Bali diving route|/trips/7-days-bali-diving-tulamben-amed-menjangan]] and the [[7-day Rinjani trek|/trips/7-days-lombok-rinjani-trek]].
'''
FAQ=[
("How many days do you need to see Bali's volcanoes and highlands?","Six days is a realistic minimum for Sidemen, the Batur caldera and Munduk without rushing. With four days, keep Sidemen and the Batur sunrise only. With seven or more, add a second night near Batur or a day trip to the Sekumpul waterfalls."),
("Do you need a guide to climb Mount Batur?","In practice, yes. The village trekking associations arrange guides at the trailhead and can refuse entry without one. As a working estimate, group treks in 2026 cost roughly IDR 600,000 to 800,000 per person, so confirm the current price when you book."),
("Is the Mount Batur sunrise trek hard?","It is moderate. The climb takes roughly two hours in the dark on a steep, gravelly path to about 1,717 metres. Most reasonably fit travellers manage it, but the loose gravel near the top is the hard part, so wear shoes with grip."),
("Can you climb Mount Agung on this route?","This route does not include it. Agung is a much harder, midnight-start climb and is closed whenever volcano alert levels rise. Check the current status with your guide and the Indonesian volcano agency before planning it."),
("Is Munduk worth visiting?","Yes, if you want cooler air, forest waterfalls and quiet village streets. It is a poor choice for beach lovers, and it adds a long transfer to the airport on the last day."),
("What is the best time of year for Bali's highlands?","The dry months, roughly April to October, give the clearest summit views and the safest paths. The wet season brings mist and slippery trails, and clouds can hide the sunrise entirely, so keep the trek day flexible."),
("Do you need to pay the Bali tourist levy?","Yes, foreign visitors pay it once per trip through the official Love Bali portal. As a working estimate it is IDR 150,000 per person in 2026, so check the current rate before you fly."),
]
import random
cnt=[0]
def K(p):
    cnt[0]+=1; return f"{p}{cnt[0]}"
def spans(text,markdefs):
    out=[]
    pat=re.compile(r"\*\*(.+?)\*\*|\[\[(.+?)\|(.+?)\]\]")
    pos=0
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
body=[]
lines=[l for l in SRC.strip().split("\n")]
tbl=[]
def flush_tbl():
    global tbl
    if tbl:
        rows=[[c.strip() for c in r.strip("|").split("|")] for r in tbl if not set(r)<=set("|-: ")]
        for r in rows[1:]:
            txt=f"{r[0]}: "+"; ".join(f"{rows[0][i]}: {r[i]}" for i in range(1,len(r)))+"."
            md=[]; body.append(dict(_type="block",_key=K("b"),style="normal",markDefs=md,children=spans(txt,md)))
        tbl=[]
for l in lines:
    if l.startswith("|"): tbl.append(l); continue
    flush_tbl()
    md=[]
    if l.startswith("## "): body.append(dict(_type="block",_key=K("b"),style="h2",markDefs=md,children=spans(l[3:],md)))
    elif l.strip(): body.append(dict(_type="block",_key=K("b"),style="normal",markDefs=md,children=spans(l,md)))
flush_tbl()
title="6 Days in Bali's Volcanoes and Highlands: Sidemen, Batur and Munduk"
intro="Most Bali itineraries send you to the same beaches and the same Ubud lanes. This one goes the other way, up through the east, the Batur caldera and the cool northern highlands, and asks you to accept an early alarm and a lot of road in exchange for a quieter island. It is a good second Bali, built for people who have done the south coast and want something with more air in it."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Bali Volcano Itinerary: Sidemen, Batur, Munduk",
 metaDescription="A 6-day Bali volcano and highlands route: Sidemen terraces, a Mount Batur sunrise and Munduk waterfalls, with real drive times and 2026 costs.",
 focusKeyword="Bali volcano itinerary",intro=intro,
 route="Denpasar, Sidemen, Mount Batur, Munduk, Denpasar",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 destinationPrimary="bali",destinationSecondary=[],travelStylePrimary="adventure_volcanoes",travelStyleSecondary=["culture_temples"],
 travellerTypes=["friends","solo_travellers","couples"],tripLengthBucket="one_week",tripLengthDays=6,vibe="active",
 bestSeason=None,body=body,affiliateLinks=AFF,
 faq=[dict(_key=K("f"),question=q,answer=a) for q,a in FAQ])
doc={k:v for k,v in doc.items() if v is not None}
# validate
txt=json.dumps(doc,ensure_ascii=False)
bad=["—","–","hidden gem","must-see","paradise","immerse yourself","unforgettable","something for everyone","vibrant culture","crystal-clear","breathtaking","rich history","local charm","authentic experience","off the beaten path","once-in-a-lifetime","bucket list","dream destination","(SEARCH"]
fails=[b for b in bad if b.lower() in txt.lower()]
keys=re.findall(r'"_key": "([^"]+)"',json.dumps(doc)); 
if len(keys)!=len(set(keys)): fails.append("dup keys")
refs={m["placeholderId"] for b in body for m in b["markDefs"] if m["_type"]=="affiliateLinkRef"}
have={a["placeholderId"]:a["affiliateUrl"] for a in AFF}
for r in refs:
    if not have.get(r): fails.append("aff "+r)
if len(doc["metaTitle"])>60 or len(doc["metaDescription"])>155: fails.append("meta")
print("meta",len(doc["metaTitle"]),len(doc["metaDescription"]),"refs",refs,"words",len(re.findall(r"\w+"," ".join(c["text"] for b in body for c in b["children"]))))
print("FAILS",fails)
json.dump(doc,open("content/articles/"+SLUG+".json","w"),indent=2,ensure_ascii=False)
