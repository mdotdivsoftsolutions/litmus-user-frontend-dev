"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { paymentApi } from "@/lib/api/payment";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { formatCurrency } from "@/lib/utils";

interface OrderPayNowProps {
  bookingId: string;
  totalAmount?: number;
  customer?: { firstName?: string; lastName?: string; email?: string; phone?: string };
}

/**
 * Pay an existing unpaid order (e.g. an order Litmus support booked on the customer's behalf).
 * The amount is always taken from the booking on the server.
 */
export function OrderPayNow({ bookingId, totalAmount, customer }: OrderPayNowProps) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["myBookings"] });
  };

  const pay = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const orderRes = await paymentApi.createOrder(bookingId);
      if (!orderRes.success) throw new Error("Failed to create payment order");
      const order = orderRes.data;
      await openRazorpayCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        bookingId,
        prefill: {
          name: `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim(),
          email: customer?.email || "",
          contact: customer?.phone || "",
        },
        onSuccess: async (payment) => {
          try {
            const res = await paymentApi.verifyPayment({ ...payment, bookingId });
            if (!res.success) throw new Error("verification failed");
            toast.success("Payment successful. Thank you!");
          } catch {
            toast.error(`Payment received but verification failed. Please contact support with order ${bookingId}.`);
          } finally {
            refresh();
            setBusy(false);
          }
        },
        onFailure: ({ description }) => {
          toast.error(description || "Payment failed. Please try again.");
          setBusy(false);
        },
        onDismiss: () => setBusy(false),
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not start payment. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-amber-900">Payment pending</p>
        <p className="text-xs text-amber-800">Complete the payment of ₹{formatCurrency(totalAmount)} to confirm this order.</p>
      </div>
      <Button onClick={pay} disabled={busy} className="bg-brand-action hover:bg-brand-action-hover text-white gap-2 h-10 px-5">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        Pay Now ₹{formatCurrency(totalAmount)}
      </Button>
    </div>
  );
}
