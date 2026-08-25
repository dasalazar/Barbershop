import { expect, test } from "@playwright/test";

test("searching for a known barbershop shows it in the results", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Faça sua busca...").fill("Barbearia E2E");
  await page.getByPlaceholder("Faça sua busca...").press("Enter");

  await expect(page).toHaveURL(/\/barbershops\?search=/);
  await expect(page.getByText("Barbearia E2E", { exact: true })).toBeVisible();
});

test("searching for an unknown term shows an empty state", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Faça sua busca...").fill("Barbearia Inexistente XYZ");
  await page.getByPlaceholder("Faça sua busca...").press("Enter");

  await expect(page.getByText("Nenhuma barbearia encontrada.")).toBeVisible();
});
