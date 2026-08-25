import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Search } from "@/components/shared/search";
import { BarbershopItem } from "@/components/barbershops/barbershop-item";
import { BookingItem } from "@/components/bookings/booking-item";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const [barbershops, recommendedBarbershops, userBookings] = await Promise.all([
    db.barbershop.findMany(),
    db.barbershop.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    session?.user?.id
      ? db.booking.findMany({
          where: {
            userId: session.user.id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name?.split(" ")[0] : "vamos agendar um corte hoje?"}!
        </h2>
        <p className="capitalize text-sm text-gray-400">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      {userBookings.length > 0 && (
        <div className="mt-6">
          <h2 className="px-5 text-xs uppercase font-bold text-gray-400 mb-3">
            Agendamentos
          </h2>
          <div className="px-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {userBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase font-bold text-gray-400 mb-3">
          Recomendados
        </h2>
        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {recommendedBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6 mb-[4.5rem]">
        <h2 className="px-5 text-xs uppercase font-bold text-gray-400 mb-3">
          Populares
        </h2>
        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
