"use client";

import { useBookingWizard } from "@/hooks/useBookingWizard";
import { BookingProgressBar } from "./BookingProgressBar";
import { StepSampleScope } from "./StepSampleScope";
import { StepSampleDetails } from "./StepSampleDetails";
import { StepSelectLab } from "./StepSelectLab";
import { StepAddressSchedule } from "./StepAddressSchedule";
import { StepPayment } from "./StepPayment";
import { StepConfirmation } from "./StepConfirmation";
import { BookingSummarySidebar } from "./BookingSummarySidebar";

const STEPS = ["Scope", "Details", "Lab", "Schedule", "Payment"];

export function BookingWizard() {
  const wizard = useBookingWizard();
  const isHydrating = !wizard.dataLoaded || wizard.isCartLoading;

  const handleToggleParam = (itemIdx: number, sampleIdx: number, paramName: string) => {
    wizard.setItems(prev => {
      const copy = [...prev];
      const sample = copy[itemIdx].samples[sampleIdx];
      if (sample.selectedParameters.includes(paramName)) {
        sample.selectedParameters = sample.selectedParameters.filter(p => p !== paramName);
      } else {
        sample.selectedParameters.push(paramName);
      }
      return copy;
    });
  };

  const handleUpdateSample = (itemIdx: number, sampleIdx: number, field: string, val: string) => {
    wizard.setItems(prev => {
      const copy = [...prev];
      copy[itemIdx].samples[sampleIdx] = { ...copy[itemIdx].samples[sampleIdx], [field]: val };
      return copy;
    });
  };

  const handleAddSample = (itemIdx: number) => {
    wizard.setItems(prev => {
      const copy = [...prev];
      const base = copy[itemIdx];
      copy[itemIdx].samples.push({
        id: Math.random().toString(36).substring(2, 9),
        productName: `${base.product} Sample #${base.samples.length + 1}`,
        quantity: "",
        batchNumber: "",
        sku: "",
        specifics: "",
        selectedParameters: base.availableParameters?.map(p => p.name) || [],
      });
      return copy;
    });
  };

  const handleRemoveSample = (itemIdx: number, sampleIdx: number) => {
    wizard.setItems(prev => {
      const copy = [...prev];
      copy[itemIdx].samples.splice(sampleIdx, 1);
      return copy;
    });
  };

  const isNextDisabled =
    isHydrating ||
    (wizard.step === 0 && wizard.items.length === 0) ||
    (wizard.step === 1 && !wizard.canProceedSampleDetails) ||
    (wizard.step === 3 && !wizard.isStep3Valid);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 space-y-8 animate-fade-in">
        {wizard.step < 5 && <BookingProgressBar currentStep={wizard.step} steps={STEPS} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className={wizard.step === 5 ? "col-span-12" : "lg:col-span-8"}>
            {wizard.step < 5 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8 min-h-[320px]">
                {wizard.step === 0 && (
                  <StepSampleScope items={wizard.items} isLoading={isHydrating} onToggleParam={handleToggleParam} />
                )}
                {wizard.step === 1 && (
                  <StepSampleDetails
                    items={wizard.items}
                    onUpdateSample={handleUpdateSample}
                    onAddSample={handleAddSample}
                    onRemoveSample={handleRemoveSample}
                  />
                )}
                {wizard.step === 2 && (
                  <StepSelectLab
                    labs={wizard.eligibleLabs}
                    selectedLab={wizard.selectedLab}
                    onSelectLab={wizard.setSelectedLab}
                    calculateLabPricing={wizard.calculateLabPricing}
                  />
                )}
                {wizard.step === 3 && (
                  <StepAddressSchedule
                    formData={wizard.formData}
                    onChange={(f, v) => wizard.setFormData(prev => ({ ...prev, [f]: v }))}
                  />
                )}
                {wizard.step === 4 && (
                  <StepPayment
                    paymentMethod={wizard.paymentMethod}
                    onSelectPaymentMethod={wizard.setPaymentMethod}
                    total={wizard.total}
                  />
                )}
              </div>
            ) : (
              <StepConfirmation booking={wizard.createdBooking} />
            )}
          </div>

          {wizard.step < 5 && (
            <div className="lg:col-span-4">
              <BookingSummarySidebar
                itemsCount={wizard.items.length}
                totalMrp={wizard.totalMrp}
                subtotal={wizard.subtotal}
                discount={wizard.discount}
                gst={wizard.gst}
                total={wizard.total}
                step={wizard.step}
                isNextDisabled={isNextDisabled}
                isCreatingBooking={wizard.isCreatingBooking}
                onNext={wizard.handleNext}
                onBack={wizard.handleBack}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
