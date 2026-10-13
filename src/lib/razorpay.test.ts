import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadRazorpayScript, openRazorpayCheckout, type RazorpayPaymentOptions } from "@/lib/razorpay";

const SCRIPT_SELECTOR = 'script[src="https://checkout.razorpay.com/v1/checkout.js"]';
type CheckoutConfig = Record<string, unknown> & {
  handler: (response: Record<string, string>) => void;
  modal: { ondismiss: () => void };
};

const scripts = () => document.querySelectorAll<HTMLScriptElement>(SCRIPT_SELECTOR);

beforeEach(() => {
  document.querySelectorAll(SCRIPT_SELECTOR).forEach((s) => s.remove());
  delete window.Razorpay;
});

describe("loadRazorpayScript", () => {
  it("resolves immediately when the SDK is already on the page", async () => {
    window.Razorpay = vi.fn() as unknown as typeof window.Razorpay;
    await expect(loadRazorpayScript()).resolves.toBe(true);
    expect(scripts()).toHaveLength(0);
  });

  it("injects a single async script tag and resolves true once it loads", async () => {
    const pending = loadRazorpayScript();
    expect(scripts()).toHaveLength(1);
    expect(scripts()[0].async).toBe(true);
    scripts()[0].onload?.(new Event("load"));
    await expect(pending).resolves.toBe(true);
  });

  it("does not add a duplicate tag while the first load is in flight", async () => {
    const first = loadRazorpayScript();
    const second = loadRazorpayScript();
    expect(scripts()).toHaveLength(1);

    const tag = scripts()[0];
    tag.onload?.(new Event("load"));
    tag.dispatchEvent(new Event("load"));
    await expect(first).resolves.toBe(true);
    await expect(second).resolves.toBe(true);
  });

  it("removes a failed tag so the next attempt can retry instead of hanging", async () => {
    const first = loadRazorpayScript();
    scripts()[0].onerror?.(new Event("error"));
    await expect(first).resolves.toBe(false);
    expect(scripts()).toHaveLength(0);

    const retry = loadRazorpayScript();
    expect(scripts()).toHaveLength(1);
    scripts()[0].onload?.(new Event("load"));
    await expect(retry).resolves.toBe(true);
  });
});

describe("openRazorpayCheckout", () => {
  const baseOptions = (): RazorpayPaymentOptions => ({
    orderId: "order_123",
    amount: 64900,
    currency: "INR",
    keyId: "rzp_test_key",
    bookingId: "6aca50e131f957f391b24db9",
    prefill: { name: "Test Customer", email: "test@example.com" },
    onSuccess: vi.fn(),
    onFailure: vi.fn(),
    onDismiss: vi.fn(),
  });

  const installRazorpay = () => {
    const instance = { on: vi.fn(), open: vi.fn() };
    const ctor = vi.fn(function () {
      return instance;
    });
    window.Razorpay = ctor as unknown as typeof window.Razorpay;
    return { ctor, instance };
  };

  it("reports SCRIPT_LOAD_FAILED when the SDK cannot be loaded", async () => {
    const options = baseOptions();
    const opening = openRazorpayCheckout(options);
    scripts()[0].onerror?.(new Event("error"));
    await opening;
    expect(options.onFailure).toHaveBeenCalledWith(expect.objectContaining({ code: "SCRIPT_LOAD_FAILED" }));
  });

  it("opens checkout with the backend amount, order and prefill", async () => {
    const { ctor, instance } = installRazorpay();
    const options = baseOptions();
    await openRazorpayCheckout(options);

    const config = (ctor.mock.calls[0] as unknown[])[0] as CheckoutConfig;
    expect(config).toMatchObject({
      key: "rzp_test_key",
      amount: 64900,
      currency: "INR",
      order_id: "order_123",
      prefill: { name: "Test Customer", email: "test@example.com", contact: "" },
      notes: { bookingId: "6aca50e131f957f391b24db9" },
    });
    expect(instance.open).toHaveBeenCalledOnce();
  });

  it("passes only the three signed fields to onSuccess", async () => {
    const { ctor } = installRazorpay();
    const options = baseOptions();
    await openRazorpayCheckout(options);

    const config = (ctor.mock.calls[0] as unknown[])[0] as CheckoutConfig;
    config.handler({ razorpay_order_id: "o", razorpay_payment_id: "p", razorpay_signature: "s", extra: "x" });
    expect(options.onSuccess).toHaveBeenCalledWith({ razorpay_order_id: "o", razorpay_payment_id: "p", razorpay_signature: "s" });
  });

  it("calls onDismiss when the modal is closed", async () => {
    const { ctor } = installRazorpay();
    const options = baseOptions();
    await openRazorpayCheckout(options);
    ((ctor.mock.calls[0] as unknown[])[0] as CheckoutConfig).modal.ondismiss();
    expect(options.onDismiss).toHaveBeenCalledOnce();
  });

  it("maps payment.failed events to onFailure with safe defaults", async () => {
    const { instance } = installRazorpay();
    const options = baseOptions();
    await openRazorpayCheckout(options);

    const [event, handler] = instance.on.mock.calls[0];
    expect(event).toBe("payment.failed");
    handler({ error: { code: "BAD_REQUEST_ERROR", description: "Card declined", reason: "payment_failed" } });
    handler({});
    expect(options.onFailure).toHaveBeenNthCalledWith(1, { code: "BAD_REQUEST_ERROR", description: "Card declined", reason: "payment_failed" });
    expect(options.onFailure).toHaveBeenNthCalledWith(2, { code: "PAYMENT_FAILED", description: "Payment failed", reason: "unknown" });
  });
});
