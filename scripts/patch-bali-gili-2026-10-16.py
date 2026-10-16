# PARTE 1 + PARTE 3, 2026-10-16 generator run, on /trips/10-days-bali-gili-islands.
# PARTE 1: metaTitle + metaDescription (old values kept in OLD_META and in seoNote).
# PARTE 3: two question-led H2 sections (Lombok add-on, tour vs independent) with one
# comparison table, inserted before "Where should you stay on a Bali and Gili trip?",
# plus one FAQ and a dated seoNote. Record: docs/reinforce-10-days-bali-gili-islands-2026-10-16.md.
# Idempotent; rewrites the whole body and faq arrays and reads back to verify.
#   python3 scripts/patch-bali-gili-2026-10-16.py [--commit]
import json, os, re, sys, urllib.request, urllib.parse

ID = "5f2db4e8-efa0-4b1b-9fe3-657193995076"
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
## Should you add Lombok to a Bali and Gili Islands trip?
Not on a ten-day trip that already covers Ubud, Canggu and Uluwatu. Lombok needs a car and at least two nights before it pays back, so adding it means cutting a Bali base, not squeezing in a day. If Lombok's south coast or waterfalls matter more to you than Canggu, swap Canggu out rather than adding a fifth stop.
The Gilis sit just off Lombok's northwest coast, and the public boat from Bangsal takes 15 to 30 minutes, so the swap is easy on the map. Our [[10-day Bali, Lombok and Gili Islands route|/trips/10-days-bali-lombok-gili-islands]] is built exactly that way, and the [[Lombok to Gili Islands transport guide|/transport/lombok-to-gili-islands]] covers the crossing.
## Should you book a Bali and Gili Islands tour, or do it on your own?
Do it on your own if you are comfortable booking a fast boat and four hotels: this route has no permits, no remote legs and only two boat days, so a tour mostly buys you convenience. Book a small-group tour if you are travelling alone and want company, or if you would rather not manage the boat and the transfers at all.
Packaged small-group versions of this route usually run 10 to 13 days, and one operator lists a 13-day Bali and Gilis trip from about 1,550 US dollars per person before flights. Building the same ten days yourself at a mid-range level usually costs less; our [[Indonesia travel costs guide|/indonesia-travel-costs]] has the daily ranges.
^^ Independent trip or small-group tour on the Bali and Gili route. Tour prices vary by operator and season; treat these as working estimates.
| What matters | Do it yourself | Small-group or packaged tour |
|---|---|---|
| What you book | Four hotels, two fast boat crossings, a few drivers | One booking, transfers and boats included |
| Typical length | Ten days works well | Usually 10 to 13 days |
| Flexibility | Change the order, extend the Gilis, skip a day | Fixed dates, fixed hotels, fixed pace |
| Cost | Usually lower at a mid-range level | Higher, from about 1,550 US dollars per person on one 13-day listing |
| Best for | Couples and friends who like to plan | Solo travellers who want company, or anyone short on planning time |
| Weak point | You carry the boat risk yourself | Less time to linger where you like it |
'''

cnt = [0]


def K(p):
    cnt[0] += 1
    return f"r1016-{p}{cnt[0]}"


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

OLD_META = dict(metaTitle="Bali and the Gili Islands: How to Combine Them in 10 Days",
                metaDescription="Bali and the Gili Islands work as one trip if you get the boat right. Ubud, Canggu, Gili Trawangan, then Uluwatu, with honest transfer days.")
NEW_META = dict(metaTitle="Bali and Gili Islands Itinerary: 10 Days, Route and Boats",
                metaDescription="A 10-day Bali and Gili Islands itinerary: Ubud, Canggu, three nights on Gili Trawangan, then Uluwatu by the airport, with the fast boat days planned.")
NEW_FAQ = dict(_key="r1016-faq-lombok", question="Can you add Lombok to a 10-day Bali and Gili Islands trip?",
               answer="You can, but only by swapping out a Bali base such as Canggu, not by adding a stop. Lombok needs a car and at least two nights to be worth it. The Gilis are 15 to 30 minutes by public boat from Bangsal on Lombok, so the swap is simple once you are on the islands.")
SEO_NOTE = ("2026-10-16 generator run. PARTE 1: metaTitle/metaDescription changed (old metaTitle '" + OLD_META["metaTitle"] +
            "'; old metaDescription '" + OLD_META["metaDescription"] + "'). PARTE 3: two H2 sections (Lombok add-on, tour vs "
            "independent) + 1 table + 1 FAQ, _key prefix r1016-. Baseline GSC 2026-09-16..10-13: page 650 impr, 7 clicks, "
            "pos 10.2; 'bali and gili islands' 23 impr pos 40.1; 'bali gili islands' 14 impr pos 29.9; 'gili island to bali' "
            "9 impr pos 39.1. Do not retouch title/meta/content before 2026-11-13, when this is read. Previous round: 2026-09-05.")

doc = q(f'*[_id=="{ID}"][0]{{_id,body,faq,seoNote,metaTitle,metaDescription}}')
body = doc["body"]
if any(b.get("_key", "").startswith("r1016-") for b in body):
    print("skip: already applied")
    sys.exit(0)
assert doc["metaTitle"] == OLD_META["metaTitle"] and doc["metaDescription"] == OLD_META["metaDescription"], "meta drifted"
idx = next(i for i, b in enumerate(body) if b.get("style") == "h2"
           and "".join(c.get("text", "") for c in b.get("children", [])).startswith("Where should you stay"))
new_body = body[:idx] + new + body[idx:]
faq = doc["faq"] + [NEW_FAQ]

txt = (json.dumps(new, ensure_ascii=False) + json.dumps(NEW_META) + json.dumps(NEW_FAQ)).lower()
bad = ["—", "–", "hidden gem", "must-see", "paradise", "immerse yourself", "unforgettable",
       "something for everyone", "vibrant culture", "crystal-clear", "crystal clear", "breathtaking", "rich history", "local charm",
       "authentic experience", "off the beaten path", "once-in-a-lifetime", "bucket list", "dream destination", "(search"]
fails = [b for b in bad if b in txt]
keys = re.findall(r'"_key": "([^"]+)"', json.dumps(new_body) + json.dumps(faq))
if len(keys) != len(set(keys)):
    fails.append("dup keys")
if len(NEW_META["metaTitle"]) > 60 or len(NEW_META["metaDescription"]) > 155:
    fails.append("meta length")
if len(faq) > 8:
    fails.append("faq > 8")
print("insert at", idx, "new blocks", len(new), "body", len(body), "->", len(new_body), "faq", len(faq),
      "meta", len(NEW_META["metaTitle"]), len(NEW_META["metaDescription"]))
print("FAILS", fails)
if fails or "--commit" not in sys.argv:
    sys.exit(1 if fails else 0)

payload = {"mutations": [{"patch": {"id": ID, "set": {"body": new_body, "faq": faq, "seoNote": SEO_NOTE, **NEW_META}}}]}
req = urllib.request.Request(BASE + "/mutate/production", data=json.dumps(payload).encode(), headers=H, method="POST")
print("mutate", json.load(urllib.request.urlopen(req)).get("transactionId"))
back = q(f'*[_id=="{ID}"][0]{{"n":count(body),"r":count(body[_key match "r1016-*"]),"faq":count(faq),metaTitle,metaDescription,"note":defined(seoNote)}}')
print("verified", back)
