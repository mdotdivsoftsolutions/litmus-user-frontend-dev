export function isPaymentSuccessful(status?: string | null): boolean {
  const value = (status || "").toUpperCase();
  return value === "SUCCESS" || value === "COMPLETED" || value === "PAID";
}

export function isOrderPaymentSettled(paymentStatus?: string | null, bookingStatus?: string | null): boolean {
  if (isPaymentSuccessful(paymentStatus)) return true;
  const payment = (paymentStatus || "").toUpperCase();
  if (payment === "FAILED" || payment === "REFUNDED") return false;
  const booking = (bookingStatus || "").toUpperCase();
  return booking === "APPROVED" || booking === "IN_PROGRESS" || booking === "COMPLETED";
}

/** Booked=0, Payment=1, Approved=2, Lab Testing=3, Report Ready=4 */
export function getOrderTimelineStep(status?: string | null, paymentStatus?: string | null): number {
  const booking = (status || "").toUpperCase();
  if (booking === "REJECTED" || booking === "CANCELLED") return -1;
  if (booking === "COMPLETED") return 4;
  if (booking === "IN_PROGRESS") return 3;
  if (booking === "APPROVED") return 2;
  if (isPaymentSuccessful(paymentStatus)) return 1;
  return 0;
}

export function paymentStatusLabel(
  status?: string | null,
  bookingStatus?: string | null
): "Paid" | "Failed" | "Refunded" | "Pending" {
  const value = (status || "").toUpperCase();
  if (value === "FAILED") return "Failed";
  if (value === "REFUNDED") return "Refunded";
  if (isOrderPaymentSettled(status, bookingStatus)) return "Paid";
  return "Pending";
}

export function formatBookingStatus(status?: string | null): string {
  const value = (status || "PENDING").toUpperCase();
  if (value === "IN_PROGRESS") return "In Progress";
  return value.charAt(0) + value.slice(1).toLowerCase();
}
