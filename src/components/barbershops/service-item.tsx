"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { useState, useMemo, useEffect } from "react";
import { Barbershop, Booking, Service } from "@prisma/client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { format, setHours, setMinutes } from "date-fns";
import { generateDayTimeList } from "@/helpers/hours";
import { saveBookingAction } from "@/actions/save-booking";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ServiceItemProps {
  service: Service;
  barbershop: Barbershop;
  isAuthenticated: boolean;
}

export function ServiceItem({
  service,
  barbershop,
  isAuthenticated,
}: ServiceItemProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string | undefined>(undefined);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [submitIsLoading, setSubmitIsLoading] = useState(false);

  const timeList = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return generateDayTimeList(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const refreshAvailableHours = async () => {
      const response = await fetch(
        `/api/bookings?barbershopId=${barbershop.id}&date=${selectedDate.toISOString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setDayBookings(data);
      }
    };

    refreshAvailableHours();
  }, [selectedDate, barbershop.id]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);
    try {
      if (!selectedDate || !selectedHour) {
        return;
      }

      const [hours, minutes] = selectedHour.split(":");
      const bookingDateTime = setMinutes(
        setHours(selectedDate, Number(hours)),
        Number(minutes)
      );

      await saveBookingAction({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: bookingDateTime,
      });

      setSheetIsOpen(false);
      setSelectedDate(undefined);
      setSelectedHour(undefined);
      toast.success("Reserva realizada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao realizar reserva. Tente novamente.");
    } finally {
      setSubmitIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-3 flex items-center gap-3">
        <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col w-full">
          <h2 className="font-bold">{service.name}</h2>
          <p className="text-sm text-gray-400">{service.description}</p>

          <div className="flex items-center justify-between mt-3">
            <p className="text-primary text-sm font-bold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>

            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>
              </SheetTrigger>

              {isAuthenticated && (
                <SheetContent className="p-0 overflow-y-auto">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="py-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedHour(undefined);
                      }}
                      locale={ptBR}
                      fromDate={new Date()}
                      className="w-full"
                    />
                  </div>

                  {selectedDate && (
                    <div className="flex gap-3 overflow-x-auto py-6 px-5 border-t border-solid [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => {
                        const timeIsOccupied = dayBookings.some((booking) => {
                          const bookingHour = format(new Date(booking.date), "HH:mm");
                          return bookingHour === time;
                        });

                        return (
                          <Button
                            key={time}
                            variant={selectedHour === time ? "default" : "outline"}
                            className="rounded-full"
                            disabled={timeIsOccupied}
                            onClick={() => setSelectedHour(time)}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid">
                    <Card>
                      <CardContent className="p-3 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {selectedDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Data</span>
                            <span className="text-white capitalize">
                              {format(selectedDate, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        )}

                        {selectedHour && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Horário</span>
                            <span className="text-white">{selectedHour}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Barbearia</span>
                          <span className="text-white">{barbershop.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className="px-5 pb-6">
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={!selectedHour || !selectedDate || submitIsLoading}
                      className="w-full"
                    >
                      {submitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar Reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              )}
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
