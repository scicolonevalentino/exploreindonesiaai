# PARTE 1 + PARTE 3 del generatore, 2026-10-12, su /trips/30-days-indonesia-ultimate.
# Cluster "indonesia itinerary" (GSC 2026-09-12..10-09 su questa pagina: indonesia itinerary 15 impr pos 44.7,
# indonesia trip itinerary 13 pos 20, indonesia travel itinerary 7 pos 53, itinerary indonesia 3 pos 50.7,
# indonesia itinerary 14 days 7 pos 11.7; 0 click). Vedi docs/reinforce-30-days-indonesia-ultimate-2026-10-12.md
# Valori vecchi:
#   metaTitle       "30-Day Indonesia Itinerary: The Ultimate Route"
#   metaDescription "30 days across 7 Indonesian regions: Bali, Java, Komodo, Lombok, Sumatra, Sulawesi and Raja Ampat. A decision-led route, not a Bali trip with add-ons."
# Per annullare il corpo: togliere dal body i blocchi con _key che inizia per "r30-".
#   python3 scripts/patch-30-days-itinerary-length-2026-10-12.py [--commit]
import json,os,sys,urllib.parse,urllib.request,re
TOK=[l.split("=",1)[1].strip().strip('"\'') for l in open(".env.local") if l.startswith("SANITY_API_WRITE_TOKEN=")][0]
API="https://u4ah1ore.api.sanity.io/v2024-01-01/data"
H={"Authorization":"Bearer "+TOK,"Content-Type":"application/json"}
def q(g):
    r=urllib.request.Request(API+"/query/production?query="+urllib.parse.quote(g),headers=H)
    return json.load(urllib.request.urlopen(r))["result"]
ID="itinerary-30-days-indonesia-ultimate-v2"
OLD_T="30-Day Indonesia Itinerary: The Ultimate Route"
OLD_D="30 days across 7 Indonesian regions: Bali, Java, Komodo, Lombok, Sumatra, Sulawesi and Raja Ampat. A decision-led route, not a Bali trip with add-ons."
NEW_T="Indonesia Itinerary for 30 Days: 7 Regions in One Route"
NEW_D="A 30-day Indonesia itinerary across Bali, Java, Komodo, Lombok, Sumatra, Sulawesi and Raja Ampat, plus how to cut it to 2 or 3 weeks."
NOTE=("2026-10-12 (generator run): PARTE 1 metaTitle/metaDescription + PARTE 3 section 'How long should an Indonesia itinerary be?' (blocks r30-*). "
      "Baseline GSC 2026-09-12..10-09, cluster 'indonesia itinerary' on this page: ~45 impr, 0 clicks, pos 20-53 (indonesia itinerary 15 @ 44.7). "
      "Page overall: 361 impr, 8 clicks, pos 10.3. Do not retouch before 2026-11-09; measure position of 'indonesia itinerary' and 'indonesia trip itinerary'.")
def blk(k,style,parts):
    md=[];ch=[]
    for i,p in enumerate(parts):
        if isinstance(p,tuple):
            mk=f"{k}-m{i}"; md.append(dict(_key=mk,_type="externalLink",href=p[1],blank=False))
            ch.append(dict(_type="span",_key=f"{k}-s{i}",marks=[mk],text=p[0]))
        else: ch.append(dict(_type="span",_key=f"{k}-s{i}",marks=[],text=p))
    return dict(_type="block",_key=k,style=style,markDefs=md,children=ch)
