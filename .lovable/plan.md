## Goal

On the homepage's "Browse by destination" section, show an illustrated SVG map of Indonesia with one pin per region (the 8 existing destinations). Hovering a pin reveals a small preview card (hero image + name); clicking navigates to `/destinations/{slug}`. Keep the current horizontal carousel on mobile (≤ md breakpoint) where a map is hard to use.

## Approach

1. **Generate the illustrated base map**
   - Use `imagegen` (premium, transparent background) to create a hand-drawn / artistic Indonesia archipelago illustration on a clean background, matching the site's warm editorial tone.
   - Save to `src/assets/indonesia-map.png` and import it as a background layer.

2. **Build `<IndonesiaMap />` component** (`src/components/IndonesiaMap.tsx`)
   - Container with the illustration as a responsive background, aspect ratio locked (e.g. 16:9).
   - Overlay an SVG with 8 absolutely-positioned pins, coordinates expressed as `%` of the container so it stays aligned on resize. Approximate pin positions:
     - Bali, Bali + Nearby Islands, Java, Komodo & Flores, Lombok & Gili, Sumatra, Raja Ampat, Wild Indonesia (Sulawesi-ish center).
   - Each pin: small animated dot with a pulsing ring (Tailwind `animate-ping` + a steady core), focusable button for a11y.
   - On hover/focus: show a floating preview card next to the pin with destination name, short tagline (`DESTINATIONS` label / `shortName`), and a small hero thumbnail. Card animates in with `animate-fade-in` + `animate-scale-in`.
   - On click: `<Link to="/destinations/$destination" params={{ destination: slug }}>` — same destination as today's carousel cards.
   - Keyboard: pins are real `<button>`/`<Link>` elements, Tab-navigable, Enter activates.

3. **Wire it into the homepage**
   - In `src/routes/index.tsx` `DestinationsStrip`, render `<IndonesiaMap />` inside a `hidden md:block` wrapper and keep the existing carousel inside `md:hidden`.
   - Keep the heading, subheading, and section semantics (`aria-labelledby="destinations-heading"`) unchanged.

4. **Data source**
   - Reuse `DESTINATION_CONTENT` from `src/data/destinations.ts` (slug, name, shortName, highlights). Add a co-located `mapCoords` lookup inside the new component (kept out of the data file so the data stays content-only).
   - For the preview card thumbnail, reuse the same image the carousel uses today (read once to confirm — likely a generated asset per destination).

5. **Responsive + perf**
   - The illustrated PNG is only mounted on `md+`, so mobile users don't download it.
   - Lazy-load the image (`loading="lazy"`, `decoding="async"`).
   - No new deps.

## Technical details

- File-based route unchanged; only the `DestinationsStrip` JSX in `src/routes/index.tsx` is modified.
- New files: `src/components/IndonesiaMap.tsx`, `src/assets/indonesia-map.png`.
- Pin coords stored as `{ slug: string, x: number, y: number }[]` (percentages 0–100).
- Hover card positioning: simple `translate(-50%, -100%)` above the pin, with edge-clamp via `data-side="left|right"` toggled by pin's x value (>70% → flip left).
- No analytics changes; existing `Link` navigation continues to flow through TanStack Router.
- Accessibility: each pin button has `aria-label="Browse trips in {name}"`; the hover card is `role="tooltip"` and referenced via `aria-describedby` when focused.

## Out of scope

- No animated zoom-into-region (we picked simple hover preview + click navigate).
- No region-shape highlighting; pins only.
- No CMS changes; coords stay in the component.
