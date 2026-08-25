import { expect, test } from "@playwright/test";
import { readFixtures } from "./fixtures";

test.describe("authenticated booking flow", () => {
  test.beforeEach(async ({ context }) => {
    const fixtures = readFixtures();

    await context.addCookies([
      {
        name: "next-auth.session-token",
        value: fixtures.sessionToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);
  });

  test("creates a booking, lists it under confirmed bookings, then cancels it", async ({
    page,
  }) => {
    const fixtures = readFixtures();

    await page.goto(`/barbershops/${fixtures.barbershopId}`);
    await page.getByRole("button", { name: "Reservar" }).click();

    await page.getByRole("button", { name: "Go to next month" }).click();
    await page.getByRole("gridcell", { name: "15", exact: true }).click();

    await page
      .getByRole("button", { name: /^\d{2}:\d{2}$/ })
      .first()
      .click();

    await page.getByRole("button", { name: "Confirmar Reserva" }).click();

    await expect(page.getByText("Reserva realizada com sucesso!")).toBeVisible();

    await page.goto("/bookings");
    await expect(page.getByText("Confirmados")).toBeVisible();
    await expect(page.getByText("Corte E2E")).toBeVisible();

    await page.getByText("Corte E2E").click();
    await page.getByRole("button", { name: "Cancelar Reserva" }).click();

    await expect(page.getByText("Reserva cancelada com sucesso!")).toBeVisible();

    await page.reload();
    await expect(page.getByText("Você não possui agendamentos.")).toBeVisible();
  });
});
