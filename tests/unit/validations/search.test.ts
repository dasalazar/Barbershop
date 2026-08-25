import { describe, expect, it } from "vitest";
import { searchSchema } from "@/lib/validations/search";

describe("searchSchema", () => {
  it("accepts a non-empty search term", () => {
    expect(searchSchema.safeParse({ search: "corte" }).success).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    const result = searchSchema.safeParse({ search: "  corte  " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe("corte");
    }
  });

  it("rejects an empty search term", () => {
    expect(searchSchema.safeParse({ search: "" }).success).toBe(false);
  });

  it("rejects a search term made only of whitespace", () => {
    expect(searchSchema.safeParse({ search: "   " }).success).toBe(false);
  });
});
