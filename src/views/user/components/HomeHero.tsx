"use client";

import Link from "next/link";
import { Search, Shield, FileText, Package, Microscope, Ticket, Currency, CurrencyIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { SearchAutocomplete } from "@/components/common/SearchAutocomplete";
import { ConsultationBookingModal } from "./consultation/ConsultationBookingModal";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import heroScientist from "@/assets/banner-hero-1.jpg";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: <>Certified Laboratory Testing at Your Fingertips</>,
    description: "Select your product, choose the required parameters, submit samples, and receive accredited laboratory reports without the hassle of contacting multiple labs.",
    badge: "NABL & FSSAI Accredited Labs",
    offer: "GET OFFERS UPTO 15% ON YOUR FIRST BOOKING",
    image: heroScientist,
    imageAlt: "Food Safety Specialist",
    video: "/video/video banner.mp4",
    floatingBadges: [
      {
        icon: Shield,
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100",
        title: "100% Reliable",
        subtitle: "Certified Results",
        position: "top-12 right-[10%]",
        animation: "animate-[bounce_3s_infinite]"
      },
      {
        icon: FileText,
        iconColor: "text-[#E53935]",
        iconBg: "bg-red-100",
        title: "FSSAI Ready",
        subtitle: "Auto-generated",
        position: "bottom-12 left-[10%]",
        animation: "animate-[bounce_4s_infinite_reverse]"
      }
    ]
  },
  {
    id: 2,
    title: <>Comprehensive Food Safety Packages</>,
    description: "Explore bundled testing packages tailored for regulatory compliance. Stay FSSAI and NABL ready with our curated testing solutions.",
    badge: "Compliance Ready",
    offer: "FLAT 20% OFF ON COMPREHENSIVE PACKAGES",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Food Safety Packages",
    floatingBadges: [
      {
        icon: Package,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-100",
        title: "Curated Packages",
        subtitle: "Save Time & Money",
        position: "top-12 right-[10%]",
        animation: "animate-[bounce_3s_infinite]"
      },
    ]
  },
  {
    id: 3,
    title: <>Track & Analyze with Ease</>,
    description: "Get real-time status updates on your samples and download digitally certified, tamper-proof reports the moment they are ready.",
    badge: "Real-time Tracking",
    offer: "INSTANT DIGITAL REPORTS",
    image: heroScientist,
    imageAlt: "Track and Analyze",
    floatingBadges: [
      {
        icon: Microscope,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        title: "Real-time Updates",
        subtitle: "Track Samples",
        position: "bottom-12 left-[10%]",
        animation: "animate-[bounce_4s_infinite_reverse]"
      }
    ]
  }
];

