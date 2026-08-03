// Google Search Console -> strategic weekly insights for exploreindonesia.ai.
//
//   node scripts/gsc-insights.mjs                 # last 28d vs the 28d before
//   node scripts/gsc-insights.mjs --days 7        # shorter window
//   node scripts/gsc-insights.mjs --json out.json # also dump the raw rows
//
// AUTH: Application Default Credentials (user account), because the org policy
// iam.disableServiceAccountKeyCreation blocks service-account keys. Re-auth with:
//   gcloud auth application-default login \
//     --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform
// The account must own the GSC property. A raw fetch() also has to send
// x-goog-user-project explicitly — ADC's stored quota project only applies to
// Google's own client libraries.
//
// GSC data lags ~2-3 days, so every window here ends 3 days ago. History goes
// back 16 months, which is why a baseline is never really lost.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------- config --------------------------------- */

function envFromFile() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    return Object.fromEntries(
      raw
        .split("\n")
        .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
        .map((l) => {
          const i = l.indexOf("=");
          return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
        }),
    );
  } catch {
    return {};
  }
}

const env = { ...envFromFile(), ...process.env };
const SITE = env.GSC_SITE_URL;
const QUOTA_PROJECT = env.GSC_QUOTA_PROJECT;

if (!SITE || !QUOTA_PROJECT) {
  console.error("Missing GSC_SITE_URL / GSC_QUOTA_PROJECT (see .env.local).");
  process.exit(1);
}

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const WINDOW = Number(arg("days", 28));

/* -------------------------------- dates --------------------------------- */

const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};

const LAG = 3;
const curEnd = iso(daysAgo(LAG));
const curStart = iso(daysAgo(LAG + WINDOW - 1));
const prevEnd = iso(daysAgo(LAG + WINDOW));
const prevStart = iso(daysAgo(LAG + WINDOW * 2 - 1));

/* --------------------------------- api ---------------------------------- */

let TOKEN;
function token() {
  if (TOKEN) return TOKEN;
  try {
    TOKEN = execFileSync("gcloud", ["auth", "application-default", "print-access-token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    console.error(
      "Could not mint an access token. Run:\n" +
        "  gcloud auth application-default login \\\n" +
        "    --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform",
    );
    process.exit(1);
  }
  return TOKEN;
}

async function query(body) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "x-goog-user-project": QUOTA_PROJECT,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.error) throw new Error(`GSC ${json.error.code}: ${json.error.message}`);
  return json.rows ?? [];
}

const period = (startDate, endDate) => ({ startDate, endDate });
const totals = (rows) =>
  rows.reduce(
    (a, r) => ({
      clicks: a.clicks + r.clicks,
      impressions: a.impressions + r.impressions,
    }),
    { clicks: 0, impressions: 0 },
  );

/* ------------------------------- helpers -------------------------------- */

const pct = (n) => `${(n * 100).toFixed(2)}%`;
const delta = (now, before) => {
  if (!before) return now ? "new" : "—";
  const d = ((now - before) / before) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(0)}%`;
};
const path = (u) => {
  try {
    return new URL(u).pathname;
  } catch {
    return u;
  }
};
const pad = (s, n) => String(s).slice(0, n).padEnd(n);

/* --------------------------------- run ---------------------------------- */

const out = [];
const say = (s = "") => {
  out.push(s);
  console.log(s);
};

const [siteNow, sitePrev, queriesNow, queriesPrev, pagesNow] = await Promise.all([
  query({ ...period(curStart, curEnd), dimensions: [] }),
  query({ ...period(prevStart, prevEnd), dimensions: [] }),
  query({ ...period(curStart, curEnd), dimensions: ["query"], rowLimit: 5000 }),
  query({ ...period(prevStart, prevEnd), dimensions: ["query"], rowLimit: 5000 }),
  query({ ...period(curStart, curEnd), dimensions: ["page"], rowLimit: 1000 }),
]);

const now = siteNow[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
const before = sitePrev[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };

say(`# GSC insights — ${SITE.replace("sc-domain:", "")}`);
say(`Window: ${curStart} → ${curEnd} (${WINDOW}d), vs ${prevStart} → ${prevEnd}`);
say();
say("## Headline");
say(
  `- Clicks: **${now.clicks}** (${delta(now.clicks, before.clicks)})  ·  ` +
    `Impressions: **${now.impressions}** (${delta(now.impressions, before.impressions)})`,
);
say(
  `- CTR: **${pct(now.ctr)}** (was ${pct(before.ctr)})  ·  ` +
    `Avg position: **${now.position.toFixed(1)}** (was ${before.position.toFixed(1)})`,
);
say();

