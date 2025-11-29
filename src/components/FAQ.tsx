"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I own the rights to the mockups I generate?",
    answer: "Yes. All mockups you generate with Mocx come with a commercial license. You can use them in your ads, stores, social media, presentations and client work."
  },
  {
    question: "What do I need to get started?",
    answer: "All you need is a screenshot, design export or product image. Upload it to Mocx, pick a scene and style, and we’ll generate a photorealistic mockup for you."
  },
  {
    question: "Is Mocx suitable for e-commerce and dropshipping?",
    answer: "Absolutely. Mocx is built with e-commerce in mind. Use your mockups on Shopify, WooCommerce, landing pages, marketplaces and ad platforms like Meta, TikTok and Google."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes. You can upgrade, downgrade or cancel your subscription at any time. There are no long-term contracts or hidden fees."
  },
  {
    question: "Do you offer a pay-as-you-go option?",
    answer: "Yes. If you don’t need a full subscription, you can use Mocx on a pay-as-you-go basis and only pay for the mockups you generate."
  },
  {
    question: "Will there be watermarks on my images?",
    answer: "Mockups generated on paid plans are delivered without watermarks and are ready for commercial use."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Frequently asked questions
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-medium pr-8">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground">
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

