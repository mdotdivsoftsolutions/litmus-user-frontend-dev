"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartDrawerFooterProps {
  subtotal: number;
  gst: number;
  total: number;
  onClose: () => void;
  onCheckout: (e: React.MouseEvent) => void;
}

export function CartDrawerFooter({ subtotal, gst, total, onClose, onCheckout }: CartDrawerFooterProps) {
  return (
    <div className="p-6 bg-white border-t border-slate-100 space-y-5 shrink-0">
      <div className="space-y-2 text-sm font-medium">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs uppercase tracking-widest font-semibold">Subtotal</span>
          <span suppressHydrationWarning className="font-semibold text-slate-600">
            ₹{formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs uppercase tracking-widest font-semibold">GST (18%)</span>
          <span suppressHydrationWarning className="font-semibold text-slate-600">
            ₹{formatCurrency(gst)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 text-base font-semibold text-slate-800 border-t border-slate-50 mt-2">
          <span>To Pay</span>
          <span suppressHydrationWarning className="text-brand-primary">
            ₹{formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          asChild
          onClick={onClose}
          variant="outline"
          className="flex-1 h-11 border-slate-200 text-slate-500 hover:text-slate-800 font-semibold uppercase text-[10px] tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <Link href="/">Explore</Link>
        </Button>
        <Button
          asChild
          onClick={onCheckout}
          className="flex-[2] h-11 bg-brand-action hover:bg-brand-action-hover text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Link href="/bookings/new">
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
