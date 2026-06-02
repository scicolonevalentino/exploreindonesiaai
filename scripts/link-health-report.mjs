// Report renderer for link-health-check results.
// Categorises issues and emits both HTML and Markdown with clickable URL diffs.

const CATEGORIES = [
  {
    id: "broken",
    title: "Broken links (true HTTP errors)",
    intro:
      "Status codes that are NOT bot-protection (4xx/5xx from non-partner hosts or 5xx anywhere). These should be fixed before publishing.",
    severity: "error",
    match: (r) =>
      r.flags?.some(
        (f) =>
          f.startsWith("http-") &&
          !f.startsWith("http-403") &&
          !f.startsWith("http-429"),
      ) || r.flags?.includes("http-err"),
  },
  {
    id: "missing-params",
    title: "Missing affiliate tracking params",
    intro:
      "Partner-tagged links that lack expected affiliate markers (e.g. `aff_adid`, `pid=`). Revenue will not be attributed.",
    severity: "error",
    match: (r) => r.flags?.includes("missing-affiliate-params"),
  },
  {
    id: "unresolved",
    title: "Unresolved affiliateLinkRef placeholders",
    intro:
      "Body marks pointing to a `placeholderId` that does not exist in the article's `affiliateLinks` array.",
    severity: "error",
    match: (r) => r.flags?.includes("unresolved-affiliateLinkRef"),
  },
  {
    id: "redirect-domain",
    title: "Redirects to a different brand",
    intro:
      "Link is published as one brand but redirects to a different domain. Usually means the wrong partner URL was pasted.",
    severity: "error",
    match: (r) => r.flags?.some((f) => f.startsWith("redirect-domain-change:")),
  },
  {
    id: "bot-shield",
    title: "Partner bot-shield 403 / 429 (informational)",
    intro:
      "Klook and Viator block headless requests at the edge. The redirect chain and affiliate params are intact — these are NOT broken for real visitors. Listed for transparency only.",
    severity: "warning",
    match: (r) => r.flags?.some((f) => f.startsWith("bot-shield-")),
  },
];

export function categorise(results) {
  const buckets = CATEGORIES.map((c) => ({ ...c, items: [] }));
  for (const r of results) {
    if (!r.flags?.length) continue;
    for (const b of buckets) {
      if (b.match(r)) {
        b.items.push(r);
        break; // first-match wins, errors before warnings
      }
    }
  }
  return buckets;
}

