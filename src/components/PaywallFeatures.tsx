'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    title: 'AI Creative Studio',
    description: 'Transform your ideas into stunning visuals instantly. Our AI Creative Studio gives you the power to generate unlimited high-quality assets tailored to your brand identity.',
    video: '/tools/aimagegenerator.mp4',
    badge: 'NEW FEATURE',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    cta: 'Try it now',
    href: '/dashboard/art',
    align: 'left' // Text on left, video on right
  },
  {
    title: 'Mockup Studio',
    description: 'Showcase your designs in realistic environments. Create professional product mockups in seconds with our extensive library of high-quality scenes and models.',
    video: '/tools/mockupstudio.mp4',
    badge: 'NEW FEATURE',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    cta: 'Try it now',
    href: '/dashboard/mockup',
    align: 'right' // Text on right, video on left
  },
  {
    title: 'Thumbnail Maker',
    description: 'Stop guessing what works. Recreate viral thumbnails with your own content and style. Analyze, adapt, and outperform the competition with AI-driven insights.',
    video: '/tools/thumbnailgenerator.mp4',
    badge: 'NEW FEATURE',
    badgeColor: 'bg-green-500/10 text-green-400 border-green-500/20',
    cta: 'Try it now',
    href: '/dashboard/thumbnail',
    align: 'left'
  }
];

export function PaywallFeatures() {
  return (
    <div className="space-y-32 py-20">
      {FEATURES.map((feature, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`flex flex-col ${feature.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
        >
          {/* Text Content */}
          <div className="flex-1 space-y-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border tracking-wider ${feature.badgeColor}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {feature.badge}
            </div>

            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {feature.title}
            </h3>

            <p className="text-lg text-white/50 leading-relaxed max-w-xl">
              {feature.description}
            </p>

            <Link 
              href={feature.href}
              className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors font-medium group"
            >
              {feature.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Video/Visual Content */}
          <div className="flex-1 w-full">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0f1115] shadow-2xl shadow-black/50 aspect-video group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              
              <video 
                src={feature.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Optional overlay/vignette */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

