import json,re,datetime
SLUG="7-days-bukit-lawang-lake-toba-orangutans"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
V1="https://www.viator.com/tours/Medan/Full-Day-Jungle-Trek-Bukit-Lawang-Tour/d4866-193061P1"
V2="https://www.viator.com/tours/Medan/Wonderful-2Days-1Night-Bukit-Lawang-jungle-trekking-FREE-Rafting/d4866-426352P1"
VQ="?pid=P00303362&mcid=42383&medium=link&campaign=bukit-lawang-lake-toba"
T1="https://12go.asia/en/travel/medan/parapat"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="viator",placeholderId="VIATOR_BUKIT_LAWANG_DAY_TREK",affiliateUrl=V1+VQ,publicUrl=V1,anchorText="full-day small-group jungle trek in Bukit Lawang",experienceCategory="tour"),
 dict(partner="viator",placeholderId="VIATOR_BUKIT_LAWANG_2D1N",affiliateUrl=V2+VQ,publicUrl=V2,anchorText="two-day, one-night Bukit Lawang trek with river tubing",experienceCategory="tour"),
 dict(partner="12go",placeholderId="12GO_MEDAN_PARAPAT",affiliateUrl=T1+"?z=16022946",publicUrl=T1,anchorText="Kualanamu to Parapat transfers on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_BUKIT_LAWANG",affiliateUrl=BK%"Bukit+Lawang",publicUrl=BK%"Bukit+Lawang",anchorText="stays in Bukit Lawang on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_TUK_TUK",affiliateUrl="https://www.booking.com/searchresults.html?ss=Tuk+Tuk%2C+Samosir%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1",publicUrl="https://www.booking.com/searchresults.html?ss=Tuk+Tuk%2C+Samosir%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1",anchorText="lakefront stays in Tuk Tuk on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"bt-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Who is this Bukit Lawang and Lake Toba trip for?
This seven-day North Sumatra trip is for couples, friends and solo travellers who want to see orangutans in the wild and then slow down by a lake, without committing to a full two-week Sumatra loop. It pairs three nights in the rainforest at Bukit Lawang with three nights on Samosir Island in Lake Toba, both reached from Medan.
It is not for you if long road days wear you down. There is no flight between the jungle and the lake, so one day of this week is a seven to eight hour drive on slow roads. If you only have five days, pick one of the two, and if you are travelling with young children, our family route through North Sumatra paces the same ground more gently.
## Trip at a glance
**Route:** Kualanamu airport (Medan), Bukit Lawang (3 nights), road south to Parapat, ferry to Tuk Tuk on Samosir Island (3 nights), ferry and road back to Kualanamu or Silangit.
**Pace:** two jungle days, one long transfer day, two slow lake days, and a road day home.
**Getting there:** fly into Kualanamu International Airport near Medan (KNO), usually via Jakarta, Kuala Lumpur or Singapore. Confirm current flight routes before locking hotels.
**Best season:** the drier months, roughly June to September, make the jungle trails less muddy, but Bukit Lawang works all year if you accept rain.
**Best for:** wildlife first, then rest. One wildlife highlight, one cultural lake stay, one honest road day between them.
## Why put Bukit Lawang and Lake Toba in one week?
Because both hang off Medan and nothing else in North Sumatra gives you as much for the time. Bukit Lawang, on the edge of Gunung Leuser National Park, is the easiest place in Sumatra to see orangutans on a guided trek; Lake Toba is a huge volcanic crater lake with Batak villages on Samosir Island. Together they cover jungle and culture in seven days.
The order matters. The jungle goes first, while your legs are fresh and before the humidity has worn you down, and the lake goes last because it is the easiest place in the region to do nothing. Ending on Samosir also gives you a choice of two airports for the flight home.
## How do you get from Bukit Lawang to Lake Toba?
By road, in one long day. The usual way is a shared tourist minibus booked through your Bukit Lawang guesthouse, which travellers report takes around seven to eight hours to Parapat, with some tickets including the ferry to Samosir. A private car is faster door to door and lets you stop, but it costs more and is priced per vehicle.
There is no direct public bus worth recommending, and going back through Medan by public transport adds changes and hours. Leave in the morning so you reach Parapat before the passenger ferries thin out in the evening. If you arrive late, the vehicle ferry from Ajibata to Tomok and a short taxi to Tuk Tuk is the fallback. For the airport legs, see our [[Medan to Bukit Lawang|/transport/medan-to-bukit-lawang]] and [[Medan to Lake Toba|/transport/medan-to-lake-toba]] transport guides.
^^ Bukit Lawang to Lake Toba: the realistic options. Times and fares are working estimates from traveller and guesthouse reports, so get a current quote before you pay.
| Option | Time to Parapat | Cost | Good for | Weak point |
|---|---|---|---|---|
| Shared tourist minibus | Around 7 to 8 hours | Roughly IDR 150,000 to 250,000 per person, sometimes with the ferry included | Solo travellers and couples on a budget | Fixed morning departure, little room for luggage |
| Private car with driver | A little faster, door to door | Priced per car, ask your guesthouse for a quote | Groups of three or four, or anyone who wants stops | The most expensive way to do it |
| Public buses via Medan | Most of a day, often longer | Cheapest on paper | Nobody, unless nothing else is running | Two or more changes and Medan traffic |
## Day 1: Land in Medan and drive to Bukit Lawang
**Morning.** Land at Kualanamu and go straight to the road. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly, because guesthouses and drivers here work by WhatsApp.
**Afternoon.** Drive to Bukit Lawang, around three to five hours by private car depending on traffic, as a working estimate around 40 to 55 US dollars per car. The last stretch narrows to a village road and the final walk to most guesthouses is on foot along the Bahorok River.
**Evening.** Settle in, eat at your guesthouse, and confirm your trek and guide for tomorrow.
**Base:** Bukit Lawang, three nights. Compare [[stays in Bukit Lawang on Booking.com|BOOKING_BUKIT_LAWANG]]; riverside guesthouses fill first in July and August.
**Travel note:** if your flight lands after early afternoon, sleep near the airport and drive in the next morning. Arriving in the dark on that road is no fun, and you lose nothing by starting fresh.
## Day 2: Into Gunung Leuser National Park
**Morning.** Start the trek early, when the forest is cooler and the animals more active. Every trek inside the park has to be led by a licensed guide. Most guides know where the semi-wild orangutans, descendants of the old rehabilitation programme here, have been feeding, and wild ones are seen too, along with Thomas leaf monkeys and macaques.
**Afternoon.** On a day trek you are back by mid-afternoon. On the overnight version you walk on to a riverside camp, swim, and eat dinner cooked by the guides.
**Evening.** Either back at your guesthouse or in a simple tarpaulin camp by the river, with the jungle noise as the soundtrack.
**Booking logic:** the standard way is to book a licensed guide through your guesthouse. As a working estimate, a day trek costs around 30 to 60 US dollars per person including the park permit, and multi-day treks run higher, in the region of 100 euros a day with meals and permit. If you prefer to fix it before you fly, a [[full-day small-group jungle trek in Bukit Lawang|VIATOR_BUKIT_LAWANG_DAY_TREK]] or a [[two-day, one-night Bukit Lawang trek with river tubing|VIATOR_BUKIT_LAWANG_2D1N]] can be booked online.
**Travel note:** keep your distance and never feed the orangutans. A guide who offers to lure them with food is the wrong guide; walk away.
## Day 3: River tubing back to the village, or a slow jungle day
**Morning.** If you camped, break camp after breakfast. The classic way back is river tubing down the Bahorok on lashed inner tubes, which is the most fun hour of the whole trip.
**Afternoon.** Rest. If you did a day trek, walk to the bat cave, Gua Kelelawar, a short walk from the village, with a local guide and a torch, or simply sit by the river.
**Evening.** Pack for an early start tomorrow and book the tourist minibus to Parapat through your guesthouse, if you have not already.
**Base:** Bukit Lawang.
**Travel note:** river levels rise fast after heavy rain, and guides cancel tubing when the water is high. Accept the call; this river flooded the village badly in 2003.
## Which trek should you choose, one day or overnight?
Choose the overnight trek if you are reasonably fit and can sleep rough for one night: you see more of the forest, you have a better chance of a wild orangutan, and you return by river tube. Choose a day trek if you are short on energy, the weather is very wet, or you are travelling with someone who does not want to camp.
^^ Bukit Lawang trek lengths compared. Prices are working estimates; confirm what your guide includes.
| | Half day or day trek | Two days, one night | Three days or more |
|---|---|---|---|
| Time walking | About 3 to 7 hours | Two days, with a camp by the river | Several days deeper in the park |
| Orangutan chances | Good, mostly semi-wild animals | Better, including wild ones | Best, and fewer other trekkers |
| Fitness needed | Moderate, steep and muddy in places | Good, plus a night in a basic camp | High |
| Fits this 7-day route? | Yes | Yes, it uses Days 2 and 3 | No, it eats the lake days |
## Day 4: The long road to Lake Toba
**Morning.** Leave Bukit Lawang after breakfast in the tourist minibus or a private car. This is the trip's hard day, so treat the drive as the main event.
**Afternoon.** Reach Parapat, the port town on the lake shore, and take the passenger ferry to Tuk Tuk on Samosir, roughly 30 to 45 minutes, as a working estimate IDR 15,000 to 25,000 per person. Ferries run about hourly through the day and thin out in the evening.
**Evening.** Check in by the water and eat early. You will sleep well.
**Base:** Tuk Tuk, Samosir Island, three nights. Compare [[lakefront stays in Tuk Tuk on Booking.com|BOOKING_TUK_TUK]].
**Booking logic:** stay in Tuk Tuk, not Parapat. Parapat is only the port, and sleeping there means crossing the lake twice a day for nothing.
**Travel note:** confirm the minibus departure time the evening before. If you fall behind, call your Tuk Tuk guesthouse; they know whether the last ferry or the Ajibata vehicle ferry is still realistic.
## Day 5: Batak villages around Samosir
**Morning.** Hire a scooter in Tuk Tuk, as a working estimate IDR 100,000 to 150,000 a day, or a car with driver if you are three or more. Ride north to Simanindo, about an hour away, where the Huta Bolon museum sits in a traditional Batak house compound and dance performances generally run in the morning.
**Afternoon.** Stop at Ambarita on the way back for the old stone chairs where village elders once met, then ride south to Tomok and the tomb of King Sidabutar.
**Evening.** Back in Tuk Tuk, look for live Batak music at the lakeside cafes and try arsik, the local spiced fish.
**Travel note:** the island roads are slow and patchy in places. Ride carefully, wear a helmet, and be back before dark.
## Day 6: A slow day on the lake
**Morning.** Swim straight off your guesthouse jetty, or rent a kayak by the hour along the peninsula. The lake is deep, calm and pleasant to swim in.
**Afternoon.** Either do nothing at all, which is the point of this half of the trip, or cross the island to the hot springs near Pangururan, roughly an hour to an hour and a half each way.
**Evening.** Pack, settle your bill in cash, and check the morning ferry times with your guesthouse.
**Travel note:** ATMs exist in Tuk Tuk and Pangururan but are not reliable. Bring enough rupiah from Medan for the lake days.
## Day 7: Ferry, road and flight home
**Morning.** Take one of the first ferries back to Parapat, from around half past eight, and be on the road by mid-morning.
**Afternoon.** Drive to Kualanamu, roughly three and a half to four and a half hours in good conditions, or to Silangit Airport near Balige, around two hours from Parapat, which has direct flights to Jakarta. Book an afternoon or evening flight only.
**Travel note:** a morning flight home from Kualanamu on this day does not work. If yours is early, add a night near the airport. Running the route in reverse? Start with [[Kualanamu to Parapat transfers on 12Go|12GO_MEDAN_PARAPAT]] and leave the jungle for the end.
## What to book early, and what to keep flexible
Book early: your flights, the Day 1 airport transfer, and your rooms in Bukit Lawang and Tuk Tuk for July, August and Indonesian holidays. If you want a specific trek format, reserve the guide a few days ahead through your guesthouse.
Keep flexible: scooters, boats, the bat cave, the Samosir sightseeing and your second lake day. These are arranged on the day, usually in cash and within an hour of asking. Book the Day 4 minibus as soon as you arrive in Bukit Lawang.
## Mistakes travellers make on a Bukit Lawang and Lake Toba trip
The biggest is underestimating Day 4. Seven to eight hours on North Sumatra roads is a full day, not a morning, and trying to add sightseeing on the way is how people miss the ferry. The second is choosing a guide on price alone; unlicensed guides and anyone who feeds orangutans are the ones to avoid.
The third is basing yourself in Parapat instead of on Samosir. The fourth is booking a morning flight on the last day. The fifth is arriving without cash, since card acceptance is limited in both Bukit Lawang and on Samosir.
## What to cut, adapt or upgrade
Cut the second lake day if you are short of time, and fly out of Silangit on Day 6. Adapt the route by adding a night in Berastagi between the jungle and the lake to split the long drive and climb Mount Sibayak at sunrise; our [[15-day Sumatra itinerary|/trips/15-days-sumatra]] does exactly that at a slower pace.
Upgrade with a three-day trek if you are fit and lose one lake day to it, or add Tangkahan for elephant-river days as our [[9-day North Sumatra family route|/trips/9-days-north-sumatra-with-kids]] does. If Lake Toba is the part that excites you most, our [[5 days at Lake Toba and Samosir|/trips/5-days-lake-toba-samosir]] goes deeper on the island.
## Before you build this trip
Check entry rules for your passport on our [[Indonesia visa guide|/visa-guide]]; most visitors use the visa on arrival or e-VOA, around IDR 500,000 as a working estimate. Bring trekking shoes with grip, leech socks for the wet months, a light rain jacket and a dry bag for the river tubing.
Get travel insurance that covers trekking. Prices, ferry timetables and guide fees here change often and many are set locally, so treat every figure on this page as a working estimate and confirm current prices with your guesthouse before you pay.
## Final verdict: is a week of Bukit Lawang and Lake Toba worth it?
Yes. For one week in North Sumatra, this is the best split: two days in the rainforest with a good chance of orangutans, then three nights on the lake to recover. The price is one hard road day in the middle, and it is worth paying.
Skip it if you hate long drives or want beaches. Then choose one half and give it the whole week, or go to Pulau Weh for the sea instead.
## Related itineraries
[[15 days in Sumatra|/trips/15-days-sumatra]] adds Berastagi and more time in the jungle.
[[5 days at Lake Toba and Samosir|/trips/5-days-lake-toba-samosir]] if the lake is your priority.
[[The Sumatra hub|/destinations/sumatra]] for every route on the island.
'''
FAQ=[
("How do you get from Bukit Lawang to Lake Toba?","By road in one long day. Most travellers book a shared tourist minibus through their Bukit Lawang guesthouse, which takes around seven to eight hours to Parapat, then take the 30 to 45 minute ferry to Tuk Tuk on Samosir. A private car is faster and costs more, priced per vehicle."),
("How many days do you need for Bukit Lawang and Lake Toba?","Seven days is the comfortable minimum: three nights in Bukit Lawang for an overnight trek, one full day for the drive to the lake, and three nights on Samosir. With five days, choose one of the two places instead of rushing both."),
("Can you still see orangutans in Bukit Lawang?","Yes. Guided treks into Gunung Leuser National Park from Bukit Lawang regularly find semi-wild orangutans, descendants of the former rehabilitation programme, and wild ones are seen too. Sightings are likely but never guaranteed, and responsible guides never feed them."),
("How much does a jungle trek in Bukit Lawang cost?","As a working estimate, a day trek arranged through a guesthouse costs around 30 to 60 US dollars per person including the park permit. Multi-day treks with camping and meals cost more, in the region of 100 euros a day. Online listings for a full-day small-group trek start from about 69 US dollars."),
("Is the drive from Bukit Lawang to Lake Toba worth it?","Yes, if you have a week. The road day is long and tiring, but it links the best wildlife experience in North Sumatra with its most relaxing place to stay. Leave early, accept that the day is for travel, and you reach Samosir in time for dinner."),
("Should you stay in Parapat or on Samosir Island?","Stay on Samosir, ideally in Tuk Tuk. Parapat is the ferry port on the mainland and has little reason to stay. Tuk Tuk has the guesthouses, the swimming jetties, scooter rental and easy access to the Batak villages along the east coast."),
("Which airport should you fly out of after Lake Toba?","Kualanamu near Medan has the most connections and is about three and a half to four and a half hours from Parapat. Silangit near Balige is around two hours from Parapat and has direct flights to Jakarta. Confirm current routes and compare fares before deciding."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"bt-{p}{cnt[0]}"
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
title="7 Days in Bukit Lawang and Lake Toba: Orangutans, Then the Lake"
intro="North Sumatra's two best experiences sit a long day's drive apart, and most short trips pick one and skip the other. You do not have to. Spend three nights in Bukit Lawang trekking into Gunung Leuser National Park for orangutans, then cross to Samosir Island on Lake Toba for three slow nights among Batak villages. The cost is one hard road day in the middle, which this route plans around honestly instead of pretending it away."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Bukit Lawang to Lake Toba: 7-Day Orangutan and Lake Route",
 metaDescription="A 7-day North Sumatra itinerary: orangutan treks in Bukit Lawang, the road to Lake Toba, and three nights on Samosir, with transfers and costs.",
 focusKeyword="Bukit Lawang and Lake Toba itinerary",intro=intro,
 route="Kualanamu (Medan), Bukit Lawang, Parapat, Tuk Tuk (Samosir Island), Parapat, Kualanamu or Silangit",
 routeSummary="Medan → Bukit Lawang → Parapat → Samosir → Medan",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="June to September",logisticsComplexity="moderate",
 destinationPrimary="sumatra",travelStylePrimary="wildlife_nature",travelStyleSecondary=["culture_temples","adventure_volcanoes"],
 travellerTypes=["couples","friends","solo_travellers"],tripLengthBucket="one_week",tripLengthDays=7,vibe="balanced",
 experienceTags=["wildlife","jungle_trekking","river_tubing","lake","village_culture","long_road_transfers"],
 primaryAffiliatePartner="viator",secondaryAffiliatePartners=["booking","12go","airalo"],
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
print("meta",len(doc["metaTitle"]),len(doc["metaDescription"]),"refs",sorted(refs),"unused",set(have)-refs,"words",words,"faq",len(FAQ),"blocks",len(body))
print("FAILS",fails)
json.dump(doc,open("content/articles/"+SLUG+".json","w"),indent=2,ensure_ascii=False)
