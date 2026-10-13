import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
// The courier card loads the regional office over the network; not under test here.
vi.mock("@/views/user/components/booking/CourierAddressCard", () => ({ CourierAddressCard: () => null }));

import { BookingStep5Confirmation } from "@/views/user/components/booking/BookingStep5Confirmation";

const ORDER_ID = "6aca50e131f957f391b24db9";

const renderConfirmation = (orderCode?: string) =>
  render(
    <BookingStep5Confirmation
      orderId={ORDER_ID}
      orderCode={orderCode}
      selectedLab={null}
      eligibleLabs={[]}
      items={[]}
      subtotal={550}
      gst={99}
      total={649}
      calculateItemPrice={() => 0}
    />
  );

describe("BookingStep5Confirmation", () => {
  it("shows the LIT-ORD order code the customer will see in emails", () => {
    renderConfirmation("LIT-ORD-10003");
    expect(screen.getAllByText("LIT-ORD-10003").length).toBeGreaterThan(0);
    expect(screen.queryByText(new RegExp(ORDER_ID))).not.toBeInTheDocument();
  });

  it("falls back to the short BKG code, never the raw database id", () => {
    renderConfirmation();
    expect(screen.getAllByText("BKG-B24DB9").length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain(ORDER_ID);
  });
});
