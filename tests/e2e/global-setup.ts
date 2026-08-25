import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const FIXTURES_PATH = path.join(__dirname, ".fixtures.json");

export default async function globalSetup() {
  const url = process.env.DATABASE_URL ?? "";
  if (!/_test/.test(url) || !/localhost|127\.0\.0\.1/.test(url)) {
    throw new Error(`Refusing to seed: DATABASE_URL is not a local test database (${url})`);
  }

  const prisma = new PrismaClient();

  try {
    await prisma.booking.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.service.deleteMany();
    await prisma.barbershop.deleteMany();
    await prisma.user.deleteMany();

    const barbershop = await prisma.barbershop.create({
      data: {
        name: "Barbearia E2E",
        address: "Rua dos Testes, 100",
        imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1",
        phones: ["(11) 90000-0000"],
        description: "Barbearia usada nos testes end-to-end.",
      },
    });

    const service = await prisma.service.create({
      data: {
        name: "Corte E2E",
        description: "Serviço usado nos testes end-to-end.",
        price: 50,
        imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033",
        barbershopId: barbershop.id,
      },
    });

    const user = await prisma.user.create({
      data: { name: "Usuário de Teste", email: "e2e@example.com" },
    });

    const sessionToken = randomUUID();
    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    await writeFile(
      FIXTURES_PATH,
      JSON.stringify(
        { barbershopId: barbershop.id, serviceId: service.id, sessionToken },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}
