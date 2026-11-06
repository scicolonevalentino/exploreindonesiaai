# PARTE 1 + PARTE 3, 2026-11-06 generator run: /trips/6-days-belitung-granite-beaches-island-hopping.
# GSC 2026-10-07..11-03: "belitung itinerary" 27 impressions, position 26.7,
# 0 clicks, all on this page (new query this period). The live SERP is editorial
# blogs (tripcanvas, tiket.com blog, thegonegoat) plus tour packages, and almost
# every result is a 2 to 4 day plan; ours only offered 6 days. So the title
# names the shorter lengths and the body gets a section that actually delivers
# them, built only from the article's own days (no new facts).
# Rewrites the whole body and faq arrays (items here may lack _key) with an
# ifRevisionID guard, then reads the document back.
#   python3 scripts/reinforce-belitung-2026-11-06.py            # dry run
#   python3 scripts/reinforce-belitung-2026-11-06.py --commit
import json,os,sys,urllib.request,urllib.parse
T=[l.split("=",1)[1].strip().strip('"\'') for l in open(".env.local") if l.startswith("SANITY_API_WRITE_TOKEN=")][0]
B="https://u4ah1ore.api.sanity.io/v2024-01-01/data/"
ID="itinerary-6-days-belitung-granite-beaches-island-hopping"
def q(g): return json.load(urllib.request.urlopen(urllib.request.Request(B+"query/production?query="+urllib.parse.quote(g),headers={"Authorization":"Bearer "+T})))["result"]
OLD_TITLE="Belitung Itinerary: 6 Days of Beaches and Islands"
OLD_DESC="A relaxed 6-day Belitung itinerary from Jakarta: granite beaches, Lengkuas island hopping and a family pace, with flights, boat costs and when to go."
NEW_TITLE="Belitung Itinerary: 3, 4 or 6 Days from Jakarta"
NEW_DESC="A Belitung itinerary for 3, 4 or 6 days from Jakarta: granite beaches, Lengkuas island hopping and Danau Kaolin, with flights, boat costs and timing."
n=[0]
def K(p): n[0]+=1; return f"bl6-{p}{n[0]}"
def para(*parts,style="normal"):
    md=[];ch=[]
    for p in parts:
        if isinstance(p,tuple):
            k=K("m"); md.append(dict(_key=k,_type="externalLink",href=p[1],blank=False)); ch.append(dict(_type="span",_key=K("s"),marks=[k],text=p[0]))
        else: ch.append(dict(_type="span",_key=K("s"),marks=[],text=p))
    return dict(_type="block",_key=K("b"),style=style,markDefs=md,children=ch)
NEW_SECTION=[
 para("What does a 3-day or 4-day Belitung itinerary look like?",style="h2"),
 para("A 3-day Belitung itinerary fits the island-hopping day to Lengkuas and an afternoon at Tanjung Tinggi, with two nights on the north coast. Four days adds a spare day for the sea, or East Belitung. Both work only if you fly in on the earliest Jakarta flight and treat any cancelled boat as lost."),
 dict(_type="comparisonTable",_key=K("t"),caption="Belitung in 3, 4 or 6 days, using the days of this itinerary. Times are working estimates.",
  columns=["Length","Nights","Days to keep","What you drop","Who it suits"],
  rows=[dict(_key=K("r"),cells=c) for c in [
   ["3 days","2 on the north coast","Day 1 north coast, Day 2 island hopping, Tanjung Tinggi on the morning you fly out","East Belitung, Danau Kaolin and any weather buffer","A long weekend from Jakarta, adults"],
   ["4 days","3 on the north coast","Days 1 to 3, then Danau Kaolin on the way to the airport","East Belitung and the night in Tanjung Pandan","Couples or families who want one spare day"],
   ["6 days","4 on the north coast, 1 in Tanjung Pandan","All six days as written","Nothing","Families, and anyone who wants the boat day to be safe"],
  ]]),
 para("The short versions keep the same order, because the island-hopping day is the reason to come and the north coast is where the boats leave. What disappears first is the weather buffer: with three days, a windy morning means no Lengkuas at all. If your dates are fixed and short, book the earliest flight in, ask your hotel to hold a boat for the first calm morning, and keep East Belitung for a return visit."),
]
FAQ_NEW=dict(_key="bl6-faq3d",question="Can you see Belitung in 3 days?",answer="Yes, if you accept the risk to the boat day. Fly in on the earliest Jakarta flight, spend the afternoon on the north coast, island hop to Lengkuas on day 2 and see Tanjung Tinggi before your flight on day 3. You give up East Belitung and any spare day if the sea is rough.")
RELATED=[para("7 days in the Kei Islands, via Ambon, for a much emptier beach week far from Jakarta: ",("our Kei Islands itinerary","/trips/7-days-kei-islands-maluku-beaches"),"."),
         para("6 days in Tanjung Bira for white sand and phinisi boatyards in South Sulawesi: ",("the Tanjung Bira route","/trips/6-days-tanjung-bira-south-sulawesi-beaches"),".")]