NEW=[
 blk("r30-h","h2",["How long should an Indonesia itinerary be?"]),
 blk("r30-p1","normal",["Two weeks is enough for two or three regions done properly, usually Bali with Java or Komodo. Three weeks lets you add Lombok and the Gili Islands at a calmer pace. A full month is what it takes to reach Sumatra, Sulawesi and Raja Ampat as well, because each of them adds a long flight in and out."]),
 blk("r30-p2","normal",["The rule we use when we plan: allow four or five days per region, plus a travel day for every long domestic flight. That is why this 30-day route needs around seven flights, while our 20-day route manages with three. Shorten the trip and the far regions go first, not the days in each place."]),
 dict(_type="comparisonTable",_key="r30-t",caption="What each length of Indonesia itinerary realistically covers, based on our own routes. Flight counts and timings are working estimates, so check current schedules.",
  columns=["Trip length","Regions you can cover well","Best for","Our route"],
  rows=[
   dict(_key="r30-t1",cells=["10 days","Bali, Yogyakarta and Komodo, at a quick pace","A first trip with limited leave","10 days: Bali, Yogyakarta and Komodo"]),
   dict(_key="r30-t2",cells=["2 weeks","Bali, Java's temples and volcanoes, Komodo","First-timers who want the classic highlights","14 days: Bali, Java and Komodo"]),
   dict(_key="r30-t3",cells=["3 weeks","Bali, Java, Komodo, Lombok and the Gili Islands","Adding beach time without rushing","20 days across Indonesia"]),
   dict(_key="r30-t4",cells=["3 weeks, without Bali","Java, Flores and Komodo, Lombok, North Sumatra","Repeat visitors who have done Bali","21 days beyond Bali"]),
   dict(_key="r30-t5",cells=["30 days","Seven regions, including Sumatra, Sulawesi and Raja Ampat","Travellers with a month and patience for flights","This route"]),
  ]),
 blk("r30-p3","normal",["Our shorter routes, by length: the ",("10-day Bali, Yogyakarta and Komodo itinerary","/trips/10-days-indonesia-bali-yogyakarta-komodo"),", the ",("14-day Bali, Java and Komodo itinerary","/trips/14-days-indonesia-bali-java-komodo"),", the ",("20-day route across Indonesia","/trips/20-days-across-indonesia")," and the ",("21-day trip beyond Bali","/trips/21-days-indonesia-beyond-bali"),". To compare every route by length, style and island, browse ",("all our Indonesia itineraries","/trips"),"."]),
]
doc=q(f'*[_id=="{ID}"][0]{{_rev,metaTitle,metaDescription,body}}')
body=doc["body"]
if any(b.get("_key","").startswith("r30-") for b in body): sys.exit("already applied")
assert doc["metaTitle"]==OLD_T and doc["metaDescription"]==OLD_D, (doc["metaTitle"],doc["metaDescription"])
idx=next(i for i,b in enumerate(body) if b.get("style")=="h2" and b["children"][0]["text"].startswith("Before you fly"))
newbody=body[:idx]+NEW+body[idx:]
txt=json.dumps(NEW+[NEW_T,NEW_D])
bad=["—","–","hidden gem","must-see","paradise","immerse yourself","unforgettable","something for everyone","vibrant culture","crystal-clear","breathtaking","rich history","local charm","authentic experience","off the beaten path","once-in-a-lifetime","bucket list","dream destination"]
fails=[b for b in bad if b.lower() in txt.lower()]
# _key must be unique per array: top-level blocks, and children/markDefs within each block.
# (Existing blocks reuse span keys across blocks, which Sanity allows.)
top=[b["_key"] for b in newbody]
if len(top)!=len(set(top)): fails.append("dup block keys")
for b in newbody:
    for arr in ("children","markDefs","rows"):
        ks=[c["_key"] for c in b.get(arr,[])]
        if len(ks)!=len(set(ks)): fails.append("dup keys in "+b["_key"])
newk=set(re.findall(r'"_key": "([^"]+)"',json.dumps(NEW)))
oldk=set(re.findall(r'"_key": "([^"]+)"',json.dumps(body)))
if newk&oldk: fails.append("new keys collide")
if len(NEW_T)>60 or len(NEW_D)>155: fails.append("meta")
print("meta",len(NEW_T),len(NEW_D),"insert at",idx,"body",len(body),"->",len(newbody),"lead words",len(NEW[1]["children"][0]["text"].split()),"FAILS",fails)
if fails or "--commit" not in sys.argv: sys.exit(0)
m={"mutations":[{"patch":{"id":ID,"ifRevisionID":doc["_rev"],"set":{"metaTitle":NEW_T,"metaDescription":NEW_D,"body":newbody,"seoNote":NOTE}}}]}
r=urllib.request.Request(API+"/mutate/production",data=json.dumps(m).encode(),headers=H,method="POST")
print(urllib.request.urlopen(r).read().decode())
after=q(f'*[_id=="{ID}"][0]{{metaTitle,metaDescription,"n":count(body),"r30":count(body[_key match "r30-*"]),seoNote}}')
print("verified:",after["metaTitle"]==NEW_T and after["metaDescription"]==NEW_D and after["r30"]==len(NEW) and after["n"]==len(newbody),after)
