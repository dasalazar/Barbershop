import { expect, test } from "@playwright/test";

test("homepage lists the seeded barbershop and shows the search form", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByPlaceholder("Faça sua busca...")).toBeVisible();
  await expect(page.getByText("Barbearia E2E").first()).toBeVisible();
});
