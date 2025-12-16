'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, DollarSign, Users, Zap, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const ALLOWED_EMAILS = [
  'mahmutbegoviic.almin@gmail.com',
  'dragomijatovic141@gmail.com',
  'stefanpusicic27@protonmail.com',
  'stefanpusicic27@gmail.com'
];

interface Stats {
    totalRevenue: number;
    affiliateEarnings: number;
    planCounts: {
        starter: number;
        pro: number;
        agency: number;
        free: number;
    };
}

export default function AffiliatePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase().trim();
      
      if (!userEmail || !ALLOWED_EMAILS.map(e => e.toLowerCase()).includes(userEmail)) {
        router.push('/dashboard');
        return;
      }

      const fetchStats = async () => {
        try {
            const res = await fetch('/api/affiliate/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
      };

      fetchStats();
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff5400]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-8 text-white relative">
        <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Affiliate Dashboard</h1>
                    <p className="text-white/50">Track your earnings and sales overview.</p>
                </div>
            </div>

            {/* Earnings Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-8 relative overflow-hidden"
            >
                <div className="relative z-10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-green-400 mb-2">Your Earnings (10%)</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-white tracking-tight">${stats.affiliateEarnings.toFixed(2)}</span>
                        <span className="text-xl text-white/40">USD</span>
                    </div>
                    <p className="text-white/30 text-sm mt-4">Based on total sales of ${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>

            {/* Plans Grid */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Active Plans Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[160px]"
                    >
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Starter Plan</div>
                        <div className="text-5xl font-bold text-white mb-1">{stats.planCounts.starter}</div>
                        <div className="text-xs text-white/30">Active Users</div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[160px]"
                    >
                        <div className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">Pro Plan</div>
                        <div className="text-5xl font-bold text-white mb-1">{stats.planCounts.pro}</div>
                        <div className="text-xs text-white/30">Active Users</div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[160px]"
                    >
                        <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Agency Plan</div>
                        <div className="text-5xl font-bold text-white mb-1">{stats.planCounts.agency}</div>
                        <div className="text-xs text-white/30">Active Users</div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[160px]"
                    >
                        <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Free Plan</div>
                        <div className="text-5xl font-bold text-white mb-1">{stats.planCounts.free}</div>
                        <div className="text-xs text-white/30">Active Users</div>
                    </motion.div>
                </div>
            </div>

        </div>
    </div>
  );
}

