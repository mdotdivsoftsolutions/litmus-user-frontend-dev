"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ShoppingCart, Check, Loader2, MessageCircle, Shield, Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";

interface TestBookingSidebarProps {
  testObj: any;
  price: number;
  originalPrice: number;
  discountAmount: number;
  selectedParamsCount: number;
  totalParamsCount: number;
  isInCart: boolean;
  isAddingToCart: boolean;
  onAddToCart: () => void;
  onBookNow: () => void;
}

export function TestBookingSidebar({
  testObj,
  price,
  originalPrice,
  discountAmount,
  selectedParamsCount,
  totalParamsCount,
  isInCart,
  isAddingToCart,
  onAddToCart,
  onBookNow,
}: TestBookingSidebarProps) {
  return (
    <div className="lg:col-span-2">
      <div className="lg:sticky lg:top-28">
        <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <h3 className="font-heading font-bold text-lg text-foreground leading-[1.3]">{testObj.testName}</h3>

            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span suppressHydrationWarning className="font-data text-3xl sm:text-4xl font-bold text-brand-action leading-[1.4]">
                  ₹{formatCurrency(price)}
                </span>
                {originalPrice > price && (
                  <span suppressHydrationWarning className="font-data text-sm text-muted-foreground line-through font-normal">
                    ₹{formatCurrency(originalPrice)}
                  </span>
                )}
              </div>
              {discountAmount > 0 && (
                <div className="font-data-badge text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md self-start border border-emerald-100">
                  {testObj.discountType === "PERCENTAGE" ? `${testObj.discountValue}% OFF` : `₹${testObj.discountValue} OFF`} applied
                </div>
              )}
            </div>

            <p className="font-body text-sm text-muted-foreground font-medium leading-[1.5]">
              {selectedParamsCount} of {totalParamsCount || 1} parameters selected
            </p>

            <div className="flex items-center gap-2 text-sm text-brand-action bg-brand-action/10 p-3 rounded-lg font-medium">
              <Clock className="h-5 w-5 text-brand-action" />
              <span className="font-body">Reports in {testObj.turnAroundTime || "3-5 working days"}</span>
            </div>

            <div className="flex gap-2">
              <Badge className="font-data-badge bg-brand-action text-white border-0 text-xs">NABL</Badge>
              <Badge className="font-data-badge bg-brand-action text-white border-0 text-xs">FSSAI</Badge>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={onAddToCart}
                disabled={isInCart || isAddingToCart}
                className="w-full bg-brand-action hover:bg-brand-action-hover font-body font-semibold text-base text-white rounded-xl gap-2 h-12 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? <Loader2 className="h-5 w-5 animate-spin" /> : isInCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                {isInCart ? "In Cart" : "Add to Cart"}
              </Button>

              <Button
                onClick={onBookNow}
                variant="outline"
                className="w-full bg-white hover:bg-brand-action/10 text-slate-800 border-2 border-brand-action font-body font-semibold text-base h-12 rounded-xl shadow-sm transition-all"
              >
                Book Now
              </Button>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-medium text-litmus-teal hover:underline pt-2"
            >
              <MessageCircle className="h-4 w-4" /> Need help? Chat on WhatsApp
            </a>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-5 border-t border-border">
              {[
                { icon: Shield, label: "100% Accurate" },
                { icon: Shield, label: "NABL Certified" },
                { icon: Lock, label: "Secure Payment" },
                { icon: MessageCircle, label: "WhatsApp Reports" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <b.icon className="h-4 w-4 text-brand-primary" />
                  {b.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
