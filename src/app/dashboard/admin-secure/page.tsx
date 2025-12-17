'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Edit2, X, Check, Save, User as UserIcon, Clock, DollarSign, ImageIcon, Users, Trash2, Zap, MessageSquare, AlertTriangle, ShieldCheck, ChevronLeft, ChevronRight, Globe, MapPin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  lastSignInAt: number | null;
  createdAt: number;
  publicMetadata: {
    planName?: string;
    credits?: number;
    imagesGenerated?: number;
    country?: string;
    subscriptionStatus?: string;
    affiliateStats?: {
        starter: number;
        pro: number;
        agency: number;
        free: number;
    };
  };
  privateMetadata: {
    renewsAt?: string;
    endsAt?: string;
    status?: string;
  };
  lastActiveSessionId?: string;
}

interface Stats {
    totalRevenue: number;
    totalUsers: number;
    apiBalance?: number | null;
    totalCost?: number;
    totalImagesGenerated?: number;
    planCounts?: {
        starter: number;
        pro: number;
        agency: number;
        free: number;
    };
    recentActivity?: any[];
}

interface FeedbackItem {
    id: number;
    user_id: string;
    user_email: string;
    message: string;
    type: string;
    status: string;
    created_at: string;
}

interface PayoutRequest {
    id: number;
    user_id: string;
    user_email: string;
    amount: string;
    method: string;
    details: string;
    status: string;
    created_at: string;
}

const UserAvatar = ({ url, alt }: { url: string, alt: string }) => {
    const [error, setError] = useState(false);
    
    if (error || !url) {
         return (
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 shrink-0 border border-white/5">
                <UserIcon className="w-5 h-5" />
            </div>
        );
    }
    
    return (
        <Image 
            src={url} 
            alt={alt} 
            width={40} 
            height={40} 
            className="rounded-full shrink-0 object-cover"
            onError={() => setError(true)}
        />
    );
}

