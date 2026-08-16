import { test, expect } from "@playwright/test";

test.describe("public user app", () => {
  test("homepage shows brand and packages heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /litmus/i }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Popular Food Testing/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("link", { name: /View All Packages/i })).toBeVisible();
  });

  test("header navigates to tests, packages, and labs", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation");
    await nav.getByRole("link", { name: "Tests", exact: true }).click();
    await expect(page).toHaveURL(/\/tests/);

    await nav.getByRole("link", { name: "Packages", exact: true }).click();
    await expect(page).toHaveURL(/\/packages/);

    await nav.getByRole("link", { name: "Labs", exact: true }).click();
    await expect(page).toHaveURL(/\/labs/);
  });

  test("consultation and support pages load", async ({ page }) => {
    await page.goto("/consultation");
    await expect(page.locator("body")).toBeVisible();
    await page.goto("/support");
    await expect(page.locator("body")).toBeVisible();
  });

  test("orders page is reachable", async ({ page }) => {
    await page.goto("/orders");
    await expect(page.locator("body")).toBeVisible();
  });
});
