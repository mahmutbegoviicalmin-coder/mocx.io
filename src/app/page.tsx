import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { HowItWorks } from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <Pricing />
      <HowItWorks />
      
      <footer className="py-8 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-4">© {new Date().getFullYear()} Mocx. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <Link href="/legal#terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/legal#privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/legal#refund" className="hover:text-foreground transition-colors">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
