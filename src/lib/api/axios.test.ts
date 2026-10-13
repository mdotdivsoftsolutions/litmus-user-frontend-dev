import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios, { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/api/axios";
import { cartApi } from "@/lib/api/cart";

/** Fake server: `handler` decides each response from the request config. */
const useServer = (handler: (config: InternalAxiosRequestConfig) => { status: number; data?: unknown }) => {
  const calls: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    calls.push(config);
    const { status, data = {} } = handler(config);
    const response = { data, status, statusText: String(status), headers: {}, config };
    if (status >= 400) throw new AxiosError(`HTTP ${status}`, String(status), config, null, response);
    return response;
  };
  apiClient.defaults.adapter = adapter;
  return calls;
};

describe("apiClient", () => {
  it("sends cookies with every request (httpOnly session, no tokens in JS)", () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
  });
});

describe("apiClient 401 refresh flow", () => {
  let refresh: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    refresh = vi.spyOn(axios, "post");
  });
  afterEach(() => refresh.mockRestore());

  it("refreshes the session once and retries the failed request", async () => {
    refresh.mockResolvedValue({ data: {} });
    let authed = false;
    const calls = useServer(() => (authed ? { status: 200, data: { ok: true } } : { status: 401 }));
    refresh.mockImplementation(async () => {
      authed = true;
      return { data: {} };
    });

    const res = await apiClient.get("/bookings");
    expect(res.data).toEqual({ ok: true });
    expect(refresh).toHaveBeenCalledOnce();
    expect(String(refresh.mock.calls[0][0])).toMatch(/\/auth\/refresh-token$/);
    expect(calls).toHaveLength(2);
  });

  it("queues parallel 401s behind a single refresh call", async () => {
    let authed = false;
    useServer(() => (authed ? { status: 200, data: "ok" } : { status: 401 }));
    refresh.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 10));
      authed = true;
      return { data: {} };
    });

    const results = await Promise.all([apiClient.get("/a"), apiClient.get("/b"), apiClient.get("/c")]);
    expect(results.map((r) => r.data)).toEqual(["ok", "ok", "ok"]);
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("rejects every queued request when the refresh fails (user is signed out)", async () => {
    useServer(() => ({ status: 401 }));
    const refreshError = new Error("refresh expired");
    refresh.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 10));
      throw refreshError;
    });

    const results = await Promise.allSettled([apiClient.get("/a"), apiClient.get("/b")]);
    expect(results.every((r) => r.status === "rejected")).toBe(true);
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("does not try to refresh after a failed login", async () => {
    useServer(() => ({ status: 401 }));
    await expect(apiClient.post("/auth/login", {})).rejects.toMatchObject({ response: { status: 401 } });
    expect(refresh).not.toHaveBeenCalled();
  });

  it("retries a request only once (no refresh loop)", async () => {
    const calls = useServer(() => ({ status: 401 }));
    refresh.mockResolvedValue({ data: {} });
    await expect(apiClient.get("/bookings")).rejects.toMatchObject({ response: { status: 401 } });
    expect(refresh).toHaveBeenCalledOnce();
    expect(calls).toHaveLength(2);
  });

  it("passes other errors straight through", async () => {
    useServer(() => ({ status: 500 }));
    await expect(apiClient.get("/bookings")).rejects.toMatchObject({ response: { status: 500 } });
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe("guest cart session header", () => {
  beforeEach(() => localStorage.clear());

  it("creates one session id, stores it and sends it on cart requests", async () => {
    const calls = useServer(() => ({ status: 200, data: { data: { items: [] } } }));
    await cartApi.getCart();
    await cartApi.getCart();

    const sid = localStorage.getItem("litmus_session_id");
    expect(sid).toBeTruthy();
    expect(calls.map((c) => c.headers["x-session-id"])).toEqual([sid, sid]);
  });

  it("does not attach the session id to non-cart requests", async () => {
    const calls = useServer(() => ({ status: 200 }));
    await apiClient.get("/tests");
    expect(calls[0].headers["x-session-id"]).toBeUndefined();
  });
});
