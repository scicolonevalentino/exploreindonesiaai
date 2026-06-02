import { useEffect, type RefObject } from "react";

/**
 * Adds mouse/pointer drag-to-scrub on a CSS-keyframe marquee track.
 * The track is expected to animate `transform: translateX(0 → -50%)` via the
 * `marquee` keyframe (see styles.css). Touch devices keep their native swipe
 * via the reduced-motion / coarse-pointer fallback in CSS.
 */
export function useMarqueeDrag(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia?.("(hover: none) and (pointer: coarse)").matches) return;

    const DURATION_MS = 60_000; // must match .animate-marquee animation
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let currentOffset = 0;
    let pointerId: number | null = null;

    const readOffset = (): number => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.m41; // translateX in px (negative as it scrolls left)
    };

    const onPointerDown = (e: PointerEvent) => {
      // Left mouse / primary pointer only; ignore touch (native scroll handles it).
      if (e.pointerType === "touch") return;
      if (e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startOffset = readOffset();
      currentOffset = startOffset;
      el.style.animationPlayState = "paused";
      el.style.transform = `translateX(${startOffset}px)`;
      el.style.cursor = "grabbing";
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      currentOffset = startOffset + dx;
      el.style.transform = `translateX(${currentOffset}px)`;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      // Track scrolls from 0 to -halfWidth over DURATION_MS. Normalize current
      // offset into that range, then resume via negative animation-delay so the
      // keyframe picks up where we left off.
      const halfWidth = el.scrollWidth / 2;
      let normalized = currentOffset % halfWidth;
      if (normalized > 0) normalized -= halfWidth;
      const progress = -normalized / halfWidth; // 0..1
      el.style.transform = "";
      el.style.animationDelay = `-${progress * DURATION_MS}ms`;
      el.style.animationPlayState = "";
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
      // Suppress click that follows a drag so cards don't navigate accidentally.
      if (Math.abs(currentOffset - startOffset) > 4) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.style.cursor = "";
      el.style.touchAction = "";
      el.style.transform = "";
      el.style.animationDelay = "";
      el.style.animationPlayState = "";
    };
  }, [ref]);
}
