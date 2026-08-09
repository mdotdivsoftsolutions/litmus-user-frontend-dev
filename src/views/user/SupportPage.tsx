"use client";

import { SupportHero } from "./components/support/SupportHero";
import { SupportContact } from "./components/support/SupportContact";
import { HowToBookProcess } from "./components/home/HowToBookProcess";
import { TrustedPartner } from "./components/consultation/TrustedPartner";

export default function SupportPage() {
   return (
      <div className="animate-fade-in bg-slate-50 min-h-screen">
         <div data-aos="fade-up">
            <SupportHero />
         </div>
         <div data-aos="fade-up" data-aos-delay="100">
            <HowToBookProcess className="bg-white" />
         </div>
         <div data-aos="fade-up" data-aos-delay="150">
            <SupportContact />
         </div>
         <div data-aos="fade-up" data-aos-delay="200">
            <TrustedPartner/>
         </div>
      </div>
   );
}
