import { describe, expect, it } from "vitest";
import { recommendedCap } from "@/lib/trip/types";

describe("recommendedCap", () => {
  it("scales 1 per ~5 days, capped at 3, floored at 1", () => {
    expect(recommendedCap(1)).toBe(1);
    expect(recommendedCap(3)).toBe(1);
    expect(recommendedCap(5)).toBe(1);
    expect(recommendedCap(6)).toBe(2);
    expect(recommendedCap(8)).toBe(2);
    expect(recommendedCap(10)).toBe(2);
    expect(recommendedCap(11)).toBe(3);
    expect(recommendedCap(15)).toBe(3);
    expect(recommendedCap(30)).toBe(3);
  });

  it("never returns 0 even for a missing/zero length", () => {
    expect(recommendedCap(0)).toBe(1);
  });
});
