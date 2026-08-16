import { describe, it, expect } from "vitest";
import { formatCurrency, cn } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats Indian grouping", () => {
    expect(formatCurrency(15000)).toBe("15,000");
    expect(formatCurrency(112000)).toBe("1,12,000");
  });

  it("returns 0 for empty values", () => {
    expect(formatCurrency(undefined)).toBe("0");
    expect(formatCurrency(null)).toBe("0");
    expect(formatCurrency("abc")).toBe("0");
  });
});

describe("cn", () => {
  it("merges tailwind classes", () => {
    expect(cn("p-2", "p-4")).toContain("p-4");
    expect(cn("p-2", "p-4")).not.toContain("p-2");
  });
});
