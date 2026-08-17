export type LocationPermission = "prompt" | "granted" | "denied" | "unavailable";
export type LocationSource = "gps" | "ip" | "manual" | null;

export type LocationSuggestion = {
  name: string;
  state?: string;
  country?: string;
  label: string;
};

export type DetectedLocationResult = {
  success: boolean;
  city?: string;
  source?: LocationSource;
  permission?: LocationPermission;
  error?: string;
};

/**
 * Reverse geocodes latitude and longitude into a city/locality name.
 * Uses BigDataCloud with OpenStreetMap Nominatim fallback.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  // 1. BigDataCloud reverse geocode
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision;
      if (city) return city;
    }
  } catch {
    /* fallback to next provider */
  }

  // 2. OpenStreetMap Nominatim fallback
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.state_district || addr.county || addr.state;
      if (city) return city;
    }
  } catch {
    /* ignore */
  }

  return null;
}

/**
 * Detects user city via Network/IP Geolocation.
 * Useful when device GPS is disabled, unavailable on desktop, or blocked by browser permissions.
 */
export async function detectLocationByIp(): Promise<string | null> {
  // 1. ipwho.is (fast, CORS enabled, no API key needed)
  try {
    const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.city) {
        return data.city;
      }
    }
  } catch {
    /* try next */
  }

  // 2. freeipapi.com
  try {
    const res = await fetch("https://freeipapi.com/api/json", { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const city = data.cityName || data.regionName;
      if (city) return city;
    }
  } catch {
    /* try next */
  }

  // 3. ipapi.co
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.region;
      if (city) return city;
    }
  } catch {
    /* ignore */
  }

  return null;
}

/**
 * Searches for cities, towns, or localities using the Photon Geocoding API (OpenStreetMap-based).
 */
export async function searchLocationSuggestions(
  query: string,
  signal?: AbortSignal,
  limit = 7
): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=${limit}`,
      { signal }
    );
    if (!res.ok) return [];

    const data = await res.json();
    const items: LocationSuggestion[] = [];
    const seen = new Set<string>();

    for (const f of data.features || []) {
      const p = f.properties || {};
      const cityName = p.city || p.name || p.district;
      if (!cityName) continue;

      const key = `${cityName}-${p.state || ""}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      const parts = [cityName, p.state, p.country].filter(Boolean);
      items.push({
        name: cityName,
        state: p.state,
        country: p.country,
        label: parts.join(", "),
      });
    }

    return items;
  } catch (err: unknown) {
    if ((err as Error)?.name !== "AbortError") {
      // ignore network errors
    }
    return [];
  }
}

/**
 * Full auto-detection pipeline:
 * 1. Tries Browser GPS (High accuracy coordinates + Reverse geocoding)
 * 2. Falls back to Network/IP Geolocation if GPS is blocked/unavailable.
 */
export async function detectUserLocation(): Promise<DetectedLocationResult> {
  // Step 1: Attempt Browser GPS
  if (typeof window !== "undefined" && navigator?.geolocation) {
    try {
      const gpsResult = await new Promise<{ city: string; lat: number; lng: number } | null>(
        (resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const detected = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                if (detected) {
                  resolve({
                    city: detected,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  });
                  return;
                }
              } catch {
                /* fallback */
              }
              resolve(null);
            },
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
          );
        }
      );

      if (gpsResult?.city) {
        return {
          success: true,
          city: gpsResult.city,
          source: "gps",
          permission: "granted",
        };
      }
    } catch {
      /* continue to IP fallback */
    }
  }

  // Step 2: Attempt Network / IP Geolocation Fallback
  try {
    const ipCity = await detectLocationByIp();
    if (ipCity) {
      return {
        success: true,
        city: ipCity,
        source: "ip",
      };
    }
  } catch {
    /* ignore */
  }

  return {
    success: false,
    error: "Could not detect location automatically",
  };
}
