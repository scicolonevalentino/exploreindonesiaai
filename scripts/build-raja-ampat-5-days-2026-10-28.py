# PARTE 2, 2026-10-28 generator run: first short Raja Ampat itinerary.
# Matrix: raja_ampat x short_escape = 0 (every Raja Ampat page is 7 to 14 days)
# and raja_ampat x balanced vibe = 0. GSC 2026-09-28..10-25: "raja ampat route"
# 6 impr at pos 48.5 on the hub, no page answering how to fit the islands into
# a short trip. Also the first page on the site with the January 2026 regency
# fee rise (IDR 1,000,000 visitor ticket on top of the IDR 700,000 park tag).
# Builds the Sanity document, validates it, writes the snapshot to content/articles/.
#   python3 scripts/build-raja-ampat-5-days-2026-10-28.py
# Validator note: "bird(s) of paradise" is a species name, not the banned
# cliche "paradise", so it is stripped before the banned-phrase check.
import json,re,datetime
SLUG="5-days-raja-ampat-short-trip"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_JAKARTA_SORONG",affiliateUrl="https://12go.asia/en/travel/jakarta/sorong?z=16022946",publicUrl="https://12go.asia/en/travel/jakarta/sorong",anchorText="Jakarta to Sorong flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_MAKASSAR_SORONG",affiliateUrl="https://12go.asia/en/travel/makassar/sorong?z=16022946",publicUrl="https://12go.asia/en/travel/makassar/sorong",anchorText="Makassar to Sorong flights on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_SORONG",affiliateUrl=BK%"Sorong",publicUrl=BK%"Sorong",anchorText="hotels in Sorong on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"ra5-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Is 5 days enough for Raja Ampat?
Five days is enough for the Dampier Strait, the central cluster of reefs around Kri, Gam, Mansuar and Arborek, plus one long boat day to the Piaynemo viewpoint. It is not enough for Wayag or Misool. The trip works only if you fly overnight, catch the afternoon ferry on arrival day and stay in one homestay.
Raja Ampat is usually sold as a week or more, and most travel writing treats anything shorter as a waste of the flights. That is half true. The journey from Bali or Jakarta is long and expensive, and a short trip spends a bigger share of its time in transit. But the reefs that made Raja Ampat famous sit within twenty minutes of each other, and a tight five days built around one base sees most of what a first-timer comes for. This plan shows how, and where it breaks.
## Who this trip is for, and who it is not
This five-day plan is for couples, friends and solo travellers who have a short window, usually a few days added to a trip in Bali or Java, and who would rather see Raja Ampat briefly than not at all. You should be a confident swimmer, happy with a simple homestay, and relaxed about boats and weather setting the schedule.
It is not for divers who want the remote sites, for travellers who cannot absorb a missed ferry or a cancelled boat day, or for anyone who needs air-con and wifi every night. If you have seven days, take them: our [[7-day Raja Ampat snorkelling itinerary|/trips/7-days-raja-ampat-snorkeling-islands]] adds a rest day and a weather buffer that this plan does not have.
## Trip at a glance
**Duration:** 5 days, 4 nights in the islands, usually plus a night in Sorong at the end.
**Route:** Sorong, ferry to Waisai, one homestay base in the Dampier Strait (Kri, Gam or Mansuar), a Piaynemo day trip, ferry back to Sorong.
**Pace:** balanced. Two full reef days, one long boat day, one dawn birding morning, and two half days of travel.
**Best for:** couples, friends, solo snorkellers, people adding Raja Ampat to a Bali or Java trip.
**Best time:** October to April, when the Dampier Strait is usually calmer and mantas gather at Manta Sandy.
**Budget:** high for the flights and fees, low to moderate on the ground. Plan on the cost table below.
**Logistics:** hard. One ferry a day on most days, cash only in the islands, and no margin for a late flight.
## How many days do you need in Raja Ampat?
Most first-timers need five to seven days on the islands. Five days covers the Dampier Strait reefs and Piaynemo with no spare day; seven adds a weather buffer and a slow day; ten or more is for Wayag, Misool or serious diving. Fewer than five days means you spend nearly half the trip on ferries and flights.
^^ What each trip length in Raja Ampat realistically covers
| Trip length | What you can see | What you give up | Who it suits |
| 3 to 4 days | House reef, Cape Kri, Arborek | Piaynemo, any weather buffer | Only travellers already in Sorong |
| 5 days (this plan) | Dampier Strait reefs, Arborek, Manta Sandy, Piaynemo, birds of paradise | Rest days, Wayag, Misool | Short windows, first-timers |
| 7 days | All of the above plus a slow day and a spare boat day | Wayag, Misool | Most snorkellers |
| 10 to 14 days | Wayag or Misool, more dive sites, a second base | Nothing, except budget | Divers, honeymooners |
## Why this route makes sense
On a short trip, every move between islands costs half a day and a boat charter, so the whole plan rests on one base in the Dampier Strait. From a homestay on Kri, Gam or Mansuar, the famous sites are five to twenty minutes away, and the only long run is Piaynemo. You unpack once, and the boat time goes to reefs instead of transfers.
The second rule is the overnight flight. Most routes to Sorong come through Jakarta or Makassar, and several flights leave late at night and land in the early morning. Landing by late morning lets you take the afternoon ferry to Waisai on day one. Landing in the evening costs you a full day, and on a five-day trip that is a fifth of it.
## How much does a short Raja Ampat trip cost in 2026?
As a working estimate, budget around IDR 1.7 million per foreign visitor in fees, IDR 137,000 to 262,000 each way on the ferry, roughly $30 to $55 per person per night for a homestay with meals, and $100 to $200 a day for boat charters, shared by the group. Flights to Sorong usually cost more than everything else combined.
^^ Working cost estimates for 5 days in Raja Ampat, per person unless stated
| Cost | Working estimate | Notes |
| Marine park tag | IDR 700,000 | Valid for 12 months, sold online or in Waisai |
| Regency visitor ticket | IDR 1,000,000 | Raised from IDR 300,000 in January 2026; under-12s exempt |
| Sorong to Waisai ferry | IDR 137,000 economy, IDR 262,000 VIP | Each way, bought at the harbour |
| Homestay with meals | About $30 to $55 a night | Four nights in one base |
| Boat charters | About $100 to $200 a day | Per boat, so share it |
| Flights to Sorong | Often over $150 one way | From Jakarta or Makassar |
The fee rise is the number most older guides miss. A January 2026 report in the travel trade press said the regency raised its visitor ticket for international visitors from IDR 300,000 to IDR 1,000,000, on top of the IDR 700,000 provincial and national park charge, which brings the total to about IDR 1.7 million. Fees can change again, so check the latest official guidance before you go, and carry the amount in cash.
## Day 1: Overnight flight, morning in Sorong, afternoon ferry
**Morning.** Land in Sorong (SOQ) on an overnight or early flight. As a working estimate the fastest direct flights take about four hours from Jakarta and about two and a quarter hours from Makassar; compare [[Jakarta to Sorong flights on 12Go|TWELVEGO_JAKARTA_SORONG]] or [[Makassar to Sorong flights on 12Go|TWELVEGO_MAKASSAR_SORONG]], and confirm current schedules before you lock anything else. Draw all the cash you need for the islands at a Sorong ATM. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly, but expect patchy signal once you leave Waisai.
**Afternoon.** Take the 14:00 Express Bahari ferry from Sorong harbour to Waisai, about two hours in calm water. A Sorong tour operator's 2026 timetable lists a daily 14:00 crossing in both directions, plus a 09:00 sailing on Wednesdays, Fridays and Sundays in the busier months. Tickets are sold at the harbour, IDR 137,000 economy or IDR 262,000 VIP as a working estimate. In Waisai, buy the marine park tag and the visitor ticket if you have not bought the tag online.
**Evening.** Your homestay boat takes you from Waisai to the island, roughly 30 to 60 minutes depending on where you are staying. Swim off the jetty if there is light left.
**Base:** one homestay in the Dampier Strait for 4 nights.
**Booking logic:** book the homestay months ahead for October to April, directly or through the homestay association's own listings, and agree the Waisai pickup in writing, naming the ferry you will be on.
**Travel note:** Raja Ampat runs on eastern Indonesian time, one hour ahead of Bali. Check your flight's landing time in local time before you assume you can make the ferry.
## Day 2: House reef, Cape Kri and Sardine Reef
**Morning.** Snorkel straight off the jetty first. House reefs in the Dampier Strait regularly show turtles, blacktip reef sharks and dense schools of fish a few kicks from the steps. Then take the homestay boat to Cape Kri, a site divers know for one of the highest fish counts ever logged on a single dive.
**Afternoon.** Sardine Reef, about ten minutes from Kri, has a shallow reef top that works for snorkellers. If the current is running, your boatman will drop you up-current and collect you down-current, so do not try to swim back.
**Evening.** Agree the next two days with your host tonight: the departure time for Piaynemo, the fuel cost, lunch, and whether other guests want to share the boat.
**Booking logic:** every boat trip is arranged through your homestay. Sharing a charter with other guests is the biggest saving on a short trip.
**Travel note:** currents here are strong and change with the tide. Wear fins, stay with the boat, and use a float vest if you are not a strong open-water swimmer.
## Day 3: Piaynemo viewpoint and the Fam Islands
**Morning.** Leave at first light for the longest boat run of the trip, roughly 90 minutes west to the Fam Islands. A wooden staircase climbs to the Piaynemo viewpoint over the karst islands and lagoons, the view on most Raja Ampat posters. Go early, before the day boats and the heat.
**Afternoon.** Snorkel Melissa's Garden, a shallow coral garden in the Fam group, on the way back. Expect small community fees at some landing points, paid in cash.
**Evening.** Back at the homestay by late afternoon. Eat early; tomorrow starts before dawn.
**Booking logic:** this is the most expensive boat day because of the fuel, so fill the boat if you can and agree the total before you leave.
**Travel note:** this is the most weather-exposed run. If the sea is rough, swap it with Day 4 or drop it; on a five-day trip there is no spare day to wait it out.
## Day 4: Birds of paradise at dawn, Arborek and Manta Sandy
**Morning.** A short pre-dawn walk on Gam to a forest hide where male red birds of paradise display in the treetops, usually between about 6:00 and 7:30. Your homestay arranges the local guide. Back for breakfast.
**Afternoon.** Boat to Arborek, a small village island whose jetty is one of the easiest snorkels in Raja Ampat, then to Manta Sandy nearby, a cleaning station where reef mantas come in, most reliably from about October to April. Hold position behind the marked line and let the mantas approach.
**Evening.** Last island sunset. Pack tonight, because the return boat may leave early.
**Booking logic:** buy something in Arborek, a meal or a woven hat, since the village earns directly from visitors.
**Travel note:** Manta Sandy is busy and can have strong current. Follow the boat crew's timing.
## Day 5: Back to Sorong
**Morning.** On Wednesdays, Fridays and Sundays in the busier months, the 09:00 ferry from Waisai gets you to Sorong by late morning. On other days the only crossing is at 14:00, so you have the morning for one last swim.
**Afternoon.** Ferry back to Sorong. After a 14:00 crossing you land around 16:00 local time.
**Evening.** The safe choice is a night in Sorong and a morning flight out. Compare [[hotels in Sorong on Booking.com|BOOKING_SORONG]] near the harbour or the airport.
**Booking logic:** never book a same-day onward flight against the 14:00 ferry. If the boat is late or cancelled, you lose the flight and often the next connection too.
**Travel note:** Waisai has a small airport, but scheduled flights there have been irregular. Plan on the ferry.
## What to book early, and what to keep flexible
Book early: the flights into and out of Sorong, the homestay, and your Sorong hotel for the last night. These decide whether the trip works at all, and October to April fills up. The marine park tag can be bought online before you travel, which saves a queue in Waisai.
Keep flexible: the order of Days 2 to 4. Piaynemo depends on the sea, the birds depend on the weather, and mantas come and go. Let your host move the days around once you are there.
## Mistakes travellers make on a short Raja Ampat trip
The most common is arriving on an afternoon or evening flight and expecting to reach the islands the same day. The second is carrying too little cash: there are no ATMs in the islands, and fees, boats and homestays are all paid in cash. The third is moving between two homestays to see more; on five days that costs a whole reef day.
The fourth is budgeting from an older guide. Many still quote about IDR 1 million for the fees, which was the total before the January 2026 increase. The fifth is booking the flight home on the same afternoon as the return ferry.
## What to cut, adapt or upgrade
**Cut:** Piaynemo if the sea is up. The Dampier Strait reefs alone justify the trip, and a calm day on Cape Kri and Arborek beats a rough three-hour round trip.
**Adapt:** for weaker swimmers, base on Kri or Gam and stick to the sheltered jetty snorkels at Arborek, Sawandarek and Yenbuba.
**Upgrade:** an eco-resort with an on-site dive centre if you want air-con and diving included; it costs several times a homestay. If you can stretch to eight days, our [[8-day Kri Island homestay itinerary|/trips/8-days-raja-ampat-homestays-kri-island]] works through boat sharing and budgets in detail.
## Before you build this trip
**Getting there:** most schedules have no direct flight from Bali to Sorong. You fly to Sorong, usually through Jakarta or Makassar, then take the ferry. Confirm current flight routes before locking hotels.
**Visa:** most nationalities enter Indonesia on the e-VoA. See our [[Indonesia visa guide|/visa-guide]] for the current rules.
**Money:** cash only once you leave Sorong. Bring the fees, the ferry, the homestay and the boats in rupiah, plus a buffer.
**Health:** the islands have no hospital, and the ferry does not run at night. Travel insurance that covers evacuation is not optional here.
**Packing:** reef-safe sunscreen, a rash vest, your own mask, a dry bag and a headlamp. Homestays supply bedding and meals, not much else.
## Final verdict
Five days in Raja Ampat is worth it if you accept what it is: the central reefs, one big viewpoint and a dawn with the birds of paradise, done from one base with no slack. If a missed ferry would ruin your trip, wait until you have seven days. If you have five and the flights line up, go.
## Related itineraries
For a slower version of the same base, see the [[7-day Raja Ampat snorkelling itinerary|/trips/7-days-raja-ampat-snorkeling-islands]]. Couples who want more comfort can follow the [[10-day Raja Ampat honeymoon|/trips/10-days-raja-ampat-honeymoon]], and divers heading for Misool and Wayag should look at [[14 days in Raja Ampat for divers|/trips/14-days-raja-ampat-divers]].
'''
FAQ=[
("Is 5 days enough for Raja Ampat?","Five days is enough for the Dampier Strait reefs, Arborek, Manta Sandy and one day out to Piaynemo, if you base in one homestay and catch the afternoon ferry on the day you land. It is not enough for Wayag or Misool, and there is no spare day for bad weather."),
("How much are the Raja Ampat fees in 2026?","As a working estimate, foreign visitors pay about IDR 1.7 million: the IDR 700,000 marine park tag, valid for 12 months, plus the regency visitor ticket, which a January 2026 trade press report said rose from IDR 300,000 to IDR 1,000,000. Children under 12 are exempt. Check current rules before you travel."),
("How do you get to Raja Ampat from Bali?","Fly to Sorong, usually with a connection in Makassar or Jakarta, then take the Express Bahari ferry to Waisai, about two hours. From Waisai your homestay boat takes you to the island. Most schedules have no direct Bali to Sorong flight."),
("What time does the Sorong to Waisai ferry leave?","A 2026 operator timetable lists a daily 14:00 departure in both directions, plus a 09:00 sailing on Wednesdays, Fridays and Sundays in the busier months. Times are in eastern Indonesian time, one hour ahead of Bali, and change at short notice, so confirm at the harbour."),
("Can you see manta rays in Raja Ampat as a snorkeller?","Yes. Manta Sandy, near Arborek in the Dampier Strait, is a shallow cleaning station where reef mantas are often visible from the surface, most reliably from about October to April. Snorkellers stay behind a marked line and wait for the mantas to come in."),
("Do you need cash in Raja Ampat?","Yes. There are no ATMs in the islands, and homestays, boat trips, the visitor ticket and local landing fees are generally paid in cash. Withdraw everything you need in Sorong, plus a buffer for a ferry delay or an extra boat day."),
("Is Raja Ampat worth it for a short trip?","It is worth it if you can fly overnight to Sorong and accept a fixed plan with no slack. If your schedule cannot absorb a cancelled ferry, wait for a seven-day window instead."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"ra5-{p}{cnt[0]}"
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
title="5 Days in Raja Ampat: A Short Trip That Still Works"
intro="Raja Ampat is usually planned as a week or more, but the reefs that made it famous sit within twenty minutes of each other in the Dampier Strait. This five-day plan uses one homestay base, an overnight flight to Sorong and the afternoon ferry on arrival day to fit in Cape Kri, Arborek, Manta Sandy, the Piaynemo viewpoint and a dawn with the birds of paradise. It includes the January 2026 fee rise, the ferry timetable and where a short trip breaks."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Raja Ampat in 5 Days: A Short Trip Itinerary for 2026",
 metaDescription="Is 5 days enough for Raja Ampat? A tight plan with one homestay base, Piaynemo, Arborek and Manta Sandy, the 2026 fees and the Sorong ferry times.",
 focusKeyword="5 days in Raja Ampat",intro=intro,
 route="Sorong, ferry to Waisai, one Dampier Strait homestay (4 nights), Piaynemo day trip, ferry back to Sorong",
 routeSummary="Sorong → Waisai → Kri or Gam → Piaynemo → Arborek → Waisai → Sorong",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="October to April",logisticsComplexity="complex",
 destinationPrimary="raja_ampat",travelStylePrimary="beach_islands",travelStyleSecondary=["diving_snorkeling","wildlife_nature"],
 travellerTypes=["couples","friends","solo_travellers"],tripLengthBucket="short_escape",tripLengthDays=5,vibe="balanced",
 experienceTags=["snorkeling","islands","karst","manta_rays","birds_of_paradise","homestay"],
 primaryAffiliatePartner="12go",secondaryAffiliatePartners=["booking","airalo"],
 body=body,affiliateLinks=AFF,faq=[dict(_key=K("f"),question=q,answer=a) for q,a in FAQ])
txt=json.dumps(doc,ensure_ascii=False)
chk=re.sub(r"birds?[ _]of[ _]paradise","",txt,flags=re.I)
bad=["—","–","hidden gem","must-see","must see","paradise","immerse yourself","unforgettable","something for everyone","vibrant culture","crystal-clear","crystal clear","breathtaking","rich history","local charm","authentic experience","off the beaten path","off-the-beaten-path","once-in-a-lifetime","bucket list","dream destination","(SEARCH"]
fails=[b for b in bad if b.lower() in chk.lower()]
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
