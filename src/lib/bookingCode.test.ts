import { describe, it, expect } from "vitest";
import { bookingDisplayCode } from "@/lib/bookingCode";

describe("bookingDisplayCode", () => {
  it("shows the sequential order code when the booking has one", () => {
    expect(bookingDisplayCode({ _id: "6aca50e131f957f391b24db9", orderCode: "LIT-ORD-10002" })).toBe("LIT-ORD-10002");
  });

  it("falls back to BKG-<last 6 of id> for older bookings", () => {
    expect(bookingDisplayCode({ _id: "6aa4f0f0b6ad920ef7fb6032" })).toBe("BKG-FB6032");
    expect(bookingDisplayCode({ _id: "6aa4f0f0b6ad920ef7fb6032", orderCode: null })).toBe("BKG-FB6032");
    expect(bookingDisplayCode({ _id: "6aa4f0f0b6ad920ef7fb6032", orderCode: "" })).toBe("BKG-FB6032");
  });

  it("never shows the raw database id", () => {
    expect(bookingDisplayCode({ _id: "6aca50e131f957f391b24db9" })).not.toContain("6aca50e1");
  });

  it("returns an empty string when there is no booking", () => {
    expect(bookingDisplayCode(null)).toBe("");
    expect(bookingDisplayCode(undefined)).toBe("");
    expect(bookingDisplayCode({})).toBe("");
  });
});
