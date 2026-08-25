import { describe, expect, it } from "vitest";
import { generateDayTimeList } from "@/helpers/hours";

describe("generateDayTimeList", () => {
  it("generates 45-minute slots from 09:00 to 18:00", () => {
    const result = generateDayTimeList(new Date(2026, 7, 25));

    expect(result[0]).toBe("09:00");
    expect(result[result.length - 1]).toBe("18:00");
    expect(result).toContain("09:45");
    expect(result).toContain("17:15");
  });

  it("never returns a time before 09:00 or after 18:00", () => {
    const result = generateDayTimeList(new Date(2026, 7, 25));

    for (const time of result) {
      expect(time >= "09:00" && time <= "18:00").toBe(true);
    }
  });
});
