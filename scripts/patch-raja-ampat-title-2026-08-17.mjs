// One-off: retarget the Raja Ampat 14-day metaTitle/metaDescription onto the
// broader "raja ampat itinerary 14 days" intent (GSC review of 2026-08-17).
// That query sits at position 6.2 with 9 impressions and 0 clicks; the old
// title promised "Diving Trip / Liveaboard", narrower than the query, so
// nobody clicked. Dry run by default, writes with --commit.
//
//   node scripts/patch-raja-ampat-title-2026-08-17.mjs
//   node scripts/patch-raja-ampat-title-2026-08-17.mjs --commit

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

const SLUG = "14-days-raja-ampat-divers";
const NEW_META_TITLE = "Raja Ampat 14-Day Itinerary: Diving & Island Route";
const NEW_META_DESCRIPTION =
  "A complete 14-day Raja Ampat itinerary: which islands, how many days each, liveaboard vs homestay, and what it costs. Built for divers and first-timers alike.";

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
  const DOC_ID = live._id;

  if (live.metaTitle === NEW_META_TITLE && live.metaDescription === NEW_META_DESCRIPTION) {
    console.log("Already patched. Nothing to do.");
    return;
  }

  const mutation = {
    mutations: [
      {
        patch: {
          id: DOC_ID,
          set: {
            metaTitle: NEW_META_TITLE,
            metaDescription: NEW_META_DESCRIPTION,
          },
        },
      },
    ],
  };

  if (!COMMIT) {
    console.log("\nDRY RUN — would apply:");
    console.log(JSON.stringify(mutation, null, 2));
    console.log("\nRe-run with --commit to write.");
    return;
  }

  const res = await fetch(`${API}/data/mutate/${DS}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mutation),
  });
  if (!res.ok) throw new Error(`Mutation failed: ${res.status} ${await res.text()}`);
  console.log("Committed.");

  const after = await fetchLive();
  console.log("Re-read after write:", after);
  if (after.metaTitle !== NEW_META_TITLE || after.metaDescription !== NEW_META_DESCRIPTION) {
    console.error("WARNING: re-read does not match expected values.");
    process.exit(1);
  }
  console.log("Verified live.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
