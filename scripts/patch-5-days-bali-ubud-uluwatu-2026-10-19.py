# PARTE 1 + PARTE 3, 2026-10-19 generator run, on /trips/5-days-bali-ubud-canggu-uluwatu.
# Follows the 07:30 GSC Monday report ("RINFORZA ... cluster ubud vs uluwatu").
# PARTE 1: metaTitle + metaDescription (old values in OLD_META and in seoNote).
# PARTE 3: three question-led H2 sections (Ubud or Uluwatu + table, what to do in
# Uluwatu, Uluwatu to Ubud), one FAQ swapped (old one kept in OLD_FAQ), a dated
# seoNote, and one inbound link from 7-days-bali-couples.
# Record: docs/reinforce-5-days-bali-ubud-canggu-uluwatu-2026-10-19.md.
# Idempotent; rewrites the whole body and faq arrays and reads back to verify.
#   python3 scripts/patch-5-days-bali-ubud-uluwatu-2026-10-19.py [--commit]
import json, os, re, sys, urllib.request, urllib.parse

ID = "27fa5aae-afe5-4993-90e7-6e7f7f3a47c0"
INBOUND_FROM = "f7235eaf-44b6-432a-bdc6-303199b002e8"  # 7-days-bali-couples
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


# Three chunks, each inserted before the H2 named in its key.
SRC = {
"Is Uluwatu worth a night": '''
## Ubud or Uluwatu: which is better for your stay?
Ubud for temples, rice terraces and cool inland evenings, Uluwatu for surf, cliff-backed beaches and the Kecak dance at sunset. Ubud sits about an hour from the nearest coast and costs less, while Uluwatu is 30 to 45 minutes from Ngurah Rai airport. With five days, do both: Ubud first, then finish on the cliffs.
The real dividing line is the beach. Ubud has none, so every sea day from there is a long drive out and a long drive back. Uluwatu has no rice terraces and no temple circuit beyond the clifftop Uluwatu Temple, so a week there is a beach week with one cultural evening. If you can only pick one, pick the trip you actually want, then check the trade-offs below.
^^ Ubud and Uluwatu side by side. Drive times are working estimates in normal traffic; driving between the two takes about two to three hours, longer in the late afternoon.
| | Ubud | Uluwatu |
|---|---|---|
| Setting | Inland, rice terraces, river valleys, cooler air | Southern limestone cliffs above the Indian Ocean |
| Beach | None, the nearest coast is about an hour away | Padang Padang, Bingin and Melasti sit below the cliffs |
| Signature evening | Early dinner and quiet streets | The Kecak dance at Uluwatu Temple, around 6pm |
| Distance to Ngurah Rai | About 1.5 hours, up to 2.5 in traffic | 30 to 45 minutes |
| Relative price | The lower of the two | High on the cliffs, mid-range inland |
| Skip it if | You want the sea outside the door | You care more about temples and walking than surf |
''',
"How far apart are Ubud": '''
## What is there to do in Uluwatu with one night?
Enough for one full afternoon and evening: a beach under the cliffs at Padang Padang, Bingin or Melasti, the clifftop Uluwatu Temple in the late afternoon, the Kecak fire dance there at around 6pm, then seafood in Jimbaran or dinner on the cliffs. Surfers add a dawn session; everyone else sleeps in before the airport run.
The order matters more than the list. The beaches suit the early afternoon, the temple and the Kecak dance need you on the cliff by about five, and the temple's resident monkeys are known for grabbing glasses and phones, so carry little. Day 4 below runs exactly that sequence, and the dance is the one item worth booking ahead.
''',
"Which one should you cut": '''
## How do you get from Uluwatu to Ubud?
By car. A private driver or a ride-hailing car takes about two to three hours in normal traffic, and longer in the late afternoon, because the route crosses the busy south of the island. Leave around midday if you can, and if you are not in a hurry, break the drive with a night in Canggu, which sits roughly halfway.
This itinerary avoids the long version of that drive by running north to south, Ubud first, so no single transfer is longer than about an hour and a half. If you are doing it the other way round, book a [[private car charter|KLOOK_UBUD_CANGGU_TRANSFER]] for the day rather than hailing a car at the cliffs, where pickups can be slow.
''',
}

cnt = [0]


def K(p):
    cnt[0] += 1
    return f"r1019-{p}{cnt[0]}"


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


def build(src):
    new, tbl, cap = [], [], [None]

    def flush():
        if tbl:
            rows = [[c.strip() for c in r.strip().strip("|").split("|")] for r in tbl if not set(r.strip()) <= set("|-: ")]
            new.append(dict(_type="comparisonTable", _key=K("t"), caption=cap[0], columns=rows[0],
                            rows=[dict(_key=K("r"), cells=r) for r in rows[1:]]))
            tbl.clear()
            cap[0] = None

    for l in src.strip().split("\n"):
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
    return new


OLD_META = dict(metaTitle="Ubud, Canggu or Uluwatu? Do All Three in 5 Days",
                metaDescription="Which base suits you, and how to fit all three in five days: 2 nights Ubud, 1 Canggu, 1 Uluwatu, north to south, with real drive times and costs.")
NEW_META = dict(metaTitle="Ubud vs Uluwatu vs Canggu: Where to Stay in 5 Days",
                metaDescription="Ubud for temples and rice terraces, Uluwatu for cliffs and surf, Canggu for cafes. How to split 5 days across all three, with real drive times.")
OLD_FAQ_Q = "Can I skip the early Mount Batur start?"
NEW_FAQ = dict(_key="r1019-faq-ubud-uluwatu", question="Is Ubud or Uluwatu better for a first trip to Bali?",
               answer="For most first trips, Ubud, because it has the temples, rice terraces and inland side of Bali that the beaches do not. Uluwatu is the better pick if surf, cliff-backed beaches and a short airport run matter more. With five days you do not have to choose: two nights in Ubud, then finish in Uluwatu.")
