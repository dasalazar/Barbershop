import { NextRequest, NextResponse } from "next/server";
import { getDayBookings } from "@/services/availability-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const barbershopId = searchParams.get("barbershopId");
  const dateString = searchParams.get("date");

  if (!barbershopId || !dateString) {
    return NextResponse.json(
      { error: "barbershopId e date são obrigatórios." },
      { status: 400 }
    );
  }

  const date = new Date(dateString);
  const bookings = await getDayBookings({ barbershopId, date });

  return NextResponse.json(bookings);
}
