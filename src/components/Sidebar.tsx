'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Settings, LogOut, Zap } from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Create', href: '/dashboard' },
  { icon: CreditCard, label: 'Billing & Credits', href: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan'; 
  const renewsAt = user?.publicMetadata?.renewsAt as string | undefined;

  useEffect(() => {
    if (user?.publicMetadata?.credits !== undefined) {
        setCredits(user.publicMetadata.credits as number);
    } else if (user) {
        // Default to 0 if not set (cleanup testing logic)
        setCredits(0);
    }
  }, [user?.publicMetadata?.credits, user]);

  // Determine Max Credits based on plan name
  let maxCredits = 100;
  
  if (planName === 'Free Plan') maxCredits = 0; // Visual cap for free
  else if (planName.toLowerCase().includes('starter')) maxCredits = 100; 
  else if (planName.toLowerCase().includes('pro')) maxCredits = 300;
  else if (planName.toLowerCase().includes('agency')) maxCredits = 500;

  const progress = maxCredits > 0 && credits ? Math.min((credits / maxCredits) * 100, 100) : 0;

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col z-40">
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
          Mocx 
        </Link>
        {/* Plan Name Badge - Always visible as requested */}
        <div className="mt-2">
             <span className="text-[11px] uppercase tracking-widest font-bold text-white/90 bg-gradient-to-r from-primary/80 to-primary/40 px-3 py-1 rounded-full shadow-[0_0_15px_-3px_rgba(255,90,95,0.6)] border border-primary/50">
               {planName}
             </span>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
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
      </div>

      <div className="p-4 border-t border-border/50 space-y-4">
        {/* Credit Counter */}
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
           {/* Progress Bar */}
           <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
               <div 
                 className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                 style={{ width: `${progress}%` }}
               />
           </div>
           
           {/* Expiry Date */}
           {renewsAt && (
             <p className="text-[10px] text-center text-muted-foreground/70">
               Resets on {new Date(renewsAt).toLocaleDateString()}
             </p>
           )}
        </div>

        <SignOutButton>
          <button className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-muted-foreground hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
