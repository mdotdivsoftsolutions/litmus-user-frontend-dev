import { apiClient } from './axios';

export const bookingApi = {
  createBooking: async (data: { labId: string; items: any[]; bookingDate: Date; totalAmount: number }) => {
    const response = await apiClient.post('/booking', data);
    return response.data;
  },
  
  getMyBookings: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    reportsOnly?: boolean;
  }) => {
    const response = await apiClient.get("/booking/my", { params });
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await apiClient.get(`/booking/${id}`);
    return response.data;
  },

  updateCourierTracking: async (
    id: string,
    data: { trackingId: string; courierName?: string; notes?: string }
  ) => {
    const response = await apiClient.patch(`/booking/${id}/courier-tracking`, data);
    return response.data;
  },

  downloadReport: async (id: string) => {
    const response = await apiClient.get(`/booking/${id}/report`, { responseType: "blob" });
    return response.data as Blob;
  },
};
