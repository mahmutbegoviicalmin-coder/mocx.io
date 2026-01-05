'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : (event as any).clientX;
    
    let pos = ((clientX - left) / width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    
    setSliderPosition(pos);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-24 bg-[#0F0F0F] relative overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    See the Difference
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    Turn ordinary screenshots into professional showcases instantly.
                </p>
            </div>

            <div 
                ref={containerRef}
                className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-col-resize select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                onClick={handleMove as any}
            >
                {/* After Image (Background) */}
                <Image
                    src="/after.jpg"
                    alt="After"
                    fill
                    className="object-cover"
                />

                {/* Before Image (Foreground - Clipped) */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <Image
                        src="/before.jpg"
                        alt="Before"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Slider Handle */}
                <div 
                    className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm z-10"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white/90 text-sm font-medium border border-white/10 pointer-events-none">
                    Before
                </div>
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-medium shadow-lg pointer-events-none">
                    After
                </div>
            </div>
        </div>
    </section>
  );
}

