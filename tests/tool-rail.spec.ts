import { test, expect } from "@playwright/test";

test("an overflowing tool rail keeps full-width buttons", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 420 });
  await page.goto("/");
  const rail = page.getByRole("navigation", { name: "Drawing tools" });
  await expect(
    rail.getByRole("button", { name: "Rectangle (R)", exact: true }),
  ).toBeEnabled();
  const metrics = await rail.evaluate((nav) => ({
    overflows: nav.scrollHeight > nav.clientHeight,
    horizontalOverflow: nav.scrollWidth - nav.clientWidth,
    widths: [...nav.querySelectorAll(":scope > button, :scope > .tool-group > button")].map(
      (button) => button.getBoundingClientRect().width,
    ),
  }));
  expect(metrics.overflows).toBe(true);
  expect(metrics.horizontalOverflow).toBe(0);
  expect(metrics.widths.length).toBeGreaterThan(5);
  for (const width of metrics.widths) expect(width).toBe(45);
});
