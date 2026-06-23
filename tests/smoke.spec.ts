import { test, expect } from "@playwright/test";

test("has functional home landing interface link layer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Welcome to ScratchBridge");
});