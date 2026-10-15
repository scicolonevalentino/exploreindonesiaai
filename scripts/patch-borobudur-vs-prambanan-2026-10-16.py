# 2026-10-16: applies action 2 of the GSC Monday insights of 2026-10-12 to the guide
# /destinations/java/borobudur-vs-prambanan (doc guide-java-borobudur-vs-prambanan):
# question H2, 52-word lead, comparison table in place of the four bullets, the
# Prambanan distance fixed (it is not "about an hour" from Yogyakarta), and a Viator
# driver link (product 174091P52, verified live 2026-10-16). Rewrites the whole body,
# reads back. Idempotent.  python3 scripts/patch-borobudur-vs-prambanan-2026-10-16.py [--commit]
import json, os, sys, urllib.request, urllib.parse
ID = "guide-java-borobudur-vs-prambanan"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
env = {}
for l in open(os.path.join(ROOT, ".env.local")):
    if "=" in l and not l.strip().startswith("#"):
        k, v = l.split("=", 1); env[k.strip()] = v.strip().strip("\"'")
H = {"Authorization": "Bearer " + env["SANITY_API_WRITE_TOKEN"], "Content-Type": "application/json"}
B = "https://u4ah1ore.api.sanity.io/v2024-01-01/data"
def q(s):
    return json.load(urllib.request.urlopen(urllib.request.Request(B + "/query/production?query=" + urllib.parse.quote(s), headers=H)))["result"]
VIATOR = ("https://www.viator.com/tours/Yogyakarta/Yogyakarta-Transport-English-speaking-driver/d22560-174091P52"
          "?pid=P00303362&mcid=42383&medium=link&campaign=BorobudurVsPrambanan")
doc = q(f'*[_id=="{ID}"][0]{{body,intro,seoNote}}')
body = doc["body"]
if any(b.get("_key") == "bp16-table" for b in body):
    print("skip: already applied"); sys.exit(0)
old_h2 = next(b for b in body if b["_key"] == "b7")
old_bullets = [b for b in body if b["_key"] in ("b8", "b9", "b10", "b11")]
old_b13 = next(b for b in body if b["_key"] == "b13")
lead = dict(_type="block", _key="bp16-lead", style="normal", markDefs=[], children=[dict(_type="span", _key="bp16-lead-s", marks=[], text=
    "Borobudur is the larger, older Buddhist monument and the better sunrise visit; Prambanan is the taller Hindu complex, closer to Yogyakarta and best in late afternoon. If you have one morning, choose Borobudur. If you have one afternoon or want the Ramayana ballet, choose Prambanan. Most travellers do both in one day with a driver.")])
rows = [
    ["Religion", "Buddhist (Mahayana)", "Hindu (Shiva, Vishnu, Brahma)"],
    ["Built", "8th to 9th century", "Around 850 AD"],
    ["Scale", "9 stacked platforms, 504 Buddha statues, 2,672 relief panels", "240 temples originally; the main Shiva temple is 47 m tall"],
    ["From Yogyakarta", "About 40 km northwest, 1 to 1.5 hours by car", "About 17 km east, 30 to 45 minutes"],
    ["Best time", "Sunrise", "Late afternoon, and Ramayana ballet evenings"],
    ["Climbing", "Upper terraces only on a guided climb ticket, daily quota", "Walk at ground level and enter the shrines"],
    ["UNESCO listed", "1991", "1991"],
]
table = dict(_type="comparisonTable", _key="bp16-table", columns=["", "Borobudur", "Prambanan"],
             caption="Source: UNESCO World Heritage List, sites 592 (Borobudur) and 642 (Prambanan). Driving times are working estimates and vary with traffic.",
             rows=[dict(_key=f"bp16-r{i}", cells=r) for i, r in enumerate(rows)])
new_body = []
for b in body:
    k = b["_key"]
    if k == "b7":
        nb = json.loads(json.dumps(b)); nb["children"][0]["text"] = "How do Borobudur and Prambanan compare?"
        nb["children"] = nb["children"][:1]; new_body += [nb, lead, table]
    elif k in ("b8", "b9", "b10", "b11"):
        continue
    elif k == "b13":
        nb = json.loads(json.dumps(b)); txt = "".join(c["text"] for c in nb["children"])
        assert "a single full day with a driver" in txt and len(nb["children"]) > 0
        out = []
        for c in nb["children"]:
            t = c["text"]
            if "a single full day with a driver" in t and not c["marks"]:
                a, z = t.split("a single full day with a driver", 1)
                if a: out.append(dict(c, _key=c["_key"] + "a", text=a))
                out.append(dict(_type="span", _key=c["_key"] + "v", marks=["bp16-viator"], text="a single full day with a driver"))
                if z: out.append(dict(c, _key=c["_key"] + "z", text=z))
            else:
                out.append(c)
        nb["children"] = out
        nb["markDefs"] = nb.get("markDefs", []) + [dict(_key="bp16-viator", _type="externalLink", href=VIATOR, blank=True)]
        new_body.append(nb)
    else:
        new_body.append(b)
old_intro = doc["intro"]
new_intro = old_intro.replace("Both temples sit about an hour from Yogyakarta in opposite directions, and most travellers visit both.",
    "The two temples sit on opposite sides of Yogyakarta, Borobudur about an hour to the northwest and Prambanan under an hour to the east, and most travellers visit both.")
assert new_intro != old_intro
note = ("2026-10-16: applied GSC Monday insights 2026-10-12 action 2. Baseline 28d to 2026-10-09: 445 impressions at 7.3, "
        "'borobudur/prambanan vs/or' cluster 65 impressions at 5.9, 1 click. Old H2 b7 'How they compare'; old bullets b8-b11 "
        "(incl. wrong 'Both are about an hour from Yogyakarta'); old intro sentence 'Both temples sit about an hour from Yogyakarta "
        "in opposite directions, and most travellers visit both.' Read on 2026-11-09: vs cluster under position 5, page above "
        "100 impressions a week, first Viator click (campaign BorobudurVsPrambanan).")
txt = json.dumps(new_body, ensure_ascii=False) + new_intro
bad = ["—", "–", "paradise", "must-see", "breathtaking", "hidden gem", "unforgettable"]
fails = [x for x in bad if x in txt.lower()]
keys = [b["_key"] for b in new_body]
if len(keys) != len(set(keys)): fails.append("dup keys")
print("body", len(body), "->", len(new_body), "FAILS", fails)
if fails or "--commit" not in sys.argv: sys.exit(1 if fails else 0)
req = urllib.request.Request(B + "/mutate/production", method="POST", headers=H, data=json.dumps(
    {"mutations": [{"patch": {"id": ID, "set": {"body": new_body, "intro": new_intro, "seoNote": note}}}]}).encode())
print("mutate", json.load(urllib.request.urlopen(req)).get("transactionId"))
back = q(f'*[_id=="{ID}"][0]{{"h2":body[_key=="b7"][0].children[0].text,"t":count(body[_type=="comparisonTable"]),"v":count(body[].markDefs[href match "*174091P52*"]),"intro":intro}}')
print("verified", back)
