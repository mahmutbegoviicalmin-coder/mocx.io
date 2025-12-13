'use client';

import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { PLANS } from '@/config/plans';

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Listen for Lemon Squeezy events
    const handleLemonSqueezyEvent = (event: any) => {
        // Check for the specific Payment.Success event in the detail
        if (event.detail && event.detail.event === 'Payment.Success') {
             // Redirect to dashboard after successful payment
             router.push('/dashboard');
        }
    };

    // The standard event name dispatched on window is 'LemonSqueezy.Event'
    window.addEventListener('LemonSqueezy.Event', handleLemonSqueezyEvent);
    
    // Fallback: Setup the event handler if the object exists (sometimes needed for overlay)
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
    <section id="pricing" className="py-32 px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 pb-2"
          >
            Find Your Perfect Plan
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Choose the plan that fits your creative needs. Cancel anytime.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center mt-8"
          >
            <div className="relative bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10 flex items-center cursor-pointer" onClick={() => setAnnual(!annual)}>
              <motion.div 
                className="absolute top-1 bottom-1 bg-primary rounded-full shadow-lg z-0"
                initial={false}
                animate={{ 
                  left: annual ? "50%" : "4px",
                  right: annual ? "4px" : "50%",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <button 
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${!annual ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                onClick={(e) => { e.stopPropagation(); setAnnual(false); }}
              >
                Monthly
              </button>
              <button 
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${annual ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                onClick={(e) => { e.stopPropagation(); setAnnual(true); }}
              >
                Yearly <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full ml-1 text-white/80">-10%</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          <PricingCard 
            title="Starter"
            price={annual ? 205 : 19}
            originalPrice={annual ? 307 : 29}
            period={annual ? "/year" : "/mo"}
            features={[annual ? "600 Images/year" : "50 Images/mo", "Standard Speed", "Commercial License", "Basic Support"]}
            delay={0.1}
            variantId={annual ? PLANS.starter.yearly : PLANS.starter.monthly}
          />

          <PricingCard 
            title="Pro"
            price={annual ? 420 : 39}
            originalPrice={annual ? 630 : 59}
            period={annual ? "/year" : "/mo"}
            features={[annual ? "2400 Images/year" : "200 Images/mo", "Fast Generation", "Priority Support", "Website Screenshot", "High Resolution"]}
            highlighted
            delay={0.2}
            variantId={annual ? PLANS.pro.yearly : PLANS.pro.monthly}
          />

          <PricingCard 
            title="Agency"
            price={annual ? 850 : 79}
            originalPrice={annual ? 1275 : 119}
            period={annual ? "/year" : "/mo"}
            features={[annual ? "4800 Images/year" : "400 Images/mo", "Max Speed", "API Access", "24/7 Support", "Custom Branding"]}
            delay={0.3}
            variantId={annual ? PLANS.agency.yearly : PLANS.agency.monthly}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center border-t border-white/10 pt-8 max-w-2xl mx-auto"
        >
           <p className="text-muted-foreground">
             Just need a few? <span className="text-white font-medium">Pay as you go</span> available at $0.50 per image.
           </p>
        </motion.div>
      </div>
    </section>
  );
}

function PricingCard({ title, price, originalPrice, period = "/mo", features, highlighted = false, delay = 0, variantId }: { title: string, price: number, originalPrice?: number, period?: string, features: string[], highlighted?: boolean, delay?: number, variantId: string }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push('/sign-up');
      return;
    }

    if (!variantId) {
      console.error("Checkout URL missing. Please check environment variables.");
      alert("Checkout configuration error. Please try again later.");
      return;
    }

    // Ensure URL has correct params for overlay
    let checkoutUrl = variantId;
    
    const hasParams = checkoutUrl.includes('?');
    const appendChar = hasParams ? '&' : '?';
    
    if (!checkoutUrl.includes('embed=1')) {
       checkoutUrl += `${appendChar}embed=1&media=0&logo=0&desc=0`;
    }

    // Always pass the userId since we now require auth
       checkoutUrl += `&checkout[custom][userId]=${user.id}`;

    // @ts-ignore
    if (typeof window !== 'undefined' && window.LemonSqueezy) {
       // @ts-ignore
       window.LemonSqueezy.Url.Open(checkoutUrl);
    } else {
      // Fallback if script isn't loaded yet
      const a = document.createElement('a');
      a.href = checkoutUrl;
      a.className = "lemonsqueezy-button";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: highlighted ? -12 : -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`relative rounded-[2rem] p-8 lg:p-10 transition-all duration-300 group flex flex-col h-full ${
        highlighted 
          ? 'bg-gradient-to-b from-[#1a1a1a] to-black border border-white/10 shadow-2xl shadow-primary/10 z-20 scale-100 lg:scale-110' 
          : 'bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 hover:border-white/10 hover:bg-[#0A0A0A]/80'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      )}
      
      {highlighted && (
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-primary/20 z-20 whitespace-nowrap"
        >
          Most Popular
        </motion.div>
      )}

      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${highlighted ? 'bg-primary/5' : 'bg-white/5'}`} />

      <div className="mb-8 relative z-10 flex flex-col items-start w-full">
        <div className="flex items-center justify-between w-full mb-6">
            <h3 className={`text-lg font-medium ${highlighted ? 'text-white' : 'text-white/70'}`}>{title}</h3>
            
            <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                highlighted 
                ? 'bg-primary/20 text-primary border border-primary/20' 
                : 'bg-white/5 text-white/50 border border-white/5'
            }`}>
                {highlighted && <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
                Save 34%
            </div>
        </div>

        <div className="flex flex-col items-start gap-1">
            {originalPrice && (
              <span className="text-sm text-white/30 line-through decoration-white/30 decoration-1 font-medium ml-1">
                  ${originalPrice} {period}
              </span>
            )}
            
        <div className="flex items-baseline gap-1">
                <span className={`font-bold text-white tracking-tighter ${highlighted ? 'text-5xl lg:text-6xl' : 'text-4xl lg:text-5xl'}`}>
            <AnimatePresence mode="wait">
              <motion.span
                key={price}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                ${price}
              </motion.span>
            </AnimatePresence>
          </span>
                <span className="text-white/40 font-medium text-sm">{period}</span>
            </div>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

      <ul className="space-y-5 mb-10 flex-1 relative z-10">
        {features.map((feature, idx) => (
          <motion.li 
            key={idx} 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (idx * 0.1) }}
            className="flex items-center gap-3 text-sm"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlighted ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/10 text-white/70'}`}>
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            <span className={`${highlighted ? 'text-white' : 'text-white/60'}`}>{feature}</span>
          </motion.li>
        ))}
      </ul>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCheckout}
        className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-300 relative z-10 cursor-pointer ${
          highlighted 
            ? 'bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5' 
            : 'bg-white/5 text-white hover:bg-white/10 border border-white/5 hover:border-white/10'
        }`}
      >
        Get {title}
      </motion.button>
    </motion.div>
  );
}
