"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartDrawerEmptyProps {
  onClose: () => void;
}

export function CartDrawerEmpty({ onClose }: CartDrawerEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center space-y-4">
      <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center opacity-50">
        <ShoppingCart className="h-8 w-8 text-slate-300" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-800">Your cart is empty</p>
        <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
          Discover our premium testing packages to start your food safety journey.
        </p>
      </div>
      <Button
        onClick={onClose}
        asChild
        className="h-10 px-6 bg-brand-action hover:bg-brand-action-hover text-white font-semibold text-xs rounded-lg"
      >
        <Link href="/packages">Browse Packages</Link>
      </Button>
    </div>
  );
}
