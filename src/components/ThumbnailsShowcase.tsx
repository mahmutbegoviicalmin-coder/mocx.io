'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';

const CREATORS = [
  { name: 'IShowSpeed', subs: '33M+', avatar: '/creators/i-show-speed-1400x825-1.jpg' },
  { name: 'Khaby Lame', subs: '162M+', avatar: '/creators/Khaby_Lame_Web-scaled.jpg' },
  { name: 'Veritasium', subs: '17M+', avatar: '/creators/Veritasium.jpg' },
  { name: 'Chad Wild Clay', subs: '15M+', avatar: '/creators/Chad Wild Clay.jpg' },
  { name: 'Young Swagon', subs: '8M+', avatar: '/creators/Young Swagon .jpg' },
  { name: 'Dyler | دايلر', subs: '7M+', avatar: '/creators/dyler.jpg' },
  { name: 'Poke', subs: '5M+', avatar: '/creators/poke.jpg' },
  { name: 'GaryVee', subs: '4.4M+', avatar: '/creators/gary-v.jpg' },
  { name: 'Ashton Hall', subs: '4.6M+', avatar: '/creators/475565701_18489502471043650_6084764673058093365_n_1742926143206_1742926177364.jpg' },
  { name: 'Logan Paul', subs: '23.6M+', avatar: '/creators/unnamed.jpg' },
];

const VIDEOS = [
  {
    title: "I Trained Like Cristiano Ronaldo for 200 Days",
    views: "4.2M views",
    image: "/thumbnails/45a72f2e-f64e-4840-b5ed-5effc216c045.jpg",
    stats: { ctr: "+34.2%", type: "CTR" }
  },
  {
    title: "I Survived 24 Hours in a Burning House",
    views: "8.5M views",
    image: "/thumbnails/7fb5f477-b495-412b-947d-83bca1eb9fc7.jpg",
    stats: { ctr: "+38.5%", type: "CTR" }
  },
  {
    title: "How to Build a $10M Business from Scratch",
    views: "1.1M views",
    image: "/thumbnails/92e171a444d955a8f8fb3d0200522033_1765658486_zsa4a9bm.jpeg",
    stats: { ctr: "+18.8%", type: "Retention" }
  },
  {
    title: "I Bought The World's Cheapest & Most Expensive Private Yacht",
    views: "12M views",
    image: "/thumbnails/97baab01-e8e3-4909-884d-1095e5f845eb.jpg",
    stats: { ctr: "+41.1%", type: "CTR" }
  },
  {
    title: "How to Make High Converting YouTube Thumbnail",
    views: "500K+ views",
    image: "/thumbnails/1765659063077-y3uduj21jk.png",
    stats: { ctr: "+31.3%", type: "CTR" }
  },
  {
    title: "Mind-Blowing Paradoxes That Will Keep You Awake",
    views: "1.5M views",
    image: "/thumbnails/cb108048d4ad3465d47d0104b31f7651_1765658717760.png",
    stats: { ctr: "+55.7%", type: "Engagement" }
  }
];

export function ThumbnailsShowcase() {
  return (
    <section className="py-24 bg-[#0f1115] overflow-hidden relative border-y border-white/5">
      
      {/* BACKGROUND (Consistent with Hero) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
        {/* Varied Glow: Top Right */}
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-orange-500/10 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/05 blur-[100px] rounded-full opacity-40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Stats */}
        <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-2xl mb-6">
                1,800,000+
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-4 text-balance">
                Thumbnails and mockups created by <br className="hidden md:block" /> creators & e-commerce brands worldwide
            </p>
        </div>

        {/* Video Grid - Completely Redesigned - Clean Analytics Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 max-w-7xl mx-auto">
            {VIDEOS.map((video, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group flex flex-col bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
                >
                    {/* Image Area - Clean view of the thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-[#050505]">
                        <Image 
                            src={video.image} 
                            alt={video.title} 
                            fill 
                            className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Subtle inner shadow for depth */}
                        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none" />
                    </div>

                    {/* Content Area - Analytics Dashboard Style */}
                    <div className="p-6 flex flex-col flex-grow">
                        {/* Title */}
                        <h3 className="text-white font-bold text-lg leading-snug mb-6 line-clamp-2 group-hover:text-primary transition-colors">
                            {video.title}
                        </h3>

                        {/* Stats Grid */}
                        <div className="mt-auto grid grid-cols-2 gap-4">
                            {/* Views Stat */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:bg-white/10 transition-colors">
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                                    Total Views
                                </p>
                                <p className="text-white font-bold text-xl tracking-tight">
                                    {video.views.split(' ')[0]}
                                </p>
                            </div>

                            {/* Performance Stat - Highlighted */}
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 group-hover:bg-green-500/20 transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] text-green-400 uppercase font-bold tracking-wider">
                                        {video.stats.type}
                                    </p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                </div>
                                <p className="text-green-400 font-bold text-3xl tracking-tight">
                                    {video.stats.ctr}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Creators Marquee - Redesigned for cleaner look on mobile */}
        <div className="max-w-5xl mx-auto pt-16 border-t border-[#1a1d23]">
            <div className="text-center mb-12">
                <span className="text-white/40 text-xs font-bold tracking-widest uppercase">
                    TRUSTED BY TOP CREATORS
                </span>
            </div>

            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div 
                    className="flex gap-4 md:gap-8 w-max"
                    animate={{ x: "-50%" }}
                    transition={{ 
                        repeat: Infinity, 
                        ease: "linear", 
                        duration: 40 
                    }}
                >
                    {[...CREATORS, ...CREATORS].map((creator, i) => (
                        <div 
                            key={i}
                            className="flex items-center gap-3 pl-2 pr-4 py-2 bg-[#16181d] border border-white/5 rounded-full shrink-0"
                        >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                                <Image 
                                    src={creator.avatar} 
                                    alt={creator.name} 
                                    fill 
                                    className="object-cover" 
                                    sizes="32px"
                                />
                            </div>
                            
                            <div className="flex flex-col text-left leading-none">
                                <div className="flex items-center gap-1">
                                    <span className="text-white font-semibold text-xs whitespace-nowrap">
                                        {creator.name}
                                    </span>
                                    <BadgeCheck className="w-3 h-3 text-blue-500" />
                                </div>
                                <span className="text-[10px] text-white/30 font-medium">
                                    {creator.subs}
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>

      </div>
    </section>
  );
}
