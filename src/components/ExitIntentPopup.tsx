'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only trigger when cursor is within 5px of the top edge AND moving upward fast
      if (e.clientY <= 5 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Double check - also trigger on actual leave if near top
      if (e.clientY <= 10 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={() => setIsVisible(false)}
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
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-blue-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              Wait! Don't leave empty-handed 🎁
            </h3>
            
            <p className="text-white/50 mb-6">
              Get an <span className="text-blue-400 font-bold">extra 20% OFF</span> on top of our flash sale. 
              This offer expires when you close this page.
            </p>

            <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-4 mb-6">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Your exclusive code</p>
              <p className="text-2xl font-mono font-bold text-blue-400">STAYFOR20</p>
            </div>

            <Link
              href="/sign-up"
              onClick={() => setIsVisible(false)}
              className="w-full h-14 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Claim My Discount
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsVisible(false)}
              className="mt-4 text-white/30 text-sm hover:text-white/50 transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

