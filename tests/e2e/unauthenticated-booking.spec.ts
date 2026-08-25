import { expect, test } from "@playwright/test";
import { readFixtures } from "./fixtures";

test("prompts an unauthenticated visitor to sign in with Google before booking", async ({ page }) => {
  const fixtures = readFixtures();

  let googleAuthRequestUrl: string | undefined;
  await page.route("https://accounts.google.com/**", async (route) => {
    googleAuthRequestUrl = route.request().url();
    await route.abort();
  });

  await page.goto(`/barbershops/${fixtures.barbershopId}`);
  await page.getByRole("button", { name: "Reservar" }).click();

  await expect.poll(() => googleAuthRequestUrl).toContain("accounts.google.com");
  expect(googleAuthRequestUrl).toContain("client_id=e2e-test-client-id");
});
