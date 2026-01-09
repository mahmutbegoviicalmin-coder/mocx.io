'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const FAKE_SIGNUPS = [
  { name: 'James', location: 'New York', time: '2 min ago', plan: 'Pro' },
  { name: 'Sophie', location: 'London', time: '4 min ago', plan: 'Business' },
  { name: 'Marco', location: 'Berlin', time: '5 min ago', plan: 'Pro' },
  { name: 'Yuki', location: 'Tokyo', time: '7 min ago', plan: 'Pro' },
  { name: 'Ahmed', location: 'Dubai', time: '8 min ago', plan: 'Business' },
  { name: 'Emma', location: 'Sydney', time: '10 min ago', plan: 'Pro' },
  { name: 'Carlos', location: 'São Paulo', time: '12 min ago', plan: 'Pro' },
  { name: 'Priya', location: 'Mumbai', time: '15 min ago', plan: 'Business' },
  { name: 'Alex', location: 'Toronto', time: '18 min ago', plan: 'Pro' },
  { name: 'Lisa', location: 'Paris', time: '20 min ago', plan: 'Pro' },
];

export function SocialProofToast() {
  const [currentNotification, setCurrentNotification] = useState<typeof FAKE_SIGNUPS[0] | null>(null);
  const [notificationIndex, setNotificationIndex] = useState(0);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimeout = setTimeout(() => {
      setCurrentNotification(FAKE_SIGNUPS[0]);
    }, 5000);

    // Then show notifications every 15-25 seconds
    const interval = setInterval(() => {
      setNotificationIndex(prev => {
        const next = (prev + 1) % FAKE_SIGNUPS.length;
        setCurrentNotification(FAKE_SIGNUPS[next]);
        return next;
      });
    }, 15000 + Math.random() * 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (currentNotification) {
      const hideTimeout = setTimeout(() => {
        setCurrentNotification(null);
      }, 4000);
      return () => clearTimeout(hideTimeout);
    }
  }, [currentNotification]);

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 z-50 bg-[#1a1a1e] border border-white/10 rounded-xl p-4 shadow-2xl max-w-xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {currentNotification.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">{currentNotification.name}</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-white/60 text-xs mt-0.5">
                from {currentNotification.location} just signed up for <span className="text-blue-400 font-medium">{currentNotification.plan}</span>
              </p>
              <p className="text-white/40 text-[10px] mt-1">{currentNotification.time}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

