'use client';

import { GenerationLayout } from '@/components/dashboard/GenerationLayout';
import { Layers } from 'lucide-react';

export default function MockupPage() {
  return (
    <GenerationLayout 
      mode="mockup" 
      title="Mockup Studio" 
      subtitle="Place your design in realistic scenes"
      icon={Layers}
    />
  );
}


