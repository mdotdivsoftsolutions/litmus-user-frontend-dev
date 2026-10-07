"use client";

import { ConsultationHero } from "./components/consultation/ConsultationHero";
import { PromoBanner } from "./components/home/PromoBanner";
import { LabsCertificates } from "./components/labs-listing/LabsCertificates";

export default function ConsultationPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-slate-50">
      <div suppressHydrationWarning>
        <ConsultationHero />
      </div>
      <div suppressHydrationWarning className="pb-10 bg-white">
        <LabsCertificates />
      </div>
      <div suppressHydrationWarning>
        <PromoBanner className="py-20" />
      </div>
    </div>
  );
}
