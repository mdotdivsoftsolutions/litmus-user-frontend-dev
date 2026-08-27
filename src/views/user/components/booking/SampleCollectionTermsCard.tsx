"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  FileText, 
  ShieldCheck, 
  PackageCheck, 
  Truck, 
  AlertTriangle,
  CheckCircle2,
  Scale,
  ThermometerSnowflake,
  ClipboardList,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SampleCollectionTermsCardProps {
  accepted: boolean;
  onToggle: (accepted: boolean) => void;
  collectionMethod?: string;
}

const TERMS_CONDITIONS_LIST = [
  {
    num: 1,
    title: "Correct Sample Quantity",
    description: "The sample quantity provided must be as per the testing requirements selected. Insufficient quantity may result in testing being delayed or not being conducted.",
    icon: Scale,
    color: "text-brand-action",
  },
  {
    num: 2,
    title: "Sample Packaging & Integrity",
    description: "The sample must be properly packed, sealed and in intact condition at the time of handover.",
    icon: PackageCheck,
    color: "text-emerald-600",
  },
  {
    num: 3,
    title: "Temperature-Sensitive Samples",
    description: "Frozen, chilled or other temperature-sensitive samples must be appropriately packed and maintained at the required temperature until handover.",
    icon: ThermometerSnowflake,
    color: "text-sky-600",
  },
  {
    num: 4,
    title: "Product Information",
    description: "The customer must provide accurate details regarding the product, batch/lot number, manufacturing date, expiry/best-before date and any other information requested.",
    icon: FileText,
    color: "text-indigo-600",
  },
  {
    num: 5,
    title: "Sample Condition During Transit",
    description: "Once the sample has been handed over to the courier/logistics partner, any damage, leakage, spoilage or deterioration occurring during transit will not be the responsibility of Litmus Food Analytics.",
    icon: Truck,
    color: "text-amber-600",
  },
  {
    num: 6,
    title: "Sample Rejection",
    description: "Samples that are damaged, leaking, improperly packed, contaminated, spoiled or otherwise unsuitable for the requested testing may be rejected or require resubmission.",
    icon: AlertTriangle,
    color: "text-rose-600",
  },
  {
    num: 7,
    title: "Testing & Reporting",
    description: "Testing will be carried out based on the sample received and the parameters selected at the time of booking. Changes or additional tests may involve additional charges.",
    icon: ClipboardList,
    color: "text-teal-600",
  },
  {
    num: 8,
    title: "Customer Declaration",
    description: "By proceeding with sample collection, the customer confirms that the information provided is accurate and agrees to the above sample handling and collection conditions.",
    icon: UserCheck,
    color: "text-purple-600",
  },
];

export function SampleCollectionTermsCard({
  accepted,
  onToggle,
}: SampleCollectionTermsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent Lenis background scroll while modal is active
  useEffect(() => {
    if (isModalOpen) {
      (window as any).__lenis?.stop();
    } else {
      (window as any).__lenis?.start();
    }
    return () => {
      (window as any).__lenis?.start();
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="flex items-start gap-3 py-2 px-1 rounded-xl bg-slate-50/60 border border-slate-200/80 p-3">
        <Checkbox
          id="terms-collection-checkbox"
          checked={accepted}
          onCheckedChange={(checked) => onToggle(!!checked)}
          className="mt-0.5 h-4 w-4 rounded data-[state=checked]:bg-brand-action data-[state=checked]:border-brand-action shrink-0"
        />
        <div className="text-xs text-slate-700 leading-normal">
          <label htmlFor="terms-collection-checkbox" className="cursor-pointer select-none">
            I confirm that the sample is packed appropriately, the quantity and product information provided are correct, and I agree to the{" "}
          </label>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="font-bold text-brand-action hover:underline inline-flex items-center gap-0.5 align-baseline"
          >
            Sample Collection – Terms &amp; Conditions
          </button>
          <span className="text-rose-500 font-bold ml-1">*</span>
        </div>
      </div>

      {/* Full Terms & Conditions Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          data-lenis-prevent="true"
          className="max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-7 overflow-hidden"
        >
          <DialogHeader className="pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2 text-brand-action mb-1">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Litmus Protocol</span>
            </div>
            <DialogTitle className="text-xl font-black text-slate-900">
              Sample Collection – Terms &amp; Conditions
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Please review the mandatory protocols governing sample preparation, logistics, laboratory verification, and report release.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Terms Clauses List with Lenis Prevention */}
          <div 
            data-lenis-prevent="true"
            className="space-y-3 pt-3 pb-2 text-xs text-slate-700 leading-relaxed overflow-y-auto max-h-[60vh] overscroll-contain pr-2 focus:outline-none"
          >
            {TERMS_CONDITIONS_LIST.map((clause) => {
              const Icon = clause.icon;
              return (
                <div 
                  key={clause.num}
                  className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/90 space-y-1 hover:border-slate-300 transition-colors"
                >
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <Icon className={cn("h-4 w-4 shrink-0", clause.color)} />
                    <span>{clause.num}. {clause.title}</span>
                  </h4>
                  <p className="text-slate-600 pl-6 text-xs leading-relaxed">
                    {clause.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs font-semibold"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onToggle(true);
                setIsModalOpen(false);
              }}
              className="bg-brand-action hover:bg-brand-action-hover text-white text-xs font-bold gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              I Agree to All Terms
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
