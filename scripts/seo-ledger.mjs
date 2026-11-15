#!/usr/bin/env node
// SEO/GEO ledger: the single shared state of the autonomous SEO system.
// Rules and roles live in ops/seo/README.md. Agents never hand-edit
// ops/seo/ledger.json: they go through this CLI, which enforces the review
// gate and the "page under test" lock deterministically.
//
//   node scripts/seo-ledger.mjs queue [--status queued,founder] [--json]
//   node scripts/seo-ledger.mjs show <id>
//   node scripts/seo-ledger.mjs add <file.json>            # one action or an array
//   node scripts/seo-ledger.mjs review <id> --by claude-reviewer|claude-verifier \
//        --verdict approve|revise|reject|unavailable --notes "..."
//   node scripts/seo-ledger.mjs gate <id>                  # BEFORE writing: exit 0 = may write
//   node scripts/seo-ledger.mjs apply <id> --commit <hash|sanity> [--old-file f.json]
//        [--read YYYY-MM-DD --metric "..." --baseline "..."]
//   node scripts/seo-ledger.mjs reopen <id> --reason "..." # production check failed, reverted
//   node scripts/seo-ledger.mjs reject <id> --reason "..."
//   node scripts/seo-ledger.mjs founder <id> --reason "..." # only a human can do it
//   node scripts/seo-ledger.mjs close <id> --note "..."     # done outside the system / obsolete
//   node scripts/seo-ledger.mjs exp list [--open] [--due]
//   node scripts/seo-ledger.mjs exp add <file.json>
//   node scripts/seo-ledger.mjs exp budget              # experiment slots left this week
//   node scripts/seo-ledger.mjs exp close <id> --outcome worked|failed|inconclusive|reverted --note "..."
//   node scripts/seo-ledger.mjs locked [--json]
//   node scripts/seo-ledger.mjs digest [--days 7]

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = process.env.SEO_LEDGER_FILE || join(root, "ops/seo/ledger.json");

