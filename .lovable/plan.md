## Problem

Tapping/clicking a trip card in the homepage "Browse curated Indonesia itineraries" carousel does nothing on both desktop and mobile. The card never navigates to `/trips/<slug>`.

## Root cause

`src/hooks/useMarqueeDrag.ts` is responsible for drag-to-scrub on the marquee. On every `pointerdown` it immediately calls:

```ts
el.setPointerCapture(e.pointerId);
```

on the marquee track (the parent of all cards). Per the Pointer Events spec, once a pointer is captured, every subsequent mouse event derived from that pointer — including the synthesized `click` — is dispatched to the capturing element, not to the original target. So the `<Link>` inside the card never receives `click`, TanStack Router's `onClick` handler never runs, and navigation is silently skipped.

A secondary issue: the post-drag suppressor (`onClickCapture`) uses a 4px movement threshold, which is too tight for touch taps and would still occasionally swallow legitimate taps even after the capture bug is fixed.

## Fix

Edit `src/hooks/useMarqueeDrag.ts`:

1. Do not call `setPointerCapture` on `pointerdown`. Instead, defer capture until the pointer has actually moved past a small threshold (e.g. 6px), at which point we know the user is dragging, not tapping. Track a `captured` flag and release on `pointerup` / `pointercancel` as today.
2. Until the drag threshold is crossed, do not call `pause()` either — pausing on every tap causes a visible jolt and is unnecessary for non-drags.
3. Raise the click-suppression threshold in `onClickCapture` from 4px to ~8–10px to be tap-friendly on touch devices, and only suppress when we actually entered drag mode (use the same `captured`/`dragging-confirmed` flag).
4. Keep keyboard arrow handling and the rest of the API unchanged.

No changes needed in `src/routes/index.tsx` or `src/routes/trips.$slug.tsx`; the Link, slug, and route are already correct.

## Verification

- Desktop: click a card in the homepage carousel → navigates to `/trips/<slug>`.
- Desktop: press and drag horizontally on the carousel → marquee scrubs, click after drag does not navigate.
- Mobile (preview at 750px): tap a card → navigates; horizontal swipe → scrubs without navigation.
- Existing Playwright spec `e2e/inspiration-carousel.spec.ts` (keyboard nav, focus rings, ARIA) should still pass.
