'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Settings, LogOut, Zap, Menu, X as XIcon, ShieldCheck, DollarSign, Bell, Crown, Rocket } from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { PLANS } from '@/config/plans';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';
const AFFILIATE_EMAILS = [
  'mahmutbegoviic.almin@gmail.com',
  'stefanpusicic27@gmail.com',
  'stefanpusicic27@protonmail.com'
];

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Create', href: '/dashboard' },
  { icon: CreditCard, label: 'Billing & Credits', href: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check permissions
  const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase().trim();
  const isAdmin = userEmail === ADMIN_EMAIL.toLowerCase();
  const isAffiliate = userEmail && AFFILIATE_EMAILS.some(e => e.toLowerCase() === userEmail);

  const planNameRaw = (user?.publicMetadata?.planName as string) || 'Free Plan'; 
  const subscriptionStatus = user?.publicMetadata?.subscriptionStatus as string | undefined;
  
  const planName = planNameRaw.replace(' Monthly', '').replace(' Yearly', '');
  
  // Show trial button ONLY if on Free Plan and NOT currently on trial
  const showTrial = (planName === 'Free Plan' || planName === 'Mocx') && subscriptionStatus !== 'on_trial';

  const handleStartTrial = async () => {
    try {
        const res = await fetch('/api/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variantId: PLANS.starter.monthly })
        });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        }
    } catch (e) {
        console.error(e);
    }
  };

  if (planName === 'Mocx') {
      if (credits && credits >= 300) planName = 'Pro';
      else if (credits && credits >= 50) planName = 'Starter';
      else if (credits === 0) planName = 'Free Plan';
      else planName = 'Active Plan'; 
  }
  
  const renewsAt = user?.publicMetadata?.renewsAt as string | undefined;

  useEffect(() => {
    if (user?.publicMetadata?.credits !== undefined) {
        setCredits(user.publicMetadata.credits as number);
    } else if (user) {
        setCredits(0);
    }
  }, [user?.publicMetadata?.credits, user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(Number(data.unreadCount || 0));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    // Listen for updates from other components
    const handleUpdate = () => fetchNotifications();
    window.addEventListener('notificationsUpdated', handleUpdate);

    return () => {
        clearInterval(interval);
        window.removeEventListener('notificationsUpdated', handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  let maxCredits = 100;
  if (planName === 'Free Plan') maxCredits = 0; 
  else if (planName.toLowerCase().includes('starter')) maxCredits = 50; 
  else if (planName.toLowerCase().includes('pro')) maxCredits = 200;
  else if (planName.toLowerCase().includes('agency')) maxCredits = 400;

  const progress = maxCredits > 0 && credits ? Math.min((credits / maxCredits) * 100, 100) : 0;

  // Sidebar Content Component to reuse
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
            <Link href="/dashboard" className="relative w-32 h-10 block transition-opacity hover:opacity-80">
            <Image 
                src="/logotip.png" 
                alt="Mocx Logo" 
                fill 
                className="object-contain object-left"
                priority
            />
            </Link>
            {/* Mobile Close Button */}
            <button 
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-white/50 hover:text-white p-2"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="mt-3 relative group w-fit">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
             <div className="relative flex items-center gap-1.5 px-3 py-1 bg-black/40 border border-white/10 rounded-full shadow-lg">
                <Crown className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 uppercase">
                  {planName} {subscriptionStatus === 'on_trial' && '(TRIAL)'}
                </span>
             </div>
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:scale-[1.02] active:scale-95 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70 group-hover:opacity-100'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Notifications (Bell) */}
        <Link
          href="/dashboard/notifications"
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:scale-[1.02] active:scale-95 ${
            pathname === '/dashboard/notifications'
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
          }`}
        >
          <span className="flex items-center gap-3 relative">
            <div className="relative">
              <Bell className={`w-5 h-5 ${pathname === '/dashboard/notifications' ? '' : 'opacity-70 group-hover:opacity-100'}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0F0F0F] animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="font-medium">Notifications</span>
          </span>
        </Link>

        {isAffiliate && (
            <Link
              href="/dashboard/affiliate"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:scale-[1.02] active:scale-95 ${
                pathname === '/dashboard/affiliate'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/20 shadow-lg shadow-green-500/10' 
                  : 'text-green-400/70 hover:bg-green-500/10 hover:text-green-400'
              }`}
            >
              <DollarSign className={`w-5 h-5`} />
              <span className="font-bold">Affiliate</span>
            </Link>
        )}

        {isAdmin && (
            <Link
              href="/dashboard/admin-secure"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:scale-[1.02] active:scale-95 ${
                pathname === '/dashboard/admin-secure'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10' 
                  : 'text-red-400/70 hover:bg-red-500/10 hover:text-red-400'
              }`}
            >
              <ShieldCheck className={`w-5 h-5`} />
              <span className="font-bold">Admin Panel</span>
            </Link>
        )}

        {showTrial && (
            <button
               onClick={handleStartTrial}
               className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:brightness-110 transition-all flex items-center justify-center gap-2 group animate-in fade-in zoom-in duration-500"
            >
               <Rocket className="w-4 h-4 fill-white/20 group-hover:scale-110 transition-transform" />
               Start Free Trial
            </button>
        )}
      </div>

      <div className="p-4 border-t border-border/50 space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-primary">
                   <Zap className="w-3.5 h-3.5 fill-current" />
                 </div>
                 <span className="text-xs font-bold text-white/90">Credits</span>
             </div>
             <span className="text-xs font-mono text-muted-foreground">{credits !== null ? credits : 0}/{maxCredits > 0 ? maxCredits : '-'}</span>
           </div>
           <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
               <div 
                 className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                 style={{ width: `${progress}%` }}
               />
           </div>
           
           {renewsAt && (
             <p className="text-[10px] text-center text-muted-foreground/70">
               Resets on {new Date(renewsAt).toLocaleDateString()}
             </p>
           )}
        </div>

        <SignOutButton>
          <button className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-muted-foreground hover:text-red-400 transition-all rounded-lg hover:bg-red-500/10 hover:translate-x-1 active:scale-95 cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );

  return (
    <>
        {/* Mobile Hamburger Button */}
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed top-4 left-4 z-50 lg:hidden bg-[#1A1A1A] p-2 rounded-lg border border-white/10 text-white shadow-lg"
        >
            <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Backdrop */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm animate-in fade-in"
                onClick={() => setIsOpen(false)}
            />
        )}

        {/* Sidebar Container */}
        <aside className={`
            w-72 border-r border-border bg-[#0F0F0F]/95 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none lg:w-64
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <SidebarContent />
        </aside>
    </>
  );
}