SEO_NOTE = ("2026-10-19 generator run. PARTE 1: metaTitle/metaDescription changed (old metaTitle '" + OLD_META["metaTitle"] +
            "'; old metaDescription '" + OLD_META["metaDescription"] + "'). PARTE 3: three H2 (Ubud or Uluwatu + table, what to do "
            "in Uluwatu, Uluwatu to Ubud), FAQ '" + OLD_FAQ_Q + "' swapped for the Ubud or Uluwatu FAQ, _key prefix r1019-, inbound "
            "link from 7-days-bali-couples. Baseline GSC 2026-09-19..10-16: page 621 impr, 5 clicks, pos 8.0; 'uluwatu vs ubud' 15 "
            "impr pos 9.7; 'ubud vs uluwatu' 8 pos 7.8; 'uluwatu to ubud' 9 pos 28.6; 'uluwatu to do' 7 pos 24.3. Do not retouch "
            "title/meta/content before 2026-11-16, when this is read. Previous rounds: 2026-08-26 (meta), 2026-08-29 (sections).")
INBOUND = dict(_type="block", _key="r1019-inb", style="normal",
               markDefs=[dict(_key="r1019-inb-l", _type="externalLink", href="/trips/5-days-bali-ubud-canggu-uluwatu", blank=False)],
               children=[dict(_type="span", _key="r1019-inb-a", marks=[], text="Torn between the jungle and the cliffs for your base? Our "),
                         dict(_type="span", _key="r1019-inb-b", marks=["r1019-inb-l"], text="Ubud or Uluwatu comparison"),
                         dict(_type="span", _key="r1019-inb-c", marks=[], text=" sets the two side by side, with the drive between them.")])

doc = q(f'*[_id=="{ID}"][0]{{_id,body,faq,seoNote,metaTitle,metaDescription,affiliateLinks}}')
body = doc["body"]
if any(b.get("_key", "").startswith("r1019-") for b in body):
    print("skip: already applied")
    sys.exit(0)
assert doc["metaTitle"] == OLD_META["metaTitle"] and doc["metaDescription"] == OLD_META["metaDescription"], "meta drifted"


def h2idx(b, prefix):
    return next(i for i, x in enumerate(b) if x.get("style") == "h2"
                and "".join(c.get("text", "") for c in x.get("children", [])).startswith(prefix))


new_body = list(body)
added = []
for anchor, src in SRC.items():
    blocks = build(src)
    i = h2idx(new_body, anchor)
    new_body = new_body[:i] + blocks + new_body[i:]
    added += blocks
faq = [NEW_FAQ if f.get("question") == OLD_FAQ_Q else f for f in doc["faq"]]
assert NEW_FAQ in faq, "old FAQ not found"

txt = (json.dumps(added, ensure_ascii=False) + json.dumps(NEW_META) + json.dumps(NEW_FAQ) + json.dumps(INBOUND)).lower()
bad = ["—", "–", "hidden gem", "must-see", "paradise", "immerse yourself", "unforgettable",
       "something for everyone", "vibrant culture", "crystal-clear", "crystal clear", "breathtaking", "rich history", "local charm",
       "authentic experience", "off the beaten path", "once-in-a-lifetime", "bucket list", "dream destination", "(search"]
fails = [b for b in bad if b in txt]
keys = re.findall(r'"_key": "([^"]+)"', json.dumps(new_body) + json.dumps(faq))
if len(keys) != len(set(keys)):
    fails.append("dup keys")
if len(NEW_META["metaTitle"]) > 60 or len(NEW_META["metaDescription"]) > 155:
    fails.append("meta length")
aff = {a["placeholderId"]: a.get("affiliateUrl") for a in doc["affiliateLinks"]}
for b in added:
    for m in b.get("markDefs", []):
        if m["_type"] == "affiliateLinkRef" and not aff.get(m["placeholderId"]):
            fails.append("affiliate missing " + m["placeholderId"])
for b in added:
    if b.get("style") == "h2":
        nxt = new_body[new_body.index(b) + 1]
        n = len("".join(c["text"] for c in nxt["children"]).split())
        print("  H2", "".join(c["text"] for c in b["children"]), "-> first para words", n)
print("body", len(body), "->", len(new_body), "faq", len(faq), "meta", len(NEW_META["metaTitle"]), len(NEW_META["metaDescription"]))
print("FAILS", fails)
if fails or "--commit" not in sys.argv:
    sys.exit(1 if fails else 0)

src_doc = q(f'*[_id=="{INBOUND_FROM}"][0]{{body}}')
src_body = src_doc["body"]
muts = [{"patch": {"id": ID, "set": {"body": new_body, "faq": faq, "seoNote": SEO_NOTE, **NEW_META}}}]
if "/trips/5-days-bali-ubud-canggu-uluwatu" not in json.dumps(src_body):
    muts.append({"patch": {"id": INBOUND_FROM, "set": {"body": src_body + [INBOUND]}}})
else:
    print("inbound: couples article already links here, skipped")
req = urllib.request.Request(BASE + "/mutate/production", data=json.dumps({"mutations": muts}).encode(), headers=H, method="POST")
print("mutate", json.load(urllib.request.urlopen(req)).get("transactionId"))
back = q(f'*[_id=="{ID}"][0]{{"n":count(body),"r":count(body[_key match "r1019-*"]),"faq":faq[].question,metaTitle,metaDescription,"note":defined(seoNote)}}')
print("verified", back)
print("inbound", q(f'count(*[_id=="{INBOUND_FROM}" && "/trips/5-days-bali-ubud-canggu-uluwatu" in body[].markDefs[].href])'))
