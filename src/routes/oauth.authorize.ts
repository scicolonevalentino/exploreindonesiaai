// GET /oauth/authorize
//
// OAuth 2.1 authorization endpoint. Validates the request, then renders a small
// self-contained login page that authenticates the user via the app's existing
// Supabase email-OTP flow (POSTs to /oauth/otp). On success the page redirects
// back to the client's redirect_uri with an authorization code.

import { createFileRoute } from "@tanstack/react-router";
import { clientRedirectUris } from "@/lib/mcp/oauth.server";

function errorPage(message: string, status = 400) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Authorization error</title>` +
      `<body style="font-family:system-ui;max-width:32rem;margin:4rem auto;padding:0 1rem">` +
      `<h1>Couldn't authorize</h1><p>${message}</p></body>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

// Safe JSON for embedding in a <script> tag.
function safeJson(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export const Route = createFileRoute("/oauth/authorize")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams;

        const responseType = q.get("response_type");
        const clientId = q.get("client_id") ?? "";
        const redirectUri = q.get("redirect_uri") ?? "";
        const codeChallenge = q.get("code_challenge") ?? "";
        const codeChallengeMethod = q.get("code_challenge_method") ?? "";
        const state = q.get("state") ?? "";
        const scope = q.get("scope") ?? "mcp";

        if (responseType !== "code") {
          return errorPage("Unsupported response_type (only 'code' is supported).");
        }
        if (codeChallengeMethod !== "S256" || !codeChallenge) {
          return errorPage("PKCE with S256 is required.");
        }
        const ruris = await clientRedirectUris(clientId);
        if (!ruris) {
          return errorPage("Unknown or invalid client_id. Register the client first.");
        }
        if (!ruris.includes(redirectUri)) {
          return errorPage("redirect_uri does not match the registered client.");
        }

        const config = safeJson({
          clientId,
          redirectUri,
          codeChallenge,
          state,
          scope,
        });

        const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Connect ExploreIndonesia.ai to Claude</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh;
    display: grid; place-items: center; background: #f6f5f2; color: #1b1b1b; }
  @media (prefers-color-scheme: dark) { body { background:#111; color:#eee; } .card{ background:#1c1c1c!important; } input{ background:#111!important; color:#eee!important; border-color:#333!important; } }
  .card { background:#fff; padding:2rem; border-radius:16px; width:min(92vw,26rem);
    box-shadow:0 10px 40px rgba(0,0,0,.08); }
  h1 { font-size:1.15rem; margin:.2rem 0 .3rem; }
  p.sub { color:#666; margin:0 0 1.4rem; font-size:.9rem; }
  label { display:block; font-size:.8rem; font-weight:600; margin:1rem 0 .35rem; }
  input { width:100%; padding:.7rem .8rem; border:1px solid #d9d6cf; border-radius:10px; font-size:1rem; }
  button { width:100%; margin-top:1.2rem; padding:.8rem; border:0; border-radius:10px;
    background:#0f7d6b; color:#fff; font-size:1rem; font-weight:600; cursor:pointer; }
  button:disabled { opacity:.5; cursor:default; }
  .msg { margin-top:1rem; font-size:.85rem; min-height:1.2em; }
  .msg.err { color:#c0392b; }
  .hidden { display:none; }
  .brand { font-weight:700; letter-spacing:-.01em; }
</style>
</head>
<body>
<div class="card">
  <div class="brand">🌴 ExploreIndonesia.ai</div>
  <h1>Connect to Claude</h1>
  <p class="sub">Sign in with your email to let Claude use ExploreIndonesia.ai's trip tools.</p>

  <div id="step-email">
    <label for="email">Email</label>
    <input id="email" type="email" autocomplete="email" placeholder="you@example.com" />
    <button id="send">Send code</button>
  </div>

  <div id="step-code" class="hidden">
    <label for="code">6-digit code</label>
    <input id="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456" />
    <button id="verify">Verify &amp; connect</button>
  </div>

  <div id="msg" class="msg"></div>
</div>

<script>
  const CFG = ${config};
  const $ = (id) => document.getElementById(id);
  const msg = $("msg");
  function show(t, err) { msg.textContent = t; msg.className = "msg" + (err ? " err" : ""); }

  $("send").addEventListener("click", async () => {
    const email = $("email").value.trim();
    if (!email) return show("Enter your email.", true);
    $("send").disabled = true; show("Sending code…");
    try {
      const r = await fetch("/oauth/otp", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ action:"start", email }) });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "Could not send code");
      window._email = email;
      $("step-email").classList.add("hidden");
      $("step-code").classList.remove("hidden");
      show("We emailed you a 6-digit code.");
      $("code").focus();
    } catch (e) { show(e.message, true); } finally { $("send").disabled = false; }
  });

  $("verify").addEventListener("click", async () => {
    const code = $("code").value.trim();
    if (!code) return show("Enter the code.", true);
    $("verify").disabled = true; show("Verifying…");
    try {
      const r = await fetch("/oauth/otp", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ action:"verify", email: window._email, code,
          client_id: CFG.clientId, redirect_uri: CFG.redirectUri,
          code_challenge: CFG.codeChallenge, state: CFG.state, scope: CFG.scope }) });
      const d = await r.json();
      if (!r.ok || !d.redirect) throw new Error(d.error || "Invalid code");
      window.location.assign(d.redirect);
    } catch (e) { show(e.message, true); $("verify").disabled = false; }
  });
</script>
</body>
</html>`;

        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
