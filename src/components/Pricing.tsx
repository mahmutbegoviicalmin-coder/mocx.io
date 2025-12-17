'use client';

import { Check, ArrowRight, Crown, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { PLANS } from '@/config/plans';

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const router = useRouter();

  // LemonSqueezy Event Handling
  useEffect(() => {
    const handleLemonSqueezyEvent = (event: any) => {
        if (event.detail && event.detail.event === 'Payment.Success') {
             router.push('/dashboard');
        }
    };

    window.addEventListener('LemonSqueezy.Event', handleLemonSqueezyEvent);
    
    // @ts-ignore
    if (typeof window !== 'undefined' && window.LemonSqueezy) {
        // @ts-ignore
        window.LemonSqueezy.Setup({
            eventHandler: (event: any) => {
                if (event.event === 'Payment.Success') {
                    router.push('/dashboard');
                }
            }
        });
    }

    return () => {
        window.removeEventListener('LemonSqueezy.Event', handleLemonSqueezyEvent);
    };
  }, [router]);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#0a0a0a] text-white selection:bg-orange-500/30">
      {/* BACKGROUND AMBIENCE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#111]" />
        {/* Subtle Orange Glow center */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-600/5 blur-[120px] rounded-full opacity-40" />
        {/* Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      <div className="container max-w-7xl mx-auto relative z-10 px-4">
        
        {/* HEADER & TOGGLE */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Christmas Sale Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse">
                <Sparkles className="w-3 h-3 fill-white" />
                Christmas Sale • 35% OFF
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-white/50 font-medium max-w-xl mx-auto">
              Prices slashed for the holidays. Upgrade now and lock in the discount.
            </p>
          </motion.div>
          
          {/* Custom Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative flex items-center p-1 bg-white/5 border border-white/10 rounded-full cursor-pointer" onClick={() => setAnnual(!annual)}>
                {/* Sliding Pill */}
                <motion.div 
                    className="absolute top-1 bottom-1 bg-white/10 rounded-full shadow-sm"
                    initial={false}
                    animate={{ 
                        x: annual ? "100%" : "0%",
                    }}
                    style={{ width: "50%", left: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                
                <button 
                    onClick={(e) => { e.stopPropagation(); setAnnual(false); }}
                    className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 ${!annual ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setAnnual(true); }}
                    className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${annual ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                    Yearly
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                      Save Extra 10%
                    </span>
                </button>
            </div>
          </motion.div>
        </div>

        {/* PRICING CARDS GRID */}
        <div className="grid md:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">
          
          {/* 1. STARTER CARD */}
          <PricingCard 
            title="Starter"
            price={annual ? 17 : 19} // Monthly: 19 (was 29). Yearly: ~10% off -> 17
            originalPrice={annual ? 29 : 29}
            description="Perfect for individuals just getting started."
            features={[annual ? "600 Images/year" : "50 Images/mo", "Thumbnail Recreator", "Standard Speed", "Commercial License", "Basic Support"]}
            variantId={annual ? PLANS.starter.yearly : PLANS.starter.monthly}
            annual={annual}
          />

          {/* 2. PRO CARD (Most Popular) */}
          <PricingCard 
            title="Pro"
            price={annual ? 35 : 39} // Monthly: 39 (was 59). Yearly ~10% off -> 35
            originalPrice={annual ? 59 : 59}
            description="Best for creators growing their audience."
            features={[annual ? "2400 Images/year" : "200 Images/mo", "Thumbnail Recreator", "Fast Generation", "Priority Support", "Website Screenshot", "High Resolution", "AI Art Generator", "Mockup Studio"]}
            variantId={annual ? PLANS.pro.yearly : PLANS.pro.monthly}
            annual={annual}
            isPro={true}
          />

          {/* 3. AGENCY CARD */}
          <PricingCard 
            title="Agency"
            price={annual ? 71 : 79} // Monthly: 79 (was 119). Yearly ~10% off -> 71
            originalPrice={annual ? 119 : 119}
            description="For teams and agencies scaling up."
            features={[annual ? "4800 Images/year" : "400 Images/mo", "Thumbnail Recreator", "Max Speed", "API Access", "24/7 Support", "Custom Branding", "AI Art Generator", "Mockup Studio"]}
            variantId={annual ? PLANS.agency.yearly : PLANS.agency.monthly}
            annual={annual}
          />

        </div>
        
        {/* Enterprise */}
        <div className="mt-16 text-center">
             <p className="text-white/30 text-sm font-medium">
               Need a custom plan? <a href="mailto:support@mocx.io" className="text-white/60 hover:text-orange-400 transition-colors underline decoration-white/10 underline-offset-4">Contact sales</a>
             </p>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// INDIVIDUAL CARD COMPONENT
// ------------------------------------------------------------------

function PricingCard({ title, price, originalPrice, description, features, isPro = false, variantId, annual }: any) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/sign-up');
      return;
    }
    if (!variantId) return;

    setLoading(true);
    try {
        const res = await fetch('/api/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variantId })
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
        }
    } catch (e) {
        console.error(e);
        alert('Something went wrong.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: isPro ? 0.1 : 0 }}
      className={`relative w-full ${isPro ? 'md:-mt-8 md:mb-8 z-10' : 'z-0'}`}
    >
        {/* PRO GLOW EFFECT (Behind card) */}
        {isPro && (
             <div className="absolute inset-0 -z-10 bg-orange-500/20 blur-[60px] opacity-40 rounded-full" />
        )}

        <div 
            className={`
                relative flex flex-col h-full p-8 rounded-[2rem] transition-all duration-300 border
                ${isPro 
                    ? 'bg-[#0f1115] border-orange-500/30 shadow-2xl shadow-orange-900/20' 
                    : 'bg-[#0f1115]/60 backdrop-blur-sm border-white/5 hover:border-white/10 hover:bg-[#0f1115]/80 shadow-xl'
                }
            `}
        >
             {/* MOST POPULAR PILL */}
            {isPro && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <div className="bg-gradient-to-r from-[#FF5400] to-[#FF7B30] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-orange-400/20">
                        <Crown className="w-3 h-3 fill-white" />
                        Most Popular
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                    {title}
                </h3>
                
                {/* Price */}
                <div className="flex flex-col mb-4">
                    {/* Discount Badge / Old Price */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/30 text-lg line-through font-medium装饰">${originalPrice}</span>
                        <span className="text-orange-500 text-xs font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                            Save 35%
                        </span>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-white tracking-tight">${price}</span>
                        <span className="text-white/40 font-medium text-sm">/mo</span>
                    </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-white/60 leading-relaxed min-h-[40px] border-b border-white/5 pb-6">
                    {description}
                </p>
            </div>

            {/* CTA BUTTON */}
            <button 
                onClick={handleCheckout}
                disabled={loading}
                className={`
                    w-full h-12 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-8 group
                    ${isPro 
                        ? 'bg-gradient-to-r from-[#FF5400] to-[#FF7B30] text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]' 
                        : 'bg-white/5 border border-white/5 text-white hover:bg-white/10 hover:border-white/10 hover:scale-[1.01]'
                    }
                `}
            >
                {loading ? 'Processing...' : (
                    <>
                        Get Started
                        {isPro && <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
                    </>
                )}
            </button>

            {/* FEATURES */}
            <div className="space-y-3">
                {features.map((feature: string, i: number) => {
                    const isCrossed = feature.startsWith('~');
                    const text = isCrossed ? feature.slice(1) : feature;
                    
                    return (
                        <div key={i} className={`
                            flex items-center gap-3 p-2 rounded-lg transition-colors
                            ${isPro ? 'hover:bg-white/5' : 'hover:bg-white/5'}
                        `}>
                            {/* Checkmark */}
                            <div className={`
                                w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm
                                ${isPro 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white/10 text-white/40'
                                }
                            `}>
                                <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                            
                            {/* Text */}
                            <span className={`text-sm font-medium transition-colors ${
                                isPro ? 'text-white/90' : 'text-white/60'
                            }`}>
                                {text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    </motion.div>
  );
}