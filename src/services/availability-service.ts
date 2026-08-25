import { db } from "@/lib/prisma";

interface GetDayBookingsParams {
  barbershopId: string;
  date: Date;
}

export async function getDayBookings({ barbershopId, date }: GetDayBookingsParams) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await db.booking.findMany({
    where: {
      barbershopId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  return bookings;
}
