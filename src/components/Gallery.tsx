'use client';

import { MockupCard } from './MockupCard';
import { useRouter } from 'next/navigation';

const EXAMPLES = [
  {
    title: "Modern Coffee Cup",
    prompt: "A ceramic coffee cup on a marble table, morning sunlight, 4k realistic",
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Tote Bag Design",
    prompt: "Canvas tote bag hanging on a white wall, minimalist studio lighting",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Smartphone App",
    prompt: "iPhone 15 Pro floating in dark space, displaying a fitness app UI",
    imageUrl: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Cosmetic Bottle",
    prompt: "Amber glass dropper bottle on a mossy rock, nature background",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Laptop Workstation",
    prompt: "MacBook Pro on a wooden desk with plants, cozy atmosphere",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Branding Stationery",
    prompt: "Business cards and envelope mockup, overhead view, pastel colors",
    imageUrl: "https://images.unsplash.com/photo-1589384267710-7a25bef0a7c0?auto=format&fit=crop&w=800&q=80"
  }
];

export function Gallery() {
  const router = useRouter();

  const handleCardClick = (prompt: string) => {
    // Redirect to dashboard with the prompt pre-filled
    // We use encodeURIComponent to ensure the prompt is safe for the URL
    router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <section id="examples" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Inspiration</h2>
          <p className="text-muted-foreground">
            Click any example to start creating with this style.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAMPLES.map((example, idx) => (
            <div key={idx} onClick={() => handleCardClick(example.prompt)} className="cursor-pointer">
              <MockupCard 
                title={example.title}
                imageUrl={example.imageUrl}
                prompt={example.prompt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
