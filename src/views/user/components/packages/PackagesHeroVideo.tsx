"use client";

export function PackagesHeroVideo() {
  return (
    <div className="flex-1 relative w-full lg:w-auto">
      <div className="relative group/pano w-full max-w-[500px] h-[250px] sm:h-[300px] md:h-[350px] mx-auto lg:ml-auto lg:mr-0 rounded-[1rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.1)] border-[5px] border-white bg-slate-900 flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] pointer-events-none z-0">
          <iframe
            className="w-full h-full pointer-events-none"
            src="https://www.youtube.com/embed/6k2Pq-dV_gI?si=s5H0X70H1Q_32j2B&controls=0&rel=0&modestbranding=1&showinfo=0&autoplay=1&mute=1&start=4&end=30&iv_load_policy=3"
            title="Litmus Diagnostics Tour"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
