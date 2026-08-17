import { apiClient } from './axios';

export const settingsApi = {
  getPublicSettings: async () => {
    const response = await apiClient.get('/settings/public');
    return response.data as { success: boolean; data: { pickupCities: string[]; enablePickupSlotSelection: boolean } };
  },
};
