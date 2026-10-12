import json,re,datetime
SLUG="6-days-belitung-granite-beaches-island-hopping"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
TG="https://12go.asia/en/travel/jakarta/belitung"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="12GO_JAKARTA_BELITUNG",affiliateUrl=TG+"?z=16022946",publicUrl=TG,anchorText="Jakarta to Belitung flights on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_TANJUNG_KELAYANG",affiliateUrl=BK%"Tanjung+Kelayang",publicUrl=BK%"Tanjung+Kelayang",anchorText="stays near Tanjung Kelayang on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_TANJUNG_PANDAN",affiliateUrl=BK%"Tanjung+Pandan",publicUrl=BK%"Tanjung+Pandan",anchorText="stays in Tanjung Pandan on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"bl-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Who is this Belitung trip for, and who should skip it?
This six-day Belitung trip is for families, couples and friends who want a calm beach week in Indonesia without a long journey: one hour on a plane from Jakarta, one base on the north coast, and short boat trips between granite islands. It suits young children, first beach holidays and anyone tired of packing every second day.
It is not for you if you want surf, nightlife, big diving or a full cultural program. Belitung is quiet after dark, the reefs are pleasant rather than world class, and the island has little public transport, so you will pay for a car and driver. If you want dramatic diving, look at Raja Ampat or Komodo instead.
## Trip at a glance
**Route:** Jakarta, Tanjung Pandan airport, the north coast around Tanjung Kelayang and Tanjung Tinggi (4 nights), Tanjung Pandan town (1 night), back to Jakarta.
**Pace:** Relaxed. One island-hopping day, one long road day that you can cut, and the rest is beach time.
**Getting there:** a domestic flight of about 1 hour from Jakarta Soekarno-Hatta to Tanjung Pandan (TJQ).
**Best season:** roughly May to October, the drier months, when the sea between the islands is calmest.
**Best for:** families with young children, couples, small groups of friends, and anyone living in or passing through Jakarta.
## Where is Belitung, and why go there instead of Bali?
Belitung is an island in the Java Sea off the east coast of Sumatra, part of the Bangka Belitung Islands province, and about an hour by air from Jakarta. It is known for beaches framed by huge rounded granite boulders, and in April 2021 UNESCO listed the island as a Global Geopark, Indonesia's sixth, for that granite landscape.
The case for it over Bali is simple for anyone starting in Jakarta: a shorter flight, quieter beaches and no traffic. The case against it is that there is less to do, fewer places to eat and almost no public transport. For a family week of swimming and boat trips, that trade is often the right one.
## How many days do you need in Belitung?
Five to six days is the right length for Belitung. That gives you one full island-hopping day, one optional day trip to East Belitung, a spare day for weather and two slow beach days. Three days covers only the island hopping and Tanjung Tinggi, and more than a week starts to repeat itself unless you simply want a beach holiday.
This route uses six days because the island-hopping day depends on the sea, and a calm morning is the one thing you cannot schedule. With a spare day, a cancelled boat costs you nothing.
## How do you get to Belitung from Jakarta?
You fly. Direct flights connect Jakarta Soekarno-Hatta with Tanjung Pandan (TJQ) in about 1 hour 5 minutes; current listings show morning departures on Sriwijaya Air and a late-morning Citilink flight. There is no practical ferry for visitors. Compare current schedules for [[Jakarta to Belitung flights on 12Go|12GO_JAKARTA_BELITUNG]] before you fix your dates.
Take the earliest flight you can. Landing in the morning turns day 1 into a beach afternoon instead of a travel day. Fares rise sharply around Indonesian school holidays and Lebaran, so book early if your dates touch either.
## Day 1: Fly from Jakarta and settle on the north coast
**Morning.** Fly from Jakarta to Tanjung Pandan. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you leave home so you can message your driver from the arrivals hall.
**Afternoon.** Drive to the north coast around Tanjung Kelayang, which takes under an hour as a working estimate. Check in, swim, and let the children find their feet. The water along this coast is usually shallow and calm in the dry season.
**Evening.** Eat near your hotel. Restaurants on this stretch are few, so ask your hotel what is open before you go out.
**Base:** the north coast, near Tanjung Kelayang or Tanjung Tinggi. Compare [[stays near Tanjung Kelayang on Booking.com|BOOKING_TANJUNG_KELAYANG]].
**Booking logic:** stay within walking distance of Tanjung Kelayang beach if you can. The island-hopping boats leave from there, so you avoid an early drive on day 2.
## Day 2: Island hopping to Lengkuas lighthouse
**Morning.** Leave early from Tanjung Kelayang beach. A typical loop takes in Batu Berlayar, a cluster of granite rocks, a small sandbar island when the tide allows, and Lengkuas island, where a lighthouse built by the Dutch in 1882 still works. Lengkuas is about 20 to 30 minutes by boat from Tanjung Kelayang. Snorkel off Lengkuas, where the reef is close to the shore.
**Afternoon.** Many boats stop at Kepayang island on the way back. Kepayang hosts a turtle conservation and ecotourism project run by the Belitung Coastal Community Group, a local organisation supported by the UNDP small grants programme. Children usually remember this stop more than the lighthouse.
**Evening.** Early dinner and an early night. A day on a small boat in the sun tires everyone.
**Booking logic:** boats are hired whole, and a boat takes up to about ten people. Travel listings have quoted roughly IDR 350,000 to 550,000 per boat in past years, which is old data, so expect more in 2026 and agree the price, the islands, snorkel gear and the return time before you board.
**Travel note:** if the wind is up, the boatmen will say so. Move the trip to day 3 or day 5 rather than going out in rough water with children.
## Day 3: Tanjung Tinggi and a slow beach day
**Morning.** Swim at your hotel beach while it is cool.
**Afternoon.** Go to Tanjung Tinggi, the beach of giant granite boulders that was a main filming location for the 2008 film Laskar Pelangi. The boulders are good for scrambling, but they are smooth and slippery when wet, so keep small children close.
**Evening.** Stay for sunset at Tanjung Tinggi, then eat nearby.
**Travel note:** this is also your spare day. If the boat trip was cancelled on day 2, do it today and move Tanjung Tinggi to the afternoon.
## Day 4: East Belitung, the Laskar Pelangi school and Manggar coffee
**Morning.** Drive east to Gantong, roughly 2 hours from Tanjung Pandan as a working estimate. Visit the replica of the Laskar Pelangi school, built for the film of Andrea Hirata's novel, and the Museum Kata Andrea Hirata nearby, a small literary museum.
**Afternoon.** Stop in Manggar, a small town known for its coffee culture and a monument to its many coffee shops. Order local coffee and a snack in a traditional shop.
**Evening.** Drive back to the north coast before dark.
**Travel note:** this is the day to cut if your children dislike long car rides. It adds about four hours of driving and you lose a beach day.
## Day 5: Danau Kaolin and a night in Tanjung Pandan
**Morning.** Last swim on the north coast, then check out.
**Afternoon.** Drive to Tanjung Pandan and stop at Danau Kaolin, a white and turquoise lake left by kaolin mining, about 10 minutes from town. It is not an official attraction, facilities are minimal and swimming is not allowed, so treat it as a short photo stop.
**Evening.** Eat Mie Belitung, the island's noodle dish, and try a coffee at one of the old coffee houses in town.
**Base:** Tanjung Pandan. Compare [[stays in Tanjung Pandan on Booking.com|BOOKING_TANJUNG_PANDAN]].
**Booking logic:** sleeping in town keeps the last morning short, because the airport is close.
## Day 6: Fly back to Jakarta
**Morning.** Buy coffee or satam stone souvenirs if you want them. Satam is the local name for the black tektite glass found on the island.
**Afternoon.** Fly back to Jakarta.
**Travel note:** if you are connecting to an international flight, take the morning flight from Tanjung Pandan and leave at least four hours in Jakarta. Delays on short domestic routes are common.
## How does Belitung compare with Karimunjawa and the Gili Islands?
For a beach week from Jakarta, Belitung is the easiest of the three to reach, with a one-hour direct flight and no boat crossing to the main island. Karimunjawa is wilder but depends on a ferry timetable from Jepara, and the Gili Islands are livelier but need a flight to Lombok and a boat.
^^ How three beach weeks compare for a family starting in Jakarta. Times are working estimates, so check current schedules.
| | Belitung | Karimunjawa | Gili Islands |
|---|---|---|---|
| Getting there from Jakarta | Direct flight of about 1 hour | Road or flight to Java's north coast, then a ferry from Jepara on set days | Flight to Lombok, then a road transfer and a boat |
| Weather risk to your plan | Boat day can move, the island itself stays reachable | Ferries can be cancelled in rough seas | Boats can be cancelled in rough seas |
| Getting around | Car and driver | Motorbike, car or boat | Walking, bicycles, horse carts |
| Best for | Young children, short breaks, one base | Snorkelling and quiet, if the ferry days fit | Couples and friends who want restaurants and evenings |
| Weak point | Little to do after dark, few restaurants | Timetable shapes the whole trip | Busier, and more crossings |
If the ferry days do not suit you, see our [[Karimunjawa itinerary|/trips/6-days-karimunjawa-java-islands]] for how that trip is planned. For the Gilis with children, see the [[10-day Lombok and Gili Islands family route|/trips/10-days-lombok-gili-families]].
## What to book early, and what to keep flexible
Book early: your flights, especially around school holidays and Lebaran, and your north coast room, since the choice is small. Arrange a car and driver for the whole stay through your hotel, and confirm the daily rate and fuel in writing.
Keep flexible: the island-hopping day. Book the boat the evening before, once you have seen the forecast, and keep a second day free in case the sea is rough.
## What mistakes do travellers make in Belitung?
The most common mistake is assuming you can get around without a driver. There are no regular buses for visitors and ride-hailing is limited, so plan on a car. The second is staying in Tanjung Pandan for the whole trip, which adds a drive every day to reach the beaches and the boats.
The third is going in the wet season, roughly November to April, and building the trip around the boat day. The fourth is arriving without cash, since small warungs, boatmen and the islands do not take cards.
## What should you cut, adapt or upgrade?
Cut day 4 if you have young children or less time; the trip still works as a five-day beach and island week. Adapt it by staying all five nights on the north coast if you have an early flight home, since the airport is still reachable from there.
Upgrade by adding a second boat day to the quieter southern coast, or by booking a beachfront villa with a pool for the slow days. If you want more adventure after Belitung, a [[North Sumatra trip with kids|/trips/9-days-north-sumatra-with-kids]] adds orangutans and Lake Toba.
## Before you build this trip
Check the visa rules for your passport on our [[Indonesia visa guide|/visa-guide]]; Belitung has no separate entry rules. Bring cash in rupiah, reef-safe sunscreen, water shoes for the granite and snorkel masks that fit small faces, since rental gear is often adult sized.
Get travel insurance that covers boat trips and snorkelling. Fees and schedules change, so confirm current flight routes and boat prices before you lock in your room.
## Final verdict: is Belitung worth it?
Yes, if you start in Jakarta and want an easy beach week with children or a partner. Belitung gives you calm water, strange and beautiful granite coastline and one good boat day, for one hour of flying. Keep the pace slow, stay on the north coast and leave space for the sea to decide your boat day.
Skip it if you want nightlife, surf or serious diving. For those, the Gili Islands, Komodo or Raja Ampat are better choices.
## Related itineraries
[[6 days in Karimunjawa|/trips/6-days-karimunjawa-java-islands]] for the other island escape from Java.
[[9 days in North Sumatra with kids|/trips/9-days-north-sumatra-with-kids]] for a family trip with more wildlife.
[[The Wild Indonesia hub|/destinations/wild-indonesia]] for routes beyond the main islands.
'''
FAQ=[
("Is Belitung worth visiting?","Yes, if you want a calm beach week close to Jakarta. Belitung offers granite boulder beaches, easy island hopping and quiet roads, for a one-hour flight. It is less good for nightlife, surf or serious diving, and you will need a car and driver to get around."),
("How do you get to Belitung from Jakarta?","Fly from Jakarta Soekarno-Hatta to Tanjung Pandan (TJQ). The direct flight takes about 1 hour 5 minutes, and current listings show daily morning and late-morning departures. There is no practical ferry for visitors, so check current schedules before you book."),
("How many days do you need in Belitung?","Five to six days is the right length. It covers one island-hopping day, a trip to East Belitung, two beach days and a spare day in case the sea is too rough for boats. Three days is enough only for island hopping and Tanjung Tinggi."),
("Is Belitung good for families with children?","Yes. The flight from Jakarta is short, the north coast water is usually shallow and calm in the dry season, and you can stay in one place all week. Keep children close on the granite boulders, which get slippery when wet, and skip the long East Belitung drive if they dislike cars."),
("What is the best time to visit Belitung?","The drier months, roughly May to October, are best because the sea between the islands is calmer. From November to April heavier rain and wind can cancel boat trips, so keep a spare day if you travel then."),
("How much does island hopping in Belitung cost?","You hire the whole boat, which takes up to about ten people. Past travel listings quoted roughly IDR 350,000 to 550,000 per boat, so expect more in 2026. Agree the price, the islands, snorkel gear and the return time before you leave Tanjung Kelayang."),
("Do you need a car in Belitung?","In practice, yes. There are no regular buses for visitors and ride-hailing is limited, so most travellers hire a car with a driver through their hotel. Confirm the daily rate and fuel in writing before the first day."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"bl-{p}{cnt[0]}"
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
title="6 Days in Belitung: Granite Beaches and Island Hopping from Jakarta"
intro="Belitung is the beach week most foreign visitors to Indonesia have never heard of, and most people in Jakarta know well. It is one hour from the capital by plane, it has calm water, granite boulders the size of houses and a handful of small islands you can reach in twenty minutes by boat. What it does not have is much to do after dark or any easy way to get around without a driver. This route accepts both, keeps you on one coast, and leaves the sea to choose your boat day."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Belitung Itinerary: 6 Days of Beaches and Islands",
 metaDescription="A relaxed 6-day Belitung itinerary from Jakarta: granite beaches, Lengkuas island hopping and a family pace, with flights, boat costs and when to go.",
 focusKeyword="Belitung itinerary",intro=intro,
 route="Jakarta, Tanjung Pandan, Tanjung Kelayang, Lengkuas Island, Gantong, Manggar, Tanjung Pandan, Jakarta",
 routeSummary="Jakarta → Tanjung Kelayang → Lengkuas Island → East Belitung → Tanjung Pandan",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to October",logisticsComplexity="easy",
 destinationPrimary="wild_indonesia",destinationSecondary=[],travelStylePrimary="beach_islands",travelStyleSecondary=["diving_snorkeling"],
 travellerTypes=["families","couples","friends"],tripLengthBucket="one_week",tripLengthDays=6,vibe="relaxed",
 experienceTags=["snorkeling","island_day_trip","beach_sunset"],
 primaryAffiliatePartner="booking",secondaryAffiliatePartners=["12go","airalo"],
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
