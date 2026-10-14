# PARTE 3, 2026-10-14: applies docs/reinforce-10-days-bali-lombok-gili-islands.md
# (sections 4.1 to 4.4 and link 5.1) to /trips/10-days-bali-lombok-gili-islands.
# Inserts four question-led H2 sections with two comparison tables before
# "What to book early", adds a 12Go Bali to Lombok link and a seoNote.
# Idempotent: skips if the new blocks are already there. Rewrites the whole body
# and affiliateLinks arrays (the existing affiliateLinks items have no _key, so a
# _key selector would silently match nothing), then reads back to verify.
#   python3 scripts/patch-bali-lombok-gili-geo-2026-10-14.py [--commit]
import json, os, re, sys, urllib.request, urllib.parse

ID = "8d8d8cc6-000e-4388-9019-17cda00b8a34"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
env = {}
for l in open(os.path.join(ROOT, ".env.local")):
    if "=" in l and not l.strip().startswith("#"):
        k, v = l.split("=", 1)
        env[k.strip()] = v.strip().strip("\"'")
H = {"Authorization": "Bearer " + env["SANITY_API_WRITE_TOKEN"], "Content-Type": "application/json"}
BASE = "https://u4ah1ore.api.sanity.io/v2024-01-01/data"


def q(s):
    req = urllib.request.Request(BASE + "/query/production?query=" + urllib.parse.quote(s), headers=H)
    return json.load(urllib.request.urlopen(req))["result"]


SRC = '''
## Bali, Lombok or the Gilis: which ones should you actually pick?
Take all three only if you have ten days or more. With seven, pick Bali and the Gilis and leave Lombok out, because Lombok is the island that needs a car and two nights before it gives anything back. With fourteen, add south Lombok properly rather than adding a fourth island to the list.
^^ What each stop gives you on this route, and when to leave it out.
| Island | What it gives you | Nights it needs | Leave it out if |
|---|---|---|---|
| Bali (Ubud) | Temples, rice terraces, the soft landing | 2 to 3 | You have been before |
| Bali (Uluwatu) | Cliffs, surf, the airport-side finish | 1 to 2 | You are flying out of Lombok |
| Lombok (Kuta) | Open coast, space, far fewer crowds | 3 | Your trip is under nine days |
| Gili Trawangan | Car-free days, easy snorkelling | 2 to 3 | You want quiet over nightlife |
| Gili Air or Meno | The same water, half the noise | 2 | You want restaurants late at night |
If you drop Lombok, the [[ten-day Bali and Gili Islands route|/trips/10-days-bali-gili-islands]] is the same trip without the Lombok days, and it gives Bali the extra nights instead.
## How do you island hop between Bali, Lombok and the Gilis?
Fast boats link Bali with the Gilis and Lombok every day from Padangbai, Sanur and Serangan, with crossings of roughly 1.5 to 3 hours, and short flights link Denpasar and Lombok in about 40 minutes. The boats are cheaper and drop you on the beach; the flight is the reliable option in rough months.
^^ The legs on this route. Times and fares are working estimates from current listings and change with season and operator, so check them the week you travel.
| Leg | How | Time | Choose it when |
|---|---|---|---|
| Bali to Lombok | Flight, Denpasar to Lombok International | About 40 minutes in the air | You want certainty on the transfer day |
| Bali to Lombok | Fast boat to Lombok's west coast, or slow public ferry Padangbai to Lembar | Roughly 1.5 to 2.5 hours by fast boat, much longer by ferry | You are already in east Bali, or on a tight budget |
| Lombok to Gili Trawangan | Road to Bangsal or Teluk Nare, then a short boat | 15 to 45 minutes on the water | Always, there is no flight |
| Gili Trawangan to Bali | Direct fast boat | Roughly 1.5 to 3 hours | The sea is calm, usually April to October |
Compare [[Bali to Lombok flights and boats on 12Go|12GO_BALI_LOMBOK]] for the first leg, and [[Gili Trawangan to Bali fast boats|12GO_GILI_TRAWANGAN_BALI]] for the return.
## Is 10 days enough for Bali, Lombok and the Gili Islands?
Ten days is the minimum that works, and it works only because this route moves in one direction. You spend roughly two days in transit out of ten, sleep in four different bases and give each island two or three nights. Nine days forces you to drop one island, not to shorten all three.
The two days you cannot squeeze are the Lombok flex day and the slow Gili day. They look empty on paper, but they are what absorbs a late boat or a cancelled crossing without breaking the rest of the trip.
## What does this route cost for ten days?
As a working estimate, budget roughly 700 to 1,000 US dollars per person for ten days at a mid-range level, excluding international flights, using the daily ranges on our travel costs page. On top of that, allow about 40 to 70 dollars for the Bali to Lombok flight and roughly 25 to 42 dollars for each fast boat.
Boats, not beds, are the line that varies most between a cheap version of this trip and an expensive one: a private boat or a private car on transfer days can add more than a week of guesthouse nights. The full breakdown by day and by trip length is in our [[Indonesia travel costs guide|/indonesia-travel-costs]].
'''

cnt = [0]


def K(p):
    cnt[0] += 1
    return f"r1014-{p}{cnt[0]}"