const SOURCES = ["analyst", "auditor", "generator", "executor", "founder"];
const TYPES = ["fix", "snippet", "content", "article", "structural", "code", "tooling", "manual"];
const RISKS = ["low", "medium", "high"];
const REVIEWERS = ["claude-reviewer", "claude-verifier"];
const VERDICTS = ["approve", "revise", "reject", "unavailable"];
const OUTCOMES = ["worked", "failed", "inconclusive", "reverted"];
const OPEN = ["queued", "founder"];

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const v = argv[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
};
const die = (msg) => {
  console.error(`seo-ledger: ${msg}`);
  process.exit(1);
};
const today = () => {
  const forced = flag("date") || process.env.SEO_LEDGER_TODAY;
  if (typeof forced === "string") return forced;
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

const load = () => {
  if (!existsSync(FILE))
    return { version: 1, closedClusters: [], lessons: [], actions: [], experiments: [] };
  return JSON.parse(readFileSync(FILE, "utf8"));
};
// ops/seo is a local-only git repository (the site repo is public and ignores
// it). Every write is committed there, so the history of each decision is kept.
const save = (l) => {
  writeFileSync(FILE, JSON.stringify(l, null, 2) + "\n");
  if (process.env.SEO_LEDGER_FILE) return;
  const dir = dirname(FILE);
  if (!existsSync(join(dir, ".git"))) return;
  const git = (...a) => spawnSync("git", ["-C", dir, ...a], { encoding: "utf8" });
  git("add", "-A");
  git("commit", "-q", "-m", `ledger: ${argv.slice(0, 3).join(" ")}`);
};
const readJson = (p) => {
  if (!p || p === true) die("missing file argument");
  return JSON.parse(readFileSync(p, "utf8"));
};
const nextId = (prefix, items) => {
  const stamp = today().replaceAll("-", "");
  const n = items.filter((x) => x.id.startsWith(`${prefix}-${stamp}-`)).length + 1;
  return `${prefix}-${stamp}-${String(n).padStart(2, "0")}`;
};
const find = (l, id) => l.actions.find((a) => a.id === id) || die(`no action ${id}`);

/** Pages that must not be touched: an experiment is still waiting for its read date. */
const lockedPages = (l) => {
  const t = today();
  const m = new Map();
  for (const e of l.experiments) {
    if (e.status === "open" && e.readDate > t) m.set(e.page, e);
  }
  return m;
};
// A pattern ending in "*" is a prefix; anything else must match the page exactly.
const clusterHit = (l, page) =>
  (l.closedClusters || []).find(
    (c) =>
      (c.pattern.endsWith("*") ? page.startsWith(c.pattern.slice(0, -1)) : page === c.pattern) &&
      (!c.until || c.until > today()),
  );

/** Latest verdict per reviewer; a later review supersedes an earlier one. */
const latestReviews = (a) => {
  const m = new Map();
  for (const r of a.reviews || []) m.set(r.by, r);
  return m;
};
const gate = (a) => {
  const r = latestReviews(a);
  const v = (by) => r.get(by)?.verdict;
  const blocked = [...r.values()].filter((x) => x.verdict === "reject" || x.verdict === "revise");
  if (blocked.length) {
    return `blocked by ${blocked.map((x) => `${x.by}:${x.verdict}`).join(", ")}`;
  }
  const reviewer = v("claude-reviewer");
  const verifier = v("claude-verifier");
  if (a.risk === "low") {
    return reviewer === "approve" || verifier === "approve"
      ? null
      : "low risk needs one approve (claude-reviewer or claude-verifier)";
  }
  if (a.risk === "medium") {
    if (verifier !== "approve") return "medium risk needs claude-verifier approve";
    if (reviewer !== "approve" && reviewer !== "unavailable") {
      return "medium risk also needs claude-reviewer approve (or a recorded 'unavailable')";
    }
    return null;
  }
  return reviewer === "approve" && verifier === "approve"
    ? null
    : "high risk needs BOTH claude-reviewer and claude-verifier approve, no fallback";
};

/** Why this action may not touch its pages right now, or null. Only the proposer
 *  can set `overrideLock` (at add time); the executor cannot grant itself one. */
const lockReason = (l, a) => {
  if (a.type === "fix" || a.overrideLock) return null;
  const locks = lockedPages(l);
  for (const p of a.pages) {
    const e = locks.get(p);
    if (e) return `${p} is under test until ${e.readDate} (${e.id}). Only type "fix" may touch it.`;
    const c = clusterHit(l, p);
    if (c) return `${p} is in a closed cluster (${c.reason}).`;
  }
  return null;
};

const validateAction = (a) => {
  const need = ["key", "source", "type", "risk", "pages", "title", "why", "change", "verify"];
  for (const k of need) if (a[k] === undefined || a[k] === "") die(`action missing "${k}"`);
  if (!SOURCES.includes(a.source)) die(`source must be one of ${SOURCES.join("|")}`);
  if (!TYPES.includes(a.type)) die(`type must be one of ${TYPES.join("|")}`);
  if (!RISKS.includes(a.risk)) die(`risk must be one of ${RISKS.join("|")}`);
  if (!Array.isArray(a.pages) || !a.pages.length) die("pages must be a non-empty array");
  if (a.type === "structural" && a.risk !== "high") die("structural actions are always high risk");
};

const line = (a) =>
  `${a.id}  [${a.status}] ${a.risk}/${a.type}  ${a.title}  (${a.pages.join(", ")})` +
  (a.seen > 1 ? `  seen ${a.seen}x since ${a.created}` : "");

const cmd = argv[0];

// Master switch: with ops/seo/PAUSE present nothing is written, by anyone.
const WRITES = ["add", "review", "apply", "reopen", "reject", "founder", "close"];
const isWrite = WRITES.includes(cmd) || (cmd === "exp" && ["add", "close"].includes(argv[1]));
if (isWrite && existsSync(join(root, "ops/seo/PAUSE"))) {
  die("ops/seo/PAUSE exists: the autonomous SEO system is paused, nothing is written");
}

if (cmd === "queue") {
  const l = load();
  const st = typeof flag("status") === "string" ? flag("status").split(",") : OPEN;
  const rows = l.actions.filter((a) => st.includes(a.status));
  if (flag("json")) console.log(JSON.stringify(rows, null, 2));
  else if (!rows.length) console.log("(empty)");
  else rows.forEach((a) => console.log(line(a)));
} else if (cmd === "show") {
  console.log(JSON.stringify(find(load(), argv[1]), null, 2));
} else if (cmd === "add") {
  const l = load();
  const input = readJson(argv[1]);
  for (const a of Array.isArray(input) ? input : [input]) {
    validateAction(a);
    const dup = l.actions.find((x) => x.key === a.key && OPEN.includes(x.status));
    if (dup) {
      dup.seen = (dup.seen || 1) + 1;
      dup.lastSeen = today();
      console.log(`${dup.id} already open for key "${a.key}" (seen ${dup.seen}x), not duplicated`);
      continue;
    }
    const rec = {
      id: nextId("A", l.actions),
      status: a.type === "manual" ? "founder" : "queued",
      created: today(),
      seen: 1,
      ...a,
      reviews: [],
    };
    l.actions.push(rec);
    console.log(`added ${rec.id} [${rec.status}]`);
  }
  save(l);
} else if (cmd === "review") {
  const l = load();
  const a = find(l, argv[1]);
  const by = flag("by");
  const verdict = flag("verdict");
  if (!REVIEWERS.includes(by)) die(`--by must be one of ${REVIEWERS.join("|")}`);
  if (!VERDICTS.includes(verdict)) die(`--verdict must be one of ${VERDICTS.join("|")}`);
  const notes = flag("notes");
  if (verdict !== "approve" && typeof notes !== "string") die("--notes is required unless approve");
  a.reviews.push({ by, verdict, notes: typeof notes === "string" ? notes : "", at: today() });
  save(l);
  console.log(`${a.id}: ${by} -> ${verdict}. Gate: ${gate(a) ?? "OPEN, may be applied"}`);
} else if (cmd === "gate") {
  // Run this BEFORE writing anything to production. Exit 0 = may write.
  const l = load();
  const a = find(l, argv[1]);
  if (existsSync(join(root, "ops/seo/PAUSE"))) die("ops/seo/PAUSE exists: system paused");
  if (a.status !== "queued") die(`${a.id} is ${a.status}, not queued`);
  const why = gate(a) || lockReason(l, a);
  if (why) die(`GATE CLOSED for ${a.id}: ${why}`);
  console.log(
    `GATE OPEN for ${a.id}: reviews ${[...latestReviews(a).values()].map((r) => `${r.by}:${r.verdict}`).join(", ")}`,
  );
} else if (cmd === "reopen") {
  // Production check failed after applying: old values restored, action back in the queue.
  const l = load();
  const a = find(l, argv[1]);
  const reason = flag("reason");
  if (typeof reason !== "string") die("--reason is required");
  if (a.status !== "applied") die(`${a.id} is ${a.status}, only applied actions can be reopened`);
  a.history = [
    ...(a.history || []),
    { applied: a.applied, reviews: a.reviews, reopenedAt: today(), reason },
  ];
  a.status = "queued";
  a.reviews = [];
  delete a.applied;
  for (const e of l.experiments) {
    if (e.actionId === a.id && e.status === "open") {
      Object.assign(e, {
        status: "closed",
        outcome: "reverted",
        note: `reopened: ${reason}`,
        closedAt: today(),
      });
    }
  }
  save(l);
  console.log(`${a.id} reopened, fresh reviews required`);
} else if (cmd === "apply") {
  const l = load();
  const a = find(l, argv[1]);
  if (a.status !== "queued") die(`${a.id} is ${a.status}, only queued actions can be applied`);
  const why = gate(a);
  if (why) die(`${a.id} cannot be applied: ${why}`);
  const commit = flag("commit");
  if (typeof commit !== "string") die("--commit <hash|sanity> is required");
  const lock = lockReason(l, a);
  if (lock) die(lock);
  a.status = "applied";
  a.applied = { at: today(), commit };
  if (a.overrideLock) a.applied.overrideLock = a.overrideLock;
  const oldFile = flag("old-file");
  if (typeof oldFile === "string") a.applied.old = readJson(oldFile);
  const read = flag("read");
  if (read !== undefined) {
    if (!isDate(read)) die("--read must be YYYY-MM-DD");
    const metric = flag("metric");
    const baseline = flag("baseline");
    if (typeof metric !== "string" || typeof baseline !== "string") {
      die("--read needs --metric and --baseline");
    }
    for (const page of a.pages) {
      const e = {
        id: nextId("E", l.experiments),
        actionId: a.id,
        page,
        change: a.title,
        appliedAt: today(),
        baseline,
        metric,
        readDate: read,
        status: "open",
      };
      l.experiments.push(e);
      a.experimentId = e.id;
      console.log(`experiment ${e.id} opened on ${page}, read ${read}`);
    }
  }
  save(l);
  console.log(`${a.id} applied (${commit})`);
} else if (cmd === "reject" || cmd === "founder" || cmd === "close") {
  const l = load();
  const a = find(l, argv[1]);
  const text = flag(cmd === "reject" ? "reason" : cmd === "founder" ? "reason" : "note");
  if (typeof text !== "string") die("a reason/note is required");
  a.status = cmd === "reject" ? "rejected" : cmd === "founder" ? "founder" : "closed";
  a.resolution = { at: today(), note: text };
  save(l);
  console.log(`${a.id} -> ${a.status}`);
} else if (cmd === "exp") {
  const l = load();
  const sub = argv[1];
  if (sub === "list") {
    const t = today();
    let rows = l.experiments;
    if (flag("open")) rows = rows.filter((e) => e.status === "open");
    if (flag("due")) rows = rows.filter((e) => e.status === "open" && e.readDate <= t);
    if (flag("json")) console.log(JSON.stringify(rows, null, 2));
    else if (!rows.length) console.log("(none)");
    else {
      rows.forEach((e) =>
        console.log(
          `${e.id}  [${e.status}${e.outcome ? ":" + e.outcome : ""}] read ${e.readDate}  ${e.page}  ${e.change}`,
        ),
      );
    }
  } else if (sub === "add") {
    const input = readJson(argv[2]);
    for (const e of Array.isArray(input) ? input : [input]) {
      for (const k of ["page", "change", "appliedAt", "baseline", "metric", "readDate"]) {
        if (!e[k]) die(`experiment missing "${k}"`);
      }
      if (!isDate(e.readDate) || !isDate(e.appliedAt)) die("dates must be YYYY-MM-DD");
      const rec = { id: nextId("E", l.experiments), status: "open", ...e };
      l.experiments.push(rec);
      console.log(`added ${rec.id}`);
    }
    save(l);
  } else if (sub === "close") {
    const e = l.experiments.find((x) => x.id === argv[2]) || die(`no experiment ${argv[2]}`);
    const outcome = flag("outcome");
    const note = flag("note");
    if (!OUTCOMES.includes(outcome)) die(`--outcome must be one of ${OUTCOMES.join("|")}`);
    if (typeof note !== "string") die("--note with the numbers read is required");
    Object.assign(e, { status: "closed", outcome, note, closedAt: today() });
    save(l);
    console.log(`${e.id} closed: ${outcome}`);
  } else if (sub === "budget") {
    // At most 4 NEW experiments in any 7 days. Older open ones do not count.
    const since = new Date(new Date(today()).getTime() - 7 * 864e5).toISOString().slice(0, 10);
    const recent = l.experiments.filter((e) => e.appliedAt > since && e.outcome !== "reverted");
    const left = Math.max(0, 4 - recent.length);
    console.log(
      `experiments opened since ${since}: ${recent.length}. Slots left this week: ${left}`,
    );
    recent.forEach((e) => console.log(`  ${e.id} ${e.appliedAt} ${e.page}`));
  } else die("exp list|add|close|budget");
} else if (cmd === "locked") {
  const l = load();
  const locks = [...lockedPages(l).values()].map((e) => ({
    page: e.page,
    until: e.readDate,
    experiment: e.id,
    change: e.change,
  }));
  const clusters = (l.closedClusters || []).filter((c) => !c.until || c.until > today());
  if (flag("json"))
    console.log(JSON.stringify({ locks, clusters, lessons: l.lessons || [] }, null, 2));
  else {
    console.log('Pages under test (only type "fix" may touch them):');
    locks.forEach((x) => console.log(`  ${x.page}  until ${x.until}  (${x.experiment})`));
    console.log("Closed clusters:");
    clusters.forEach((c) =>
      console.log(`  ${c.pattern}  ${c.reason}${c.until ? `  (recheck ${c.until})` : ""}`),
    );
    console.log("Standing lessons:");
    (l.lessons || []).forEach((n) => console.log(`  - ${n}`));
  }
} else if (cmd === "digest") {
  const l = load();
  const days = Number(flag("days")) || 7;
  const since = new Date(new Date(today()).getTime() - days * 864e5).toISOString().slice(0, 10);
  const by = (s) => l.actions.filter(s);
  const applied = by((a) => a.status === "applied" && a.applied.at >= since);
  const rejected = by((a) => a.status === "rejected" && a.resolution.at >= since);
  const founder = by((a) => a.status === "founder");
  const queued = by((a) => a.status === "queued");
  const closed = l.experiments.filter((e) => e.status === "closed" && e.closedAt >= since);
  const due = l.experiments.filter((e) => e.status === "open" && e.readDate <= today());
  const sec = (title, rows, fmt) => {
    console.log(`\n## ${title} (${rows.length})`);
    rows.forEach((r) => console.log(`- ${fmt(r)}`));
  };
  console.log(`# SEO ledger digest, last ${days} days (since ${since})`);
  sec(
    "Applied",
    applied,
    (a) => `${a.id} ${a.title} [${a.pages.join(", ")}] commit ${a.applied.commit}`,
  );
  sec("Rejected by review", rejected, (a) => `${a.id} ${a.title}: ${a.resolution.note}`);
  sec("Experiments read", closed, (e) => `${e.id} ${e.page}: ${e.outcome}. ${e.note}`);
  sec("Experiments due and not read yet", due, (e) => `${e.id} ${e.page}, due ${e.readDate}`);
  sec(
    "Still queued",
    queued,
    (a) => `${a.id} ${a.risk}/${a.type} ${a.title}${a.seen > 1 ? ` (seen ${a.seen}x)` : ""}`,
  );
  sec(
    "Only the founder can do these",
    founder,
    (a) => `${a.id} ${a.title}: ${a.resolution?.note ?? a.why}`,
  );
} else {
  die(
    "commands: queue | show | add | review | gate | apply | reopen | reject | founder | close | exp | locked | digest",
  );
}
