import { describe, it, expect } from "vitest";
import { shortTitle } from "./short-title";

describe("shortTitle", () => {
  it("returns empty string for nullish input", () => {
    expect(shortTitle(undefined)).toBe("");
    expect(shortTitle(null)).toBe("");
    expect(shortTitle("")).toBe("");
    expect(shortTitle("   ")).toBe("");
  });

  it("returns the title unchanged when there is nothing to trim", () => {
    expect(shortTitle("10 Days in Bali")).toBe("10 Days in Bali");
  });

  it("cuts everything after a colon", () => {
    expect(
      shortTitle("7 Days in Yogyakarta and East Java: Borobudur, Bromo and Ijen"),
    ).toBe("7 Days in Yogyakarta and East Java");
  });

  it("cuts at em dash", () => {
    expect(shortTitle("10 Days in Bali — Beaches, Temples & Cliffs")).toBe(
      "10 Days in Bali",
    );
  });

  it("cuts at en dash", () => {
    expect(shortTitle("9 Days in Raja Ampat – Diving and Reefs")).toBe(
      "9 Days in Raja Ampat",
    );
  });

  it("cuts at hyphen with spaces", () => {
    expect(shortTitle("5 Days in Lombok - Hidden Beaches")).toBe("5 Days in Lombok");
  });

  it("cuts at pipe", () => {
    expect(shortTitle("Two Weeks Across Indonesia | First-Timer Guide")).toBe(
      "Two Weeks Across Indonesia",
    );
  });

  it("cuts at slash", () => {
    expect(shortTitle("Bali / Nusa Islands Adventure")).toBe("Bali");
  });

  it("strips trailing parenthetical asides", () => {
    expect(shortTitle("8 Days in Komodo and Flores (Dragons & Reefs)")).toBe(
      "8 Days in Komodo and Flores",
    );
  });

  it("strips trailing square-bracket asides", () => {
    expect(shortTitle("3 Days in Ubud [Editor's Pick]")).toBe("3 Days in Ubud");
  });

  it("strips trailing brace asides", () => {
    expect(shortTitle("Sumatra Expedition {2026}")).toBe("Sumatra Expedition");
  });

  it("strips multiple stacked trailing brackets", () => {
    expect(shortTitle("Bali Honeymoon (Romantic) [New]")).toBe("Bali Honeymoon");
  });

  it("preserves parentheses that appear mid-title", () => {
    // Mid-string parens are kept; only trailing ones are stripped.
    expect(shortTitle("Bali (Quick) and Java Trip")).toBe("Bali (Quick) and Java Trip");
  });

  it("trims dangling 'and' connector", () => {
    expect(shortTitle("7 Days in Yogyakarta and East Java, and")).toBe(
      "7 Days in Yogyakarta and East Java",
    );
  });

  it("trims dangling '&' connector", () => {
    expect(shortTitle("Bali & Nusa Islands &")).toBe("Bali & Nusa Islands");
  });

  it("trims dangling 'featuring' connector", () => {
    expect(shortTitle("10 Days in Java featuring")).toBe("10 Days in Java");
  });

  it("trims dangling 'with' connector", () => {
    expect(shortTitle("Komodo Adventure with")).toBe("Komodo Adventure");
  });

  it("trims trailing punctuation", () => {
    expect(shortTitle("Bali Quick Escape,")).toBe("Bali Quick Escape");
    expect(shortTitle("Bali Quick Escape — ")).toBe("Bali Quick Escape");
  });

  it("strips brackets first, then cuts at separator, then strips dangle", () => {
    expect(
      shortTitle("7 Days in Yogya and Java: Borobudur, Bromo, and (Featured)"),
    ).toBe("7 Days in Yogya and Java");
  });

  it("does not crash on weird whitespace-only fragments", () => {
    expect(shortTitle("   :   foo")).toBe("");
  });
});
