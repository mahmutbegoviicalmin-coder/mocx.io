import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary tracking-tight">
          Mocx
        </Link>
        
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/#examples" className="hover:text-foreground transition-colors">
            Examples
          </Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          
          <SignedOut>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </SignedOut>
          
          <SignedIn>
            <Link 
              href="/dashboard" 
              className="text-foreground hover:text-primary transition-colors mr-4"
            >
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
