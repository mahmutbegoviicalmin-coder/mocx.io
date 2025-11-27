'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function HowItWorks() {
  const [isOpen, setIsOpen] = useState(false);

  // Open automatically after 2 seconds once, or trigger by button
  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenHowItWorks');
    if (!hasSeen) {
        const timer = setTimeout(() => setIsOpen(true), 2000);
        return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenHowItWorks', 'true');
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-40"
    >
      <span className="sr-only">How it works</span>
      ?
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 relative">
          <button 
            onClick={close}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="text-2xl font-bold mb-6">How MockupGen Works</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h4 className="font-semibold mb-1">Describe or Upload</h4>
                <p className="text-sm text-muted-foreground">Enter a text prompt or upload a reference screenshot of your website/design.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h4 className="font-semibold mb-1">AI Generation</h4>
                <p className="text-sm text-muted-foreground">Our advanced NanoBanana model analyzes your request and builds a photorealistic scene.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h4 className="font-semibold mb-1">Download</h4>
                <p className="text-sm text-muted-foreground">Get your high-resolution mockup instantly, ready for your portfolio or marketing.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={close}
            className="w-full mt-8 bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

