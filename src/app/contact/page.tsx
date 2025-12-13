import { Navbar } from "@/components/Navbar";
import { Contact } from "@/components/Contact";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      
      <div className="pt-20">
        <Contact />
      </div>

      <footer className="py-8 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-4">© {new Date().getFullYear()} Mocx. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

