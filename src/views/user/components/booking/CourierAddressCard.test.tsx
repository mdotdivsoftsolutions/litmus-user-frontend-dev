import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { getRegionalOffice, getPublicSettings } = vi.hoisted(() => ({
  getRegionalOffice: vi.fn(),
  getPublicSettings: vi.fn(),
}));
vi.mock("@/lib/api/settings", () => ({ settingsApi: { getRegionalOffice, getPublicSettings } }));

import { CourierAddressCard } from "@/views/user/components/booking/CourierAddressCard";

const renderCard = (props: Parameters<typeof CourierAddressCard>[0] = {}) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <CourierAddressCard {...props} />
    </QueryClientProvider>
  );
};

const kochi = {
  name: "Kochi",
  facilityName: "Litmus Kochi Sample Intake Centre",
  attention: "Sample Desk",
  street: "Palakadavu",
  city: "Kochi",
  state: "Kerala",
  pincode: "682001",
  phone: "+91 90000 00000",
  email: "kochi@example.com",
  workingHours: "Mon – Sat",
};

beforeEach(() => {
  getRegionalOffice.mockReset();
  getPublicSettings.mockReset();
});

describe("CourierAddressCard", () => {
  it("shows a loading placeholder, not a fallback address, while the office loads", () => {
    getRegionalOffice.mockReturnValue(new Promise(() => {}));
    renderCard({ address: { state: "Kerala" } });
    expect(screen.getByRole("status", { name: "Loading courier address" })).toBeInTheDocument();
    expect(screen.queryByText(/Spencer Plaza/)).not.toBeInTheDocument();
  });

  it("shows the office the API returns for the customer's state", async () => {
    getRegionalOffice.mockResolvedValue({ data: { office: kochi, resolvedState: "Kerala", isFallback: false } });
    renderCard({ address: { state: "Kerala" } });
    expect(await screen.findByText("Litmus Kochi Sample Intake Centre")).toBeInTheDocument();
    expect(screen.getByText(/Palakadavu/)).toBeInTheDocument();
  });

  it("shows the address saved on the booking without calling the API", () => {
    renderCard({ destination: kochi });
    expect(screen.getByText("Litmus Kochi Sample Intake Centre")).toBeInTheDocument();
    expect(getRegionalOffice).not.toHaveBeenCalled();
    expect(getPublicSettings).not.toHaveBeenCalled();
  });

  it("falls back to the real Chennai office when every lookup fails", async () => {
    getRegionalOffice.mockRejectedValue(new Error("down"));
    getPublicSettings.mockRejectedValue(new Error("down"));
    renderCard({ address: { state: "Tamil Nadu" } });
    expect(await screen.findByText(/Spencer Plaza/)).toBeInTheDocument();
    expect(screen.queryByText(/98765 43210|Tower B/)).not.toBeInTheDocument();
  });
});
