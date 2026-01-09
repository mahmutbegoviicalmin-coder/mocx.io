"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What can I create with Mocx?",
    answer: "Mocx is an all-in-one AI creative studio. You can create product mockups for e-commerce, viral thumbnails for YouTube and social media, and unique AI-generated art from text prompts."
  },
  {
    question: "Do I own the rights to what I create?",
    answer: "Yes. All visuals you generate with Mocx come with a commercial license. You can use them in your ads, stores, social media, presentations and client work."
  },
  {
    question: "What do I need to get started?",
    answer: "Just upload an image or describe what you want. For mockups, upload a product photo. For thumbnails, upload a face or scene. For AI art, just type a prompt."
  },
  {
    question: "Is Mocx suitable for e-commerce and content creators?",
    answer: "Absolutely. Mocx is built for both e-commerce brands and content creators. Use mockups for Shopify, WooCommerce, and marketplaces. Use thumbnails for YouTube, TikTok, and social media."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes. You can upgrade, downgrade or cancel your subscription at any time from your dashboard. There are no long-term contracts or hidden fees."
  },
  {
    question: "Will there be watermarks on my images?",
    answer: "Images generated on paid plans are delivered without watermarks in full resolution and are ready for commercial use."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-6">
            <HelpCircle className="w-3 h-3" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl text-white mb-4">
            <span className="font-medium">Frequently asked </span>
            <span className="font-serif italic text-blue-400">questions</span>
          </h2>
          <p className="text-white/40">
            Everything you need to know about Mocx
          </p>
        </motion.div>

        {/* Questions */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index 
                  ? 'bg-white/[0.05] border border-white/10' 
                  : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none group"
              >
                <span className={`font-medium pr-8 transition-colors ${
                  openIndex === index ? 'text-white' : 'text-white/80 group-hover:text-white'
                }`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  openIndex === index 
                    ? 'bg-blue-500/20 text-blue-400 rotate-180' 
                    : 'bg-white/5 text-white/40 group-hover:bg-white/10'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-white/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
