import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  /** px to advance per arrow key press */
  step?: number;
  /** Called the first time the user drags, swipes, or keys through the marquee. */
  onFirstInteract?: () => void;
};

/**
 * Adds drag-to-scrub (mouse + touch) and keyboard stepping to a CSS-keyframe
 * marquee track. The track must animate `transform: translateX(0 → -50%)` via
 * the `marquee` keyframe (see styles.css).
 *
 * The track is made focusable so screen-reader and keyboard users can step
 * through items with ← / → / Home / End, mirroring the visual drag.
 */
export function useMarqueeDrag(
  ref: RefObject<HTMLElement | null>,
  { step = 240, onFirstInteract }: Options = {},
) {
  // Stable callback ref so the effect doesn't re-bind on every render.
  const onFirstInteractRef = useRef(onFirstInteract);
  onFirstInteractRef.current = onFirstInteract;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const DRAG_THRESHOLD = 8; // px before we treat a pointer gesture as a drag
    let pointerDown = false;
    let dragConfirmed = false;
    let startX = 0;
    let startOffset = 0;
    let currentOffset = 0;
    let pointerId: number | null = null;
    let interacted = false;

    const markInteracted = () => {
      if (interacted) return;
      interacted = true;
      onFirstInteractRef.current?.();
    };

    const readOffset = (): number => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.m41;
    };

    /**
     * The animation duration, read from the element rather than hard-coded: the
     * article marquee derives it from the number of cards (see .marquee-scaled
     * in styles.css), so it differs per row and per breakpoint. Getting this
     * wrong desyncs resumeFrom() and the row jumps when the user lets go.
     */
    const durationMs = (): number => {
      const secs = Number.parseFloat(getComputedStyle(el).animationDuration);
      return Number.isFinite(secs) && secs > 0 ? secs * 1000 : 60_000;
    };

    const pause = (offset: number) => {
      el.style.animationPlayState = "paused";
      el.style.transform = `translateX(${offset}px)`;
    };

    const resumeFrom = (offset: number) => {
      const halfWidth = el.scrollWidth / 2;
      if (halfWidth <= 0) {
        el.style.transform = "";
        el.style.animationPlayState = "";
        return;
      }
      let normalized = offset % halfWidth;
      if (normalized > 0) normalized -= halfWidth;
      const progress = -normalized / halfWidth;
      el.style.transform = "";
      el.style.animationDelay = `-${progress * durationMs()}ms`;
      el.style.animationPlayState = "";
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointerDown = true;
      dragConfirmed = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      // Freeze the row under the finger straight away. Touching a moving
      // carousel to look at a card should stop it, not require an 8px drag
      // first — on mobile that made the row feel uncontrollable.
      // We still do NOT setPointerCapture here: capturing before we know
      // whether this is a tap would redirect the synthesized `click` to the
      // track and stop inner <Link> elements from navigating.
      startOffset = readOffset();
      currentOffset = startOffset;
      pause(startOffset);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDown) return;
      const dx = e.clientX - startX;
      if (!dragConfirmed) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        // Promote to a real drag: the row is already paused, now it's safe to
        // capture the pointer too.
        dragConfirmed = true;
        el.style.cursor = "grabbing";
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        markInteracted();
      }
      currentOffset = startOffset + dx;
      el.style.transform = `translateX(${currentOffset}px)`;
    };

    const endDrag = () => {
      if (!pointerDown) return;
      pointerDown = false;
      // Resume from wherever the row was frozen. This runs for a plain tap too
      // (currentOffset is still the pointerdown offset), and on pointercancel,
      // which is what fires when a touch turns into a vertical page scroll.
      resumeFrom(currentOffset);
      el.style.cursor = "";
      if (pointerId !== null) {
        try {
          el.releasePointerCapture(pointerId);
        } catch {
          /* ignore */
        }
        pointerId = null;
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      // Only suppress the trailing click when the gesture actually became a drag.
      if (dragConfirmed) {
        e.preventDefault();
        e.stopPropagation();
        dragConfirmed = false;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") return;
      // Don't hijack arrow keys when focus is on an inner control (e.g. cards
      // have their own arrow-key sibling navigation).
      if (e.target !== el) return;
      e.preventDefault();
      const halfWidth = el.scrollWidth / 2 || step;
      const current = readOffset();
      let next = current;
      if (key === "ArrowRight") next = current - step;
      if (key === "ArrowLeft") next = current + step;
      if (key === "Home") next = 0;
      if (key === "End") next = -(halfWidth - step);
      currentOffset = next;
      startOffset = current;
      resumeFrom(next);
      markInteracted();
    };

    el.style.cursor = "grab";
    // Allow vertical page scroll on touch while we capture horizontal drag.
    el.style.touchAction = "pan-y";
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("keydown", onKeyDown);
      el.style.cursor = "";
      el.style.touchAction = "";
      el.style.transform = "";
      el.style.animationDelay = "";
      el.style.animationPlayState = "";
    };
  }, [ref, step]);
}

/**
 * Tracks whether the user has already interacted with a given marquee
 * (persisted in sessionStorage so the hint doesn't keep reappearing).
 */
export function useMarqueeHint(storageKey: string) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const already = window.sessionStorage.getItem(storageKey) === "1";
      setDismissed(already);
    } catch {
      setDismissed(false);
    }
  }, [storageKey]);

  const dismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  };

  return { dismissed, dismiss };
}
