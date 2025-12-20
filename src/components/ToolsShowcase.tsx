'use client';

import { motion } from 'framer-motion';
import { Play, Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react';

const TOOLS = [
  {
    title: 'AI Creative Studio',
    description: 'Generate unlimited creative assets with AI power.',
    icon: Sparkles,
    gradient: 'from-purple-500/20 via-indigo-500/10 to-blue-500/5',
    border: 'group-hover:border-purple-500/30'
  },
  {
    title: 'Mockup Studio',
    description: 'Professional product mockups in seconds.',
    icon: ImageIcon,
    gradient: 'from-orange-500/20 via-amber-500/10 to-red-500/5',
    border: 'group-hover:border-orange-500/30'
  },
  {
    title: 'Thumbnail Recreator',
    description: 'Recreate viral thumbnails with your own content.',
    icon: Wand2,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/5',
    border: 'group-hover:border-emerald-500/30'
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
                
                {/* Video Placeholder Area */}
                <div className={`relative aspect-[4/3] w-full bg-gradient-to-br ${tool.gradient} flex items-center justify-center overflow-hidden`}>
                  
                  {/* Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  
                  {/* Play Button / Interaction Hint */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-lg shadow-black/20">
                    <Play className="w-6 h-6 text-white fill-white ml-1 opacity-90" />
                  </div>

                  {/* Abstract UI Elements to look like software */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 text-[10px] text-white/50 font-mono">
                        REC
                    </div>
                  </div>

                  {/* Progress Bar Mockup */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                    <div className="h-full w-1/3 bg-white/20 group-hover:w-2/3 transition-all duration-1000 ease-out"></div>
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

