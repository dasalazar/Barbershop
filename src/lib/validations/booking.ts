import { addDays } from "date-fns";
import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "ID do serviço é obrigatório"),
  barbershopId: z.string().min(1, "ID da barbearia é obrigatório"),
  date: z
    .date()
    .refine((date) => date > new Date(), {
      message: "A data deve ser futura",
    })
    .refine((date) => date < addDays(new Date(), 30), {
      message: "Máximo de 30 dias de antecedência",
    }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
