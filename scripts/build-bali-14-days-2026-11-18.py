# 2026-11-18 generator run: first Bali-only two-week itinerary.
# The site had no 14-day Bali-only route. Facts read 2026-11-18:
#  - Bali tourist levy IDR 150,000 (lovebali.baliprov.go.id, Perda Bali 2/2025).
#  - e-VOA IDR 500,000 for 30 days (reported by visasnews.com, official portal not readable).
#  - Ubud Monkey Forest IDR 130,000 foreign adult from 1 Apr 2026 (bali.live).
#  - Tirta Empul IDR 50,000 (indonesia.travel) to 75,000 (baliholidaysecrets, Oct 2026).
#  - Tirta Gangga IDR 90,000 foreign adult (baliuntold, Feb 2026).
#  - Ulun Danu Beratan IDR 75,000 -> 100,000 from 1 Jul 2026 (heybali, June 2026).
#  - Uluwatu temple IDR 50,000-60,000; Kecak about IDR 150,000 (kura2bus 2025, heybali Jan 2026).
#  - Drive times: working estimates, consistent with sibling Bali articles.
#  Links browser-checked 2026-11-18: Klook 800 car charter, 22005 Batur jeep (from US$23.19),
#  17260 Ubud cooking class (5h), DPS airport transfers, 16518 Tulamben Liberty dive (10h);
#  Viator Kecak ticket d35681-349605P2 (1h), Ubud day tour d5467-142948P6 (8-10h, pickup);
#  Booking Ubud/Sidemen/Amed/Munduk/Uluwatu searches resolve; Airalo redirect live.
#   python3 scripts/build-bali-14-days-2026-11-18.py
import json,re,datetime,urllib.parse
SLUG="14-days-bali-ubud-sidemen-amed-munduk-uluwatu"
PFX="bl14"
BK="https://www.booking.com/searchresults.html?ss=%s&group_adults=2&group_children=0&no_rooms=1"
def KL(path):
    return "https://klook.tpx.lu/QYeSR2G9?u="+urllib.parse.quote("https://www.klook.com/"+path,safe="")
