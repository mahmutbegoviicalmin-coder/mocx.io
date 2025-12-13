'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Wand2,
  Maximize2,
  ScanLine,
  ArrowRight
} from 'lucide-react';
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
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentDemo = DEMOS[currentIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;

    // Reset state for new slide
    setPrompt("");
    setIsGenerating(false);
    setShowResult(false);

    const typeChar = () => {
      if (charIndex < currentDemo.prompt.length) {
        setPrompt(currentDemo.prompt.slice(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(typeChar, 40); 
      } else {
        // Typing finished -> Start Generating
        setTimeout(() => {
            setIsGenerating(true);
            setTimeout(() => {
                setIsGenerating(false);
                setShowResult(true);
                // Wait before moving to next slide
                timeout = setTimeout(() => {
                    setCurrentIndex((prev) => (prev + 1) % DEMOS.length);
                }, 4000);
            }, 2000); // Generating duration
        }, 500);
      }
    };

    timeout = setTimeout(typeChar, 1000);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-[700px] bg-[#030303] rounded-3xl overflow-hidden font-sans selection:bg-orange-500/30 group ring-1 ring-white/5 shadow-2xl flex flex-col items-center">
        
        {/* ==================== BACKGROUND AMBIENCE ==================== */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)]" />
           <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] rounded-full opacity-30" />
        </div>

        {/* ==================== SPOTLIGHT COMMAND BAR ==================== */}
        <div className="relative z-40 w-[90%] max-w-2xl mt-10">
           <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className={`
                relative flex items-center gap-3 p-2 pr-3 rounded-2xl border transition-all duration-300
                ${isGenerating 
                    ? 'bg-black/40 border-primary/30 shadow-[0_0_40px_-10px_rgba(255,84,0,0.2)] backdrop-blur-md' 
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 backdrop-blur-xl shadow-2xl'
                }
             `}
           >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 text-white/50">
                  <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-pulse text-primary' : ''}`} />
              </div>
              <input 
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  readOnly
                  placeholder="Describe your imagination..."
                  className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder:text-white/20 text-lg font-medium tracking-wide h-10 w-full"
              />
              <div className="flex items-center gap-2">
                 <AnimatePresence mode="wait">
                    {!isGenerating && (
                         <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold shadow-lg shadow-white/10"
                         >
                            <Sparkles className="w-4 h-4" />
                            Render
                         </motion.button>
                    )}
                 </AnimatePresence>
              </div>
           </motion.div>
        </div>


        {/* ==================== MAIN CREATIVE STAGE (CANVAS) ==================== */}
        <div className="flex-1 w-full flex items-center justify-center p-8 z-10 relative">
            
            {/* The Persistent Canvas Container */}
            <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
                
                <AnimatePresence mode="wait">
                    {isGenerating ? (
                        <motion.div
                           key="generating"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-20"
                        >
                             <div className="w-32 h-32 relative mb-4">
                                 <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin opacity-80" />
                                 <div className="absolute inset-3 border-r-2 border-white/30 rounded-full animate-spin-reverse opacity-60" />
                                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                             </div>
                             <p className="text-white/60 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Processing Visuals...</p>
                        </motion.div>
                    ) : showResult ? (
                        <motion.div
                            key={`result-${currentIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
                        >
                            {/* Reference Image Card */}
                            <div className="relative w-full md:flex-1 h-[200px] md:h-full md:max-h-[450px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all shadow-2xl">
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-10">
                                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Input</span>
                                </div>
                                <img 
                                    src={currentDemo.preImage} 
                                    alt="Reference" 
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale-[30%] group-hover:grayscale-0" 
                                />
                            </div>

                            {/* Arrow Indicator */}
                            <div className="flex md:flex-col items-center gap-2 text-white/20 rotate-90 md:rotate-0">
                                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <ArrowRight className="w-6 h-6 animate-pulse" />
                                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </div>

                            {/* Generated Image Card */}
                            <div className="relative w-full md:flex-1 h-[250px] md:h-full md:max-h-[450px] bg-black rounded-3xl border border-white/10 overflow-hidden group shadow-2xl shadow-primary/10 ring-1 ring-primary/20">
                                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-10 shadow-lg shadow-primary/20">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3" />
                                        Result
                                    </span>
                                </div>
                                <img 
                                    src={currentDemo.image} 
                                    alt="Generated" 
                                    className="w-full h-full object-cover" 
                                />
                                {/* Actions */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-black/70 border border-white/10 transition-colors">
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center z-10"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 relative group cursor-pointer hover:bg-white/10 transition-all">
                                 <ScanLine className="w-8 h-8 text-white/20 group-hover:text-white/50 transition-colors" />
                            </div>
                            <p className="text-white/30 text-sm font-medium">Ready to create</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>

    </div>
  );
}
