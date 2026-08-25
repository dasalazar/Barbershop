import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Imagens em alta definição e específicas para barbearias (Unsplash)
    const images = [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532710093739-9470acff878f?w=800&auto=format&fit=crop&q=80",
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
        description: "Estilo personalizado com as últimas tendências e acabamento impecável.",
        price: 60.0,
        imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Barba",
        description: "Modelagem completa de barba com produtos premium e toalha quente.",
        price: 40.0,
        imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito de nuca e costeletas para manter o visual em dia.",
        price: 35.0,
        imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Sobrancelha",
        description: "Design e alinhamento de sobrancelhas masculinas na navalha ou pinça.",
        price: 20.0,
        imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Massagem",
        description: "Massagem capilar e facial relaxante para aliviar a tensão do dia.",
        price: 50.0,
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Hidratação",
        description: "Tratamento profundo para revitalização de cabelos secos e barba.",
        price: 25.0,
        imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=80",
      },
    ];

    // Limpar tabelas existentes para garantir dados consistentes
    await prisma.booking.deleteMany();
    await prisma.service.deleteMany();
    await prisma.barbershop.deleteMany();

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
            "Oferecemos uma experiência completa de cuidado masculino com profissionais renomados em um ambiente acolhedor, sofisticado e tradicional.",
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

    console.log("Database seeded successfully with high-quality images!");
  } catch (error) {
    console.error("Error seeding the database: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
