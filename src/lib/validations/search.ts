import { z } from "zod";

export const searchSchema = z.object({
  search: z
    .string()
    .trim()
    .min(1, { message: "Digite algo para buscar" }),
});

export type SearchSchema = z.infer<typeof searchSchema>;
