import { describe, expect, it } from "vitest";
import { prismaMock } from "../mocks/prisma";
import { getBarbershopById, getBarbershops } from "@/services/barbershop-service";

describe("getBarbershopById", () => {
  it("fetches a barbershop by id including its services", async () => {
    const barbershop = { id: "shop-1", services: [] } as never;
    prismaMock.barbershop.findUnique.mockResolvedValue(barbershop);

    const result = await getBarbershopById("shop-1");

    expect(prismaMock.barbershop.findUnique).toHaveBeenCalledWith({
      where: { id: "shop-1" },
      include: { services: true },
    });
    expect(result).toBe(barbershop);
  });
});

describe("getBarbershops", () => {
  it("lists every barbershop when no search term is given", async () => {
    prismaMock.barbershop.findMany.mockResolvedValue([]);

    await getBarbershops();

    expect(prismaMock.barbershop.findMany).toHaveBeenCalledWith({
      where: undefined,
    });
  });

  it("filters by barbershop name or service name when a search term is given", async () => {
    prismaMock.barbershop.findMany.mockResolvedValue([]);

    await getBarbershops("corte");

    expect(prismaMock.barbershop.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "corte", mode: "insensitive" } },
          {
            services: {
              some: { name: { contains: "corte", mode: "insensitive" } },
            },
          },
        ],
      },
    });
  });
});
