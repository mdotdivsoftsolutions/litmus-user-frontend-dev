import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { getTestById, getPackage } = vi.hoisted(() => ({ getTestById: vi.fn(), getPackage: vi.fn() }));
vi.mock("@/lib/api/test", () => ({ testApi: { getTestById } }));
vi.mock("@/lib/api/package", () => ({ packageApi: { getPackage } }));
// react.cache only exists in the React build Next.js ships for server components.
vi.mock("react", async (importOriginal) => ({ ...(await importOriginal<object>()), cache: <T,>(fn: T) => fn }));

import { withTimeout, toMetaDescription, getTestForPage, getPackageForPage } from "@/lib/serverData";

const VALID_ID = "6aca50e131f957f391b24db9";

describe("withTimeout", () => {
  afterEach(() => vi.useRealTimers());

  it("returns the value when the promise settles in time", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 1000)).resolves.toBe("ok");
  });

  it("returns null when the promise rejects", async () => {
    await expect(withTimeout(Promise.reject(new Error("down")), 1000)).resolves.toBeNull();
  });

  it("returns null when the API is too slow", async () => {
    vi.useFakeTimers();
    const pending = withTimeout(new Promise(() => {}), 2500);
    await vi.advanceTimersByTimeAsync(2500);
    await expect(pending).resolves.toBeNull();
  });

  it("clears its timer once the API answers (no pending timers left behind)", async () => {
    vi.useFakeTimers();
    await withTimeout(Promise.resolve(1), 2500);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("toMetaDescription", () => {
  it("collapses whitespace", () => {
    expect(toMetaDescription("  Water\n\n testing   kit ", "fallback")).toBe("Water testing kit");
  });

  it("uses the fallback for empty or non-string input", () => {
    expect(toMetaDescription("", "fallback")).toBe("fallback");
    expect(toMetaDescription(undefined, "fallback")).toBe("fallback");
    expect(toMetaDescription({ html: "x" }, "fallback")).toBe("fallback");
  });

  it("caps long text at 160 characters with an ellipsis", () => {
    const out = toMetaDescription("a".repeat(300), "fallback");
    expect(out).toHaveLength(160);
    expect(out.endsWith("...")).toBe(true);
  });
});

describe("getTestForPage / getPackageForPage", () => {
  beforeEach(() => {
    getTestById.mockReset();
    getPackage.mockReset();
  });

  it("never calls the API for ids that are not ObjectIds", async () => {
    expect(await getTestForPage("../../admin")).toBeNull();
    expect(await getPackageForPage("not-an-id")).toBeNull();
    expect(getTestById).not.toHaveBeenCalled();
    expect(getPackage).not.toHaveBeenCalled();
  });

  it("returns the API data for a valid id", async () => {
    getTestById.mockResolvedValue({ data: { _id: VALID_ID, name: "pH" } });
    getPackage.mockResolvedValue({ data: { _id: VALID_ID, name: "Water pack" } });
    expect(await getTestForPage(VALID_ID)).toEqual({ _id: VALID_ID, name: "pH" });
    expect(await getPackageForPage(VALID_ID)).toEqual({ _id: VALID_ID, name: "Water pack" });
  });

  it("returns null instead of throwing when the API fails", async () => {
    getTestById.mockRejectedValue(new Error("500"));
    expect(await getTestForPage("6aca50e131f957f391b24dba")).toBeNull();
  });
});
