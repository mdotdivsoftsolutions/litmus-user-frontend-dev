"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";
import { homeHeroSlides } from "./HomeHeroSlides";

/**
 * The hero video (~3.4 MB) streams only on screens at least this wide. It is selected by the
 * browser from <source media> while parsing the HTML, so desktop starts downloading it immediately
 * and phones never download it (they keep the poster, which is the video's first frame).
 */
const VIDEO_MEDIA = "(min-width: 768px)";

export function HomeHeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = (isInitial: boolean) => {
      const idx = api.selectedScrollSnap();
      setCurrent(idx);

      const autoplay = api.plugins().autoplay;
      const videoElement = api.slideNodes()[idx]?.querySelector("video");
      if (homeHeroSlides[idx].video && videoElement && window.matchMedia(VIDEO_MEDIA).matches) {
        // Let the video finish before moving on (onEnded advances the carousel).
        autoplay?.stop();
        // On first load the video is already playing from the HTML: don't rewind it (that would
        // flash back to the start). Rewind only when the visitor comes back to this slide.
        if (!isInitial) videoElement.currentTime = 0;
        videoElement.play().catch(() => autoplay?.play());
      } else {
        autoplay?.play();
      }
    };

    handleSelect(true);
    const onSelect = () => handleSelect(false);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

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
              {slide.video ? (
                <>
                  {idx === 0 && slide.poster && (
                    // Hoisted into <head>: the poster is the first thing visitors see (LCP).
                    <link rel="preload" as="image" href={slide.poster.src} fetchPriority="high" />
                  )}
                  <video
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    poster={(slide.poster ?? slide.image).src}
                    onEnded={() => api?.scrollNext()}
                    aria-label={slide.imageAlt || slide.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  >
                    <source
                      src={slide.video}
                      type="video/mp4"
                      media={VIDEO_MEDIA}
                      // If the video can't load, keep the slideshow moving instead of stopping here.
                      onError={() => api?.plugins().autoplay?.play()}
                    />
                  </video>
                </>
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
