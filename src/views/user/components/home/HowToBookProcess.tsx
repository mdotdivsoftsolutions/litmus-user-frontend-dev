"use client";

import { SectionHeader } from "./SectionHeader";
import { UserPlus, Search, CalendarCheck, Truck, FlaskConical, FileCheck, Stethoscope } from "lucide-react";

const processSteps = [
    {
        number: "01",
        title: "Create Account",
        subtitle: "Sign up or login to your Litmus account",
        image: "/images/icons/icon_account_3d.webp",
        colorClass: "text-blue-600",
        bgClass: "bg-blue-50 border-blue-200 group-hover:border-blue-400 group-hover:bg-blue-100",
        shadowClass: "shadow-blue-500/20 group-hover:shadow-blue-500/40"
    },
    {
        number: "02",
        title: "Browse & Select Tests",
        subtitle: "Choose from our extensive food safety test catalog",
        image: "/images/icons/icon_search_3d.webp",
        colorClass: "text-purple-600",
        bgClass: "bg-purple-50 border-purple-200 group-hover:border-purple-400 group-hover:bg-purple-100",
        shadowClass: "shadow-purple-500/20 group-hover:shadow-purple-500/40"
    },
    {
        number: "03",
        title: "Book and Pay",
        subtitle: "Securely pay for your selected tests",
        image: "/images/icons/icon_payment_3d.webp",
        colorClass: "text-emerald-600",
        bgClass: "bg-emerald-50 border-emerald-200 group-hover:border-emerald-400 group-hover:bg-emerald-100",
        shadowClass: "shadow-emerald-500/20 group-hover:shadow-emerald-500/40"
    },
    {
        number: "04",
        title: "Schedule Pickup",
        subtitle: "Book your preferred collection time and location",
        image: "/images/icons/icon_calendar_3d.webp",
        colorClass: "text-orange-600",
        bgClass: "bg-orange-50 border-orange-200 group-hover:border-orange-400 group-hover:bg-orange-100",
        shadowClass: "shadow-orange-500/20 group-hover:shadow-orange-500/40"
    },
    {
        number: "05",
        title: "Sample Collection",
        subtitle: "Safe and secure sample collection at your doorstep",
        image: "/images/icons/icon_truck_3d.webp",
        colorClass: "text-pink-600",
        bgClass: "bg-pink-50 border-pink-200 group-hover:border-pink-400 group-hover:bg-pink-100",
        shadowClass: "shadow-pink-500/20 group-hover:shadow-pink-500/40"
    },
    {
        number: "06",
        title: "Lab Analysis",
        subtitle: "Advanced testing in NABL accredited laboratories",
        image: "/images/icons/icon_lab_3d.webp",
        colorClass: "text-teal-600",
        bgClass: "bg-teal-50 border-teal-200 group-hover:border-teal-400 group-hover:bg-teal-100",
        shadowClass: "shadow-teal-500/20 group-hover:shadow-teal-500/40"
    },
    {
        number: "07",
        title: "Get Reports",
        subtitle: "Download FSSAI-verified reports to your profile",
        image: "/images/icons/icon_report_3d.webp",
        colorClass: "text-indigo-600",
        bgClass: "bg-indigo-50 border-indigo-200 group-hover:border-indigo-400 group-hover:bg-indigo-100",
        shadowClass: "shadow-indigo-500/20 group-hover:shadow-indigo-500/40"
    },
] as const;


export function HowToBookProcess({ className }: { className?: string }) {
    return (
        <section className={`relative overflow-hidden py-12 md:py-16 ${className}`}>
            <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-50/30 blur-[120px]" />



            <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
                <SectionHeader
                    badge="Network of Trust"
                    title={
                        <>
                            How We <span className="text-gradient-brand">Work</span>
                        </>
                    }
                    subtitle="Our platform guides you through every step, from selecting the appropriate testing parameters to receiving accredited laboratory reports."
                    className="mb-16 md:mb-20 justify-start"
                />

                {/* Desktop: Horizontal Flow Chart with Icons */}
                <div className="hidden md:block">
                    {/* Connected flow with icons */}
                    <div className="relative">
                        {/* Curved Dashed Connection Line */}
                        <div className="absolute top-0 left-0 w-full h-20 pointer-events-none">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1400 100">
                                {/* Path for 7 items. Centers at 100, 300, 500, 700, 900, 1100, 1300 */}
                                <path 
                                    d="M 100 50 Q 200 0 300 50 T 500 50 T 700 50 T 900 50 T 1100 50 T 1300 50" 
                                    stroke="#cbd5e1" 
                                    strokeWidth="2" 
                                    strokeDasharray="6 6" 
                                    fill="none" 
                                />
                            </svg>
                        </div>

                        {/* Steps grid */}
                        <div className="grid grid-cols-7 gap-3 lg:gap-5">
                            {processSteps.map((step) => {
                                return (
                                    <div suppressHydrationWarning key={step.number} className="flex flex-col items-center text-center group" data-aos="fade-up" data-aos-delay={parseInt(step.number) * 50}>
                                        {/* Icon circle */}
                                        <div className={`relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 group-hover:scale-110 ${step.bgClass} ${step.shadowClass} overflow-hidden`}>
                                            <img src={step.image} alt={step.title} className="w-full h-full object-cover " />
                                        </div>

                                        {/* Step number badge */}
                                        <span className={`text-[10px] font-black tracking-wider mb-2 ${step.colorClass}`}>
                                            STEP {step.number}
                                        </span>

                                        {/* Title */}
                                        <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1.5">
                                            {step.title}
                                        </h4>

                                        {/* Subtitle */}
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {step.subtitle}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile: Vertical Flow */}
                <div className="md:hidden space-y-6">
                    {processSteps.map((step) => {
                        return (
                            <div suppressHydrationWarning key={step.number} className="flex gap-4 group" data-aos="fade-up" data-aos-delay={parseInt(step.number) * 50}>
                                {/* Icon */}
                                <div className={`flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${step.bgClass} overflow-hidden`}>
                                    <img src={step.image} alt={step.title} className="w-full h-full object-cover " />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <span className={`text-[9px] font-black tracking-wider ${step.colorClass}`}>STEP {step.number}</span>
                                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{step.title}</h4>
                                    <p className="mt-1 text-sm text-slate-600">{step.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Message */}
                <div className="mt-16 flex items-center justify-center gap-6">
                    <div className="h-px w-12 bg-gradient-to-l from-[#008eb3] to-[#004e64]" />
                    <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-l from-[#008eb3] to-[#004e64] bg-clip-text text-transparent">
                        Complete • Secure • FSSAI Approved
                    </p>
                    <div className="h-px w-12 bg-gradient-to-l from-[#008eb3] to-[#004e64]" />
                </div>
            </div>
        </section>
    );
}
