// Shared, client-safe constants for the MCP connector + its OAuth layer.
// No secrets here — see oauth.server.ts for server-only signing material.

// Public canonical origin. VITE_ vars are statically inlined at build time and
// are safe on both client and server; falls back to the production apex.
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://exploreindonesia.ai").replace(
  /\/$/,
  "",
);

// OAuth issuer (this app acts as its own authorization server) and the
// protected resource identifier (the MCP endpoint).
export const ISSUER = SITE_URL;
export const RESOURCE = `${SITE_URL}/api/mcp`;

export const OAUTH_SCOPE = "mcp";