VI="?pid=P00303362&mcid=42383&medium=link&campaign=bali-14-days"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="klook",placeholderId="KLOOK_BALI_AIRPORT_TRANSFER",affiliateUrl=KL("en-US/airport-transfers/service/dps-ngurah-rai-bali-international-airport/"),publicUrl="https://www.klook.com/en-US/airport-transfers/service/dps-ngurah-rai-bali-international-airport/",anchorText="Bali airport transfer on Klook",experienceCategory="transport"),
 dict(partner="klook",placeholderId="KLOOK_BALI_CAR_CHARTER",affiliateUrl=KL("en-US/activity/800-private-car-charter-bali/"),publicUrl="https://www.klook.com/en-US/activity/800-private-car-charter-bali/",anchorText="Bali private car charter on Klook",experienceCategory="transport"),
 dict(partner="klook",placeholderId="KLOOK_MOUNT_BATUR_SUNRISE",affiliateUrl=KL("en-US/activity/22005-mount-batur-sunrise-experience-4wd-jeep-bali/"),publicUrl="https://www.klook.com/en-US/activity/22005-mount-batur-sunrise-experience-4wd-jeep-bali/",anchorText="Mount Batur sunrise by 4WD jeep on Klook",experienceCategory="tour"),
 dict(partner="klook",placeholderId="KLOOK_UBUD_COOKING_CLASS",affiliateUrl=KL("activity/17260-cooking-class-ubud-bali/"),publicUrl="https://www.klook.com/activity/17260-cooking-class-ubud-bali/",anchorText="Ubud cooking class on Klook",experienceCategory="tour"),
 dict(partner="klook",placeholderId="KLOOK_TULAMBEN_LIBERTY",affiliateUrl=KL("en-US/activity/16518-uss-liberty-scuba-dive-bali/"),publicUrl="https://www.klook.com/en-US/activity/16518-uss-liberty-scuba-dive-bali/",anchorText="Liberty wreck dive trip on Klook",experienceCategory="tour"),
 dict(partner="viator",placeholderId="VIATOR_UBUD_HIGHLIGHTS",affiliateUrl="https://www.viator.com/tours/Ubud/Ubud-Monkey-Forest-Jungle-Swing-Rice-Terrace-and-Water-Temple/d5467-142948P6"+VI,publicUrl="https://www.viator.com/tours/Ubud/Ubud-Monkey-Forest-Jungle-Swing-Rice-Terrace-and-Water-Temple/d5467-142948P6",anchorText="Ubud rice terrace and water temple day tour on Viator",experienceCategory="tour"),
 dict(partner="viator",placeholderId="VIATOR_ULUWATU_KECAK",affiliateUrl="https://www.viator.com/tours/Jimbaran/Skip-the-Line-Kecak-and-Fire-Dance-Ticket-at-Uluwatu-Temple/d35681-349605P2"+VI,publicUrl="https://www.viator.com/tours/Jimbaran/Skip-the-Line-Kecak-and-Fire-Dance-Ticket-at-Uluwatu-Temple/d35681-349605P2",anchorText="Uluwatu Kecak fire dance ticket on Viator",experienceCategory="tour"),
 dict(partner="booking",placeholderId="BOOKING_UBUD",affiliateUrl=BK%"Ubud%2C+Bali%2C+Indonesia",publicUrl=BK%"Ubud%2C+Bali%2C+Indonesia",anchorText="Ubud hotels on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_SIDEMEN",affiliateUrl=BK%"Sidemen%2C+Indonesia",publicUrl=BK%"Sidemen%2C+Indonesia",anchorText="Sidemen stays on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_AMED",affiliateUrl=BK%"Amed%2C+Indonesia",publicUrl=BK%"Amed%2C+Indonesia",anchorText="Amed stays on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_MUNDUK",affiliateUrl=BK%"Munduk%2C+Indonesia",publicUrl=BK%"Munduk%2C+Indonesia",anchorText="Munduk stays on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_ULUWATU",affiliateUrl=BK%"Uluwatu%2C+Bali%2C+Indonesia",publicUrl=BK%"Uluwatu%2C+Bali%2C+Indonesia",anchorText="Uluwatu hotels on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"{PFX}-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC="""
## Is 14 days in Bali too long?
No. Two weeks is the length at which Bali stops being a checklist. You can give Ubud four nights, sleep in the rice valleys of Sidemen, snorkel the east coast at Amed, cool off in the highlands at Munduk and still finish with three slow days on the cliffs of Uluwatu, without a single day spent only in a car.
Most Bali itineraries are built for a week, and a week forces a choice: Ubud and the south, and the rest of the island seen through a car window on a day trip. Two weeks removes that choice, but only if you use the extra days to move, not to add more day trips from the same hotel. This plan uses five bases in a loop around the island. The moves out of Ubud and Sidemen are short; the two from Amed to Munduk and from Munduk to Uluwatu are long, and we flag them honestly. The trip ends 30 to 45 minutes from the airport.
## Who this trip is for, and who it is not
This route suits couples, friends and solo travellers on a first or second visit who want the whole island at a steady pace: temples and rice terraces, one volcano sunrise, a reef you can reach from the beach, cool mountain air and a few real beach days at the end.
It is not for travellers who want nightlife every evening: Sidemen, Amed and Munduk go quiet after dinner. It is not a diving trip either, though it touches the best shore diving on the island; divers should read our [[7-day Bali diving route through Tulamben, Amed and Menjangan|/trips/7-days-bali-diving-tulamben-amed-menjangan]]. If you have only a week, start with [[7 days in Bali for first-timers|/trips/7-days-bali-first-timers]], and if you want other islands in the same fortnight, read [[10 days in Bali, Lombok and the Gili Islands|/trips/10-days-bali-lombok-gili-islands]].
## Trip at a glance
**Duration:** 14 days, 13 nights.
**Route:** Ubud (4 nights), Sidemen (2), Amed (2), Munduk (2), Uluwatu (3).
**Pace:** steady. Four changes of hotel: two short drives in the east and two long ones across the north and back south.
**Best for:** couples, friends, solo travellers, first or second visits to Bali.
**Best time:** April to October is the dry season. The wet months work too, with more afternoon rain and fewer clear volcano mornings.
**Budget:** moderate. A car with a driver on moving days is the main transport cost; entry fees are small but add up.
**Logistics:** easy to moderate. Two long drives, Amed to Munduk and Munduk to Uluwatu, and one pre-dawn start for Mount Batur.
## Why this route makes sense
The loop runs inland first, then east, north, and finally south. Ubud comes first because jet lag and a long first drive do not mix, and the drive from the airport, about 1.5 to 2.5 hours depending on traffic, is the only move on arrival day. Sidemen and Amed sit close together in the east, so moving between them is a half-day drive with a stop at Tirta Gangga on the way.
The north is the awkward part. Amed to Munduk is the longest leg, and there is no shortcut, but doing it once in a loop is far better than two return trips from the south. Uluwatu goes last for a practical reason: it is 30 to 45 minutes from Ngurah Rai airport, so the beach days double as a buffer before your flight.
## How many days do you need in Bali?
Seven days covers Ubud and one beach area. Ten adds the east or the north, but not both. Fourteen days lets you see the centre, the east, the highlands and the south of Bali without day trips of more than a few hours, with real rest days built in, which is why this plan uses the full fortnight.
^^ Bali by trip length, as a working judgement
| Days | What fits | What you give up | Read |
| 5 days | Ubud, then one beach base in the south | The east, the north, any slack | 5 days: Ubud, Canggu and Uluwatu |
| 7 days | Ubud, a day trip to Nusa Penida, Canggu, Uluwatu | Sidemen, Amed, Munduk | 7 days in Bali for first-timers |
| 10 days | Ubud, the east (Sidemen and Amed) or the north (Munduk), and the south | One of the two regions | This plan without Sidemen, or without Munduk |
| 14 days | Ubud, Sidemen, Amed, Munduk and Uluwatu, with rest days | Other islands such as Lombok or the Gilis | This plan |
## Day 1: Arrive and settle in Ubud
**Morning.** Land at Ngurah Rai International Airport. If you have not done it already, pay the Bali tourist levy, which the official Love Bali portal lists at IDR 150,000 per person, and keep the voucher on your phone.
**Afternoon.** Drive to Ubud, about 1.5 to 2.5 hours depending on traffic, with the late afternoon the slowest. A pre-booked [[Bali airport transfer on Klook|KLOOK_BALI_AIRPORT_TRANSFER]] saves a negotiation at arrivals after a long flight.
**Evening.** Walk the main streets around the palace and eat early. Keep the first night simple.
**Base:** Ubud, 4 nights. Compare [[Ubud hotels on Booking.com|BOOKING_UBUD]]. Stay walking distance from the centre, or just outside it if you want rice fields from the room and do not mind short rides.
**Booking logic:** set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly. Ride-hailing apps and WhatsApp, which drivers and guesthouses use for everything, both need data.
**Travel note:** most nationalities enter on the e-VOA, reported at IDR 500,000 for 30 days. Visa rules and fees change, so check the latest official guidance before you travel.
## Day 2: Ubud on foot
**Morning.** Walk the Campuhan Ridge path early, before the heat, then go to the Sacred Monkey Forest Sanctuary. Bali news reports put the foreign adult ticket at IDR 130,000 from April 2026. Keep sunglasses, food and loose bags out of reach of the macaques.
**Afternoon.** Learn to cook a Balinese meal. The [[Ubud cooking class on Klook|KLOOK_UBUD_COOKING_CLASS]] runs about five hours with hotel pick-up, so it fills the afternoon and replaces dinner.
**Evening.** Rest. You have an early start in two days.
**Booking logic:** book the cooking class a day or two ahead in the dry season. Everything else today needs no booking.
**Travel note:** cover shoulders and knees for any temple, and carry a sarong. Most temples rent or lend one at the gate.
## Day 3: Water temple and rice terraces
**Morning.** Drive north to Tirta Empul, the spring temple where Balinese come to bathe in the purification pools. Sources in 2026 put the adult entry between IDR 50,000 and IDR 75,000, so treat it as a working estimate. Arrive at opening to share the pools with worshippers rather than tour groups.
**Afternoon.** Continue to the Tegallalang rice terraces and walk down into them rather than photographing from the road. Then go back to Ubud for a late lunch.
**Evening.** A free evening in town.
**Booking logic:** a driver for the day is easiest. If you prefer a guide who handles everything, the [[Ubud rice terrace and water temple day tour on Viator|VIATOR_UBUD_HIGHLIGHTS]] runs 8 to 10 hours with pick-up and covers the monkey forest, a rice terrace and a water temple; check which sites are included on the day you book.
**Travel note:** if you plan to enter the water at Tirta Empul, bring a change of clothes and follow the order of the spouts that the temple staff show you.
## Day 4: Mount Batur at sunrise
**Morning.** This is the trip's one pre-dawn start. Pick-ups from Ubud leave in the small hours to reach the Batur caldera before first light. You can hike to the summit with a guide, or skip the climb on the [[Mount Batur sunrise by 4WD jeep on Klook|KLOOK_MOUNT_BATUR_SUNRISE]], which listed a price from about US$23 per person when we checked in November 2026 and a duration of 8.5 to 10.5 hours including the black lava fields after sunrise.
**Afternoon.** Back in Ubud around midday or early afternoon. Sleep.
**Evening.** Pack. Tomorrow you start the loop.
**Booking logic:** book Batur for your second or third night in Ubud, never the first, and keep a spare morning in case cloud cancels the view.
**Travel note:** it is cold at the top before dawn. Bring a warm layer even in the dry season.
## Day 5: Ubud to Sidemen
**Morning.** Drive east to Sidemen, about 1.5 to 2 hours as a working estimate. Book a [[Bali private car charter on Klook|KLOOK_BALI_CAR_CHARTER]], or ask your Ubud hotel for a driver, for every moving day of this trip.
**Afternoon.** Walk the rice terraces of the valley. The paths run between fields and small villages, and a local guide will find routes you would miss alone.
**Evening.** Dinner at your guesthouse. Sidemen has few restaurants, and most visitors eat where they sleep.
**Base:** Sidemen, 2 nights. Compare [[Sidemen stays on Booking.com|BOOKING_SIDEMEN]]. Choose a room that faces Mount Agung across the valley.
**Booking logic:** stays in Sidemen are small and few, so book them as early as Ubud.
**Travel note:** a car is the only practical way in and out. Arrange tomorrow's driver tonight if you want to go out.
## Day 6: A slow day in Sidemen
**Morning.** Watch the light come over Agung, then walk again, or visit a songket weaving workshop in the village.
**Afternoon.** Rest. The point of Sidemen is the absence of a schedule after four busy days.
**Evening.** Early night, or a massage at the guesthouse.
**Booking logic:** nothing to book. If you want a guided walk, ask your guesthouse the evening before.
**Travel note:** cash is useful here. Card machines are rarer outside Ubud and the south.
## Day 7: Sidemen to Amed via Tirta Gangga
**Morning.** Drive towards the coast and stop at Tirta Gangga, the former royal water garden with its stepping stones and fish ponds. A guide updated in 2026 lists IDR 90,000 for foreign adults; bring cash.
**Afternoon.** Continue the short way down to Amed and snorkel at Jemeluk Bay, where coral starts a few metres from the beach.
**Evening.** Sunset over the strip of fishing villages, with Agung behind you.
**Base:** Amed, 2 nights. Compare [[Amed stays on Booking.com|BOOKING_AMED]]. Jemeluk and the villages around it are the most convenient for snorkelling from the shore.
**Booking logic:** rent snorkel gear at your hotel or a dive shop. No advance booking is needed.
**Travel note:** the coast road is narrow and winding, so allow more time than the distance suggests.
## Day 8: The Liberty wreck at Tulamben
**Morning.** Drive 25 to 30 minutes north to Tulamben for the USAT Liberty, a Second World War cargo ship that lies close to the beach. Snorkellers see its upper parts in shallow water; divers swim through the hull.
**Afternoon.** Back in Amed for a lazy afternoon in the water or on the black sand.
**Evening.** Grilled fish in one of the beach warungs.
**Booking logic:** from Amed, a local dive centre is the simplest way to dive the wreck. If you want to book from home, the [[Liberty wreck dive trip on Klook|KLOOK_TULAMBEN_LIBERTY]] includes two dives and hotel pick-up over about 10 hours; it is for certified divers and built for people staying in the south.
**Travel note:** early morning is the calmest and least crowded time at the wreck.
## Day 9: Amed to Munduk, the long drive
**Morning.** Leave right after breakfast. This is the longest drive of the trip, along the north coast and up into the hills, and as a working estimate it takes around four hours or more depending on stops and traffic.
**Afternoon.** Break the journey on the north coast for lunch, then climb into the highlands. You arrive in Munduk to cool air and clove plantations.
**Evening.** Bring a jumper. Munduk sits high enough to feel cold after dark.
**Base:** Munduk, 2 nights. Compare [[Munduk stays on Booking.com|BOOKING_MUNDUK]].
**Booking logic:** this is the day a good driver matters most. Book the car the day before and agree the stops in advance.
**Travel note:** if long drives are hard for you, swap Munduk for a third night in Amed and a fourth in Uluwatu, and accept that you will miss the highlands.
## Day 10: Waterfalls and the lake temple
**Morning.** Walk the waterfall trails around Munduk. Several falls sit on one network of paths, each with a small cash fee at the trailhead.
**Afternoon.** Drive down to Ulun Danu Beratan, a short way along the lakes, the temple that seems to float on Lake Beratan. A Bali news site reported the foreign adult ticket rising from IDR 75,000 to IDR 100,000 from 1 July 2026, so budget around IDR 100,000 and check at the gate.
**Evening.** A quiet dinner looking over the lakes.
**Booking logic:** nothing to book. Go to the lake temple in the afternoon after the morning tour buses leave, or early before they arrive.
**Travel note:** the trails are steep and slippery after rain. Wear shoes with grip, not sandals.
## Day 11: Munduk to Uluwatu
**Morning.** Drive south to the Bukit peninsula, about 3 to 4 hours as a working estimate. Traffic near Denpasar decides the time.
**Afternoon.** Check in and go straight to the pool or the beach.
**Evening.** Sunset from one of the cliff-top bars.
**Base:** Uluwatu, 3 nights. Compare [[Uluwatu hotels on Booking.com|BOOKING_ULUWATU]]. The cliffs give you the views; Bingin and Padang Padang give you the beaches.
**Booking logic:** book your final hotel last but not late. Uluwatu fills in July and August.
**Travel note:** the beaches here sit below the cliffs and many are reached by long stairways. Check how close your hotel is to one.
## Day 12: Beaches, then the Kecak at Uluwatu temple
**Morning.** Swim at Padang Padang or Bingin while the tide suits it. Surfers will want an early session.
**Afternoon.** Go to Uluwatu temple in the late afternoon. Guides give the entry at about IDR 50,000 to 60,000 per adult.
**Evening.** Watch the Kecak fire dance on the cliff at sunset. The ticket is sold separately from temple entry, at about IDR 150,000 per adult on site as a working estimate. A [[Uluwatu Kecak fire dance ticket on Viator|VIATOR_ULUWATU_KECAK]] holds a seat in advance.
**Booking logic:** buy the Kecak ticket ahead in the dry season, and arrive early. The show is popular and the good seats go first.
**Travel note:** the temple monkeys are bolder than Ubud's and take glasses and phones. Keep both in a closed bag.
## Day 13: A free day
**Morning.** Nothing planned on purpose. This is the buffer day for anything that slipped: a cloudy Batur morning, a wreck dive in rough sea, a long lunch.
**Afternoon.** Spa, surf lesson, or the beach.
**Evening.** Last dinner in Bali. Jimbaran's seafood grills on the beach are a short drive north.
**Booking logic:** confirm your airport transfer for tomorrow.
**Travel note:** check your flight time against traffic. Afternoon departures need an earlier start than the distance suggests.
## Day 14: Fly out
**Morning.** Breakfast with the sea view, and a last swim if your flight allows.
**Afternoon.** The airport is 30 to 45 minutes away in normal traffic. Aim to arrive about three hours before an international departure.
**Booking logic:** use the same driver or transfer service as on Day 1 if you were happy with them.
**Travel note:** the roads towards the airport slow down in the late afternoon, so leave a generous margin for an evening flight.
## Which Bali base is best for each part of the trip?
Use Ubud for culture and day trips, Sidemen for rice fields and quiet, Amed for snorkelling from the shore, Munduk for cool air and waterfalls, and Uluwatu for beaches and an easy run to the airport. Each base has one job in this plan, which is why none of them gets fewer than two nights.
^^ The five bases compared, as a working guide
| Base | Nights | Best for | Drive in | Watch out for |
| Ubud | 4 | Temples, rice terraces, food, Mount Batur | 1.5 to 2.5 hours from the airport | Crowds and traffic in the centre |
| Sidemen | 2 | Rice-field walks, views of Agung, rest | 1.5 to 2 hours from Ubud | Few restaurants, car needed |
| Amed | 2 | Snorkelling from the beach, the Liberty wreck | About 1 hour from Sidemen, with Tirta Gangga on the way | Narrow coast road, black sand |
| Munduk | 2 | Waterfalls, lake temples, cool nights | Around 4 hours or more from Amed | The long drive, rain on the trails |
| Uluwatu | 3 | Beaches, surf, the Kecak, the airport | 3 to 4 hours from Munduk | Stairways down to the beaches |
## How do you get around Bali for two weeks?
Hire a car with a driver for each moving day and for longer outings, and use ride-hailing apps for short hops in Ubud and Uluwatu. Public transport does not reach Sidemen, Amed or Munduk in a useful way, and driving yourself on Bali's roads is not worth the stress for most visitors.
As a working estimate, a full day with a private driver costs around IDR 700,000 to 900,000. Over this route you need one on Days 1, 3, 5, 7, 8 if you go to Tulamben, 9, 10 and 11, and for the airport on Day 14. Agree the price, the hours and the stops before you set off, and ask whether fuel and parking are included.
## What to book early, and what to keep flexible
Book early: all five hotels in the dry season, above all Sidemen and Munduk, which have few rooms. Book the Batur sunrise for Day 3 or Day 4, the Kecak ticket for Day 12 and the airport transfer for Day 1 before you fly.
Keep flexible: the Tirta Empul and Tegallalang day, the wreck dive or snorkel, the waterfall walks and every meal. Drivers can usually be booked a day ahead outside peak weeks.
## What mistakes do travellers make with two weeks in Bali?
The biggest mistake is staying in one or two hotels and doing day trips to everything, which turns a fortnight into hours in traffic. The others are booking Batur on the first night, ending the trip far from the airport, and underestimating the drive across the north.
Other mistakes: leaving no buffer day, so one cloudy morning or rough sea costs you a highlight; filling every afternoon after a pre-dawn start; and forgetting cash for entry fees in the east and the highlands, where card machines are less common.
## What to cut, adapt or upgrade
**Cut:** with ten days, drop Munduk and give the nights to Uluwatu, or drop Sidemen and Amed and go from Ubud to Munduk directly. With twelve days, cut Day 13 and one Ubud night.
**Adapt:** in the wet season, from about November to March, keep Batur as a maybe and add the spare morning to Ubud. Travelling with children, see our [[7 days in Bali with kids|/trips/7-days-bali-with-kids]], which uses fewer hotel moves.
**Upgrade:** replace the jeep with a guided summit hike on Batur, take a private guide for the Sidemen walks, or add two nights on Nusa Lembongan between Amed and Uluwatu if you are happy to shorten Munduk.
## Before you build this trip
Check four things before you book: the dry or wet season for your dates, Nyepi, the Balinese day of silence when the whole island and the airport close for 24 hours, the e-VOA and tourist levy rules on the official sites, and whether you are comfortable with two long drives. Then book the hotels in order, starting with the smallest places.
Our [[6-day Bali volcano and highlands route|/trips/6-days-bali-volcanoes-sidemen-batur-munduk]] covers Sidemen, Batur and Munduk in more depth if you want a shorter version of the middle of this trip.
## Final verdict
Two weeks is the right length for Bali if you use it to move around the island rather than to add day trips from one hotel. This loop gives Ubud the time it deserves, puts the quiet east and the cool highlands in the middle where they work as a rest, and ends on the beach close to the airport. The real cost is two long drives, across the north and back down to the coast, and they are worth it.
## Related itineraries
[[7 days in Bali for first-timers|/trips/7-days-bali-first-timers]]: the one-week version, with Ubud, Canggu and Uluwatu.
[[6 days in Bali's volcanoes and highlands|/trips/6-days-bali-volcanoes-sidemen-batur-munduk]]: Sidemen, Batur and Munduk in a shorter loop.
[[5 days in Bali: Ubud, Canggu and Uluwatu|/trips/5-days-bali-ubud-canggu-uluwatu]]: a short trip that compares Bali's main bases.
"""
FAQ=[
("Is 14 days in Bali too long?","No. Two weeks lets you see Ubud, the east around Sidemen and Amed, the highlands at Munduk and the beaches of Uluwatu with rest days built in. A week covers only Ubud and one beach area. If you would rather see other islands, give Bali about a week and add Lombok or the Gilis."),
("What is the best order for a two-week Bali itinerary?","Start inland in Ubud, then go east to Sidemen and Amed, cross the north to Munduk, and finish in Uluwatu. The loop avoids doubling back, keeps the moves in the east short, saves the two long drives for the north and the return south, and ends 30 to 45 minutes from the airport."),
("How much does it cost to enter Bali in 2026?","Most visitors pay the e-VOA, reported at IDR 500,000 for 30 days, plus the Bali tourist levy, which the official Love Bali portal lists at IDR 150,000 per person. Rules and fees can change, so check the official sites before you travel."),
("Do you need a driver in Bali for two weeks?","On moving days and for longer outings, yes. Public transport does not reach Sidemen, Amed or Munduk in a useful way. As a working estimate, a full day with a private driver costs around IDR 700,000 to 900,000. Ride-hailing apps work well for short trips in Ubud and Uluwatu."),
("Can you see Mount Batur sunrise without hiking?","Yes. Jeep tours drive up the caldera before dawn to a viewpoint and then visit the black lava fields, with no climb. If you want the summit, book a guided hike instead. Either way, plan it for your second or third night in Ubud."),
("Is Amed good for snorkelling?","Yes. At Jemeluk Bay the coral starts a few metres from the beach, and the USAT Liberty wreck at Tulamben, 25 to 30 minutes north, has parts shallow enough for snorkellers to see. Mornings are usually the calmest."),
("When is the best time for two weeks in Bali?","April to October is the dry season, with the best chance of clear volcano mornings and calm seas on the east coast. The wet season, from about November to March, is workable with more afternoon rain. Check your dates against Nyepi, when the island and the airport close for a day."),
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
title="14 Days in Bali: Ubud, Sidemen, Amed, Munduk and Uluwatu in One Loop"
intro="Two weeks is the length at which Bali stops being a checklist. This 14-day loop gives Ubud four nights, then moves through the rice valleys of Sidemen, the east-coast reefs at Amed and the cool highlands of Munduk before three slow days on the Uluwatu cliffs, close to the airport for the flight home."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Bali Itinerary 14 Days: Ubud, East Bali, Munduk, Uluwatu",
 metaDescription="A 14-day Bali itinerary in one loop: Ubud, Sidemen, Amed's reefs, the Munduk highlands and Uluwatu's beaches, with drive times and 2026 entry fees.",
 focusKeyword="Bali itinerary 14 days",intro=intro,
 route="Ubud (4 nights) with Tirta Empul, Tegallalang and a Mount Batur sunrise, Sidemen (2 nights), Amed (2 nights) via Tirta Gangga with the Liberty wreck at Tulamben, Munduk (2 nights) with waterfalls and Ulun Danu Beratan, then Uluwatu (3 nights) for beaches and the Kecak before the airport",
 routeSummary="Ubud → Sidemen → Amed → Munduk → Uluwatu",
 contentStatus="draft",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="April to October",logisticsComplexity="moderate",
 destinationPrimary="bali",travelStylePrimary="first_time_indonesia",travelStyleSecondary=["culture_temples","beach_islands"],
 travellerTypes=["couples","friends","solo_travellers"],tripLengthBucket="two_weeks",tripLengthDays=14,vibe="balanced",
 experienceTags=["temples","rice_terraces","volcano_sunrise","snorkeling","waterfalls","cultural_performance","private_drivers"],
 primaryAffiliatePartner="klook",secondaryAffiliatePartners=["viator","booking","airalo"],
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
