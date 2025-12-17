'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    views: "4,200,000+ views",
    image: "/thumbnails/45a72f2e-f64e-4840-b5ed-5effc216c045.jpg" 
  },
  {
    title: "I Survived 24 Hours in a Burning House Challenge",
    views: "8,500,000+ views",
    image: "/thumbnails/7fb5f477-b495-412b-947d-83bca1eb9fc7.jpg"
  },
  {
    title: "How to Build a $10M Business from Scratch",
    views: "1,100,000+ views",
    image: "/thumbnails/92e171a444d955a8f8fb3d0200522033_1765658486_zsa4a9bm.jpeg"
  },
  {
    title: "I Bought The World's Cheapest Private Yacht",
    views: "12,000,000+ views",
    image: "/thumbnails/97baab01-e8e3-4909-884d-1095e5f845eb.jpg"
  },
  {
    title: "The Insane History of The World's Richest City",
    views: "2,400,000+ views",
    image: "/thumbnails/1765659063077-y3uduj21jk.png"
  },
  {
    title: "Mind-Blowing Paradoxes That Will Keep You Awake",
    views: "1,500,000+ views",
    image: "/thumbnails/cb108048d4ad3465d47d0104b31f7651_1765658717760.png"
  }
];

export function ThumbnailsShowcase() {
  const [videoDuration, setVideoDuration] = useState(40);
  const [creatorDuration, setCreatorDuration] = useState(50);

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) {
            // Super fast on mobile (10x faster than desktop)
            setVideoDuration(5);
            setCreatorDuration(8);
        } else {
            setVideoDuration(40);
            setCreatorDuration(50);
        }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-24 bg-[#050505] overflow-hidden relative border-y border-white/5">
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,84,0,0.05),transparent_70%)] z-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Stats */}
        <div className="text-center mb-24">
            <h3 className="text-primary font-medium mb-4 text-lg tracking-wide">Videos Packaged with Mocx:</h3>
            <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-2xl">
                1,800,000+
            </h2>
        </div>

        {/* Video Marquee */}
        <div className="relative w-full mb-24 -mx-4 md:-mx-0 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div 
                key={videoDuration}
                className="flex gap-8 whitespace-nowrap pl-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                    repeat: Infinity, 
                    ease: "linear", 
                    duration: videoDuration 
                }}
            >
                {[...VIDEOS, ...VIDEOS, ...VIDEOS].map((video, i) => (
                    <div 
                        key={i} 
                        className="w-[320px] md:w-[380px] shrink-0"
                    >
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 mb-4 shadow-2xl">
                            <Image 
                                src={video.image} 
                                alt={video.title} 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                        <h4 className="text-white font-bold text-base leading-snug mb-1 truncate pr-2">
                            {video.title}
                        </h4>
                        <p className="text-white/40 text-sm font-medium">
                            {video.views}
                        </p>
                    </div>
                ))}
            </motion.div>
        </div>

        {/* Creators List */}
        <div className="text-center">
            <p className="text-white/80 text-lg mb-12">Some of the creators who use Mocx:</p>
            
            <div className="relative w-full overflow-hidden max-w-5xl mx-auto [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div 
                    key={creatorDuration}
                    className="flex gap-16 items-center"
                    animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                    repeat: Infinity, 
                    ease: "linear", 
                    duration: creatorDuration 
                }}
                >
                    {[...CREATORS, ...CREATORS, ...CREATORS].map((creator, i) => (
                        <div key={i} className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden relative border border-white/10">
                                <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white font-bold text-sm">{creator.name}</span>
                                    <BadgeCheck className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-white/40 text-xs">{creator.subs} subscribers</span>
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
