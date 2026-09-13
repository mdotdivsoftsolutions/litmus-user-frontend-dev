import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderTrackingTimeline } from "@/views/user/components/order-detail/OrderTrackingTimeline";

describe("OrderTrackingTimeline", () => {
  it("renders all eight fulfillment stepper steps", () => {
    render(<OrderTrackingTimeline currentStep={0} />);
    expect(screen.getByText("Booking Placed")).toBeInTheDocument();
    expect(screen.getByText("Payment Confirmed (Paid)")).toBeInTheDocument();
    expect(screen.getByText("Admin Approved")).toBeInTheDocument();
    expect(screen.getByText("Lab Assigned")).toBeInTheDocument();
    expect(screen.getByText("Collector Assigned")).toBeInTheDocument();
    expect(screen.getByText("Sample Collected")).toBeInTheDocument();
    expect(screen.getByText("Testing in Progress")).toBeInTheDocument();
    expect(screen.getByText("Certified Report Uploaded")).toBeInTheDocument();
  });

  it("marks later steps incomplete when still at step 0", () => {
    render(<OrderTrackingTimeline currentStep={0} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("marks all steps completed when currentStep is 7", () => {
    render(<OrderTrackingTimeline currentStep={7} />);
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("8")).not.toBeInTheDocument();
  });

  it("renders with live booking data correctly", () => {
    const mockBooking = {
      status: "IN_PROGRESS",
      paymentStatus: "SUCCESS",
      createdAt: "2026-09-12T11:58:00.000Z",
      labId: { labName: "Apex Food Testing & Research Centre" },
      collectionStatus: "COLLECTED",
      assignedCollector: { name: "Ramesh", contact: "+91 9876543210" },
    };
    render(<OrderTrackingTimeline booking={mockBooking} />);
    expect(screen.getByText("Booking Placed")).toBeInTheDocument();
    expect(screen.getByText("Payment Confirmed (Paid)")).toBeInTheDocument();
    expect(screen.getByText("Admin Approved")).toBeInTheDocument();
    expect(screen.getByText("Assigned to: Apex Food Testing & Research Centre")).toBeInTheDocument();
    expect(screen.getByText("Collector: Ramesh (+91 9876543210)")).toBeInTheDocument();
    expect(screen.getByText("Sample collected & verified from client")).toBeInTheDocument();
  });
});
