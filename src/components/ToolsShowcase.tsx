'use client';

import { motion } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Wand2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TOOLS = [
  {
    title: 'AI Creative Studio',
    description: 'Transform your ideas into stunning visuals instantly. Our AI Creative Studio gives you the power to generate unlimited high-quality assets tailored to your brand identity.',
    icon: Sparkles,
    gradient: 'from-purple-500/20 via-indigo-500/10 to-blue-500/5',
    border: 'hover:border-purple-500/30',
    videoPath: '/tools/aimagegenerator.mp4',
    badgeColor: 'bg-purple-500',
    link: '/dashboard/art'
  },
  {
    title: 'Mockup Studio',
    description: 'Showcase your designs in realistic environments. Create professional product mockups in seconds with our extensive library of high-quality scenes and models.',
    icon: ImageIcon,
    gradient: 'from-orange-500/20 via-amber-500/10 to-red-500/5',
    border: 'hover:border-orange-500/30',
    videoPath: '/tools/mockupstudio.mp4',
    badgeColor: 'bg-orange-500',
    link: '/dashboard/mockup'
  },
  {
    title: 'Thumbnail Recreator',
    description: 'Stop guessing what works. Recreate viral thumbnails with your own content and style. Analyze, adapt, and outperform the competition with AI-driven insights.',
    icon: Wand2,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/5',
    border: 'hover:border-emerald-500/30',
    videoPath: '/tools/thumbnailgenerator.mp4',
    badgeColor: 'bg-emerald-500',
    link: '/dashboard/thumbnail'
  }
];

export function ToolsShowcase() {
  return (
    <section className="py-24 bg-[#0f1115] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1200px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col gap-24 md:gap-32">
          {TOOLS.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
            >
              {/* Text Content */}
              <div className="flex-1 w-full text-center lg:text-left">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 ${index % 2 === 1 ? 'lg:ml-auto' : ''} mx-auto lg:mx-0 w-fit`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${tool.badgeColor} animate-pulse`} />
                    <span className="text-[11px] font-medium text-white/70 tracking-wide uppercase">New Feature</span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                    {tool.title}
                </h2>
                
                <p className="text-lg text-white/40 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                    {tool.description}
                </p>

                <Link 
                    href={tool.link}
                    className="inline-flex items-center gap-2 text-white font-semibold group hover:text-primary transition-colors"
                >
                    Try it now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Video Preview */}
              <div className="flex-1 w-full">
                <div className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[#16181d] shadow-2xl shadow-black/50 group hover:border-white/20 transition-all duration-500 aspect-video ${tool.border}`}>
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                    
                    {/* Video Container */}
                    <div className="relative h-full w-full">
                         {/* Grid Pattern */}
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-10" />
                        
                        <video 
                            src={tool.videoPath} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        
                        {/* Inner Shadow for Depth */}
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none z-20" />
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
