import { db } from "@/lib/prisma";

interface CreateBookingParams {
  userId: string;
  serviceId: string;
  barbershopId: string;
  date: Date;
}

export async function createBooking({
  userId,
  serviceId,
  barbershopId,
  date,
}: CreateBookingParams) {
  // Verificar conflito de agendamento no mesmo horário
  const existingBooking = await db.booking.findFirst({
    where: {
      barbershopId,
      date,
    },
  });

  if (existingBooking) {
    throw new Error("Este horário já está reservado.");
  }

  return db.booking.create({
    data: {
      userId,
      serviceId,
      barbershopId,
      date,
    },
  });
}

export async function cancelBooking(bookingId: string, userId: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Agendamento não encontrado.");
  }

  if (booking.userId !== userId) {
    throw new Error("Você não tem permissão para cancelar este agendamento.");
  }

  return db.booking.delete({
    where: { id: bookingId },
  });
}

export async function getUserBookings(userId: string) {
  return db.booking.findMany({
    where: {
      userId,
    },
    include: {
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "asc",
    },
  });
}
