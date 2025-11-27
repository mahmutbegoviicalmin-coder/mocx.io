'use client';

import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BillingPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch credits from our API proxy
    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/credits');
        const data = await res.json();
        if (data.data) {
          setCredits(data.data); // Assuming data.data is the integer
        }
      } catch (error) {
        console.error('Failed to fetch credits', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header / Credits Display */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card border border-border p-8 rounded-2xl">
          <div>
            <h1 className="text-3xl font-bold">Billing & Credits</h1>
            <p className="text-muted-foreground mt-1">Manage your subscription and usage.</p>
          </div>
          <div className="flex items-center gap-4 bg-muted/30 px-6 py-4 rounded-xl border border-border">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Available Credits</p>
              {loading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded mt-1" />
              ) : (
                <p className="text-3xl font-bold text-primary">{credits !== null ? credits : '0'}</p>
              )}
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all">
              Top Up
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Starter</h3>
              <div className="text-3xl font-bold mt-2">
                $29
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> 100 Credits
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> Standard Speed
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> Commercial License
              </li>
            </ul>
            <button className="w-full py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
              Upgrade
            </button>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-primary/10 to-card border border-primary rounded-2xl p-8 relative transform hover:scale-105 transition-transform duration-300 flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Pro</h3>
              <div className="text-3xl font-bold mt-2">
                $69
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Check className="w-4 h-4 text-primary" /> 300 Credits
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Check className="w-4 h-4 text-primary" /> Fast Generation
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Check className="w-4 h-4 text-primary" /> Priority Support
              </li>
            </ul>
            <button className="w-full py-2 bg-primary text-white rounded-full font-medium hover:brightness-110 transition-all shadow-lg">
              Upgrade
            </button>
          </div>

          {/* Agency */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Agency</h3>
              <div className="text-3xl font-bold mt-2">
                $199
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> 1000 Credits
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> Max Speed
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> API Access
              </li>
            </ul>
            <button className="w-full py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
              Upgrade
            </button>
          </div>
        </div>

        {/* Pay as you go */}
        <div className="bg-card border border-border rounded-2xl p-8">
           <h3 className="text-xl font-bold mb-4">Pay As You Go</h3>
           <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Need just a few more? Buy individual credits.</p>
              <div className="flex items-center gap-4">
                 <span className="font-bold text-lg">$1.00 <span className="text-sm font-normal text-muted-foreground">/ credit</span></span>
                 <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                   Buy Credits
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

