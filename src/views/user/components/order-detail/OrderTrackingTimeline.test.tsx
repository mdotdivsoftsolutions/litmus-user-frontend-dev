import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderTrackingTimeline } from "@/views/user/components/order-detail/OrderTrackingTimeline";

describe("OrderTrackingTimeline", () => {
  it("renders all five steps", () => {
    render(<OrderTrackingTimeline currentStep={0} />);
    expect(screen.getByText("Booked")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Lab Testing")).toBeInTheDocument();
    expect(screen.getByText("Report Ready")).toBeInTheDocument();
  });

  it("marks later steps incomplete when still booked", () => {
    render(<OrderTrackingTimeline currentStep={0} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("fills all steps when report is ready", () => {
    render(<OrderTrackingTimeline currentStep={4} />);
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });
});
