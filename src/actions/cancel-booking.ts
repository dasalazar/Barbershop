"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cancelBooking } from "@/services/booking-service";

export async function cancelBookingAction(bookingId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  await cancelBooking(bookingId, session.user.id);

  revalidatePath("/");
  revalidatePath("/bookings");
}
