"use client";

import { Loader2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartDrawerItemProps {
  item: any;
  onRemove: (id: string) => void;
  isRemoving: boolean;
}

export function CartDrawerItem({ item, onRemove, isRemoving }: CartDrawerItemProps) {
  return (
    <div className="group bg-white rounded-xl p-5 border border-slate-100 transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <h4 className="font-semibold text-slate-800 tracking-tight leading-tight">
              {item.itemType === "TEST" ? item.testId?.testName : item.packageId?.name}
              {item.itemType === "PACKAGE" ? " Panel" : ""}
            </h4>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
              {item.itemType === "TEST" ? `${item.parameters?.length || 0} Parameters` : "Comprehensive Package"}
            </p>
          </div>
          <button
            onClick={() => onRemove(item._id)}
            disabled={isRemoving}
            className="text-slate-300 hover:text-brand-primary transition-colors p-1 disabled:opacity-50"
          >
            {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <span suppressHydrationWarning className="text-sm font-bold text-slate-800 tracking-tight">
              ₹{formatCurrency(item.price)}
            </span>
            {item.mrp > item.price && (
              <span suppressHydrationWarning className="text-xs text-slate-300 line-through">
                ₹{formatCurrency(item.mrp)}
              </span>
            )}
          </div>
          {item.mrp > item.price && (
            <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-tight">
              {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% Off
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
