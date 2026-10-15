import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { logServerError, renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  request: Request,
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  const captured = consumeLastCapturedError();
  const error = captured ?? new Error(`h3 swallowed SSR error: ${body}`);
  logServerError(`SSR ${request.method} ${new URL(request.url).pathname}`, error);

  return new Response(renderErrorPage(error), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Weekly SEO audit 2026-10-12: "/trips/" reached "/trips" through the router's own
// trailing-slash redirect, a 307 (temporary), while http->https and www->apex are
// 308. Answer it here with a permanent 308 before the router sees it, keeping the
// query string. API routes and the static webinar page are left alone.
function trailingSlashRedirect(request: Request): Response | undefined {
  if (request.method !== "GET" && request.method !== "HEAD") return undefined;
  const url = new URL(request.url);
  const { pathname } = url;
  if (pathname === "/" || !pathname.endsWith("/")) return undefined;
  if (pathname.startsWith("/api/") || pathname.startsWith("/webinar-1")) return undefined;
  const target = pathname.replace(/\/+$/, "") || "/";
  return new Response(null, { status: 308, headers: { Location: target + url.search } });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const redirect = trailingSlashRedirect(request);
    if (redirect) return redirect;
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(request, response);
    } catch (error) {
      logServerError(`SSR ${request.method} ${new URL(request.url).pathname}`, error);
      return new Response(renderErrorPage(error), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
