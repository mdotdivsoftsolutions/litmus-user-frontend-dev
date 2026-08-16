"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ConsultationBookingModal } from "../consultation/ConsultationBookingModal";

const mockCertificates = [
  {
    id: 1,
    title: "Food Label Review",
    subtitle: "Starting @ ₹1000",
    description: "Ensure your product labels comply with the latest food regulations and industry standards. Our experts review every aspect of your label to help you avoid non-compliance and build consumer trust.",
    image: "/stock_image/WebApp Stock Images/pexels-chokniti-khongchum-1197604-2280547.jpg",
    features: ["FSSAI label compliance review", "Claims and declaration verification", "Regulatory gap assessment & recommendations"]
  },
  {
    id: 2,
    title: "FSSAI Licensing & Documentation Support",
    subtitle: "Starting @ ₹1500 (Excl. Govt charges)",
    description: "Simplify the licensing process with expert guidance for obtaining, renewing, or modifying FSSAI registrations and License",
    image: "/stock_image/WebApp Stock Images/pexels-edward-jenner-4033023.jpg",
    features: ["New license and renewal support", "Documentation preparation", "Regulatory liaison and guidance"]
  },
  {
    id: 3,
    title: "Food Safety Audits & Gap Assessments",
    subtitle: "Starting @ ₹3000",
    description: "Evaluate your facility, processes, and food safety systems to identify risks and improve compliance before regulatory or customer audits.",
    image: "/stock_image/WebApp Stock Images/pexels-chokniti-khongchum-1197604-2280547.jpg",
    features: ["GMP, GHP & HACCP assessments", "Compliance gap analysis", "Corrective action recommendations"]
  },
  {
    id: 4,
    title: "HACCP, GMP & FOSTAC Training",
    subtitle: "Customized Pricing",
    description: "Equip your team with practical food safety knowledge through customized training programs designed for manufacturing, processing, and hospitality businesses.",
    image: "/stock_image/WebApp Stock Images/pexels-edward-jenner-4033023.jpg",
    features: ["Employee and management training", "Practical food safety workshops", "Training certificates and assessment"]
  }
];

export function LabsCertificates() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector("div")?.offsetWidth ?? 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -(cardWidth + 24) : (cardWidth + 24),
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
      <div className="relative px-2 sm:px-12">
        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {mockCertificates.map((cert) => (
            <ConsultationBookingModal key={cert.id} serviceName={cert.title}>
              <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-[#D32F2F]/20 hover:scale-[1.01] transition-all cursor-pointer flex-shrink-0 w-[300px] md:w-[340px] snap-start">
                {/* Top Image Section */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                </div>

                {/* Text Section */}
                <div className="p-6 pb-12 relative z-10 flex-1 flex flex-col justify-start text-start">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{cert.title}</h3>
                  <p className="text-[#006b88] font-bold text-sm mt-1.5">{cert.subtitle}</p>
                  <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                    {cert.description.length > 100 ? cert.description.slice(0, 100) + "..." : cert.description}
                  </p>
                </div>

                {/* Bottom Section with Salient Features */}
                <div className="bg-white p-6 pt-10 relative border-t border-slate-100">
                  <button
                    type="button"
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#006b88] to-[#004B60] text-white text-xs font-bold px-6 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm hover:opacity-90 hover:scale-105 transition-all duration-200 focus:outline-none"
                  >
                    Book Now
                  </button>
                  <ul className="space-y-3">
                    {cert.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start text-left font-medium">
                        <span className="text-[#D32F2F] mr-3 mt-0.5 shrink-0">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ConsultationBookingModal>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="hidden lg:flex absolute top-1/2 left-0 -translate-y-1/2 h-10 w-10 bg-gradient-to-br from-[#006b88] to-[#004B60] text-white shadow-lg rounded-full items-center justify-center hover:opacity-90 transition-all z-10"
        >
          <ChevronLeft className="h-5 w-5 -ml-0.5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 h-10 w-10 bg-gradient-to-br from-[#006b88] to-[#004B60] text-white shadow-lg rounded-full items-center justify-center hover:opacity-90 transition-all z-10"
        >
          <ChevronRight className="h-5 w-5 -mr-0.5" />
        </button>
      </div>
    </div>
  );
}
