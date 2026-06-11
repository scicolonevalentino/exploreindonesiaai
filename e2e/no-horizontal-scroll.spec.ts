import { expect, test } from "@playwright/test";

/**
 * Responsiveness guard: no page should scroll horizontally on a phone.
 *
 * A horizontal scrollbar on mobile means something is wider than the viewport
 * (a fixed width, a 100vw element, or an un-clipped wide marquee). The root
 * `overflow-x: clip` in styles.css is the structural safety net; this test makes
 * sure it stays that way across the key pages and the common phone widths.
 *
 * Run with:
 *   bunx playwright install chromium
 *   bunx playwright test no-horizontal-scroll
 */
const PAGES = ["/", "/destinations/bali", "/trips"];
// 360 = small Android · 375 = iPhone mini/SE · 390 = iPhone 12/13/14 Pro · 430 = Pro Max
const WIDTHS = [360, 375, 390, 430];

test.describe("No horizontal scroll on mobile", () => {
  for (const path of PAGES) {
    for (const width of WIDTHS) {
      test(`${path} does not scroll horizontally at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => {
          const de = document.documentElement;
          return de.scrollWidth - de.clientWidth;
        });
        expect(
          overflow,
          `${path} overflows the viewport by ${overflow}px at ${width}px wide`,
        ).toBeLessThanOrEqual(1);
      });
    }
  }
});
