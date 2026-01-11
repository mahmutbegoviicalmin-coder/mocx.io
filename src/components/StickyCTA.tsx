'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Zap, Gift, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText('STAYFOR20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Discount Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setShowPopup(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-[#131316] to-[#0C0C0E] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-8 h-8 text-blue-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  Your 20% Discount Code 🎉
                </h3>
                
                <p className="text-white/50 mb-6">
                  Use this code at checkout to get <span className="text-blue-400 font-bold">20% OFF</span> any plan!
                </p>

                <div 
                  onClick={handleCopy}
                  className="bg-white/5 border border-dashed border-white/20 rounded-xl p-4 mb-6 cursor-pointer hover:bg-white/10 transition-colors group"
                >
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Click to copy</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-2xl font-mono font-bold text-blue-400">STAYFOR20</p>
                    {copied ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors" />
                    )}
                  </div>
                  {copied && (
                    <p className="text-emerald-400 text-xs mt-2">Copied to clipboard!</p>
                  )}
                </div>

                <Link
                  href="/sign-up"
                  onClick={() => setShowPopup(false)}
                  className="w-full h-14 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  Sign Up Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky CTA Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/95 to-transparent"
          >
            <div className="container max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-3 bg-[#1a1a1e] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-xs sm:text-sm truncate">
                      🔥 Flash Sale: 20% OFF ends soon!
                    </p>
                    <p className="text-white/40 text-xs hidden sm:block">
                      Join 50,000+ creators using Mocx today
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowPopup(true)}
                    className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-xs sm:text-sm rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 whitespace-nowrap"
                  >
                    <span>Claim</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  
                  <button
                    onClick={handleDismiss}
                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
