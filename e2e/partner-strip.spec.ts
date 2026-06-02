import { expect, test, type Page } from "@playwright/test";

/**
 * Partner logo strip: layout, single-row, hover/focus pause, reduced-motion.
 *
 * Lightweight visual + behavioral regression net. Run with:
 *   bunx playwright install chromium
 *   bunx playwright test partner-strip
 */

const STRIP = '[data-partner-strip="true"]';
const TRACK = '[data-partner-track="true"]';
const LOGOS = '[data-partner-logo]';

async function gotoStrip(page: Page) {
  await page.goto("/");
  await page.locator(STRIP).waitFor({ state: "visible", timeout: 15_000 });
  await page.locator(STRIP).scrollIntoViewIfNeeded();
}

/** Returns true if the track is currently animating (transform != none/identity). */
async function isAnimating(page: Page): Promise<boolean> {
  return page.locator(TRACK).evaluate((el) => {
    const t = getComputedStyle(el as HTMLElement).transform;
    return t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)";
  });
}

/** Reads animation-play-state on the track. */
async function playState(page: Page): Promise<string> {
  return page.locator(TRACK).evaluate(
    (el) => getComputedStyle(el as HTMLElement).animationPlayState,
  );
}

test.describe("Partner logo strip — layout", () => {
  test("desktop: single row, no clipping, screenshot baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await gotoStrip(page);

    const strip = page.locator(STRIP);
    const logos = page.locator(LOGOS);
    const count = await logos.count();
    expect(count).toBeGreaterThan(0);

    // All logos sit on the same row (top within 2px of the first).
    const tops = await logos.evaluateAll((els) =>
      els.map((e) => Math.round((e as HTMLElement).getBoundingClientRect().top)),
    );
    const firstTop = tops[0];
    for (const t of tops) expect(Math.abs(t - firstTop)).toBeLessThanOrEqual(2);

    await expect(strip).toHaveScreenshot("partner-strip-desktop.png", {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });

  for (const size of [
    { width: 320, height: 568, name: "iphone-se" },
    { width: 375, height: 812, name: "iphone-13-mini" },
    { width: 414, height: 896, name: "iphone-11" },
  ] as const) {
    test(`mobile ${size.name}: single row, no wrap, swipable`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await gotoStrip(page);

      const strip = page.locator(STRIP);
      const logos = page.locator(LOGOS);

      // Single row: all bounding rect tops equal (±2px).
      const tops = await logos.evaluateAll((els) =>
        els.map((e) => Math.round((e as HTMLElement).getBoundingClientRect().top)),
      );
      const firstTop = tops[0];
      for (const t of tops) expect(Math.abs(t - firstTop)).toBeLessThanOrEqual(2);

      // Track is wider than the viewport — proves no wrapping.
      const trackBox = await page.locator(TRACK).boundingBox();
      expect(trackBox!.width).toBeGreaterThan(size.width);

      // Strip itself never overflows the viewport horizontally.
      const stripBox = await strip.boundingBox();
      expect(stripBox!.width).toBeLessThanOrEqual(size.width + 1);

      await expect(strip).toHaveScreenshot(`partner-strip-${size.name}.png`, {
        maxDiffPixelRatio: 0.02,
        animations: "disabled",
      });
    });
  }
});

test.describe("Partner logo strip — motion & interaction", () => {
  test("hover pauses the marquee", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await gotoStrip(page);

    expect(await playState(page)).toBe("running");
    await page.locator(STRIP).hover();
    // Allow the CSS rule to apply.
    await page.waitForTimeout(50);
    expect(await playState(page)).toBe("paused");

    // Move pointer away — animation resumes.
    await page.mouse.move(0, 0);
    await page.waitForTimeout(50);
    expect(await playState(page)).toBe("running");
  });

  test("focus-within pauses the marquee (keyboard a11y)", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await gotoStrip(page);

    // Inject a temporary focusable child so :focus-within can fire.
    await page.locator(STRIP).evaluate((el) => {
      const probe = document.createElement("button");
      probe.id = "__focus_probe";
      probe.textContent = "probe";
      probe.style.position = "absolute";
      probe.style.opacity = "0";
      el.appendChild(probe);
    });
    await page.locator("#__focus_probe").focus();
    await page.waitForTimeout(50);
    expect(await playState(page)).toBe("paused");
  });
});

test.describe("Partner logo strip — reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("animation is disabled and row becomes scrollable", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await gotoStrip(page);

    // With reduced motion the keyframe is overridden to `none`.
    const animName = await page
      .locator(TRACK)
      .evaluate((el) => getComputedStyle(el as HTMLElement).animationName);
    expect(animName === "none" || animName === "").toBeTruthy();

    expect(await isAnimating(page)).toBe(false);

    // Strip becomes horizontally scrollable so users can pan manually.
    const overflowX = await page
      .locator(STRIP)
      .evaluate((el) => getComputedStyle(el as HTMLElement).overflowX);
    expect(["auto", "scroll"]).toContain(overflowX);

    await expect(page.locator(STRIP)).toHaveScreenshot(
      "partner-strip-reduced-motion.png",
      { maxDiffPixelRatio: 0.02, animations: "disabled" },
    );
  });
});
