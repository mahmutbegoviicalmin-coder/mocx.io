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
    title: "I Trained Like Cristiano Ronaldo for 100 Days",
    views: "4.2M views",
    image: "/thumbnails/45a72f2e-f64e-4840-b5ed-5effc216c045.jpg",
    stats: { ctr: "+14.2%", type: "CTR" }
  },
  {
    title: "I Survived 24 Hours in a Burning House",
    views: "8.5M views",
    image: "/thumbnails/7fb5f477-b495-412b-947d-83bca1eb9fc7.jpg",
    stats: { ctr: "+18.5%", type: "CTR" }
  },
  {
    title: "How to Build a $10M Business from Scratch",
    views: "1.1M views",
    image: "/thumbnails/92e171a444d955a8f8fb3d0200522033_1765658486_zsa4a9bm.jpeg",
    stats: { ctr: "+9.8%", type: "Retention" }
  },
  {
    title: "I Bought The World's Cheapest Private Yacht",
    views: "12M views",
    image: "/thumbnails/97baab01-e8e3-4909-884d-1095e5f845eb.jpg",
    stats: { ctr: "+22.1%", type: "CTR" }
  },
  {
    title: "The Insane History of The World's Richest City",
    views: "2.4M views",
    image: "/thumbnails/1765659063077-y3uduj21jk.png",
    stats: { ctr: "+11.3%", type: "CTR" }
  },
  {
    title: "Mind-Blowing Paradoxes That Will Keep You Awake",
    views: "1.5M views",
    image: "/thumbnails/cb108048d4ad3465d47d0104b31f7651_1765658717760.png",
    stats: { ctr: "+15.7%", type: "Engagement" }
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

        {/* Video Grid - Completely Redesigned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24 max-w-7xl mx-auto">
            {VIDEOS.map((video, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group relative rounded-2xl overflow-hidden bg-[#16181d] border border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl"
                >
                    {/* Image Container with Overlay */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                        <Image 
                            src={video.image} 
                            alt={video.title} 
                            fill 
                            className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        {/* Gradient Overlay - Always visible but stronger at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                        
                        {/* Top Right Badge */}
                        <div className="absolute top-4 right-4 z-20">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                    {video.stats.type} <span className="text-green-400">{video.stats.ctr}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content - Overlapping the image bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                         <div className="mb-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Viral Analysis</span>
                         </div>
                         
                        <h3 className="text-white font-bold text-lg leading-snug mb-2 line-clamp-2 drop-shadow-md group-hover:text-white transition-colors">
                            {video.title}
                        </h3>
                        
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4 group-hover:border-white/20 transition-colors">
                            <span className="text-white/60 text-xs font-medium flex items-center gap-1.5">
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                                Verified Result
                            </span>
                            <span className="text-white font-bold text-sm tracking-tight">
                                {video.views}
                            </span>
                        </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl pointer-events-none transition-colors duration-500" />
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
                                <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
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
