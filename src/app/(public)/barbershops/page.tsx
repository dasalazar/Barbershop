import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Search } from "@/components/shared/search";
import { BarbershopItem } from "@/components/barbershops/barbershop-item";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface BarbershopsPageProps {
  searchParams: {
    search?: string;
  };
}

export default async function BarbershopsPage({
  searchParams,
}: BarbershopsPageProps) {
  if (!searchParams.search) {
    return redirect("/");
  }

  const barbershops = await db.barbershop.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchParams.search,
            mode: "insensitive",
          },
        },
        {
          services: {
            some: {
              name: {
                contains: searchParams.search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
  });

  return (
    <>
      <Header />

      <div className="px-5 py-6 flex flex-col gap-6">
        <Search defaultValues={{ search: searchParams.search }} />

        <h1 className="text-gray-400 font-bold text-xs uppercase">
          Resultados para &quot;{searchParams.search}&quot;
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="w-full">
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>

        {barbershops.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhuma barbearia encontrada.</p>
        )}
      </div>

      <Footer />
    </>
  );
}