// Visual diff between two URLs: tokenises the query string and shows
// removed/added params side-by-side.
function diffUrl(from, to) {
  if (!from || !to) return { kept: [], added: [], removed: [], pathChanged: false };
  let u1, u2;
  try {
    u1 = new URL(from);
    u2 = new URL(to);
  } catch {
    return { kept: [], added: [], removed: [], pathChanged: from !== to };
  }
  const p1 = [...u1.searchParams.entries()];
  const p2 = [...u2.searchParams.entries()];
  const key = ([k, v]) => `${k}=${v}`;
  const set1 = new Set(p1.map(key));
  const set2 = new Set(p2.map(key));
  return {
    fromBase: `${u1.origin}${u1.pathname}`,
    toBase: `${u2.origin}${u2.pathname}`,
    pathChanged: u1.origin + u1.pathname !== u2.origin + u2.pathname,
    kept: p1.filter((p) => set2.has(key(p))),
    removed: p1.filter((p) => !set2.has(key(p))),
    added: p2.filter((p) => !set1.has(key(p))),
  };
}

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function renderHtml({ checkedAt, total, buckets, articlesCount }) {
  const errorTotal = buckets
    .filter((b) => b.severity === "error")
    .reduce((n, b) => n + b.items.length, 0);
  const warnTotal = buckets
    .filter((b) => b.severity === "warning")
    .reduce((n, b) => n + b.items.length, 0);

  const renderItem = (r) => {
    const d = diffUrl(r.url, r.check?.finalUrl);
    const flagsHtml = r.flags
      .map((f) => `<span class="flag flag-${f.split("-")[0]}">${esc(f)}</span>`)
      .join(" ");
    const meta = [
      r.source,
      r.blockKey ? `block ${r.blockKey}` : null,
      r.day,
      r.partner ?? r.expectedPartner,
    ]
      .filter(Boolean)
      .map(esc)
      .join(" · ");
    const paramsHtml = (label, arr, cls) =>
      arr.length
        ? `<div class="params ${cls}"><span class="plabel">${label}</span>${arr
            .map(([k, v]) => `<code>${esc(k)}=${esc(v)}</code>`)
            .join(" ")}</div>`
        : "";
    return `
      <article class="item ${r.flags.some((f) => !f.startsWith("bot-shield-")) ? "is-error" : "is-warn"}">
        <header>
          <h3>${esc(r.articleTitle)} <small>${esc(r.slug)}</small></h3>
          <div class="flags">${flagsHtml}</div>
        </header>
        <p class="meta">${meta}${r.anchor ? ` — “<em>${esc(r.anchor)}</em>”` : ""}</p>
        <div class="urls">
          <div class="url url-from"><span class="ulabel">Published</span><a href="${esc(r.url)}" target="_blank" rel="noopener nofollow">${esc(r.url)}</a></div>
          <div class="url url-to"><span class="ulabel">Final (${esc(r.check?.status ?? "—")})</span>${
            r.check?.finalUrl
              ? `<a href="${esc(r.check.finalUrl)}" target="_blank" rel="noopener nofollow">${esc(r.check.finalUrl)}</a>`
              : `<span class="muted">${esc(r.check?.error ?? "—")}</span>`
          }</div>
        </div>
        ${d.pathChanged ? `<div class="diff-note">⚠ Path changed: <code>${esc(d.fromBase)}</code> → <code>${esc(d.toBase)}</code></div>` : ""}
        ${paramsHtml("removed", d.removed, "removed")}
        ${paramsHtml("added", d.added, "added")}
      </article>`;
  };

  const sections = buckets
    .map(
      (b) => `
    <section id="${b.id}" class="section sev-${b.severity}">
      <h2>${esc(b.title)} <span class="count">${b.items.length}</span></h2>
      <p class="intro">${esc(b.intro)}</p>
      ${b.items.length === 0 ? `<p class="empty">✓ None</p>` : b.items.map(renderItem).join("\n")}
    </section>`,
    )
    .join("\n");

  const toc = buckets
    .map(
      (b) =>
        `<li><a href="#${b.id}"><span class="dot sev-${b.severity}"></span>${esc(b.title)} <span class="count">${b.items.length}</span></a></li>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Link Health Report — ${esc(checkedAt)}</title>
<style>
  :root { color-scheme: light dark; --bg: #fafaf7; --fg: #1a1a1a; --muted: #6b6b6b; --border: #e5e3dc; --err: #b1361e; --warn: #b08b1d; --ok: #2d7a4f; --card: #fff; --code-bg: #f3f1ea; }
  @media (prefers-color-scheme: dark) { :root { --bg: #14130f; --fg: #efece4; --muted: #908b7e; --border: #2a2823; --card: #1c1a16; --code-bg: #23211c; --err: #ff7a5c; --warn: #f0c45a; --ok: #6ed399; } }
  body { font: 14px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; background: var(--bg); color: var(--fg); margin: 0; padding: 2rem; max-width: 1100px; margin-inline: auto; }
  h1 { font-size: 1.75rem; margin: 0 0 .25rem; }
  h2 { font-size: 1.15rem; margin: 2rem 0 .25rem; display: flex; align-items: baseline; gap: .5rem; }
  h3 { font-size: 1rem; margin: 0; font-weight: 600; }
  h3 small { color: var(--muted); font-weight: 400; margin-left: .5rem; }
  .summary { display: flex; gap: 1.5rem; flex-wrap: wrap; padding: 1rem 1.25rem; background: var(--card); border: 1px solid var(--border); border-radius: 10px; margin: 1rem 0 1.5rem; }
  .summary div b { display: block; font-size: 1.5rem; }
  .summary .num-err { color: var(--err); } .summary .num-warn { color: var(--warn); } .summary .num-ok { color: var(--ok); }
  .toc { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: .75rem 1.25rem; }
  .toc ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: .25rem .75rem; }
  .toc a { color: var(--fg); text-decoration: none; display: flex; align-items: center; gap: .5rem; padding: .25rem 0; }
  .toc a:hover { text-decoration: underline; }
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .dot.sev-error { background: var(--err); } .dot.sev-warning { background: var(--warn); }
  .count { background: var(--code-bg); color: var(--muted); padding: 0 .5rem; border-radius: 999px; font-size: .8em; font-weight: 500; }
  .section { margin-top: 2rem; }
  .section .intro { color: var(--muted); margin: 0 0 1rem; }
  .empty { color: var(--ok); }
  .item { background: var(--card); border: 1px solid var(--border); border-left: 4px solid var(--warn); border-radius: 8px; padding: .85rem 1rem; margin: .75rem 0; }
  .item.is-error { border-left-color: var(--err); }
  .item header { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; flex-wrap: wrap; }
  .meta { color: var(--muted); margin: .25rem 0 .6rem; font-size: .9em; }
  .urls { display: grid; gap: .25rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .82em; }
  .url { display: grid; grid-template-columns: 110px 1fr; gap: .5rem; align-items: baseline; }
  .ulabel, .plabel { color: var(--muted); font-family: ui-sans-serif, system-ui; font-size: .85em; text-transform: uppercase; letter-spacing: .04em; }
  .url a { color: inherit; text-decoration: none; word-break: break-all; }
  .url a:hover { text-decoration: underline; }
  .url-from a { color: var(--muted); }
  .diff-note { margin-top: .5rem; color: var(--err); font-size: .85em; }
  .params { margin-top: .5rem; display: flex; flex-wrap: wrap; gap: .35rem; align-items: baseline; }
  .params code { background: var(--code-bg); padding: .1rem .4rem; border-radius: 4px; font-size: .82em; word-break: break-all; }
  .params.removed code { color: var(--err); text-decoration: line-through; opacity: .85; }
  .params.added code { color: var(--ok); }
  .flags { display: flex; gap: .25rem; flex-wrap: wrap; }
  .flag { font-size: .72em; font-family: ui-monospace, monospace; background: var(--code-bg); color: var(--muted); padding: .15rem .45rem; border-radius: 999px; }
  .flag.flag-http, .flag.flag-redirect, .flag.flag-missing, .flag.flag-unresolved { background: color-mix(in oklab, var(--err) 18%, transparent); color: var(--err); }
  .flag.flag-bot { background: color-mix(in oklab, var(--warn) 22%, transparent); color: var(--warn); }
  footer { color: var(--muted); margin-top: 3rem; font-size: .85em; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
</style>
</head>
<body>
  <h1>Link Health Report</h1>
  <p class="muted">Generated ${esc(checkedAt)} · ${articlesCount} articles · ${total} links checked</p>
  <div class="summary">
    <div><b class="num-err">${errorTotal}</b>Errors (block publish)</div>
    <div><b class="num-warn">${warnTotal}</b>Warnings (bot-shield)</div>
    <div><b class="num-ok">${total - errorTotal - warnTotal}</b>Healthy</div>
  </div>
  <nav class="toc"><ul>${toc}</ul></nav>
  ${sections}
  <footer>
    Generated by <code>scripts/link-health-check.mjs</code>. Errors fail the CI workflow and block publish.
  </footer>
</body>
</html>`;
}

export function renderMarkdown({ checkedAt, total, buckets, articlesCount }) {
  const errorTotal = buckets
    .filter((b) => b.severity === "error")
    .reduce((n, b) => n + b.items.length, 0);
  const warnTotal = buckets
    .filter((b) => b.severity === "warning")
    .reduce((n, b) => n + b.items.length, 0);

  const renderItem = (r) => {
    const d = diffUrl(r.url, r.check?.finalUrl);
    const lines = [];
    lines.push(`#### ${r.articleTitle} — \`${r.slug}\``);
    lines.push(
      `**Flags:** ${r.flags.map((f) => `\`${f}\``).join(" · ")}  `,
    );
    lines.push(
      `**Source:** ${r.source}${r.blockKey ? ` (block \`${r.blockKey}\`)` : ""}${
        r.partner ?? r.expectedPartner ? ` · ${r.partner ?? r.expectedPartner}` : ""
      }${r.anchor ? `  \n**Anchor:** _"${r.anchor}"_` : ""}`,
    );
    lines.push("");
    lines.push(`- **From:** [${r.url}](${r.url})`);
    if (r.check?.finalUrl) {
      lines.push(
        `- **Final (${r.check.status}):** [${r.check.finalUrl}](${r.check.finalUrl})`,
      );
    } else if (r.check?.error) {
      lines.push(`- **Error:** ${r.check.error}`);
    }
    if (d.pathChanged) {
      lines.push(`- ⚠ Path changed: \`${d.fromBase}\` → \`${d.toBase}\``);
    }
    if (d.removed.length)
      lines.push(
        `- **Params removed:** ${d.removed.map(([k, v]) => `\`${k}=${v}\``).join(", ")}`,
      );
    if (d.added.length)
      lines.push(
        `- **Params added:** ${d.added.map(([k, v]) => `\`${k}=${v}\``).join(", ")}`,
      );
    lines.push("");
    return lines.join("\n");
  };

  const out = [];
  out.push(`# Link Health Report`);
  out.push("");
  out.push(
    `_Generated ${checkedAt} · ${articlesCount} articles · ${total} links checked_`,
  );
  out.push("");
  out.push(`| Errors | Warnings | Healthy |`);
  out.push(`|---:|---:|---:|`);
  out.push(`| ${errorTotal} | ${warnTotal} | ${total - errorTotal - warnTotal} |`);
  out.push("");
  for (const b of buckets) {
    out.push(`## ${b.title} (${b.items.length})`);
    out.push("");
    out.push(`_${b.intro}_`);
    out.push("");
    if (!b.items.length) {
      out.push("✓ None");
    } else {
      for (const r of b.items) out.push(renderItem(r));
    }
    out.push("");
  }
  return out.join("\n");
}
