"use client";

import { PhoneCall, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConsultationBookingModal } from "../consultation/ConsultationBookingModal";
import { WHATSAPP_URL, WHATSAPP_NUMBER } from "@/lib/constants";

export function PackagesCTA() {
  const handlePhoneClick = () => {
    toast.success("Connecting you with our medical advisor...", {
      description: "Call initiated to +91 98765 43210 (Litmus Advisory Support).",
    });
  };

  const handleWhatsappClick = () => {
    toast.success("Redirecting to WhatsApp...", {
      description: `Opening chat with +${WHATSAPP_NUMBER}.`,
    });
    setTimeout(() => {
      window.open(WHATSAPP_URL, "_blank");
    }, 800);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 ">
      <div className="relative rounded-[2rem] bg-gradient-to-br from-brand-card-from to-brand-card-to p-8 md:p-12 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-white/10 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white tracking-tight leading-[1.3]">
            Not sure which package fits your needs?
          </h2>
          <p className="font-body text-white/90 text-base font-normal leading-[1.5]">
            Connect with our food safety experts for a personalized diagnostic roadmap tailored to your industry and compliance requirements.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button 
              onClick={handlePhoneClick}
              size="lg" 
              className="h-12 px-6 bg-white text-slate-900 hover:bg-slate-50 font-body font-semibold text-sm rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-md border-0 active:scale-95"
            >
              <PhoneCall className="h-4 w-4 text-brand-action" /> Book via Phone Call
            </Button>
            
            <ConsultationBookingModal serviceName="Quick Package Order">
              <Button 
                size="lg" 
                className="h-12 px-6 bg-white text-slate-900 hover:bg-slate-50 font-body font-semibold text-sm rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-md border-0 active:scale-95"
              >
                <Package className="h-4 w-4 text-brand-action" /> Quick Order
              </Button>
            </ConsultationBookingModal>

            <Button 
              onClick={handleWhatsappClick}
              size="lg" 
              className="h-12 px-6 bg-white text-slate-900 hover:bg-slate-50 font-body font-semibold text-sm rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-md border-0 active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-brand-action" /> Book via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
