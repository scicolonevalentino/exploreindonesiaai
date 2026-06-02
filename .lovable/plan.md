## Scope

Four pieces of work:
1. Persistent top "hello bar" with early-access CTA
2. Destination landing pages (Bali, Java, Komodo & Flores, etc.) for SEO
3. Privacy / Terms pages + GDPR cookie banner gating analytics
4. SEO polish: `robots.txt` Disallow + JSON-LD audit

> Heads-up: `/trips/$slug` already emits Article + BreadcrumbList JSON-LD (the summary note was outdated). I'll instead add `FAQPage` schema where article body contains an FAQ section, and `ItemList` on the new destination pages.

---

## 1. Hello bar (sticky early-access CTA)

New component `src/components/HelloBar.tsx`, mounted in `__root.tsx` above `<Outlet />` so it persists across every route.

- Sticky at top, full-width, ~40px tall, navy-deep background with gold/teal CTA text.
- Copy options (suggesting): **"Plan your Indonesia trip → book it in minutes. Get early access →"** with the arrow link opening a waitlist modal/scroll-target.
- Dismissible with an `×` (state in `localStorage` → `hellobar-dismissed-v1`), so returning users aren't pestered.
- Push site content down by adding top padding to body wrapper (or use `sticky` not `fixed` so layout flows naturally).
- Wire the CTA to a waitlist modal that calls the existing `joinWaitlist` server fn (currently unused). Honeypot + elapsedMs already handled in the server fn.
- Hero in `index.tsx` keeps its existing logo position; adjust `top-6` → account for the bar height on mobile.

## 2. Destination landing pages

New route file per destination: `src/routes/destinations.$destination.tsx` (dynamic, one file, validates against `DESTINATIONS` from `sanity-queries.ts`).

- URL pattern: `/destinations/bali`, `/destinations/java`, `/destinations/komodo-flores`, etc. (slug ↔ destination value mapped via a small const).
- Loader: fetches articles where `destinationPrimary == $value || $value in destinationSecondary` (new GROQ query `ARTICLES_BY_DESTINATION_QUERY`).
- Page content:
  - Hero with destination name, intro paragraph (hand-written per destination, stored in a `src/data/destinations.ts` map — keeps it static & SEO-ready without Sanity changes)
  - Grid of trip cards (reuse `TripCard` pattern from `trips.index.tsx` — extract to `src/components/TripCard.tsx`)
  - Link back to `/trips` with filter pre-applied
- Per-route `head()` with destination-specific title/description/og + canonical, and `ItemList` JSON-LD listing the trip cards.
- Add all destination URLs to `src/routes/sitemap[.]xml.tsx` static entries.
- Add a "Browse by destination" section on homepage linking to these pages (helps internal linking + crawl).

## 3. Privacy, Terms, Cookie banner

- New routes: `src/routes/privacy.tsx`, `src/routes/terms.tsx` — plain content pages with placeholder copy noting data controller, what's collected (email, GA/GTM/Contentsquare analytics), cookies used, user rights, contact. Add `noindex`? No — keep indexable, that's standard.
- Update `SiteFooter` to link both.
- New `src/components/CookieBanner.tsx` mounted in `__root.tsx`:
  - First-visit overlay (bottom), "Accept all" / "Reject non-essential" / "Privacy settings" buttons
  - Stores consent in `localStorage` (`cookie-consent-v1` = `accepted | rejected`)
  - **Gates GTM, GA4, and Contentsquare scripts**: move these out of `__root.tsx` `head.scripts` into a client-side consent-aware loader that injects them only after acceptance. This is the GDPR-correct pattern; leaving them in `head.scripts` fires before consent.
  - Default GA4 to consent mode `denied` until user accepts, then update via `gtag('consent','update',…)` — keeps tagging working for users who accept later in the session.

## 4. SEO polish

- `public/robots.txt`: add `Disallow: /api/` and (if any) `/lovable/` to block internal endpoints from crawl. Keep sitemap reference.
- JSON-LD: Article/BreadcrumbList already present on `/trips/$slug` — no action.
- Add `WebSite` `inLanguage` and confirm `og:locale=en_US` on root. Add `BreadcrumbList` JSON-LD to new destination pages.

---

## Technical notes

- TanStack Start: all new route files use `createFileRoute` with route string matching filename, per template rules. `routeTree.gen.ts` auto-regenerates.
- Cookie banner SSR safety: render the banner shell server-side but read `localStorage` inside `useEffect` to decide visibility — avoids hydration mismatch.
- Hello bar dismiss state: same pattern (render visible by default during SSR; `useEffect` hides if previously dismissed). Brief flash on first paint is acceptable to avoid CLS from layout shift.
- Consent-gated analytics: implement as a small `src/lib/analytics-consent.ts` helper that lazy-injects the GTM/GA/Contentsquare `<script>` tags after user grants consent.
- All new copy strings (hello bar, privacy/terms placeholders) should be reviewed by the user — flag clearly that legal text is a starter template, not legal advice.

## Files to touch

- New: `src/components/HelloBar.tsx`, `src/components/CookieBanner.tsx`, `src/components/TripCard.tsx`, `src/lib/analytics-consent.ts`, `src/data/destinations.ts`, `src/routes/destinations.$destination.tsx`, `src/routes/privacy.tsx`, `src/routes/terms.tsx`
- Edit: `src/routes/__root.tsx` (mount banner + hello bar, move analytics behind consent), `src/routes/index.tsx` (destinations strip, hero top spacing), `src/routes/trips.index.tsx` (use shared TripCard), `src/lib/sanity-queries.ts` (add destination query), `src/routes/sitemap[.]xml.tsx` (destination URLs), `src/components/SiteFooter.tsx` (privacy/terms links), `public/robots.txt`

## Out of scope (flag for later)

- Actual paste-itinerary input → result loop
- Testimonials / FAQ on homepage
- Auth / saved itineraries
