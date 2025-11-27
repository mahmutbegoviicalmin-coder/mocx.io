'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEMOS = [
  {
    title: "Coffee Shop",
    prompt: "Put my logo on this white coffee cup.",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80" 
  },
  {
    title: "Website",
    prompt: "Show my website screenshot on the laptop screen.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Merchandise",
    prompt: "Add this flower design to the tote bag.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Mobile App",
    prompt: "Place my app screenshot on the iPhone.",
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1000&q=80"
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
        // Slower, friendlier typing speed
        timeout = setTimeout(typeChar, 50); 
      } else {
        setIsTyping(false);
        // Wait a bit before showing image
        timeout = setTimeout(() => {
          setShowImage(true);
          // Wait before moving to next slide
          timeout = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % DEMOS.length);
          }, 4000); // View time
        }, 800);
      }
    };

    // Start typing after a small initial delay
    timeout = setTimeout(typeChar, 500);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div className="w-full h-full bg-[#0F0F0F] rounded-2xl overflow-hidden flex flex-col relative border border-white/10 shadow-2xl ring-1 ring-white/5">
      
      {/* Simple Top Bar */}
      <div className="h-14 border-b border-white/5 bg-black/20 flex items-center px-6">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <div className="text-sm font-medium text-gray-400">New Mockup</div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Panel: Simple Input */}
        <div className="w-full md:w-2/5 bg-card/30 p-8 flex flex-col border-r border-white/5 justify-center">
          
          <div className="mb-6">
             <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
               Example
             </span>
             <h3 className="text-xl font-bold text-white mb-1">{currentDemo.title}</h3>
             <p className="text-sm text-muted-foreground">What do you want to do?</p>
          </div>

          {/* Friendly Input Box */}
          <div className="relative bg-white/5 rounded-xl p-4 border border-white/10 min-h-[120px]">
             <div className="text-lg text-gray-200 font-medium leading-relaxed">
               {displayPrompt}
               {isTyping && (
                 <span className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle animate-pulse" />
               )}
             </div>
             
             {/* Upload Icon Hint */}
             {!isTyping && (
                <div className="absolute bottom-4 right-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center animate-in fade-in">
                     <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
             )}
          </div>

          {/* Simple Status */}
          <div className="mt-6 flex items-center gap-3">
             {isTyping ? (
               <>
                 <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                 <span className="text-sm text-muted-foreground">Typing...</span>
               </>
             ) : showImage ? (
               <>
                 <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                   <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <span className="text-sm text-green-400 font-medium">Done!</span>
               </>
             ) : (
               <>
                 <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                 <span className="text-sm text-primary">Creating mockup...</span>
               </>
             )}
          </div>
        </div>

        {/* Right Panel: Image Result */}
        <div className="w-full md:w-3/5 relative bg-black/40 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {showImage ? (
              <motion.div
                key={`img-container-${currentIndex}`}
                className="relative w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.img
                  src={currentDemo.image}
                  alt="Mockup Result"
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <motion.div
                key={`placeholder-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 p-8 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                   <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground font-medium">Preview Area</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
