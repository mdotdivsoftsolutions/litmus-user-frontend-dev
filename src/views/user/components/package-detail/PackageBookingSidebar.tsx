"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Shield, Lock, ShoppingCart, ArrowRight, MessageCircle, Award, Loader2, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";

interface PackageBookingSidebarProps {
  pkg: any;
  isInCart: boolean;
  isAddingToCart: boolean;
  onAddToCart: () => void;
  onBookNow: () => void;
}

export function PackageBookingSidebar({
  pkg,
  isInCart,
  isAddingToCart,
  onAddToCart,
  onBookNow,
}: PackageBookingSidebarProps) {
  const discountPct = (price: number, mrp: number) => {
    if (!mrp || !price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  return (
    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
      <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="font-heading font-bold text-xl text-slate-900 tracking-tight leading-[1.3]">{pkg.name}</h3>
            <p className="font-data-badge text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
              {pkg.category} Panel
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100/50">
            <div className="flex items-baseline justify-between">
              <span className="font-data text-xs text-slate-400 font-medium uppercase tracking-wider">Original Price</span>
              <span suppressHydrationWarning className="font-data text-sm text-slate-400 line-through font-normal">
                ₹{formatCurrency(pkg.mrp)}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-body text-xs text-slate-700 font-semibold">Litmus Price</span>
              <div className="flex items-center gap-2">
                <span suppressHydrationWarning className="font-data text-3xl font-bold text-slate-900 tracking-tight leading-[1.4]">
                  ₹{formatCurrency(pkg.price)}
                </span>
                <span className="font-data-badge bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-200/50">
                  {discountPct(pkg.price, pkg.mrp)}% Off
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <Clock className="h-4 w-4 text-brand-action" />
              <span className="font-body">Reports guaranteed in {pkg.tat}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <Shield className="h-4 w-4 text-brand-action" />
              <span className="font-body">100% NABL Accredited Laboratory</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <Lock className="h-4 w-4 text-slate-500" />
              <span className="font-body">Secure Cold Chain Sample Logistics</span>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              onClick={onAddToCart}
              disabled={isInCart || isAddingToCart}
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-brand-action text-brand-action hover:bg-brand-action/10 font-body font-semibold text-base transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? <Loader2 className="h-5 w-5 animate-spin" /> : isInCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
              {isInCart ? "In Cart" : "Add to Cart"}
            </Button>

            <Button
              onClick={onBookNow}
              className="w-full h-12 rounded-xl bg-brand-action hover:bg-brand-action-hover shadow-md hover:shadow-lg text-white font-body font-semibold text-base transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              Book Panel Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500 fill-emerald-500" /> WhatsApp Support
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center">
              <Award className="h-5 w-5 text-[#D32F2F] mb-1" />
              <span className="text-[10px] text-slate-700 font-bold">FSSAI Approved</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center">
              <Shield className="h-5 w-5 text-emerald-600 mb-1" />
              <span className="text-[10px] text-slate-700 font-bold">ISO Certified</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
