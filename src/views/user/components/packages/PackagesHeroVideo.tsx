"use client";

export function PackagesHeroVideo() {
  return (
    <div className="flex-1 relative w-full lg:w-auto">
      <div className="relative group/pano w-full max-w-[500px] h-[250px] sm:h-[300px] md:h-[350px] mx-auto lg:ml-auto lg:mr-0 rounded-[1.25rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.1)] border-[5px] border-white bg-slate-900 flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/video/video banner.mp4"
        />
      </div>
    </div>
  );
}
