import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/availability-service", () => ({ getDayBookings: vi.fn() }));

import { GET } from "@/app/api/bookings/route";
import { getDayBookings } from "@/services/availability-service";

const mockedGetDayBookings = vi.mocked(getDayBookings);

describe("GET /api/bookings", () => {
  beforeEach(() => {
    mockedGetDayBookings.mockReset();
  });

  it("returns 400 when barbershopId is missing", async () => {
    const request = new NextRequest("http://localhost/api/bookings?date=2026-08-25");

    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(mockedGetDayBookings).not.toHaveBeenCalled();
  });

  it("returns 400 when date is missing", async () => {
    const request = new NextRequest(
      "http://localhost/api/bookings?barbershopId=shop-1"
    );

    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(mockedGetDayBookings).not.toHaveBeenCalled();
  });

  it("returns the day's bookings for a valid request", async () => {
    const bookings = [{ id: "booking-1" }];
    mockedGetDayBookings.mockResolvedValue(bookings as never);

    const request = new NextRequest(
      "http://localhost/api/bookings?barbershopId=shop-1&date=2026-08-25T00:00:00.000Z"
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(bookings);
    expect(mockedGetDayBookings).toHaveBeenCalledWith({
      barbershopId: "shop-1",
      date: new Date("2026-08-25T00:00:00.000Z"),
    });
  });
});
