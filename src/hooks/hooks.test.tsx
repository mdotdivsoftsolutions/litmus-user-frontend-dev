import { describe, it, expect, vi, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "@/hooks/use-debounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { reducer } from "@/hooks/use-toast";

describe("useDebounce", () => {
  afterEach(() => vi.useRealTimers());

  it("only publishes the latest value after the delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: "w" } });

    rerender({ value: "wa" });
    rerender({ value: "water" });
    expect(result.current).toBe("w");

    act(() => void vi.advanceTimersByTime(299));
    expect(result.current).toBe("w");
    act(() => void vi.advanceTimersByTime(1));
    expect(result.current).toBe("water");
  });

  it("clears its timer on unmount (no state update after unmount)", () => {
    vi.useFakeTimers();
    const { rerender, unmount } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: 1 } });
    rerender({ value: 2 });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("useIsMobile", () => {
  const setWidth = (w: number) => Object.defineProperty(window, "innerWidth", { configurable: true, value: w });
  afterEach(() => setWidth(1024));

  it("is true below 768px and false at or above it", () => {
    setWidth(500);
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);
    setWidth(768);
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
  });

  it("removes its media-query listener on unmount", () => {
    const add = vi.fn();
    const remove = vi.fn();
    const original = window.matchMedia;
    window.matchMedia = vi.fn(() => ({ addEventListener: add, removeEventListener: remove })) as unknown as typeof window.matchMedia;

    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(remove).toHaveBeenCalledWith("change", add.mock.calls[0][1]);
    window.matchMedia = original;
  });
});

describe("toast reducer", () => {
  const toast = (id: string) => ({ id, title: id, open: true });

  it("keeps at most one toast, newest first", () => {
    let state = reducer({ toasts: [] }, { type: "ADD_TOAST", toast: toast("1") });
    state = reducer(state, { type: "ADD_TOAST", toast: toast("2") });
    expect(state.toasts.map((t) => t.id)).toEqual(["2"]);
  });

  it("updates a toast by id", () => {
    const state = reducer({ toasts: [toast("1")] }, { type: "UPDATE_TOAST", toast: { id: "1", title: "Saved" } });
    expect(state.toasts[0].title).toBe("Saved");
  });

  it("dismiss closes the toast; remove deletes it", () => {
    vi.useFakeTimers();
    let state = reducer({ toasts: [toast("1")] }, { type: "DISMISS_TOAST", toastId: "1" });
    expect(state.toasts[0].open).toBe(false);
    state = reducer(state, { type: "REMOVE_TOAST", toastId: "1" });
    expect(state.toasts).toEqual([]);
    expect(reducer({ toasts: [toast("a")] }, { type: "REMOVE_TOAST" }).toasts).toEqual([]);
    vi.clearAllTimers();
    vi.useRealTimers();
  });
});
