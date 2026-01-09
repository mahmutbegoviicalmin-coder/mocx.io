'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-32 overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Subtle blue glow */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full animate-pulse-glow" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay" />
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-[#0C0C0E] to-transparent" />
      </div>

      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm font-medium text-white/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI-Powered Creative Studio</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="max-w-5xl mx-auto text-5xl md:text-7xl lg:text-[5.5rem] text-white mb-8 leading-[1.1] tracking-[-0.01em]"
        >
          <span className="block font-medium">Never Wait on a</span>
          <span className="block font-serif italic text-blue-400">Designer Again</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="max-w-xl mx-auto text-base md:text-lg lg:text-xl text-white/40 mb-12 leading-relaxed font-normal px-4"
        >
          Mockups and thumbnails generated in seconds. Skip the designers, skip the delays, ship faster.
        </motion.p>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <Link 
            href="/sign-up" 
            className="group h-14 px-8 flex items-center justify-center gap-2 btn-primary text-base"
          >
            Start Creating
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mt-16 flex items-center gap-8 md:gap-12"
        >
          {[
            { value: '1.8M+', label: 'Visuals Created' },
            { value: '50K+', label: 'Creators' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-white/40 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Preview Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="mt-20 w-full max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mockup Studio Card */}
            <div className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#131316] to-[#0C0C0E] shadow-2xl hover:border-blue-500/20 transition-all duration-500">
              {/* Video Container */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-blue-500/5 to-blue-600/10">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  poster="/prompt1.jpg"
                  className="w-full h-full object-cover"
                >
                  <source src="/tools/mockupstudio.mp4" type="video/mp4" />
                </video>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Card Footer */}
              <div className="p-5 border-t border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">Product Mockups</h3>
                    <p className="text-white/40 text-xs">Photorealistic product shots</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Maker Card */}
            <div className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#131316] to-[#0C0C0E] shadow-2xl hover:border-blue-500/20 transition-all duration-500">
              {/* Video Container */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-blue-400/5 to-blue-500/10">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  poster="/thumbnails/45a72f2e-f64e-4840-b5ed-5effc216c045.jpg"
                  className="w-full h-full object-cover"
                >
                  <source src="/tools/thumbnailgenerator.mp4" type="video/mp4" />
                </video>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Card Footer */}
              <div className="p-5 border-t border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">Thumbnails</h3>
                    <p className="text-white/40 text-xs">Click-worthy video covers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
