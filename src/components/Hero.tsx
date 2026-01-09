'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
          className="max-w-2xl mx-auto text-lg md:text-xl text-white/40 mb-12 leading-relaxed font-normal"
        >
          Mockups, thumbnails, and AI art — generated in seconds. 
          Skip the designers, skip the delays, ship faster.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/sign-up" 
            className="group h-14 px-8 flex items-center justify-center gap-2 btn-primary text-base"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            href="#demo"
            className="h-14 px-8 flex items-center justify-center gap-2 btn-secondary text-base"
          >
            <Play className="w-4 h-4" />
            Watch Demo
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
            { value: '4.9/5', label: 'Rating' },
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
                    <span className="text-white/30 text-xs">mocx.ai</span>
                  </div>
                </div>
              </div>
              
              {/* Content preview - 3 tool cards */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Mockup Studio */}
                <div className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-blue-500/5 to-blue-600/10">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-14 h-14 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1">Product Mockups</h3>
                    <p className="text-white/30 text-xs text-center">Photorealistic product shots</p>
                  </div>
                </div>

                {/* Thumbnail Maker */}
                <div className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-blue-400/5 to-blue-500/10">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-14 h-14 mb-3 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1">Thumbnails</h3>
                    <p className="text-white/30 text-xs text-center">Click-worthy video covers</p>
                  </div>
                </div>

                {/* AI Art */}
                <div className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-blue-300/5 to-blue-400/10">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-14 h-14 mb-3 rounded-xl bg-blue-300/10 border border-blue-300/20 flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1">AI Art Generator</h3>
                    <p className="text-white/30 text-xs text-center">Text to stunning images</p>
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
