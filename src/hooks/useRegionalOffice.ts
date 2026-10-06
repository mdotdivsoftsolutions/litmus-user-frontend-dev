"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { settingsApi } from "@/lib/api/settings";

export interface CustomerAddressInput {
  state?: string;
  city?: string;
  pincode?: string;
}

const SEP = "\u0000";
const clean = (value?: string) => (value || "").trim();

/**
 * Resolves the Litmus office (Chennai, Kochi, ...) for the customer's address.
 * Debounced (on a primitive key, so re-renders don't restart it) while the customer types.
 */
export function useRegionalOffice(address?: CustomerAddressInput, enabled = true) {
  const rawKey = [clean(address?.state), clean(address?.city), clean(address?.pincode)].join(SEP);
  const key = useDebounce(rawKey, 400);
  const [state, city, pincode] = key.split(SEP);

  return useQuery({
    queryKey: ["regionalOffice", state.toLowerCase(), city.toLowerCase(), pincode],
    queryFn: async () => (await settingsApi.getRegionalOffice({ state, city, pincode })).data,
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
