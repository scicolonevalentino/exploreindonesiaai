#!/usr/bin/env node
// Independent review in a SEPARATE Claude process: fresh context, read-only
// tools, only the review packet and the brief, never the author's conversation.
// Claude only (founder decision, 2026-11-15).
//
//   node scripts/seo-review.mjs <packet.md> --id <A-...>
//
// The verdict is written to the ledger by this script (reviewer
// "claude-reviewer"), not by the agent that asked for the review.
// Exit 0 = verdict recorded (read it), 3 = reviewer unavailable (recorded as
// "unavailable", see ops/seo/README.md).

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packet = process.argv[2];
const idAt = process.argv.indexOf("--id");
const id = idAt > -1 ? process.argv[idAt + 1] : null;
if (!packet || !existsSync(packet) || !id) {
  console.error("usage: node scripts/seo-review.mjs <packet.md> --id <action id>");
  process.exit(2);
}

const ledger = (...args) =>
  spawnSync("node", [join(root, "scripts/seo-ledger.mjs"), ...args], { encoding: "utf8" });

// Always Opus. Tested on 2026-11-15 with the same incomplete packet: Opus sent
// it back, Sonnet approved it. The reviewer is the last check before
// production and a short job, so this is where the stronger model is needed.
const MODEL = process.env.SEO_REVIEW_MODEL || "opus";

const brief = readFileSync(join(root, "ops/seo/reviewer-brief.md"), "utf8");
const schema = readFileSync(join(root, "ops/seo/review-schema.json"), "utf8");
const prompt = `${brief}\n\n---\n\nYou are the reviewer called "claude-reviewer". Your final answer is the structured verdict; this script records it, so do not run any ledger write command yourself.\n\n# REVIEW PACKET (action ${id})\n\n${readFileSync(packet, "utf8")}\n`;

// Read-only tool set. Anything not listed here is denied without asking.
const allowed = [
  "Read",
  "Grep",
  "Glob",
  "WebFetch",
  "WebSearch",
  "Bash(curl:*)",
  "Bash(node scripts/seo-validate.mjs:*)",
  "Bash(node scripts/seo-ledger.mjs locked:*)",
  "Bash(node scripts/seo-ledger.mjs show:*)",
  "Bash(node scripts/seo-ledger.mjs queue:*)",
  "Bash(node scripts/seo-ledger.mjs exp list:*)",
  "Bash(git log:*)",
  "Bash(git diff:*)",
  "Bash(git show:*)",
  "Bash(wc:*)",
  "Bash(jq:*)",
  "Bash(head:*)",
  "Bash(grep:*)",
  "Bash(ls:*)",
];

const run = spawnSync(
  "claude",
  [
    "-p",
    "--model",
    MODEL,
    "--output-format",
    "json",
    "--json-schema",
    schema,
    "--tools",
    "Read,Grep,Glob,WebFetch,WebSearch,Bash",
    "--allowedTools",
    ...allowed,
    "--disallowedTools",
    "Edit",
    "Write",
    "NotebookEdit",
    "--permission-mode",
    "dontAsk",
    "--strict-mcp-config",
    "--no-session-persistence",
  ],
  {
    cwd: root,
    input: prompt,
    encoding: "utf8",
    timeout: 20 * 60 * 1000,
    maxBuffer: 64 * 1024 * 1024,
  },
);

let verdict;
let used;
try {
  const res = JSON.parse(run.stdout);
  used = Object.keys(res.modelUsage || {}).join(", ");
  verdict = res.structured_output ?? JSON.parse(res.result);
  if (!["approve", "revise", "reject"].includes(verdict.verdict)) throw new Error("no verdict");
} catch {
  const why = (run.error?.message || run.stderr || run.stdout || "no output")
    .toString()
    .slice(-400)
    .replace(/\s+/g, " ");
  ledger(
    "review",
    id,
    "--by",
    "claude-reviewer",
    "--verdict",
    "unavailable",
    "--notes",
    `reviewer failed: ${why}`,
  );
  console.error(`claude-reviewer unavailable: ${why}`);
  process.exit(3);
}

const notes = [
  verdict.notes,
  verdict.blocking?.length ? `BLOCKING: ${verdict.blocking.join(" | ")}` : "",
  verdict.not_verified?.length ? `NOT VERIFIED: ${verdict.not_verified.join(" | ")}` : "",
  used ? `(model: ${used})` : "",
]
  .filter(Boolean)
  .join(" ");
const rec = ledger(
  "review",
  id,
  "--by",
  "claude-reviewer",
  "--verdict",
  verdict.verdict,
  "--notes",
  notes || "ok",
);
console.log(JSON.stringify(verdict, null, 2));
console.log(rec.stdout.trim() || rec.stderr.trim());
