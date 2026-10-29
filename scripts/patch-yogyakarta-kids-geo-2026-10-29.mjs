// One-off: /trips/8-days-yogyakarta-central-java-with-kids — title and a tours
// answer block (GSC review of 2026-10-29).
//
// WHY. The page takes ~45 named impressions at positions 8.5 to 10.5 with zero
// clicks, on two phrasings the snippet does not carry:
//   "plan an itinerary for yogyakarta for a family with kids"   21 impr, pos 10.5
//   "yogyakarta itinerary for families kid-friendly tours
//    getyourguide prambanan borobudur"                          15 impr, pos 8.5
//   "yogyakarta with kids"                                       7 impr, pos 16.9
// The metaTitle has neither "itinerary" nor "family". The second query is an
// AI-agent fan-out asking for bookable tours, and the page answers that only in
// scattered "Booking logic" lines under Day 3 and Day 5, never under a question.
//
// WHAT.
//   1. metaTitle -> "Yogyakarta Itinerary With Kids: 8-Day Family Plan" (49 chars).
//   2. New H2 "Which Yogyakarta tours work best with kids?" plus a 57-word answer,
//      inserted at the end of "What to book early, and what to keep flexible".
//      It links the two affiliate links the article already holds (Viator
//      Borobudur+Prambanan, Klook Merapi jeep); no new partner is added.
//   3. A matching FAQ entry, which feeds the FAQPage JSON-LD.
//
// Every claim is lifted from the article itself: daytime temple visits, the
// capped upper-terrace slot, the mid-morning jeep priced per vehicle, the tour
// bundling driver and entry. Nothing new is asserted.
//
// Old value, for a fast revert:
//   metaTitle: "Yogyakarta With Kids: 8-Day Central Java Plan"
//
// Read on 2026-11-23: group position for the cluster under 8 and a first click.
//
// Dry run by default, writes with --commit.
//
//   node scripts/patch-yogyakarta-kids-geo-2026-10-29.mjs
//   node scripts/patch-yogyakarta-kids-geo-2026-10-29.mjs --commit

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMMIT = process.argv.includes("--commit");
const PROJECT = "u4ah1ore";
const DS = "production";
const API = `https://${PROJECT}.api.sanity.io/v2021-06-07`;

