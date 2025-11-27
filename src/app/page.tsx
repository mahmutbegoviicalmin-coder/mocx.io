import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Pricing } from "@/components/Pricing";
import { HowItWorks } from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <Gallery />
      <Pricing />
      <HowItWorks />
      
      <footer className="py-8 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MockupGen. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
