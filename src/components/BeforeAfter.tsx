"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { Particles } from "./Particles";

export function BeforeAfter() {
  return (
    <section className="py-32 relative overflow-hidden bg-black">
      {/* Modern Background with subtle primary glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full opacity-40 pointer-events-none" />
      
      {/* Particles Effect */}
      <Particles className="opacity-20 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tight"
          >
            See the Mocx Difference
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-[900px] mx-auto">
          
          {/* BEFORE CARD (~45%) */}
          <div 
            className="w-full md:w-[45%] relative group cursor-pointer hover:z-10"
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-white/5 to-transparent rounded-[32px] blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative rounded-[28px] overflow-hidden border border-white/5 bg-zinc-900/20 backdrop-blur-sm shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              {/* Label */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/5 text-white/50 text-sm font-medium flex items-center gap-2 shadow-lg">
                  <X className="w-4 h-4 text-white/40" /> Before
                </span>
              </div>

              {/* Image Container */}
              <div className="relative w-full p-8 md:p-10 bg-gradient-to-b from-black/20 to-black/60">
                 <div className="relative w-full aspect-[3/4]">
                    <Image 
                      src="/before.jpg" 
                      alt="Raw Screenshot"
                      fill
                      className="object-contain drop-shadow-2xl opacity-60 group-hover:opacity-80 transition-all duration-500 grayscale-[50%] group-hover:grayscale-0 scale-95 group-hover:scale-100"
                    />
                 </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
                <p className="text-white/40 text-sm md:text-base font-medium text-center group-hover:text-white/60 transition-colors">
                  Raw screenshots that fail to convert.
                </p>
              </div>
            </div>
          </div>

          {/* AFTER CARD (~55%) */}
          <div 
            className="w-full md:w-[55%] relative group cursor-pointer hover:z-10"
          >
            {/* Glow behind card */}
            <div className="absolute -inset-2 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-[40px] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700" />
            
            <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-zinc-900/30 backdrop-blur-md shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] group-hover:border-primary/30 transition-all duration-500 group-hover:scale-[1.02]">
              {/* Label */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 text-primary text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_-5px_var(--primary)]">
                  <Check className="w-4 h-4" /> After Mocx
                </span>
              </div>

              {/* Image Container */}
              <div className="relative w-full p-6 md:p-8 bg-gradient-to-b from-white/5 to-transparent">
                 <div className="relative w-full aspect-[3/4]">
                    <Image 
                      src="/after.jpg" 
                      alt="Cinematic Mockup"
                      fill
                      className="object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                 </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent pt-24">
                <p className="text-white text-base md:text-lg font-medium text-center drop-shadow-md">
                  Cinematic mockups that build trust instantly.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
