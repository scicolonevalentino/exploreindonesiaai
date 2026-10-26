// Replace the em dash in heroImage.alt with a comma on every article. The alt
// is rendered in og:image:alt, twitter:image:alt and the hero <img>, and the
// house style bans em dashes in user-facing copy. Most of these came from
// hero-from-commons.mjs, which joined title and file name with " — " until
// 2026-10-21. Old values are written to docs/hero-alt-emdash-2026-10-21.json
// so the change can be reverted.
//
//   node scripts/fix-hero-alt-emdash-2026-10-21.mjs           # dry run
//   node scripts/fix-hero-alt-emdash-2026-10-21.mjs --commit
import { readFileSync, writeFileSync } from "node:fs";
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ""),
      ];
    }),
);
const T = env.SANITY_API_WRITE_TOKEN;
const BASE = "https://u4ah1ore.api.sanity.io/v2024-01-01/data";
const q = async (g) =>
  (
    await (
      await fetch(`${BASE}/query/production?query=${encodeURIComponent(g)}`, {
        headers: { Authorization: `Bearer ${T}` },
      })
    ).json()
  ).result;
const docs = (
  await q(
    `*[_type=="article" && defined(heroImage.alt)]{_id, "s": slug.current, "alt": heroImage.alt}`,
  )
).filter((d) => /[—–]/.test(d.alt));
const fix = (a) => a.replace(/\s*[—–]\s*/g, ", ");
for (const d of docs) console.log(`${d.s}\n  - ${d.alt}\n  + ${fix(d.alt)}`);
console.log(`\n${docs.length} articles`);
if (!process.argv.includes("--commit")) process.exit(0);
writeFileSync("docs/hero-alt-emdash-2026-10-21.json", JSON.stringify(docs, null, 2) + "\n");
const r = await fetch(`${BASE}/mutate/production`, {
  method: "POST",
  headers: { Authorization: `Bearer ${T}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    mutations: docs.map((d) => ({ patch: { id: d._id, set: { "heroImage.alt": fix(d.alt) } } })),
  }),
});
if (!r.ok) throw new Error(await r.text());
const left = (
  await q(`*[_type=="article" && defined(heroImage.alt)]{"alt": heroImage.alt}`)
).filter((d) => /[—–]/.test(d.alt));
console.log(
  left.length
    ? `FAILED: ${left.length} still carry a dash`
    : "verified: no hero alt carries an em or en dash",
);
