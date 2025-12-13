'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Edit2, X, Check, Save, User as UserIcon, Clock, DollarSign, ImageIcon, Users, Trash2, Zap, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
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

interface FeedbackItem {
    id: number;
    user_id: string;
    user_email: string;
    message: string;
    type: string;
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
  
  const [activeTab, setActiveTab] = useState<'users' | 'feedback' | 'notifications'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [adminNotifs, setAdminNotifs] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [sendingNotif, setSendingNotif] = useState(false);
  
  // Editing State
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({ credits: 0, plan: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
      try {
        const [usersRes, statsRes, feedbackRes, notifRes] = await Promise.all([
            fetch('/api/admin/users'),
            fetch('/api/admin/stats'),
            fetch('/api/admin/feedback'),
            fetch('/api/admin/notifications')
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
        if (feedbackRes.ok) setFeedbackList(await feedbackRes.json());
        if (notifRes.ok) setAdminNotifs(await notifRes.json());
        
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
  
  const totalGenerated = users.reduce((acc, u) => acc + (u.publicMetadata.imagesGenerated || 0), 0);

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-4 lg:p-8 text-white relative">
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[#ff5400]">Admin Panel</h1>
                    <p className="text-white/50">Manage users, plans, and credits.</p>
                </div>
                <div className="flex gap-2">
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
                </div>
            </div>

            {/* Stats Grid */}
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
                            ${((totalGenerated * 0.09)).toFixed(2)}
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
                        <div className="text-2xl font-bold text-white">{totalGenerated}</div>
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
                
                <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                             <ShieldCheck className="w-5 h-5" />
                         </div>
                         <div className="text-sm font-bold uppercase text-white/50 tracking-wider">Plan Distribution</div>
                    </div>
                    
                    <div className="flex gap-6">
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
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">User Management</h2>
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

                    <div className="grid gap-4">
                        <div className="hidden md:grid bg-white/5 border border-white/10 rounded-t-xl p-4 grid-cols-12 text-xs font-bold uppercase tracking-wider text-white/40 items-center">
                            <div className="col-span-3">User</div>
                            <div className="col-span-2">Last Seen</div>
                            <div className="col-span-1">Plan</div>
                            <div className="col-span-1 text-center">Credits</div>
                            <div className="col-span-1 text-center">Gen</div>
                            <div className="col-span-1 text-center">Status</div>
                            <div className="col-span-2">Renewal</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>

                        {filteredUsers.map((user) => {
                            let planName = user.publicMetadata.planName || 'Free Plan';
                            if (planName.includes('Mocx')) planName = planName.replace('Mocx', '').trim() || 'Starter';
                            planName = planName.replace(/\(.*\)/, '').trim(); 

                            return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={user.id}
                                className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 md:gap-0 hover:border-white/10 transition-colors group relative"
                            >
                                <div className="col-span-3 flex items-center gap-3 overflow-hidden w-full md:w-auto">
                                    <UserAvatar url={user.imageUrl} alt={user.email} />
                                    <div className="min-w-0">
                                        <div className="font-bold text-white truncate">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}</div>
                                        <div className="text-xs text-white/50 truncate">{user.email}</div>
                                    </div>
                                </div>

                                <div className="hidden md:flex col-span-2 text-xs text-white/60 items-center gap-2">
                                    <Clock className="w-3 h-3 text-white/30" />
                                    {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                                </div>

                                <div className="hidden md:block col-span-1">
                                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white/70">{planName}</span>
                                </div>

                                <div className="hidden md:block col-span-1 text-center font-bold">{user.publicMetadata.credits || 0}</div>
                                <div className="hidden md:block col-span-1 text-center text-white/50">{user.publicMetadata.imagesGenerated || 0}</div>
                                <div className="hidden md:block col-span-1 text-center text-xs uppercase font-bold text-white/40">{user.privateMetadata.status || 'FREE'}</div>
                                <div className="hidden md:block col-span-2"><RenewalDate dateStr={user.privateMetadata.renewsAt} /></div>

                                <div className="hidden md:flex col-span-1 text-right justify-end gap-2">
                                    <button onClick={() => handleEditClick(user)} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteClick(user.id, user.email)} className="p-2 hover:bg-red-500/10 rounded-lg text-white/50 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </motion.div>
                        )})}
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
        </div>

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
    </div>
  );
}
