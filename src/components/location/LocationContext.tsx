"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "litmus_user_location";
const ASKED_KEY = "litmus_location_asked";

export const FALLBACK_CITIES = ["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

export type LocationPermission = "prompt" | "granted" | "denied" | "unavailable";
export type LocationSource = "gps" | "manual" | null;

type StoredLocation = {
  city: string;
  source: LocationSource;
};

type LocationContextValue = {
  city: string;
  setCity: (city: string) => void;
  permission: LocationPermission;
  isDetecting: boolean;
  source: LocationSource;
  detectLocation: () => Promise<boolean>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

function readStored(): StoredLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredLocation;
    if (parsed?.city) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function persist(data: StoredLocation) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.city || data.locality || data.principalSubdivision || null;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState("");
  const [source, setSource] = useState<LocationSource>(null);
  const [permission, setPermission] = useState<LocationPermission>("prompt");
  const [isDetecting, setIsDetecting] = useState(false);

  const setCity = useCallback((next: string) => {
    setCityState(next);
    setSource("manual");
    persist({ city: next, source: "manual" });
  }, []);

  const detectLocation = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setPermission("unavailable");
      return false;
    }

    setIsDetecting(true);
    localStorage.setItem(ASKED_KEY, "1");

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            setPermission("granted");
            const detected = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
            if (detected) {
              setCityState(detected);
              setSource("gps");
              persist({ city: detected, source: "gps" });
              resolve(true);
            } else {
              resolve(false);
            }
          } catch {
            resolve(false);
          } finally {
            setIsDetecting(false);
          }
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) setPermission("denied");
          setIsDetecting(false);
          resolve(false);
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
      );
    });
  }, []);

  useEffect(() => {
    const stored = readStored();
    if (stored?.city) {
      setCityState(stored.city);
      setSource(stored.source);
    }

    if (!navigator.geolocation) {
      setPermission("unavailable");
      return;
    }

    let cancelled = false;

    const maybeAutoDetect = (state: LocationPermission, hasCity: boolean, storedSource: LocationSource) => {
      if (cancelled) return;
      const alreadyAsked = localStorage.getItem(ASKED_KEY) === "1";
      if (state === "granted" && storedSource !== "manual") {
        detectLocation();
      } else if (state === "prompt" && !alreadyAsked && !hasCity) {
        detectLocation();
      }
    };

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((status) => {
          if (cancelled) return;
          setPermission(status.state as LocationPermission);
          maybeAutoDetect(status.state as LocationPermission, Boolean(stored?.city), stored?.source || null);
          status.onchange = () => {
            setPermission(status.state as LocationPermission);
            if (status.state === "granted") detectLocation();
          };
        })
        .catch(() => {
          maybeAutoDetect("prompt", Boolean(stored?.city), stored?.source || null);
        });
    } else {
      maybeAutoDetect("prompt", Boolean(stored?.city), stored?.source || null);
    }

    return () => {
      cancelled = true;
    };
  }, [detectLocation]);

  const value = useMemo(
    () => ({ city, setCity, permission, isDetecting, source, detectLocation }),
    [city, setCity, permission, isDetecting, source, detectLocation]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useUserLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useUserLocation must be used within LocationProvider");
  }
  return ctx;
}
