# PARTE 2, 2026-10-26 generator run: first family itinerary for East Java
# (Malang, Batu, Mount Bromo by day). GSC 2026-09-26..10-23 shows family intent
# for Java ("yogyakarta with kids", "plan an itinerary for yogyakarta for a family
# with kids", ~40 impr at pos 8-16, all landing on the Central Java kids page) and
# "east java" at 35 impr, pos 10.4, with no family page east of Yogyakarta.
# Matrix: java x families had one article, all in Central Java; Malang and Batu, 0.
# Builds the Sanity document, validates it, writes the snapshot to content/articles/.
#   python3 scripts/build-east-java-kids-2026-10-26.py
import json,re,datetime,urllib.parse
SLUG="7-days-east-java-malang-batu-bromo-with-kids"
V1="https://www.viator.com/tours/Malang/Mount-Bromo-Sunrise-trip/d50503-364403P3"
VQ="?pid=P00303362&mcid=42383&medium=link&campaign=east-java-kids-7-days"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_SURABAYA_MALANG",affiliateUrl="https://12go.asia/en/travel/surabaya/malang?z=16022946",publicUrl="https://12go.asia/en/travel/surabaya/malang",anchorText="Surabaya to Malang trains, shuttles and transfers on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_YOGYAKARTA_MALANG",affiliateUrl="https://12go.asia/en/travel/yogyakarta/malang?z=16022946",publicUrl="https://12go.asia/en/travel/yogyakarta/malang",anchorText="Yogyakarta to Malang trains on 12Go",experienceCategory="transport"),
 dict(partner="viator",placeholderId="VIATOR_BROMO_SUNRISE_MALANG",affiliateUrl=V1+VQ,publicUrl=V1,anchorText="private Bromo sunrise trip from Malang",experienceCategory="tour"),
 dict(partner="booking",placeholderId="BOOKING_BATU",affiliateUrl=BK%"Batu",publicUrl=BK%"Batu",anchorText="family stays in Batu on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_MALANG",affiliateUrl=BK%"Malang",publicUrl=BK%"Malang",anchorText="hotels in Malang on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"ej-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Is East Java good for a family trip with kids?
Yes, if you build it around Malang and Batu rather than the volcano. Batu is a cool highland town above Malang with a zoo, a transport museum, apple orchards and waterfalls a short drive apart, and Malang is a calm, walkable city. Mount Bromo then becomes one daytime outing, not a 1 a.m. alarm.
Most East Java itineraries are written for adults chasing sunrises: a midnight jeep, a cold viewpoint, Ijen's blue fire the next night. That is the wrong shape for children. This plan keeps Bromo, because the sea of sand and the crater are something kids remember, but it puts the volcano in the middle of a slow week with two bases and short drives, and it leaves a spare day in case the weather or the mountain says no.
## Who this trip is for, and who it is not
This seven-day plan is for families with children roughly five and up who want one week in Java with real variety and very little packing. You stay three nights in Batu and three in Malang, drives are mostly under an hour, and every day has one main outing with time for a pool afterwards.
It is not the plan for families who want beaches; Bali or the Gili Islands do that far better, see our [[7-day Bali itinerary with kids|/trips/7-days-bali-with-kids]]. It is also not for travellers set on Bromo at sunrise and Ijen by night in one push. That is a different, harder trip, covered in our [[4-day Bromo and Ijen volcano crossing|/trips/4-days-bromo-ijen-volcano-crossing]].
## Trip at a glance
**Duration:** 7 days, 6 nights: Batu 3 nights, Malang 3 nights.
**Route:** Malang or Surabaya airport, Batu, Malang, a day trip to Mount Bromo through Tumpang, then out from Malang or Surabaya.
**Pace:** relaxed. One main activity a day, one longer day for Bromo, one buffer day.
**Best for:** families with kids of about five to twelve, and grandparents travelling with them.
**Best time:** roughly May to October, the dry season, when Bromo is clearest. Batu and Bromo are cool all year, so pack layers whatever the month.
**Budget:** moderate. Theme-park tickets and a private jeep are the main costs; hotels and food in Malang and Batu are good value by Indonesian standards.
## Why this route makes sense
Batu and Malang sit about 20 kilometres apart, so the trip has two bases without a single long transfer between them. Batu goes first because its attractions are the reward for a long flight, and because the highland air helps everyone recover. Malang goes second because it is the gateway to Bromo through Tumpang, and the best place to wait out a cloudy day.
The other choice in this plan is to see Bromo by day. A sunrise trip from Malang usually leaves around midnight and returns about twelve hours later, which is hard on adults and harder on a seven-year-old. A private jeep that leaves after breakfast reaches the same crater, the same sea of sand and the same savanna, with fewer crowds and nobody in tears.
## Day 1: Arrive and go straight up to Batu
**Morning.** Fly into Malang's Abdul Rachman Saleh Airport (MLG), which has direct flights from Jakarta, or into Surabaya (SUB) if you are coming from abroad or from Bali. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you fly, because drivers and hotels confirm everything on WhatsApp.
**Afternoon.** Drive up to Batu, roughly an hour from Malang airport or two and a half to three hours from Surabaya by toll road, depending on traffic. If you arrive in Surabaya, compare [[Surabaya to Malang trains, shuttles and transfers on 12Go|TWELVEGO_SURABAYA_MALANG]] or book a private car for door-to-door with luggage.
**Evening.** Walk to the Alun-Alun Batu, the town square, where families gather in the evening, street food is cheap and there is a big Ferris wheel in the middle. Early night.
**Base:** Batu, 3 nights. Compare [[family stays in Batu on Booking.com|BOOKING_BATU]]; a hotel or villa with a heated or sun-warmed pool is worth paying for, because evenings are cool.
**Booking logic:** book the airport car in advance. Arriving with children and bags is not the moment to negotiate a fare at the curb.
**Travel note:** if you are coming from Yogyakarta instead, the train to Malang takes roughly six to nine hours depending on the service; compare [[Yogyakarta to Malang trains on 12Go|TWELVEGO_YOGYAKARTA_MALANG]] and pick a daytime departure.
## Day 2: Jatim Park 2 and the Batu Secret Zoo
**Morning.** Go to Jatim Park 2 at opening. The ticket covers the Batu Secret Zoo and the Museum Satwa, a natural history museum with dinosaur and animal replicas, and the zoo is large enough to fill a morning. Arrive early, before the heat of the day and the weekend crowds.
**Afternoon.** Finish the zoo, eat at the park, and go back to the hotel pool by mid-afternoon. Children who did the zoo properly will not want a second outing.
**Evening.** Dinner near your hotel. Batu is famous for apples, and many stalls sell fresh apple juice and apple chips.
**Booking logic:** an Indonesian media report put the weekday ticket at around IDR 150,000, covering the zoo, the Museum Satwa and the Sweet Memories gallery, with weekend prices higher. Ticket resellers list children under 85 centimetres tall as free. Treat both as working estimates and check the official Jatim Park channels before you go.
**Travel note:** weekdays are noticeably calmer than weekends and Indonesian school holidays, when Batu fills with domestic visitors from Surabaya.
## Day 3: Apple picking and the Museum Angkut
**Morning.** Visit one of the apple orchards around Batu that offer petik apel, pick-your-own, where you pay an entry fee, eat what you like among the trees and pay by weight for what you take away. It is short, outdoors and children love it.
**Afternoon.** The Museum Angkut is a large transport museum with cars, trains and planes arranged in themed streets from different countries, which works well for children who are tired of animals. Several listings show it opening around midday on some weekdays, so plan it for the afternoon.
**Evening.** A quiet evening; tomorrow you move to Malang.
**Booking logic:** directory listings for the Museum Angkut give conflicting opening hours and no confirmed 2026 price, so check the official Jatim Park group site or call ahead on the day.
**Travel note:** orchard seasons vary, and some farms have fewer apples in the wet months. Ask your hotel which orchard is picking well that week.
## Day 4: Coban Rondo waterfall, then down to Malang
**Morning.** Check out and drive to Coban Rondo, a waterfall in the hills west of Batu, reached by a short walk from the car park. The area also has a maze and play areas, which buys you an hour with younger children. Go early, before the cloud comes in.
**Afternoon.** Drive down to Malang, about an hour, and check in. In the late afternoon, visit Kampung Warna-Warni Jodipan, a riverside neighbourhood where every house is painted in bright colours, crossed by a footbridge. Children treat it like a giant picture book.
**Evening.** Toko Oen, a Dutch-era restaurant and ice cream parlour in the city centre, is a Malang institution and an easy reward after a moving day.
**Base:** Malang, 3 nights. Compare [[hotels in Malang on Booking.com|BOOKING_MALANG]]; the centre around the Alun-Alun Tugu and Jalan Ijen is the most walkable.
**Booking logic:** arrange tomorrow's Bromo jeep today, through your hotel or a local operator, and confirm the pickup time, the stops, the entry fees and whether the price is per jeep.
**Travel note:** Jodipan is a living neighbourhood with steep steps and narrow lanes. Keep a close hand on small children near the river.
## How do you visit Mount Bromo with kids without the midnight start?
Go by day in a private jeep from Malang through Tumpang. As a working estimate, the drive to the sea of sand takes two to three hours, and a day trip that leaves after breakfast returns in the late afternoon. Families who skip the sunrise report fewer crowds, and children see the crater, the sand and the savanna fully awake.
The trade-off is honest: no sunrise over the caldera, and haze is more likely by midday in some months. In return, nobody wakes at midnight, the crater walk is warmer, and a child who is sick of the car can sleep on the way back. If your children are older and determined, see the Day 5 note on a sunrise trip.
## Day 5: Mount Bromo by day
**Morning.** Leave Malang around 7 a.m. by jeep, through Tumpang and up past the viewpoints at Jemplang, then down into the Tengger caldera. The first stop is usually the savanna below the caldera wall that locals call Bukit Teletubbies, green and rolling in the wet season, gold in the dry.
**Afternoon.** Cross the sea of sand, the Pasir Berbisik, to the foot of Bromo. From the jeep park it is a walk across the sand, or a ride on one of the horses waiting there, then a concrete staircase of roughly 250 steps to the rim, where you look down into the smoking crater. Most children manage it with breaks; carry small ones on the steps if they tire.
**Evening.** Back in Malang by late afternoon. An easy dinner and an early night.
**Booking logic:** foreign visitors pay a separate park fee. As a working estimate, budget around IDR 220,000 per person on weekdays and IDR 320,000 at weekends or on holidays, and confirm current pricing when you book, since many jeep packages include it. Horses are paid separately; one family guide put a return ride at around IDR 250,000 per person, so agree the price before anyone climbs on.
**Travel note:** Bromo is an active volcano, and the park can close the crater rim or keep visitors back when the alert level is raised. Check the current status with Indonesia's volcanology agency or your operator the day before. Bring masks or buffs for the dust, sunscreen and warm layers: the caldera floor sits above 2,000 metres and is cold even at noon when the wind blows.
**Upgrade:** with children of about ten and up who really want the sunrise, a [[private Bromo sunrise trip from Malang|VIATOR_BROMO_SUNRISE_MALANG]] departs shortly before midnight and takes about twelve hours, with hotel pickup. Plan the next day as a full rest day if you do it.
## Day 6: A slow Malang day, or the backup Bromo day
**Morning.** Sleep in. If cloud or a closure ruined yesterday, this is your second chance at Bromo, which is the reason the day exists. Otherwise, walk the shaded Jalan Ijen boulevard with its Dutch colonial villas, then the Alun-Alun Tugu square in front of the city hall.
**Afternoon.** Pool time, or a short drive back up to Batu for the attraction you skipped if your children still have energy. Many families simply rest.
**Evening.** Try bakso Malang, the meatball soup the city is known across Indonesia for, at a busy local stall.
**Booking logic:** nothing to book. That is the point of the day.
**Travel note:** if you are flying out of Surabaya tomorrow for an international connection, consider driving there this afternoon and sleeping near the airport, which removes the traffic risk from the morning of the flight.
## Day 7: Fly out
**Morning.** Malang airport is close to the city, and direct flights connect it with Jakarta. For international connections or Bali, allow two and a half to three hours by road to Surabaya, more on Friday afternoons.
**Base:** none. You leave today.
**Booking logic:** check whether your onward route leaves from Malang or Surabaya before you book the last hotel, because Malang's flight network is much smaller.
**Travel note:** confirm current flight routes before locking hotels; regional schedules in Indonesia change from season to season.
## How many days do you need in Malang and Batu with kids?
Five days covers Batu's main attractions and a Bromo day trip from Malang, with no slack. Seven days, as in this plan, adds a rest day and a weather buffer for Bromo, which is what makes the trip work with children. With ten days, add the train from Yogyakarta and do Central Java first.
The temptation is to fill Batu with every theme park in the brochure. There are more parks than any family needs, and most children are happier with one big outing a day and an afternoon in the pool. Pick the zoo and the transport museum, add an orchard, and leave the rest.
^^ The two bases on this route compared. Distances and times are working estimates; check current conditions before you book.
| Base | Nights | Climate | What you do from there | The catch |
| Batu | 3 | Highland, cool evenings all year | Jatim Park 2 and the Secret Zoo, Museum Angkut, apple orchards, Coban Rondo | Crowded at weekends and in school holidays |
| Malang | 3 | Mild, warmer than Batu | Kampung Warna-Warni, Jalan Ijen, Toko Oen, the Bromo day trip through Tumpang | Fewer international flights than Surabaya |
## Bromo by day or at sunrise: which is better for families?
For most families with children under ten, Bromo by day is better: no midnight start, a warmer crater walk, smaller crowds and a child who enjoys it. The sunrise is spectacular, but it means a pre-dawn jeep, a cold viewpoint at around 2,700 metres and a day lost to tiredness afterwards. Choose it only with older, keen children.
^^ Two ways to see Mount Bromo from Malang. Times are working estimates from operator listings and family reports.
| Option | Leaves Malang | Back in Malang | Best for | The catch |
| Day trip by private jeep | Around 7 a.m. | Late afternoon | Families with younger children | No sunrise, more haze by midday in some months |
| Sunrise trip | Shortly before midnight | Around midday | Older children and teenagers who want the view | A night without sleep, cold viewpoints, a lost next day |
## What to book early, and what to keep flexible
**Book early:** flights into Malang or Surabaya; your Batu hotel if you travel in July, December or around Indonesian holidays, when domestic families fill the town; and the Bromo jeep, a day ahead at the latest.
**Book early:** child seats. Indonesian cars rarely have them, so if you need one, ask the car company in writing or bring a travel seat.
**Keep flexible:** the Bromo day. Watch the weather and the alert level, and swap Day 5 and Day 6 if needed.
**Keep flexible:** the second Batu attraction. If the zoo was enough, the orchard alone makes a good morning.
## Mistakes families make in East Java
The biggest mistake is copying an adult Bromo itinerary: midnight jeep, sunrise, then a long transfer the same day. It turns the best day of the trip into the worst. The second is underestimating the cold. Batu evenings and the Bromo caldera can be chilly, and children in shorts and sandals are miserable on the crater steps.
Other mistakes: visiting Batu's parks on a Saturday, when queues double; trying to see Bromo and Ijen in one trip with small children; and planning a Surabaya flight on the morning after Bromo, when one traffic jam on the toll road can cost you the plane.
## What to cut, adapt or upgrade
**Cut:** with five days, drop the Malang rest day and one Batu attraction, and keep the Bromo buffer by doing Bromo on day four. Never cut the buffer before you cut an attraction.
**Adapt:** to combine with Central Java, start in Yogyakarta with our [[8-day Yogyakarta and Central Java itinerary with kids|/trips/8-days-yogyakarta-central-java-with-kids]] and take the train east to Malang. For the adult version of the same region, see our [[5-day Yogyakarta and Bromo itinerary|/trips/5-days-yogyakarta-bromo]].
**Upgrade:** spend one night on the Bromo crater rim, in Cemoro Lawang or Tosari, so the volcano is a short ride away. Read our [[Surabaya to Mount Bromo transport guide|/transport/surabaya-to-mount-bromo]] for how the rim villages connect.
## Before you build this trip
Visa rules for Indonesia vary by nationality, so check the latest official guidance before you book flights. Carry cash in rupiah for orchards, parking, horses and warungs, because many small places do not take cards. Pack warm layers, closed shoes, sunscreen, hats and dust masks for Bromo.
Most attractions in Batu are busiest at weekends and during Indonesian school holidays, so build your Batu days on weekdays where you can. For the best months to see Bromo clear, read our [[guide to the best time to visit Mount Bromo|/destinations/java/best-time-to-visit-mount-bromo]], and for daily budgets see the [[Indonesia travel costs guide|/indonesia-travel-costs]].
## Final verdict
East Java with children works when the volcano is the highlight of the week, not the shape of it. Three nights in Batu for the zoo, the orchards and the waterfall, three in Malang for the city and a daytime Bromo jeep, and one spare day: that is a trip both parents and children enjoy.
Skip the midnight sunrise unless your children are old enough to ask for it, keep the buffer day, and stay off the Surabaya toll road on the morning of a flight. Do that, and East Java is one of the easiest family weeks in Indonesia outside Bali.
## Related itineraries
[[8 days in Yogyakarta and Central Java with kids|/trips/8-days-yogyakarta-central-java-with-kids]] for the temple half of Java at the same slow pace.
[[7 days in Yogyakarta and East Java|/trips/7-days-yogyakarta-east-java]] for the adult version with Bromo at sunrise and the temples.
[[7 days in Bali with kids|/trips/7-days-bali-with-kids]] if you want a beach week to follow this one.
'''
FAQ=[
("Is Mount Bromo safe for kids?","Generally yes, with care. Children visit Bromo every day, walking or riding a horse across the sand and climbing the steps to the rim. Watch them closely at the crater edge, bring dust masks and warm layers, and check the volcano's current alert level before you go, because the park restricts access when it rises."),
("Can you visit Bromo without doing the sunrise?","Yes. A private jeep from Malang through Tumpang can leave after breakfast and return in the late afternoon, reaching the savanna, the sea of sand and the crater rim. You miss the sunrise view, but you avoid the midnight start and most of the crowds."),
("What is there to do in Batu with kids?","The main draws are Jatim Park 2 with the Batu Secret Zoo and the Museum Satwa, the Museum Angkut transport museum, pick-your-own apple orchards and the Coban Rondo waterfall. Evenings at the Alun-Alun Batu square, with its Ferris wheel and street food, are popular with local families."),
("How do you get to Malang?","Fly into Malang's Abdul Rachman Saleh Airport, which has direct flights from Jakarta, or into Surabaya and drive about two and a half to three hours by toll road. From Yogyakarta, trains to Malang take roughly six to nine hours depending on the service."),
("Is Malang or Batu better to stay in with a family?","Stay in both if you can. Batu is better for the theme parks, the orchards and the cool air, while Malang is better for city walks, food and the Bromo day trip through Tumpang. This plan gives each three nights."),
("How cold is it in Batu and at Bromo?","Batu is a highland town with cool evenings all year, and the Bromo caldera sits above 2,000 metres, where wind can make it cold even at midday. Before dawn at the viewpoints it can be close to freezing. Pack fleeces or light jackets for everyone."),
("How much does a family week in East Java cost?","Hotels and food in Malang and Batu are good value. The larger costs are theme-park tickets, the Bromo park fee of around IDR 220,000 to 320,000 per foreign visitor as a working estimate, and a private jeep, priced per vehicle rather than per person, which suits families."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"ej-{p}{cnt[0]}"
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
title="7 Days in East Java with Kids: Malang, Batu and Mount Bromo by Day"
intro="Most East Java itineraries are built around a midnight jeep to the Bromo sunrise, which is the wrong shape for children. This seven-day family plan uses two calm bases instead: three nights in Batu for the zoo, the transport museum, the apple orchards and a waterfall, and three in Malang for the city and a daytime Bromo jeep through Tumpang, with a spare day in case the weather or the volcano says no. It covers drive times, 2026 ticket estimates and where the plan is fragile."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="East Java with Kids: 7 Days in Malang, Batu and Bromo",
 metaDescription="A relaxed 7-day East Java family itinerary: Batu's zoo and orchards, Malang, and Mount Bromo by day without the midnight start, with 2026 costs.",
 focusKeyword="East Java with kids",intro=intro,
 route="Batu (3 nights), Malang (3 nights), Mount Bromo day trip via Tumpang",
 routeSummary="Malang airport → Batu → Coban Rondo → Malang → Mount Bromo → Malang",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="May to October",logisticsComplexity="easy",
 destinationPrimary="java",travelStylePrimary="adventure_volcanoes",travelStyleSecondary=["wildlife_nature"],
 travellerTypes=["families"],tripLengthBucket="one_week",tripLengthDays=7,vibe="relaxed",
 experienceTags=["family_friendly","volcano","zoo","theme_parks","highland_town","jeep_tour"],
 primaryAffiliatePartner="booking",secondaryAffiliatePartners=["viator","12go","airalo"],
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
