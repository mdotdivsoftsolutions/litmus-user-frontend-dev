import { describe, it, expect } from "vitest";
import { isCityCovered } from "@/lib/pickup-coverage";

describe("isCityCovered", () => {
  const cities = ["Chennai", "Bengaluru", " Coimbatore ", "Navi Mumbai"];

  it("matches case- and whitespace-insensitively", () => {
    expect(isCityCovered("chennai", cities)).toBe(true);
    expect(isCityCovered("  COIMBATORE ", cities)).toBe(true);
  });

  it("accepts a covered city written with extra words or punctuation", () => {
    expect(isCityCovered("Chennai, Tamil Nadu", cities)).toBe(true);
    expect(isCityCovered("North Chennai", cities)).toBe(true);
    expect(isCityCovered("Chennai-600002", cities)).toBe(true);
    expect(isCityCovered("navi  mumbai", cities)).toBe(true);
  });

  it("rejects partial text that is only part of a covered city name", () => {
    expect(isCityCovered("Ch", cities)).toBe(false);
    expect(isCityCovered("nai", cities)).toBe(false);
    expect(isCityCovered("a", cities)).toBe(false);
    expect(isCityCovered("Mumbai", cities)).toBe(false);
    expect(isCityCovered("Chennaipattinam", cities)).toBe(false);
  });

  it("rejects cities outside the coverage list", () => {
    expect(isCityCovered("Madurai", cities)).toBe(false);
  });

  it("rejects empty input and an empty coverage list", () => {
    expect(isCityCovered("", cities)).toBe(false);
    expect(isCityCovered("  , ", cities)).toBe(false);
    expect(isCityCovered("Chennai", [])).toBe(false);
    expect(isCityCovered("Chennai", ["  "])).toBe(false);
  });
});
