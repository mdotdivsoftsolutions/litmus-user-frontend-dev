"use client";

import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";
import { homeHeroSlides } from "./home-hero/HomeHeroSlides";
import { HomeHeroDesktopSearch } from "./home-hero/HomeHeroDesktopSearch";
import { HomeHeroMobileSearch } from "./home-hero/HomeHeroMobileSearch";

interface HomeHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HomeHero({ searchQuery }: HomeHeroProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const idx = api.selectedScrollSnap();
      setCurrent(idx);

      const autoplay = api.plugins().autoplay;
      if (homeHeroSlides[idx].video) {
        if (autoplay) autoplay.stop();
        const slideNode = api.slideNodes()[idx];
        if (slideNode) {
          const videoElement = slideNode.querySelector("video");
          if (videoElement) {
            videoElement.currentTime = 0;
            videoElement.play().catch((e) => console.log("Video play error:", e));
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
        <div className="absolute bottom-0 left-0 w-[400px] h-full md:h-[400px] rounded-full bg-brand-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="w-full relative z-10">
          <Carousel
            plugins={[Fade(), Autoplay({ delay: 5000, stopOnInteraction: true })]}
            opts={{ loop: true }}
            setApi={setApi}
            className="w-full relative"
          >
            <CarouselContent>
              {homeHeroSlides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <div className="overflow-hidden relative h-[75vh] md:h-screen min-h-[500px] md:min-h-[600px] max-h-[850px] flex flex-col justify-center">
                    {slide.video ? (
                      <video
                        autoPlay
                        muted
                        playsInline
                        onEnded={() => api?.scrollNext()}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        src={slide.video}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                        style={{
                          backgroundImage: `url(${typeof slide.image === "string" ? slide.image : slide.image.src})`,
                        }}
                      />
                    )}
                    <div
                      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 35%, transparent 60%)",
                      }}
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

            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
              {homeHeroSlides.map((_, idx) => (
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

          <HomeHeroDesktopSearch searchQuery={searchQuery} />
        </div>
      </section>

      <HomeHeroMobileSearch searchQuery={searchQuery} />
    </>
  );
}
