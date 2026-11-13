# PARTE 2, 2026-11-13 generator run: first Yogyakarta-only itinerary (no Bromo, no Dieng, no kids).
# Why: GSC 2026-10-14..11-10 has no clean no-page query, so the choice follows where Google
# already trusts the site. Yogyakarta is the best-ranking cluster we have:
# /trips/8-days-yogyakarta-central-java-with-kids sits at pos 3.5-5 on about 1,000 impressions and
# /destinations/java/borobudur-vs-prambanan at pos 5.9 with 10 clicks. Yet every Yogyakarta
# article bolts the city onto something else (Bromo, Dieng, East Java, kids), and the only
# plain-intent query we get, "jogja trip itinerary", lands on 7-days-yogyakarta-east-java at pos 87.
# Facts and sources (all read 2026-11-13):
#  - ticket.injourneydestination.id (official operator): Borobudur temple structure open daily
#    08:30-17:00; ticket includes structure access, wristband, upanat sandals, guide; the
#    grounds-only ticket (06:30-16:30) is listed "Only For Domestic Tourist". Borobudur Sunrise:
#    daily 04:00, IDR 1,000,000 per international tourist, 100 people/day, flashlight, sandals,
#    guide, breakfast at Manohara. Sunset also 100/day with dinner. Ramayana schedule: May-Oct
#    2026 and Nov-Dec 2026 open-air theatre Tue/Thu/Sat 19:30-21:00; Jan-Apr 2026 Saturday only,
#    17:30-18:30, amphitheatre; Roro Jonggrang on Fridays; rain after the Anoman Obong scene =
#    performance counted as complete, no refund; no VIP class Nov-Dec 2026.
#  - Foreign ticket prices could not be read off the official booking flow. Kept consistent with
#    siblings: about IDR 455,000 Borobudur, about IDR 400,000 Prambanan, both hedged.
#  - Ramayana seat prices: resellers list from IDR 150,000 (Class 1) to 450,000 (VIP).
#  - Kraton: guides give IDR 15,000-30,000 for foreigners, about 08:30-14:30, one source says
#    closed Mondays. Taman Sari: about IDR 25,000, 09:00-15:00.
#  - Airport train: about 35 min (Xpress) to 40 min (regular); fares reported Rp 20,000 regular,
#    Rp 50,000 Xpress in 2023-2025 Indonesian press; 50 trips/day per a Jan 2026 Railink release.
#  - Merapi jeeps: priced per jeep, max 4 passengers, 1.5h / 2h / 2.5h packages (Expedia listing
#    for a Kaliadem basecamp, Rp 540,000 for the 2h package); sibling range Rp 400-650k kept.
#  - Jomblang: one operator listing asks for IDR 700,000 cash per person for the cave ticket.
#  - Browser-checked live 2026-11-13: 12Go jakarta/yogyakarta (352 departures/day, fastest 1h10,
#    from about $11) and bali/yogyakarta (12/day, fastest 1h30); Klook 7882 car charter (6, 10 or
#    12 hours, up to 5 people), 6653 Borobudur climb + guided tour (5-6h), 15964 Merapi Kaliadem
#    private jeep (4-5h, hotel pickup), 89069 Prambanan sunset + Ramayana (8h, Class 1 seat,
#    buffet dinner); Viator 214335P5 Borobudur climb + Prambanan (8h, 698 reviews),
#    5594941P3 Ramayana performance ticket (1h30).
#  - DEAD: Viator d22560-105712P12 "Borobudur & Prambanan (with other local temples)" now shows
#    "Sorry, this product is unavailable". It is still linked from
#    8-days-yogyakarta-central-java-with-kids and 5-days-yogyakarta-bromo. Not edited in this
#    run; flagged in the report.
#   python3 scripts/build-yogyakarta-4-days-2026-11-13.py
import json,re,datetime
SLUG="4-days-yogyakarta-borobudur-prambanan-merapi"
PFX="yk4"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
def KL(path): 
    import urllib.parse
    return "https://klook.tpx.lu/QYeSR2G9?u="+urllib.parse.quote("https://www.klook.com/activity/"+path+"/",safe="")
