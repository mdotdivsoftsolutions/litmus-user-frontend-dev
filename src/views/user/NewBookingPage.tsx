"use client";

import { cn } from "@/lib/utils";
import { BookingWizardStepsHeader } from "./components/booking/BookingWizardStepsHeader";
import { BookingStep0Review } from "./components/booking/BookingStep0Review";
import { BookingStep1Samples } from "./components/booking/BookingStep1Samples";
import { BookingStep2LabSelection } from "./components/booking/BookingStep2LabSelection";
import { BookingStep3Collection } from "./components/booking/BookingStep3Collection";
import { BookingStep4Payment } from "./components/booking/BookingStep4Payment";
import { BookingStep5Confirmation } from "./components/booking/BookingStep5Confirmation";
import { BookingSidebarSummary } from "./components/booking/BookingSidebarSummary";
import { useNewBookingState } from "./components/booking/useNewBookingState";

export default function NewBookingPage() {
  const state = useNewBookingState();

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in pt-24 md:pt-28">
      <BookingWizardStepsHeader step={state.step} />

      <div className="max-w-7xl mx-auto px-4 pt-3">
        <div className="grid gap-8 lg:grid-cols-12">
          <div
            className={cn(
              "space-y-6 transition-all duration-500",
              state.step === 5 ? "lg:col-span-12 max-w-4xl mx-auto w-full" : "lg:col-span-8"
            )}
          >
            {state.step === 0 && (
              <BookingStep0Review
                items={state.items}
                dataLoaded={state.dataLoaded}
                isCartLoading={state.isCartLoading}
                isTestLoading={state.isTestLoading}
                isPackageLoading={state.isPackageLoading}
                removeItem={state.removeItem}
                calculateItemPrice={state.calculateItemPrice}
                calculateItemMrp={state.calculateItemMrp}
              />
            )}

            {state.step === 1 && (
              <BookingStep1Samples
                items={state.items}
                onBackToReview={() => state.setStep(0)}
                onAddSample={state.addSample}
                onRemoveSample={state.removeSample}
                onToggleParam={state.toggleTestForSample}
                onUpdateField={state.updateSampleField}
              />
            )}

            {state.step === 2 && (
              <BookingStep2LabSelection
                selectedLab={state.selectedLab}
                setSelectedLab={state.setSelectedLab}
                isLabsLoading={state.isLabsLoading}
                eligibleLabs={state.eligibleLabs}
                getLabPrice={state.getLabPrice}
              />
            )}

            {state.step === 3 && (
              <BookingStep3Collection
                formData={state.formData}
                handleInputChange={state.handleInputChange}
                setCollectionMethod={state.setCollectionMethod}
                minDateString={state.minDateString}
                isAvailabilityLoading={state.isAvailabilityLoading}
                dateError={state.dateError}
                timeError={state.timeError}
                pickupCities={state.pickupCities}
                isPickupCovered={state.isPickupCovered}
              />
            )}

            {state.step === 4 && (
              <BookingStep4Payment
                items={state.items}
                calculateItemPrice={state.calculateItemPrice}
                paymentError={state.paymentError}
                isPaymentProcessing={state.isPaymentProcessing}
                total={state.total}
              />
            )}

            {state.step === 5 && (
              <BookingStep5Confirmation
                orderId={state.orderId}
                selectedLab={state.selectedLab}
                eligibleLabs={state.eligibleLabs}
                items={state.items}
                subtotal={state.subtotal}
                gst={state.gst}
                total={state.total}
                calculateItemPrice={state.calculateItemPrice}
              />
            )}
          </div>

          <BookingSidebarSummary
            step={state.step}
            items={state.items}
            subtotal={state.subtotal}
            totalMrp={state.totalMrp}
            discount={state.discount}
            gst={state.gst}
            total={state.total}
            selectedLab={state.selectedLab}
            canProceedSampleDetails={state.canProceedSampleDetails}
            isStep3Valid={state.isStep3Valid}
            isCreatingBooking={state.isCreatingBooking}
            isPaymentProcessing={state.isPaymentProcessing}
            onNext={state.handleNext}
            onBack={state.handleBack}
          />
        </div>
      </div>
    </div>
  );
}
