## Goal

Replace the "See the prototype →" CTA on `/` with the full prototype experience embedded inline, right after the "How it works" 1-2-3 section. Users can paste their own itinerary (no Bali sample pre-filled), and the flow still produces the same static demo output.

## Changes

### 1. `src/routes/index.tsx` — embed the flow

- Remove the "See the prototype →" CTA block at the bottom of `HowItWorks`.
- After `HowItWorks`, render a new `<EmbeddedPrototype />` section that hosts the three stages (`input` → `assembling` → `trip`), reusing the existing stage components.
- Add `scrollIntoView` on stage change (scoped to the section, not `window`) so each stage opens from its own top without yanking the user above the home page header.

### 2. `src/routes/prototype.tsx` — refactor for reuse

- Export the three stage components (`InputStage`, `AssemblingStage`, `TripStage`) and the data (`TRIP`, `STEPS`, `PROGRESS_MSGS`) so home can import them. No behavioral change to the stages themselves — output stays the static Bali trip.
- `InputStage` gets two new props:
  - `value` / `onChange` for the textarea (controlled).
  - `canSubmit` is derived from a minimum length (see below).
- Replace the read-only `<pre>` sample with a real `<textarea>`:
  - Placeholder: "Paste your Indonesia itinerary here…"
  - No default value. The `SAMPLE_ITINERARY` constant is deleted.
  - Remove the "Sample · static for demo" badge.
- **Submit gating**: button is hidden entirely until the textarea has ≥ 40 characters of non-whitespace content. Once threshold is met, the button fades in and becomes clickable. No disabled-looking button, no inline error text.
- The standalone `/prototype` route keeps working — it renders the same composed flow, so old links still function. (No redirect, no deletion — least risk.)

### 3. Hello bar (the sticky teal feedback bar)

- Stays on the standalone `/prototype` route as today.
- On home, show it only once the user has advanced past the input stage (i.e. when `stage !== "input"`), so the home page stays clean for first-time visitors and only surfaces feedback once they're actually trying the demo.

### 4. Anchor + nav polish

- Give the embedded section an `id="try-it"` so we can link to it later if needed.
- The existing How-it-works section no longer has a CTA pointing elsewhere; the embedded flow sits directly below it as the natural next step.

## Technical notes

- Scroll-to-top on stage change uses a `ref` on the embedded section + `ref.current?.scrollIntoView({ block: "start" })`, instead of `window.scrollTo(0,0)` — important because on home the section is not at the top of the document.
- The `useEffect([stage])` scroll reset currently in `PrototypePage` is moved into a shared helper so both the standalone route and the embedded version behave consistently.
- Minimum-length check: `value.trim().length >= 40`. Tunable in one constant.
- No changes to the assembling timing, the trip data, the partner strip, or any analytics.
- No new dependencies.

## Out of scope

- The "DEMO — output is illustrative" disclaimer (you mentioned adding it later).
- Persisting what users pasted (no analytics / DB hook in this pass).
- Visual redesign of the stages — they render identically to today, just inside the home page.
