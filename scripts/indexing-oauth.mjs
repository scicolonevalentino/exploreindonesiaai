// Indexing API submitter using OAuth (user) auth instead of a service-account key.
// Service-account keys are blocked on this project by the org policy
// `iam.disableServiceAccountKeyCreation`, so we authenticate AS the property
// owner (valentino) — which also means no "add owner in Search Console" step.
//
// ZERO dependencies (node:http + node:crypto + global fetch). Node 18+.
//
// Credentials/token live in .secrets/indexing-oauth.json (gitignored):
//   { client_id, client_secret, refresh_token? }
//
// ── Usage ──────────────────────────────────────────────────────────────────
//   node scripts/indexing-oauth.mjs auth            # one-time browser consent → saves refresh_token
//   node scripts/indexing-oauth.mjs                 # DRY RUN, remaining 12
//   node scripts/indexing-oauth.mjs --commit        # submit the remaining 12
//   node scripts/indexing-oauth.mjs --all --commit  # submit every sitemap URL

import http from "node:http";
import crypto from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SECRETS_DIR = join(ROOT, ".secrets");
const STORE = join(SECRETS_DIR, "indexing-oauth.json");
const AUTH_URL_FILE = join(SECRETS_DIR, "auth-url.txt");

const REDIRECT_PORT = 4567;
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}`;
const SCOPE = "https://www.googleapis.com/auth/indexing";

const ORIGIN = "https://exploreindonesia.ai";
const SITEMAP = `${ORIGIN}/sitemap.xml`;

const REMAINING = [
  "10-days-bali-lombok-gili-islands",
  "10-days-komodo-flores",
  "14-days-bali-komodo-sumba",
  "14-days-indonesia-bali-java-komodo",
  "14-days-raja-ampat-divers",
  "15-days-indonesia-honeymoon",
  "15-days-java-bali",
  "15-days-sumatra",
  "20-days-across-indonesia",
  "20-days-wild-indonesia",
  "21-days-indonesia-beyond-bali",
  "30-days-indonesia-ultimate",
].map((slug) => `${ORIGIN}/trips/${slug}`);

const COMMIT = process.argv.includes("--commit");
const ALL = process.argv.includes("--all");
const CMD = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "submit";

const b64url = (buf) => Buffer.from(buf).toString("base64url");
const loadStore = () => JSON.parse(readFileSync(STORE, "utf8"));
const saveStore = (s) => writeFileSync(STORE, JSON.stringify(s, null, 2) + "\n");

function requireConfig() {
  if (!existsSync(STORE)) {
    console.error(`\n✗ Missing ${STORE}\n  Create it with {"client_id":"...","client_secret":"..."}\n`);
    process.exit(1);
  }
  const s = loadStore();
  if (!s.client_id || !s.client_secret) {
    console.error(`\n✗ ${STORE} needs client_id and client_secret.\n`);
    process.exit(1);
  }
  return s;
}

// ── auth: loopback OAuth consent → refresh_token ─────────────────────────────
async function doAuth() {
  const store = requireConfig();
  const verifier = b64url(crypto.randomBytes(32));
  const challenge = b64url(crypto.createHash("sha256").update(verifier).digest());
  const state = b64url(crypto.randomBytes(16));

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: store.client_id,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: SCOPE,
      access_type: "offline",
      prompt: "consent",
      code_challenge: challenge,
      code_challenge_method: "S256",
      state,
    }).toString();

  writeFileSync(AUTH_URL_FILE, authUrl + "\n");
  console.log("AUTH_URL:", authUrl);
  console.log(`Waiting for consent on ${REDIRECT_URI} (up to 4 min)...`);

  const code = await new Promise((resolve, reject) => {
    let timer;
    const finish = (fn, arg) => {
      clearTimeout(timer);
      server.close();
      fn(arg);
    };
    const server = http.createServer((req, res) => {
      const u = new URL(req.url, REDIRECT_URI);
      const err = u.searchParams.get("error");
      const c = u.searchParams.get("code");
      const s = u.searchParams.get("state");
      if (err) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h2>Authorization error: ${err}</h2>`);
        return finish(reject, new Error(err));
      }
      if (!c || s !== state) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h2>Invalid response.</h2>");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h2>&#10003; Authorized. You can close this tab and return to the terminal.</h2>");
      finish(resolve, c);
    });
    server.on("error", reject);
    server.listen(REDIRECT_PORT, "127.0.0.1");
    timer = setTimeout(() => finish(reject, new Error("Timed out waiting for consent")), 240000);
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: store.client_id,
      client_secret: store.client_secret,
      code,
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.refresh_token) {
    throw new Error(`Token exchange failed: ${res.status} ${JSON.stringify(json)}`);
  }
  store.refresh_token = json.refresh_token;
  saveStore(store);
  console.log("\n✓ Refresh token saved to .secrets/indexing-oauth.json\n");
}

