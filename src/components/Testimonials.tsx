"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Marcus J.",
    role: "YouTube Creator",
    initials: "MJ",
    color: "bg-blue-500",
    quote: "This tool is beautiful. Helping me draft concepts for my videos, same prompt with Midjourney and nothing worked! Mocx nailed it instantly."
  },
  {
    name: "Sarah Chen",
    role: "Shopify Brand Owner",
    initials: "SC",
    color: "bg-emerald-500",
    quote: "The tool is really useful. We cancelled our studio subscription and pay for this one. The product mockups look 100% real."
  },
  {
    name: "Alex T.",
    role: "Thumbnail Designer",
    initials: "AT",
    color: "bg-purple-500",
    quote: "Crazy results, thank you. The skin details in thumbnails are just insane. I mainly use it to enhance faces, and it works so well. Definitely adding to my workflow."
  },
  {
    name: "David Park",
    role: "Content Creator",
    initials: "DP",
    color: "bg-orange-500",
    quote: "This generator is dope. Turned my horrible quality images into 4K viral thumbnails. Crazy stuff right here. Good job."
  },
  {
    name: "Elena R.",
    role: "E-commerce Manager",
    initials: "ER",
    color: "bg-rose-500",
    quote: "Tried the AI mockup generator for our new collection. This is GAAAASSS!!! Saved us weeks of photography work."
  },
  {
    name: "James Wilson",
    role: "DTC Founder",
    initials: "JW",
    color: "bg-indigo-500",
    quote: "The 4K resolution looks exceptionally good. The first non-major AI subscription that is actually worth paying for. Our ads are performing 2x better."
  }
];

export function Testimonials() {
  return (
    <section className="py-32 bg-[#0f1115] relative overflow-hidden border-t border-white/5">
       {/* BACKGROUND (Consistent with Hero) */}
       <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
        {/* Varied Glow: Bottom Left & Top Right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/05 blur-[120px] rounded-full opacity-50" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[700px] h-[700px] bg-orange-500/10 blur-[120px] rounded-full opacity-60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 max-w-7xl mx-auto">
            <div className="max-w-2xl">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                >
                    Don't trust what we say, <br />
                    <span className="text-white/50">trust what you see.</span>
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-white/40 font-medium"
                >
                    See the great things our creators and brands say about us.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                <Link 
                    href="/sign-up" 
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all hover:bg-[#111]"
            >
              <div className="flex items-center gap-4 mb-6">
                {/* Avatar Placeholder */}
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {t.initials}
                </div>
                
                <div>
                    <h4 className="text-white font-bold text-base leading-none mb-1.5">
                        {t.name}
                    </h4>
                    <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                        {t.role}
                    </p>
                </div>
              </div>

              <p className="text-white/70 leading-relaxed text-sm md:text-base font-medium">
                "{t.quote}"
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
