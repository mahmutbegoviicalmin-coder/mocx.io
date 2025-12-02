'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEMOS = [
  {
    title: "Neon City",
    prompt: "Neon city billboard mockup, vivid and cinematic.",
    image: "/prompt1.jpg",
    preImage: "/preprompt1.jpg"
  },
  {
    title: "Headphones",
    prompt: "Premium athletic mockup highlighting the headphones.",
    image: "/prompt2.jpg",
    preImage: "/preprompt2.jpg"
  },
  {
    title: "Beauty Product",
    prompt: "Lux beauty mockup with soft studio lighting.",
    image: "/prompt3.jpg",
    preImage: "/preprompt3.jpg"
  },
  {
    title: "Premium Tech",
    prompt: "Premium Apple-style product mockup, dark studio.",
    image: "/prompt4.jpg",
    preImage: "/preprompt4.jpg"
  }
];

export function HeroDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showImage, setShowImage] = useState(false);

  const currentDemo = DEMOS[currentIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;

    // Reset state for new slide
    setDisplayPrompt("");
    setIsTyping(true);
    setShowImage(false);

    const typeChar = () => {
      if (charIndex < currentDemo.prompt.length) {
        setDisplayPrompt(currentDemo.prompt.slice(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(typeChar, 50); 
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setShowImage(true);
          timeout = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % DEMOS.length);
          }, 4000);
        }, 800);
      }
    };

    timeout = setTimeout(typeChar, 500);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div className="w-full max-w-[1300px] mx-auto px-6 md:px-12 py-12 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center min-h-[600px]">
        
        {/* Left Column: Content (45%) */}
        <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 z-10">
          <div className="mb-8 space-y-6 w-full max-w-lg">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20 shadow-[0_0_15px_-5px_var(--primary)]">
                Example
              </span>
              <motion.h3 
                key={currentDemo.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-semibold text-white mb-3 tracking-tight"
              >
                {currentDemo.title}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="text-lg text-white font-light"
              >
                What do you want to do?
              </motion.p>
            </div>

            <motion.div 
              className="relative w-full bg-black/40 hover:bg-black/50 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40 backdrop-blur-xl group transition-all duration-500 cursor-default overflow-hidden ring-1 ring-white/5"
              whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            >
              {/* Glass highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed mb-8 min-h-[80px] drop-shadow-sm">
                  &quot;{displayPrompt}
                  {isTyping && (
                    <span className="inline-block w-0.5 h-6 md:h-8 bg-primary ml-1 align-middle animate-pulse" />
                  )}
                  &quot;
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2 mb-4">
                   {isTyping ? (
                     <div className="flex items-center gap-2 text-sm text-white/40 font-medium">
                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                       Typing...
                     </div>
                   ) : !showImage ? (
                     <div className="flex items-center gap-2 text-sm text-primary font-medium">
                       <Sparkles className="w-4 h-4 animate-spin-slow" />
                       Generating...
                     </div>
                   ) : (
                     <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                       <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                       Ready
                     </div>
                   )}
                </div>

                {/* Uploaded Image Thumbnail */}
                <AnimatePresence>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative inline-flex items-center gap-3 bg-white/5 rounded-xl p-2 pr-4 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                      <img 
                        src={currentDemo.preImage} 
                        alt="Upload" 
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Upload</span>
                      <span className="text-xs text-white/90 font-medium">image.jpg</span>
                    </div>
                  </motion.div>
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Image Preview (55%) */}
        <div className="w-full lg:w-[55%] order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/80 bg-[#050505] border border-white/10 ring-1 ring-white/5">
            <AnimatePresence mode="wait">
              {showImage ? (
                <motion.div
                  key={`img-${currentIndex}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                >
                  <img 
                    src={currentDemo.image} 
                    alt={currentDemo.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Subtle Overlay for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40" />
                </motion.div>
              ) : (
                <motion.div
                  key={`placeholder-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center p-12 bg-gradient-to-br from-white/5 to-transparent"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                      <ImageIcon className="w-10 h-10 text-white/20" />
                    </div>
                  </div>
                  <p className="text-white/30 font-medium tracking-wide uppercase text-sm">Generating Preview...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
