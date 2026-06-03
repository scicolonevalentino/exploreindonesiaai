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
  // Dev-only: Lovable serves R2-backed assets (hero videos, etc.) under /__l5e/*
  // via its platform runtime, which doesn't exist in local dev. Proxy those
  // requests to production so the hero background video plays on localhost.
  // No effect on the build — this is the dev server proxy only.
  vite: {
    server: {
      proxy: {
        "/__l5e": {
          target: "https://exploreindonesia.ai",
          changeOrigin: true,
          secure: true,
        },
      },
    },
  },
});