def spans(text, markdefs):
    out = []
    pat = re.compile(r"\*\*(.+?)\*\*|\[\[(.+?)\|(.+?)\]\]")
    pos = 0
    for m in pat.finditer(text):
        if m.start() > pos:
            out.append(dict(_type="span", _key=K("s"), marks=[], text=text[pos:m.start()]))
        if m.group(1):
            out.append(dict(_type="span", _key=K("s"), marks=["strong"], text=m.group(1)))
        else:
            k = K("m")
            tgt = m.group(3)
            if tgt.startswith("/"):
                markdefs.append(dict(_key=k, _type="externalLink", href=tgt, blank=False))
            else:
                markdefs.append(dict(_key=k, _type="affiliateLinkRef", placeholderId=tgt))
            out.append(dict(_type="span", _key=K("s"), marks=[k], text=m.group(2)))
        pos = m.end()
    if pos < len(text):
        out.append(dict(_type="span", _key=K("s"), marks=[], text=text[pos:]))
    return out


new = []
tbl = []
cap = [None]


def flush():
    global tbl
    if tbl:
        rows = [[c.strip() for c in r.strip().strip("|").split("|")] for r in tbl if not set(r.strip()) <= set("|-: ")]
        new.append(dict(_type="comparisonTable", _key=K("t"), caption=cap[0], columns=rows[0],
                        rows=[dict(_key=K("r"), cells=r) for r in rows[1:]]))
        tbl = []
        cap[0] = None


for l in SRC.strip().split("\n"):
    if l.startswith("|"):
        tbl.append(l)
        continue
    flush()
    if l.startswith("^^ "):
        cap[0] = l[3:]
        continue
    md = []
    if l.startswith("## "):
        new.append(dict(_type="block", _key=K("b"), style="h2", markDefs=md, children=spans(l[3:], md)))
    elif l.strip():
        new.append(dict(_type="block", _key=K("b"), style="normal", markDefs=md, children=spans(l, md)))
flush()

NEW_AFF = dict(_key="r1014-aff-bali-lombok", _type="affiliateLink", partner="12go", placeholderId="12GO_BALI_LOMBOK",
               affiliateUrl="https://12go.asia/en/travel/bali/lombok?z=16022946",
               publicUrl="https://12go.asia/en/travel/bali/lombok",
               anchorText="Bali to Lombok flights and boats on 12Go", experienceCategory="transport",
               linkStatus="live", notes=None)

SEO_NOTE = ("2026-10-14 generator run, PARTE 3: applied docs/reinforce-10-days-bali-lombok-gili-islands.md "
            "sections 4.1 to 4.4 and link 5.1 (blocks with _key prefix r1014-). Baseline GSC 2026-09-14..10-11: "
            "page 33 impressions, 0 clicks; 'bali lombok gili islands' 12 impressions at position 49.2. "
            "metaTitle last changed 2026-09-18 (old value 'Bali, Lombok & Gili in 10 Days: Island-Hop Plan'). "
            "Do not retouch title/meta before 2026-10-17, nor content before 2026-11-11, when this is read.")

doc = q(f'*[_id=="{ID}"][0]{{_id,body,affiliateLinks,seoNote}}')
body = doc["body"]
if any(b.get("_key", "").startswith("r1014-") for b in body):
    print("skip: already applied")
    sys.exit(0)
idx = next(i for i, b in enumerate(body) if b.get("style") == "h2"
           and "".join(c.get("text", "") for c in b.get("children", [])).startswith("What to book early"))
new_body = body[:idx] + new + body[idx:]
aff = doc["affiliateLinks"]
if not any(a.get("placeholderId") == "12GO_BALI_LOMBOK" for a in aff):
    aff = aff + [NEW_AFF]

# validation (blocks the write)
txt = json.dumps(new, ensure_ascii=False).lower()
bad = ["—", "–", "hidden gem", "must-see", "paradise", "immerse yourself", "unforgettable",
       "something for everyone", "vibrant culture", "crystal-clear", "breathtaking", "rich history", "local charm",
       "authentic experience", "off the beaten path", "once-in-a-lifetime", "bucket list", "dream destination", "(search"]
fails = [b for b in bad if b in txt]
keys = re.findall(r'"_key": "([^"]+)"', json.dumps(new_body))
if len(keys) != len(set(keys)):
    fails.append("dup keys")
refs = {m["placeholderId"] for b in new_body for m in b.get("markDefs", []) if m["_type"] == "affiliateLinkRef"}
have = {a["placeholderId"]: a.get("affiliateUrl") for a in aff}
fails += ["aff " + r for r in refs if not have.get(r)]
print("insert at", idx, "new blocks", len(new), "body", len(body), "->", len(new_body), "aff", len(aff))
print("FAILS", fails)
if fails or "--commit" not in sys.argv:
    sys.exit(1 if fails else 0)

payload = {"mutations": [{"patch": {"id": ID, "set": {"body": new_body, "affiliateLinks": aff, "seoNote": SEO_NOTE}}}]}
req = urllib.request.Request(BASE + "/mutate/production", data=json.dumps(payload).encode(), headers=H, method="POST")
print("mutate", json.load(urllib.request.urlopen(req)).get("transactionId"))
back = q(f'*[_id=="{ID}"][0]{{"n":count(body),"r":count(body[_key match "r1014-*"]),'
         f'"aff":affiliateLinks[placeholderId=="12GO_BALI_LOMBOK"][0].affiliateUrl,"note":defined(seoNote)}}')
print("verified", back)