VI="?pid=P00303362&mcid=42383&medium=link&campaign=yogyakarta-4-days"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_JAKARTA_YOGYAKARTA",affiliateUrl="https://12go.asia/en/travel/jakarta/yogyakarta?z=16022946",publicUrl="https://12go.asia/en/travel/jakarta/yogyakarta",anchorText="Jakarta to Yogyakarta trains and flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_BALI_YOGYAKARTA",affiliateUrl="https://12go.asia/en/travel/bali/yogyakarta?z=16022946",publicUrl="https://12go.asia/en/travel/bali/yogyakarta",anchorText="Bali to Yogyakarta flights on 12Go",experienceCategory="transport"),
 dict(partner="klook",placeholderId="KLOOK_YOGYAKARTA_CAR_CHARTER",affiliateUrl=KL("7882-private-car-charter-yogyakarta"),publicUrl="https://www.klook.com/activity/7882-private-car-charter-yogyakarta/",anchorText="Yogyakarta private car charter on Klook",experienceCategory="transport"),
 dict(partner="klook",placeholderId="KLOOK_BOROBUDUR_CLIMB_TOUR",affiliateUrl=KL("6653-borobudur-temple-tour-yogyakarta"),publicUrl="https://www.klook.com/activity/6653-borobudur-temple-tour-yogyakarta/",anchorText="Borobudur climb and guided tour on Klook",experienceCategory="tour"),
 dict(partner="klook",placeholderId="KLOOK_MERAPI_JEEP",affiliateUrl=KL("15964-merapi-kaliadem-private-jeep-yogyakarta"),publicUrl="https://www.klook.com/activity/15964-merapi-kaliadem-private-jeep-yogyakarta/",anchorText="Merapi Kaliadem private jeep tour on Klook",experienceCategory="tour"),
 dict(partner="klook",placeholderId="KLOOK_PRAMBANAN_RAMAYANA",affiliateUrl=KL("89069-yogyakarta-prambanan-sunset-tour-ramayana-ballet-performance-private-cultural-tour"),publicUrl="https://www.klook.com/activity/89069-yogyakarta-prambanan-sunset-tour-ramayana-ballet-performance-private-cultural-tour/",anchorText="Prambanan sunset and Ramayana ballet tour on Klook",experienceCategory="tour"),
 dict(partner="viator",placeholderId="VIATOR_BOROBUDUR_PRAMBANAN_DAY",affiliateUrl="https://www.viator.com/tours/Yogyakarta/Budha-Voyage/d22560-214335P5"+VI,publicUrl="https://www.viator.com/tours/Yogyakarta/Budha-Voyage/d22560-214335P5",anchorText="Borobudur climb and Prambanan day tour on Viator",experienceCategory="tour"),
 dict(partner="viator",placeholderId="VIATOR_RAMAYANA_TICKET",affiliateUrl="https://www.viator.com/tours/Yogyakarta/Ramayana-Ballet-Prambanan-Performance-Ticket/d22560-5594941P3"+VI,publicUrl="https://www.viator.com/tours/Yogyakarta/Ramayana-Ballet-Prambanan-Performance-Ticket/d22560-5594941P3",anchorText="Ramayana ballet ticket on Viator",experienceCategory="tour"),
 dict(partner="booking",placeholderId="BOOKING_YOGYAKARTA",affiliateUrl=BK%"Yogyakarta",publicUrl=BK%"Yogyakarta",anchorText="Yogyakarta hotels on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_BOROBUDUR",affiliateUrl=BK%"Borobudur",publicUrl=BK%"Borobudur",anchorText="stays near Borobudur on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"{PFX}-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC="""
## Is four days enough for Yogyakarta?
Yes. Four days in Yogyakarta covers Borobudur, Prambanan, a morning on the slopes of Mount Merapi and the sultan's city itself, at a pace that leaves your evenings free. Three days works if you merge the two temples into one long day. Anything longer should add Dieng, Solo or Mount Bromo.
Yogyakarta is the easiest place in Java to plan badly. The two big temples sit in opposite directions, the palace shuts in the early afternoon, the ballet runs only on certain nights, and the climb onto Borobudur is a timed ticket that sells out. Most short plans cram both temples and a volcano into one twelve-hour day and call the city done. This plan does the opposite. It gives each temple its own half day, puts Merapi where the morning light is, and lines the days up with the opening hours, so the only early alarm is the one you choose.
## Who this trip is for, and who it is not
This route is for couples, friends and solo travellers who want Java's two great temples without a tour-bus schedule, for first-time visitors adding a cultural stop to a Bali trip, and for anyone arriving by train from Jakarta with four clear days.
It is not for travellers who want volcano sunrises above all, since those are in East Java: read [[5 days in Yogyakarta and Mount Bromo|/trips/5-days-yogyakarta-bromo]] instead. Families should use our [[8-day Yogyakarta plan with kids|/trips/8-days-yogyakarta-central-java-with-kids]], which is slower and built around shorter drives. If you have six days, [[Central Java with Dieng and Solo|/trips/6-days-central-java-borobudur-dieng-solo]] is the better use of them.
## Trip at a glance
**Duration:** 4 days, 3 nights, all in Yogyakarta.
**Route:** Yogyakarta city, Borobudur, Mount Merapi, Prambanan, Yogyakarta city.
**Pace:** balanced. One half-day outing each day, with the city in between.
**Best for:** couples, friends, solo travellers, first visits to Java.
**Best time:** May to September is driest. The temples are open all year, and the wet season mostly costs you the Merapi view.
**Budget:** moderate. Temple tickets for foreign visitors are the big fixed cost, and almost everything else is cheap.
**Logistics:** easy. One hotel, no internal flights, and every outing is 40 to 90 minutes away.
## Why this route makes sense
Borobudur is about 90 minutes north-west of the city, Prambanan about 40 minutes east and Merapi about an hour north. Doing all three in a day means roughly five hours in a car. Splitting them puts Borobudur alone on Day 2, when you are fresh enough to enjoy the reliefs, and pairs Merapi with Prambanan on Day 3, since both lie on the northern and eastern side and the ballet next to Prambanan starts after dark.
The city bookends the trip for a practical reason. The Kraton, the sultan's palace, admits visitors only until the early afternoon, so it cannot be an arrival-day stop unless you land early. Day 4 morning suits it better, and the flight or train out can leave later.
## How many days do you need in Yogyakarta?
You need three full days at a minimum and four to do it comfortably. Two days covers Borobudur and Prambanan and nothing of the city. Three adds the palace quarter. Four adds Merapi and lets you see each temple at a sensible hour. Five or more only makes sense with a side trip.
^^ Yogyakarta by number of days. A working judgement, not a rule.
| Days | What fits | What you give up | Who it suits |
| 2 days | Borobudur and Prambanan in one long day, one evening in town | The Kraton, Merapi, any slack | A stopover between Jakarta and Bali |
| 3 days | Both temples on separate half days, the Kraton and Taman Sari | Merapi, the ballet unless the night lines up | Short trips with a fixed flight |
| 4 days | Everything in this plan | Dieng, Solo and the south coast | Most first visits |
| 5 to 6 days | This plan plus Dieng, Solo or the Gunungkidul caves and beaches | Nothing, but you are now touring Central Java | Slow travellers and repeat visitors |
## Day 1: Arrive, settle in, and walk the old centre
**Morning.** Arrive in Yogyakarta. From Jakarta, the train takes most of a day and a flight about 1 hour 10 minutes: compare [[Jakarta to Yogyakarta trains and flights on 12Go|TWELVEGO_JAKARTA_YOGYAKARTA]], which listed more than 300 departures a day across trains, buses and flights when we checked in November 2026. From Bali, [[Bali to Yogyakarta flights on 12Go|TWELVEGO_BALI_YOGYAKARTA]] showed a fastest time of 1 hour 30 minutes.
**Afternoon.** If you land at Yogyakarta International Airport, code YIA, take the airport train to Tugu station in the centre. Indonesian press reports put the ride at about 35 to 40 minutes, with fares of Rp 20,000 on the regular service and Rp 50,000 on the express in recent years. Check in, then walk Jalan Malioboro south towards the palace walls.
**Evening.** Eat gudeg, the city's sweet jackfruit stew, then go to Alun-Alun Kidul, the southern square, where families ride lit-up pedal cars around two old banyan trees.
**Base:** Yogyakarta, 3 nights. Compare [[Yogyakarta hotels on Booking.com|BOOKING_YOGYAKARTA]]. Stay near Malioboro for the station and the palace, or in Prawirotaman for quieter streets and more cafes.
**Booking logic:** book the Borobudur ticket for tomorrow before you arrive, and arrange the car tonight. Your hotel can do it, or you can reserve a [[Yogyakarta private car charter on Klook|KLOOK_YOGYAKARTA_CAR_CHARTER]] for 6, 10 or 12 hours, which seats up to five.
**Travel note:** set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly. Ride-hailing apps are the simplest way around town and they need data.
## Day 2: Borobudur, with the climb
**Morning.** Leave by 07:00 for Borobudur, about 90 minutes away. The official ticketing site lists the temple structure as open daily from 08:30 to 17:00, and its ticket includes access to the monument, a wristband, a guide and a pair of woven upanat sandals that you wear on the stone and keep. Take the first slot. The terraces have no shade, and by late morning the heat comes off the rock.
**Afternoon.** Stop at Mendut and Pawon, two small temples on the same ancient axis, a few minutes' drive away. Mendut holds a three-metre seated Buddha that many visitors find more moving than anything at the main site. Be back in the city by mid-afternoon and rest.
**Evening.** Free. Prawirotaman has the widest choice of restaurants, and Malioboro has street food and batik shops that stay open late.
**Booking logic:** the climb is the one ticket in this trip that can sell out. As a working estimate, 2026 guides put it at about IDR 455,000 for a foreign adult, with a daily cap reported at around 1,200 visitors. Buy it on the official site, or book a [[Borobudur climb and guided tour on Klook|KLOOK_BOROBUDUR_CLIMB_TOUR]] with hotel pick-up, and check that the option you choose includes access to the top. Fees change, so confirm the current price before you pay.
**Travel note:** dress with shoulders and knees covered. Large bags are not allowed on the structure, so leave them in the car.
## Do you need a ticket to climb Borobudur in 2026?
Yes. Climbing onto Borobudur needs a timed ticket for the temple structure, bought ahead, which includes a guide and special sandals. The official ticketing site lists the cheaper grounds-only ticket for domestic visitors only, so foreign travellers should plan on the structure ticket. Sunrise on the temple is a separate, pricier ticket limited to 100 people a day.
The sunrise ticket is the detail most guides have not caught up with. The official site lists it daily at 04:00 for IDR 1,000,000 per international visitor, with a torch, sandals, a guide and breakfast at the Manohara restaurant included. It means leaving Yogyakarta at about 02:30, or sleeping near the temple the night before. The cheaper way to see dawn is from Punthuk Setumbu, a hill a few kilometres west, where you watch the temple emerge from the mist at a distance and then drive down for the first climbing slot.
^^ Ways to see Borobudur compared. Prices are for foreign adults, from the official ticketing site where stated and otherwise working estimates. Confirm before booking.
| Option | Start | Price | What you get | Trade-off |
| Temple structure ticket | From 08:30, timed slots | About IDR 455,000, as a working estimate | The climb, a guide, upanat sandals | Sells out in peak months, hot by late morning |
| Sunrise on the temple | 04:00 | IDR 1,000,000, per the official site | Dawn on the monument, breakfast, 100 people a day | A 02:30 start from the city |
| Sunset on the temple | Late afternoon | Listed on the official site, price shown at booking | Evening light, dinner, 100 people a day | You return to the city late |
| Punthuk Setumbu hill | About 04:30 | A small local entry fee | The temple in mist from a distance | You are not on the temple itself |
## Day 3: Merapi by jeep, Prambanan at dusk, the ballet after dark
**Morning.** Drive about an hour north to Kaliadem, on the southern slope of Mount Merapi, and ride an open jeep across the 2010 eruption zone: a buried village, a bunker, a small museum in a ruined house. Go early, because cloud usually covers the summit by mid-morning. Jeeps are priced per vehicle and carry up to four. As a working estimate, routes run from about Rp 400,000 to Rp 650,000 depending on length. A [[Merapi Kaliadem private jeep tour on Klook|KLOOK_MERAPI_JEEP]] adds the hotel transfer.
**Afternoon.** Have lunch on the way down, then reach Prambanan by about 15:30. The 9th-century Hindu complex is compact, and two hours is enough for the three main shrines and the reliefs that tell the Ramayana. As a working estimate, budget about IDR 400,000 for a foreign adult. If you have the energy, walk north through the park to Candi Sewu, a Buddhist temple that most visitors skip.
**Evening.** Watch the Ramayana ballet on the open-air stage with the lit temple behind it. The official schedule lists it on Tuesdays, Thursdays and Saturdays from 19:30 to 21:00, from May to December 2026. Resellers list seats from about IDR 150,000. Book a [[Ramayana ballet ticket on Viator|VIATOR_RAMAYANA_TICKET]], or let a [[Prambanan sunset and Ramayana ballet tour on Klook|KLOOK_PRAMBANAN_RAMAYANA]] handle the car, the temple, dinner and a Class 1 seat in one booking.
**Booking logic:** fix this day first, on a Tuesday, Thursday or Saturday, and arrange the other days around it. From January to April 2026 the official schedule showed the Ramayana on Saturdays only, at an earlier hour, so check the calendar for your month.
**Travel note:** the official site says that if rain stops the show after the fire scene known as Anoman Obong, the performance counts as complete and tickets are not refunded. In the wet season, treat the ballet as a bonus.
## Borobudur and Prambanan in one day, or two?
Take two days if you have four in the city. One day for both is possible and popular, but it means about four hours of driving, a climb in the midday heat at one of them, and no time for the ballet. Combine them only on a two or three-day visit.
If you do combine them, start with Borobudur at the first slot and finish at Prambanan in the late afternoon. A [[Borobudur climb and Prambanan day tour on Viator|VIATOR_BOROBUDUR_PRAMBANAN_DAY]] runs about eight hours with pick-up, and the listing we checked in November 2026 offered a sunrise option. The old combined ticket for the two temples has been reported discontinued for foreign visitors, so plan on paying for each site separately. For how the two differ, and which to pick if you only have time for one, see [[Borobudur vs Prambanan|/destinations/java/borobudur-vs-prambanan]].
## Day 4: The Kraton, Taman Sari and out
**Morning.** Be at the Kraton when it opens, at about 08:30. The sultan's palace is still a working court, and the visit is a walk through open pavilions, heirloom collections and courtyards where retainers in batik sit on duty. Guides put the foreign ticket at IDR 15,000 to 30,000. Then walk ten minutes to Taman Sari, the 18th-century water palace, with its bathing pools and an underground mosque built as a ring of stairways. Entry is about IDR 25,000.
**Afternoon.** If your departure is late, take a car to Kotagede, the old silver-working quarter, for its workshops and its narrow lanes, or use the time for batik on Jalan Tirtodipuran. Then head to Tugu station or the airport train.
**Booking logic:** the Kraton admits visitors only until the early afternoon, earlier on Fridays, and at least one guide lists it as closed on Mondays. If Day 4 falls on a Monday, swap it with Day 1 or Day 2.
**Travel note:** allow more time than you think for YIA. The airport is about 45 kilometres west of the city, and the road takes far longer than the train at busy hours.
## How do you get around Yogyakarta without a tour?
Use a car with a driver for Borobudur and Merapi, the commuter train or a ride-hailing car for Prambanan, and ride-hailing apps or your feet inside the city. A full-day car costs far less than two tours for two people, and it lets you set the hours, which matters more here than anywhere else in Java.
The commuter line towards Solo stops at Brambanan station, roughly a kilometre and a half from the Prambanan gate, for a flat fare of IDR 8,000 according to 2026 timetable reports. Nothing as simple reaches Borobudur: public buses exist, but they take about two hours each way with a change, which costs you the first climbing slot.
^^ Getting to the main sights from central Yogyakarta, as working estimates
| Sight | Best way | Time each way | Cost | Notes |
| Borobudur | Car with driver | About 90 minutes | Charter by the hour, shared across the car | Leave by 07:00 for the first slot |
| Prambanan | Commuter train to Brambanan, or ride-hailing car | 20 to 40 minutes | IDR 8,000 by train | The ballet ends after the last convenient train, so book a car back |
| Merapi, Kaliadem | Car with driver, then a local jeep | About 60 minutes | Jeep priced per vehicle | Go early for a clear summit |
| Kraton and Taman Sari | On foot or by becak | 10 to 20 minutes from Malioboro | Small entry fees | Mornings only |
| YIA airport | Airport train from Tugu | 35 to 40 minutes | Reported at Rp 20,000 to 50,000 | Road transfers are slower at peak hours |
## What to book early, and what to keep flexible
Book early: the Borobudur structure ticket, above all for the first slot and in July, August and Indonesian school holidays. Book the ballet a few days ahead in the dry season, and your three hotel nights as soon as your dates are fixed, since one base only works if it is in the right part of town.
Keep flexible: the Merapi jeep, which is easy to arrange the day before and worth moving if the forecast is poor. Also the car, the Kraton, Taman Sari and every meal. If you arrive by train, book that ahead around public holidays, when Java's trains sell out.
## What mistakes do travellers make in Yogyakarta?
The most common mistake is assuming you can walk up Borobudur on the day. The climb is a capped, timed ticket. The others are booking both temples and Merapi as one day trip, saving the Kraton for an afternoon when it has already closed, and planning the ballet for a night with no show.
Other mistakes: staying only two nights, which turns the city into a car park between temples; visiting Merapi at midday, when the summit is in cloud; underestimating the distance to YIA; and expecting the temples to be cheap. Two foreign adults will spend well over IDR 1.5 million on the two main tickets alone, which is more than three nights in a good guesthouse.
## What to cut, adapt or upgrade
**Cut:** with three days, drop Merapi, visit Prambanan on the afternoon of Day 1 if you arrive by noon, and keep Borobudur and the Kraton as they are. With two days, combine the temples and accept that you have seen the monuments, not the city.
**Adapt:** swap the Day 4 afternoon for Jomblang, a vertical cave in Gunungkidul where a shaft of light reaches the floor around midday. Places are limited and one operator listing asks for about IDR 700,000 in cash per person, so reserve ahead and treat that figure as a working estimate. If volcano sunrises are the point of your trip, continue east on our [[7-day Yogyakarta and East Java route|/trips/7-days-yogyakarta-east-java]].
**Upgrade:** spend the night of Day 1 near the temple instead of in the city. Compare [[stays near Borobudur on Booking.com|BOOKING_BOROBUDUR]], take the 04:00 sunrise ticket on Day 2, and you will be on the monument at dawn with a hundred people instead of at 08:30 with several hundred.
## Before you build this trip
**Season:** May to September is the dry season and the busiest. From November to March expect afternoon rain: plan outings for the morning and keep the ballet optional.
**Merapi:** this is one of Indonesia's most active volcanoes, and its alert level and exclusion zone change. Jeep routes are adjusted to match. Check the current status with Indonesia's volcanology agency before you go, and follow the operators if they shorten the route.
**Money:** carry rupiah in small notes for palaces, parking, becak and food stalls. Temple tickets and hotels take cards.
**Getting in:** see our guides to [[Jakarta to Yogyakarta|/transport/jakarta-to-yogyakarta]] and [[Bali to Yogyakarta|/transport/bali-to-yogyakarta]] for the train and flight options in detail.
**Entry:** Indonesia's visa on arrival rules apply wherever you first land. Our [[visa guide|/visa-guide]] has the current costs, and you should check the latest official guidance before you fly.
## Final verdict: is Yogyakarta worth four days?
Yes. Four days is the length at which Yogyakarta stops being a temple transfer and becomes a city you have actually stayed in. You see Borobudur at a cool hour, Prambanan in good light, a volcano up close and a living royal court, with one hotel and no flights. Add days only to leave town.
## Related itineraries
To add a volcano sunrise, read [[5 days in Yogyakarta and Mount Bromo|/trips/5-days-yogyakarta-bromo]]. To stay in the region and go deeper, see [[6 days in Central Java with Dieng and Solo|/trips/6-days-central-java-borobudur-dieng-solo]]. For the whole island by rail, try [[10 days in Java by train|/trips/10-days-java-jakarta-bandung-yogyakarta-bromo]], and for more ideas in the city itself, our guide to [[things to do in Yogyakarta|/destinations/java/things-to-do-in-yogyakarta]].
"""
FAQ=[
("How many days do you need in Yogyakarta?","Four days is the comfortable length: one each for Borobudur and for Merapi with Prambanan, plus two half days in the city. Three days works if you drop Merapi. Two days covers both temples in one long day and very little else."),
("Can you still climb Borobudur?","Yes, with a timed ticket for the temple structure, bought in advance. The official ticketing site says it includes a guide and upanat sandals, and lists the structure as open daily from 08:30 to 17:00. Numbers are capped, so book before you travel in peak months."),
("How much are Borobudur and Prambanan tickets for foreigners?","As a working estimate, budget about IDR 455,000 for the Borobudur structure ticket and about IDR 400,000 for Prambanan per foreign adult. The official site lists a sunrise ticket on Borobudur at IDR 1,000,000. Prices change, so confirm on the official ticketing site before you pay."),
("What days is the Ramayana ballet at Prambanan?","The official 2026 schedule lists the open-air Ramayana on Tuesdays, Thursdays and Saturdays from 19:30 to 21:00, from May to December. From January to April it showed Saturdays only, at an earlier time. Schedules change without notice, so check your dates."),
("Can you visit Borobudur and Prambanan in one day?","Yes. Start at Borobudur for the first climbing slot and reach Prambanan in the late afternoon. Expect about four hours of driving and a full day. With four days in Yogyakarta, splitting them is more comfortable and leaves room for the ballet."),
("How do you get from Yogyakarta airport to the city?","Take the airport train from YIA to Tugu station in the centre. Indonesian press reports put the journey at about 35 to 40 minutes, with fares of Rp 20,000 to Rp 50,000 depending on the service. By road the 45 kilometres can take much longer at busy hours."),
("What is the best time to visit Yogyakarta?","May to September is the dry season, with the clearest mornings for Merapi and the most reliable evenings for the open-air ballet. It is also the busiest period. The temples are open all year, and the wet season is workable if you plan outings for the morning."),
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
title="4 Days in Yogyakarta: Borobudur, Prambanan, Merapi and the Sultan's City"
intro="Yogyakarta's two great temples sit in opposite directions, the palace closes in the early afternoon and the Borobudur climb is a timed ticket. This four-day plan keeps one hotel, gives each temple its own half day, adds a Merapi jeep morning and the Ramayana ballet, and lines every stop up with its opening hours."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="Yogyakarta Itinerary: 4 Days, Borobudur, Prambanan, Merapi",
 metaDescription="A 4-day Yogyakarta itinerary: the Borobudur climb ticket, Prambanan with the Ramayana ballet, a Merapi jeep morning and the Kraton, with 2026 prices.",
 focusKeyword="Yogyakarta itinerary",intro=intro,
 route="Yogyakarta (3 nights) with half-day outings to Borobudur, Mendut and Pawon, to Mount Merapi at Kaliadem and to Prambanan for the Ramayana ballet, then the Kraton and Taman Sari before departure",
 routeSummary="Yogyakarta → Borobudur → Merapi → Prambanan → Yogyakarta",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to September",logisticsComplexity="easy",
 destinationPrimary="java",travelStylePrimary="culture_temples",travelStyleSecondary=["first_time_indonesia","adventure_volcanoes"],
 travellerTypes=["couples","friends","solo_travellers"],tripLengthBucket="short_escape",tripLengthDays=4,vibe="balanced",
 experienceTags=["temples","royal_palaces","cultural_performance","volcano_jeep","train_travel","street_food"],
 primaryAffiliatePartner="klook",secondaryAffiliatePartners=["viator","12go","booking","airalo"],
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
