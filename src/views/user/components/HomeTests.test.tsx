import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { getAllPackages } = vi.hoisted(() => ({ getAllPackages: vi.fn() }));
vi.mock("@/lib/api/package", () => ({ packageApi: { getAllPackages } }));
// Cards pull in cart/auth hooks; only the list behaviour is under test here.
vi.mock("@/views/user/components/TestCard", () => ({
  TestCard: ({ t }: { t: { name: string } }) => <div data-testid="pkg">{t.name}</div>,
}));

import { HomeTests } from "@/views/user/components/HomeTests";
import { toList } from "@/views/user/components/home/useHomeList";

const pkgs = (n: number) => Array.from({ length: n }, (_, i) => ({ _id: `id${i}`, name: `Package ${i + 1}` }));

const renderHomeTests = (initialPackages: unknown) => {
  const client = new QueryClient({ defaultOptions: { queries: { retryDelay: 1 } } });
  return render(
    <QueryClientProvider client={client}>
      <HomeTests initialPackages={initialPackages} />
    </QueryClientProvider>
  );
};

beforeEach(() => getAllPackages.mockReset());

describe("HomeTests (popular packages on the home page)", () => {
  it("shows the server-loaded packages without calling the API again", () => {
    renderHomeTests({ success: true, data: pkgs(3) });
    expect(screen.getAllByTestId("pkg")).toHaveLength(3);
    expect(getAllPackages).not.toHaveBeenCalled();
  });

  it("shows at most 5 packages", () => {
    renderHomeTests({ data: pkgs(8) });
    expect(screen.getAllByTestId("pkg")).toHaveLength(5);
  });

  it("loads packages in the browser when the server render timed out (null)", async () => {
    getAllPackages.mockResolvedValue({ data: pkgs(2) });
    renderHomeTests(null);

    expect(screen.getByLabelText("Loading popular packages")).toBeInTheDocument();
    expect(await screen.findAllByTestId("pkg")).toHaveLength(2);
    expect(screen.queryByText("No popular packages found.")).not.toBeInTheDocument();
  });

  it("also recovers when the server sent an empty list", async () => {
    getAllPackages.mockResolvedValue({ data: pkgs(1) });
    renderHomeTests({ data: [] });
    expect(await screen.findAllByTestId("pkg")).toHaveLength(1);
  });

  it("offers a retry when the browser request fails too", async () => {
    getAllPackages.mockRejectedValue(new Error("down"));
    renderHomeTests(null);

    const button = await screen.findByRole("button", { name: "Try again" }, { timeout: 3000 });
    getAllPackages.mockResolvedValue({ data: pkgs(2) });
    fireEvent.click(button);
    expect(await screen.findAllByTestId("pkg")).toHaveLength(2);
  });

  it("says no packages only when the API really has none", async () => {
    getAllPackages.mockResolvedValue({ data: [] });
    renderHomeTests(null);
    expect(await screen.findByText("No popular packages found.")).toBeInTheDocument();
  });
});

describe("toList", () => {
  it("reads every response shape the API uses", () => {
    expect(toList({ data: [1, 2] })).toEqual([1, 2]);
    expect(toList([1])).toEqual([1]);
    expect(toList({ data: { data: [3] } })).toEqual([3]);
    expect(toList(null)).toEqual([]);
    expect(toList({ data: "x" })).toEqual([]);
  });
});
