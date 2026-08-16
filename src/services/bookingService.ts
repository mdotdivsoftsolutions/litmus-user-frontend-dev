import { bookingApi } from "@/lib/api/booking";

export const bookingService = {
  create: (bookingData: any) => 
    bookingApi.createBooking(bookingData),
  
  getAll: (params?: any) =>
    bookingApi.getMyBookings(params),
  
  getById: (id: string) => 
    bookingApi.getBookingById(id),
};
