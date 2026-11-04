# PARTE 2, 2026-11-04 generator run: first West Sumatra family itinerary.
# Gap: sumatra x families = 1 (North Sumatra only), and the 7-day West Sumatra
# article says it is "not the right trip for families with very young
# children". GSC 2026-10-05..11-01 has no clean no-page query (visa, costs,
# transport and the closed Bali-islands cluster dominate), but family intent is
# the site's strongest signal: "plan an itinerary for yogyakarta for a family
# with kids" 461 impr at pos 3.9, "yogyakarta with kids" 43 at 11.5. Matrix
# fallback inside that proven intent, in a preferred region (Sumatra).
# Facts: Lembah Anai landslide closures 24/06 and 30/07/2026 (detik, RRI,
# Kompas), Binamarga "konektivitas Padang-Bukittinggi kembali normal"
# (18/09/2026); Marapi Level II Waspada, 3 km exclusion (PVMBG via Antara /
# iNews, Sept-Oct 2026); Pagaruyung Rp 15,000 adult / 7,500 child / 25,000
# foreign (IDN Times); Harau ~Rp 10,000 (iNews 2025); Sungai Pisang to
# Pasumpahan about 20 minutes by boat. 12Go jakarta/padang (fastest 1h45,
# from IDR 550,000) and kuala-lumpur/padang (3 flights/day, 1h10) browser-
# checked live 2026-11-04.
#   python3 scripts/build-west-sumatra-kids-2026-11-04.py
import json,re,datetime
SLUG="8-days-west-sumatra-with-kids-bukittinggi-harau"
BK="https://www.booking.com/searchresults.html?ss=%s%%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1"
AFF=[
 dict(partner="airalo",placeholderId="AIRALO_INDONESIA",affiliateUrl="https://airalo.tpx.lu/ywUnFTCe",publicUrl="https://www.airalo.com/indonesia-esim",anchorText="Indonesia eSIM with Airalo",experienceCategory="esim_connectivity"),
 dict(partner="12go",placeholderId="TWELVEGO_JAKARTA_PADANG",affiliateUrl="https://12go.asia/en/travel/jakarta/padang?z=16022946",publicUrl="https://12go.asia/en/travel/jakarta/padang",anchorText="Jakarta to Padang flights on 12Go",experienceCategory="transport"),
 dict(partner="12go",placeholderId="TWELVEGO_KUALA_LUMPUR_PADANG",affiliateUrl="https://12go.asia/en/travel/kuala-lumpur/padang?z=16022946",publicUrl="https://12go.asia/en/travel/kuala-lumpur/padang",anchorText="Kuala Lumpur to Padang flights on 12Go",experienceCategory="transport"),
 dict(partner="booking",placeholderId="BOOKING_BUKITTINGGI",affiliateUrl=BK%"Bukittinggi",publicUrl=BK%"Bukittinggi",anchorText="family rooms in Bukittinggi on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_HARAU_VALLEY",affiliateUrl=BK%"Harau+Valley",publicUrl=BK%"Harau+Valley",anchorText="Harau Valley stays on Booking.com",experienceCategory="hotel"),
 dict(partner="booking",placeholderId="BOOKING_PADANG",affiliateUrl=BK%"Padang",publicUrl=BK%"Padang",anchorText="hotels in Padang on Booking.com",experienceCategory="hotel"),
]
for i,a in enumerate(AFF): a.update(_key=f"wsk-aff{i}",_type="affiliateLink",linkStatus="live",notes=None)
SRC='''
## Is West Sumatra a good place to travel with kids?
Yes, for children of about six and up who cope with winding roads. West Sumatra gives families cool highland air, a canyon you can walk into, a cliff-walled valley with waterfall pools and a calm island day off Padang, all in one week and with very few other tourists. The cost is slow mountain driving.
Most families who come to Sumatra go north for the orangutans. The west is different: no jungle trek, no early boat, no leeches. It is a landscape trip built around two easy bases, Bukittinggi in the highlands and Harau Valley in the rice fields, with the Minangkabau food and the horn-roofed great houses as the cultural thread children actually notice. This plan keeps every drive under four hours and never asks you to pack up two days in a row.
## Who this trip is for, and who it is not
This route is for families with children roughly six to fourteen who like walking, animals and swimming, and for parents who want a less visited corner of Indonesia without a hard expedition. It suits families who have done Bali or Java and want something calmer, and it works for grandparents too, since nothing on it is strenuous.
It is not for families with toddlers who get carsick, since the highland roads bend constantly, nor for anyone who wants a kids' club, a resort pool every day or beach time on most days. West Sumatra is conservative and largely Muslim, English is limited outside hotels, and the tourist infrastructure is light. If you want an easier first family trip, the [[8-day Yogyakarta and Central Java family itinerary|/trips/8-days-yogyakarta-central-java-with-kids]] has shorter transfers and more child-ready sights.
## Trip at a glance
**Duration:** 8 days, 7 nights: 3 in Bukittinggi, 2 in Harau Valley, 2 in Padang.
**Route:** Minangkabau International Airport (PDG) near Padang, up to Bukittinggi, east to Harau Valley via the Pagaruyung palace, down to Padang, an island day from Sungai Pisang, and fly out.
**Pace:** relaxed. Three moving days, each under four hours of driving, and no early starts except the island morning.
**Best for:** families with children about six to fourteen, and multi-generation groups.
**Best time:** broadly June to September, when the highlands are drier. Sumatra is wet much of the year, so pack rain layers for everyone whatever the month.
**Budget:** moderate. A private car and driver for the moving days is the largest cost; rooms, food and entry tickets in West Sumatra are cheap by Indonesian standards.
**Logistics:** moderate. One airport, no internal flights, and a driver you book ahead.
## How many days do you need in West Sumatra with kids?
Eight days is the comfortable minimum with children. Adults can see Bukittinggi and Harau Valley in five, but kids need a slack afternoon after every drive, and the Padang island day only works with a spare night on the coast. Eight days gives each base at least one full day where nobody gets into a car.
With six days, drop the two Padang nights and fly out after Harau, staying near the airport on the last night. With ten, add a third night in Harau or the Mandeh islands south of Padang. Do not try to add Lake Toba or Bukit Lawang to the same week: the north is a separate trip, and the road between the two halves of the island is long.
^^ The three bases on this trip, and why each one is there
| Base | Nights | Why it works for kids | Longest drive to reach it | The trade-off |
| Bukittinggi | 3 | Cool evenings, a zoo, a canyon walk and easy food, all close together | About 2 to 3 hours from the airport | Busy town traffic around Jam Gadang |
| Harau Valley | 2 | Waterfall pools, flat rice-field paths and space to run | About 3 to 4 hours with the palace stop | Few restaurants, very quiet after dark |
| Padang | 2 | Island day, beach sunsets and a short run to the airport | About 3 to 4 hours from Harau | Hot and humid after the highlands |
## How long are the drives, and how do you get around with children?
By private car with a driver, booked through your first hotel before you fly. The drives are 2 to 4 hours each, on winding two-lane roads, and buses and shared minibuses are not worth it with children and luggage. The Padang to Bukittinggi road has been closed by landslides several times in 2026, so build in slack.
The main road climbs through Lembah Anai, a narrow gorge where the road was cut by floods in 2024 and blocked by landslides again in June and July 2026, according to detik and RRI reports. Each closure was cleared within hours, and the public works ministry reported the connection back to normal by September 2026. Ask your driver the day before which route is open; the alternatives, via Malalak or round through Solok, add time.
^^ Every drive on this trip, with working estimates
| Day | Leg | Time by car | What helps with kids |
| 1 | Airport to Bukittinggi | About 2 to 3 hours | Stop at the Lembah Anai waterfall if the road is open |
| 4 | Bukittinggi to Pagaruyung to Harau Valley | About 3 to 4 hours in total | Lunch at the palace breaks it in two |
| 6 | Harau Valley to Padang | About 3 to 4 hours | Leave after breakfast, arrive for an afternoon swim |
| 7 | Padang to Sungai Pisang and back | About 1 hour each way | Early start, back by mid afternoon |
## Day 1: Land in Padang, drive up to Bukittinggi
**Morning.** Fly into Minangkabau International Airport (PDG), about 25 kilometres north of Padang. There are no long-haul flights, so you connect: compare [[Jakarta to Padang flights on 12Go|TWELVEGO_JAKARTA_PADANG]], with the fastest around 1 hour 45 minutes, or [[Kuala Lumpur to Padang flights on 12Go|TWELVEGO_KUALA_LUMPUR_PADANG]], about 1 hour 10 minutes with three departures a day when we checked. Set up an [[Indonesia eSIM with Airalo|AIRALO_INDONESIA]] before you land so maps work in the car.
**Afternoon.** Meet your driver and head up into the hills. If the Lembah Anai road is open, the roadside waterfall at the top of the gorge is the obvious leg-stretch, and children like the spray. The temperature drops as you climb, which feels like a reward after the airport.
**Evening.** Arrive in Bukittinggi, check in, and walk to Jam Gadang, the clock tower in the town square, where families from all over West Sumatra come out in the evening. Eat early.
**Base:** Bukittinggi, 3 nights. Compare [[family rooms in Bukittinggi on Booking.com|BOOKING_BUKITTINGGI]] and stay within walking distance of Jam Gadang so the evenings need no car.
**Booking logic:** book the driver for Days 1, 4 and 6 before you fly, through your Bukittinggi hotel, and agree what the price covers: fuel, tolls, parking and the driver's meals.
**Travel note:** evenings in Bukittinggi are cool enough for a fleece. Children arriving from Jakarta or Kuala Lumpur in shorts notice it fast.
## Day 2: Kinantan zoo, the footbridge and Fort de Kock
**Morning.** Start at the Kinantan wildlife and culture park, a zoo the Dutch opened in 1929 on a hill in the middle of town, according to the Bukittinggi tourism office. It is small and old-fashioned, so set expectations, but younger children will happily spend an hour, and the Minangkabau house museum inside is worth a look.
**Afternoon.** Walk across the Limpapeh footbridge, which hangs over the road between the zoo hill and the old Dutch fort, Fort de Kock. Children love the bridge more than the fort. Then go back to the hotel for a rest in the heat of the day.
**Evening.** Pasar Atas, the market beside Jam Gadang, for a first proper Padang meal. Dishes come to the table all at once and you pay only for what you eat, which takes the pressure off picky eaters: order rice, fried chicken and perkedel, the potato cakes, alongside the spicier plates.
**Booking logic:** no tickets to buy ahead. Entry fees here are small and paid in cash at the gate; confirm the current price on the day.
**Travel note:** horse carts called bendi wait around Jam Gadang. A short ride is a good end to a day for small children; agree the price first.
## Day 3: Ngarai Sianok canyon and an easy afternoon
**Morning.** Go early to Panorama Park on the rim of Ngarai Sianok, the green canyon on the edge of town, for the view before the haze builds. Older children can go down the stairs into the Japanese tunnels dug during the occupation; the steps are steep and long, so leave toddlers above with one adult. Families with energy can walk the Janjang Koto Gadang stairway across the canyon instead.
**Afternoon.** Keep it slow. A swim at the hotel, or a short drive to Koto Gadang, the village across the canyon known for its silversmiths, where children can watch the filigree work.
**Evening.** A second night of Minangkabau food. Try sate Padang, skewers in a thick spiced sauce, which most children like.
**Travel note:** Mount Marapi, the volcano you can see from town, has been at alert level II, Waspada, through much of 2026, with a 3 kilometre exclusion zone around the crater, according to PVMBG reports carried by Antara. Bukittinggi is well outside it, but ash can fall on town after an eruption. Pack a few child-sized masks and check the MAGMA Indonesia bulletin before you travel.
## Day 4: Pagaruyung palace, then Harau Valley
**Morning.** Leave Bukittinggi after breakfast for Istano Basa Pagaruyung near Batusangkar, a reconstruction of the Minangkabau royal palace with its curved horn roofs. Children can rent traditional costume for photos, which is the part they remember. Entry was Rp 15,000 for adults, Rp 7,500 for children and Rp 25,000 for foreign visitors, according to IDN Times; check the current fee at the gate.
**Afternoon.** Lunch near the palace, then drive on to Harau Valley near Payakumbuh, where sheer rock walls rise straight out of the rice fields. Arrive with daylight left and let the children loose on the paths around your guesthouse.
**Evening.** Dinner at your homestay. Harau has almost nothing open after dark, which works well with tired children.
**Base:** Harau Valley, 2 nights. Look at [[Harau Valley stays on Booking.com|BOOKING_HARAU_VALLEY]] and pick one with a family room and its own kitchen, since you will eat most meals there.
**Booking logic:** Harau's guesthouses are small and the good ones fill on Indonesian holidays. Book both nights before you leave home.
**Travel note:** if your children are carsick, skip the palace and drive straight from Bukittinggi to Harau, about 1.5 to 2 hours. You lose a costume photo, not the trip.
## Day 5: A full day in Harau Valley
**Morning.** Walk to the waterfalls at the foot of the cliffs, where the pools are shallow enough for children to paddle. Valley entry was around Rp 10,000 in 2025, according to iNews, and some spots charge a little extra. Go early, before the day-trippers from Payakumbuh arrive.
**Afternoon.** Rent bicycles from your guesthouse and ride the flat lanes between the paddies, or just let the kids shout at the cliffs and listen for the echo. Harau is one of the few climbing areas in Sumatra; some guesthouses can arrange a short supervised climb for older children.
**Evening.** A quiet dinner and an early night before the drive to the coast.
**Travel note:** the valley floor is flat but the sun is strong between the cliffs. Hats and water for everyone, and a mid-day rest indoors.
## Day 6: Down to Padang and the sea
**Morning.** Leave Harau after breakfast. The drive back to the coast takes about three to four hours as a working estimate, through Payakumbuh and down from the highlands.
**Afternoon.** Check in, swim, and let everyone recover from the road. Padang is hot after the hills, so do nothing ambitious.
**Evening.** Walk the seafront promenade along Pantai Padang at sunset, when the food carts open, then eat Padang food at its source.
**Base:** Padang, 2 nights. Compare [[hotels in Padang on Booking.com|BOOKING_PADANG]]; a hotel with a pool is worth it here, and the south side of the city is closer to tomorrow's boat.
**Booking logic:** ask your hotel to find a boatman at Sungai Pisang for tomorrow and to confirm the boat carries life jackets in children's sizes. Many small boats do not, and it is the one thing worth insisting on.
## Day 7: An island day from Sungai Pisang
**Morning.** Drive about an hour south of central Padang to Sungai Pisang, a fishing village facing a scatter of small islands. The boat to Pulau Pasumpahan takes about 20 minutes, and the water on the sheltered side is calm and shallow enough for children to snorkel from the beach. Agree the boat price, the stops and the pickup time on the jetty before you leave.
**Afternoon.** Come back by mid afternoon, before the sea picks up. On the way into town, stop at Air Manis beach to see the Malin Kundang rock, a stone said to be a boy cursed for disowning his mother, which is the story every West Sumatran child knows.
**Evening.** A last dinner in Padang. Rendang is the dish to finish on.
**Travel note:** bring water, snacks and sun protection to the island; facilities there are basic and cash only.
## Day 8: Fly out from Padang
**Morning.** The airport is about 45 minutes from central Padang without traffic, more in the rush. Leave plenty of time, since your onward connection in Jakarta or Kuala Lumpur is the one that matters.
**Travel note:** confirm current flight routes and times before you book hotels. Regional schedules change, and an afternoon departure is the easier one with children.
## What to book early, and what to keep flexible
Book early: the flights, the Bukittinggi hotel, both Harau nights and the driver for the three moving days. These are the parts with limited supply, and a reliable driver who knows the road conditions matters more than any hotel on this trip.
Keep flexible: the zoo, the canyon walk, Koto Gadang, the bicycles in Harau and the island day. All are arranged on the spot, in cash, and should move around the weather and the children's moods.
## What mistakes do families make in West Sumatra?
The biggest is stacking drives. A day that combines the airport, Lembah Anai and a sightseeing stop is too much with children, and the roads make every leg slower than the map suggests. The second is doing Harau as a day trip, which turns the best part of the week into four hours in a car.
The third is arriving without cash: outside Bukittinggi and Padang, ATMs are scarce and almost everything is paid in rupiah. The fourth is ignoring the volcano bulletins. And the fifth is planning beach days in the highlands; the sea is a Padang thing, so save swimming expectations for the end.
## What to cut, adapt or upgrade
**Cut:** the two Padang nights if you are short on time. Fly out after Harau, with one night near the airport.
**Adapt:** with older children who handle bends, swap Day 3's afternoon for Lake Maninjau, down the Kelok 44 road, a sequence of 44 hairpin bends to a crater lake. It is about 90 minutes each way and best skipped with anyone prone to motion sickness. The [[7-day West Sumatra itinerary for adults|/trips/7-days-west-sumatra-bukittinggi-harau-valley]] covers it in full.
**Upgrade:** add two or three nights in the Mandeh islands south of Padang for a proper beach finish. Our [[7-day Mandeh Bay itinerary|/trips/7-days-mandeh-bay-west-sumatra-coast]] covers the coast.
**Do not add:** Lake Toba or Bukit Lawang to the same week. They are a long overland day north, and they deserve their own trip.
## Before you build this trip
**Visa:** most visitors enter on the visa on arrival or e-VOA, listed at IDR 500,000 on the official e-visa portal and valid for 30 days. Children need their own. The arrival card is free on the official site; ignore paid lookalikes. See our [[Indonesia visa guide|/visa-guide]] and check the latest official guidance before you travel.
**Money:** draw cash in Padang or Bukittinggi. Harau and Sungai Pisang run on rupiah.
**Health:** Bukittinggi and Padang have hospitals; Harau does not, so bring a small first-aid kit, motion-sickness remedies and rehydration salts. Ask your doctor about routine vaccines for Indonesia well before you go.
**Respect:** West Sumatra is conservative. Cover shoulders and knees in towns and at the palace, swimwear is for the beach and the waterfalls, and ask before photographing people.
**Food:** Padang cooking is spicy, but every table has plain rice, fried chicken, eggs and perkedel. Children who eat those will not go hungry.
## Final verdict: is West Sumatra worth it with kids?
Go if your children are old enough to enjoy a walk and a view, and you want them to see a part of Indonesia that is not set up for tourists. The highlands, the canyon, Harau's cliffs and a calm island day make a varied week, and the food alone is a reason to come.
Skip it with toddlers who suffer in the car, or if you need pools and kids' clubs to keep everyone happy. For an easier family week, Yogyakarta or Bali will serve you better. For a family that is ready for one step further, this is a good one.
## Related itineraries
For the northern half of the island, with orangutans and Lake Toba, see the [[9-day North Sumatra itinerary with kids|/trips/9-days-north-sumatra-with-kids]]. For a family week with easier logistics, compare the [[8-day Yogyakarta and Central Java family itinerary|/trips/8-days-yogyakarta-central-java-with-kids]], and browse the [[Sumatra destination guide|/destinations/sumatra]] for the wider region.
'''
FAQ=[
("Is West Sumatra safe for families?","Generally yes, with two cautions. Mount Marapi near Bukittinggi has been at alert level II with a 3 kilometre exclusion zone through 2026, and the Padang to Bukittinggi road through Lembah Anai has been closed by landslides several times. Check the MAGMA Indonesia bulletin and ask your driver about road conditions the day before each drive."),
("How long is the drive from Padang airport to Bukittinggi?","About two to three hours by car as a working estimate, climbing through the Lembah Anai gorge. When that road is closed by a landslide, drivers use Malalak or the longer route through Solok, which adds time. Arrange a private car through your hotel rather than taking the bus with children."),
("What is there for kids to do in Bukittinggi?","The Kinantan zoo and the Limpapeh footbridge to Fort de Kock, the Ngarai Sianok canyon and the Japanese tunnels at Panorama Park, horse cart rides around Jam Gadang, and the silversmiths of Koto Gadang. Everything is close together, entry fees are small, and evenings are cool."),
("Is Harau Valley good for children?","Yes. The valley floor is flat, the waterfall pools at the foot of the cliffs are shallow enough to paddle in, and guesthouses rent bicycles for the lanes between the rice fields. Book a family room with its own kitchen, since there are few restaurants and almost nothing opens after dark."),
("How many days do you need in West Sumatra with kids?","Eight days is a comfortable minimum: three nights in Bukittinggi, two in Harau Valley and two in Padang for an island day. Six days works if you skip Padang. Do not add Lake Toba or Bukit Lawang to the same week, since the north is a separate trip."),
("Can you visit the islands near Padang with children?","Yes. From Sungai Pisang, about an hour south of Padang, a boat reaches Pulau Pasumpahan in around 20 minutes, and the sheltered side is calm enough for children to snorkel from the beach. Agree the price on the jetty and ask for life jackets in children's sizes before you leave."),
("How do you fly to Padang?","Minangkabau International Airport (PDG) has frequent flights from Jakarta, the fastest around 1 hour 45 minutes, and a few a day from Kuala Lumpur, about 1 hour 10 minutes. Most international travellers connect through one of the two. Confirm current routes and times before you book hotels."),
]
cnt=[0]
def K(p):
    cnt[0]+=1; return f"wsk-{p}{cnt[0]}"
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
title="8 Days in West Sumatra with Kids: Bukittinggi, Harau Valley and Padang"
intro="Most families who reach Sumatra head north for the orangutans. This eight-day plan goes west instead: three nights in cool Bukittinggi with a zoo, a canyon and a footbridge, two in Harau Valley among waterfall pools and rice fields, and two in Padang for a calm island day, with every drive kept under four hours and the 2026 road and volcano alerts flagged."
doc=dict(_id="itinerary-"+SLUG,_type="article",slug=dict(_type="slug",current=SLUG),title=title,
 metaTitle="West Sumatra with Kids: 8-Day Family Itinerary",
 metaDescription="An 8-day West Sumatra family itinerary: Bukittinggi, Harau Valley waterfalls and a Padang island day, with drive times, 2026 road alerts and costs.",
 focusKeyword="West Sumatra with kids",intro=intro,
 route="Padang airport, Bukittinggi (3 nights), Pagaruyung palace, Harau Valley (2 nights), Padang (2 nights) with an island day from Sungai Pisang, fly out",
 routeSummary="Padang → Bukittinggi → Pagaruyung → Harau Valley → Padang → Pasumpahan",
 contentStatus="live",author=dict(_type="reference",_ref="author-editorial-team"),
 articleCreatedDate=datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
 articleCommercialTier="standard",bestSeason="June to September",logisticsComplexity="moderate",
 destinationPrimary="sumatra",travelStylePrimary="wildlife_nature",travelStyleSecondary=["culture_temples","beach_islands"],
 travellerTypes=["families"],tripLengthBucket="one_week",tripLengthDays=8,vibe="relaxed",
 experienceTags=["family","highlands","waterfalls","road_trip","sumatra"],
 primaryAffiliatePartner="booking",secondaryAffiliatePartners=["12go","airalo"],
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
