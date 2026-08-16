import { describe, it, expect } from "vitest";
import {
  isPaymentSuccessful,
  isOrderPaymentSettled,
  getOrderTimelineStep,
  paymentStatusLabel,
  formatBookingStatus,
} from "@/lib/payment-status";

describe("isPaymentSuccessful", () => {
  it("accepts SUCCESS, COMPLETED, and PAID", () => {
    expect(isPaymentSuccessful("SUCCESS")).toBe(true);
    expect(isPaymentSuccessful("paid")).toBe(true);
    expect(isPaymentSuccessful("COMPLETED")).toBe(true);
  });

  it("rejects pending and empty", () => {
    expect(isPaymentSuccessful("PENDING")).toBe(false);
    expect(isPaymentSuccessful("")).toBe(false);
    expect(isPaymentSuccessful(null)).toBe(false);
  });
});

describe("getOrderTimelineStep", () => {
  it("maps completed bookings to Report Ready", () => {
    expect(getOrderTimelineStep("COMPLETED", "PENDING")).toBe(4);
  });

  it("maps in-progress to Lab Testing", () => {
    expect(getOrderTimelineStep("IN_PROGRESS", "SUCCESS")).toBe(3);
  });

  it("stays on Booked until payment succeeds", () => {
    expect(getOrderTimelineStep("PENDING", "PENDING")).toBe(0);
  });

  it("moves to Payment after success while still pending approval", () => {
    expect(getOrderTimelineStep("PENDING", "SUCCESS")).toBe(1);
  });

  it("returns -1 for rejected or cancelled", () => {
    expect(getOrderTimelineStep("REJECTED")).toBe(-1);
    expect(getOrderTimelineStep("CANCELLED")).toBe(-1);
  });
});

describe("paymentStatusLabel", () => {
  it("shows Paid when booking has progressed even if payment field is stale", () => {
    expect(paymentStatusLabel("PENDING", "COMPLETED")).toBe("Paid");
  });

  it("keeps Failed and Refunded", () => {
    expect(paymentStatusLabel("FAILED", "COMPLETED")).toBe("Failed");
    expect(paymentStatusLabel("REFUNDED")).toBe("Refunded");
  });

  it("shows Pending for unpaid new bookings", () => {
    expect(paymentStatusLabel("PENDING", "PENDING")).toBe("Pending");
  });
});

describe("isOrderPaymentSettled", () => {
  it("does not infer paid from failed payments", () => {
    expect(isOrderPaymentSettled("FAILED", "APPROVED")).toBe(false);
  });
});

describe("formatBookingStatus", () => {
  it("humanizes IN_PROGRESS", () => {
    expect(formatBookingStatus("IN_PROGRESS")).toBe("In Progress");
  });

  it("title-cases COMPLETED", () => {
    expect(formatBookingStatus("COMPLETED")).toBe("Completed");
  });
});
