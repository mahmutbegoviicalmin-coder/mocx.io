'use client';

import { motion } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react';
import Image from 'next/image';

const TOOLS = [
  {
    title: 'AI Creative Studio',
    description: 'Generate unlimited creative assets with AI power.',
    icon: Sparkles,
    gradient: 'from-purple-500/20 via-indigo-500/10 to-blue-500/5',
    border: 'group-hover:border-purple-500/30',
    gifPath: '/tools/ai-creative-studio.gif'
  },
  {
    title: 'Mockup Studio',
    description: 'Professional product mockups in seconds.',
    icon: ImageIcon,
    gradient: 'from-orange-500/20 via-amber-500/10 to-red-500/5',
    border: 'group-hover:border-orange-500/30',
    gifPath: '/tools/mockup-studio.gif'
  },
  {
    title: 'Thumbnail Recreator',
    description: 'Recreate viral thumbnails with your own content.',
    icon: Wand2,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/5',
    border: 'group-hover:border-emerald-500/30',
    gifPath: '/tools/thumbnail-recreator.gif'
  }
];

export function ToolsShowcase() {
  return (
    <section className="py-24 bg-[#0f1115] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[500px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TOOLS.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className={`h-full flex flex-col bg-[#111318] border border-white/5 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${tool.border}`}>
                
                {/* Video Placeholder Area - Now displaying GIF */}
                <div className={`relative aspect-[4/3] w-full bg-gradient-to-br ${tool.gradient} flex items-center justify-center overflow-hidden`}>
                  
                  {/* Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none z-10"></div>
                  
                  {/* GIF Display */}
                  <div className="relative w-full h-full">
                    {/* Using unoptimized for GIFs to ensure they play correctly */}
                    <Image 
                      src={tool.gifPath} 
                      alt={tool.title}
                      fill
                      className="object-cover"
                      unoptimized 
                    />
                    
                    {/* Fallback overlay in case GIF is missing or loading (optional aesthetic touch) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Minimal Status Indicator */}
                  <div className="absolute top-4 right-4 z-20 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] text-white/70 font-medium tracking-wide">LIVE</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 relative bg-[#111318] flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/80">
                        <tool.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{tool.title}</h3>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
