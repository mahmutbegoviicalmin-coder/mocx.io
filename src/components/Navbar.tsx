'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent">
      <div className="container flex h-16 md:h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative transition-opacity hover:opacity-80">
          <Image 
            src="/light.png" 
            alt="Mocx Logo" 
            width={120} 
            height={40} 
            className="object-contain"
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/#features" className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Features
          </Link>
          <Link href="/#pricing" className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Pricing
          </Link>
          <Link href="/contact" className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Contact
          </Link>
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link href="/sign-in" className="hidden md:block text-sm text-white/70 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
              Log in
            </Link>
            <Link 
              href="/sign-up" 
              className="text-sm bg-white text-black px-5 py-2.5 rounded-full font-semibold transition-all hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </Link>
          </SignedOut>
          
          <SignedIn>
            <Link 
              href="/dashboard" 
              className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#050507]/95 backdrop-blur-xl border-b border-white/5 p-4">
          <div className="flex flex-col gap-2">
            <Link 
              href="/#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Features
            </Link>
            <Link 
              href="/#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Contact
            </Link>
            <SignedOut>
              <Link 
                href="/sign-in" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                Log in
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
