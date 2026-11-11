import { test, expect } from "@playwright/test";

test("homepage displays the platform shell and three ecosystems", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/HUMANE/);
  await expect(page.getByText("Volunteers")).toBeVisible();
  await expect(page.getByText("NGOs & Implementers")).toBeVisible();
  await expect(page.getByText("CSR Partners")).toBeVisible();
});
