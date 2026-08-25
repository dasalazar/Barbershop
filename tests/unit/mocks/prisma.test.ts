import { describe, expect, it } from "vitest";
import { prismaMock } from "../../mocks/prisma";

describe("prismaMock", () => {
  it("exports a DeepMockProxy that supports deep method mocking", () => {
    // Verify the mock is defined and has the booking method
    expect(prismaMock).toBeDefined();
    expect(prismaMock.booking.findMany).toBeDefined();
  });

  it("allows mocking Prisma method return values", async () => {
    // Mock a booking findMany call
    prismaMock.booking.findMany.mockResolvedValue([
      {
        id: "1",
        barbershopId: "shop-1",
        serviceId: "service-1",
        userId: "user-1",
        startTime: new Date(),
        endTime: new Date(),
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Call the mocked method
    const result = await prismaMock.booking.findMany();

    // Verify the mock was called and returned the mocked value
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
    expect(prismaMock.booking.findMany).toHaveBeenCalled();
  });
});
