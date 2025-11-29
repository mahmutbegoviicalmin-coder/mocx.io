"use client";

import Image from "next/image";
import { Check, X, ArrowRight } from "lucide-react";
import { Particles } from "./Particles";
import Link from "next/link";

export function BeforeAfter() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#0a0a0f]">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a24] via-[#0a0a0f] to-[#000000] z-0" />
      
      {/* Particles Effect - Static or lighter */}
      <Particles className="opacity-30 z-0" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay" 
           style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }} 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 tracking-tight"
          >
            See the Mocx Difference
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-[900px] mx-auto">
          
          {/* BEFORE CARD (~45%) */}
          <div 
            className="w-full md:w-[45%] relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-white/5 to-transparent rounded-[32px] blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative rounded-[28px] overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
              {/* Label */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 text-sm font-medium flex items-center gap-2 shadow-lg">
                  <X className="w-4 h-4 text-red-500/70" /> Before
                </span>
              </div>

              {/* Image Container */}
              <div className="relative w-full p-8 md:p-10 bg-gradient-to-b from-black/20 to-black/60">
                 <div className="relative w-full aspect-[3/4]">
                    <Image 
                      src="/before.jpg" 
                      alt="Raw Screenshot"
                      fill
                      className="object-contain drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale-[20%] group-hover:grayscale-0"
                    />
                 </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
                <p className="text-white/60 text-sm md:text-base font-medium text-center">
                  Raw screenshots that fail to convert.
                </p>
              </div>
            </div>
          </div>

          {/* AFTER CARD (~55%) */}
          <div 
            className="w-full md:w-[55%] relative group"
          >
            {/* Glow behind card */}
            <div className="absolute -inset-2 bg-gradient-to-b from-primary/20 via-purple-500/10 to-transparent rounded-[40px] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            
            <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)]">
              {/* Label */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-primary/90 backdrop-blur-md border border-white/20 text-white text-sm font-bold flex items-center gap-2 shadow-xl shadow-primary/20">
                  <Check className="w-4 h-4 text-white" /> After Mocx
                </span>
              </div>

              {/* Image Container */}
              <div className="relative w-full p-6 md:p-8 bg-gradient-to-b from-white/5 to-transparent">
                 <div className="relative w-full aspect-[3/4]">
                    <Image 
                      src="/after.jpg" 
                      alt="Cinematic Mockup"
                      fill
                      className="object-contain drop-shadow-2xl"
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

        {/* CTA Button */}
        <div 
          className="mt-16 flex justify-center"
        >
          <Link href="#pricing">
            <button className="group relative px-8 py-4 bg-[#FF5A5F] text-white rounded-full font-semibold text-lg shadow-xl shadow-[#FF5A5F]/20 hover:shadow-[#FF5A5F]/40 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              Try Mocx now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              {/* Optional: internal glow/shine effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
