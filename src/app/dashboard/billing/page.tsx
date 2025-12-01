'use client';

import { Check, Zap, Calendar, CreditCard, Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CREDIT_PACKS } from '@/config/credits';
import { PLANS } from '@/config/plans';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillingPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [annual, setAnnual] = useState(false);
  
  // Subscription Data
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan';
  const isFreePlan = planName === 'Free Plan';
  const [subscriptionData, setSubscriptionData] = useState<{
    renewsAt?: string;
    endsAt?: string;
    status?: string;
    customerPortalUrl?: string;
  }>({});

  const { renewsAt, endsAt, status: subscriptionStatus, customerPortalUrl } = subscriptionData; 

  // Modal State
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState('pack-5');

  const handleManageSubscription = async () => {
      if (customerPortalUrl) {
          window.open(customerPortalUrl, '_blank');
      } else {
          // Fallback or error handling
          alert("Redirecting to subscription management...");
          // You might want to redirect to a generic support page or the main store URL if no portal link
          window.open('https://mocx.lemonsqueezy.com/billing', '_blank');
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Credits
      try {
        if (user?.publicMetadata?.credits !== undefined) {
             setCredits(user.publicMetadata.credits as number);
        } else {
             setCredits(0);
        }
      } catch (error) {
        console.error('Failed to fetch credits', error);
      }

      // Fetch Subscription Data
      try {
        const res = await fetch('/api/subscription');
        if (res.ok) {
            const data = await res.json();
            setSubscriptionData(data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchData();
    }
  }, [user]);

  const handleSubscribe = (variantId: string) => {
      if (!variantId) return;
      
      let checkoutUrl = variantId;
      const hasParams = checkoutUrl.includes('?');
      const appendChar = hasParams ? '&' : '?';
      
      if (!checkoutUrl.includes('embed=1')) {
         checkoutUrl += `${appendChar}embed=1&media=0&logo=0&desc=0`;
      }

      if (user) {
         checkoutUrl += `&checkout[custom][userId]=${user.id}`;
      }

      // @ts-ignore
      if (typeof window !== 'undefined' && window.LemonSqueezy) {
         // @ts-ignore
         window.LemonSqueezy.Url.Open(checkoutUrl);
      } else {
        const a = document.createElement('a');
        a.href = checkoutUrl;
        a.target = '_blank';
        a.click();
      }
  };

  const handleBuyCredits = () => {
      const pack = CREDIT_PACKS.find(p => p.id === selectedPackId);
      if (!pack) return;

      const checkoutUrl = pack.checkoutUrl;
      const urlWithUser = user 
        ? `${checkoutUrl}&checkout[custom][userId]=${user.id}`
        : checkoutUrl;

      // @ts-ignore
      if (typeof window !== 'undefined' && window.LemonSqueezy) {
         // @ts-ignore
         window.LemonSqueezy.Url.Open(urlWithUser);
      } else {
        window.open(urlWithUser, '_blank');
      }
  };

  const selectedPack = CREDIT_PACKS.find(p => p.id === selectedPackId) || CREDIT_PACKS[0];

  // Helper to check if a plan is the current one
  const isCurrentPlan = (name: string) => {
      return planName.toLowerCase().includes(name.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-background p-8 overflow-x-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Subscription Status Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap className="w-48 h-48 text-primary rotate-12" />
                </div>

                <div className="relative z-10">
                    <h2 className="text-lg font-medium text-muted-foreground mb-1">Current Plan</h2>
                    <div className="flex items-center gap-3 mb-6">
                        <h1 className="text-4xl font-bold text-white tracking-tight">{planName}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${subscriptionStatus === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                            {subscriptionStatus || 'Active'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {renewsAt ? (
                            <span>Renews on <span className="text-white">{new Date(renewsAt).toLocaleDateString()}</span></span>
                        ) : endsAt ? (
                            <span>Ends on <span className="text-white">{new Date(endsAt).toLocaleDateString()}</span></span>
                        ) : (
                            <span>Lifetime Access</span>
                        )}
                    </div>
                </div>

                <div className="mt-8 relative z-10">
                    {!isFreePlan && (
                        <button 
                            onClick={handleManageSubscription}
                            className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            <CreditCard className="w-4 h-4" />
                            Manage Subscription
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Credits Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-gradient-to-br from-primary/10 to-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 flex flex-col justify-between"
            >
                <div>
                    <h2 className="text-lg font-medium text-muted-foreground mb-1">Available Credits</h2>
                    <div className="flex items-baseline gap-1 mb-2">
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        ) : (
                            <h1 className="text-5xl font-bold text-white tracking-tight">{credits !== null ? credits : '0'}</h1>
                        )}
                        <span className="text-muted-foreground">credits</span>
                    </div>
                    <p className="text-sm text-muted-foreground/80">
                        Use credits to generate high-quality mockups.
                    </p>
                </div>
                
                <div className="mt-8">
                    <button 
                        onClick={() => setShowBuyModal(true)}
                        className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                    >
                        Top Up Credits
                    </button>
                </div>
            </motion.div>
        </div>

        {/* Plans Section */}
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Upgrade Plan</h2>
                    <p className="text-muted-foreground mt-2">Choose a plan that scales with your needs.</p>
                </div>

                {/* Monthly/Yearly Toggle */}
                <div className="relative bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10 flex items-center cursor-pointer" onClick={() => setAnnual(!annual)}>
                    <div 
                        className={`absolute top-1 bottom-1 w-[50%] bg-primary rounded-full shadow-lg transition-all duration-300 ease-out ${annual ? 'left-[50%]' : 'left-1'}`}
                    />
                    <button 
                        className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 w-32 ${!annual ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                        onClick={(e) => { e.stopPropagation(); setAnnual(false); }}
                    >
                        Monthly
                    </button>
                    <button 
                        className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 w-32 ${annual ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                        onClick={(e) => { e.stopPropagation(); setAnnual(true); }}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <BillingPlanCard 
                    title="Starter"
                    price={annual ? 205 : 29}
                    period={annual ? "/year" : "/mo"}
                    features={[annual ? "600 Credits" : "100 Credits", "Standard Speed", "Commercial License", "Basic Support"]}
                    variantId={annual ? PLANS.starter.yearly : PLANS.starter.monthly}
                    onSubscribe={handleSubscribe}
                    current={isCurrentPlan('Starter')}
                    delay={0.1}
                />
                <BillingPlanCard 
                    title="Pro"
                    price={annual ? 420 : 69}
                    period={annual ? "/year" : "/mo"}
                    features={[annual ? "3600 Credits" : "300 Credits", "Fast Generation", "Priority Support", "High Resolution"]}
                    variantId={annual ? PLANS.pro.yearly : PLANS.pro.monthly}
                    onSubscribe={handleSubscribe}
                    current={isCurrentPlan('Pro')}
                    popular
                    delay={0.2}
                />
                <BillingPlanCard 
                    title="Agency"
                    price={annual ? 850 : 199}
                    period={annual ? "/year" : "/mo"}
                    features={[annual ? "6000 Credits" : "1000 Credits", "Max Speed", "API Access", "24/7 Support"]}
                    variantId={annual ? PLANS.agency.yearly : PLANS.agency.monthly}
                    onSubscribe={handleSubscribe}
                    current={isCurrentPlan('Agency')}
                    delay={0.3}
                />
            </div>
        </div>

        {/* Pay As You Go Banner */}
        <div className="bg-card/30 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
              <h3 className="text-xl font-bold text-white mb-2">Pay As You Go</h3>
              <p className="text-muted-foreground">Need just a few more credits? Buy individual packs without a subscription.</p>
           </div>
           <button 
             onClick={() => setShowBuyModal(true)}
             className="bg-secondary/80 hover:bg-secondary text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap"
           >
             Buy Credits Only
           </button>
        </div>

        {/* Buy Credits Modal */}
        <AnimatePresence>
        {showBuyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/10 blur-3xl -z-10" />

              <button 
                onClick={() => setShowBuyModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2 text-white">Top Up Credits</h2>
                <p className="text-white/50">Choose a package to continue creating.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {CREDIT_PACKS.map((pack) => (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPackId(pack.id)}
                      className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                        selectedPackId === pack.id 
                          ? 'bg-primary/10 border-primary shadow-[0_0_30px_-10px_var(--primary)]' 
                          : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className={`text-xl font-bold mb-1 ${
                        selectedPackId === pack.id ? 'text-white' : 'text-white/80'
                      }`}>
                        {pack.credits}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        selectedPackId === pack.id ? 'text-primary' : 'text-white/40'
                      }`}>
                        Credits
                      </span>
                    </button>
                  ))}
                </div>

                <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-between border border-white/5">
                  <div>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">${selectedPack.price}</span>
                      <span className="text-white/40">USD</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleBuyCredits}
                    className="bg-primary hover:brightness-110 text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function BillingPlanCard({ 
    title, 
    price, 
    period, 
    features, 
    variantId, 
    onSubscribe, 
    current, 
    popular,
    delay = 0 
}: { 
    title: string, 
    price: number, 
    period: string, 
    features: string[], 
    variantId: string, 
    onSubscribe: (id: string) => void,
    current?: boolean,
    popular?: boolean,
    delay?: number
}) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`relative rounded-3xl p-8 border backdrop-blur-xl flex flex-col ${
                popular 
                    ? 'bg-white/10 border-primary/50 shadow-[0_0_40px_-10px_rgba(255,90,95,0.3)] z-10' 
                    : 'bg-card/40 border-white/10 hover:border-white/20'
            } ${current ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className={`text-lg font-medium mb-2 ${popular ? 'text-primary' : 'text-muted-foreground'}`}>{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-muted-foreground">{period}</span>
                </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className={`w-4 h-4 ${popular ? 'text-primary' : 'text-white/50'}`} />
                        {feature}
                    </li>
                ))}
            </ul>

            <button 
                disabled={current}
                onClick={() => onSubscribe(variantId)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    current 
                        ? 'bg-white/5 text-white/50 cursor-default border border-white/5'
                        : popular
                            ? 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/25'
                            : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
                {current ? 'Current Plan' : 'Upgrade'}
            </button>
        </motion.div>
    );
}
