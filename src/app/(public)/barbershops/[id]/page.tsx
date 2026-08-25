import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { BarbershopInfo } from "@/components/barbershops/barbershop-info";
import { ServiceItem } from "@/components/barbershops/service-item";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

export default async function BarbershopDetailsPage({
  params,
}: BarbershopDetailsPageProps) {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    return notFound();
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    return notFound();
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            barbershop={barbershop}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}
