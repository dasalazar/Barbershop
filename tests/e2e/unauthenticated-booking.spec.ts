import { expect, test } from "@playwright/test";
import { readFixtures } from "./fixtures";

test("prompts an unauthenticated visitor to sign in before booking", async ({ page }) => {
  const fixtures = readFixtures();

  await page.goto(`/barbershops/${fixtures.barbershopId}`);
  await page.getByRole("button", { name: "Reservar" }).click();

  await expect(page).toHaveURL(/\/api\/auth\/signin/);
  await expect(page.getByText("Google", { exact: false })).toBeVisible();
});
