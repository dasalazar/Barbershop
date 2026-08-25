import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/services/booking-service", () => ({ cancelBooking: vi.fn() }));

import { cancelBookingAction } from "@/actions/cancel-booking";
import { cancelBooking } from "@/services/booking-service";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const mockedGetServerSession = vi.mocked(getServerSession);
const mockedCancelBooking = vi.mocked(cancelBooking);
const mockedRevalidatePath = vi.mocked(revalidatePath);

describe("cancelBookingAction", () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset();
    mockedCancelBooking.mockReset();
    mockedRevalidatePath.mockReset();
  });

  it("throws when there is no authenticated user", async () => {
    mockedGetServerSession.mockResolvedValue(null);

    await expect(cancelBookingAction("booking-1")).rejects.toThrow(
      "Usuário não autenticado."
    );
    expect(mockedCancelBooking).not.toHaveBeenCalled();
  });

  it("cancels the booking for the logged-in user and revalidates affected pages", async () => {
    mockedGetServerSession.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockedCancelBooking.mockResolvedValue({} as never);

    await cancelBookingAction("booking-1");

    expect(mockedCancelBooking).toHaveBeenCalledWith("booking-1", "user-1");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/bookings");
  });
});
