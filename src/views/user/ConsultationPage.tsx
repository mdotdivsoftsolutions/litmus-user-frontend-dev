"use client";

import { ConsultationHero } from "./components/consultation/ConsultationHero";
import { PromoBanner } from "./components/home/PromoBanner";
import { LabsCertificates } from "./components/labs-listing/LabsCertificates";

export default function ConsultationPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-slate-50">
      <div data-aos="fade-up">
        <ConsultationHero />
      </div>
      <div className="pb-10 bg-white" data-aos="fade-up" data-aos-delay="100">
        <LabsCertificates />
      </div>
      <div data-aos="fade-up" data-aos-delay="150">
        <PromoBanner className="py-20" />
      </div>
    </div>
  );
}
