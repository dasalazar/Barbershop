import { describe, expect, it } from "vitest";
import { prismaMock } from "../mocks/prisma";
import { getDayBookings } from "@/services/availability-service";

describe("getDayBookings", () => {
  it("queries bookings within the start and end of the given local day", async () => {
    prismaMock.booking.findMany.mockResolvedValue([]);

    const date = new Date(2026, 7, 25, 15, 30);
    await getDayBookings({ barbershopId: "shop-1", date });

    expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
      where: {
        barbershopId: "shop-1",
        date: {
          gte: new Date(2026, 7, 25, 0, 0, 0, 0),
          lte: new Date(2026, 7, 25, 23, 59, 59, 999),
        },
      },
    });
  });

  it("returns the bookings resolved by prisma", async () => {
    const bookings = [{ id: "booking-1" }] as never;
    prismaMock.booking.findMany.mockResolvedValue(bookings);

    const result = await getDayBookings({
      barbershopId: "shop-1",
      date: new Date(2026, 7, 25),
    });

    expect(result).toBe(bookings);
  });
});
