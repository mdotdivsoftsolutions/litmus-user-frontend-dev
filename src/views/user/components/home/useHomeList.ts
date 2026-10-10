"use client";

import { useQuery } from "@tanstack/react-query";

/** Accepts the API envelope ({ data: [...] }), a bare array, or a paginated { data: { data: [...] } }. */
export function toList<T = unknown>(res: unknown): T[] {
  const r = res as { data?: unknown } | null | undefined;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(res)) return res as T[];
  const nested = (r?.data as { data?: unknown } | undefined)?.data;
  return Array.isArray(nested) ? (nested as T[]) : [];
}

/**
 * Home page sections get their first data from the server render, which gives up after a few
 * seconds when the API is slow (and the cached page can then stay empty for everyone). If the
 * server sent nothing, load the list in the browser instead of showing an empty section.
 */
export function useHomeList<T>(key: string, fetcher: () => Promise<unknown>, initial: unknown) {
  const serverItems = toList<T>(initial);

  const query = useQuery({
    queryKey: ["home", key],
    queryFn: async () => toList<T>(await fetcher()),
    initialData: serverItems.length > 0 ? serverItems : undefined,
    staleTime: 60 * 1000,
    retry: 2,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError && !query.data?.length,
    retry: () => query.refetch(),
  };
}
