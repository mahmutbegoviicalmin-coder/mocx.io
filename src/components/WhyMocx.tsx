"use client";

import { motion } from "framer-motion";
import { 
  Palette, 
  Layers, 
  Image as ImageIcon
} from "lucide-react";

const benefits = [
  {
    title: "Photorealistic visuals that build trust",
    text: "Show your product in real-life environments that feel authentic, familiar and instantly more trustworthy.",
    icon: ImageIcon,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400"
  },
  {
    title: "No photographer or studio needed",
    text: "Skip long photoshoots, props and setups. Drop a screenshot or image — Mocx handles the rest.",
    icon: Layers,
    color: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400"
  },
  {
    title: "Consistent brand visuals",
    text: "Keep your ads, product pages and social content aligned with reliable, professional-looking scenes.",
    icon: Palette,
    color: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-400"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 50,
      damping: 15
    }
  }
};

export function WhyMocx() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-600"
          >
            Why Mocx?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl md:text-3xl font-medium text-white/90 leading-tight"
          >
            Create mockups that look real. <br />
            Convert better and take seconds, <span className="bg-gradient-to-r from-primary to-red-600 text-transparent bg-clip-text">not hours</span>.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-300 shadow-[0_0_0_1px_rgba(0,0,0,0)] overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                  <benefit.icon className={`w-6 h-6 ${benefit.iconColor} group-hover:animate-pulse`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white/90 group-hover:text-white transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed group-hover:text-white/70 transition-colors">
                  {benefit.text}
                </p>
              </div>

              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
