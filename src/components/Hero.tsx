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
          className="mt-20 w-full max-w-5xl"
        >
          <div className="relative">
            {/* Glow behind the card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-500/20 blur-[80px] rounded-3xl" />
            
            {/* Main preview card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#131316]/90 backdrop-blur-sm shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-black/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-white/[0.03] rounded-lg max-w-xs mx-auto flex items-center justify-center">
                    <span className="text-white/30 text-xs">mocx.io</span>
                  </div>
                </div>
              </div>
              
              {/* Content preview - 2 tool cards with videos */}
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
                {/* Mockup Studio */}
                <div className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#0C0C0E]">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full aspect-video object-cover"
                  >
                    <source src="/tools/mockupstudio.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-medium text-sm">Product Mockups</h3>
                  </div>
                </div>

                {/* Thumbnail Maker */}
                <div className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#0C0C0E]">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full aspect-video object-cover"
                  >
                    <source src="/tools/thumbnailgenerator.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-medium text-sm">Thumbnails</h3>
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
