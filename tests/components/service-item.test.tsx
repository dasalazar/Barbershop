import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setHours, setMinutes } from "date-fns";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/actions/save-booking", () => ({ saveBookingAction: vi.fn() }));

import { saveBookingAction } from "@/actions/save-booking";
import { ServiceItem } from "@/components/barbershops/service-item";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const mockedSignIn = vi.mocked(signIn);
const mockedSaveBooking = vi.mocked(saveBookingAction);

const service = {
  id: "service-1",
  name: "Corte de Cabelo",
  description: "Estilo personalizado",
  price: 60,
  imageUrl: "https://example.com/service.png",
  barbershopId: "shop-1",
} as never;

const barbershop = {
  id: "shop-1",
  name: "Barbearia Vintage",
  address: "Rua X, 1",
  imageUrl: "https://example.com/shop.png",
  phones: [],
  description: "desc",
  createdAt: new Date(),
  updatedAt: new Date(),
} as never;

describe("ServiceItem", () => {
  beforeEach(() => {
    mockedSignIn.mockReset();
    mockedSaveBooking.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => [] }))
    );
  });

  it("redirects to Google sign in when an unauthenticated user tries to book", async () => {
    const user = userEvent.setup();
    render(
      <ServiceItem service={service} barbershop={barbershop} isAuthenticated={false} />
    );

    await user.click(screen.getByRole("button", { name: "Reservar" }));

    expect(mockedSignIn).toHaveBeenCalledWith("google");
  });

  it("disables an already-booked time slot and submits the chosen slot", async () => {
    const now = new Date();
    const targetDay = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    const occupiedSlot = setMinutes(setHours(new Date(targetDay), 10), 30);

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => [{ date: occupiedSlot }] }))
    );
    mockedSaveBooking.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <ServiceItem service={service} barbershop={barbershop} isAuthenticated={true} />
    );

    await user.click(screen.getByRole("button", { name: "Reservar" }));
    await user.click(screen.getByRole("button", { name: "Go to next month" }));
    await user.click(screen.getByText("15", { selector: "button" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "10:30" })).toBeDisabled();
    });

    await user.click(screen.getByRole("button", { name: "09:00" }));
    await user.click(screen.getByRole("button", { name: "Confirmar Reserva" }));

    await waitFor(() => {
      expect(mockedSaveBooking).toHaveBeenCalledWith({
        serviceId: "service-1",
        barbershopId: "shop-1",
        date: setMinutes(setHours(targetDay, 9), 0),
      });
    });
    expect(toast.success).toHaveBeenCalled();
  });
});
