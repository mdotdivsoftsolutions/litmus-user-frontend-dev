import { HomeHeroCarousel } from "./home-hero/HomeHeroCarousel";
import { HomeHeroDesktopSearch } from "./home-hero/HomeHeroDesktopSearch";
import { HomeHeroMobileSearch } from "./home-hero/HomeHeroMobileSearch";

export function HomeHero() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-[500px] h-full md:h-[600px] bg-[#E53935]/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-full md:h-[400px] rounded-full bg-brand-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="w-full relative z-10">
          <HomeHeroCarousel />
          <HomeHeroDesktopSearch />
        </div>
      </section>

      <HomeHeroMobileSearch />
    </>
  );
}
