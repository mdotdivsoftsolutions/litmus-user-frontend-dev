import { apiClient } from './axios';

export interface CreateOrderResponse {
  orderId: string;
  amount: number;       // in paise
  currency: string;
  keyId: string;        // Razorpay public key — safe to use in frontend
  bookingId: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
}

export const paymentApi = {
  /**
   * Creates a Razorpay order on the backend.
   * The backend reads the amount from the booking in DB — not from the request body.
   * This prevents any client-side price tampering.
   */
  createOrder: async (bookingId: string): Promise<{ success: boolean; data: CreateOrderResponse }> => {
    const response = await apiClient.post('/payment/create-order', { bookingId });
    return response.data;
  },

  /**
   * Verifies the Razorpay payment signature on the backend.
   * HMAC-SHA256 is computed server-side using the Key Secret.
   * On success, booking is marked as PAID + APPROVED in the DB.
   */
  verifyPayment: async (payload: VerifyPaymentPayload): Promise<{ success: boolean; message: string; data: { bookingId: string; paymentId: string } }> => {
    const response = await apiClient.post('/payment/verify', payload);
    return response.data;
  },

  /**
   * Polls payment status for a booking — useful as a fallback
   * when the user returns from redirect-based payments (net banking).
   */
  getPaymentStatus: async (bookingId: string): Promise<{ success: boolean; data: { paymentStatus: string; bookingStatus: string } }> => {
    const response = await apiClient.get(`/payment/status/${bookingId}`);
    return response.data;
  },
};
