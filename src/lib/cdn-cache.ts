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
// `@tanstack/react-start/server` is server-only — the client bundle rejects a
// static import of it. So the import is DYNAMIC and lives inside the SSR guard:
// in the client build `import.meta.env.SSR` is statically false, the function
// returns first, and the dead branch (with the import) is eliminated entirely.
// On the client `setResponseHeader` -> getH3Event() would throw anyway (no server
// event); the try/catch is a belt-and-braces guard so a header tweak never 500s.
export async function setCdnCache(seconds = 300) {
  if (!import.meta.env.SSR) return;
  try {
    const { setResponseHeader } = await import("@tanstack/react-start/server");
    setResponseHeader(
      "Cache-Control",
      `public, max-age=0, s-maxage=${seconds}, must-revalidate`,
    );
  } catch {
    /* no-op: keep rendering even if the header can't be set */
  }
}
