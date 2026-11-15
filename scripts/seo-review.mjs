#!/usr/bin/env node
// Independent review by a DIFFERENT model (OpenAI Codex CLI), so the reviewer
// does not share the author's blind spots. The reviewer sees only the review
// packet and the brief, never the author's conversation.
//
//   node scripts/seo-review.mjs <packet.md> --id <A-...>
//
// The verdict is written to the ledger by this script (reviewer "codex"), not by
// the agent that asked for the review. Exit 0 = verdict recorded (read it),
// 3 = Codex unavailable (recorded as "unavailable", see ops/seo/README.md).

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

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

const brief = readFileSync(join(root, "ops/seo/reviewer-brief.md"), "utf8");
const prompt = `${brief}\n\n---\n\n# REVIEW PACKET (action ${id})\n\n${readFileSync(packet, "utf8")}\n`;
const out = join(mkdtempSync(join(tmpdir(), "seo-review-")), "verdict.json");

const run = spawnSync(
  "codex",
  [
    "exec",
    "--sandbox",
    "read-only",
    "--ephemeral",
    "--color",
    "never",
    "-C",
    root,
    "--output-schema",
    join(root, "ops/seo/review-schema.json"),
    "-o",
    out,
    "-",
  ],
  { input: prompt, encoding: "utf8", timeout: 15 * 60 * 1000, maxBuffer: 64 * 1024 * 1024 },
);

let verdict;
try {
  verdict = JSON.parse(readFileSync(out, "utf8"));
} catch {
  const why = (run.error?.message || run.stderr || "no output")
    .toString()
    .slice(-400)
    .replace(/\s+/g, " ");
  ledger(
    "review",
    id,
    "--by",
    "codex",
    "--verdict",
    "unavailable",
    "--notes",
    `codex failed: ${why}`,
  );
  console.error(`codex unavailable: ${why}`);
  process.exit(3);
}

const notes = [
  verdict.notes,
  verdict.blocking?.length ? `BLOCKING: ${verdict.blocking.join(" | ")}` : "",
  verdict.not_verified?.length ? `NOT VERIFIED: ${verdict.not_verified.join(" | ")}` : "",
]
  .filter(Boolean)
  .join(" ");
const rec = ledger(
  "review",
  id,
  "--by",
  "codex",
  "--verdict",
  verdict.verdict,
  "--notes",
  notes || "ok",
);
console.log(JSON.stringify(verdict, null, 2));
console.log(rec.stdout.trim() || rec.stderr.trim());
