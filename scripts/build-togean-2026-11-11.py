# PARTE 2, 2026-11-11 generator run: first dedicated Togean Islands itinerary.
# Gap: the Togeans only existed as four nights inside 14-days-sulawesi-toraja-togean-bunaken.
# GSC 2026-10-12..11-08: no clean no-page query, so matrix fallback, steered by where
# clicks already are: the 14-day Sulawesi page is the best-clicking trip article
# (13 clicks, 271 impr, pos 11.9) and "sulawesi itinerary" + "sulawesi route" total
# about 100 impressions. A standalone week deepens that cluster.
# Facts and sources:
#  - 12Go browser-checked 2026-11-11: makassar/luwuk live (2 departures/day, 10:05 and
#    13:05, fastest 1h20, Batik Air, from $85); jakarta/luwuk live (6/day, fastest 4h25,
#    Batik Air); makassar/gorontalo live (1/day, 1h25). luwuk/ampana and
#    pelabuhan-ampana/pelabuhan-wakai render "0 trips": NOT linked.
#  - togean.com transport guide ("last checked June 2026", run by the Reconnect resort
#    team, so resort prices are self-interested): Hercules speedboat Ampana 09:00 daily,
#    second speedboat about 12:00-13:00, about 1.5h to Wakai, Rp 130-170k; ASDP KMP Tuna
#    Tomini car ferry about 3 days/week, about 5h, about Rp 56,500; multi-stop public
#    boats 5-6h to Malenge, Rp 110-180k; Gorontalo-Wakai ferry Tue/Fri 15:00-16:00,
#    about 12h, economy Rp 63-73k; Wakai-Malenge charter Rp 800-900k per boat; Luwuk-
#    Ampana about 5h, private car about Rp 1,000,000; Wings Air Palu-Ampana suspended
#    May 2025; Dec-Jan strongest winds; no ATMs on the islands.
#  - theindonesiaguide.com (published 10 June 2026): shared car Luwuk-Ampana IDR
#    100-150k; fun dives USD 25-45 incl. gear; snorkel gear IDR 30-50k/day; guided
#    Bajau village visits IDR 50-100k; dry season April-October; malaria present in
#    Central Sulawesi; no recompression chamber nearby.
#  - Wikivoyage (undated sections): park ticket Rp 150,000 foreigners; three Kadidiri
#    resorts collect guests free from Wakai; Wakai-Gorontalo ferry Mon/Thu.
#  - Stingy Nomads (updated 13 July 2026): Mariona jellyfish numbers down sharply since
#    2024; B-24 wreck about 1h by boat from Kadidiri, visibility under 10 m; Una Una
#    30+ sites; 1,800 m walkway at Pulau Papan; coconut crabs.
#  - Resort names containing the banned word "paradise" are deliberately not named.
#  - NOTE: 14-days-sulawesi-toraja-togean-bunaken says the Ampana speedboat takes "four
#    to five hours". 2026 sources give about 1.5h for the speedboat and about 5h for the
#    car ferry. Sibling not edited in this run; flagged in the report.
#   python3 scripts/build-togean-2026-11-11.py
import json,re,datetime
SLUG="8-days-togean-islands-kadidiri-malenge"
PFX="tog"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_MAKASSAR_LUWUK",affiliateUrl="https://12go.asia/en/travel/makassar/luwuk?z=16022946",publicUrl="https://12go.asia/en/travel/makassar/luwuk",anchorText="Makassar to Luwuk flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_JAKARTA_LUWUK",affiliateUrl="https://12go.asia/en/travel/jakarta/luwuk?z=16022946",publicUrl="https://12go.asia/en/travel/jakarta/luwuk",anchorText="Jakarta to Luwuk flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_MAKASSAR_GORONTALO",affiliateUrl="https://12go.asia/en/travel/makassar/gorontalo?z=16022946",publicUrl="https://12go.asia/en/travel/makassar/gorontalo",anchorText="Makassar to Gorontalo flights on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_AMPANA",affiliateUrl=BK%"Ampana",publicUrl=BK%"Ampana",anchorText="Ampana stays on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_TOGEAN_ISLANDS",affiliateUrl=BK%"Togean+Islands",publicUrl=BK%"Togean+Islands",anchorText="Togean Islands stays on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_LUWUK",affiliateUrl=BK%"Luwuk",publicUrl=BK%"Luwuk",anchorText="hotels in Luwuk on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"{PFX}-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC="""
## Are the Togean Islands worth the journey?
Yes, if you have at least a week and you like the idea of being hard to reach. The Togean Islands give you calm water, reef a short swim from your bungalow and almost no phone signal, in exchange for a flight, a five-hour drive and a boat. With less than a week, the journey outweighs the stay.
The Togeans sit in the middle of Tomini Bay, in the crook of Sulawesi's northern arm, and there is no quick way in. That is the tension of this trip: the islands are gentle and slow once you arrive, and getting there asks for patience, cash and a schedule that can bend. This plan treats the archipelago as the whole holiday, not a stop on a longer crossing of Sulawesi. It uses the Luwuk flight and the Ampana speedboat on the way in, splits the stay between Kadidiri and Malenge, and leaves a spare day where the boats are least predictable.
## Who this trip is for, and who it is not
This route is for solo travellers and friends who are happy with simple bungalows and set mealtimes, for couples who want a week offline, and for divers and snorkellers who prefer quiet reefs to famous ones.
It is not for anyone with fewer than seven days, for travellers who need air conditioning, hot water and a working card machine, or for families with small children, since medical care is far away. If you would rather see the Togeans as part of a longer overland line, read [[14 days across Sulawesi|/trips/14-days-sulawesi-toraja-togean-bunaken]]. If you want easier access to good reef, [[Bunaken and Lembeh in 10 days|/trips/10-days-north-sulawesi-diving-bunaken-lembeh]] is a simpler trip.
## Trip at a glance
**Duration:** 8 days, 7 nights: 1 in Ampana, 3 on Kadidiri, 2 on Malenge, 1 in Ampana.
**Route:** Makassar or Jakarta to Luwuk by air, road to Ampana, speedboat to Wakai, Kadidiri, Malenge, then a public boat back to Ampana and the road to Luwuk.
**Pace:** slow. Two travel days at each end, four full island days in the middle.
**Best for:** solo travellers, friends, couples, divers and snorkellers.
**Best time:** roughly April or May to October. Sources differ by a month at each end.
**Budget:** low once you arrive, since most rooms are sold per person with three meals. Flights and private boats are the main costs.
**Logistics:** complex. Boats run on fixed days and move with the weather.
## Why this route makes sense
Luwuk is the most dependable airport for the Togeans, with jets from Makassar and about five hours of road to Ampana. The small airport at Ampana itself is not a plan: a resort-run transport guide checked in June 2026 says the Wings Air flight from Palu was suspended in May 2025, with no confirmed return.
The islands are split in two because they are different. Kadidiri is close to Wakai, has the dive centres and is easy to reach on arrival day. Malenge is further east, quieter, and close to the Bajau village of Pulau Papan. Doing Kadidiri first means the short, reliable transfer comes when you are tired, and the long boat back to Ampana leaves from Malenge, where the public boat starts its run.
## How do you get to the Togean Islands?
Fly to Luwuk, drive about five hours to Ampana, sleep there, then take the morning speedboat to Wakai, about an hour and a half across. From Wakai, resort boats carry you to your island. The other way in is an overnight ferry from Gorontalo that sails twice a week.
From Makassar, 12Go listed two Batik Air flights a day to Luwuk when we checked in November 2026, at 10:05 and 13:05, the fastest 1 hour 20 minutes. From Luwuk, a private car to Ampana costs about Rp 1,000,000 per car, according to a resort-run guide, and The Indonesia Guide quotes Rp 100,000 to 150,000 per seat in a shared car. Treat both as working estimates.
From Ampana, two public speedboats leave daily, at about 09:00 and around midday, and charge roughly Rp 130,000 to 170,000. A car ferry run by ASDP sails about three days a week, takes about five hours and costs less. All of these are sold at the harbour, in cash. None of them was bookable on 12Go when we checked.
^^ Ways into the Togean Islands, as working estimates from 2026 guides. Confirm days and times locally.
| Route | Boat | Time | Fare | Runs |
| Ampana to Wakai | Public speedboat | About 1.5 hours | About Rp 130,000 to 170,000 | Daily, about 09:00 and around midday |
| Ampana to Wakai | ASDP car ferry | About 5 hours | From about Rp 56,500, sources differ | About 3 days a week |
| Ampana to Katupat and Malenge | Multi-stop public boat | 4 to 6 hours | About Rp 110,000 to 180,000 | Most days, sources disagree on which |
| Gorontalo to Wakai | Overnight ASDP ferry | About 12 hours | Economy from about Rp 63,000 | Tuesday and Friday, afternoon |
## Day 1: Fly to Luwuk and drive to Ampana
**Morning.** Fly from Makassar to Luwuk. Compare [[Makassar to Luwuk flights on 12Go|TWELVEGO_MAKASSAR_LUWUK]], and if you are starting further west, [[Jakarta to Luwuk flights on 12Go|TWELVEGO_JAKARTA_LUWUK]], where the fastest option listed was 4 hours 25 minutes. Take the earlier Makassar flight if you can.
**Afternoon.** Drive to Ampana, about five hours along the coast. Ask your Ampana guesthouse or your island resort to arrange the car, since that is easier than negotiating at the airport.
**Evening.** Sleep in Ampana. Withdraw cash tonight, more than you think you need, and buy anything you cannot do without for a week.
**Base:** Ampana, 1 night. Compare [[Ampana stays on Booking.com|BOOKING_AMPANA]] and pick somewhere near the harbour.
**Booking logic:** book the flight and the first night together. If you land on the 13:05 flight you reach Ampana after dark, which is fine, but do not try to connect to a boat the same day.
**Travel note:** set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly. It will work in Luwuk and Ampana. Guides agree that signal drops once the boat leaves the coast, so download maps and tell people you will be quiet for a week.
## Day 2: Speedboat to Wakai and on to Kadidiri
**Morning.** Be at the harbour early for the 09:00 speedboat. It carries about 22 passengers, so in July and August ask your resort to hold seats by message. The crossing to Wakai takes about an hour and a half in calm water.
**Afternoon.** Transfer to Kadidiri, about 30 minutes from Wakai. Wikivoyage notes that the resorts on Kadidiri collect guests from Wakai free of charge, which is why you send them your arrival day in advance.
**Evening.** Dinner at a set hour, then very little. Most places run a generator from about dusk to dawn, so charge everything overnight.
**Base:** Kadidiri, 3 nights. Some places appear among [[Togean Islands stays on Booking.com|BOOKING_TOGEAN_ISLANDS]], but many are booked by message, so check both.
**Booking logic:** book the island beds before anything else in July and August. There are only so many bungalows.
**Travel note:** Wikivoyage lists a national park ticket of Rp 150,000 per foreign visitor. We could not find a current official notice, so carry the cash and ask your resort where it is collected.
## Which island should you stay on in the Togeans?
Stay on Kadidiri if it is your first visit or you want to dive, Malenge if you want quiet, forest and the Bajau village at Pulau Papan, and Una Una if diving is the whole point. Bomba, on Batudaka, is the closest to Ampana and suits a shorter stay. Eight days is enough for two of them.
^^ Togean island bases compared. Prices are "from" rates per person with meals quoted by 2026 guides, some of them resort-run, so confirm directly.
| Base | From Wakai | From, per person per night | Best for | Trade-off |
| Kadidiri | About 30 minutes | About Rp 160,000 to 400,000 | First visits, divers, easy arrival | The busiest of the islands, which is still quiet |
| Malenge | About 2 hours | About Rp 125,000 to 550,000 | Quiet, forest, Pulau Papan | Long boat in and out |
| Una Una | A long boat ride, weather permitting | Ask directly | Serious divers | Hard to combine with anything else |
| Bomba, Batudaka | Reached from Ampana, about 45 minutes | From about Rp 350,000 | Short stays, a soft landing | Furthest from the other islands |
## Day 3: Reefs off Kadidiri
**Morning.** Snorkel from the beach or join a dive boat. The Indonesia Guide quotes about $25 to $45 per fun dive with equipment and a guide, with discounts for five or more, and about Rp 30,000 to 50,000 a day for snorkel gear. Wikivoyage notes that dive boats often take snorkellers along when the site is shallow enough.
**Afternoon.** Divers can ask about the B-24 bomber wreck, about an hour away by boat. Stingy Nomads reports visibility under 10 metres around it, so go for the history, not the view.
**Evening.** Walk the beach after dark and you may see coconut crabs, which Stingy Nomads describes climbing trees here. Look, and leave them alone.
**Booking logic:** arrange dives and boat trips on the island, a day ahead. They are cheaper and more flexible than anything sold online.
**Travel note:** coral cuts go bad quickly in this climate. Wear reef shoes on shallow entries and bring antiseptic.
## Day 4: Una Una for divers, the jellyfish lake for everyone else
**Morning.** This is the flexible day. Divers should ask for Una Una, the volcanic island to the north-west, where Stingy Nomads counts more than 30 sites and schooling barracuda and jacks. It is a long boat ride and needs settled weather.
**Afternoon.** Snorkellers can share a boat to the Mariona lake near Katupat, known for stingless jellyfish. Be realistic: Stingy Nomads reported in 2024 that numbers had fallen sharply, and its 2026 update does not report a recovery. Ask your resort what people saw this week before you pay for the boat, and combine it with a reef stop so the trip is worth it either way.
**Evening.** Settle your bill in cash. Some resorts accept bank transfers, but do not count on it.
**Travel note:** if you do swim in the lake, local guides ask visitors to skip sunscreen and fins. The animals are fragile and the lake is small.
## Day 5: Move east to Malenge
**Morning.** Take a boat to Malenge, about two hours. A charter from Wakai costs about Rp 800,000 to 900,000 per boat, according to a resort-run guide, so share it if you can. A public boat also runs from Wakai on some days, but sources disagree on which, so ask on Kadidiri.
**Afternoon.** Check in and swim. Malenge is greener and steeper than Kadidiri, with forest behind the beaches.
**Evening.** Ask which morning the public boat to Ampana leaves. Your exit depends on it, and this is the moment to find out.
**Base:** Malenge, 2 nights.
**Booking logic:** tell the Malenge guesthouse how you are arriving. Most will send a boat to meet the public service or arrange the charter for you.
## Day 6: Pulau Papan and the Bajau village
**Morning.** Visit Pulau Papan, a Bajau village joined to Malenge by a wooden walkway that Stingy Nomads puts at about 1,800 metres. The Indonesia Guide quotes about Rp 50,000 to 100,000 per person for a guided visit arranged by a guesthouse. Go with someone local, ask before you photograph anyone, and buy something small in the village.
**Afternoon.** Snorkel the reefs near the village or paddle the mangroves. Kayaks rent for about Rp 50,000 to 75,000 an hour, according to the same guide.
**Evening.** Pack tonight. The boat leaves early.
**Travel note:** this is the spare day in practice. If the sea is rough on Day 5 or the boat day does not match, move the Malenge nights and keep the exit fixed.
## Day 7: The long boat back to Ampana
**Morning.** Take the public boat from Malenge to Ampana. It has usually left at about 07:00 and takes five to six hours with stops, for about Rp 110,000 to 180,000. Guides disagree on which days it runs, which is why you checked on Day 5.
**Afternoon.** Arrive in Ampana, shower and eat somewhere that is not a set menu.
**Evening.** Confirm tomorrow's car and your flight time.
**Base:** Ampana, 1 night. This buffer night is the one that protects your flight.
**Booking logic:** if no public boat runs on your day, charter to Wakai and take a speedboat from there. Budget for that possibility from the start.
## Day 8: Ampana to Luwuk and fly out
**Morning.** Leave early for Luwuk, about five hours by road.
**Afternoon.** Fly to Makassar and connect onward. Check that day's departure times before you commit. If the last flight leaves too early for a same-day drive, travel to Luwuk on the evening of Day 7 and compare [[hotels in Luwuk on Booking.com|BOOKING_LUWUK]] instead of the second Ampana night.
**Booking logic:** keep the international flight home on a different day. One cancelled boat should cost you a beach day, not a long-haul ticket.
## Should you leave the Togeans by ferry to Gorontalo instead?
Leave by Gorontalo if you are continuing north to Manado and Bunaken and your dates fit the ferry. It sails from Wakai twice a week, takes about twelve hours overnight and lands you in a city with flights. If you are flying home, going back through Ampana and Luwuk is easier to time.
Wikivoyage and other guides give Monday and Thursday for the Wakai to Gorontalo sailing, and Tuesday and Friday for the reverse, leaving in the afternoon. Economy tickets are quoted from about Rp 63,000, and a few cabins exist at a much higher price. One traveller guide reports the ferry out of service for a whole month for maintenance, so ask your resort before you plan around it. Gorontalo is linked to Makassar by air: the [[Makassar to Gorontalo flights on 12Go|TWELVEGO_MAKASSAR_GORONTALO]] page showed one departure a day when we checked in November 2026, so look up the return direction for your date.
## How do the Togean Islands compare with other remote island weeks?
The Togeans are the cheapest and slowest of Indonesia's remote island weeks, with calmer water than most and simpler rooms than any. Wakatobi and Derawan have stronger headline wildlife. Bunaken is far easier to reach. Choose the Togeans for the pace and the price, not for a single famous sight.
^^ Four island weeks compared, as working judgements
| Trip | How you get there | In the water | On land | Best suited to |
| Togean Islands | Flight to Luwuk, 5 hours by road, boat | Calm bay, easy reefs, Una Una for divers | Bajau villages, forest | Slow travellers on a modest budget |
| Bunaken | Flight to Manado, short boat | Reef walls, turtles | Little beyond the village | Divers and snorkellers short on time |
| Wakatobi | Flights via Makassar or Kendari | Reef walls, very healthy coral | Bajo stilt villages | Reef lovers, resort or independent |
| Derawan and Maratua | Flight to Berau, car and boat | Turtles, mantas, a jellyfish lake | Small island villages | Wildlife-led snorkellers and divers |
## What to book early, and what to keep flexible
Book early: flights to Luwuk, the first night in Ampana and your island beds, above all in July and August when the dry season and European holidays overlap.
Keep flexible: every boat. Buy speedboat and ferry tickets at the harbour, arrange dives and day trips on the island, and decide between the Ampana and Gorontalo exits only when you know which boats are running. A resort-run guide notes that boats and buses fill around Idul Fitri and for two to three weeks after, so avoid that window if you can.
## What mistakes do travellers make in the Togean Islands?
The most common mistake is arriving without enough cash, because there are no ATMs on the islands. The others are treating boats as daily transport when several run only on fixed days, booking a flight for the day you leave the islands, and coming for less than a week. A buffer night in Ampana solves most of them.
Other mistakes: planning the whole trip around the jellyfish lake, which may disappoint; expecting to work online; and travelling in December or January, when a resort-run guide says the winds are strongest and boats can be cancelled for days.
## What to cut, adapt or upgrade
**Cut:** with seven days, drop Malenge and spend five nights on Kadidiri with day trips. You lose Pulau Papan and gain a simpler exit by speedboat from Wakai.
**Adapt:** divers can swap Malenge for Una Una. Travellers continuing north can leave by the Gorontalo ferry, which is the logic of our [[14-day Sulawesi route|/trips/14-days-sulawesi-toraja-togean-bunaken]].
**Upgrade:** a few resorts offer power all day, private bathrooms and their own boat transfers from near Ampana. They cost several times the price of a simple bungalow and remove most of the logistics. Compare what each includes before you pay.
## Before you build this trip
**Money:** the islands are cash only for practical purposes. Withdraw in Luwuk or Ampana, and carry small notes.
**Health:** The Indonesia Guide says malaria transmission is confirmed in Central Sulawesi, so ask a travel clinic about prophylaxis and use repellent from dusk. The nearest hospital is in Ampana or Palu and there is no recompression chamber nearby, so dive conservatively and check that your insurance covers evacuation.
**Season:** most sources give April or May to October as the dry season, with rougher crossings from November to March. Diving is possible all year when boats can sail.
**Entry:** Indonesia's visa on arrival rules apply when you land in Jakarta, Bali or Makassar. Check the latest official guidance before you fly.
## Final verdict: is a week in the Togean Islands worth it?
Yes, if you want a slow week more than a spectacular one. The Togeans are not Indonesia's best reefs or its most dramatic islands. They are calm, cheap and barely connected, and eight days is enough to settle in. If you have less time, or need things to run to the minute, pick somewhere with an airport.
## Related itineraries
To cross the whole island with the Togeans in the middle, see [[14 days across Sulawesi|/trips/14-days-sulawesi-toraja-togean-bunaken]]. For a shorter Sulawesi trip that flies over the middle, read [[10 days from Toraja to Bunaken|/trips/10-days-sulawesi-toraja-bunaken]]. For remote reefs with more comfort, try [[Wakatobi in 8 days|/trips/8-days-wakatobi-diving-southeast-sulawesi]], and for turtles and mantas, [[8 days in Derawan and Maratua|/trips/8-days-derawan-islands-maratua-kakaban]].
"""
FAQ=[
("How do you get to the Togean Islands?","Fly to Luwuk, drive about five hours to Ampana and take the morning speedboat to Wakai, about an hour and a half. Resort boats cover the last leg. The alternative is an overnight ferry from Gorontalo, which guides list on Tuesdays and Fridays."),
("How many days do you need in the Togean Islands?","Plan on eight days door to door, which gives five nights on the islands. Travel takes about two days in each direction, so anything under a week leaves you more time in transit than on the beach."),
("Is there an ATM in the Togean Islands?","No. Guides agree there are no ATMs on the islands. Withdraw enough cash in Luwuk or Ampana for rooms, boats, dives and park fees, and add a margin for a private boat in case the public one does not run."),
("What is the best time to visit the Togean Islands?","Most sources give April or May to October, when Tomini Bay is calmest. November to March brings rain and rougher crossings, and one 2026 transport guide says December and January have the strongest winds, with boats sometimes cancelled for days."),
("Can you still swim with stingless jellyfish in the Togeans?","The Mariona lake near Katupat is still visited, but Stingy Nomads reported in 2024 that jellyfish numbers had fallen sharply. Ask your resort what visitors saw that week before you pay for a boat, and treat it as a bonus."),
("Is there internet or phone signal in the Togean Islands?","Very little. Signal works in Ampana and fades once the boat leaves the coast. A few resorts have usable wifi and most simple ones do not, so download maps and tickets before you cross and warn people you will be offline."),
("Are the Togean Islands good for diving?","Yes, for relaxed diving in calm water. Kadidiri has the dive centres and easy reefs, a B-24 bomber wreck lies about an hour away, and Una Una is the highlight for experienced divers. There is no recompression chamber nearby, so dive conservatively."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"{PFX}-{p}{cnt[0]}"
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
title="8 Days in the Togean Islands: Kadidiri, Malenge and the Slow Boats of Tomini Bay"
intro="The Togean Islands sit in the middle of Tomini Bay, a flight, a five-hour drive and a boat from anywhere. This eight-day plan flies into Luwuk, crosses from Ampana by speedboat, splits five island nights between Kadidiri and Malenge, and keeps a buffer night for boats that run on their own schedule."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Togean Islands Itinerary: 8 Days via Ampana and Wakai",
 metaDescription="An 8-day Togean Islands itinerary: fly to Luwuk, cross from Ampana to Wakai, stay on Kadidiri and Malenge, with 2026 boat days, fares and cash advice.",
 focusKeyword="Togean Islands itinerary",intro=intro,
 route="Makassar or Jakarta to Luwuk by air, road to Ampana (1 night), speedboat to Wakai, Kadidiri (3 nights), Malenge (2 nights) for Pulau Papan, public boat to Ampana (1 night), road to Luwuk",
 routeSummary="Luwuk → Ampana → Wakai → Kadidiri → Malenge → Ampana → Luwuk",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to October",logisticsComplexity="complex",
 destinationPrimary="wild_indonesia",travelStylePrimary="beach_islands",travelStyleSecondary=["remote_offbeat","diving_snorkeling"],
 travellerTypes=["solo_travellers","friends","couples"],tripLengthBucket="one_week",tripLengthDays=8,vibe="remote",
 experienceTags=["snorkeling","diving","island_hopping","village_culture","sulawesi"],
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