async function getAccessToken(store) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: store.client_id,
      client_secret: store.client_secret,
      refresh_token: store.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Refresh failed: ${res.status} ${JSON.stringify(json)}`);
  return json.access_token;
}

async function checkMetadata(url, token) {
  const res = await fetch(
    `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${encodeURIComponent(url)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

async function doCheck() {
  const store = requireConfig();
  if (!store.refresh_token) {
    console.error(`\n✗ No refresh_token. Run: node scripts/indexing-oauth.mjs auth\n`);
    process.exit(1);
  }
  const targets = ALL ? await fetchSitemapUrls() : REMAINING;
  const token = await getAccessToken(store);
  console.log(`\nIndexing API — notification status for ${targets.length} URLs\n`);

  let recorded = 0, missing = 0;
  for (const url of targets) {
    const r = await checkMetadata(url, token);
    const notify = r.json?.latestUpdate?.notifyTime;
    if (r.ok && notify) {
      recorded++;
      console.log(`  ✓ ${notify}  ${url}`);
    } else if (r.status === 404) {
      missing++;
      console.log(`  · no record yet         ${url}`);
    } else {
      missing++;
      console.log(`  ✗ [${r.status}] ${r.json?.error?.message || ""}  ${url}`);
    }
    await new Promise((res) => setTimeout(res, 200));
  }
  console.log(`\n${recorded}/${targets.length} confirmed on record with Google's Indexing API.\n`);
}

async function fetchSitemapUrls() {
  const xml = await (await fetch(SITEMAP)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function publish(url, token) {
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

async function doSubmit() {
  const store = requireConfig();
  const targets = ALL ? await fetchSitemapUrls() : REMAINING;

  console.log(`\nIndexing API (OAuth) — ${ALL ? "ALL sitemap URLs" : "remaining trip articles"}`);
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY RUN"}  |  Targets: ${targets.length}\n`);
  targets.forEach((u, i) => console.log(`  ${String(i + 1).padStart(2)}. ${u}`));

  if (!COMMIT) {
    console.log(`\nDry run — add --commit to submit.\n`);
    return;
  }
  if (!store.refresh_token) {
    console.error(`\n✗ No refresh_token yet. Run: node scripts/indexing-oauth.mjs auth\n`);
    process.exit(1);
  }

  const token = await getAccessToken(store);
  console.log(`\n✓ Got access token. Submitting...\n`);

  let ok = 0, failed = 0;
  for (const url of targets) {
    const r = await publish(url, token);
    if (r.ok) {
      ok++;
      console.log(`  ✓ ${url}`);
    } else {
      failed++;
      const msg = r.json?.error?.message || JSON.stringify(r.json);
      console.log(`  ✗ ${url}  [${r.status}] ${msg}`);
      if (r.status === 403) console.log(`      → The authorized account must be an Owner of the GSC property.`);
      if (r.status === 429) console.log(`      → Indexing API daily quota (200) hit. Resume tomorrow.`);
    }
    await new Promise((res) => setTimeout(res, 250));
  }
  console.log(`\nDone. ${ok} submitted, ${failed} failed.\n`);
}

(CMD === "auth" ? doAuth() : CMD === "check" ? doCheck() : doSubmit()).catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
