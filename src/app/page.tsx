import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ToolsShowcase } from "@/components/ToolsShowcase";
import { ThumbnailsShowcase } from "@/components/ThumbnailsShowcase";
import { Pricing } from "@/components/Pricing";
import { WhyMocx } from "@/components/WhyMocx";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <ToolsShowcase />
      <ThumbnailsShowcase />
      <Testimonials />
      <WhyMocx />
      <Pricing />
      <FAQ />
      
          <footer className="py-8 border-t border-border mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p className="mb-4">© {new Date().getFullYear()} Mocx. All rights reserved.</p>
              <div className="flex justify-center gap-6">
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
                <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
              </div>
            </div>
          </footer>
    </main>
  );
}
