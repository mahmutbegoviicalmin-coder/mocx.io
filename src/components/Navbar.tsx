'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 h-16' 
        : 'bg-transparent h-20'
    }`}>
      <div className="container flex h-full items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight group">
          <span className="text-white">Moc</span>
          <span className="text-primary group-hover:text-red-400 transition-colors">x</span>
        </Link>
        
        <div className="flex items-center gap-8 text-sm font-medium">
          <div className="hidden md:flex items-center gap-6 text-white/70">
            <Link href="/#examples" className="hover:text-white transition-colors hover:scale-105 transform duration-200">
              Examples
            </Link>
            <Link href="/#pricing" className="hover:text-white transition-colors hover:scale-105 transform duration-200">
              Pricing
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-white/90 hover:text-white transition-colors px-4 py-2">
                Log in
              </Link>
              <Link 
                href="/sign-up" 
                className="relative overflow-hidden bg-white text-black px-6 py-2.5 rounded-full font-semibold transition-all hover:bg-gray-200 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] active:scale-95"
              >
                Get Started
              </Link>
            </SignedOut>
            
            <SignedIn>
              <Link 
                href="/dashboard" 
                className="text-white hover:text-primary transition-colors mr-2"
              >
                Dashboard
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
