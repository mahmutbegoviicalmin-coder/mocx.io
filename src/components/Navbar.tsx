'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <>
    {/* Holiday Banner */}
    <div className="fixed top-0 left-0 w-full h-8 bg-gradient-to-r from-[#8B0000] via-[#FF0000] to-[#8B0000] text-white z-[60] flex items-center justify-center text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-lg shadow-red-900/50 px-4">
        <span className="md:hidden">HOLIDAY SALE: 34% OFF ALL PLANS</span>
        <span className="hidden md:inline">HOLIDAY SALE: SAVE 34% ON ALL PLANS <span className="mx-2 opacity-50">|</span> LIMITED TIME OFFER</span>
    </div>

    <nav className={`fixed top-8 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 h-16' 
        : 'bg-transparent h-20'
    }`}>
      <div className="container flex h-full items-center justify-between">
        <Link href="/" className="relative w-28 h-8 md:w-32 md:h-10 transition-opacity hover:opacity-80">
          <Image 
            src="/logotip.png" 
            alt="Mocx Logo" 
            fill 
            className="object-contain object-left"
            priority
          />
        </Link>
        
        <div className="flex items-center gap-8 text-sm font-medium">
          <div className="hidden md:flex items-center gap-6 text-white/70">
            <Link href="/#pricing" className="hover:text-white transition-colors hover:scale-105 transform duration-200 hover:bg-white/5 px-3 py-1.5 rounded-full">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors hover:scale-105 transform duration-200 hover:bg-white/5 px-3 py-1.5 rounded-full">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-white/90 hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-full hover:scale-105 duration-200">
                Log in
              </Link>
              <Link 
                href="/sign-up" 
                className="relative overflow-hidden bg-white text-black px-6 py-2.5 rounded-full font-semibold transition-all hover:bg-gray-200 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] active:scale-95 hover:scale-105 duration-200"
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
    </>
  );
}
