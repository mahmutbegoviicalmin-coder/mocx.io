"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, CreditCard, Lock, Layers, Globe, Users } from "lucide-react";
import Image from "next/image";

const features = [
  { text: "AI-powered", icon: Zap, color: "text-yellow-400" },
  { text: "Commercial license included", icon: ShieldCheck, color: "text-green-400" },
  { text: "Fast, secure payments", icon: Lock, color: "text-blue-400" },
  { text: "Cancel anytime", icon: CreditCard, color: "text-blue-400" }
];

const brands = [
  { name: "Adobe", src: "/adobe1.png", className: "brightness-0 invert opacity-80 hover:opacity-100" },
  { name: "Shopify", src: "/shopify2.png", className: "brightness-0 invert opacity-80 hover:opacity-100" },
  { name: "Meta", src: "/meta.png", className: "brightness-0 invert opacity-80 hover:opacity-100" },
  { name: "WooCommerce", src: "/woocommerce.png", className: "brightness-0 invert opacity-80 hover:opacity-100" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 40, damping: 15 }
  }
};

export function Trust() {
  return (
    <section className="py-24 bg-black relative border-t border-white/5 overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 tracking-tight"
          >
            Trusted worldwide
          </motion.h2>

        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          {/* Feature Badges Row */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-20"
          >
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default select-none backdrop-blur-sm"
              >
                <div className={`p-1.5 rounded-full bg-white/5 ring-1 ring-white/10`}>
                  <f.icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <span className="text-sm md:text-base font-medium text-white/90">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Brand Logos */}
          <motion.div 
            variants={itemVariants} 
            className="pt-10 border-t border-white/5"
          >
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 px-4">
              {brands.map((brand, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="relative h-10 w-28 md:h-12 md:w-32 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  title={brand.name}
                >
                  <Image 
                    src={brand.src} 
                    alt={`${brand.name} logo`}
                    fill
                    className={`object-contain transition-all duration-300 ${brand.className}`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
