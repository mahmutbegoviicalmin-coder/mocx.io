import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Particles } from './Particles';
import { HeroDemo } from './HeroDemo';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Background with Particles */}
      <div className="absolute inset-0 bg-[#0F0F0F] z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background z-10" />
        <Particles className="z-0 opacity-40" />
      </div>

      <div className="container relative z-20 max-w-6xl mx-auto text-center px-4 flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:bg-white/10 transition-colors cursor-default">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Mocx AI Studio</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 drop-shadow-2xl">
          Design mockups <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-500 animate-gradient-x">
            from the future.
          </span>
        </h1>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 w-full max-w-md mx-auto">
          <Link 
            href="/sign-up" 
            className="group relative w-full px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.6)] active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Creating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Floating UI Element (Interactive Demo) */}
        <div className="mt-24 w-full relative max-w-5xl aspect-video bg-gradient-to-b from-white/5 to-transparent rounded-t-3xl border-t border-x border-white/10 p-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 shadow-2xl shadow-primary/10">
          <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full opacity-50" />
          
          {/* Interactive Demo Component */}
          <HeroDemo />
          
          {/* Gradient overlay at bottom to blend with next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-30" />
        </div>

      </div>
    </section>
  );
}
