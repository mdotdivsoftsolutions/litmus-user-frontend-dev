"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";
import { homeHeroSlides } from "./HomeHeroSlides";

/** The hero video is ~3.4 MB: only stream it on wide screens without data-saver. */
const WIDE_SCREEN = "(min-width: 768px)";

function canPlayHeroVideo() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(WIDE_SCREEN).matches && !connection?.saveData;
}

function subscribeToScreenSize(onChange: () => void) {
  const query = window.matchMedia(WIDE_SCREEN);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function HomeHeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  // false on the server render and on phones: they get the poster image instead of the video.
  const showVideo = useSyncExternalStore(subscribeToScreenSize, canPlayHeroVideo, () => false);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const idx = api.selectedScrollSnap();
      setCurrent(idx);

      const autoplay = api.plugins().autoplay;
      if (homeHeroSlides[idx].video && showVideo) {
        if (autoplay) autoplay.stop();
        const slideNode = api.slideNodes()[idx];
        if (slideNode) {
          const videoElement = slideNode.querySelector("video");
          if (videoElement) {
            videoElement.currentTime = 0;
            videoElement.play().catch((e) => console.log("Video play error:", e));
          }
        }
      } else if (autoplay) {
        autoplay.play();
      }
    };

    handleSelect();
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, showVideo]);

  return (
    <Carousel
      plugins={[Fade(), Autoplay({ delay: 5000, stopOnInteraction: true })]}
      opts={{ loop: true }}
      setApi={setApi}
      className="w-full relative"
    >
      <CarouselContent>
        {homeHeroSlides.map((slide, idx) => (
          <CarouselItem key={slide.id}>
            <div className="overflow-hidden relative h-[75vh] md:h-screen min-h-[500px] md:min-h-[600px] max-h-[850px] flex flex-col justify-center">
              {slide.video && showVideo ? (
                <video
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  poster={slide.image.src}
                  onEnded={() => api?.scrollNext()}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  src={slide.video}
                />
              ) : (
                <Image
                  src={slide.image}
                  alt={slide.imageAlt || slide.title}
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  placeholder="blur"
                  className="object-cover z-0"
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
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-white/90">{slide.badge}</span>
                  </div>
                  <h1 className="text-4xl sm:text-[48px] font-extrabold text-white mb-4 lg:mb-6 tracking-tight leading-[1.1]">
                    {slide.title}
                  </h1>
                  <p className="text-white/80 font-medium text-base sm:text-lg mb-6 lg:mb-8 max-w-xl leading-relaxed">
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
  );
}
