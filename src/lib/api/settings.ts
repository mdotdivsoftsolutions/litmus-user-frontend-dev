import { apiClient } from './axios';

export interface ICourierAddress {
  facilityName?: string;
  attention?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
}

/** A Litmus office / sample-intake hub (e.g. Chennai for Tamil Nadu, Kochi for Kerala). */
export interface IRegionalOffice extends Required<ICourierAddress> {
  id: string;
  name: string;
  states: string[];
}

export interface IResolvedRegionalOffice {
  office: IRegionalOffice | null;
  /** State detected from the customer's address (null when unknown). */
  resolvedState: string | null;
  /** True when no office serves that state and the default office is shown. */
  isFallback: boolean;
}

export const settingsApi = {
  getPublicSettings: async () => {
    const response = await apiClient.get('/settings/public');
    return response.data as { 
      success: boolean; 
      data: { 
        pickupCities: string[]; 
        enablePickupSlotSelection: boolean;
        courierAddress?: ICourierAddress;
        regionalOffices?: IRegionalOffice[];
      } 
    };
  },

  /** Office the customer should courier samples to, based on their address. */
  getRegionalOffice: async (params: { state?: string; city?: string; pincode?: string }) => {
    const response = await apiClient.get('/settings/regional-office', { params });
    return response.data as { success: boolean; data: IResolvedRegionalOffice };
  },
};
