'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Layers, 
  Zap, 
  Image as ImageIcon,
  Video,
  Palette,
  ArrowRight
} from 'lucide-react';

const tools = [
  {
    id: 'mockups',
    title: 'Product Mockups',
    description: 'Transform product images into photorealistic lifestyle shots. Perfect for e-commerce, ads, and social media.',
    icon: Layers,
    gradient: 'from-blue-500/10 via-blue-600/5 to-transparent',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    preview: '/prompt1.jpg',
    features: ['Realistic environments', 'No photography needed', 'Instant results']
  },
  {
    id: 'thumbnails',
    title: 'Thumbnail Maker',
    description: 'Create click-worthy thumbnails that boost your CTR. Designed for YouTube creators and content makers.',
    icon: Video,
    gradient: 'from-blue-400/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-blue-400/10',
    iconColor: 'text-blue-300',
    preview: '/thumbnails/45a72f2e-f64e-4840-b5ed-5effc216c045.jpg',
    features: ['High CTR designs', 'Face enhancement', '4K resolution']
  }
];

const benefits = [
  {
    title: 'Lightning Fast',
    description: 'Generate professional visuals in seconds, not hours.',
    icon: Zap,
    iconColor: 'text-blue-300'
  },
  {
    title: 'No Design Skills',
    description: 'AI handles the complexity. Just describe what you want.',
    icon: Palette,
    iconColor: 'text-blue-400'
  },
  {
    title: 'Production Ready',
    description: 'Export in 4K resolution with commercial usage rights.',
    icon: ImageIcon,
    iconColor: 'text-blue-200'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-[#0C0C0E]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/[0.07] blur-[150px] rounded-full" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            All-in-One Platform
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 tracking-tight">
            Two powerful tools,
            <br />
            <span className="font-serif italic text-blue-400">one creative studio</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Everything you need to create stunning visuals for your content, products, and brand.
          </p>
        </motion.div>

        {/* Tools Bento Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20 max-w-4xl mx-auto">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl border border-white/[0.06] bg-[#131316] overflow-hidden bento-card"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b ${tool.gradient} opacity-50`} />
              
              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${tool.iconBg} border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className={`w-7 h-7 ${tool.iconColor}`} />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {tool.title}
                </h3>
                <p className="text-white/50 leading-relaxed mb-6 flex-grow">
                  {tool.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Preview image */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/50 group-hover:border-white/20 transition-colors">
                  <Image
                    src={tool.preview}
                    alt={tool.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <benefit.icon className={`w-5 h-5 ${benefit.iconColor}`} />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                <p className="text-sm text-white/40">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a 
            href="/sign-up" 
            className="inline-flex items-center gap-2 btn-primary text-base group"
          >
            Start Creating
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

