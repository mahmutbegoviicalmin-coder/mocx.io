'use client';

import { Check, X, Zap, Calendar, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CREDIT_PACKS } from '@/config/credits';
import { PLANS } from '@/config/plans';
import { useUser } from '@clerk/nextjs';

export default function BillingPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [annual, setAnnual] = useState(false); // Toggle for yearly plans
  
  // Subscription Data
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan';
  const isFreePlan = planName === 'Free Plan';
  const renewsAt = user?.privateMetadata?.renewsAt as string | undefined;
  const endsAt = user?.privateMetadata?.endsAt as string | undefined;
  const subscriptionStatus = user?.privateMetadata?.status as string | undefined;
  const customerPortalUrl = user?.privateMetadata?.customer_portal_url as string; 

  // Modal State
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState('pack-5');

  // ... (rest of useEffect)

  const handleManageSubscription = async () => {
      // Ideally, we should have the customer portal URL from Lemon Squeezy stored in metadata
      // If not, we might need an API endpoint to fetch it or direct them to general support
      // For now, let's assume we can fetch a portal URL or use a generic one
      if (customerPortalUrl) {
          window.open(customerPortalUrl, '_blank');
      } else {
          alert("Please contact support to manage your subscription or check your email for the management link.");
      }
  };

    // Fetch credits from our API proxy or metadata
    const fetchCredits = async () => {
      try {
        // We prefer to use the user's metadata credits which are synced via webhook
        // The /api/credits endpoint was fetching NanoBanana credits, which is for the system, not the user
        if (user?.publicMetadata?.credits !== undefined) {
             setCredits(user.publicMetadata.credits as number);
        } else {
             setCredits(0);
        }
      } catch (error) {
        console.error('Failed to fetch credits', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchCredits();
    }
  }, [user]);

  const handleSubscribe = (variantId: string) => {
      if (!variantId) return;
      
      // Ensure URL has correct params for overlay
      let checkoutUrl = variantId;
      
      const hasParams = checkoutUrl.includes('?');
      const appendChar = hasParams ? '&' : '?';
      
      if (!checkoutUrl.includes('embed=1')) {
         checkoutUrl += `${appendChar}embed=1&media=0&logo=0&desc=0`;
      }

      // Always pass the userId
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
        a.className = "lemonsqueezy-button";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
  };

  const handleBuyCredits = () => {
      const pack = CREDIT_PACKS.find(p => p.id === selectedPackId);
      if (!pack) return;

      const checkoutUrl = pack.checkoutUrl;
      
      // Add user ID to checkout URL for webhook matching
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
            <button 
              onClick={() => setShowBuyModal(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
            >
              Top Up
            </button>
          </div>
        </div>
        
        {/* Toggle Yearly/Monthly */}
        <div className="flex justify-center">
            <div className="relative bg-muted/30 p-1 rounded-full flex items-center cursor-pointer border border-white/5" onClick={() => setAnnual(!annual)}>
              <div 
                className={`absolute top-1 bottom-1 w-[50%] bg-primary rounded-full shadow-lg transition-all duration-300 ${annual ? 'left-[50%]' : 'left-1'}`}
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

        {/* Active Plan & Subscription Management */}
        {!isFreePlan && (
            <div className="bg-card border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-32 h-32 text-primary" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-white">Current Plan: <span className="text-primary">{planName}</span></h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${subscriptionStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {subscriptionStatus || 'Active'}
                            </span>
                        </div>
                        
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            {renewsAt ? (
                                <span>Renews on {new Date(renewsAt).toLocaleDateString()}</span>
                            ) : endsAt ? (
                                <span>Access ends on {new Date(endsAt).toLocaleDateString()}</span>
                            ) : (
                                <span>Lifetime Access</span>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={handleManageSubscription}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors text-white"
                    >
                        Manage Subscription
                    </button>
                </div>
            </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Starter</h3>
              <div className="text-3xl font-bold mt-2">
                ${annual ? '205' : '29'}
                <span className="text-base font-normal text-muted-foreground">{annual ? '/year' : '/mo'}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> {annual ? '600' : '100'} Credits
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> Standard Speed
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> Commercial License
              </li>
            </ul>
            <button 
              onClick={() => handleSubscribe(annual ? PLANS.starter.yearly : PLANS.starter.monthly)}
              className="w-full py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
            >
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
                ${annual ? '420' : '69'}
                <span className="text-base font-normal text-muted-foreground">{annual ? '/year' : '/mo'}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Check className="w-4 h-4 text-primary" /> {annual ? '3600' : '300'} Credits
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Check className="w-4 h-4 text-primary" /> Fast Generation
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Check className="w-4 h-4 text-primary" /> Priority Support
              </li>
            </ul>
            <button 
              onClick={() => handleSubscribe(annual ? PLANS.pro.yearly : PLANS.pro.monthly)}
              className="w-full py-2 bg-primary text-white rounded-full font-medium hover:brightness-110 transition-all shadow-lg"
            >
              Upgrade
            </button>
          </div>

          {/* Agency */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Agency</h3>
              <div className="text-3xl font-bold mt-2">
                ${annual ? '850' : '199'}
                <span className="text-base font-normal text-muted-foreground">{annual ? '/year' : '/mo'}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> {annual ? '6000' : '1000'} Credits
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> Max Speed
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> API Access
              </li>
            </ul>
            <button 
              onClick={() => handleSubscribe(annual ? PLANS.agency.yearly : PLANS.agency.monthly)}
              className="w-full py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
            >
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
                 <span className="font-bold text-lg">Top up instantly</span>
                 <button 
                   onClick={() => setShowBuyModal(true)}
                   className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                 >
                   Buy Credits
                 </button>
              </div>
           </div>
        </div>

        {/* Buy Credits Modal */}
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              
              <button 
                onClick={() => setShowBuyModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-white">Top Up Credits</h2>
                <p className="text-white/50 text-lg">Choose a package to continue creating.</p>
              </div>

              <div className="space-y-8">
                
                {/* Credit Packs */}
                <div className="grid grid-cols-3 gap-4">
                  {CREDIT_PACKS.map((pack) => (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPackId(pack.id)}
                      className={`relative group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                        selectedPackId === pack.id 
                          ? 'bg-primary/10 border-primary shadow-[0_0_30px_-10px_var(--primary)]' 
                          : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-3 rounded-full mb-3 ${
                         selectedPackId === pack.id ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40 group-hover:text-white/60'
                      }`}>
                        <Zap className="w-6 h-6 fill-current" />
                      </div>
                      <span className={`text-2xl font-bold mb-1 ${
                        selectedPackId === pack.id ? 'text-white' : 'text-white/80'
                      }`}>
                        {pack.credits}
                      </span>
                      <span className={`text-xs font-medium uppercase tracking-wider ${
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
                      <span className="text-3xl font-bold text-white">${selectedPack.price}</span>
                      <span className="text-white/40">USD</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleBuyCredits}
                    className="bg-primary hover:brightness-110 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Pay Now
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
