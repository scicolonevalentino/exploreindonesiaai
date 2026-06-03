// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // The Lovable wrapper only runs the Nitro deploy plugin inside Lovable's
  // sandbox; everywhere else it's skipped and it defaults to the Cloudflare
  // preset. On Vercel (VERCEL env var present at build time) we force-enable
  // Nitro with the Vercel preset so the build emits the Vercel Build Output
  // API (.vercel/output). NITRO_PRESET overrides the preset if set (vercel.json
  // sets it to "vercel"); we default to "vercel" as a safety net. Off Vercel
  // (local dev + CI) Nitro stays disabled, so `bun run build` is unchanged.
  nitro: process.env.VERCEL
    ? {
        preset: process.env.NITRO_PRESET || "vercel",
        // The wrapper hard-codes output to dist/{server,client}, which would
        // scatter the Vercel preset's artifacts. Remap to the Build Output API
        // layout Vercel auto-detects: config.json at the root, the server
        // function at functions/__server.func (config.json routes /(.*) ->
        // /__server), and public assets under static/.
        output: {
          dir: ".vercel/output",
          serverDir: ".vercel/output/functions/__server.func",
          publicDir: ".vercel/output/static",
        },
      }
    : false,
});
