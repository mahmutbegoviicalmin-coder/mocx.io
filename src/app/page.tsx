import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Showcase } from "@/components/Showcase";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { SocialProofToast } from "@/components/SocialProofToast";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { StickyCTA } from "@/components/StickyCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0C0C0E] text-white selection:bg-blue-400/30 selection:text-white">
      <SocialProofToast />
      <ExitIntentPopup />
      <StickyCTA />
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Image 
              src="/light.png" 
              alt="Mocx Logo" 
              width={120} 
              height={40} 
              className="object-contain"
            />
          </div>
          
          <p className="text-white/30 text-sm mb-6">
            AI-powered creative studio for thumbnails, mockups, and art.
          </p>
          
          <div className="flex justify-center gap-8 text-sm text-white/40 mb-8">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Mocx. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
