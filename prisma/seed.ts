import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const images = [
      "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
      "https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
      "https://utfs.io/f/92ab5a27-a068-45b6-8962-087944b200b3-16r.png",
      "https://utfs.io/f/0522fdaf-0357-4213-8f52-d830675d1675-16s.png",
      "https://utfs.io/f/7a30d1f5-264b-4f61-a409-730266abb268-16t.png",
      "https://utfs.io/f/8a4576d7-d510-4e10-b942-b604153b6cb1-16u.png",
    ];

    const creativeNames = [
      "Barbearia Vintage",
      "Corte & Estilo",
      "Barba & Navalha",
      "The Beverly Hills Barbershop",
      "Homem Elegante Barbearia",
      "Navalha de Ouro",
    ];

    const addresses = [
      "Rua das Flores, 789",
      "Avenida Central, 456",
      "Praça da Sé, 123",
      "Alameda dos Anjos, 321",
      "Rua da Mooca, 654",
      "Avenida Paulista, 987",
    ];

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa e toalha quente.",
        price: 40.0,
        imageUrl: "https://utfs.io/f/e6bdffb6-24a9-4ecd-a58a-4d3092c6d60d-1kgxo8.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para o seu visual.",
        price: 35.0,
        imageUrl: "https://utfs.io/f/8a4576d7-d510-4e10-b942-b604153b6cb1-16u.png",
      },
      {
        name: "Sobrancelha",
        description: "Design e alinhamento de sobrancelhas.",
        price: 20.0,
        imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c533-bvr825.png",
      },
      {
        name: "Massagem",
        description: "Massagem relaxante capilar e facial.",
        price: 50.0,
        imageUrl: "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Tratamento profundo para cabelos e barba.",
        price: 25.0,
        imageUrl: "https://utfs.io/f/8a4576d7-d510-4e10-b942-b604153b6cb1-16u.png",
      },
    ];

    for (let i = 0; i < creativeNames.length; i++) {
      const name = creativeNames[i];
      const address = addresses[i];
      const imageUrl = images[i];

      const barbershop = await prisma.barbershop.create({
        data: {
          name,
          address,
          imageUrl,
          phones: ["(11) 99999-9999", "(11) 98888-8888"],
          description:
            "Oferecemos uma experiência completa de cuidado masculino com profissionais de ponta em um ambiente clássico e acolhedor.",
        },
      });

      for (const service of services) {
        await prisma.service.create({
          data: {
            name: service.name,
            description: service.description,
            price: service.price,
            barbershopId: barbershop.id,
            imageUrl: service.imageUrl,
          },
        });
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
