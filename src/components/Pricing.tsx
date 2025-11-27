'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-32 px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your creative needs. Cancel anytime.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8 bg-white/5 inline-flex p-1 rounded-full backdrop-blur-md border border-white/10">
            <button 
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
            >
              Yearly <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full ml-1">-10%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {/* Starter */}
          <PricingCard 
            title="Starter"
            price={annual ? 26 : 29}
            features={["100 Images/mo", "Standard Speed", "Commercial License", "Basic Support"]}
            delay={0}
          />

          {/* Pro */}
          <PricingCard 
            title="Pro"
            price={annual ? 62 : 69}
            features={["300 Images/mo", "Fast Generation", "Priority Support", "Website Screenshot", "High Resolution"]}
            highlighted
            delay={100}
          />

          {/* Agency */}
          <PricingCard 
            title="Agency"
            price={annual ? 179 : 199}
            features={["1000 Images/mo", "Max Speed", "API Access", "24/7 Support", "Custom Branding"]}
            delay={200}
          />
        </div>
        
        <div className="mt-16 text-center border-t border-white/10 pt-8 max-w-2xl mx-auto">
           <p className="text-muted-foreground">
             Just need a few? <span className="text-white font-medium">Pay as you go</span> available at $0.50 per image.
           </p>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ title, price, features, highlighted = false, delay = 0 }: { title: string, price: number, features: string[], highlighted?: boolean, delay?: number }) {
  return (
    <div 
      className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all duration-300 hover:transform hover:-translate-y-2 ${
        highlighted 
          ? 'bg-white/10 border-primary/50 shadow-[0_0_50px_-10px_rgba(255,90,95,0.3)] z-10 scale-105' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-red-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className={`text-lg font-medium ${highlighted ? 'text-primary' : 'text-muted-foreground'}`}>{title}</h3>
        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-4xl font-bold text-white">${price}</span>
          <span className="text-muted-foreground">/mo</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlighted ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>
              <Check className="w-3 h-3" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <button 
        className={`w-full py-3 rounded-xl font-semibold transition-all ${
          highlighted 
            ? 'bg-primary text-white hover:brightness-110 shadow-lg' 
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        Get Started
      </button>
    </div>
  );
}