interface HomeHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HomeHero({ searchQuery, setSearchQuery }: HomeHeroProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      const idx = api.selectedScrollSnap();
      setCurrent(idx);
      
      const autoplay = api.plugins().autoplay;
      if (slides[idx].video) {
        if (autoplay) autoplay.stop();
        // Reset and play the video when navigating back to it
        const slideNode = api.slideNodes()[idx];
        if (slideNode) {
          const videoElement = slideNode.querySelector('video');
          if (videoElement) {
            videoElement.currentTime = 0;
            videoElement.play().catch(e => console.log("Video play error:", e));
          }
        }
      } else {
        if (autoplay) autoplay.play();
      }
    };

    handleSelect();
    api.on("select", handleSelect);
  }, [api]);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-[500px] h-full md:h-[600px] bg-[#E53935]/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="absolute bottom-0 left-0 w-[400px] h-full md:h-[400px] rounded-full bg-brand-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="w-full relative z-10">
          <Carousel
            plugins={[
              Fade(),
              Autoplay({ delay: 5000, stopOnInteraction: true })
            ]}
            opts={{ loop: true }}
            setApi={setApi}
            className="w-full relative"
          >
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <div className="overflow-hidden relative h-[75vh] md:h-screen min-h-[500px] md:min-h-[600px] max-h-[850px] flex flex-col justify-center">
                    {slide.video ? (
                      <video 
                        autoPlay muted playsInline 
                        onEnded={() => api?.scrollNext()}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        src={slide.video}
                      />
                    ) : (
                      <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${typeof slide.image === "string" ? slide.image : slide.image.src})` }}
                      />
                    )}
                    <div 
                      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 35%, transparent 60%)' }}
                    />
                    <div className="flex flex-col relative z-10 max-w-7xl mx-auto w-full px-4">
                      <div className="lg:w-1/2 max-w-2xl flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-4 lg:mb-6 w-max">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-medium text-white/90">{slide.badge}</span>
                        </div>
                        <h1 className="text-4xl sm:text-[48px] font-extrabold text-white mb-4 lg:mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                          {slide.title}
                        </h1>
                        <p className="text-white/80 font-medium text-base sm:text-lg mb-6 lg:mb-8 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                          {slide.description}
                        </p>
                        <div className="inline-block bg-brand-action/90 backdrop-blur-md shadow-lg rounded-lg px-4 py-2 w-fit border border-brand-action">
                          <p className="text-xs font-bold text-white uppercase tracking-wider">{slide.offer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom Dot Indicators (Centered at the bottom) */}
            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    current === idx ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/90"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </Carousel>

          {/* Absolute Booking Form positioned at the bottom (Desktop) */}
          <div className="absolute bottom-10 left-0 right-0 z-20 pointer-events-none hidden lg:block">
            <div className="w-full max-w-7xl mx-auto px-4">
              <div className="w-full pointer-events-auto bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full shadow-2xl flex items-center gap-4">
                <form 
                  className="relative flex-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/tests?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                >
                  <SearchAutocomplete
                    hideIcon
                    placeholder="Search for checkups..."
                    inputClassName="relative placeholder:text-slate-400 z-10 w-full rounded-full border-none bg-white/95 hover:bg-white py-3.5 pl-5 pr-12 text-sm text-slate-800 outline-none shadow-inner transition-colors"
                  >
                    <button type="submit" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-brand-action hover:text-brand-action-hover transition-colors">
                      <Search className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                    </button>
                  </SearchAutocomplete>
                </form>

                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href="/tests"
                    className="flex items-center justify-center gap-2 rounded-full bg-white border-2 border-brand-action px-6 py-3.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-brand-action/10 hover:border-brand-action whitespace-nowrap group"
                  >
                    <Microscope className="h-4 w-4 text-brand-action group-hover:scale-110 transition-transform" /> Book a Lab Test
                  </Link>
                  <ConsultationBookingModal serviceName="General Consultation" source="Home Hero">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-full bg-brand-action px-6 py-4 text-xs font-bold text-white shadow-md transition hover:bg-brand-action-hover hover:shadow-lg whitespace-nowrap group"
                    >
                      <Ticket className="h-4 w-4 group-hover:scale-110 transition-transform" /> Free Consultation
                    </button>
                  </ConsultationBookingModal>
                  <Link
                    href="/packages"
                    className="flex items-center justify-center gap-2 rounded-full bg-white border-2 border-brand-action px-6 py-3.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-brand-action/10 hover:border-brand-action whitespace-nowrap group"
                  >
                    <Package className="h-4 w-4 text-brand-action group-hover:scale-110 transition-transform" /> Health Packages
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 max-w-5xl mx-auto px-4 -mt-10 sm:-mt-10 mb-6 lg:hidden">
        <div className="bg-white rounded-3xl sm:rounded-full p-4 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3">
            <form 
              className="relative min-w-0 flex-1 flex w-full"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/tests?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
            >
              <SearchAutocomplete
                hideIcon
                placeholder="Search for checkups..."
                inputClassName="relative placeholder:text-slate-400 z-10 w-full rounded-full border-none bg-slate-50/50 hover:bg-slate-50 py-3.5 pl-5 pr-12 text-sm text-slate-800 outline-none ring-0 focus:ring-0 h-[48px] transition-colors"
              >
                <button type="submit" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-brand-action hover:text-brand-action-hover">
                  <Search className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
              </SearchAutocomplete>
            </form>
            
            <div className="flex shrink-0 w-full sm:w-auto overflow-x-auto gap-2 pb-1 sm:pb-0 scrollbar-hide">
              <Link
                href="/tests"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white border-2 border-brand-action px-5 py-3 text-xs font-bold text-brand-action shadow-sm transition hover:bg-brand-action/10 whitespace-nowrap"
              >
                Book test
                <Microscope className="h-4 w-4" />
              </Link>
              <ConsultationBookingModal serviceName="General Consultation" source="Home Hero">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-action px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-brand-action-hover whitespace-nowrap"
                >
                  Book free consultation
                  <Ticket className="h-4 w-4" />
                </button>
              </ConsultationBookingModal>
              <Link
                href="/packages"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white border-2 border-brand-action px-5 py-3 text-xs font-bold text-brand-action shadow-sm transition hover:bg-brand-action/10 whitespace-nowrap"
              >
                book a package
                <Package className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
