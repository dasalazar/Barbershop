import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/services/booking-service", () => ({ createBooking: vi.fn() }));

import { saveBookingAction } from "@/actions/save-booking";
import { createBooking } from "@/services/booking-service";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const mockedGetServerSession = vi.mocked(getServerSession);
const mockedCreateBooking = vi.mocked(createBooking);
const mockedRevalidatePath = vi.mocked(revalidatePath);

describe("saveBookingAction", () => {
  const params = {
    serviceId: "service-1",
    barbershopId: "shop-1",
    date: new Date(2026, 7, 25, 10, 0),
  };

  beforeEach(() => {
    mockedGetServerSession.mockReset();
    mockedCreateBooking.mockReset();
    mockedRevalidatePath.mockReset();
  });

  it("throws when there is no authenticated user", async () => {
    mockedGetServerSession.mockResolvedValue(null);

    await expect(saveBookingAction(params)).rejects.toThrow(
      "Usuário não autenticado."
    );
    expect(mockedCreateBooking).not.toHaveBeenCalled();
  });

  it("creates the booking for the logged-in user and revalidates affected pages", async () => {
    mockedGetServerSession.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockedCreateBooking.mockResolvedValue({} as never);

    await saveBookingAction(params);

    expect(mockedCreateBooking).toHaveBeenCalledWith({
      ...params,
      userId: "user-1",
    });
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/bookings");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/barbershops/shop-1");
  });
});
