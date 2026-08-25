import { addDays } from "date-fns";
import { describe, expect, it } from "vitest";
import { createBookingSchema } from "@/lib/validations/booking";

describe("createBookingSchema", () => {
  const base = { serviceId: "service-1", barbershopId: "shop-1" };

  it("accepts a date within the next 30 days", () => {
    const result = createBookingSchema.safeParse({
      ...base,
      date: addDays(new Date(), 1),
    });

    expect(result.success).toBe(true);
  });

  it("rejects a date in the past", () => {
    const result = createBookingSchema.safeParse({
      ...base,
      date: addDays(new Date(), -1),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("A data deve ser futura");
    }
  });

  it("rejects a date more than 30 days away", () => {
    const result = createBookingSchema.safeParse({
      ...base,
      date: addDays(new Date(), 31),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Máximo de 30 dias de antecedência"
      );
    }
  });

  it("requires serviceId and barbershopId", () => {
    const result = createBookingSchema.safeParse({
      serviceId: "",
      barbershopId: "",
      date: addDays(new Date(), 1),
    });

    expect(result.success).toBe(false);
  });
});
