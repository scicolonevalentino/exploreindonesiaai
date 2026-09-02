# CLAUDE.md

Guidance for working in this repo.

## What this is

Marketing + content website for **ExploreIndonesia.ai**, an AI Indonesia trip
planner that turns travel plans into bookable itineraries (Bali, Java, Komodo,
Raja Ampat, etc.). It publishes curated itinerary articles from a CMS, captures
waitlist/contact leads, and monetizes through travel affiliate links.

Scaffolded with **Lovable.dev** (`.lovable/`, Lovable error reporting, Lovable
connector gateways for email).

## Stack

- **TanStack Start** (full-stack React) — file-based routing, server functions
- **TanStack Router** + **TanStack Query**
- **React 19**, **TypeScript** (strict), **Vite 7**
- **Tailwind CSS v4** + **shadcn/ui** (new-york style, Radix primitives in `src/components/ui/`)
- **Sanity CMS** — content backend (project `u4ah1ore`, dataset `production`)
- **Bun** — package manager and CI runtime
- **Playwright** (e2e) + **Vitest** / Testing Library (unit)

## Commands

Use **bun** (not npm/yarn/pnpm).

```bash
bun install              # install deps (CI uses --frozen-lockfile)
bun run dev              # vite dev server
bun run build            # production build
bun run typecheck        # tsc --noEmit
bun run lint             # eslint
bun run format           # prettier --write .
bun run test:e2e         # playwright (run test:e2e:install once first)
bunx vitest              # unit tests (no package.json script; config in vitest.config.ts)
bun run audit:links      # link-health report -> reports/
```

CI (`.github/workflows/ci.yml`) runs typecheck → lint → build on push/PR to
`main`. `link-health.yml` runs a scheduled outbound-link audit. Keep all three
of typecheck, lint, and build green.

## Layout

```
src/
  routes/                 # File-based pages (see src/routes/README.md)
    __root.tsx            # App shell: SEO meta, JSON-LD, GTM/consent, footer, cookie banner
    index.tsx             # Homepage
    trips.index.tsx       # Article/itinerary listing
    trips.$slug.tsx       # Single itinerary article
    destinations.$destination.tsx
    privacy.tsx / terms.tsx
    sitemap[.]xml.tsx     # Dynamic sitemap
    api/public/           # API route handlers
    routeTree.gen.ts      # AUTO-GENERATED — never edit by hand
  lib/
    sanity.ts             # Sanity client + urlFor() image builder
    sanity-queries.ts     # GROQ queries + content types
    waitlist.functions.ts # Server fn -> Brevo (email capture)
    contact.functions.ts  # Server fn -> Brevo
    analytics-consent.ts  # Google Consent Mode gating
    config.server.ts      # Server-only env access (read env per-request)
  data/destinations.ts    # Static destination landing-page content
  components/             # App components + ui/ (shadcn primitives)
  hooks/
e2e/                     # Playwright specs
scripts/                 # link-health-check tooling
```

Untracked working folders `Project Files/` and `Website files/` hold source
assets (deck, spreadsheets/trackers, the 20 itinerary hero images) — not part
of the build.

## Conventions

- **Imports**: use the `@/` alias for `src/` (e.g. `@/lib/sanity`,
  `@/components/ui/button`). Configured in `tsconfig.json` and `vitest.config.ts`.
- **Routing** (TanStack file-based — read `src/routes/README.md`):
  - Dynamic segments use bare `$` (`trips.$slug.tsx`), splats read via `_splat`.
  - Do **not** create `src/pages/`, Next.js, or Remix-style layouts. The only
    root layout is `__root.tsx`; preserve its `<Outlet />`.
  - Never hand-edit `routeTree.gen.ts`.
  - **`routeTree.gen.ts` regeneration gotcha**: running `dev`/`build` can
    regenerate this file with an extra `declare module '@tanstack/react-start'
    { interface Register … }` block (the `ssr/router/config` augmentation). That
    block comes from a `@tanstack/start-plugin-core` (generator) version newer
    than the installed `react-start` runtime types can consume, and it breaks
    `typecheck` with `to="/trips"`-style errors in `trips.index.tsx`. It is a
    spurious artifact — if you see it in `git diff`, **don't commit it**; run
    `git restore src/routeTree.gen.ts`. The committed version is the correct one.
    Root cause is a TanStack version skew (react-router/react-start/plugin-core);
    the real fix is a coordinated upgrade of that family, deferred for now.
- **Content**: articles come from Sanity via GROQ in `sanity-queries.ts`. Render
  Sanity images through `urlFor()`. Articles are heavily tagged
  (`destinationPrimary`, `travelStyle*`, `tripLengthBucket`, `travellerTypes`,
  `vibe`, `experienceTags`, `bestSeason`) — keep filtering/SEO logic aligned
  with these fields.
- **Server functions**: use `createServerFn` with `zod` validation (see
  `waitlist.functions.ts`). Lead capture posts to Brevo through the Lovable
  connector gateway.
- **Env access** (see `config.server.ts`):
  - Server-only secrets: read `process.env` _inside_ a handler/function, never
    at module scope (Cloudflare Workers bind env per-request).
  - Public values: `import.meta.env.VITE_*`. Never put secrets behind `VITE_`.
  - `.server.ts` suffix keeps a file out of the client bundle.
- **UI**: prefer existing shadcn primitives in `src/components/ui/`. Icons from
  `lucide-react`. Tailwind v4 with CSS variables; base color slate.
- **Privacy/analytics**: consent is **self-hosted** — no third-party CMP. The
  store lives in `src/lib/consent.ts` (localStorage `cookie-consent-v1`, versioned,
  categories `statistics` + `marketing`, broadcasts a `CONSENT_EVENT`), the banner
  is `src/components/CookieConsent.tsx` (Accept all / Reject all / granular
  Customize, EI palette), and the footer "Cookie settings" link re-opens it via
  `openCookieSettings()`. Google Consent Mode defaults to denied in `__root.tsx`;
  `analytics-consent.ts` (`initConsent()`) applies a stored decision on mount,
  subscribes to `CONSENT_EVENT`, maps categories onto Consent Mode v2, and
  lazy-loads GA4/GTM/Contentsquare on `statistics` and the affiliate loaders on
  `marketing`. Don't fire trackers before consent. (Cookiebot was removed —
  behaviour is byte-for-byte the same, just without the paid CMP.)
- **SEO**: page metadata, OG/Twitter tags, and JSON-LD live in route `head`
  functions. Note `__root.tsx` currently defines several meta tags twice — the
  later static values win over the CMS-driven ones; consolidate rather than add
  a third copy if you touch it.
