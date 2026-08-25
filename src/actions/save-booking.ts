"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBooking } from "@/services/booking-service";

interface SaveBookingParams {
  serviceId: string;
  barbershopId: string;
  date: Date;
}

export async function saveBookingAction(params: SaveBookingParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  await createBooking({
    ...params,
    userId: session.user.id,
  });

  revalidatePath("/");
  revalidatePath("/bookings");
  revalidatePath(`/barbershops/${params.barbershopId}`);
}
