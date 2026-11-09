# PARTE 2, 2026-11-09 generator run: first Alor (East Nusa Tenggara) itinerary.
# Gap: zero mentions of Alor anywhere in the site's articles. GSC 2026-10-10..11-06
# has no clean no-page query (every itinerary query already maps to a page), the
# 7:30 report recommended no new page, so this is the matrix fallback.
# Facts and sources:
#  - 12Go browser-checked 2026-11-09: bali/kupang live (24 departures/day, fastest
#    1h50, Wings/Lion/Batik/Super Air Jet); jakarta/kupang live (38/day, fastest 3h).
#    kupang/alor and alor/kupang render "0 trips" on several dates and list only
#    ferries, so they are NOT linked. No flights to Alor on 12Go.
#  - Kupang-Alor flight: Wings Air sole carrier (roame.travel, flightconnections,
#    08:40 departure), about 1 hour (50 min to 1h15 across sources), fares IDR
#    800k-1.5M (unchartedlens 2025), 12Go lists from about IDR 1.06M Alor-Kupang.
#  - Kepa: taxi Mali airport to Alor Kecil IDR 250k, 5-min boat IDR 20k pp
#    (Ocean Earth Travels). Resort "from" rates, same source, modified 2026-10-01.
#  - Marine park fee IDR 250k/day (Bluewater listing for Alor Divers).
#  - Dugong rules: Alor fisheries office bans touching and swimming (Antara), RRI
#    2026 repeats keep your distance, WWF: first calf recorded Oct 2025, Selat
#    Pantar reserve. Older Antara boat rate Rp 150k for 4-5 people.
#  - Takpala: 15 min from airport, 25 from Kalabahi; free per detik; dance mostly
#    for larger groups (Lonely Planet).
#  - Season April-Nov/Oct, water 25C to 31-32C, 5mm suit (Ocean Earth, unchartedlens).
#   python3 scripts/build-alor-2026-11-09.py
import json,re,datetime
SLUG="8-days-alor-island-diving-takpala-dugongs"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_BALI_KUPANG",affiliateUrl="https://12go.asia/en/travel/bali/kupang?z=16022946",publicUrl="https://12go.asia/en/travel/bali/kupang",anchorText="Bali to Kupang flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_JAKARTA_KUPANG",affiliateUrl="https://12go.asia/en/travel/jakarta/kupang?z=16022946",publicUrl="https://12go.asia/en/travel/jakarta/kupang",anchorText="Jakarta to Kupang flights on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_KUPANG",affiliateUrl=BK%"Kupang",publicUrl=BK%"Kupang",anchorText="hotels in Kupang on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_KALABAHI",affiliateUrl=BK%"Kalabahi",publicUrl=BK%"Kalabahi",anchorText="Kalabahi stays on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"alo-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC="""
## Is Alor worth the journey?
Yes, if you are an experienced diver or a repeat visitor who wants Indonesia far from any tourist circuit. Alor pairs the strong, cold currents of the Pantar Strait with Abui villages and a protected dugong population. The price is two flights, one night in Kupang, thin services and very little room for error.
Alor sits at the far end of the Lesser Sundas, north of Timor, and most of the people who reach it come for the water. That shapes this trip. Four nights go to a simple island base with the strait on your doorstep, and two more go to Kalabahi for the side of Alor most divers skip: a hilltop Abui village, a museum of bronze drums and a calm bay with wild dugongs. If you do not dive, this plan still works, but it is a slower and less obvious week.
## Who this trip is for, and who it is not
This route is for certified divers with some current experience, for repeat Indonesia travellers who have done Bali and Komodo and want somewhere with fewer boats, and for couples who are happy with fans, cold showers and early nights.
It is not for a first trip to Indonesia, for beginners hoping to learn to dive, or for anyone with a tight onward flight. It also suits non-divers less well than [[the Kei Islands|/trips/7-days-kei-islands-maluku-beaches]], which offer easier beach time for a similar journey. If you want big-name reefs with more choice of boats, look at [[7 days diving Komodo|/trips/7-days-komodo-diving]] first.
## Trip at a glance
**Duration:** 8 days, 7 nights: 1 in Kupang, 4 on Kepa or at a dive resort, 2 in Kalabahi.
**Route:** Bali or Jakarta to Kupang, a short flight to Alor, Kepa island for the Pantar Strait, then Kalabahi for the Museum of 1000 Moko, the Mali dugongs and Takpala.
**Pace:** three full water days, then two easier land days.
**Best for:** divers, repeat travellers and couples.
**Best time:** April to about October or November. Sources differ on the end of the season.
**Budget:** moderate, unless you book a dive resort package. Flights and diving are the main costs.
**Logistics:** complex for the distance. The Kupang leg is the fragile one.
## Why this route makes sense
The plan is built around the Kupang to Alor flight, which is short, infrequent and leaves in the morning. You sleep in Kupang on the way in, so a late arrival costs you an evening rather than a dive day. On the way out, you leave from Kalabahi, a few minutes from the airport, instead of crossing back from Kepa at dawn.
The diving comes first and the land days come last for a practical reason: standard dive-agency guidance is to wait 18 to 24 hours before flying, and this order leaves you more than that without having to count. It also means the water days can slip by a day if the sea or the current turns against you.
## How do you get to Alor from Bali?
Fly from Bali to Kupang, then take a regional flight to Mali airport on Alor, about an hour. There is no direct flight from Bali. Wings Air was the only carrier listed on the Kupang leg when we checked in November 2026, and the flight has usually left in the morning, so plan a night in Kupang.
Kupang itself is easy: 12Go listed 24 departures a day from Bali, the fastest 1 hour 50 minutes, and 38 from Jakarta, the fastest about 3 hours. The Alor leg is not on 12Go, so book it with the airline or through your dive operator. Traveller guides quote about IDR 800,000 to 1,500,000 one way and advise booking two to three weeks ahead.
Ferries exist but are not a plan for a short trip. One 2026 guide says ASDP ferries and passenger ships leave Kupang about twice a week, and 12Go's timetable shows crossings of about 11 to 14 hours, though it had no bookable trips on the dates we tried. Confirm the schedule at the port.
^^ Getting to Alor: the realistic options, as working estimates
| Leg | How | Time | When we checked | Watch out for |
| Bali to Kupang | Flight | Fastest 1h50 | 24 departures a day on 12Go | Late flights miss the Alor connection |
| Jakarta to Kupang | Flight | Fastest about 3h | 38 departures a day on 12Go | Overnight timings are common |
| Kupang to Alor | Flight | About 1 hour | Wings Air, one or two a day | Delays and cancellations, so sleep in Kupang first |
| Kupang to Alor | Ferry | About 11 to 14 hours | About twice a week, no online stock on 12Go | Weather, changing schedules |
## Day 1: Fly to Kupang
**Morning.** Fly from Bali or Jakarta to Kupang. Compare [[Bali to Kupang flights on 12Go|TWELVEGO_BALI_KUPANG]] or [[Jakarta to Kupang flights on 12Go|TWELVEGO_JAKARTA_KUPANG]]. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you leave home, since traveller guides recommend Telkomsel coverage for this region and it is worth checking your plan uses it.
**Afternoon.** Check in and treat the rest of the day as a buffer. Kupang is a working provincial capital, not a stop you need to fill.
**Evening.** An early dinner and an early night. Confirm your morning flight before you go to bed.
**Base:** Kupang, 1 night. Compare [[hotels in Kupang on Booking.com|BOOKING_KUPANG]] and choose something with an easy run to El Tari airport.
**Booking logic:** book the Bali to Kupang and Kupang to Alor legs with a night between them. Do not trust a same-day connection, even on one ticket.
**Travel note:** withdraw cash here. There are ATMs at Kupang airport and in Kalabahi, but boats and homestays work in rupiah and machines can run out.
## Day 2: Fly to Alor and cross to Kepa
**Morning.** Take the flight to Mali, about an hour, on a small turboprop with a strict baggage allowance. Heavy dive bags can be left behind or charged extra, so ask the airline in advance.
**Afternoon.** Drive to Alor Kecil and cross to Kepa by local boat, five minutes away. Ocean Earth Travels gives about IDR 250,000 for the taxi from the airport and IDR 20,000 per person for the boat; treat both as working estimates. Your resort will usually arrange the pickup if you ask.
**Evening.** Sort your gear and go through the next day's sites with the dive team.
**Base:** Kepa, 4 nights, or a dive resort of your choice. See the table below.
**Booking logic:** book the base and the diving together, well before the flights. Small resorts here fill first in the middle of the dry season.
**Travel note:** bring a printed or offline copy of your certification and dive insurance details. Signal can drop away from Kalabahi.
## Which base should you choose in Alor?
Choose Kepa if you want a simple, sociable island five minutes from the strait, a dedicated dive resort if you want everything arranged, and Kalabahi if you are not diving at all. Most divers should sleep on the water, because the trip from town to the Pantar Strait sites eats into the day.
^^ Where to stay on Alor. Rates are "from" prices listed by Ocean Earth Travels in 2026, so confirm them directly.
| Base | Example | From, per night | Best for | Trade-off |
| Kepa island | La P'tite Kepa | About $35 | Divers on a budget, couples | Simple bungalows, a boat for every errand |
| Dive resort | Moko Alor, Nautika, Alor Divers, Alor Tanapi | About $100 to $190 | Divers who want it arranged | Most sell multi-night packages, fewer land days |
| Kalabahi | Mokkolipa Guesthouse, Simfony Hotel | Ask directly | Non-divers, land days | Town setting, longer boat rides to the strait |
## Day 3: First dives in the Pantar Strait
**Morning.** Start with a check dive and an easier site, whatever your logbook says. Alor has more than 50 known dive sites, according to Indonesia's tourism board, split between the Pantar Strait and Kalabahi Bay. The strait is known for strong, cold, nutrient-rich water; the bay's macro sites are gentler.
**Afternoon.** A second and possibly third dive. Non-divers can ask to join the boat and snorkel where the current allows, or stay around Kepa for the beach.
**Evening.** Log your dives and rinse your gear. Dinner is usually at your resort, since Kepa has little else.
**Booking logic:** ask about the marine park fee when you book. One dive-travel listing gives IDR 250,000 a day and excludes it from the package price.
**Travel note:** take a 5mm wetsuit. Ocean Earth Travels recommends it year round, and gives water temperatures of about 25C in the cooler months and 31 to 32C from May to September. The strait's currents can bring colder water than the surface suggests.
## Day 4: A full water day, on the current or off it
**Morning.** If the first day went well, this is the day for a stronger site such as Karl's Dream, which your guide will time around the tide. If it did not, ask for the sheltered side of the strait. There is no shame in that, and guides here would much rather you said so.
**Afternoon.** Dive again, or take a surface interval on a beach if your boat stops at one. Sebanjar, on the main island near Alor Kecil, is the usual recommendation for non-divers who want to snorkel from the shore.
**Evening.** A quiet night. Ask your resort whether power runs all day, and charge everything when you can.
**Travel note:** bring a surface marker buoy if you own one, and take the briefing seriously. Down-currents and fast drifts are the reason this strait is not a beginner site.
## Day 5: Macro, a shore dive or a rest day
**Morning.** Use your last water day for something different: a macro site in the bay, or the Twilight Zone shore dive near Beangabang on Pantar if your operator goes there. Mola mola are possible at some sites, with Ocean Earth Travels naming September as the best month, but do not plan around seeing one.
**Afternoon.** Make this your last dive of the trip, and finish in the early afternoon. Dive gear should be rinsed and dry by evening, since you move tomorrow.
**Evening.** Settle up. Most small operators prefer cash, though La P'tite Kepa's listing says it can bill in euros, dollars or rupiah.
**Booking logic:** agree on the number of dives on day one, and leave this day open. It is your spare if a boat day was lost earlier.
## Day 6: Across to Kalabahi and the moko drums
**Morning.** Boat back to Alor Kecil and drive to Kalabahi.
**Afternoon.** Visit the Museum of 1000 Moko in town, which holds the bronze drums Alor is known for and examples of local kawate cloth. We could not find a published entry fee or opening hours, so go on a weekday and bring small notes.
**Evening.** Dinner in Kalabahi, where you finally have some choice. Ask at your hotel about a driver and guide for tomorrow.
**Base:** Kalabahi, 2 nights. Compare [[Kalabahi stays on Booking.com|BOOKING_KALABAHI]], but note that some guesthouses are easier to book by message.
**Travel note:** a car with driver is the sensible choice for tomorrow. Traveller guides disagree on motorbikes, with one quoting about Rp 100,000 for 12 hours and another saying prices run two to three times Bali's; roads can be narrow and slippery either way.
## Day 7: The Mali dugongs and Takpala
**Morning.** Go to Mali beach, near the airport, and hire a boat with local fishermen to look for dugongs between Mali and Sika island. An older Antara report gives Rp 150,000 for a boat of four to five, so expect to pay more now and agree the price first. The Alor fisheries office bans touching or swimming with the animals, and RRI repeated the keep-your-distance message in 2026. If a boatman offers to get you closer or into the water, say no.
**Afternoon.** Drive to Takpala, an Abui hilltop village about 15 minutes from the airport and 25 from Kalabahi. Detik describes visits as free, but a contribution to the community is normal, and a local guide makes the visit far more useful. Lonely Planet notes that the lego-lego dance is mostly organised for larger groups because of the cost, so ask your guide if a group is expected.
**Evening.** A last dinner in Kalabahi. Check tomorrow's flight and pack.
**Booking logic:** arrange the guide through your hotel a day ahead. Ask before you photograph people or enter a house.
**Travel note:** WWF recorded the first dugong calf at Mali in October 2025. Boats and noise are a real pressure on a small population, so keep the visit short.
## Day 8: Fly out
**Morning.** Drive about 15 minutes to Mali airport and fly to Kupang.
**Afternoon.** Connect to Bali or Jakarta. Leave at least four hours between flights, or sleep another night in Kupang if your flight home is international.
**Booking logic:** put nothing non-refundable on this day. If the Alor flight is cancelled, you want a free day, not a lost ticket.
## How does Alor compare with other remote dive trips in Indonesia?
Alor is the most current-driven and least serviced of Indonesia's well-known remote dive trips, with fewer boats than Komodo and less choice than Raja Ampat. Wakatobi is similar in effort but gentler underwater. Pick Alor if you already have some current experience and care more about quiet sites than comfort.
^^ Four remote dive trips compared, as working judgements
| Trip | How you get there | Conditions | Beyond the diving | Best suited to |
| Alor | Two flights via Kupang | Strong, cold currents in the strait, macro in the bay | Abui villages, moko drums, dugongs | Experienced divers who want quiet |
| Komodo | One direct flight from Bali to Labuan Bajo | Currents and big fish, busy boats | Komodo dragons | Divers who want choice and easy access |
| Wakatobi | Via Makassar to Wangi-Wangi | Reef walls, generally gentler | Bajo stilt villages | Reef lovers, resort or independent |
| Raja Ampat | Flight to Sorong, then ferry | Rich reefs, some strong current | Karst islands, homestays | Divers with a larger budget and more time |
## What to book early, and what to keep flexible
Book early: the flights to Kupang, the Kupang to Alor legs, your night in Kupang and your dive base. Traveller guides suggest booking the Alor leg two to three weeks ahead, and earlier in the middle of the dry season.
Keep flexible: the order of the dive sites, which depends on the current and the moon, your day at Mali, and your onward plans from Kupang. Dive packages are easy to adjust if you ask early; the flight is not.
## What mistakes do travellers make in Alor?
The biggest mistake is treating the Kupang to Alor flight as reliable and booking a same-day connection. The others are arriving without enough cash, overpacking for a small plane, diving the strait without current experience, and flying too soon after the last dive. Each of them is easy to avoid with one spare day.
Other mistakes we see in planning: leaving Takpala out because it is not a dive site, which misses the most interesting afternoon on the island; hiring a motorbike without checking the road and the weather; and assuming a dugong is guaranteed. These are wild animals, and some days nobody sees one.
## What to cut, adapt or upgrade
**Cut:** with six days, drop Day 5 and combine Kalabahi and Takpala into one day. Below that, the flights take too much of the trip.
**Adapt:** non-divers should swap Kepa for two nights in Kalabahi and two at a beach, then spend the water days at Sebanjar, Mali and Maimol. If you want to climb, Backindo describes a six-hour hike up Mount Dola Koyakoya, at 1,821 metres, with a local guide.
**Upgrade:** a week-long resort package removes most of the logistics. A 2026 listing from Bluewater Dive Travel gives Alami Alor from about $2,835 per person for seven nights, and liveaboards also work the strait. Compare what each includes, marine park fees especially, before you decide.
## Before you build this trip
Indonesia's visa on arrival rules apply when you land at Bali or Jakarta, so you will clear immigration before the domestic legs; check the latest official guidance before you fly. Alor is largely Christian with Muslim communities, so dress modestly in villages and town, and ask before you photograph anyone.
Health and safety: medical care on Alor is basic, so take dive and travel insurance that covers evacuation, and ask your operator where the nearest recompression chamber is before your first dive. Ask a travel clinic about malaria advice for East Nusa Tenggara. Drink bottled or filtered water and carry cash in small notes.
## Final verdict: is Alor worth it?
Yes, for a certain traveller. If you can handle current, you have eight days and you want Indonesia without a crowd on the boat, Alor is one of the country's best dive trips. If you are new to diving, short on time or need things to run on schedule, choose an easier reef and come back later.
## Related itineraries
For another remote dive week with a resort option, see [[Wakatobi in 8 days|/trips/8-days-wakatobi-diving-southeast-sulawesi]]. For easier access and bigger crowds, try [[7 days diving Komodo|/trips/7-days-komodo-diving]]. For overland culture in the same part of the country, read [[8 days across Sumba|/trips/8-days-sumba-overland-east-to-west]], and for a remote beach week, [[the Kei Islands|/trips/7-days-kei-islands-maluku-beaches]].
"""
FAQ=[
("How do you get to Alor from Bali?","Fly from Bali to Kupang, then take a regional flight of about an hour to Mali airport on Alor. There is no direct flight from Bali. Sleep in Kupang the night before, because the Alor flight has usually left in the morning and delays are common."),
("How many days do you need in Alor?","Eight days is a sensible plan, with four nights on or near the Pantar Strait and two in Kalabahi. Flights take most of a day at each end, so anything under six days leaves little time in the water and almost none for the villages."),
("Is Alor good for beginner divers?","Not really for the Pantar Strait, which is known for strong, cold currents. Kalabahi Bay has gentler macro sites that less experienced divers can do with a guide, but dive-travel guides generally rate Alor as a trip for divers with some current experience."),
("What is the best time to visit Alor?","Most sources give April to about October or November, with some ending the season a month earlier. Water temperature moves between about 25C in the cooler months and 31 to 32C from May to September, so a 5mm wetsuit is the usual advice all year."),
("Can you swim with the dugongs in Alor?","No. The Alor fisheries office bans touching or swimming with them, and RRI repeated the keep-your-distance message in 2026. You can look for wild dugongs from a small boat at Mali beach with local fishermen. Sightings are common but never guaranteed."),
("Are there ATMs in Alor?","Yes, in Kalabahi, and at Kupang airport on the way in. Do not rely on them alone. Withdraw enough in Kupang for your first few days, since boats, homestays and warungs on Alor mostly work in cash."),
("Is Takpala village worth visiting?","Yes, particularly if you have spent the week underwater. Takpala is an Abui hilltop village about 15 minutes from Mali airport. Go with a local guide, leave a contribution for the community and ask before taking photographs. Dances are usually arranged for larger groups."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"alo-{p}{cnt[0]}"
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
title="8 Days in Alor: Pantar Strait Diving, Takpala Village and the Mali Dugongs"
intro="Alor sits at the far end of the Lesser Sundas, two flights from Bali, with the cold, fast water of the Pantar Strait on one side and Abui hill villages on the other. This eight-day plan routes through Kupang with a buffer night, gives the diving four nights on Kepa, then ends with the drums, dugongs and Takpala on land."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Alor Itinerary: 8 Days of Diving, Takpala and Dugongs",
 metaDescription="An 8-day Alor itinerary via Kupang: Pantar Strait diving from Kepa, the Mali dugongs and Takpala village, with flights, fees, seasons and honest limits.",
 focusKeyword="Alor itinerary",intro=intro,
 route="Bali or Jakarta to Kupang (1 night), flight to Alor, Kepa island (4 nights) for the Pantar Strait, Kalabahi (2 nights) for the Museum of 1000 Moko, Mali dugongs and Takpala, flight back to Kupang",
 routeSummary="Kupang → Mali airport → Kepa → Pantar Strait → Kalabahi → Takpala → Kupang",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="April to October",logisticsComplexity="complex",
 destinationPrimary="wild_indonesia",travelStylePrimary="diving_snorkeling",travelStyleSecondary=["remote_offbeat","wildlife_nature"],
 travellerTypes=["divers","repeat_travellers","couples"],tripLengthBucket="one_week",tripLengthDays=8,vibe="remote",
 experienceTags=["diving","snorkeling","dugongs","village_culture","nusa_tenggara"],
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
