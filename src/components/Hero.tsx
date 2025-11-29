import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Particles } from './Particles';
import { HeroDemo } from './HeroDemo';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-40 pb-20">
      {/* Background with Particles */}
      <div className="absolute inset-0 bg-[#0F0F0F] z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background z-10" />
        <Particles className="z-0 opacity-40" />
      </div>

      <div className="container relative z-20 max-w-6xl mx-auto text-center px-4 flex flex-col items-center">
        
        {/* Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 drop-shadow-2xl leading-[1.1]">
          Create <span className="bg-[#FF5A5F] text-white px-3 md:px-5 inline-block transform -skew-x-2">photorealistic</span> <br />
          mockups in seconds.
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-400 font-light italic w-full max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 opacity-80 whitespace-nowrap md:whitespace-normal">
          Turn your screenshots into stunning product showcases with one click.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 w-full max-w-md mx-auto">
          <Link 
            href="/sign-up" 
            className="group relative w-full sm:w-auto px-10 py-5 bg-[#FF5A5F] text-white rounded-full font-bold text-xl tracking-tight overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_-10px_rgba(255,90,95,0.6)] active:scale-95 border border-white/10"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Start Creating 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Link>
        </div>

        {/* Floating UI Element (Interactive Demo) */}
        <div className="mt-24 w-full relative max-w-[1400px] bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 shadow-2xl shadow-primary/10 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full opacity-50" />
          
          {/* Interactive Demo Component */}
          <HeroDemo />
          
          {/* Gradient overlay at bottom to blend with next section - adjusted for full height */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/50 to-transparent pointer-events-none z-30" />
        </div>

      </div>
    </section>
  );
}
