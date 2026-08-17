"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  LocationPermission,
  LocationSource,
  detectUserLocation,
} from "@/lib/location";

export type { LocationPermission, LocationSource };

const STORAGE_KEY = "litmus_user_location";
const ASKED_KEY = "litmus_location_asked";

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
    setIsDetecting(true);
    localStorage.setItem(ASKED_KEY, "1");

    try {
      const result = await detectUserLocation();
      if (result.success && result.city) {
        setCityState(result.city);
        const resolvedSource = result.source || "gps";
        setSource(resolvedSource);
        persist({ city: result.city, source: resolvedSource });
        if (result.permission) setPermission(result.permission);
        return true;
      }
    } catch {
      /* ignore */
    } finally {
      setIsDetecting(false);
    }

    return false;
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
