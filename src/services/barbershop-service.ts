import { db } from "@/lib/prisma";

export async function getBarbershopById(id: string) {
  return db.barbershop.findUnique({
    where: { id },
    include: {
      services: true,
    },
  });
}

export async function getBarbershops(search?: string) {
  return db.barbershop.findMany({
    where: search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              services: {
                some: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : undefined,
  });
}
