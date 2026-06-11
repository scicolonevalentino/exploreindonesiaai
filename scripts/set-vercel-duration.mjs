// Post-build step (run by vercel.json's buildCommand) that sets the server
// function's maxDuration in the Vercel Build Output API config.
//
// Why: AI itinerary generation takes ~60-90s. Vercel's default function timeout
// would cut it off mid-request. We raise it to 120s — comfortably above the
// generation time and under the 300s Fluid Compute ceiling (on by default,
// even on the free Hobby plan). Nitro's vercel.functionRules don't reach this
// single catch-all function, so we patch the generated .vc-config.json directly.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const MAX_DURATION = 120;
const CONFIG = ".vercel/output/functions/__server.func/.vc-config.json";

if (!existsSync(CONFIG)) {
  console.warn(`[set-vercel-duration] ${CONFIG} not found — skipping (not a Vercel build?)`);
  process.exit(0);
}

const cfg = JSON.parse(readFileSync(CONFIG, "utf8"));
cfg.maxDuration = MAX_DURATION;
writeFileSync(CONFIG, JSON.stringify(cfg, null, 2));
console.log(`[set-vercel-duration] set maxDuration=${MAX_DURATION}s on the server function`);
