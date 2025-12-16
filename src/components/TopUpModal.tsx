'use client';

import { Zap, X } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CREDIT_PACKS } from '@/config/credits';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const { user } = useUser();
  const [selectedPackId, setSelectedPackId] = useState('pack-5');

  if (!isOpen) return null;

  const handleBuyCredits = async () => {
    const pack = CREDIT_PACKS.find(p => p.id === selectedPackId);
    if (!pack) return;

    try {
        const res = await fetch('/api/credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packId: selectedPackId })
        });
        
        const data = await res.json();
        
        if (data.url) {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.LemonSqueezy) {
               // @ts-ignore
               window.LemonSqueezy.Url.Open(data.url);
            } else {
              window.location.href = data.url;
            }
        } else {
            console.error('No URL returned', data);
            alert(data.error || 'Failed to initiate purchase');
        }
    } catch (error) {
        console.error(error);
        alert('Error purchasing credits');
    }
  };

  const selectedPack = CREDIT_PACKS.find(p => p.id === selectedPackId) || CREDIT_PACKS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">Out of Credits?</h2>
          <p className="text-white/50 text-lg">Top up now to continue creating.</p>
        </div>

        <div className="space-y-8">
          
          {/* Credit Packs */}
          <div className="grid grid-cols-3 gap-4">
            {CREDIT_PACKS.map((pack) => (
              <button
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedPackId === pack.id 
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_-10px_var(--primary)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`p-2 rounded-full mb-2 ${
                   selectedPackId === pack.id ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40 group-hover:text-white/60'
                }`}>
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <span className={`text-xl font-bold mb-0.5 ${
                  selectedPackId === pack.id ? 'text-white' : 'text-white/80'
                }`}>
                  {pack.credits}
                </span>
                <span className={`text-[10px] font-medium uppercase tracking-wider ${
                  selectedPackId === pack.id ? 'text-primary' : 'text-white/40'
                }`}>
                  Credits
                </span>
              </button>
            ))}
          </div>

          {/* Total & Action */}
          <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-between border border-white/5">
            <div>
              <p className="text-sm text-white/40 font-medium mb-1">Total Amount</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${selectedPack.price.toFixed(2)}</span>
                <span className="text-white/40">USD</span>
              </div>
            </div>
            <button 
              onClick={handleBuyCredits}
              className="bg-primary hover:brightness-110 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95"
            >
              Pay Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

