'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play } from 'lucide-react';

const THUMBNAILS = [
  '/thumbnails/1765659063077-y3uduj21jk.png',
  '/thumbnails/45a72f2e-f64e-4840-b5ed-5effc216c045.jpg',
  '/thumbnails/7fb5f477-b495-412b-947d-83bca1eb9fc7.jpg',
  '/thumbnails/92e171a444d955a8f8fb3d0200522033_1765658486_zsa4a9bm.jpeg',
  '/thumbnails/97baab01-e8e3-4909-884d-1095e5f845eb.jpg',
  '/thumbnails/cb108048d4ad3465d47d0104b31f7651_1765658717760.png',
  '/thumbnails/d7855857-639e-47c2-af3d-5f0ae1d95834.png'
];

export function ThumbnailsShowcase() {
  return (
    <section className="py-24 bg-[#050505] overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] z-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-16 relative z-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
           Viral <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Thumbnails</span> in Seconds
        </h2>
        <p className="text-white/40 text-lg max-w-3xl mx-auto whitespace-normal md:whitespace-nowrap">
           Stop wasting hours in Photoshop. Generate click-worthy YouTube thumbnails instantly.
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative flex w-full">
         <motion.div 
            className="flex gap-6 whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ 
                repeat: Infinity, 
                ease: "linear", 
                duration: 20 
            }}
         >
            {[...THUMBNAILS, ...THUMBNAILS, ...THUMBNAILS].map((src, i) => (
                <div 
                    key={i} 
                    className="relative w-[300px] md:w-[400px] aspect-video rounded-2xl overflow-hidden border border-white/10 shrink-0 group cursor-pointer"
                >
                    <Image 
                        src={src} 
                        alt={`Thumbnail ${i}`} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:opacity-0 transition-opacity flex items-center justify-center backdrop-blur-none">
                        
                    </div>
                </div>
            ))}
         </motion.div>
      </div>

    </section>
  );
}

