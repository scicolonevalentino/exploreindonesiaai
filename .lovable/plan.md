## Issue

In `src/routes/prototype.tsx`, the prototype has 3 stages (`input` → `assembling` → `trip`) swapped via `useState` (lines 263–271). When you scroll down in stage 1 and click "Assemble my trip", stage 2 mounts but the window scroll position is preserved — so the new stage appears to "start from the middle" rather than the top.

## Fix

Add a `useEffect` in the parent prototype component that runs whenever `stage` changes and scrolls the window to the top:

```tsx
useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}, [stage]);
```

That's the only change. No content, layout, or animation changes — just resetting scroll on stage transition so every step opens from the top.
