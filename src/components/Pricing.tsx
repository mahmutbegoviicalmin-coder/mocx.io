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
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden bg-[#0C0C0E]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-500/[0.06] blur-[150px] rounded-full" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Simple Pricing
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-white">
              <span className="font-medium">Choose your </span>
              <span className="font-serif italic text-blue-400">plan</span>
            </h2>
            <p className="text-lg text-white/50 font-medium max-w-xl mx-auto">
              Professional visuals for creators and brands. No hidden fees, cancel anytime.
            </p>
          </motion.div>
          
          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative flex items-center p-1 bg-white/[0.02] border border-white/[0.06] rounded-full">
              <motion.div 
                className="absolute top-1 bottom-1 bg-white/[0.06] rounded-full border border-white/[0.04]"
                initial={false}
                animate={{ x: annual ? "100%" : "0%" }}
                style={{ width: "50%", left: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
              
              <button 
                onClick={() => setAnnual(false)}
                className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 w-28 text-center ${!annual ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setAnnual(true)}
                className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 w-28 text-center ${annual ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Yearly
              </button>
              
                <div className="absolute -top-3 -right-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                Save 10%
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          
          {/* Starter */}
          <PricingCard 
            title="Starter"
            price={19}
            yearlyPrice={205}
            originalPrice={annual ? 315 : 29}
            description="Perfect for individuals getting started."
            features={[annual ? "600 Credits/year" : "50 Credits/mo", "Thumbnail Maker", "AI Art Generator", "Mockup Studio", "Standard Speed", "Commercial License"]}
            variantId={annual ? PLANS.starter.yearly : PLANS.starter.monthly}
            annual={annual}
          />

          {/* Pro */}
          <PricingCard 
            title="Pro"
            price={39}
            yearlyPrice={420}
            originalPrice={annual ? 646 : 59}
            description="Best for creators growing their audience."
            features={[annual ? "2400 Credits/year" : "200 Credits/mo", "All Starter features", "Fast Generation", "Priority Support", "4K Resolution", "Face Enhancement"]}
            variantId={annual ? PLANS.pro.yearly : PLANS.pro.monthly}
            annual={annual}
            isPro={true}
          />

          {/* Agency */}
          <PricingCard 
            title="Agency"
            price={79}
            yearlyPrice={850}
            originalPrice={annual ? 1307 : 119}
            description="For teams and agencies scaling up."
            features={[annual ? "4800 Credits/year" : "400 Credits/mo", "All Pro features", "Max Speed", "API Access", "24/7 Support", "Custom Branding"]}
            variantId={annual ? PLANS.agency.yearly : PLANS.agency.monthly}
            annual={annual}
          />

        </div>
        
        {/* Enterprise */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm font-medium">
            Need a custom plan? <a href="mailto:support@mocx.io" className="text-white/60 hover:text-blue-400 transition-colors underline decoration-white/20 underline-offset-4">Contact sales</a>
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ title, price, originalPrice, yearlyPrice, description, features, isPro = false, variantId, annual }: any) {
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
      className={`relative w-full ${isPro ? 'md:-mt-4 md:mb-4 z-10' : 'z-0'}`}
    >
        {/* Pro Glow */}
        {isPro && (
          <div className="absolute inset-0 -z-10 bg-blue-500/20 blur-[60px] opacity-50 rounded-full" />
        )}

        <div 
            className={`
                relative flex flex-col h-full p-8 rounded-3xl transition-all duration-300 border
                ${isPro 
                    ? 'bg-gradient-to-b from-blue-500/10 to-transparent border-blue-500/30 shadow-2xl shadow-blue-900/20' 
                    : 'bg-[#0A0A0D] border-white/10 hover:border-white/20 shadow-xl'
                }
            `}
        >
            {/* Most Popular Badge */}
            {isPro && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                        <Crown className="w-3 h-3" />
                        Most Popular
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
                    {title}
                </h3>
                
                {/* Price */}
                <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/30 text-lg line-through">${originalPrice}</span>
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                            Save 35%
                        </span>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-white tracking-tight">${annual ? yearlyPrice : price}</span>
                        <span className="text-white/40 font-medium text-sm">/{annual ? 'year' : 'mo'}</span>
                    </div>
                    
                    {annual && (
                        <p className="text-xs text-white/40 font-medium mt-1">
                            ${(yearlyPrice / 12).toFixed(0)}/mo equivalent
                        </p>
                    )}
                </div>
                
                <p className="text-sm text-white/50 leading-relaxed border-b border-white/5 pb-6">
                    {description}
                </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8 flex-grow">
                {features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isPro ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50'
                        }`}>
                            <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className={`text-sm font-medium ${isPro ? 'text-white/90' : 'text-white/60'}`}>
                            {feature}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <button 
                onClick={handleCheckout}
                disabled={loading}
                className={`
                    w-full h-12 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto group
                    ${isPro 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]' 
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
                    }
                `}
            >
                {loading ? 'Processing...' : (
                    <>
                        Get Started
                        {isPro && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                    </>
                )}
            </button>
        </div>
    </motion.div>
  );
}