const TOKEN = (readFileSync(join(ROOT, ".env.local"), "utf8").match(
  /^SANITY_API_WRITE_TOKEN=(.+)$/m,
) || [])[1]?.trim();
if (!TOKEN) {
  console.error("No SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const SLUG = "8-days-yogyakarta-central-java-with-kids";
const NEW_META_TITLE = "Yogyakarta Itinerary With Kids: 8-Day Family Plan";
const EXPECTED_OLD = "Yogyakarta With Kids: 8-Day Central Java Plan";
// Last block of "What to book early, and what to keep flexible" ("Keep flexible: ...").
const ANCHOR_KEY = "k0161";
const MARKER_KEY = "geo1029yogh2";

const H2 = {
  _key: MARKER_KEY,
  _type: "block",
  style: "h2",
  markDefs: [],
  children: [
    {
      _key: "geo1029yogh2s",
      _type: "span",
      marks: [],
      text: "Which Yogyakarta tours work best with kids?",
    },
  ],
};

const ANSWER = {
  _key: "geo1029yogp1",
  _type: "block",
  style: "normal",
  markDefs: [
    {
      _key: "geo1029yogm1",
      _type: "affiliateLinkRef",
      placeholderId: "VIATOR_YOGYA_BOROBUDUR_PRAMBANAN",
    },
    { _key: "geo1029yogm2", _type: "affiliateLinkRef", placeholderId: "KLOOK_MERAPI_JEEP" },
  ],
  children: [
    { _key: "geo1029yogs1", _type: "span", marks: [], text: "Three, all booked ahead: " },
    {
      _key: "geo1029yogs2",
      _type: "span",
      marks: ["geo1029yogm1"],
      text: "a guided Borobudur and Prambanan day tour",
    },
    {
      _key: "geo1029yogs3",
      _type: "span",
      marks: [],
      text: ", which bundles the driver and entry tickets; ",
    },
    {
      _key: "geo1029yogs4",
      _type: "span",
      marks: ["geo1029yogm2"],
      text: "a private Merapi jeep tour",
    },
    {
      _key: "geo1029yogs5",
      _type: "span",
      marks: [],
      text: " on a mid-morning slot, priced per jeep so one fits a family; and the Borobudur upper-terrace slot if your kids want to climb, since daily numbers are capped. With younger kids, skip the sunrise versions.",
    },
  ],
};

const FAQ = {
  _key: "geo1029yogfaq",
  question: "Which Yogyakarta tours are best for families with kids?",
  answer:
    "A guided Borobudur and Prambanan day tour, which bundles the driver and entry tickets, and a private Merapi jeep tour on a mid-morning slot, priced per jeep so one fits a family. Book the Borobudur upper-terrace slot ahead if your kids want to climb, since daily numbers are capped, and skip the sunrise versions with younger children.",
};

const BLOCKS = [H2, ANSWER];

async function fetchLive() {
  const query = encodeURIComponent(
    `*[_type == "article" && slug.current == $slug][0]{_id, metaTitle, "keys": body[]._key, "faqKeys": faq[]._key, "links": affiliateLinks[].placeholderId}`,
  );
  const params = encodeURIComponent(JSON.stringify(SLUG));
  const res = await fetch(`${API}/data/query/${DS}?query=${query}&$slug=${params}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

async function main() {
  const live = await fetchLive();
  if (!live) {
    console.error(`No live article for slug "${SLUG}"`);
    process.exit(1);
  }
  if (live.keys.includes(MARKER_KEY)) {
    console.log("Already applied (marker key present). Nothing to do.");
    return;
  }
  if (live.metaTitle !== EXPECTED_OLD && live.metaTitle !== NEW_META_TITLE) {
    console.error(
      `Unexpected live metaTitle:\n  found:    ${live.metaTitle}\n  expected: ${EXPECTED_OLD}\n` +
        "Someone edited this since the 2026-10-29 review. Not overwriting.",
    );
    process.exit(1);
  }
  if (!live.keys.includes(ANCHOR_KEY)) {
    console.error(`Anchor block ${ANCHOR_KEY} is gone. Aborting.`);
    process.exit(1);
  }
  const needed = ANSWER.markDefs.map((m) => m.placeholderId);
  const missingLinks = needed.filter((p) => !(live.links || []).includes(p));
  if (missingLinks.length) {
    console.error("Affiliate links missing on the article:", missingLinks);
    process.exit(1);
  }
  const clash = [...BLOCKS.map((b) => b._key), FAQ._key].filter(
    (k) => live.keys.includes(k) || (live.faqKeys || []).includes(k),
  );
  if (clash.length) {
    console.error("Key collision:", clash);
    process.exit(1);
  }

  const words = ANSWER.children
    .map((c) => c.text)
    .join("")
    .split(/\s+/).length;
  console.log(
    `  metaTitle: "${live.metaTitle}"\n         -> "${NEW_META_TITLE}" (${NEW_META_TITLE.length} chars)`,
  );
  console.log(`  + H2 "${H2.children[0].text}" and a ${words}-word answer after ${ANCHOR_KEY}`);
  console.log(`  + FAQ "${FAQ.question}"`);

  if (!COMMIT) {
    console.log("\nDry run. Re-run with --commit to write.");
    return;
  }

  const mutations = [
    { patch: { id: live._id, set: { metaTitle: NEW_META_TITLE } } },
    { patch: { id: live._id, insert: { after: `body[_key=="${ANCHOR_KEY}"]`, items: BLOCKS } } },
    { patch: { id: live._id, insert: { after: "faq[-1]", items: [FAQ] } } },
  ];
  const res = await fetch(`${API}/data/mutate/${DS}?returnIds=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate failed: ${res.status} ${await res.text()}`);
  console.log("Written.", JSON.stringify(await res.json()));

  // Re-read: key-based patches can silently no-op on this dataset.
  const after = await fetchLive();
  const missing = BLOCKS.map((b) => b._key).filter((k) => !after.keys.includes(k));
  if (after.metaTitle !== NEW_META_TITLE || missing.length || !after.faqKeys.includes(FAQ._key)) {
    console.error("VERIFY FAILED.", { metaTitle: after.metaTitle, missing, faq: after.faqKeys });
    process.exit(1);
  }
  console.log(
    `Verified: ${after.keys.length} blocks now (was ${live.keys.length}), title and FAQ set.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
