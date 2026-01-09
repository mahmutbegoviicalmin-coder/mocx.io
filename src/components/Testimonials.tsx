"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

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
    quote: "Crazy results, thank you. The skin details in thumbnails are just insane. I mainly use it to enhance faces, and it works so well."
  },
  {
    name: "David Park",
    role: "Content Creator",
    initials: "DP",
    color: "bg-cyan-500",
    quote: "This generator is dope. Turned my horrible quality images into 4K viral thumbnails. Crazy stuff right here. Good job."
  },
  {
    name: "Elena R.",
    role: "E-commerce Manager",
    initials: "ER",
    color: "bg-pink-500",
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
    <section className="py-24 md:py-32 relative overflow-hidden border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="container relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Trusted by Creators
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-medium text-white mb-4 tracking-tight"
            >
              Don't trust what we say,
              <br />
              <span className="font-serif italic text-white/50">trust what you see.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/sign-up" 
              className="inline-flex items-center gap-2 btn-primary text-sm group"
            >
              Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-white/10 mb-4" />
              
              {/* Quote Text */}
              <p className="text-white/70 leading-relaxed text-sm mb-6">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">
                    {t.name}
                  </h4>
                  <p className="text-white/40 text-xs">
                    {t.role}
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
