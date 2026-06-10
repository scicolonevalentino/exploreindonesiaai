// Reads src/data/insights.json and writes a human-readable "Location > insights"
// text file (insights-export.txt) for record-keeping. Re-run after editing the
// JSON to keep the export in sync:  node scripts/export-insights.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "src/data/insights.json"), "utf8"));

const LABELS = {
  ai_blind_spot: "AI assistants get this wrong",
  local_knowledge: "Local knowledge",
  easy_to_miss: "Easy to miss",
};

const lines = ["EXPLOREINDONESIA.AI — LOCAL INSIGHTS LIBRARY", ""];
let locationCount = 0;
let tipCount = 0;

for (const [key, entry] of Object.entries(data)) {
  const title = key.replace(/\b\w/g, (c) => c.toUpperCase());
  lines.push(`${title} > insights`);
  for (const t of entry.tips) {
    lines.push(`  - [${LABELS[t.label] ?? t.label}] ${t.tip}`);
    tipCount += 1;
  }
  lines.push("");
  locationCount += 1;
}

lines.push(`— ${locationCount} locations, ${tipCount} tips —`);

writeFileSync(join(root, "insights-export.txt"), lines.join("\n"));
console.log(`Wrote insights-export.txt (${locationCount} locations, ${tipCount} tips)`);
