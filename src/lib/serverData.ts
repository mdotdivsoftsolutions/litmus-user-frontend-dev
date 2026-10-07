import { cache } from "react";
import { testApi } from "@/lib/api/test";
import { packageApi } from "@/lib/api/package";

/**
 * Server-side data for public catalogue pages (SEO metadata + first paint).
 * Every call is capped so a slow API never blocks the page: on timeout or error the
 * page renders without initial data and the client fetches it as before.
 */
export const withTimeout = <T,>(promise: Promise<T>, ms = 2500): Promise<T | null> => {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]).catch(() => null);
};

const isObjectId = (id: string) => /^[a-f0-9]{24}$/i.test(id);

// cache(): generateMetadata and the page component share one request per render.
export const getTestForPage = cache(async (id: string) => {
  if (!isObjectId(id)) return null;
  const res = await withTimeout(testApi.getTestById(id));
  return res?.data ?? null;
});

export const getPackageForPage = cache(async (id: string) => {
  if (!isObjectId(id)) return null;
  const res = await withTimeout(packageApi.getPackage(id));
  return res?.data ?? null;
});

/** Plain-text summary for meta descriptions (max ~160 chars). */
export const toMetaDescription = (text: unknown, fallback: string) => {
  const clean = typeof text === "string" ? text.replace(/\s+/g, " ").trim() : "";
  if (!clean) return fallback;
  return clean.length > 160 ? `${clean.slice(0, 157).trimEnd()}...` : clean;
};
