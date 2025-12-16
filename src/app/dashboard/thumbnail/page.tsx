'use client';

import { useState } from 'react';
import { 
  Upload, Info, Image as ImageIcon, X, Youtube, 
  Monitor, Square, Smartphone, Zap, Lock, Download, ArrowLeft,
  RefreshCw, User, Layout, 
  Flame, Mic, Briefcase, Swords, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useGeneration } from '@/hooks/useGeneration';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { TopUpModal } from '@/components/TopUpModal';

const PRESETS = [
  {
    id: 'viral',
    label: 'Viral / MrBeast',
    icon: Flame,
    description: 'High contrast, shocked expressions, saturated colors.',
    prompt: 'Viral YouTube Thumbnail style, High contrast, Exaggerated emotional expressions, Saturated bold colors, MrBeast style lighting'
  },
  {
    id: 'podcast',
    label: 'Podcast',
    icon: Mic,
    description: 'Professional studio setup, microphone focus.',
    prompt: 'High-end Podcast Thumbnail, Cinematic studio lighting, Professional focus, 4k crisp detail, Microphone visible'
  },
  {
    id: 'business',
    label: 'Business / Finance',
    icon: Briefcase,
    description: 'Trustworthy, clean, minimal, authoritative.',
    prompt: 'Business Professional Thumbnail, Clean minimal background, Authority and trust, Blue and white tones, High key lighting'
  },
  {
    id: 'drama',
    label: 'Drama / Commentary',
    icon: Swords,
    description: 'Darker tones, high tension, mysterious.',
    prompt: 'Drama Commentary Thumbnail, High tension, Darker moody lighting, Mystery, Strong rim lighting'
  },
  {
    id: 'clean',
    label: 'Clean / Tech',
    icon: Sparkles,
    description: 'Apple-style minimalism, soft gradients.',
    prompt: 'Tech Review Thumbnail, Clean minimal aesthetic, Soft gradients, Bright, Apple-style product photography'
  }
];

const ASPECT_RATIOS = [
    { label: 'YouTube', sub: '1920x1080', value: '16:9', icon: Monitor },
    { label: 'Shorts / TikTok', sub: '1080x1920', value: '9:16', icon: Smartphone },
    { label: 'Instagram', sub: '1080x1080', value: '1:1', icon: Square },
    { label: 'Portrait', sub: '4:5', value: '4:5', icon: Layout },
];

