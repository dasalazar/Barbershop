import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/actions/cancel-booking", () => ({ cancelBookingAction: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { cancelBookingAction } from "@/actions/cancel-booking";
import { BookingItem } from "@/components/bookings/booking-item";
import { toast } from "sonner";

const mockedCancel = vi.mocked(cancelBookingAction);

function buildBooking(overrides: { date?: Date } = {}) {
  return {
    id: "booking-1",
    userId: "user-1",
    serviceId: "service-1",
    barbershopId: "shop-1",
    date: overrides.date ?? new Date(Date.now() + 1000 * 60 * 60),
    createdAt: new Date(),
    updatedAt: new Date(),
    service: {
      id: "service-1",
      name: "Corte de Cabelo",
      description: "desc",
      price: 60,
      imageUrl: "https://example.com/img.png",
      barbershopId: "shop-1",
    },
    barbershop: {
      id: "shop-1",
      name: "Barbearia Vintage",
      address: "Rua X, 1",
      imageUrl: "https://example.com/shop.png",
      phones: [],
      description: "desc",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  } as never;
}

describe("BookingItem", () => {
  beforeEach(() => {
    mockedCancel.mockReset();
  });

  it("shows Confirmado for a future booking with a cancel action", async () => {
    const user = userEvent.setup();
    render(<BookingItem booking={buildBooking()} />);

    await user.click(screen.getByText("Confirmado"));

    expect(screen.getByText("Cancelar Reserva")).toBeInTheDocument();
  });

  it("shows Finalizado for a past booking and hides the cancel action", async () => {
    const user = userEvent.setup();
    const past = new Date(Date.now() - 1000 * 60 * 60);
    render(<BookingItem booking={buildBooking({ date: past })} />);

    await user.click(screen.getByText("Finalizado"));

    expect(screen.queryByText("Cancelar Reserva")).not.toBeInTheDocument();
  });

  it("cancels the booking and shows a success toast", async () => {
    mockedCancel.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<BookingItem booking={buildBooking()} />);

    await user.click(screen.getByText("Confirmado"));
    await user.click(screen.getByText("Cancelar Reserva"));

    expect(mockedCancel).toHaveBeenCalledWith("booking-1");
    expect(toast.success).toHaveBeenCalledWith("Reserva cancelada com sucesso!");
  });
});
