'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, CreditCard } from 'lucide-react';

export function FreeTrialCTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden backdrop-blur-sm group">
            {/* Background Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 space-y-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 fill-current" />
                    Limited Time Offer
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                    Ready to Create? <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Get Started</span>
                </h2>
                
                <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed text-balance">
                    Join thousands of creators using Mocx. <br className="hidden md:block" />
                    Create high-quality thumbnails and mockups instantly.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                    <Link 
                        href="/sign-up" 
                        className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-amber-900/30 hover:shadow-amber-900/50 hover:scale-105 transition-all flex items-center gap-3"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-2 text-white/40 pt-2">
                    <CreditCard className="w-4 h-4" />
                    <p className="text-sm font-medium">
                        7-day money-back guarantee
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}

