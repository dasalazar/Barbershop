import { describe, expect, it } from "vitest";
import { prismaMock } from "../mocks/prisma";
import {
  cancelBooking,
  createBooking,
  getUserBookings,
} from "@/services/booking-service";

describe("createBooking", () => {
  const params = {
    userId: "user-1",
    serviceId: "service-1",
    barbershopId: "shop-1",
    date: new Date(2026, 7, 25, 10, 0),
  };

  it("throws when a booking already exists for that barbershop and time", async () => {
    prismaMock.booking.findFirst.mockResolvedValue({ id: "existing" } as never);

    await expect(createBooking(params)).rejects.toThrow(
      "Este horário já está reservado."
    );
    expect(prismaMock.booking.create).not.toHaveBeenCalled();
  });

  it("creates the booking when the time slot is free", async () => {
    prismaMock.booking.findFirst.mockResolvedValue(null);
    const created = { id: "new-booking", ...params } as never;
    prismaMock.booking.create.mockResolvedValue(created);

    const result = await createBooking(params);

    expect(prismaMock.booking.create).toHaveBeenCalledWith({ data: params });
    expect(result).toBe(created);
  });
});

describe("cancelBooking", () => {
  it("throws when the booking does not exist", async () => {
    prismaMock.booking.findUnique.mockResolvedValue(null);

    await expect(cancelBooking("booking-1", "user-1")).rejects.toThrow(
      "Agendamento não encontrado."
    );
  });

  it("throws when the booking belongs to a different user", async () => {
    prismaMock.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      userId: "someone-else",
    } as never);

    await expect(cancelBooking("booking-1", "user-1")).rejects.toThrow(
      "Você não tem permissão para cancelar este agendamento."
    );
    expect(prismaMock.booking.delete).not.toHaveBeenCalled();
  });

  it("deletes the booking when it belongs to the requesting user", async () => {
    prismaMock.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      userId: "user-1",
    } as never);
    const deleted = { id: "booking-1" } as never;
    prismaMock.booking.delete.mockResolvedValue(deleted);

    const result = await cancelBooking("booking-1", "user-1");

    expect(prismaMock.booking.delete).toHaveBeenCalledWith({
      where: { id: "booking-1" },
    });
    expect(result).toBe(deleted);
  });
});

describe("getUserBookings", () => {
  it("lists a user's bookings ordered by date, with service and barbershop included", async () => {
    prismaMock.booking.findMany.mockResolvedValue([]);

    await getUserBookings("user-1");

    expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      include: { service: true, barbershop: true },
      orderBy: { date: "asc" },
    });
  });
});
