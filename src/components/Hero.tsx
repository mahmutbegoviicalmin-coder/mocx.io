import Link from 'next/link';
import { ArrowRight, Sparkles, Play, CheckCircle2 } from 'lucide-react';
import { HeroDemo } from './HeroDemo';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#0F0F0F]">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Radial Fade */}
        <div className="absolute inset-0 bg-[#0F0F0F] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_70%,black_100%)]"></div>
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-20 pointer-events-none" />
      </div>

      <div className="container relative z-10 px-4 mx-auto flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-8 hover:bg-white/10 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          v2.0 is now live
        </div>

        {/* Headline */}
        <h1 className="max-w-5xl mx-auto text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Make visuals that go <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">viral</span>. <br className="hidden md:block" />
          Instantly.
        </h1>

        {/* Subheadline */}
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 text-balance">
          AI-powered thumbnails, mockups, and content visuals built for Instagram, TikTok, YouTube & ads.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link 
            href="/sign-up" 
            className="group relative h-12 px-8 flex items-center justify-center gap-2 bg-white text-black rounded-full font-semibold transition-all hover:bg-gray-200 active:scale-95"
          >
            Start Creating
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          
          <Link 
            href="#demo"
            className="h-12 px-8 flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 rounded-full font-medium hover:bg-white/10 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Demo
          </Link>
        </div>

        {/* Social Proof Text */}
        <div className="flex items-center gap-6 text-sm text-white/30 mb-20 animate-in fade-in zoom-in duration-700 delay-500">
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white/20" />
                <span>Professional Quality</span>
            </div>
             <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white/20" />
                <span>Powered by AI</span>
            </div>
        </div>

        {/* App Window Preview */}
        <div className="relative w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
           {/* Glow behind the app */}
           <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
           
           <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden">
              {/* Window Controls */}
              <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                 <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                 <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              
              {/* Content */}
              <div className="p-1 md:p-2 bg-[#050505]">
                 <HeroDemo />
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
