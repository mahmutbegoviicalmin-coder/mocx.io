'use client';

import { useState, useEffect } from 'react';
import { X, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UrgencyBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-2.5 px-4"
      >
        <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
          <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span className="font-medium">
            🔥 <span className="font-bold">FLASH SALE:</span> 40% OFF all plans
          </span>
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono font-bold">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
          <span className="hidden sm:inline text-white/80">left</span>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

