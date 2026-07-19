// Server-only OAuth 2.1 primitives for the MCP connector.
//
// This app is its own lightweight Authorization Server, delegating the actual
// user login to the existing Supabase email-OTP flow. Everything is stateless:
// clients (DCR), authorization codes and tokens are all HS256-signed JWTs, so
// nothing needs a database and it works across serverless instances.
//
// Tokens are signed with MCP_OAUTH_SECRET (falls back to the Supabase service-
// role key, another high-entropy server-only secret, so auth works even before
// a dedicated secret is provisioned). Read per-request, never at module scope.
//
// Security notes:
//  - PKCE (S256) is mandatory; authorization codes are short-lived (5 min).
//  - Codes/tokens are NOT server-side revocable (no store). Acceptable here: the
//    tools expose only public, read-only content — there is no user data behind
//    the token. Keep code TTL short to bound replay.

import { createClient } from "@supabase/supabase-js";
import { ISSUER, RESOURCE, OAUTH_SCOPE } from "@/lib/mcp/config";

// ── signing key (server-only, per-request) ──
function getSecret(): string {
  const secret = process.env.MCP_OAUTH_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error("MCP_OAUTH_SECRET (or SUPABASE_SERVICE_ROLE_KEY) is not set");
  }
  return secret;
}

// ── base64url + JWT (HS256 via Web Crypto; no external dep) ──
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(s: string): Uint8Array {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  const bin = atob(t);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

type JwtPayload = Record<string, unknown> & { iat?: number; exp?: number };

async function signJwt(payload: JwtPayload, ttlSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const body: JwtPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const data = `${b64url(enc.encode(JSON.stringify(header)))}.${b64url(enc.encode(JSON.stringify(body)))}`;
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(data)));
  return `${data}.${b64url(sig)}`;
}

async function verifyJwt(token: string): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  let ok = false;
  try {
    ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      b64urlToBytes(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
  } catch {
    return null;
  }
  if (!ok) return null;
  let payload: JwtPayload;
  try {
    payload = JSON.parse(dec.decode(b64urlToBytes(p)));
  } catch {
    return null;
  }
  if (typeof payload.exp === "number" && Math.floor(Date.now() / 1000) > payload.exp) return null;
  return payload;
}

// ── PKCE ──
export async function pkceChallengeFromVerifier(verifier: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(verifier)));
  return b64url(digest);
}

// ── Dynamic client registration (stateless): client_id encodes its redirect URIs ──
const CLIENT_TTL = 60 * 60 * 24 * 365 * 5; // 5 years

export async function issueClientId(redirectUris: string[]): Promise<string> {
  return signJwt({ typ: "client", ruris: redirectUris }, CLIENT_TTL);
}
export async function clientRedirectUris(clientId: string): Promise<string[] | null> {
  const p = await verifyJwt(clientId);
  if (!p || p.typ !== "client" || !Array.isArray(p.ruris)) return null;
  return p.ruris as string[];
}

// ── Authorization code (short-lived, binds user + PKCE + redirect) ──
const CODE_TTL = 5 * 60;

export async function issueAuthCode(params: {
  sub: string;
  codeChallenge: string;
  redirectUri: string;
  clientId: string;
  scope: string;
}): Promise<string> {
  return signJwt(
    {
      typ: "code",
      sub: params.sub,
      cc: params.codeChallenge,
      ru: params.redirectUri,
      cid: params.clientId,
      scope: params.scope,
    },
    CODE_TTL,
  );
}

export type AuthCode = {
  sub: string;
  codeChallenge: string;
  redirectUri: string;
  clientId: string;
  scope: string;
};

export async function readAuthCode(code: string): Promise<AuthCode | null> {
  const p = await verifyJwt(code);
  if (!p || p.typ !== "code") return null;
  return {
    sub: String(p.sub),
    codeChallenge: String(p.cc),
    redirectUri: String(p.ru),
    clientId: String(p.cid),
    scope: String(p.scope ?? OAUTH_SCOPE),
  };
}

// ── Access + refresh tokens ──
const ACCESS_TTL = 60 * 60; // 1h
const REFRESH_TTL = 60 * 60 * 24 * 30; // 30d

export async function issueTokens(sub: string, scope: string) {
  const access_token = await signJwt({ typ: "access", sub, aud: RESOURCE, scope }, ACCESS_TTL);
  const refresh_token = await signJwt({ typ: "refresh", sub, scope }, REFRESH_TTL);
  return { access_token, refresh_token, expires_in: ACCESS_TTL, token_type: "Bearer", scope };
}

export async function refreshAccess(refreshToken: string) {
  const p = await verifyJwt(refreshToken);
  if (!p || p.typ !== "refresh") return null;
  return issueTokens(String(p.sub), String(p.scope ?? OAUTH_SCOPE));
}

// Verify a bearer access token presented to the MCP endpoint.
export async function verifyBearer(authHeader: string | null): Promise<{ sub: string } | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const p = await verifyJwt(authHeader.slice(7).trim());
  if (!p || p.typ !== "access" || p.aud !== RESOURCE) return null;
  return { sub: String(p.sub) };
}

// Whether the MCP endpoint should enforce auth. Off by default so the connector
// can be deployed and tested unauthenticated, then flipped on for the directory.
export function authRequired(): boolean {
  return process.env.MCP_REQUIRE_AUTH === "true";
}

// ── Supabase email-OTP bridge (reuses the app's existing login mechanism) ──
function anonClient() {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function otpStart(email: string): Promise<boolean> {
  const { error } = await anonClient().auth.signInWithOtp({ email });
  return !error;
}

// Verifies the 6-digit code and returns the Supabase user id on success.
// Tries "email" (existing user) then "signup" (brand-new user), mirroring login.tsx.
export async function otpVerify(email: string, code: string): Promise<{ userId: string } | null> {
  const c = anonClient();
  let res = await c.auth.verifyOtp({ email, token: code, type: "email" });
  if (res.error) res = await c.auth.verifyOtp({ email, token: code, type: "signup" });
  if (res.error || !res.data.user) return null;
  return { userId: res.data.user.id };
}

// ── Discovery metadata ──
export function protectedResourceMetadata() {
  return {
    resource: RESOURCE,
    authorization_servers: [ISSUER],
    scopes_supported: [OAUTH_SCOPE],
    bearer_methods_supported: ["header"],
  };
}

export function authorizationServerMetadata() {
  return {
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/oauth/authorize`,
    token_endpoint: `${ISSUER}/oauth/token`,
    registration_endpoint: `${ISSUER}/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: [OAUTH_SCOPE],
  };
}
