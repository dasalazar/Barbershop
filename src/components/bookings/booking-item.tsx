"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cancelBookingAction } from "@/actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

export function BookingItem({ booking }: BookingItemProps) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isBookingConfirmed = isFuture(booking.date);

  const handleCancelBooking = async () => {
    setIsDeleteLoading(true);
    try {
      await cancelBookingAction(booking.id);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cancelar reserva. Tente novamente.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full cursor-pointer">
          <CardContent className="p-0 flex justify-between">
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge
                variant={isBookingConfirmed ? "default" : "secondary"}
                className="w-fit"
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>{booking.barbershop.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-solid px-5">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl font-bold">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "HH:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="px-0 overflow-y-auto">
        <SheetHeader className="px-5 text-left pb-6 border-b border-solid">
          <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="px-5 py-6">
          <Card>
            <CardContent className="p-3 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="font-bold">{booking.service.name}</h2>
                <h3 className="font-bold text-sm">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </h3>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Data</span>
                <span className="text-white capitalize">
                  {format(booking.date, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Horário</span>
                <span className="text-white">{format(booking.date, "HH:mm")}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Barbearia</span>
                <span className="text-white">{booking.barbershop.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="flex-row gap-3 px-5 mt-6">
          <SheetClose asChild>
            <Button variant="secondary" className="w-full">
              Voltar
            </Button>
          </SheetClose>

          {isBookingConfirmed && (
            <Button
              variant="destructive"
              className="w-full"
              disabled={isDeleteLoading}
              onClick={handleCancelBooking}
            >
              {isDeleteLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancelar Reserva
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
