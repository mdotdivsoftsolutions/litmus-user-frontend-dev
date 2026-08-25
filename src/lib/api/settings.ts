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

export const settingsApi = {
  getPublicSettings: async () => {
    const response = await apiClient.get('/settings/public');
    return response.data as { 
      success: boolean; 
      data: { 
        pickupCities: string[]; 
        enablePickupSlotSelection: boolean;
        courierAddress?: ICourierAddress;
      } 
    };
  },
};
