'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { BadgeCheck, TrendingUp, Eye } from 'lucide-react';

const CREATORS = [
  { name: 'IShowSpeed', subs: '33M+', avatar: '/creators/i-show-speed-1400x825-1.jpg' },
  { name: 'Khaby Lame', subs: '162M+', avatar: '/creators/Khaby_Lame_Web-scaled.jpg' },
  { name: 'Veritasium', subs: '17M+', avatar: '/creators/Veritasium.jpg' },
  { name: 'Chad Wild Clay', subs: '15M+', avatar: '/creators/Chad Wild Clay.jpg' },
  { name: 'Young Swagon', subs: '8M+', avatar: '/creators/Young Swagon .jpg' },
  { name: 'Dyler | دايلر', subs: '7M+', avatar: '/creators/dyler.jpg' },
  { name: 'Poke', subs: '5M+', avatar: '/creators/poke.jpg' },
  { name: 'GaryVee', subs: '4.4M+', avatar: '/creators/gary-v.jpg' },
];

const EXAMPLES = [
  {
    title: "I Trained Like Cristiano Ronaldo for 200 Days",
    views: "4.2M",
    type: "Thumbnail",
    image: "/thumbnails/45a72f2e-f64e-4840-b5ed-5effc216c045.jpg",
    metric: "+34.2%",
    metricLabel: "CTR Increase"
  },
  {
    title: "Premium Product Photography",
    views: "8.5M",
    type: "Mockup",
    image: "/thumbnails/92e171a444d955a8f8fb3d0200522033_1765658486_zsa4a9bm.jpeg",
    metric: "2x",
    metricLabel: "Sales Boost"
  },
  {
    title: "AI-Generated Concept Art",
    views: "1.1M",
    type: "AI Art",
    image: "/thumbnails/d7855857-639e-47c2-af3d-5f0ae1d95834.png",
    metric: "10sec",
    metricLabel: "Generation Time"
  },
  {
    title: "Viral YouTube Thumbnail",
    views: "12M",
    type: "Thumbnail",
    image: "/thumbnails/97baab01-e8e3-4909-884d-1095e5f845eb.jpg",
    metric: "+41.1%",
    metricLabel: "CTR Increase"
  },
  {
    title: "E-commerce Product Shot",
    views: "500K+",
    type: "Mockup",
    image: "/thumbnails/cb108048d4ad3465d47d0104b31f7651_1765658717760.png",
    metric: "3x",
    metricLabel: "Conversion Rate"
  },
  {
    title: "Creative Visual Design",
    views: "1.5M",
    type: "AI Art",
    image: "/thumbnails/1765659063077-y3uduj21jk.png",
    metric: "Unique",
    metricLabel: "One-of-a-Kind"
  }
];

export function Showcase() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden border-t border-white/[0.04] bg-[#0C0C0E]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.06] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/[0.05] blur-[120px] rounded-full" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="container relative z-10">
        {/* Stats Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter mb-6">
            <span className="font-serif italic">1.8M</span><span className="text-blue-400 font-bold">+</span>
          </h2>
          <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto">
            Visuals created by creators and brands worldwide
          </p>
        </motion.div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {EXAMPLES.map((example, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#131316] hover:border-white/[0.12] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={example.image}
                  alt={example.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-transparent" />
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    example.type === 'Thumbnail' ? 'bg-blue-400/10 text-blue-300 border border-blue-400/20' :
                    example.type === 'Mockup' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                    'bg-blue-300/10 text-blue-200 border border-blue-300/20'
                  }`}>
                    {example.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-semibold text-base mb-4 line-clamp-1 group-hover:text-blue-300 transition-colors">
                  {example.title}
                </h3>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Eye className="w-3 h-3 text-white/40" />
                      <span className="text-[10px] text-white/40 uppercase font-medium tracking-wider">Views</span>
                    </div>
                    <p className="text-white font-bold text-lg">{example.views}</p>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400/80 uppercase font-medium tracking-wider">{example.metricLabel}</span>
                    </div>
                    <p className="text-emerald-400 font-bold text-lg">{example.metric}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Creators Marquee */}
        <div className="pt-16 border-t border-white/[0.04]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-white/30 text-xs font-bold tracking-[0.2em] uppercase">
              Trusted by Top Creators
            </span>
          </motion.div>

          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <motion.div 
              className="flex gap-4 w-max"
              animate={{ x: "-50%" }}
              transition={{ 
                repeat: Infinity, 
                ease: "linear", 
                duration: 30 
              }}
            >
              {[...CREATORS, ...CREATORS].map((creator, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.02] border border-white/[0.04] rounded-full shrink-0 hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                    <Image 
                      src={creator.avatar} 
                      alt={creator.name} 
                      fill 
                      className="object-cover" 
                      sizes="32px"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-medium text-sm whitespace-nowrap">
                      {creator.name}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white/40 text-xs font-medium">
                    {creator.subs}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

