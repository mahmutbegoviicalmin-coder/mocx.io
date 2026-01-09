'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export function LiveViewers() {
  const [viewers, setViewers] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate between 35-65
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newValue = prev + change;
        return Math.min(65, Math.max(35, newValue));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Eye className="w-3 h-3 text-emerald-400" />
      <span className="text-emerald-400 font-medium">{viewers} people viewing</span>
    </div>
  );
}

