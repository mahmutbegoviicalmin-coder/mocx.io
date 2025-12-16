'use client';

import { Check, Zap, Calendar, CreditCard, Loader2, X, Crown } from 'lucide-react';
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

  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
        const res = await fetch('/api/subscription/cancel', {
            method: 'POST',
        });
        
        const data = await res.json();
        
        if (res.ok) {
            alert('Subscription cancelled. You still have access until the end of the period.');
            window.location.reload();
        } else {
            alert(data.error || 'Failed to cancel subscription');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred');
    } finally {
        setCancelling(false);
        setShowCancelModal(false);
    }
  };

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState(CREDIT_PACKS[0]?.id || 'pack-1');
  
  const selectedPack = CREDIT_PACKS.find(p => p.id === selectedPackId) || CREDIT_PACKS[0];

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [creditsRes, subRes] = await Promise.all([
                fetch('/api/credits'),
                fetch('/api/subscription')
            ]);
            
            if (creditsRes.ok) {
                const data = await creditsRes.json();
                setCredits(data.data);
            }
            
            if (subRes.ok) {
                const data = await subRes.json();
                setSubscriptionData(data);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        fetchData();
    }
  }, [user]);

  const handleManageSubscription = () => {
    if (customerPortalUrl) {
        window.location.href = customerPortalUrl;
    } else {
        alert('Customer portal not available');
    }
  };

  const handleSubscribe = async (planUrlOrId: string) => {
      try {
          let variantId = planUrlOrId;
          
          // Extract variant ID from URL if it's a Lemon Squeezy URL
          if (planUrlOrId.includes('http')) {
              try {
                  const url = new URL(planUrlOrId);
                  const enabledParam = url.searchParams.get('enabled');
                  if (enabledParam) {
                      variantId = enabledParam;
                  }
              } catch (e) {
                  console.error('Failed to parse plan URL', e);
              }
          }

          const res = await fetch('/api/subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ variantId })
          });
          
          const data = await res.json();
          if (data.url) {
              window.location.href = data.url;
          } else {
              alert(data.error || 'Failed to start subscription');
          }
      } catch (error) {
          console.error(error);
          alert('Error starting subscription');
      }
  };

  const handleBuyCredits = async () => {
      try {
          const res = await fetch('/api/credits', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ packId: selectedPackId })
          });
          
          const data = await res.json();
          if (data.url) {
              window.location.href = data.url;
          } else {
              alert('Failed to initiate purchase');
          }
      } catch (error) {
          console.error(error);
          alert('Error purchasing credits');
      }
  };

  const isCurrentPlan = (plan: string) => {
      return planName === plan;
  };

  return (
    <div className="min-h-screen bg-background p-8 overflow-x-hidden relative">
      {/* ... existing background elements ... */}
      
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Subscription Status Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all duration-500 shadow-2xl shadow-black/20"
            >
                {/* ... existing status card content ... */}
                <div className="relative z-10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Current Plan</h2>
                    <div className="flex items-center gap-4 mb-8">
                        <h1 className="text-5xl font-bold text-white tracking-tight">{planName}</h1>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg ${
                            subscriptionStatus === 'active' 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-green-900/20' 
                                : subscriptionStatus === 'on_trial'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-900/20'
                                    : subscriptionStatus === 'cancelled' 
                                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                            {subscriptionStatus === 'on_trial' ? 'Trial Active' : (subscriptionStatus || 'Active')}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-black/20 w-fit px-4 py-2 rounded-full border border-white/5">
                        <Calendar className="w-4 h-4" />
                        {subscriptionStatus === 'on_trial' && renewsAt ? (
                             <span>Trial ends on <span className="text-white font-medium">{new Date(renewsAt).toLocaleDateString()}</span></span>
                        ) : renewsAt && subscriptionStatus !== 'cancelled' ? (
                            <span>Renews on <span className="text-white font-medium">{new Date(renewsAt).toLocaleDateString()}</span></span>
                        ) : endsAt ? (
                            <span>Access until <span className="text-white font-medium">{new Date(endsAt).toLocaleDateString()}</span></span>
                        ) : (
                            <span>Lifetime Access</span>
                        )}
                    </div>
                </div>

                {!isFreePlan && subscriptionStatus === 'active' && (
                    <div className="mt-8 relative z-20 flex gap-4">
                        {customerPortalUrl && (
                            <button 
                                onClick={handleManageSubscription}
                                className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors hover:underline underline-offset-4 decoration-primary/50 cursor-pointer relative z-20"
                            >
                                <CreditCard className="w-4 h-4" />
                                Manage Billing
                            </button>
                        )}
                        <button 
                            onClick={() => setShowCancelModal(true)}
                            className="flex items-center gap-2 text-sm font-medium text-red-400/70 hover:text-red-400 transition-colors hover:underline underline-offset-4 decoration-red-500/50 cursor-pointer relative z-20"
                        >
                            <X className="w-4 h-4" />
                            Cancel Subscription
                        </button>
                    </div>
                )}
            </motion.div>

            {/* ... Credits Card ... */}
            {/* Credits Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-gradient-to-br from-primary/10 to-background backdrop-blur-xl border border-primary/20 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_0_40px_-10px_rgba(255,84,0,0.15)]"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                
                <div className="relative z-10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4">Available Credits</h2>
                    <div className="flex items-baseline gap-2 mb-2">
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        ) : (
                            <h1 className="text-6xl font-bold text-white tracking-tighter">{credits !== null ? credits : '0'}</h1>
                        )}
                        <span className="text-lg text-white/40 font-medium">credits</span>
                    </div>
                    <p className="text-sm text-white/50 max-w-xs leading-relaxed">
                        Use credits to generate high-quality mockups instantly.
                    </p>
                </div>
                
                <div className="mt-8 relative z-10">
                    <button 
                        onClick={() => setShowBuyModal(true)}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                        Top Up Credits
                    </button>
                </div>
            </motion.div>
        </div>

        {/* Cancel Modal */}
        <AnimatePresence>
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-md p-6 relative"
                    >
                        <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription?</h3>
                        <p className="text-white/60 mb-6">Are you sure? You will lose access to premium features at the end of your billing period.</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5"
                            >
                                Keep Plan
                            </button>
                            <button 
                                onClick={handleCancelSubscription}
                                disabled={cancelling}
                                className="px-4 py-2 rounded-xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center gap-2"
                            >
                                {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                                Confirm Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Plans Section */}
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Upgrade Plan</h2>
                    <p className="text-muted-foreground text-lg">Choose a plan that scales with your creative needs.</p>
                </div>

                {/* Enhanced Monthly/Yearly Toggle */}
                <div className="relative bg-black/40 p-1.5 rounded-full backdrop-blur-xl border border-white/10 flex items-center cursor-pointer shadow-2xl w-fit" onClick={() => setAnnual(!annual)}>
                    <motion.div 
                        className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg shadow-amber-900/20 z-0"
                        layout
                        initial={false}
                        animate={{ 
                            left: annual ? "50%" : "6px",
                            right: annual ? "6px" : "50%",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <button 
                        className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 w-36 ${!annual ? 'text-white' : 'text-white/50 hover:text-white'}`}
                        onClick={(e) => { e.stopPropagation(); setAnnual(false); }}
                    >
                        Monthly
                    </button>
                    <button 
                        className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 w-36 ${annual ? 'text-white' : 'text-white/50 hover:text-white'}`}
                        onClick={(e) => { e.stopPropagation(); setAnnual(true); }}
                    >
                        Yearly <span className="absolute -top-3 -right-2 bg-gradient-to-r from-green-400 to-emerald-600 text-black text-[9px] px-2 py-0.5 rounded-full font-black shadow-lg tracking-wide border border-white/20">-10%</span>
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <BillingPlanCard 
                    title="Starter"
                    price={annual ? 205 : 19}
                    period={annual ? "/year" : "/mo"}
                    features={[annual ? "600 Credits" : "50 Credits", "AI Thumbnail Recreator", "Standard Speed", "Commercial License", "Basic Support", "~AI Art Generator", "~Mockup Studio"]}
                    variantId={annual ? PLANS.starter.yearly : PLANS.starter.monthly}
                    onSubscribe={(id) => {
                        if (isCurrentPlan('Starter') && subscriptionStatus === 'on_trial') {
                            if (customerPortalUrl) window.location.href = customerPortalUrl;
                            else alert('Billing portal not available');
                        } else {
                            handleSubscribe(id);
                        }
                    }}
                    current={isCurrentPlan('Starter')}
                    isTrial={isCurrentPlan('Starter') && subscriptionStatus === 'on_trial'}
                    delay={0.1}
                />
                <BillingPlanCard 
                    title="Pro"
                    price={annual ? 420 : 39}
                    period={annual ? "/year" : "/mo"}
                    features={[annual ? "2400 Credits" : "200 Credits", "AI Thumbnail Recreator", "Fast Generation", "High Res Downloads", "Priority Support", "AI Art Generator", "Mockup Studio"]}
                    variantId={annual ? PLANS.pro.yearly : PLANS.pro.monthly}
                    onSubscribe={handleSubscribe}
                    current={isCurrentPlan('Pro')}
                    popular
                    delay={0.2}
                />
                <BillingPlanCard 
                    title="Agency"
                    price={annual ? 850 : 79}
                    period={annual ? "/year" : "/mo"}
                    features={[annual ? "4800 Credits" : "400 Credits", "AI Thumbnail Recreator", "Max Speed (Queue Skip)", "API Access", "Dedicated 24/7 Support", "AI Art Generator", "Mockup Studio"]}
                    variantId={annual ? PLANS.agency.yearly : PLANS.agency.monthly}
                    onSubscribe={handleSubscribe}
                    current={isCurrentPlan('Agency')}
                    delay={0.3}
                />
            </div>
        </div>

        {/* Buy Credits Modal */}
        <AnimatePresence>
        {showBuyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#0f0f11] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl shadow-black/50 relative overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-primary/10 blur-3xl -z-10" />

              <button 
                onClick={() => setShowBuyModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold mb-3 text-white">Top Up Credits</h2>
                <p className="text-white/50">Need more juice? Choose a pack.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {CREDIT_PACKS.map((pack) => (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPackId(pack.id)}
                      className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedPackId === pack.id 
                          ? 'bg-primary/10 border-primary shadow-[0_0_30px_-10px_var(--primary)] scale-105 z-10' 
                          : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className={`text-2xl font-bold mb-1 ${
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
                      <span className="text-4xl font-bold text-white tracking-tight">${selectedPack.price}</span>
                      <span className="text-white/40 font-medium">USD</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleBuyCredits}
                    className="bg-primary hover:brightness-110 text-white px-10 py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95"
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
    isTrial,
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
    isTrial?: boolean,
    popular?: boolean,
    delay?: number
}) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            className={`relative rounded-[2rem] p-8 flex flex-col h-full transition-all duration-500 group ${
                popular 
                    ? 'bg-[#0F0F0F] border border-amber-500/40 shadow-[0_0_60px_-20px_rgba(245,158,11,0.25)] z-10 scale-105' 
                    : 'bg-[#0A0A0A] border border-white/5 hover:border-white/10 hover:bg-[#0F0F0F] shadow-xl'
            } backdrop-blur-2xl`}
        >
            {/* Glow Effect for Popular Plan */}
            {popular && (
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-50 pointer-events-none" />
            )}

            {popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative group cursor-default">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                        <div className="relative flex items-center gap-2 px-4 py-1.5 bg-[#0F0F0F] border border-amber-500/30 rounded-full shadow-xl">
                            <Crown className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" fill="currentColor" fillOpacity={0.2} />
                            <span className="text-[10px] font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 uppercase whitespace-nowrap">
                                Best Value
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8 relative z-10">
                <h3 className={`text-sm font-bold mb-3 tracking-widest uppercase ${popular ? 'text-amber-400' : 'text-white/40'}`}>{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white tracking-tighter">${price}</span>
                    <span className="text-white/40 font-medium text-lg">{period}</span>
                </div>
            </div>

            <div className={`w-full h-px mb-8 ${popular ? 'bg-gradient-to-r from-transparent via-amber-500/30 to-transparent' : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'}`} />

            <ul className="space-y-5 mb-10 flex-1 relative z-10">
                {features.map((feature, idx) => {
                    const isCrossed = feature.startsWith('~');
                    const text = isCrossed ? feature.slice(1) : feature;
                    
                    return (
                        <li key={idx} className={`flex items-start gap-3 text-sm transition-colors duration-300 ${isCrossed ? 'text-white/20' : 'text-white/70 group-hover:text-white'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${popular && !isCrossed ? 'bg-amber-500/20 text-amber-400 shadow-[0_0_10px_-2px_rgba(245,158,11,0.4)]' : isCrossed ? 'bg-white/5 text-white/20' : 'bg-white/10 text-white/40'}`}>
                                {isCrossed ? <X className="w-3 h-3 stroke-[3]" /> : <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={`font-medium leading-relaxed ${isCrossed ? 'line-through decoration-white/20 decoration-2' : ''}`}>{text}</span>
                        </li>
                    );
                })}
            </ul>

            <button 
                disabled={current && !isTrial}
                onClick={() => onSubscribe(variantId)}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all relative overflow-hidden group/btn shadow-xl z-20 ${
                    current && !isTrial
                        ? 'bg-emerald-500/10 text-emerald-400 cursor-default border border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]'
                        : isTrial && current
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-purple-500/30 hover:shadow-purple-500/50 cursor-pointer'
                            : popular
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:brightness-110 shadow-amber-900/30 hover:shadow-amber-900/50 hover:scale-[1.02] active:scale-[0.98] border border-amber-500/20 cursor-pointer'
                                : 'bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] border border-white/10 cursor-pointer'
                }`}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {current && !isTrial ? (
                        <>
                            <Check className="w-4 h-4" strokeWidth={3} />
                            Active Plan
                        </>
                    ) : isTrial && current ? (
                        <>
                            Pay Now to Unlock
                            <Zap className="w-4 h-4 text-yellow-300 fill-current" />
                        </>
                    ) : (
                        <>
                            Upgrade Now
                            <Zap className={`w-4 h-4 ${popular ? 'fill-white/50 text-white' : 'text-white/50'}`} />
                        </>
                    )}
                </span>
                {(!current || isTrial) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                )}
            </button>
        </motion.div>
    );
}
