'use client';

import Link from 'next/link';
import { Palette, Layers, Youtube, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

const TOOLS = [
  {
    id: 'art',
    title: 'AI Art Generator',
    description: 'Create stunning images from text descriptions. No design skills needed.',
    icon: Palette,
    href: '/dashboard/art',
    color: 'from-blue-500 to-blue-600',
    delay: 0.1,
    minPlan: 'pro'
  },
  {
    id: 'mockup',
    title: 'Mockup Studio',
    description: 'Place your designs into professional, realistic scenes instantly.',
    icon: Layers,
    href: '/dashboard/mockup',
    color: 'from-orange-500 to-red-600',
    delay: 0.2,
    minPlan: 'pro'
  },
  {
    id: 'thumbnail',
    title: 'Thumbnail Maker',
    description: 'Remix viral styles. Upload a reference and let AI recreate the vibe.',
    icon: Youtube,
    href: '/dashboard/thumbnail',
    color: 'from-blue-500 to-cyan-500',
    delay: 0.3,
    minPlan: 'starter'
  }
];

export default function DashboardHome() {
  const { user } = useUser();
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan';
  
  const isPro = planName.toLowerCase().includes('pro');
  const isAgency = planName.toLowerCase().includes('agency');
  const isStarter = planName.toLowerCase().includes('starter');

  const hasAccess = (minPlan: string) => {
      // ALL tools are open for everyone now (pay per use or subscription)
      return true;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6 lg:p-12 relative overflow-hidden font-sans">
       <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-30" />
       
       <div className="max-w-6xl mx-auto">
         <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Creative Studio</h1>
            <p className="text-white/40 text-lg">Select a tool to start creating magic.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => {
                const Icon = tool.icon;
                const locked = !hasAccess(tool.minPlan || 'free');

                return (
                    <Link key={tool.id} href={tool.href}>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: tool.delay }}
                            className="group relative h-80 rounded-[32px] overflow-hidden bg-[#1A1A1A] border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] shadow-2xl"
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                            
                            {/* Icon Blob */}
                            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${tool.color} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />

                            {locked && (
                                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center transition-opacity">
                                    <div className="bg-black/40 p-3 rounded-full border border-white/10 mb-2">
                                        <Lock className="w-6 h-6 text-white/50" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/50 border border-white/10 px-3 py-1 rounded-full bg-black/40">
                                        {tool.minPlan === 'pro' ? 'Pro Plan' : 'Paid Plan'}
                                    </span>
                                </div>
                            )}

                            <div className={`relative h-full p-8 flex flex-col justify-between z-10 ${locked ? 'opacity-40 blur-[1px]' : ''}`}>
                                <div>
                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-7 h-7 text-white/80" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-foreground transition-colors">{tool.title}</h3>
                                    <p className="text-white/40 group-hover:text-white/60 leading-relaxed">{tool.description}</p>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm font-bold text-white/30 group-hover:text-white transition-colors">
                                    Open Tool <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                );
            })}
         </div>
       </div>
    </div>
  );
}
