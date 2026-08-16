"use client";

import { FlaskConical, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PackageTestsIncludedProps {
  pkg: any;
}

export function PackageTestsIncluded({ pkg }: PackageTestsIncludedProps) {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-slate-900 tracking-tight leading-[1.3] flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-brand-action" /> What&apos;s Included inside the Panel?
        </h3>
        <p className="font-body text-slate-500 text-sm mt-1 font-medium leading-[1.5]">
          Critical testing parameters and analytes analyzed in this package
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {pkg.tests && pkg.tests.length > 0 ? (
          pkg.tests.map((test: any, i: number) => (
            <div
              key={test._id || i}
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-white hover:border-brand-action/30 border border-slate-100 transition-all duration-300 group"
            >
              <CheckCircle2 className="h-5 w-5 text-brand-action shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-heading text-sm text-slate-800 font-bold block">{test.testName}</span>
                <div className="mt-1">
                  {test.offerPrice && test.price > test.offerPrice ? (
                    <span suppressHydrationWarning className="font-data text-xs text-slate-400 font-normal line-through mr-2">
                      ₹{formatCurrency(test.price)}
                    </span>
                  ) : null}
                  <span suppressHydrationWarning className="font-data text-xs text-brand-action font-bold">
                    ₹{formatCurrency(test.offerPrice || test.price || 0)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          pkg.features?.map((feature: string, i: number) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-white hover:border-brand-action/30 border border-slate-100 transition-all duration-300 group"
            >
              <CheckCircle2 className="h-5 w-5 text-brand-action shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-heading text-sm text-slate-800 font-bold block">{feature}</span>
                <span className="font-body text-xs text-slate-400 font-normal">Standard analytical testing method</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
