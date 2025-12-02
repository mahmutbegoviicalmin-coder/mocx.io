'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Edit2, X, Check, Save, User as UserIcon, Clock, DollarSign, ImageIcon, Users, Trash2, Zap } from 'lucide-react';
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
  };
  privateMetadata: {
    renewsAt?: string;
    endsAt?: string;
    status?: string;
  };
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

// Helper for days remaining
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
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalUsers: 0 });
  
  // Editing State
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({ credits: 0, plan: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
            fetch('/api/admin/users'),
            fetch('/api/admin/stats')
        ]);

        if (usersRes.ok) {
            const data = await usersRes.json();
            setUsers(data);
        }
        
        if (statsRes.ok) {
            const data = await statsRes.json();
            setStats(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
  };

  useEffect(() => {
    if (isLoaded) {
      if (!user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
        router.push('/dashboard');
        return;
      }
      fetchData();
    }
  }, [isLoaded, user, router]);

  const handleEditClick = (u: UserData) => {
    setEditingUser(u);
    setEditForm({
        credits: u.publicMetadata.credits || 0,
        plan: (u.publicMetadata.planName || 'Free Plan').replace('Mocx', 'Starter')
    });
  };

  const handleDeleteClick = async (userId: string, email: string) => {
      if (!window.confirm(`Are you sure you want to permanently delete user ${email}? This action cannot be undone.`)) {
          return;
      }

      try {
          const res = await fetch('/api/admin/users', {
              method: 'DELETE',
              body: JSON.stringify({ targetUserId: userId })
          });

          if (res.ok) {
              await fetchData();
          } else {
              alert('Failed to delete user');
          }
      } catch (error) {
          console.error(error);
          alert('Error deleting user');
      }
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    
    try {
        await fetch('/api/admin/users', {
            method: 'PATCH',
            body: JSON.stringify({
                targetUserId: editingUser.id,
                action: 'update_plan',
                value: editForm.plan
            })
        });

        await fetch('/api/admin/users', {
            method: 'PATCH',
            body: JSON.stringify({
                targetUserId: editingUser.id,
                action: 'update_credits',
                value: editForm.credits
            })
        });

        await fetchData();
        setEditingUser(null);
    } catch (error) {
        console.error(error);
        alert('Failed to save changes');
    } finally {
        setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff5400]" />
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.firstName && u.firstName.toLowerCase().includes(search.toLowerCase())) ||
    (u.lastName && u.lastName.toLowerCase().includes(search.toLowerCase()))
  );
  
  // Calculate total generated from displayed users (approximation)
  const totalGenerated = users.reduce((acc, u) => acc + (u.publicMetadata.imagesGenerated || 0), 0);

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-8 text-white relative">
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">Total Earnings</div>
                        <div className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</div>
                        {stats.totalCost !== undefined && (
                             <div className="text-xs text-white/30 mt-1">
                                Cost: ${stats.totalCost.toFixed(2)} ({(stats.totalCost / (stats.totalRevenue || 1) * 100).toFixed(1)}%)
                             </div>
                        )}
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">API Credits</div>
                        <div className="text-2xl font-bold text-white">
                            {stats.apiBalance !== undefined && stats.apiBalance !== null ? stats.apiBalance : 'N/A'}
                        </div>
                    </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">Total Users</div>
                        <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-white/50 font-medium uppercase tracking-wider">Images Generated</div>
                        <div className="text-2xl font-bold text-white">{totalGenerated}</div>
                    </div>
                </div>
            </div>

            {/* Plan Distribution */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Starter</div>
                    <div className="text-2xl font-bold text-white">{stats.planCounts?.starter || 0}</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">Pro</div>
                    <div className="text-2xl font-bold text-white">{stats.planCounts?.pro || 0}</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">Agency</div>
                    <div className="text-2xl font-bold text-white">{stats.planCounts?.agency || 0}</div>
                </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Free</div>
                    <div className="text-2xl font-bold text-white">{stats.planCounts?.free || 0}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[#ff5400]">Admin Panel</h1>
                    <p className="text-white/50">Manage users, plans, and credits.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 w-64 focus-within:border-primary/50 transition-colors">
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

            {/* Table */}
            <div className="grid gap-4">
                {/* Header Row */}
                <div className="bg-white/5 border border-white/10 rounded-t-xl p-4 grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-white/40 items-center">
                    <div className="col-span-3">User</div>
                    <div className="col-span-2">Last Seen</div>
                    <div className="col-span-1">Plan</div>
                    <div className="col-span-1 text-center">Credits</div>
                    <div className="col-span-1 text-center">Gen</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-2">Renewal</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {/* User Rows */}
                {filteredUsers.map((user) => {
                    // Fix Mocx -> Starter
                    const planName = (user.publicMetadata.planName || 'Free Plan').replace('Mocx', 'Starter').replace('Free Plan', 'Free');
                    
                    return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={user.id}
                        className="bg-black/40 border border-white/5 rounded-xl p-4 grid grid-cols-12 items-center hover:border-white/10 transition-colors group"
                    >
                        {/* User Info */}
                        <div className="col-span-3 flex items-center gap-3 overflow-hidden">
                            <UserAvatar url={user.imageUrl} alt={user.email} />
                            <div className="min-w-0">
                                <div className="font-bold text-white truncate">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}</div>
                                <div className="text-xs text-white/50 truncate" title={user.email}>{user.email}</div>
                            </div>
                        </div>

                        {/* Last Seen */}
                        <div className="col-span-2 text-xs text-white/60 flex items-center gap-2">
                            <Clock className="w-3 h-3 text-white/30" />
                            {user.lastSignInAt ? (
                                <span>{new Date(user.lastSignInAt).toLocaleDateString()} <span className="text-white/30">{new Date(user.lastSignInAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></span>
                            ) : (
                                <span className="text-white/30">Never</span>
                            )}
                        </div>

                        {/* Plan */}
                        <div className="col-span-1">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                                planName.toLowerCase().includes('pro') ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                planName.toLowerCase().includes('agency') ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                planName.toLowerCase().includes('starter') ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                'bg-white/5 text-white/50 border-white/10'
                            }`}>
                                {planName}
                            </span>
                        </div>

                        {/* Credits */}
                        <div className="col-span-1 text-center">
                             <span className="text-sm font-bold text-white">{user.publicMetadata.credits || 0}</span>
                        </div>

                        {/* Generated Count */}
                        <div className="col-span-1 text-center">
                             <span className="text-xs text-white/50 font-mono bg-white/5 px-2 py-1 rounded">{user.publicMetadata.imagesGenerated || 0}</span>
                        </div>

                        {/* Status */}
                        <div className="col-span-1 text-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                                user.privateMetadata.status === 'active' ? 'text-green-400 bg-green-400/10' : 'text-white/30 bg-white/5'
                            }`}>
                                {(user.privateMetadata.status || 'Free').toUpperCase()}
                            </span>
                        </div>

                        {/* Renewal Date */}
                        <div className="col-span-2">
                            <RenewalDate dateStr={user.privateMetadata.renewsAt} />
                        </div>

                        {/* Action */}
                        <div className="col-span-1 text-right flex justify-end gap-2">
                            <button 
                                onClick={() => handleEditClick(user)}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                                title="Edit User"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDeleteClick(user.id, user.email)}
                                className="p-2 hover:bg-red-500/10 rounded-lg text-white/50 hover:text-red-400 transition-colors"
                                title="Delete User"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )})}
            </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
                    >
                        <button 
                            onClick={() => setEditingUser(null)}
                            className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-1">Edit User</h2>
                        <p className="text-sm text-white/50 mb-6">{editingUser.email}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Plan</label>
                                <select 
                                    value={editForm.plan}
                                    onChange={(e) => setEditForm({...editForm, plan: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-colors appearance-none"
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
                                    <input 
                                        type="number" 
                                        value={editForm.credits}
                                        onChange={(e) => setEditForm({...editForm, credits: parseInt(e.target.value) || 0})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-colors"
                                    />
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => setEditForm(prev => ({ ...prev, credits: prev.credits + 10 }))}
                                            className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/5"
                                        >
                                            +10
                                        </button>
                                        <button 
                                            onClick={() => setEditForm(prev => ({ ...prev, credits: prev.credits + 50 }))}
                                            className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/5"
                                        >
                                            +50
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button 
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
}
