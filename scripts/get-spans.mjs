import { createClient } from "@sanity/client";
const c = createClient({
  projectId: "u4ah1ore",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
const targets = [
  {
    id: "4aeb3acb-1f7b-41ef-bca3-334f4d2f7405",
    blocks: [
      ["9ee58f51a9f6", "2c120e76-7a6"],
      ["ae4eb44a4b33", "403a59e5-738"],
      ["078337fb3576", "607c65f2-8ae"],
    ],
  },
  { id: "5ecb315e-5725-4684-a9c4-6d64d16b55b2", blocks: [["cca4e112eb3d", "c0ce1487-ae1"]] },
];
const ids = targets.map((t) => t.id);
const arts = await c.fetch(`*[_id in $ids]{_id, body}`, { ids });
for (const t of targets) {
  const a = arts.find((x) => x._id === t.id);
  console.log("===", t.id);
  for (const [bk, mk] of t.blocks) {
    const b = a.body.find((x) => x._key === bk);
    if (!b) {
      console.log("  NO BLOCK", bk);
      continue;
    }
    const spans = b.children.filter((c) => (c.marks || []).includes(mk));
    console.log(
      `  block ${bk} mark ${mk}: spans ->`,
      spans.map((s) => s._key),
    );
  }
}
