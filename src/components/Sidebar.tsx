'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Settings, LogOut, PlusCircle } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Create', href: '/dashboard' },
  { icon: CreditCard, label: 'Billing & Credits', href: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col z-40">
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
          Mocx <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">Beta</span>
        </Link>
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
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-4">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
               <PlusCircle className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-bold text-foreground">Free Plan</p>
               <p className="text-[10px] text-muted-foreground">Upgrade for more</p>
             </div>
           </div>
           <Link href="/dashboard/billing" className="block w-full py-2 text-center bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:brightness-110 transition-all">
             Get Credits
           </Link>
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

