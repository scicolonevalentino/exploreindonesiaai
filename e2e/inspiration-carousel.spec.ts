import { expect, test } from "@playwright/test";

/**
 * Inspiration carousel: keyboard navigation, focus rings, and ARIA labels.
 *
 * Run with:
 *   bunx playwright install chromium
 *   bunx playwright test
 */
test.describe("Home inspiration carousel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for at least one card to render.
    await page
      .locator('[data-inspiration-card="true"]')
      .first()
      .waitFor({ state: "visible", timeout: 15_000 });
  });

  test("region exposes carousel ARIA contract", async ({ page }) => {
    const region = page.getByRole("region", {
      name: /top selection of indonesia trips/i,
    });
    await expect(region).toBeVisible();
    await expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  test("every card has a non-empty aria-label", async ({ page }) => {
    const cards = page.locator('[data-inspiration-card="true"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const label = await cards.nth(i).getAttribute("aria-label");
      expect(label, `card ${i} missing aria-label`).toBeTruthy();
      expect(label!.trim().length).toBeGreaterThan(0);
    }
  });

  test("aria-labels are unique per visible slug position", async ({ page }) => {
    const cards = page.locator('[data-inspiration-card="true"]');
    const count = await cards.count();
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      labels.push((await cards.nth(i).getAttribute("aria-label")) ?? "");
    }
    // "Card X of N" suffix guarantees uniqueness even when slugs repeat in the marquee loop.
    expect(new Set(labels).size).toBe(labels.length);
  });

  test("ArrowRight / ArrowLeft move focus between cards", async ({ page }) => {
    const cards = page.locator('[data-inspiration-card="true"]');
    await cards.nth(0).focus();
    await expect(cards.nth(0)).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(cards.nth(1)).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(cards.nth(0)).toBeFocused();
  });

  test("Home / End jump to first and last cards", async ({ page }) => {
    const cards = page.locator('[data-inspiration-card="true"]');
    const count = await cards.count();

    await cards.nth(1).focus();
    await page.keyboard.press("End");
    await expect(cards.nth(count - 1)).toBeFocused();

    await page.keyboard.press("Home");
    await expect(cards.nth(0)).toBeFocused();
  });

  test("focused card shows a visible focus ring", async ({ page }) => {
    const first = page.locator('[data-inspiration-card="true"]').first();
    await first.focus();
    const ringWidth = await first.evaluate((el) => {
      const style = getComputedStyle(el);
      // Tailwind focus-visible:ring-4 renders via box-shadow.
      return style.boxShadow;
    });
    expect(ringWidth).not.toBe("none");
    expect(ringWidth.length).toBeGreaterThan(0);
  });
});