const RenewalDate = ({ dateStr }: { dateStr?: string }) => {
    if (!dateStr) return <span className="text-white/30">-</span>;
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let color = "text-white/40";
    let text = "";
    
    if (diffDays < 0) {
        text = "Expired";
        color = "text-red-400";
    } else if (diffDays === 0) {
        text = "Today";
        color = "text-yellow-400";
    } else if (diffDays <= 3) {
        text = `${diffDays} days left`;
        color = "text-yellow-400";
    } else {
        text = `in ${diffDays} days`;
        color = "text-green-400";
    }
    
    return (
        <div className="flex flex-col leading-tight">
            <span className="text-xs text-white/80">{date.toLocaleDateString()}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${color}`}>{text}</span>
        </div>
    );
};

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'users' | 'feedback' | 'notifications' | 'payouts' | 'email' | 'credits' | 'activity'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [adminNotifs, setAdminNotifs] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [sendingNotif, setSendingNotif] = useState(false);
  
  // Email Marketing State
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [isTestEmail, setIsTestEmail] = useState(true);

  // Bulk Credits State
  const [bulkAmount, setBulkAmount] = useState(0);
  const [processingBulk, setProcessingBulk] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const ITEMS_PER_PAGE = 30;

  // Editing State
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({ credits: 0, plan: '' });
  const [saving, setSaving] = useState(false);

  // Affiliate State
  const [editingAffiliate, setEditingAffiliate] = useState<UserData | null>(null);
  const [affiliateForm, setAffiliateForm] = useState({ starter: 0, pro: 0, agency: 0, free: 0 });

  // Selection State
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle selection for a single user
  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // Toggle select all on current page
  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  // Handle Bulk Delete
  // Reusing existing handler definition to fix duplication error
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (!confirm(`Are you sure you want to PERMANENTLY DELETE ${selectedUsers.length} users? This cannot be undone.`)) return;

    setIsDeleting(true);
    try {
        const res = await fetch('/api/admin/users/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userIds: selectedUsers })
        });
        
        if (!res.ok) throw new Error('Failed to delete users');
        
        const data = await res.json();
        alert(`Successfully deleted ${data.deletedCount} users.`);
        setSelectedUsers([]);
        fetchData(); // Refresh list
    } catch (error) {
        console.error('Bulk delete error:', error);
        alert('Failed to delete users. Check console for details.');
    } finally {
        setIsDeleting(false);
    }
  };

  const handleAffiliateClick = (u: UserData) => {
    setEditingAffiliate(u);
    const stats = u.publicMetadata.affiliateStats || { starter: 0, pro: 0, agency: 0, free: 0 };
    setAffiliateForm({
        starter: stats.starter || 0,
        pro: stats.pro || 0,
        agency: stats.agency || 0,
        free: stats.free || 0
    });
  };

  const handleSaveAffiliate = async () => {
    if (!editingAffiliate) return;
    setSaving(true);
    try {
        const res = await fetch('/api/admin/users/update-affiliate', {
            method: 'POST',
            body: JSON.stringify({ targetUserId: editingAffiliate.id, stats: affiliateForm })
        });
        if (!res.ok) throw new Error('Failed');
        await fetchData();
        setEditingAffiliate(null);
    } catch (e) {
        console.error(e);
        alert('Failed to save affiliate stats');
    } finally {
        setSaving(false);
    }
  };

  const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        
        const [usersRes, statsRes, feedbackRes, notifRes, payoutsRes] = await Promise.all([
            fetch(`/api/admin/users?limit=${ITEMS_PER_PAGE}&offset=${offset}${searchParam}`),
            fetch('/api/admin/stats'),
            fetch('/api/admin/feedback'),
            fetch('/api/admin/notifications'),
            fetch('/api/admin/payouts')
        ]);

        if (usersRes.ok) {
            const data = await usersRes.json();
            setUsers(data.users);
            setTotalUsers(data.totalCount);
        }
        if (statsRes.ok) setStats(await statsRes.json());
        if (feedbackRes.ok) setFeedbackList(await feedbackRes.json());
        if (notifRes.ok) setAdminNotifs(await notifRes.json());
        if (payoutsRes.ok) setPayouts(await payoutsRes.json());
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
  };

  const sendBroadcast = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) return;
    setSendingNotif(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: notifTitle.trim(), body: notifBody.trim() }),
      });
      if (!res.ok) {
        alert('Failed to send notification');
        return;
      }
      setNotifTitle('');
      setNotifBody('');
      await fetchData();
      alert('Notification sent!');
    } finally {
      setSendingNotif(false);
    }
  };

  const sendEmailBlast = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    if (!confirm(isTestEmail ? 'Send TEST email to yourself?' : 'WARNING: Send email to ALL Free users? This cannot be undone.')) return;
    
    setSendingEmail(true);
    try {
      const res = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: emailSubject, message: emailBody, testMode: isTestEmail }),
      });
      const data = await res.json();
      if (data.success) {
          alert(`Email sent successfully to ${data.count} recipients!`);
          if (!isTestEmail) {
              setEmailSubject('');
              setEmailBody('');
          }
      } else {
          alert('Failed: ' + (data.error || 'Unknown error'));
      }
    } catch(e) {
        console.error(e);
        alert('Error sending email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBulkCredits = async (action: 'add' | 'set') => {
    const confirmMsg = action === 'set' 
        ? `DANGER: This will SET credits to ${bulkAmount} for ALL users. Existing credits will be overwritten. Are you sure?`
        : `This will ADD ${bulkAmount} credits to ALL users. Are you sure?`;
        
    if (!confirm(confirmMsg)) return;
    
    setProcessingBulk(true);
    try {
        const res = await fetch('/api/admin/users/bulk-credits', {
            method: 'POST',
            body: JSON.stringify({ amount: bulkAmount, action })
        });
        const data = await res.json();
        if (data.success) {
            alert(`Success! Updated ${data.updatedCount} users.`);
            fetchData();
        } else {
            alert('Failed: ' + data.error);
        }
    } catch (e) {
        console.error(e);
        alert('Error processing bulk request');
    } finally {
        setProcessingBulk(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (!user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
      if (!isLoaded || !user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) return;

      const timer = setTimeout(() => {
          fetchData();
      }, 500);

      return () => clearTimeout(timer);
  }, [currentPage, search, isLoaded]); // Fetch on page/search change

  const handleEditClick = (u: UserData) => {
    setEditingUser(u);
    setEditForm({
        credits: u.publicMetadata.credits || 0,
        plan: (u.publicMetadata.planName || 'Free Plan').replace('Mocx', 'Starter')
    });
  };

  const handleDeleteClick = async (userId: string, email: string) => {
      if (!window.confirm(`Are you sure you want to permanently delete user ${email}?`)) return;

      try {
          const res = await fetch('/api/admin/users', {
              method: 'DELETE',
              body: JSON.stringify({ targetUserId: userId })
          });

          if (res.ok) await fetchData();
          else alert('Failed to delete user');
      } catch (error) {
          console.error(error);
          alert('Error deleting user');
      }
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    
    try {
        await Promise.all([
            fetch('/api/admin/users', {
                method: 'PATCH',
                body: JSON.stringify({ targetUserId: editingUser.id, action: 'update_plan', value: editForm.plan })
            }),
            fetch('/api/admin/users', {
                method: 'PATCH',
                body: JSON.stringify({ targetUserId: editingUser.id, action: 'update_credits', value: editForm.credits })
            })
        ]);

        await fetchData();
        setEditingUser(null);
    } catch (error) {
        console.error(error);
        alert('Failed to save changes');
    } finally {
        setSaving(false);
    }
  };

  const handlePayoutStatus = async (id: number, status: string) => {
    if(!confirm(`Mark request as ${status}?`)) return;
    try {
        const res = await fetch('/api/admin/payouts/update', {
            method: 'POST',
            body: JSON.stringify({ id, status })
        });
        if(res.ok) {
            await fetchData(); 
        } else {
            alert('Failed to update status');
        }
    } catch(e) { 
        console.error(e);
        alert('Error updating status');
    }
  };

  const getPlanBadgeStyle = (plan: string) => {
    const p = (plan || '').toLowerCase();
    if (p.includes('agency')) return 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]';
    if (p.includes('pro')) return 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]';
    if (p.includes('starter')) return 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]';
    return 'bg-white/5 text-white/50 border border-white/10';
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff5400]" />
      </div>
    );
  }

  // Removed client-side filtering, now handled by API
  const displayUsers = users;
  
  // const totalGenerated = users.reduce((acc, u) => acc + (u.publicMetadata.imagesGenerated || 0), 0); // Removed local calc

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-4 lg:p-8 text-white relative">
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[#ff5400]">Admin Panel</h1>
                    <p className="text-white/50">Manage users, plans, and credits.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'users' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                    >
                        Users
                    </button>
                    <button 
                        onClick={() => setActiveTab('feedback')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'feedback' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Feedback
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'notifications' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                    >
                        <Zap className="w-4 h-4" />
                        Notifications
                    </button>
                    <button 
                        onClick={() => setActiveTab('payouts')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'payouts' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                    >
                        <DollarSign className="w-4 h-4" />
                        Payouts
                    </button>
                    <button 
                        onClick={() => setActiveTab('email')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'email' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </button>
                    <button 
                        onClick={() => setActiveTab('credits')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'credits' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                    >
                        <Zap className="w-4 h-4" />
                        Bulk Credits
                    </button>
                    <button 
                        onClick={() => setActiveTab('activity')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'activity' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        Live Feed
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">Earnings</div>
                        <div className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">Nano Costs</div>
                        <div className="text-2xl font-bold text-white">
                            ${(stats.totalCost || 0).toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">Users</div>
                        <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">Generated</div>
                        <div className="text-2xl font-bold text-white">{stats.totalImagesGenerated || 0}</div>
                    </div>
                </div>
                
                {/* NEW: Nano Balance & Plans */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">Nano Balance</div>
                        <div className="text-2xl font-bold text-white">
                            {stats.apiBalance !== undefined && stats.apiBalance !== null ? `${stats.apiBalance}` : 'N/A'}
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
                    <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                             <ShieldCheck className="w-5 h-5" />
                         </div>
                         <div className="text-sm font-bold uppercase text-white/50 tracking-wider">Plan Distribution</div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 w-full sm:w-auto">
                         <div className="text-center">
                             <div className="text-xl font-bold text-white">{stats.planCounts?.free || 0}</div>
                             <div className="text-[10px] text-white/40 uppercase font-bold">Free</div>
                         </div>
                         <div className="text-center">
                             <div className="text-xl font-bold text-white">{stats.planCounts?.starter || 0}</div>
                             <div className="text-[10px] text-white/40 uppercase font-bold">Starter</div>
                         </div>
                         <div className="text-center">
                             <div className="text-xl font-bold text-white">{stats.planCounts?.pro || 0}</div>
                             <div className="text-[10px] text-white/40 uppercase font-bold">Pro</div>
                         </div>
                         <div className="text-center">
                             <div className="text-xl font-bold text-white">{stats.planCounts?.agency || 0}</div>
                             <div className="text-[10px] text-white/40 uppercase font-bold">Agency</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* TAB CONTENT: USERS */}
            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold">User Management</h2>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 w-full sm:w-64 focus-within:border-primary/50 transition-colors">
                            <Search className="w-4 h-4 text-white/50" />
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                        {/* Table Header (Desktop) */}
                        <div className="hidden md:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-white/40 items-center p-4 bg-white/5">
                            <div className="col-span-3 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={users.length > 0 && selectedUsers.length === users.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-primary"
                                />
                                User
                            </div>
                            <div className="col-span-3">Last Seen</div>
                            <div className="col-span-1">Plan</div>
                            <div className="col-span-1 text-center">Stats</div>
                            <div className="col-span-1 text-center">Cost</div>
                            <div className="col-span-2 text-center">Renewal</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {displayUsers.map((user) => {
                                let planName = user.publicMetadata.planName || 'Free Plan';
                                if (planName.includes('Mocx')) planName = planName.replace('Mocx', '').trim() || 'Starter';
                                planName = planName.replace(/\(.*\)/, '').trim(); 

                                return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={user.id}
                                    className="p-4 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 md:gap-0 hover:bg-white/5 transition-colors group relative"
                                >
                                    {/* User Info */}
                                    <div className="col-span-3 flex items-center gap-3 w-full md:w-auto">
                                        <div className="flex items-center justify-center shrink-0">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleSelectUser(user.id)}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-primary cursor-pointer"
                                            />
                                        </div>
                                        <UserAvatar url={user.imageUrl} alt={user.email} />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-white truncate text-sm">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}</div>
                                            <div className="text-xs text-white/50 truncate">{user.email}</div>
                                        </div>
                                    </div>

                                    {/* Last Seen */}
                                    <div className="hidden md:flex col-span-3 flex-col justify-center text-xs text-white/60">
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Clock className="w-3 h-3 text-primary" />
                                            {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                                            {user.publicMetadata?.country && (
                                              <span className="ml-1 px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-[10px] border border-white/5">
                                                {user.publicMetadata.country}
                                              </span>
                                            )}
                                        </div>
                                        {user.lastSignInAt && (
                                            <div className="text-[10px] text-white/30 ml-5">
                                                {new Date(user.lastSignInAt).toLocaleTimeString()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="hidden md:block col-span-1">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${getPlanBadgeStyle(planName)}`}>{planName}</span>
                                    </div>

                                    {/* Stats (Credits/Gen) */}
                                    <div className="hidden md:block col-span-1 text-center">
                                        <div className="text-xs font-bold text-white">{user.publicMetadata.credits || 0} <span className="text-white/30 font-normal">cr</span></div>
                                        <div className="text-[10px] text-white/40">{user.publicMetadata.imagesGenerated || 0} gen</div>
                                    </div>

                                    {/* Cost */}
                                    <div className="hidden md:block col-span-1 text-center text-red-400/80 font-mono text-xs">
                                        ${((user.publicMetadata.imagesGenerated || 0) * 0.09).toFixed(2)}
                                    </div>

                                    {/* Renewal */}
                                    <div className="hidden md:block col-span-2 text-center">
                                        <RenewalDate dateStr={user.privateMetadata.renewsAt} />
                                    </div>

                                    {/* Action */}
                                    <div className="flex md:hidden w-full mt-2 pt-2 border-t border-white/5 justify-between items-center text-xs text-white/50">
                                        <div className="flex gap-4">
                                            <span>{user.publicMetadata.credits || 0} credits</span>
                                            <span>{planName}</span>
                                        </div>
                                        <div>{user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}</div>
                                    </div>

                                    <div className="flex md:justify-end gap-2 col-span-1 ml-auto md:ml-0 mt-2 md:mt-0">
                                        <button onClick={() => handleAffiliateClick(user)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-green-400 transition-colors" title="Manage Affiliate"><Users className="w-4 h-4" /></button>
                                        <button onClick={() => handleEditClick(user)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteClick(user.id, user.email)} className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-white/50 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center pt-2">
                        <div className="text-sm text-white/40">
                            Showing <span className="text-white font-bold">{users.length}</span> of <span className="text-white font-bold">{totalUsers}</span> users
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-bold text-white px-2">Page {currentPage}</span>
                            <button 
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage * ITEMS_PER_PAGE >= totalUsers}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: FEEDBACK */}
            {activeTab === 'feedback' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Feedback & Issues</h2>
                    <div className="grid gap-4">
                        {feedbackList.length === 0 ? (
                            <div className="text-center py-12 text-white/30 italic">No feedback yet.</div>
                        ) : (
                            feedbackList.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-black/40 border border-white/5 rounded-xl p-6 flex flex-col gap-2 relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-lg ${item.type === 'bug' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                {item.type === 'bug' ? <AlertTriangle className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{item.user_email}</div>
                                                <div className="text-xs text-white/40">{new Date(item.created_at).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-white/40">{item.status}</span>
                                    </div>
                                    <p className="text-white/80 bg-white/5 p-4 rounded-lg text-sm mt-2">{item.message}</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Broadcast Notifications</h2>
                  <p className="text-white/40 text-sm mt-1">Send a message to all users. It will appear in their dashboard sidebar.</p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Title</label>
                    <input
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-primary/50"
                      placeholder="New feature, downtime, promo..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Message</label>
                    <textarea
                      value={notifBody}
                      onChange={(e) => setNotifBody(e.target.value)}
                      className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-primary/50 min-h-[120px] resize-none"
                      placeholder="Write the notification that users will see..."
                    />
                  </div>
                  <button
                    onClick={sendBroadcast}
                    disabled={sendingNotif || !notifTitle.trim() || !notifBody.trim()}
                    className="w-full bg-primary text-white rounded-xl py-3 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {sendingNotif ? 'Sending...' : 'Send to all users'}
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold">Recent Notifications</h3>
                  {adminNotifs.length === 0 ? (
                    <div className="text-white/30 italic">No notifications yet.</div>
                  ) : (
                    <div className="grid gap-3">
                      {adminNotifs.map((n: any) => (
                        <div key={n.id} className="bg-black/40 border border-white/5 rounded-xl p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-white truncate">{n.title}</div>
                              <div className="text-xs text-white/40 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-white/40">broadcast</span>
                          </div>
                          <div className="text-sm text-white/70 mt-3 whitespace-pre-wrap">{n.body}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PAYOUTS */}
            {activeTab === 'payouts' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Payout Requests</h2>
                    <div className="grid gap-4">
                        {payouts.length === 0 ? (
                            <div className="text-center py-12 text-white/30 italic">No payout requests.</div>
                        ) : (
                            payouts.map((req) => (
                                <motion.div 
                                    key={req.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-black/40 border border-white/5 rounded-xl p-6 flex flex-col gap-4 relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-green-500">
                                                <DollarSign className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-white">${parseFloat(req.amount).toFixed(2)}</div>
                                                <div className="text-sm text-white/50">{req.user_email}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handlePayoutStatus(req.id, 'paid')}
                                                        className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handlePayoutStatus(req.id, 'declined')}
                                                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                                                req.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-xl space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Method:</span>
                                            <span className="text-white font-medium uppercase">{req.method}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Date:</span>
                                            <span className="text-white font-medium">{new Date(req.created_at).toLocaleString()}</span>
                                        </div>
                                        
                                        <div className="pt-2 border-t border-white/10 mt-2">
                                            <div className="text-xs font-bold text-white/40 uppercase mb-2">Details</div>
                                            <pre className="text-xs text-white/70 whitespace-pre-wrap font-mono overflow-auto">
                                                {JSON.stringify(typeof req.details === 'string' ? JSON.parse(req.details) : req.details, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: EMAIL */}
            {activeTab === 'email' && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold">Email Marketing</h2>
                        <p className="text-white/40 text-sm mt-1">Send an email blast to all Free Plan users to encourage upgrade.</p>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Subject Line</label>
                            <input
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-primary/50"
                                placeholder="e.g. Unlock unlimited creativity with Pro..."
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Message Body (HTML Supported)</label>
                            <textarea
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-primary/50 min-h-[200px] resize-none font-mono"
                                placeholder="Write your email content here..."
                            />
                            <p className="text-[10px] text-white/30 mt-2">Basic HTML is supported. Use &lt;br&gt; for line breaks if needed.</p>
                        </div>
                        
                        <div className="flex items-center gap-2 py-2">
                            <input 
                                type="checkbox" 
                                id="testMode" 
                                checked={isTestEmail} 
                                onChange={(e) => setIsTestEmail(e.target.checked)}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                            />
                            <label htmlFor="testMode" className="text-sm text-white/70 select-none cursor-pointer">
                                Send Test Email (only to me)
                            </label>
                        </div>

                        <button
                            onClick={sendEmailBlast}
                            disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                            className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                                isTestEmail 
                                ? 'bg-white text-black hover:bg-gray-200' 
                                : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110'
                            }`}
                        >
                            {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                            {sendingEmail ? 'Sending...' : isTestEmail ? 'Send Test Email' : 'Send to ALL Free Users'}
                        </button>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: BULK CREDITS */}
            {activeTab === 'credits' && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold">Bulk Credit Management</h2>
                        <p className="text-white/40 text-sm mt-1">Manage credits for ALL users at once. Use with caution.</p>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Amount</label>
                            <input
                                type="number"
                                value={bulkAmount}
                                onChange={(e) => setBulkAmount(Number(e.target.value))}
                                className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-yellow-500/50 font-mono text-lg"
                                placeholder="Enter amount..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleBulkCredits('add')}
                                disabled={processingBulk || bulkAmount <= 0}
                                className="w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                Give {bulkAmount > 0 ? bulkAmount : ''} Credits to ALL
                            </button>

                            <button
                                onClick={() => handleBulkCredits('set')}
                                disabled={processingBulk || bulkAmount < 0}
                                className="w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                Set ALL to {bulkAmount} Credits
                            </button>
                        </div>
                        
                        <div className="border-t border-white/10 pt-6 mt-6">
                            <p className="text-sm text-white/40">
                                <span className="text-red-400 font-bold">Note:</span> "Set" will overwrite any existing credits. Use "Give" to add to existing balance. 
                                To wipe all credits, enter <b>0</b> and click <b>"Set ALL to 0 Credits"</b>.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: ACTIVITY */}
            {activeTab === 'activity' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Live Generation Feed</h2>
                    <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-white/40 items-center p-4 bg-white/5">
                            <div className="col-span-4">User</div>
                            <div className="col-span-4">Prompt</div>
                            <div className="col-span-2">Mode</div>
                            <div className="col-span-2 text-right">Time</div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {stats.recentActivity?.map((gen: any) => {
                                const user = users.find(u => u.id === gen.userId);
                                const userLabel = user ? (user.email || 'Unknown User') : gen.userId;
                                return (
                                    <div key={gen.id} className="p-4 grid grid-cols-12 items-center gap-4 text-sm hover:bg-white/5 transition-colors">
                                        <div className="col-span-4 font-mono text-xs text-white/50 truncate" title={gen.userId}>
                                            {userLabel}
                                        </div>
                                        <div className="col-span-4 text-white/80 truncate" title={gen.prompt}>
                                            {gen.prompt}
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                gen.mode === 'thumbnail' ? 'bg-red-500/20 text-red-400' :
                                                gen.mode === 'mockup' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {gen.mode || 'unknown'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-right text-white/40 text-xs">
                                            {new Date(gen.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                            {(!stats.recentActivity || stats.recentActivity.length === 0) && (
                                <div className="p-8 text-center text-white/30 italic">No recent activity found.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Floating Bulk Actions Bar */}
        <AnimatePresence>
            {selectedUsers.length > 0 && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6"
                >
                    <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                        <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded">
                            {selectedUsers.length}
                        </span>
                        <span className="text-sm font-bold text-white">Selected</span>
                    </div>
                    
                    <button 
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete Selected
                    </button>
                    
                    <button 
                        onClick={() => setSelectedUsers([])}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
                        <h2 className="text-xl font-bold text-white mb-6">Edit User</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Plan</label>
                                <select 
                                    value={editForm.plan} 
                                    onChange={(e) => setEditForm({...editForm, plan: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                                >
                                    <option value="Free Plan" className="bg-black">Free Plan</option>
                                    <option value="Starter" className="bg-black">Starter</option>
                                    <option value="Pro" className="bg-black">Pro</option>
                                    <option value="Agency" className="bg-black">Agency</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Credits</label>
                                <div className="flex gap-2">
                                    <input type="number" value={editForm.credits} onChange={(e) => setEditForm({...editForm, credits: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50" />
                                    <button onClick={() => setEditForm(prev => ({ ...prev, credits: prev.credits + 50 }))} className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/5">+50</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20 flex items-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>

        {/* Affiliate Modal */}
        <AnimatePresence>
            {editingAffiliate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button onClick={() => setEditingAffiliate(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
                        <h2 className="text-xl font-bold text-white mb-6">Manage Affiliate Stats</h2>
                        <p className="text-white/50 text-sm mb-4">Set the manual counts for this user's affiliate dashboard.</p>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Active Starters</label>
                                    <input type="number" value={affiliateForm.starter} onChange={(e) => setAffiliateForm({...affiliateForm, starter: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Active Pros</label>
                                    <input type="number" value={affiliateForm.pro} onChange={(e) => setAffiliateForm({...affiliateForm, pro: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Active Agencies</label>
                                    <input type="number" value={affiliateForm.agency} onChange={(e) => setAffiliateForm({...affiliateForm, agency: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Free Users</label>
                                    <input type="number" value={affiliateForm.free} onChange={(e) => setAffiliateForm({...affiliateForm, free: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500/50" />
                                </div>
                            </div>
                            
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-xs font-bold text-white/40 uppercase mb-2">Estimated Earnings</div>
                                <div className="text-2xl font-bold text-white">
                                    ${((affiliateForm.starter * 19 + affiliateForm.pro * 39 + affiliateForm.agency * 79) * 0.15).toFixed(2)}
                                </div>
                                <p className="text-[10px] text-white/30 mt-1">Based on 15% commission</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => setEditingAffiliate(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5">Cancel</button>
                            <button onClick={handleSaveAffiliate} disabled={saving} className="px-6 py-2 rounded-xl text-sm font-bold bg-green-500 text-white hover:brightness-110 shadow-lg shadow-green-500/20 flex items-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Stats</button>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
}
