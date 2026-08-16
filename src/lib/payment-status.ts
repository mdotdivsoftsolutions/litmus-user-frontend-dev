export function isPaymentSuccessful(status?: string | null): boolean {
  const value = (status || "").toUpperCase();
  return value === "SUCCESS" || value === "COMPLETED" || value === "PAID";
}

export function paymentStatusLabel(status?: string | null): "Paid" | "Failed" | "Refunded" | "Pending" {
  const value = (status || "").toUpperCase();
  if (isPaymentSuccessful(value)) return "Paid";
  if (value === "FAILED") return "Failed";
  if (value === "REFUNDED") return "Refunded";
  return "Pending";
}

export function formatBookingStatus(status?: string | null): string {
  const value = (status || "PENDING").toUpperCase();
  if (value === "IN_PROGRESS") return "In Progress";
  return value.charAt(0) + value.slice(1).toLowerCase();
}
