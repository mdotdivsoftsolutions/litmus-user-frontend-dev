import { describe, it, expect } from "vitest";
import {
  DEFAULT_CHAT_PROMPTS,
  LIVE_SUPPORT_TOTAL_SECONDS,
  LIVE_SUPPORT_MAX_ATTEMPTS,
  LIVE_SUPPORT_ATTEMPT_SECONDS,
  filterSuggestionsForAuth,
  isProtectedRoute,
  isSafeChatTarget,
  resolveChatRoute,
} from "@/lib/liveSupport";

describe("resolveChatRoute", () => {
  it("maps legacy dashboard links to current routes", () => {
    expect(resolveChatRoute("/dashboard/bookings")).toBe("/orders");
    expect(resolveChatRoute("/dashboard/orders")).toBe("/orders");
    expect(resolveChatRoute("/dashboard/reports")).toBe("/reports");
  });

  it("leaves other paths unchanged", () => {
    expect(resolveChatRoute("/tests")).toBe("/tests");
  });
});

describe("isProtectedRoute", () => {
  it("flags customer-only pages and their sub-pages", () => {
    expect(isProtectedRoute("/orders")).toBe(true);
    expect(isProtectedRoute("/orders/abc123")).toBe(true);
    expect(isProtectedRoute("/profile")).toBe(true);
    expect(isProtectedRoute("/bookings/new")).toBe(true);
    expect(isProtectedRoute("/dashboard/reports")).toBe(true);
  });

  it("does not flag public pages or look-alike prefixes", () => {
    expect(isProtectedRoute("/tests")).toBe(false);
    expect(isProtectedRoute("/ordersomething")).toBe(false);
  });
});

describe("isSafeChatTarget", () => {
  it("allows in-site paths and http(s) links", () => {
    expect(isSafeChatTarget("/orders")).toBe(true);
    expect(isSafeChatTarget("https://wa.me/919000000000")).toBe(true);
    expect(isSafeChatTarget("http://example.com")).toBe(true);
  });

  it("blocks script, data and protocol-relative URLs", () => {
    expect(isSafeChatTarget("javascript:alert(1)")).toBe(false);
    expect(isSafeChatTarget("JavaScript:alert(1)")).toBe(false);
    expect(isSafeChatTarget("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isSafeChatTarget("//evil.example.com")).toBe(false);
    expect(isSafeChatTarget("/\\evil.example.com")).toBe(false);
    expect(isSafeChatTarget("orders")).toBe(false);
    expect(isSafeChatTarget("")).toBe(false);
  });
});

describe("filterSuggestionsForAuth", () => {
  it("returns an empty list for missing suggestions", () => {
    expect(filterSuggestionsForAuth(undefined, false)).toEqual([]);
    expect(filterSuggestionsForAuth([], true)).toEqual([]);
  });

  it("keeps everything for signed-in customers", () => {
    expect(filterSuggestionsForAuth(DEFAULT_CHAT_PROMPTS, true)).toHaveLength(DEFAULT_CHAT_PROMPTS.length);
  });

  it("hides sign-in-only suggestions from guests", () => {
    const visible = filterSuggestionsForAuth(DEFAULT_CHAT_PROMPTS, false);
    expect(visible.some((s) => s.requiresAuth)).toBe(false);
    expect(visible.some((s) => s.payload === "track_sample")).toBe(false);
    expect(visible.some((s) => s.action === "request_live_support")).toBe(true);
  });

  it("hides old transcript suggestions that navigate to protected pages", () => {
    const legacy = [
      { label: "My reports", action: "navigate", payload: "/dashboard/reports" },
      { label: "Track", action: "ask_faq", payload: "track_sample" },
      { label: "Tests", action: "navigate", payload: "/tests" },
    ];
    expect(filterSuggestionsForAuth(legacy, false).map((s) => s.label)).toEqual(["Tests"]);
  });
});

describe("live support queue policy", () => {
  it("total wait equals attempts x seconds per attempt", () => {
    expect(LIVE_SUPPORT_TOTAL_SECONDS).toBe(LIVE_SUPPORT_MAX_ATTEMPTS * LIVE_SUPPORT_ATTEMPT_SECONDS);
  });
});
