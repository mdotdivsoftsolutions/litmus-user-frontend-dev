import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { detectLocationByIp, reverseGeocode, searchLocationSuggestions, detectUserLocation } from "@/lib/location";

const json = (data: unknown, ok = true) => Promise.resolve({ ok, json: () => Promise.resolve(data) } as Response);
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("reverseGeocode", () => {
  it("uses BigDataCloud when it knows the city", async () => {
    fetchMock.mockReturnValueOnce(json({ city: "Chennai" }));
    expect(await reverseGeocode(13.08, 80.27)).toBe("Chennai");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("falls back to Nominatim when the first provider fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline")).mockReturnValueOnce(json({ address: { town: "Kanchipuram" } }));
    expect(await reverseGeocode(12.8, 79.7)).toBe("Kanchipuram");
  });

  it("returns null when no provider answers", async () => {
    fetchMock.mockReturnValue(json({}, false));
    expect(await reverseGeocode(0, 0)).toBeNull();
  });
});

describe("detectLocationByIp", () => {
  it("tries providers in order until one returns a city", async () => {
    fetchMock
      .mockReturnValueOnce(json({ success: false }))
      .mockRejectedValueOnce(new Error("blocked"))
      .mockReturnValueOnce(json({ city: "Coimbatore" }));
    expect(await detectLocationByIp()).toBe("Coimbatore");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("returns null when all providers fail", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    expect(await detectLocationByIp()).toBeNull();
  });
});

describe("searchLocationSuggestions", () => {
  it("skips the network for queries shorter than 2 characters", async () => {
    expect(await searchLocationSuggestions(" c ")).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("URL-encodes the query and de-duplicates city/state pairs", async () => {
    fetchMock.mockReturnValueOnce(
      json({
        features: [
          { properties: { name: "Chennai", state: "Tamil Nadu", country: "India" } },
          { properties: { city: "Chennai", state: "Tamil Nadu", country: "India" } },
          { properties: { name: "Chennai", state: "Other", country: "India" } },
          { properties: {} },
        ],
      })
    );
    const res = await searchLocationSuggestions("chen&nai");
    expect(String(fetchMock.mock.calls[0][0])).toContain("q=chen%26nai");
    expect(res.map((r) => r.label)).toEqual(["Chennai, Tamil Nadu, India", "Chennai, Other, India"]);
  });

  it("returns an empty list on errors and aborted requests", async () => {
    fetchMock.mockRejectedValueOnce(Object.assign(new Error("aborted"), { name: "AbortError" }));
    expect(await searchLocationSuggestions("chennai")).toEqual([]);
    fetchMock.mockReturnValueOnce(json({}, false));
    expect(await searchLocationSuggestions("chennai")).toEqual([]);
  });
});

describe("detectUserLocation", () => {
  const original = navigator.geolocation;
  afterEach(() => Object.defineProperty(navigator, "geolocation", { configurable: true, value: original }));

  const setGeo = (impl: Geolocation["getCurrentPosition"]) =>
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition: impl } });

  it("uses GPS + reverse geocoding when permission is granted", async () => {
    setGeo((ok) => ok({ coords: { latitude: 13, longitude: 80 } } as GeolocationPosition));
    fetchMock.mockReturnValueOnce(json({ city: "Chennai" }));
    expect(await detectUserLocation()).toEqual({ success: true, city: "Chennai", source: "gps", permission: "granted" });
  });

  it("falls back to IP lookup when GPS is denied", async () => {
    setGeo((_ok, fail) => fail?.({ code: 1 } as GeolocationPositionError));
    fetchMock.mockReturnValueOnce(json({ success: true, city: "Madurai" }));
    expect(await detectUserLocation()).toEqual({ success: true, city: "Madurai", source: "ip" });
  });

  it("reports failure when nothing works", async () => {
    setGeo((_ok, fail) => fail?.({ code: 1 } as GeolocationPositionError));
    fetchMock.mockRejectedValue(new Error("offline"));
    expect(await detectUserLocation()).toMatchObject({ success: false });
  });
});
