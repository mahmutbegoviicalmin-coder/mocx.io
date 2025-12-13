'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Clock, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        
        await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'markAllRead' }),
        });
        fetchNotifications();
    } catch (e) {
        console.error(e);
    }
  };

  const markOneRead = async (notificationId: number) => {
    // If already read, do nothing
    const notif = notifications.find(n => n.id === notificationId);
    if (notif?.isRead) return;

    try {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
        
        await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId }),
        });
    } catch (e) {
        console.error(e);
    }
  };

  const deleteNotification = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    try {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        await fetch(`/api/notifications?id=${notificationId}`, {
            method: 'DELETE'
        });
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6 lg:p-12 font-sans relative overflow-hidden">
       {/* Background decorative elements */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none opacity-20" />
       
       <div className="max-w-4xl mx-auto">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Bell className="w-8 h-8 text-primary" />
                    Notifications
                </h1>
            </div>

            {notifications.length > 0 && (
                <button
                    onClick={markAllRead}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium"
                >
                    <CheckCheck className="w-4 h-4 text-primary" />
                    Mark all as read
                </button>
            )}
         </div>

         {/* Content */}
         {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/30">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p>Loading notifications...</p>
            </div>
         ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                    <Bell className="w-10 h-10" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white/50">All caught up!</h3>
                    <p className="text-white/30 mt-1">You have no new notifications at the moment.</p>
                </div>
            </div>
         ) : (
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className={`relative p-6 rounded-2xl border transition-all group cursor-pointer ${
                                n.isRead 
                                    ? 'bg-[#151515] border-white/5 opacity-70 hover:opacity-100' 
                                    : 'bg-[#1A1A1A] border-primary/20 shadow-[0_0_30px_-10px_rgba(255,90,95,0.1)]'
                            }`}
                            onClick={() => markOneRead(n.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 transition-colors ${
                                    n.isRead ? 'bg-white/10' : 'bg-primary shadow-[0_0_10px_var(--primary)]'
                                }`} />
                                
                                <div className="flex-1 min-w-0 pr-8">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`font-bold text-lg ${n.isRead ? 'text-white/70' : 'text-white'}`}>
                                            {n.title}
                                        </h3>
                                        {!n.isRead && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${n.isRead ? 'text-white/40' : 'text-white/70'}`}>
                                        {n.body}
                                    </p>
                                    <div className="flex items-center gap-2 mt-4 text-xs text-white/30">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => deleteNotification(e, n.id)}
                                    className="absolute top-4 right-4 p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Delete notification"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
         )}
       </div>
    </div>
  );
}

