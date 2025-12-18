'use client';

import Link from 'next/link';
import { ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden bg-[#0f1115] font-sans">
      
      {/* 1. BACKGROUND (Premium, Calm, Technical) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Grain/Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
        
        {/* One Subtle Radial Gradient */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full" />
        
        {/* Secondary Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#0f1115] via-[#1a1d23]/5 to-transparent" />
      </div>

      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center">
        
        {/* 2. TRUST BADGES */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16181d] border border-white/5 text-[11px] font-medium text-white/70 hover:bg-[#1a1d23] transition-colors cursor-default shadow-sm tracking-wide">
                <CreditCard className="w-3 h-3 text-orange-500" />
                Money-Back Guarantee
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16181d] border border-white/5 text-[11px] font-medium text-white/70 hover:bg-[#1a1d23] transition-colors cursor-default shadow-sm tracking-wide">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Cancel Anytime
            </div>
        </motion.div>

        {/* 3. HEADLINE */}
        <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="max-w-5xl mx-auto text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-8 leading-[1.1] tracking-[-0.02em] flex flex-col items-center"
        >
          <span className="whitespace-nowrap">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Thumbnails</span> and product visuals
          </span>
          <span className="whitespace-nowrap">
            built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">performance</span>.
          </span>
        </motion.h1>

        {/* 4. SUBHEADLINE */}
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12 leading-relaxed font-normal antialiased text-balance"
        >
          An all-in-one AI visual studio for <span className="text-white font-medium">creators</span> and <span className="text-white font-medium">e-commerce brands</span>.
        </motion.p>

        {/* 5. APP-LIKE CTAs */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <Link 
            href="/sign-up" 
            className="group h-12 md:h-14 px-8 w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#0f1115] rounded-lg font-semibold text-base transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-white/5 active:translate-y-0 tracking-tight"
          >
            Get started
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>
          
          {/* Secondary CTA */}
          <Link 
            href="#pricing"
            className="h-12 md:h-14 px-8 w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-white/10 text-white/70 rounded-lg font-semibold text-base hover:bg-white/5 hover:text-white transition-colors tracking-tight"
          >
            View pricing
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