SEO_NOTE=("2026-11-06 generator run (PARTE 1+3). Baseline GSC 2026-10-07..11-03: 'belitung itinerary' 27 impr, pos 26.7, 0 clicks. "
 "Old metaTitle: '"+OLD_TITLE+"'. Old metaDescription: '"+OLD_DESC+"'. Added H2 'What does a 3-day or 4-day Belitung itinerary look like?' with table, "
 "a 3-day FAQ and two related links. Re-read 2026-12-04; do not retouch title/meta before then. Log: docs/reinforce-6-days-belitung-granite-beaches-island-hopping-2026-11-06.md")
doc=q(f'*[_id=="{ID}"][0]')
assert doc["metaTitle"]==OLD_TITLE and doc["metaDescription"]==OLD_DESC, "meta changed since planning"
body=doc["body"]; faq=doc["faq"]
txt=lambda b:"".join(c.get("text","") for c in b.get("children",[]))
if any(txt(b).startswith("What does a 3-day") for b in body): sys.exit("already applied")
i=next(i for i,b in enumerate(body) if txt(b).startswith("How do you get to Belitung from Jakarta?"))
body=body[:i]+NEW_SECTION+body[i:]
body=body+RELATED  # Related itineraries is the last section
faq=faq+[FAQ_NEW]
allt=json.dumps([NEW_SECTION,RELATED,FAQ_NEW,NEW_TITLE,NEW_DESC],ensure_ascii=False).lower()
bad=["—","–","hidden gem","must-see","paradise","immerse yourself","unforgettable","something for everyone","vibrant culture","crystal-clear","breathtaking","rich history","local charm","authentic experience","off the beaten path","once-in-a-lifetime","bucket list","dream destination"]
fails=[b for b in bad if b in allt]
if len(NEW_TITLE)>60 or len(NEW_DESC)>155: fails.append("meta len")
keys=[x for x in __import__("re").findall(r'"_key": "([^"]+)"',json.dumps(body+faq))]
if len(keys)!=len(set(keys)): fails.append("dup keys")
print("title",len(NEW_TITLE),"desc",len(NEW_DESC),"answer words",len(txt(NEW_SECTION[1]).split()),"blocks",len(doc["body"]),"->",len(body),"faq",len(faq),"FAILS",fails)
if fails: sys.exit(1)
if "--commit" not in sys.argv: sys.exit("dry run")
m={"mutations":[{"patch":{"id":ID,"ifRevisionID":doc["_rev"],"set":{"metaTitle":NEW_TITLE,"metaDescription":NEW_DESC,"body":body,"faq":faq,"seoNote":SEO_NOTE}}}]}
print(urllib.request.urlopen(urllib.request.Request(B+"mutate/production",data=json.dumps(m).encode(),headers={"Authorization":"Bearer "+T,"Content-Type":"application/json"})).read().decode())
v=q(f'*[_id=="{ID}"][0]{{metaTitle,metaDescription,"n":count(body),"f":count(faq),"h":body[style=="h2"].children[0].text,seoNote}}')
assert v["metaTitle"]==NEW_TITLE and v["metaDescription"]==NEW_DESC and v["n"]==len(body) and v["f"]==len(faq)
print("verified",v["n"],"blocks",v["f"],"faq;", [h for h in v["h"] if "3-day" in h])
