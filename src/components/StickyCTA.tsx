'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Zap } from 'lucide-react';
import Link from 'next/link';

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      if (window.scrollY > 500 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/95 to-transparent"
        >
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-4 bg-[#1a1a1e] border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    🔥 Flash Sale: 40% OFF ends soon!
                  </p>
                  <p className="text-white/40 text-xs hidden sm:block">
                    Join 50,000+ creators using Mocx today
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-up"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  <span>Claim Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

