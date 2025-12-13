'use client';

import { GenerationLayout } from '@/components/dashboard/GenerationLayout';
import { Palette } from 'lucide-react';

export default function ArtPage() {
  return (
    <GenerationLayout 
      mode="art" 
      title="AI Art Generator" 
      subtitle="Turn text into stunning visuals"
      icon={Palette}
    />
  );
}


