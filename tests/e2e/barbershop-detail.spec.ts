import { expect, test } from "@playwright/test";
import { readFixtures } from "./fixtures";

test("barbershop detail page lists its services", async ({ page }) => {
  const fixtures = readFixtures();

  await page.goto(`/barbershops/${fixtures.barbershopId}`);

  await expect(page.getByRole("heading", { name: "Barbearia E2E" })).toBeVisible();
  await expect(page.getByText("Corte E2E")).toBeVisible();
  await expect(page.getByText("R$ 50,00")).toBeVisible();
});

test("returns a 404 page for an unknown barbershop", async ({ page }) => {
  const response = await page.goto("/barbershops/does-not-exist");

  expect(response?.status()).toBe(404);
});
