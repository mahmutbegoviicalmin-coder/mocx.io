'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Image, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiveViewers } from './LiveViewers';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-32 overflow-hidden">
      
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
        
        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm font-medium text-white/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI-Powered Creative Studio</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm font-medium text-white/50 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Money Back Guarantee</span>
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
          className="flex flex-col items-center gap-4"
        >
          <Link 
            href="/sign-up" 
            className="group h-14 px-8 flex items-center justify-center gap-2 btn-primary text-base"
          >
            Start Creating - 40% OFF
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <LiveViewers />
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mt-16 flex items-center gap-8 md:gap-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Image className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold text-white">1.8M+</div>
              <div className="text-xs text-white/40 font-medium">Visuals Created</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold text-white">50K+</div>
              <div className="text-xs text-white/40 font-medium">Creators</div>
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  );
}
