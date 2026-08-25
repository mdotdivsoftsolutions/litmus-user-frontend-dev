"use client";

import { useState } from "react";
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
  Clock, 
  AlertTriangle,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SampleCollectionTermsCardProps {
  accepted: boolean;
  onToggle: (accepted: boolean) => void;
  collectionMethod?: string;
}

export function SampleCollectionTermsCard({
  accepted,
  onToggle,
  collectionMethod,
}: SampleCollectionTermsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCourier = collectionMethod === "COURIER";

  return (
    <>
      <div className="flex items-start gap-3 py-2 px-1">
        <Checkbox
          id="terms-collection-checkbox"
          checked={accepted}
          onCheckedChange={(checked) => onToggle(!!checked)}
          className="mt-0.5 h-4 w-4 rounded data-[state=checked]:bg-brand-action data-[state=checked]:border-brand-action"
        />
        <div className="text-xs text-slate-600 leading-normal">
          <label htmlFor="terms-collection-checkbox" className="cursor-pointer select-none">
            I have read and agree to the{" "}
          </label>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="font-semibold text-brand-action hover:underline inline-flex items-center gap-0.5 align-baseline"
          >
            Sample Collection &amp; Testing Terms &amp; Conditions
          </button>
          <span className="text-rose-500 font-bold ml-1">*</span>
        </div>
      </div>

      {/* Full Terms & Conditions Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-7">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-brand-action mb-1">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Litmus Protocol</span>
            </div>
            <DialogTitle className="text-xl font-black text-slate-900">
              Sample Collection &amp; Testing Terms &amp; Conditions
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Please review the mandatory protocols governing sample preparation, logistics, laboratory verification, and report release.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs text-slate-700 leading-relaxed">
            {/* Clause 1 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-brand-action" />
                1. Sample Packaging &amp; Integrity
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>All samples must be packaged in clean, sterile, leak-proof, and tamper-evident containers suitable for testing.</li>
                <li>Each sample package must have clear labeling matching the Product Name, Batch Number, and Scope specified in this booking.</li>
                <li>Adequate quantity specified for the parameters must be provided. Incomplete volume may delay or prevent analysis.</li>
              </ul>
            </div>

            {/* Clause 2 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600" />
                2. Doorstep Pickup &amp; Courier Handover
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                {isCourier ? (
                  <>
                    <li>For courier shipments, the customer is responsible for securely packing and shipping the parcel to the assigned testing laboratory.</li>
                    <li>Please provide the courier tracking ID in your order dashboard immediately upon dispatch to avoid fulfillment delays.</li>
                  </>
                ) : (
                  <>
                    <li>The customer or an authorized representative must be available at the specified collection address during the scheduled pickup window.</li>
                    <li>The assigned collector will verify the outer seal and package count before signing the digital collection acknowledgment.</li>
                  </>
                )}
                <li>Litmus and its partner laboratories maintain strict cold-chain and temperature protocols where required.</li>
              </ul>
            </div>

            {/* Clause 3 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                3. Turnaround Time (TAT) &amp; Analysis
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Estimated Turnaround Time (TAT) starts only from the date and time when the sample is physically received and logged in by the laboratory.</li>
                <li>In cases requiring microbial culture or re-runs for confirmatory results, TAT may be extended with prior notification.</li>
              </ul>
            </div>

            {/* Clause 4 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                4. Sample Rejection &amp; Resampling Policy
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Samples received in broken, leaked, unsealed, or contaminated state may be rejected by the testing laboratory.</li>
                <li>In the event of sample rejection due to transit damage or improper packaging, a free resampling/re-dispatch protocol may be requested.</li>
              </ul>
            </div>

            {/* Clause 5 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-700" />
                5. Diagnostic Reports &amp; Confidentiality
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Certified test reports with NABL / ISO / FSSAI accreditations (where applicable) will be uploaded directly to your dashboard and emailed to you.</li>
                <li>All diagnostic data, test parameters, and client identity remain strictly confidential under standard non-disclosure terms.</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
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