/* 1. Striking distance — the highest-ROI cut on a young site. */
const striking = queriesNow
  .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 3)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 20);

say("## 1. Striking distance (position 5–20)");
say("Already ranking, not yet earning clicks. Cheapest wins on the board.");
say();
if (!striking.length) {
  say("_Nothing above the impression floor yet._");
} else {
  say("```");
  say(`${pad("query", 46)} ${pad("impr", 6)} ${pad("clicks", 7)} ${pad("pos", 5)}`);
  for (const r of striking) {
    say(
      `${pad(r.keys[0], 46)} ${pad(r.impressions.toFixed(0), 6)} ${pad(r.clicks.toFixed(0), 7)} ${pad(r.position.toFixed(1), 5)}`,
    );
  }
  say("```");
}
say();

/* 2. Seen but not clicked — the title/meta rewrite queue. */
const lowCtr = queriesNow
  .filter((r) => r.impressions >= 20 && r.ctr < 0.02 && r.position <= 15)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 15);

say("## 2. High impressions, low CTR");
say("Ranking well enough to be seen, the snippet is not earning the click.");
say();
if (!lowCtr.length) {
  say("_No query yet clears 20 impressions inside the top 15 — too early for this cut._");
} else {
  say("```");
  for (const r of lowCtr) {
    say(
      `${pad(r.keys[0], 46)} ${pad(r.impressions.toFixed(0), 6)} ${pad(pct(r.ctr), 7)} ${pad(r.position.toFixed(1), 5)}`,
    );
  }
  say("```");
}
say();

/* 3. Movers — what changed, not just what is. */
const prevMap = new Map(queriesPrev.map((r) => [r.keys[0], r]));
const emerging = queriesNow
  .filter((r) => !prevMap.has(r.keys[0]) && r.impressions >= 5)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 15);

say("## 3. New queries this period");
say("Demand Google newly associates with the site — content-gap signal.");
say();
if (!emerging.length) {
  say("_No new query above 5 impressions._");
} else {
  say("```");
  for (const r of emerging) {
    say(`${pad(r.keys[0], 52)} ${pad(r.impressions.toFixed(0), 6)} pos ${r.position.toFixed(1)}`);
  }
  say("```");
}
say();

/* 4. Pages doing the work. */
say("## 4. Top pages");
say();
say("```");
say(`${pad("page", 52)} ${pad("clicks", 7)} ${pad("impr", 7)} ${pad("pos", 5)}`);
for (const r of pagesNow.sort((a, b) => b.impressions - a.impressions).slice(0, 15)) {
  say(
    `${pad(path(r.keys[0]), 52)} ${pad(r.clicks.toFixed(0), 7)} ${pad(r.impressions.toFixed(0), 7)} ${pad(r.position.toFixed(1), 5)}`,
  );
}
say("```");
say();

/* 5. Cannibalisation — two URLs splitting one query. */
const perQuery = await query({
  ...period(curStart, curEnd),
  dimensions: ["query", "page"],
  rowLimit: 5000,
});
const byQuery = new Map();
for (const r of perQuery) {
  const q = r.keys[0];
  if (!byQuery.has(q)) byQuery.set(q, []);
  byQuery.get(q).push(r);
}
const cannibal = [...byQuery.entries()]
  .filter(([, rs]) => rs.length > 1 && rs.reduce((a, r) => a + r.impressions, 0) >= 10)
  .sort((a, b) => {
    const s = (x) => x[1].reduce((acc, r) => acc + r.impressions, 0);
    return s(b) - s(a);
  })
  .slice(0, 10);

say("## 5. Possible cannibalisation");
say("One query, several of our URLs competing — Google is unsure which to rank.");
say();
if (!cannibal.length) {
  say("_None above the noise floor._");
} else {
  for (const [q, rs] of cannibal) {
    say(`- **${q}** (${rs.reduce((a, r) => a + r.impressions, 0).toFixed(0)} impr)`);
    for (const r of rs.sort((a, b) => b.impressions - a.impressions)) {
      // keys = [query, page] — the page is keys[1].
      say(`    - ${path(r.keys[1])} — ${r.impressions.toFixed(0)} impr, pos ${r.position.toFixed(1)}`);
    }
  }
}
say();

const jsonOut = arg("json");
if (jsonOut) {
  writeFileSync(
    jsonOut,
    JSON.stringify(
      { window: { curStart, curEnd, prevStart, prevEnd }, now, before, queriesNow, pagesNow },
      null,
      2,
    ),
  );
  say(`Raw rows written to ${jsonOut}`);
}
