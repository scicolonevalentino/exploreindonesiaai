# PARTE 2, 2026-10-30 generator run: first "first time in Sumatra" itinerary.
# Matrix: sumatra x first_time_indonesia = 0 (ten Sumatra articles, none for a
# first visit), and no 10-day Sumatra plan for couples/friends/solo. GSC
# 2026-09-30..10-27: "sumatra itinerary" 22 impr at pos 9.6 with one click on
# the 15-day page, plus "bukit lawang to lake toba" (12) and "banda aceh ferry
# to pulau weh" served by other pages. The SERP (Southeast Asia Backpacker,
# Lonely Planet, Bucketlist Bri "10-day for first-timers") is editorial and
# its dominant format is the 10-day first-visit route this fills.
# Builds the Sanity document, validates it, writes the snapshot to content/articles/.
#   python3 scripts/build-sumatra-first-timers-2026-10-30.py
import json,re,datetime
SLUG="10-days-sumatra-first-timers"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
VIATOR="?pid=P00303362&mcid=42383&medium=link&campaign=sumatra10"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="viator",placeholderId="VIATOR_BUKIT_LAWANG_DAY_TREK",affiliateUrl="https://www.viator.com/tours/Medan/Full-Day-Jungle-Trek-Bukit-Lawang-Tour/d4866-193061P1"+VIATOR,publicUrl="https://www.viator.com/tours/Medan/Full-Day-Jungle-Trek-Bukit-Lawang-Tour/d4866-193061P1",anchorText="full-day Bukit Lawang jungle trek",experienceCategory="wildlife_tour"),
 dict(partner="12go",placeholderId="TWELVEGO_MEDAN_PARAPAT",affiliateUrl="https://12go.asia/en/travel/medan/parapat?z=16022946",publicUrl="https://12go.asia/en/travel/medan/parapat",anchorText="Medan to Parapat transfers on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_MEDAN_BANDA_ACEH",affiliateUrl="https://12go.asia/en/travel/medan/banda-aceh?z=16022946",publicUrl="https://12go.asia/en/travel/medan/banda-aceh",anchorText="overnight buses from Medan to Banda Aceh",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_BUKIT_LAWANG",affiliateUrl=BK%"Bukit+Lawang",publicUrl=BK%"Bukit+Lawang",anchorText="Bukit Lawang guesthouses on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_TUK_TUK",affiliateUrl=BK%"Tuk+Tuk%2C+Samosir",publicUrl=BK%"Tuk+Tuk%2C+Samosir",anchorText="Tuk Tuk and Samosir stays on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_BANDA_ACEH",affiliateUrl=BK%"Banda+Aceh",publicUrl=BK%"Banda+Aceh",anchorText="hotels in Banda Aceh on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_SABANG",affiliateUrl=BK%"Sabang",publicUrl=BK%"Sabang",anchorText="Sabang and Pulau Weh stays on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"sft-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Is 10 days enough for a first trip to Sumatra?
Ten days is enough for a first trip to Sumatra if you keep it to the north: orangutans at Bukit Lawang, three nights on Lake Toba and the reef at Pulau Weh, linked by one long road day and one short flight. It is not enough to add Berastagi, West Sumatra or the Mentawai Islands without cutting one.
Sumatra puts off more first-time visitors than any other large Indonesian island, and the reasons are fair: it is bigger than Spain and Portugal together, there is no fast way between its regions, and most guides open with a fifteen-day loop. This plan is the shorter answer. It takes the three things a first visit should deliver, wild orangutans, the world's largest volcanic lake and a coral reef you can walk into, and strings them on the only two transfers that make the geography work. You will spend two of the ten days mostly moving. In exchange you see three different Sumatras, and you fly home from a different airport than you landed at, which is what saves the extra road day.
## Who this trip is for, and who it is not
This route is for couples, friends and solo travellers on a first visit to Sumatra who want the island's range in ten days, and who can live with simple guesthouses, cash payments and one seven to eight hour minibus day. It suits anyone who has done Bali or Java and wants somewhere quieter and wilder next.
It is not for travellers who need a resort, a bar or a fixed schedule. Aceh is a conservative province where alcohol is not openly sold, Bukit Lawang guesthouses are basic, and the ferry to Pulau Weh runs when the sea allows. If you have fifteen days, take the slower [[15-day Sumatra overland route|/trips/15-days-sumatra]] instead, which adds Berastagi and gives Lake Toba five nights. With young children, the [[9-day North Sumatra family itinerary|/trips/9-days-north-sumatra-with-kids]] paces the jungle and the lake more gently.
## Trip at a glance
**Duration:** 10 days, 9 nights: 2 in Bukit Lawang, 3 on Samosir Island, 1 in Banda Aceh, 2 on Pulau Weh, 1 back in Banda Aceh.
**Route:** Medan (Kualanamu, KNO), Bukit Lawang, Parapat and the ferry to Tuk Tuk on Samosir Island, back to Medan for the flight to Banda Aceh (BTJ), ferry to Pulau Weh, ferry back and fly out of Banda Aceh.
**Pace:** balanced. One full trek day, two long transfer days, one flight, two ferry crossings, and three slow days split between the lake and the reef.
**Best for:** first-time Sumatra visitors, couples, friends and solo travellers who want jungle, highland lake and coast in one trip.
**Best time:** May to September, the drier window for jungle trekking, with calmer seas for the Pulau Weh crossing. Sumatra is wetter year-round than Bali, so pack for rain in any month.
**Budget:** as a working estimate, roughly $650 to $1,100 per person for ten days on the ground, excluding international flights. The domestic flight, the private cars and the trek carry most of it.
**Logistics:** moderate to hard. Two fragile links decide the trip: the Day 6 road-and-flight day from Lake Toba to Banda Aceh, and the Day 9 ferry off Pulau Weh.
## Why this route makes sense
Sumatra's first-time problem is geography. Its three best-known sights sit in three corners of the north: the orangutans are three to four hours northwest of Medan, Lake Toba is four hours south, and Pulau Weh is a flight and a ferry away at the island's tip. No road loop joins them in ten days. The answer is to use Medan twice, once as the hub between jungle and lake and once as the airport for the hop to Aceh, and to fly home from Banda Aceh instead of driving back.
The order matters too. The jungle goes first, while your legs are fresh and before the humidity has worn you down. The lake goes second, because Samosir is the easiest place in the region to do nothing and the trip needs a rest in the middle. The reef goes last, because a slow island with warm water is the right place to finish, and because the buffer night in Banda Aceh before the flight home protects the whole plan from a cancelled ferry.
## How do you get around Sumatra on this route?
You get around by private car or shared tourist minibus on the roads, one public ferry across Lake Toba, one domestic flight from Medan to Banda Aceh and one ferry to Pulau Weh. Nothing on this route is sold as a single ticket; each leg is arranged separately, and most are paid in cash on the day.
^^ Every transfer on this 10-day Sumatra route, with working estimates
| Leg | How | Time | Working cost |
| Kualanamu airport to Bukit Lawang | Private car sent by your guesthouse | 3 to 4 hours | About $40 to $55 per car |
| Bukit Lawang to Parapat (Lake Toba) | Shared tourist minibus, or a private car | 7 to 8 hours | Per seat, ask your guesthouse; a private car costs more |
| Parapat to Tuk Tuk (Samosir Island) | Public passenger ferry from Tigaraja pier | 30 to 45 minutes | IDR 15,000 to 25,000 per person |
| Tuk Tuk to Kualanamu airport | First ferry, then a private car | 4 to 5 hours door to door | About $45 to $55 per car |
| Medan to Banda Aceh | Wings Air or Super Air Jet flight | About 1 to 1.5 hours | Compare fares by date; the overnight bus takes 10 hours or more |
| Ulee Lheue to Balohan (Pulau Weh) | Express Bahari fast ferry, or the slow ASDP ferry | 45 minutes fast, about 2 hours slow | Roughly IDR 100,000 fast, IDR 35,000 slow |
These figures come from guesthouse quotes, the ferry operators' published tariffs and regional news reports in 2026, and they move. Treat every number as a working estimate and confirm the current price before you pay. For the Medan legs in detail, see our [[Medan to Bukit Lawang|/transport/medan-to-bukit-lawang]] and [[Medan to Lake Toba|/transport/medan-to-lake-toba]] transport pages, and compare [[Medan to Parapat transfers on 12Go|TWELVEGO_MEDAN_PARAPAT]] if you would rather fix the lake leg before you fly.
## How much does 10 days in Sumatra cost in 2026?
As a working estimate, ten days in Sumatra on this route costs roughly $650 to $1,100 per person excluding international flights, which makes it one of Indonesia's cheaper regions once you are there. The fixed costs are the domestic flight, the private cars and the orangutan trek; rooms, food, scooters and boats are low by any standard.
^^ Where the money goes on 10 days in Sumatra, per person, working estimates
| Item | Working estimate | Notes |
| Orangutan day trek, Bukit Lawang | $30 to $60 including the park permit | Licensed guide through your guesthouse; pre-booked tours cost more |
| Gunung Leuser park permit | Around IDR 150,000 for foreign visitors | Figure quoted by guide websites in 2026, usually bundled into the trek price |
| Private cars, two legs | $40 to $55 per car each way | Split between the group |
| Medan to Banda Aceh flight | Varies by date | Book it first; the route is thin |
| Pulau Weh ferry | IDR 100,000 fast or IDR 35,000 slow, each way | Operator tariff, and an August 2026 regional news report for the slow fare |
| Fun dives at Pulau Weh | $20 to $25 per dive including gear | Snorkelling costs a few dollars for the boat |
| Visa on arrival or e-VOA | IDR 500,000 | Official e-visa portal; a rise to IDR 750,000 has been proposed |
## Day 1: Land in Medan, drive to Bukit Lawang
**Morning.** Land at Kualanamu International Airport (KNO), usually via Jakarta, Kuala Lumpur or Singapore. Draw rupiah at the airport, because the next nine days run largely on cash. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly so maps and guesthouse messages work from the arrivals hall.
**Afternoon.** Drive to Bukit Lawang, three to four hours by private car depending on Medan traffic, as a working estimate $40 to $55 per car. The last stretch narrows to a village road and most guesthouses are reached on foot along the Bahorok River.
**Evening.** Eat by the river and sleep early. Tomorrow is the most physical day of the trip.
**Base:** Bukit Lawang, 2 nights. Compare [[Bukit Lawang guesthouses on Booking.com|BOOKING_BUKIT_LAWANG]] and choose a riverside room close to the park entrance.
**Booking logic:** ask your guesthouse to send the car; it is usually cheaper than an airport taxi and the driver knows the last kilometre. Book the trek for tomorrow when you check in.
**Travel note:** if your flight lands after early afternoon, sleep near the airport and drive in the next morning. That road in the dark is a poor start, and you lose nothing by waiting.
## Day 2: Orangutans in Gunung Leuser
**Morning.** Start early, when the forest is cooler and the animals more active. Every trek inside Gunung Leuser National Park must be led by a licensed guide. Most guides know where the semi-wild orangutans, descendants of the rehabilitation programme that once ran here, have been feeding, and fully wild ones are seen too, along with Thomas leaf monkeys and macaques.
**Afternoon.** Stay out for the full day if your legs allow; a full-day trek gives the best odds of a long sighting. The classic way back is an hour of river tubing down the Bahorok on lashed inner tubes.
**Evening.** Settle the guide fee in cash and confirm tomorrow's minibus departure with your guesthouse.
**Booking logic:** the standard way is a licensed guide through your guesthouse, as a working estimate $30 to $60 per person for a day trek including the park permit. If you prefer it fixed before you fly, a [[full-day Bukit Lawang jungle trek|VIATOR_BUKIT_LAWANG_DAY_TREK]] can be booked ahead for a little more.
**Travel note:** keep your distance and never feed the orangutans. A guide who offers to lure them with food is the wrong guide; walk away.
## Day 3: The long road to Lake Toba
**Morning.** Leave Bukit Lawang on the shared tourist minibus, which travellers report takes seven to eight hours to Parapat on slow roads. Many services stop at the Sipiso-piso waterfall on the northern rim of the caldera, which is the moment you first see how big Lake Toba is.
**Afternoon.** Reach Parapat and take the passenger ferry from Tigaraja pier to Tuk Tuk on Samosir Island, 30 to 45 minutes, as a working estimate IDR 15,000 to 25,000 per person. It runs roughly hourly through the day and thins out after dusk. Tell the crew your guesthouse name, because the boat drops passengers at lakeside jetties rather than one terminal.
**Evening.** Dinner on the lake. Samosir sits at around 900 metres, so you will want a layer.
**Base:** Tuk Tuk, 3 nights. Look at [[Tuk Tuk and Samosir stays on Booking.com|BOOKING_TUK_TUK]] and take a lakefront room with its own jetty.
**Booking logic:** book the minibus as soon as you arrive in Bukit Lawang, and ask whether the ticket includes the ferry. A private car is faster and lets you stop, but it is priced per vehicle.
**Travel note:** if you fall behind, call your Tuk Tuk guesthouse. The vehicle ferry from Ajibata to Tomok runs later than the passenger boats, and a short taxi closes the gap to Tuk Tuk.
## Day 4: Samosir by scooter, Ambarita and Simanindo
**Morning.** Hire a scooter, as a working estimate IDR 100,000 to 150,000 a day, and ride north to Simanindo at the island's tip, about an hour from Tuk Tuk. The Huta Bolon museum sits inside a traditional Batak house compound and dance performances generally run in the morning, so ask your guesthouse the night before.
**Afternoon.** Stop at Ambarita on the way back for the Siallagan stone chairs, where Batak kings once held court. Entry is a small local fee, typically a few thousand rupiah, and a guide will attach themselves to you at the gate. Take one; the stones say very little unexplained.
**Evening.** Walk the Tuk Tuk loop, past the lakeside cafes and the workshops selling Batak carving and ulos weaving.
**Booking logic:** nothing. Scooters, kayaks and guides are arranged within ten minutes of asking, in cash.
**Travel note:** Samosir is a little smaller than Singapore. Sights sit an hour apart on slow roads, so take one direction per day.
## Day 5: A slow day on the lake
**Morning.** Swim off your guesthouse jetty. The lake is deep, calm and pleasant to swim in, and the morning light on the caldera wall is the best of the day.
**Afternoon.** Either do nothing at all, which is the point of this half of the trip, or cross the island to the hot springs above Pangururan, roughly an hour to an hour and a half each way. They are a local bathing spot rather than a spa, so expect families rather than towels.
**Evening.** Pack, settle your bill in cash and confirm the first ferry time with your guesthouse. Tomorrow is the day the plan depends on.
**Booking logic:** book the Day 6 private car to Kualanamu through your guesthouse tonight, for pickup at the Parapat pier.
**Travel note:** this is the day to drop if you want a third night on Pulau Weh. The lake does not change; the reef days are the ones first-timers wish they had more of.
## Day 6: Lake Toba to Banda Aceh
**Morning.** Take the first ferry off Tuk Tuk, usually from around half past eight, and be in the car out of Parapat by mid morning. The drive to Kualanamu runs three and a half to four and a half hours in good conditions, and longer once Medan traffic starts.
**Afternoon.** Fly Medan to Banda Aceh (BTJ) on the mid-afternoon departure. In autumn 2026, aggregator timetables listed Wings Air and Super Air Jet departures in the early morning and one Wings Air flight at around 16:00; the flight itself takes around an hour to an hour and a half. Book nothing earlier than mid afternoon on this day, and confirm the current schedule before you lock the rooms either side of it.
**Evening.** Taxi into Banda Aceh, about 13 kilometres from the airport, eat early and sleep. Aceh is dry, so dinner is the evening.
**Base:** Banda Aceh, 1 night. Compare [[hotels in Banda Aceh on Booking.com|BOOKING_BANDA_ACEH]] near Ulee Lheue harbour or the city centre.
**Booking logic:** the Medan to Banda Aceh flight is the one domestic ticket to buy before anything else, because the route is thin and it decides your ferry. If no afternoon flight exists on your date, sleep near Kualanamu and take the first morning flight instead, then the 10:00 or 16:30 ferry.
**Travel note:** if the flights are full or expensive, [[overnight buses from Medan to Banda Aceh|TWELVEGO_MEDAN_BANDA_ACEH]] leave through the afternoon and evening and take ten hours or more. It is cheap and it is a long night.
## Day 7: Ferry to Pulau Weh
**Morning.** From Ulee Lheue harbour take the Express Bahari fast ferry to Balohan on Pulau Weh, about 45 minutes, with departures broadly at 08:00, 10:00 and 16:30 and a fare in the region of IDR 100,000 according to the operator's published tariff. The slow ASDP ferry takes about two hours for IDR 35,000 in economy, a fare an August 2026 regional news report confirmed, but it runs less often and its times shift when a vessel is in dock. Tickets are sold at the harbour.
**Afternoon.** A shared car from Balohan to Iboih takes around 45 minutes. Check in, then step off the jetty: the house reef at Iboih and the walk-in reef at Gapang need no boat, no schedule and no fee.
**Evening.** Eat early at the beach warungs. There is no bar scene, and after six days of transfers that will not feel like a loss.
**Base:** Iboih or Gapang, 2 nights. Look at [[Sabang and Pulau Weh stays on Booking.com|BOOKING_SABANG]] and pick for the beach you want to wake up on.
**Booking logic:** book the two nights before you fly, since the better cabins are a small pool. Message a dive shop a few days ahead if you want to dive on Day 8.
**Travel note:** the Weh ferries are not sold online, 12Go included. Buy at the harbour, and arrive 45 minutes early in July and August and over Indonesian holidays.
## Day 8: Rubiah Island and the reef
**Morning.** Snorkel Rubiah. The marine park water off Rubiah Island is clear, often to something like 25 metres, and a local fisherman will run you across from Iboih and collect you later for a fee agreed on the beach. Divers can take two fun dives instead, as a working estimate $20 to $25 each including gear, which is cheap by Indonesian standards.
**Afternoon.** Hire a scooter and ride half an hour through forest to Kilometre Zero, the monument marking Indonesia's northwestern extreme. You will probably meet macaques on the road. The appeal is standing at the end of the country, not the architecture.
**Evening.** Settle the dive or boat bill in cash and confirm tomorrow's ferry with your guesthouse rather than with a timetable you found online.
**Booking logic:** nothing to pre-book. Boats and gear are arranged on the beach that morning.
**Travel note:** fill the scooter before you leave Iboih; fuel is sold from bottles at roadside stalls once you are away from Sabang town.
## Day 9: Ferry back and the tsunami sites
**Morning.** Take a morning ferry back to Ulee Lheue. Express Bahari departures from Balohan run broadly at 08:00, 14:30 and 16:30. Returning to the mainland a full day before your flight means a cancelled or rough crossing costs you an afternoon, not the flight home.
**Afternoon.** Give the tsunami memorial sites a couple of unhurried hours. The PLTD Apung, a power-generator ship the 2004 wave carried more than three kilometres inland and left in a residential street, is the one that stays with you. The Tsunami Museum and the Baiturrahman Grand Mosque are both central and both worth the walk.
**Evening.** A last Acehnese dinner. Mie Aceh, the thick spiced noodle dish, is the local classic.
**Base:** Banda Aceh, 1 night.
**Booking logic:** book this hotel at the same time as the Day 6 one. The city is not a place rooms sell out, but you want to know where you are sleeping after a ferry.
**Travel note:** do not book a same-day ferry and flight. This buffer is the single most important line in the itinerary, and the one travellers cut first.
## Day 10: Fly home from Banda Aceh
**Morning.** Transfer to Sultan Iskandar Muda airport and fly on, usually via Medan, Jakarta or Kuala Lumpur. Confirm the connection the night before, since a missed morning flight out of Banda Aceh can mean a long wait for the next one.
**Travel note:** confirm current flight routes before you lock the international leg. The Kuala Lumpur hop runs around an hour and a half and avoids backtracking through Medan.
## What to book early, and what to keep flexible
Book early: the international flights, the Medan to Banda Aceh hop, the first nights in Bukit Lawang, on Samosir and on Pulau Weh, and the Day 1 airport car. These decide whether the trip works at all, and the lakefront rooms and Weh cabins are small pools that fill in July, August and over Indonesian holidays.
Keep flexible: the guide, the minibus, the scooters, the boats and the dives. All are arranged on the day, in cash, usually within an hour of asking, and arranging the trek through your guesthouse is usually cheaper than booking it online.
## Mistakes first-timers make in Sumatra
The biggest is treating the Day 3 minibus as a half day with sightseeing attached. Seven to eight hours on North Sumatra roads is the whole day, and padding it is how people miss the last ferry. The second is booking a morning flight out of Kualanamu on Day 6; there is no ferry off Samosir early enough.
The third is cutting the Day 9 buffer and gambling the flight home on the Andaman Sea. The fourth is choosing a Bukit Lawang guide on price alone, since unlicensed guides and anyone who feeds the orangutans are the ones to avoid. The fifth is arriving without cash: guides, ferries, scooters, boat hops and most guesthouses on this route run on rupiah in hand.
## What to cut, adapt or upgrade
**Cut:** Day 5 on the lake if you want a third night on Pulau Weh. The reef is the part first-timers wish they had more of.
**Adapt:** if you would rather not fly at all, drop Pulau Weh and give the freed days to Berastagi between the jungle and the lake. The [[7-day Bukit Lawang and Lake Toba itinerary|/trips/7-days-bukit-lawang-lake-toba-orangutans]] shows how that half works, and the 15-day route does it slowly.
**Upgrade:** a private car instead of the Day 3 minibus, which saves an hour or two and lets you stop at Sipiso-piso properly. Spend money on a better lakefront room and a proper cabin on Weh before you spend it on faster transfers; the road and the ferry timetable are fixed for everybody.
**Do not add:** West Sumatra, Kerinci or the Mentawai Islands. They are a flight and several days away, and they belong to a second trip.
## Before you build this trip
**Visa:** most visitors enter on the visa on arrival or e-VOA, listed at IDR 500,000 on the official Indonesian e-visa portal, valid for 30 days and extendable once. Indonesia's immigration directorate has proposed raising the e-VOA to IDR 750,000, with no effective date announced at the time of writing. See our [[Indonesia visa guide|/visa-guide]] and check the latest official guidance before you travel.
**Money:** cash, in rupiah, drawn at Kualanamu and topped up in Banda Aceh. ATMs exist in Bukit Lawang and Tuk Tuk but are not something to rely on.
**Health:** parts of rural Sumatra, including the jungle around Bukit Lawang, carry malaria risk unlike Bali, so talk to a travel-health clinic four to six weeks before you leave. There is no hyperbaric chamber on Pulau Weh; divers should keep conservative profiles, and the Day 9 buffer doubles as the surface interval before flying.
**Packing:** trekking shoes with grip, leech socks for the wet months, a light rain jacket, a dry bag for the river tubing, a rash vest and your own mask for Weh. Aceh is conservative, so cover shoulders and knees away from the beach.
**When to go:** May to September is the drier window for the jungle and the calmest for the Weh crossing. Our [[best time to visit Sumatra guide|/destinations/sumatra/best-time-to-visit-sumatra]] goes month by month.
## Final verdict
Do this trip if you want your first Sumatra to show you three different countries' worth of landscape in ten days, and if a long minibus day and a dry province read as part of the deal rather than a tax on it. The reward is real: an orangutan in the trees above you, a swim in a volcano, and a reef you walk into from the sand, for a fraction of what ten days in Bali costs. If a cancelled ferry would ruin the trip, give Sumatra fifteen days and skip the flight. If you have ten and want all three, this is the route.
## Related itineraries
With more time, the [[15-day Sumatra overland itinerary|/trips/15-days-sumatra]] adds Berastagi and slows the lake down. Couples who want the quiet version of Toba and Weh should look at the [[11-day Sumatra honeymoon|/trips/11-days-sumatra-honeymoon-lake-toba-pulau-weh]], and anyone who falls for the reef has the [[7-day Pulau Weh diving and beach week|/trips/7-days-pulau-weh-sabang-diving-beach]] to come back to.
'''
FAQ=[
("Is 10 days enough for Sumatra?","Ten days is enough for a first trip to North Sumatra: two nights in Bukit Lawang for the orangutans, three on Lake Toba and two on Pulau Weh, with a flight from Medan to Banda Aceh in between. It is not enough to add Berastagi, West Sumatra or the Mentawai Islands without dropping one of the three."),
("How do you get from Bukit Lawang to Lake Toba?","By road, in one long day. The usual way is a shared tourist minibus booked through your Bukit Lawang guesthouse, which travellers report takes seven to eight hours to Parapat, often with a stop at the Sipiso-piso waterfall. From Parapat the passenger ferry crosses to Tuk Tuk on Samosir in 30 to 45 minutes for about IDR 15,000 to 25,000."),
("Can you combine Lake Toba and Pulau Weh in one trip?","Yes, with one flight. Take the first ferry off Samosir, drive about four hours to Kualanamu airport and fly Medan to Banda Aceh on an afternoon departure, then take the ferry to Pulau Weh the next morning. Do not try a morning flight on the same day; no ferry leaves Samosir early enough."),
("How much does the Bukit Lawang orangutan trek cost?","As a working estimate, a full-day trek with a licensed guide arranged through your guesthouse costs about $30 to $60 per person including the Gunung Leuser park permit, which guide websites quote at around IDR 150,000 for foreign visitors in 2026. Pre-booked online tours cost more. Fees change, so confirm on arrival."),
("How do you get from Banda Aceh to Pulau Weh?","From Ulee Lheue harbour in Banda Aceh. The Express Bahari fast ferry reaches Balohan on Pulau Weh in about 45 minutes for roughly IDR 100,000, with departures broadly at 08:00, 10:00 and 16:30 per the operator's tariff. The slow ASDP ferry takes about two hours for IDR 35,000 in economy. Tickets are sold at the harbour, not online."),
("Do you need a guide to see orangutans in Bukit Lawang?","Yes. Every trek inside Gunung Leuser National Park must be led by a licensed guide, and your guesthouse is the normal place to arrange one. Choose a guide who keeps distance and never feeds the animals; anyone who offers to lure orangutans with food is the wrong guide."),
("Is Sumatra expensive to travel?","No. As a working estimate, ten days on this route costs roughly $650 to $1,100 per person excluding international flights. The domestic flight, the private cars and the orangutan trek are the fixed costs; guesthouse rooms, food, scooters and boats are low by Indonesian standards, and Aceh is cheaper still."),
("What is the best time of year for a first trip to Sumatra?","May to September, as a working guide. It is the drier window for jungle trekking in Gunung Leuser and the calmest period for the Pulau Weh ferry. Sumatra is wetter year-round than Bali, so expect some rain in any month and pack for it."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"sft-{p}{cnt[0]}"
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
title="10 Days in Sumatra for First-Timers: Orangutans, Lake Toba and Pulau Weh"
intro="Most Sumatra itineraries open with a fifteen-day loop, which is why so many first-time visitors never go. This ten-day plan is the shorter answer: two nights with the orangutans at Bukit Lawang, three on Lake Toba, then a flight to Banda Aceh and two nights on the reef at Pulau Weh, with one long road day, every transfer costed as a working estimate, and a buffer night that protects the flight home."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="10 Days in Sumatra for First-Timers: Jungle, Lake and Reef",
 metaDescription="A 10-day Sumatra itinerary for a first visit: Bukit Lawang orangutans, Lake Toba and the Pulau Weh reef, with every transfer, the costs and what to cut.",
 focusKeyword="10 days in Sumatra",intro=intro,
 route="Medan (Kualanamu), Bukit Lawang (2 nights), Parapat and ferry to Tuk Tuk on Samosir (3 nights), Medan to Banda Aceh flight (1 night), ferry to Pulau Weh (2 nights), Banda Aceh buffer night, fly out",
 routeSummary="Medan → Bukit Lawang → Lake Toba (Samosir) → Medan → Banda Aceh → Pulau Weh → Banda Aceh",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to September",logisticsComplexity="complex",
 destinationPrimary="sumatra",travelStylePrimary="first_time_indonesia",travelStyleSecondary=["wildlife_nature","beach_islands"],
 travellerTypes=["couples","friends","solo_travellers"],tripLengthBucket="ten_days",tripLengthDays=10,vibe="balanced",
 experienceTags=["wildlife","orangutans","lake","snorkeling","overland_route","ferry"],
 primaryAffiliatePartner="booking",secondaryAffiliatePartners=["viator","12go","airalo"],
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
