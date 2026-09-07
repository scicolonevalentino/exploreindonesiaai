// One-off: lead the Raja Ampat honeymoon metaTitle with the head term
// (GSC review of 2026-09-07). "raja ampat honeymoon" takes 25 impressions at
// position 13.6 with zero clicks — striking distance, and the most transactional
// intent on the site (honeymoon means resorts and liveaboards, not day tours).
// The old title opened with the duration and buried "Honeymoon" at the end,
// where it carries least weight in the snippet.
//
// Deliberately NOT promising "Where to Stay": the article has no accommodation
// section, only "Day 2: settle into your resort" and "What to book early". Write
// that section first if you want the accommodation intent in the title.
//
// metaDescription is left alone — it already leads with the decision-led angle
// and reads well against this title.
//
// Old value, for a fast revert:
//   metaTitle: "10 Days in Raja Ampat: A Honeymoon Itinerary"
//
// Dry run by default, writes with --commit.
//
//   node scripts/patch-raja-ampat-honeymoon-title-2026-09-07.mjs
//   node scripts/patch-raja-ampat-honeymoon-title-2026-09-07.mjs --commit

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

const SLUG = "10-days-raja-ampat-honeymoon";
const NEW_META_TITLE = "Raja Ampat Honeymoon: A 10-Day Itinerary for Two";
const EXPECTED_OLD = "10 Days in Raja Ampat: A Honeymoon Itinerary";

async function fetchLive() {
  const query = encodeURIComponent(
    `*[_type == "article" && slug.current == $slug][0]{_id, title, metaTitle, metaDescription, "slug": slug.current}`,
  );
  const params = encodeURIComponent(JSON.stringify(SLUG));
  const res = await fetch(`${API}/data/query/${DS}?query=${query}&$slug=${params}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  const { result } = await res.json();
  return result;
}

async function main() {
  const live = await fetchLive();
  if (!live) {
    console.error(`No live document found for slug "${SLUG}"`);
    process.exit(1);
  }
  console.log("Live doc:", live);

  if (live.metaTitle === NEW_META_TITLE) {
    console.log("Already patched. Nothing to do.");
    return;
  }
  // Guard against patching over someone else's edit: if the live value is
  // neither the expected old title nor the new one, stop and let a human look.
  if (live.metaTitle !== EXPECTED_OLD) {
    console.error(
      `Unexpected live metaTitle:\n  found:    ${live.metaTitle}\n  expected: ${EXPECTED_OLD}\n` +
        "Someone edited this since the 2026-09-07 review. Not overwriting.",
    );
    process.exit(1);
  }

  const mutation = {
    mutations: [{ patch: { id: live._id, set: { metaTitle: NEW_META_TITLE } } }],
  };

  if (!COMMIT) {
    console.log("\nDRY RUN — would apply:");
    console.log(JSON.stringify(mutation, null, 2));
    console.log(`\n  ${EXPECTED_OLD}  (${EXPECTED_OLD.length} chars)`);
    console.log(`  ${NEW_META_TITLE}  (${NEW_META_TITLE.length} chars)`);
    console.log("\nRe-run with --commit to write.");
    return;
  }

  const res = await fetch(`${API}/data/mutate/${DS}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(mutation),
  });
  if (!res.ok) throw new Error(`Mutation failed: ${res.status} ${await res.text()}`);
  console.log("Committed.");

  const after = await fetchLive();
  console.log("Re-read after write:", after);
  if (after.metaTitle !== NEW_META_TITLE) {
    console.error("WARNING: re-read does not match expected value.");
    process.exit(1);
  }
  console.log("Verified live.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