export default function ThumbnailPage() {
  const [originalThumb, setOriginalThumb] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  
  const [faceFiles, setFaceFiles] = useState<File[]>([]);
  const [facePreviews, setFacePreviews] = useState<string[]>([]);
  const [preserveIdentity, setPreserveIdentity] = useState(true);
  
  const [selectedPresetId, setSelectedPresetId] = useState<string>('viral');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const { generate, loading, uploading, progress, error, generatedImage } = useGeneration();
  const { user } = useUser();
  const router = useRouter();

  const credits = user?.publicMetadata?.credits ? Number(user.publicMetadata.credits) : 0;
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan';
  
  // RESTRICTION LOGIC:
  // Must be Pro or Agency plan to use this feature
  const isPro = planName.toLowerCase().includes('pro') || planName.toLowerCase().includes('agency');
  const isLocked = !isPro;
  
  const COST_PER_IMAGE = 5;

  const handleOriginalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalThumb(file);
      setOriginalPreview(URL.createObjectURL(file));
    }
  };

  const handleFaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let newFiles = [...faceFiles, ...files];
    if (newFiles.length > 2) newFiles = newFiles.slice(0, 2);

    setFaceFiles(newFiles);
    setFacePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const removeFace = (index: number) => {
    const newFiles = [...faceFiles];
    newFiles.splice(index, 1);
    setFaceFiles(newFiles);
    setFacePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
        // Redirect or show modal is handled by the overlay, but if they click somehow:
        router.push('/dashboard/billing');
        return;
    }

    if (credits < COST_PER_IMAGE) {
        setShowTopUpModal(true);
        return;
    }
    if (!originalThumb) {
        alert('Please upload an Original Thumbnail.');
        return;
    }

    const preset = PRESETS.find(p => p.id === selectedPresetId);
    if (!preset) return;

    // Construct Final Prompt
    let finalPrompt = `${preset.prompt}. `;
    if (prompt.trim()) {
        finalPrompt += `${prompt}. `;
    }
    finalPrompt += `Preserve facial identity, Ignore original clothing and logos, Remove visual clutter.`;
    
    const allFiles = [originalThumb, ...faceFiles];
    
    generate({ 
      prompt: finalPrompt, 
      imageFiles: allFiles, 
      aspectRatio, 
      mode: 'thumbnail' 
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-4 lg:p-6 relative overflow-hidden font-sans">
      <TopUpModal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} />
      
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-50" />

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-3rem)]">
        
        {/* Left Panel */}
        <div className="w-full lg:w-[500px] flex flex-col gap-6 lg:h-full lg:overflow-hidden shrink-0">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/5 rounded-[24px] p-6 shadow-2xl flex flex-col gap-6 h-full relative overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-[#1A1A1A] z-20 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                            <Youtube className="w-5 h-5 text-red-500" />
                            Thumbnail Recreator
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20">PRO</span>
                            <p className="text-xs text-white/40 font-medium">Recreate with AI Styles</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold text-white/80">{credits}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col relative">
              
              {/* LOCK OVERLAY FOR NON-PRO */}
              {isLocked && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6 rounded-[2rem] border border-primary/20 shadow-2xl h-full">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 animate-pulse">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Pro Plan Required</h3>
                    <p className="text-white/40 text-sm max-w-xs mb-6">
                        The Thumbnail Recreator is exclusively available for Pro and Agency plan members.
                    </p>
                    <Link href="/dashboard/billing" className="bg-primary hover:brightness-110 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-105">
                      Upgrade to Pro
                    </Link>
                 </div>
              )}

              {/* SECTION 1: THUMBNAIL UPLOAD */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-bold">1</span>
                        Original Thumbnail
                    </label>
                 </div>
                 
                 {!originalPreview ? (
                    <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer group flex flex-col items-center justify-center h-40">
                        <input type="file" accept="image/*" onChange={handleOriginalChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-6 h-6 text-white/30 group-hover:text-red-400" />
                        </div>
                        <p className="text-sm text-white/50 font-medium">Upload Thumbnail</p>
                        <p className="text-[10px] text-white/30 mt-1">We'll recreate this layout</p>
                    </div>
                 ) : (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-red-500/30 group w-full shadow-lg">
                        <img src={originalPreview} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setOriginalThumb(null); setOriginalPreview(null); }} className="absolute top-2 right-2 bg-black/60 p-2 rounded-lg text-white hover:bg-red-500/80 hover:scale-110 transition-all">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-red-500/90 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">ORIGINAL</div>
                    </div>
                 )}
              </div>

              {/* SECTION 2: FACE REFERENCES (OPTIONAL) */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">2</span>
                        Face Reference <span className="text-white/30 font-normal normal-case ml-1">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40">Identity Only</span>
                        <button 
                            type="button"
                            onClick={() => setPreserveIdentity(!preserveIdentity)}
                            className={`w-8 h-4 rounded-full transition-colors relative ${preserveIdentity ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${preserveIdentity ? 'left-4.5' : 'left-0.5'}`} />
                        </button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    {facePreviews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-blue-500/30 group">
                            <img src={preview} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeFace(idx)} className="absolute top-1 right-1 bg-black/60 p-1.5 rounded-lg text-white hover:bg-red-500/80 transition-all">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {faceFiles.length < 2 && (
                        <label className="relative aspect-square border-2 border-dashed border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer flex flex-col items-center justify-center group h-24">
                            <input type="file" accept="image/*" onChange={handleFaceChange} className="hidden" />
                            <User className="w-5 h-5 text-white/30 group-hover:text-blue-400 mb-1" />
                            <span className="text-[10px] font-medium text-white/40">Add Face</span>
                        </label>
                    )}
                 </div>
                 {faceFiles.length > 0 && preserveIdentity && (
                     <p className="text-[10px] text-blue-400/80 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                         We'll preserve these facial features but update clothing/style.
                     </p>
                 )}
              </div>

               {/* SECTION 3: THUMBNAIL TYPE & PLATFORM */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TYPE */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold">3</span>
                            Thumbnail Type
                        </label>
                        <div className="space-y-2">
                            {PRESETS.map((preset) => {
                                const isSelected = selectedPresetId === preset.id;
                                const Icon = preset.icon;
                                return (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => setSelectedPresetId(preset.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                                            isSelected 
                                            ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)]' 
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/50 group-hover:text-white'}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                                {preset.label}
                                            </div>
                                            <div className="text-[10px] text-white/30 line-clamp-1">{preset.description}</div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* PLATFORM */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[10px] font-bold">4</span>
                            Platform
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {ASPECT_RATIOS.map((ratio) => {
                                const Icon = ratio.icon;
                                const isSelected = aspectRatio === ratio.value;
                                return (
                                <button
                                    key={ratio.value}
                                    type="button"
                                    onClick={() => setAspectRatio(ratio.value)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all gap-1.5 h-[72px] ${
                                    isSelected
                                        ? 'bg-primary/10 border-primary/50 text-white shadow-[0_0_15px_-5px_var(--primary)]'
                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-[9px] font-bold text-center leading-tight">{ratio.label}</span>
                                </button>
                                );
                            })}
                        </div>
                    </div>
               </div>

              {/* SECTION 5: CUSTOM INSTRUCTIONS */}
              <div className="flex-1 flex flex-col space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 inline-flex items-center justify-center text-[10px] font-bold mr-2">5</span>
                    Specific Details / Text <span className="text-white/20 font-normal normal-case">(Optional)</span>
                </label>
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g. 'Add text saying $1 VS $1,000,000', 'Make the background explosion red', 'Subject holding a stack of cash'..."
                        className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 resize-none transition-all"
                    />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || uploading || isLocked}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl py-4 font-bold hover:brightness-110 transition-all shadow-xl shadow-red-500/20 disabled:opacity-50 mt-auto flex items-center justify-center gap-2"
              >
                 {loading ? 'Recreating Thumbnail...' : uploading ? 'Uploading...' : (
                    <>
                        Recreate Thumbnail 
                        <span className="bg-black/20 text-white/80 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-400 fill-current" /> 5
                        </span>
                    </>
                 )}
              </button>
            </form>
            
            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Result */}
        <div className="flex-1 w-full lg:h-full min-h-[500px] mb-20 lg:mb-0">
          <div className={`w-full h-full bg-[#050505] border border-white/10 rounded-[24px] relative overflow-hidden shadow-2xl flex items-center justify-center transition-all ${
             generatedImage ? 'border-primary/20' : 'border-dashed border-white/5'
          }`}>
            {generatedImage ? (
              <div className="relative w-full h-full flex flex-col">
                <div className="flex-1 relative flex items-center justify-center p-4 lg:p-12">
                     <img 
                        src={generatedImage} 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-xl relative z-10" 
                        alt="Generated Result"
                     />
                     
                     {/* Blurred Background */}
                     <div className="absolute inset-0 z-0">
                        <img src={generatedImage} className="w-full h-full object-cover blur-[100px] opacity-20" />
                     </div>
                </div>
                
                <div className="h-20 bg-[#1A1A1A] border-t border-white/10 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                             onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                             className="text-white/50 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" /> Regenerate
                        </button>
                    </div>
                    <button 
                        onClick={() => window.open(generatedImage, '_blank')} 
                        className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/90 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download Result
                    </button>
                </div>
              </div>
            ) : (
              <div className="text-center relative z-10 p-6">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-2xl">
                    <Youtube className="w-10 h-10 text-red-500/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Thumbnail Recreator</h3>
                <p className="text-white/40 max-w-sm mx-auto text-sm">
                  1. Upload Reference<br/>
                  2. Select Type & Platform<br/>
                  3. Add Custom Details (Optional)
                </p>
              </div>
            )}
            
            {loading && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-30">
                 <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6" />
                 <h3 className="text-xl font-bold text-white animate-pulse">{uploading ? 'Uploading Assets...' : 'Recreating Thumbnail...'}</h3>
                 <p className="text-white/40 text-sm mt-2">{Math.round(progress)}% Complete</p>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
