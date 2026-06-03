import { createClient } from "@sanity/client";
import { writeFileSync } from "node:fs";

const client = createClient({
  projectId: "u4ah1ore",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Affiliate URL replacements (search-URL → affiliate URL).
// Keyed by [articleId, blockKey, markKey].
const REPLACE = [
  // 7-days-yogyakarta-east-java — Bromo+Ijen overland
  {
    id: "1cbc5d3e-f533-4054-aacf-66ac315b977b",
    block: "k66",
    mark: "k64",
    href: "https://affiliate.klook.com/redirect?aid=123067&aff_adid=1292181&k_site=https%3A%2F%2Fwww.klook.com%2Fen-AE%2Factivity%2F84551-3-day-mount-bromo-ijen-volcano-private-tour-yogyakarta%2F",
  },
  // 14-days-indonesia-bali-java-komodo — Komodo speedboat
  {
    id: "857f06dd-b72a-4824-b3cf-4d2a117b1170",
    block: "b16",
    mark: "me",
    href: "https://affiliate.klook.com/redirect?aid=123067&aff_adid=1292206&k_site=https%3A%2F%2Fwww.klook.com%2Factivity%2F55119-full-day-speedboat-tour-komodo-labuan-bajo%2F",
  },
  // 14-days-indonesia-bali-java-komodo — Rangko Cave
  {
    id: "857f06dd-b72a-4824-b3cf-4d2a117b1170",
    block: "b18",
    mark: "mf",
    href: "https://affiliate.klook.com/redirect?aid=123067&aff_adid=1292204&k_site=https%3A%2F%2Fwww.klook.com%2Factivity%2F89685-rangko-cave-half-day-labuan-bajo%2F",
  },
  // 15-days-indonesia-honeymoon — Rangko Cave
  {
    id: "e7dbf53d-300a-4cbf-a0ce-b374cd0e161a",
    block: "k109",
    mark: "k107",
    href: "https://affiliate.klook.com/redirect?aid=123067&aff_adid=1292204&k_site=https%3A%2F%2Fwww.klook.com%2Factivity%2F89685-rangko-cave-half-day-labuan-bajo%2F",
  },
  // 15-days-indonesia-honeymoon — Sumba Weekuri Lagoon
  {
    id: "e7dbf53d-300a-4cbf-a0ce-b374cd0e161a",
    block: "k127",
    mark: "k125",
    href: "https://www.viator.com/Sumba-attractions/Waikuri-Lagoon-Weekuri-Lake/d50661-a102709?pid=P00303362&mcid=42383&medium=link&campaign=SouthwestSumbadaytourWeekuriLagoonMandorak",
  },
  // 14-days-bali-komodo-sumba — Sumba Weekuri Lagoon
  {
    id: "f190d9bd-2ed6-42c6-8388-b7c798ff1fea",
    block: "k107",
    mark: "k105",
    href: "https://www.viator.com/Sumba-attractions/Waikuri-Lagoon-Weekuri-Lake/d50661-a102709?pid=P00303362&mcid=42383&medium=link&campaign=SouthwestSumbadaytourWeekuriLagoonMandorak",
  },
];

// Orphan body anchors — unlink (remove markDef + strip mark from spans).
const UNLINK = [
  // 7-days-bali-solo-travellers — Bali spa massage
  { id: "28bac5f8-9b32-4528-970c-1387f166e371", block: "k104", mark: "k101" },
  // 10-days-komodo-flores — Kelimutu sunrise
  { id: "45b532c0-f84e-4aca-9182-1736731c79b4", block: "k111", mark: "k109" },
  // 15-days-sumatra — Sibayak, Sipiso-Piso, Lake Toba Batak
  { id: "4aeb3acb-1f7b-41ef-bca3-334f4d2f7405", block: "9ee58f51a9f6", mark: "2c120e76-7a6" },
  { id: "4aeb3acb-1f7b-41ef-bca3-334f4d2f7405", block: "ae4eb44a4b33", mark: "403a59e5-738" },
  { id: "4aeb3acb-1f7b-41ef-bca3-334f4d2f7405", block: "078337fb3576", mark: "607c65f2-8ae" },
  // 20-days-wild-indonesia — Tana Toraja
  { id: "5ecb315e-5725-4684-a9c4-6d64d16b55b2", block: "cca4e112eb3d", mark: "c0ce1487-ae1" },
];

const ids = [...new Set([...REPLACE.map((r) => r.id), ...UNLINK.map((u) => u.id)])];
const articles = await client.fetch(`*[_id in $ids]{_id, title, body}`, { ids });

const out = {};
for (const art of articles) {
  const body = JSON.parse(JSON.stringify(art.body));
  for (const r of REPLACE.filter((x) => x.id === art._id)) {
    const blk = body.find((b) => b._key === r.block);
    if (!blk) {
      console.error("MISSING BLOCK", art._id, r.block);
      continue;
    }
    const md = (blk.markDefs ?? []).find((m) => m._key === r.mark);
    if (!md) {
      console.error("MISSING MARK", art._id, r.block, r.mark);
      continue;
    }
    md.href = r.href;
  }
  for (const u of UNLINK.filter((x) => x.id === art._id)) {
    const blk = body.find((b) => b._key === u.block);
    if (!blk) {
      console.error("MISSING BLOCK", art._id, u.block);
      continue;
    }
    blk.markDefs = (blk.markDefs ?? []).filter((m) => m._key !== u.mark);
    for (const child of blk.children ?? []) {
      if (Array.isArray(child.marks)) {
        child.marks = child.marks.filter((m) => m !== u.mark);
      }
    }
  }
  out[art._id] = { title: art.title, body };
}

writeFileSync("/tmp/patches.json", JSON.stringify(out, null, 2));
console.log("Wrote /tmp/patches.json with", Object.keys(out).length, "articles");
for (const id of Object.keys(out)) console.log("-", id, "—", out[id].title);
