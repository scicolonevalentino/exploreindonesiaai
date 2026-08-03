// Short CDN edge cache for the fully-server-rendered content routes.
//
// WHY: content routes (trips, transport, destinations, guides) return
// `cache-control: public, max-age=0, must-revalidate` with `x-vercel-cache:
// MISS`, so every crawler hit re-runs the SSR function cold. These pages are
// already SSR-clean and indexable; this is purely a crawl-EFFICIENCY win, not an
// indexability fix. `s-maxage=300` lets Vercel's edge serve a 5-minute-cached
// copy to bots and repeat visitors while `max-age=0, must-revalidate` keeps it
// fresh for the end user's own browser.
//
// Call near the END of a route loader (after notFound checks, before return).
//
// `@tanstack/react-start/server` is server-only, and route modules are part of
// the client bundle, so a plain import of it from here is rejected by Vite's
// import-protection plugin. A dynamic import inside an `import.meta.env.SSR`
// guard does NOT help: import-protection analyses statically and never sees the
// dead branch get eliminated, so it errors anyway (a full-screen dev overlay on
// every page). `createIsomorphicFn` is the supported way to say this: the client
// build keeps only the `.client()` branch and drops the server import with it.
import { createIsomorphicFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

export const setCdnCache = createIsomorphicFn()
  .server((seconds: number = 300) => {
    try {
      setResponseHeader("Cache-Control", `public, max-age=0, s-maxage=${seconds}, must-revalidate`);
    } catch {
      /* no-op: keep rendering even if the header can't be set */
    }
  })
  .client(() => {});
