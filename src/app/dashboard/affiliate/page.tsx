'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, DollarSign, Users, Zap, LayoutDashboard, Wallet, Building2, CreditCard, Banknote, X, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALLOWED_EMAILS = [
  'mahmutbegoviic.almin@gmail.com',
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

interface PayoutRequest {
    id: number;
    amount: string;
    status: string;
    created_at: string;
    method: string;
}

export default function AffiliatePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<PayoutRequest[]>([]);

  // Check payout day
  const isPayoutDay = new Date().getDate() === 1;

  // Payout Modal State
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'western' | 'paypal' | 'bank'>('western');
  const [payoutDetails, setPayoutDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    accountNumber: '',
    paypalEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase().trim();
      
      if (!userEmail || !ALLOWED_EMAILS.map(e => e.toLowerCase()).includes(userEmail)) {
        router.push('/dashboard');
        return;
      }

      const fetchStats = async () => {
        try {
            const [statsRes, historyRes] = await Promise.all([
                fetch('/api/affiliate/stats'),
                fetch('/api/affiliate/payout/history')
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }
            if (historyRes.ok) {
                setHistory(await historyRes.json());
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

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/affiliate/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: stats?.affiliateEarnings.toFixed(2),
          method: payoutMethod,
          details: payoutDetails
        })
      });

      if (res.ok) {
        setShowPayoutModal(false);
        setPayoutDetails({
            fullName: '',
            address: '',
            city: '',
            country: '',
            phone: '',
            accountNumber: '',
            paypalEmail: ''
        });
        alert('Payout request sent successfully! We will review it shortly.');
        // Refresh history
        const hRes = await fetch('/api/affiliate/payout/history');
        if (hRes.ok) setHistory(await hRes.json());
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to send payout request.');
      }
    } catch (error) {
      console.error(error);
      alert('Error sending payout request.');
    } finally {
      setSubmitting(false);
    }
  };

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
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-green-400 mb-2">Your Earnings (15%)</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-bold text-white tracking-tight">${stats.affiliateEarnings.toFixed(2)}</span>
                            <span className="text-xl text-white/40">USD</span>
                        </div>
                        {/* <p className="text-white/30 text-sm mt-4">Based on total sales of ${stats.totalRevenue.toFixed(2)}</p> */}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <button 
                            onClick={() => {
                                if (!isPayoutDay) {
                                    alert('Payout requests are only available on the 1st of each month.');
                                    return;
                                }
                                setShowPayoutModal(true);
                            }}
                            className={`px-6 py-3 bg-green-500 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2 ${
                                isPayoutDay 
                                ? 'hover:bg-green-600 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] cursor-pointer' 
                                : 'opacity-50 cursor-not-allowed hover:bg-green-500 hover:shadow-none'
                            }`}
                        >
                            <Wallet className="w-5 h-5" />
                            Request Payout
                        </button>
                        {!isPayoutDay && (
                            <span className="text-xs text-white/40 font-medium">Next payout: 1st of next month</span>
                        )}
                    </div>
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
                        className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[160px]"
                    >
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Agency Plan</div>
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

            {/* Payout History */}
            {history.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-white/50" />
                        Payout History
                    </h3>
                    <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto pb-2">
                            <table className="w-full text-left text-sm min-w-[600px]">
                                <thead className="bg-white/5 text-white/50 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Method</th>
                                        <th className="p-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white/70">{new Date(item.created_at).toLocaleDateString()}</td>
                                            <td className="p-4 font-bold text-white">${parseFloat(item.amount).toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className="uppercase text-xs font-bold bg-white/5 px-2 py-1 rounded text-white/50">
                                                    {item.method}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    item.status === 'paid' ? 'bg-green-500/10 text-green-500' : 
                                                    item.status === 'declined' ? 'bg-red-500/10 text-red-500' : 
                                                    'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                    {item.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                                                    {item.status === 'declined' && <XCircle className="w-3 h-3" />}
                                                    {item.status === 'pending' && <Clock className="w-3 h-3" />}
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Payout Modal */}
            <AnimatePresence>
                {showPayoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#1a1a1a] z-10">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-green-500" />
                                    Request Payout
                                </h2>
                                <button onClick={() => setShowPayoutModal(false)} className="text-white/50 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Info Box */}
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                                    <span className="text-sm text-green-400 font-medium">Available for Payout</span>
                                    <span className="text-xl font-bold text-white">${stats.affiliateEarnings.toFixed(2)}</span>
                                </div>

                                {/* Method Selection */}
                                <div className="space-y-3">
                                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Select Payout Method</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <button 
                                            onClick={() => setPayoutMethod('western')}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${payoutMethod === 'western' ? 'bg-yellow-500/10 border-yellow-500 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                                        >
                                            <Building2 className={`w-6 h-6 ${payoutMethod === 'western' ? 'text-yellow-500' : ''}`} />
                                            <span className="text-sm font-medium">Western Union</span>
                                        </button>
                                        <button 
                                            onClick={() => setPayoutMethod('paypal')}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${payoutMethod === 'paypal' ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                                        >
                                            <CreditCard className={`w-6 h-6 ${payoutMethod === 'paypal' ? 'text-blue-500' : ''}`} />
                                            <span className="text-sm font-medium">PayPal</span>
                                        </button>
                                        <button 
                                            onClick={() => setPayoutMethod('bank')}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${payoutMethod === 'bank' ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                                        >
                                            <Banknote className={`w-6 h-6 ${payoutMethod === 'bank' ? 'text-blue-500' : ''}`} />
                                            <span className="text-sm font-medium">Bank Transfer</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Form */}
                                <form onSubmit={handlePayout} className="space-y-4">
                                    {payoutMethod === 'western' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/50">Full Name</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        value={payoutDetails.fullName}
                                                        onChange={(e) => setPayoutDetails({...payoutDetails, fullName: e.target.value})}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/50">Country</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        value={payoutDetails.country}
                                                        onChange={(e) => setPayoutDetails({...payoutDetails, country: e.target.value})}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/50">City</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        value={payoutDetails.city}
                                                        onChange={(e) => setPayoutDetails({...payoutDetails, city: e.target.value})}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/50">Phone Number</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        placeholder="+1 ..."
                                                        value={payoutDetails.phone}
                                                        onChange={(e) => setPayoutDetails({...payoutDetails, phone: e.target.value})}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {payoutMethod === 'paypal' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-white/50">PayPal Email</label>
                                            <input 
                                                required
                                                type="email" 
                                                value={payoutDetails.paypalEmail}
                                                onChange={(e) => setPayoutDetails({...payoutDetails, paypalEmail: e.target.value})}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    )}

                                    {payoutMethod === 'bank' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/50">Full Name (Ime i Prezime)</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        value={payoutDetails.fullName}
                                                        onChange={(e) => setPayoutDetails({...payoutDetails, fullName: e.target.value})}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/50">Phone Number (Broj Telefona)</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        value={payoutDetails.phone}
                                                        onChange={(e) => setPayoutDetails({...payoutDetails, phone: e.target.value})}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/50">Address (Adresa)</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    value={payoutDetails.address}
                                                    onChange={(e) => setPayoutDetails({...payoutDetails, address: e.target.value})}
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/50">City (Grad)</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        value={payoutDetails.city}
                                                        onChange={(e) => setPayoutDetails({...payoutDetails, city: e.target.value})}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/50">Country (Država)</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        value={payoutDetails.country}
                                                        onChange={(e) => setPayoutDetails({...payoutDetails, country: e.target.value})}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2">
                                                <label className="text-xs font-medium text-white/50">Account Number (Broj Računa)</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    value={payoutDetails.accountNumber}
                                                    onChange={(e) => setPayoutDetails({...payoutDetails, accountNumber: e.target.value})}
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                                                    placeholder="000-000000000-00"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setShowPayoutModal(false)}
                                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={submitting || (stats?.affiliateEarnings || 0) <= 0}
                                            className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            Submit Request
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    </div>
  );
}
