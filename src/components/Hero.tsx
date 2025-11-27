import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Particles } from './Particles';
import { HeroDemo } from './HeroDemo';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background with Particles */}
      <div className="absolute inset-0 bg-[#0F0F0F] z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background z-10" />
        <Particles className="z-0 opacity-40" />
      </div>

      <div className="container relative z-20 max-w-5xl mx-auto text-center px-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-gray-300">Next-Gen AI Mockups</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          Design mockups <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-600">
            from the future.
          </span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Transform screenshots and ideas into photorealistic product renders instantly. 
          Powered by the advanced NanoBanana engine.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Link 
            href="/sign-up" 
            className="group relative px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,90,95,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Creating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <Link 
            href="/#examples" 
            className="px-8 py-4 rounded-full font-semibold text-lg text-white border border-white/10 hover:bg-white/5 transition-all backdrop-blur-sm"
          >
            View Gallery
          </Link>
        </div>

        {/* Floating UI Element (Interactive Demo) */}
        <div className="mt-20 relative mx-auto max-w-4xl aspect-video bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl border-t border-x border-white/10 p-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 rounded-full" />
          
          {/* Interactive Demo Component */}
          <HeroDemo />
          
          {/* Gradient overlay at bottom to blend with next section */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
