'use client';

import { useState } from 'react';
import { Upload, Info, Image as ImageIcon, X, Wand2, Layout, Square, Smartphone, Monitor, Zap, Lock, Download, Maximize2, ArrowLeft, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneration } from '@/hooks/useGeneration';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { TopUpModal } from '@/components/TopUpModal';

interface GenerationLayoutProps {
  mode: 'art' | 'mockup' | 'thumbnail';
  title: string;
  subtitle: string;
  icon: any;
}

const ASPECT_RATIOS = [
  { label: 'Instagram', sub: '1080x1080', value: '1:1', icon: Square },
  { label: 'Story / TikTok', sub: '1080x1920', value: '9:16', icon: Smartphone },
  { label: 'YouTube', sub: '1920x1080', value: '16:9', icon: Monitor },
  { label: 'Standard', sub: '4:3', value: '4:3', icon: Layout },
];

export function GenerationLayout({ mode, title, subtitle, icon: Icon }: GenerationLayoutProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const { generate, loading, uploading, progress, error, generatedImage } = useGeneration();
  
  // Use Proxy URL to enforce watermark if on trial
  const displayImageUrl = generatedImage 
      ? `/api/image-proxy?url=${encodeURIComponent(generatedImage)}` 
      : null;
      
  const { user } = useUser();
  const subscriptionStatus = user?.publicMetadata?.subscriptionStatus as string | undefined;
  const isTrial = subscriptionStatus === 'on_trial';
  
  const router = useRouter();

  // Credits Check
  const credits = user?.publicMetadata?.credits ? Number(user.publicMetadata.credits) : 0;
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan';
  
  // Restriction Logic
  const isProOrAgency = planName.toLowerCase().includes('pro') || planName.toLowerCase().includes('agency');
  
  let isLocked = false;

  if (isTrial) {
      // Trial User: Only 'thumbnail' allowed
      if (mode !== 'thumbnail') {
          isLocked = true;
      }
  } else {
      // Regular User: Art & Mockup require Pro/Agency
      if (mode === 'art' || mode === 'mockup') {
          if (!isProOrAgency) isLocked = true;
      }
      // For 'thumbnail' mode in regular plans, usually Starter is enough, so we don't lock it here if paid.
      // But if plan is 'Free Plan' (and not trial), everything is effectively locked by credit check, 
      // but let's lock UI too for clarity.
      if (planName === 'Free Plan') {
          isLocked = true;
      }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let newFiles = [...uploadedFiles, ...files];
    
    // Limits
    if (mode === 'mockup' && newFiles.length > 1) newFiles = [newFiles[newFiles.length - 1]];
    if (mode === 'thumbnail' && newFiles.length > 5) newFiles = newFiles.slice(0, 5);

    setUploadedFiles(newFiles);
    setFilePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    setFilePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
        router.push('/dashboard/billing');
        return;
    }
    if (credits < 1) {
        setShowTopUpModal(true);
        return;
    }
    
    generate({ prompt, imageFiles: uploadedFiles, aspectRatio, mode });
  };

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
        const res = await fetch('/api/enhance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        if (data.enhancedPrompt) {
            setPrompt(data.enhancedPrompt);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setEnhancing(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackMsg.trim()) return;
    setSendingFeedback(true);
    try {
        await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: feedbackMsg, type: 'bug' })
        });
        setFeedbackMsg('');
        setShowFeedback(false);
        alert('Thanks for your feedback!');
    } catch (e) {
        console.error(e);
    } finally {
        setSendingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-4 lg:p-6 relative overflow-hidden font-sans">
      <TopUpModal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} />
      
      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setShowFeedback(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Report Issue / Feedback
                </h3>
                <textarea 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 min-h-[120px] resize-none mb-4"
                    placeholder="Tell us what happened or what you'd like to see..."
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                />
                <button 
                    onClick={handleSendFeedback}
                    disabled={sendingFeedback || !feedbackMsg.trim()}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {sendingFeedback ? 'Sending...' : <>Send Feedback <Send className="w-4 h-4" /></>}
                </button>
            </div>
        </div>
      )}

      {/* Floating Feedback Button */}
      <button 
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] border border-white/10 p-3 rounded-full shadow-2xl text-white/50 hover:text-white hover:border-white/30 transition-all hover:scale-110"
        title="Report Issue"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-50" />

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-3rem)]">
        
        {/* Left Panel */}
        <div className="w-full lg:w-[460px] flex flex-col gap-6 lg:h-full lg:overflow-hidden shrink-0">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/5 rounded-[24px] p-6 shadow-2xl flex flex-col gap-6 h-full relative overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-[#1A1A1A] z-20 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                            <Icon className="w-5 h-5 text-primary" />
                            {title}
                        </h2>
                        <p className="text-xs text-white/40 font-medium">{subtitle}</p>
                    </div>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold text-white/80">{credits}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
              
              {/* LOCK OVERLAY */}
              {isLocked && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6 rounded-[2rem] border border-primary/20 shadow-2xl">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 animate-pulse">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {isTrial && mode !== 'thumbnail' ? 'Trial Restriction' : 'Pro Plan Required'}
                    </h3>
                    <p className="text-white/40 text-sm max-w-xs mb-6">
                        {isTrial && mode !== 'thumbnail' 
                            ? 'During the trial period, only the Thumbnail Creator is available. Upgrade to access Art & Mockup Studio.'
                            : 'This tool is exclusively available for Pro and Agency plan members.'
                        }
                    </p>
                    <Link href="/dashboard/billing" className="bg-primary hover:brightness-110 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-105">
                      View Plans
                    </Link>
                 </div>
              )}

              {/* Upload Section */}
              {mode !== 'art' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">
                            {mode === 'mockup' ? 'Product / Design' : 'Reference Images'}
                        </label>
                        <span className="text-[10px] text-white/20">
                            {mode === 'thumbnail' ? `${uploadedFiles.length}/5` : uploadedFiles.length > 0 ? 'Uploaded' : 'Required'}
                        </span>
                    </div>
                    
                    <div className="w-full">
                        {filePreviews.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {filePreviews.map((preview, idx) => (
                                    <div key={idx} className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 group shadow-lg">
                                        <img src={preview} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => removeFile(idx)} className="bg-red-500/80 p-2 rounded-lg text-white hover:scale-110 transition-transform">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {mode === 'thumbnail' && uploadedFiles.length < 5 && (
                                    <label className="relative aspect-video w-full border-2 border-dashed border-white/10 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center group">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-5 h-5 text-white/50" />
                                        </div>
                                        <span className="text-xs font-medium text-white/40 group-hover:text-white/80">Add Another</span>
                                    </label>
                                )}
                            </div>
                        ) : (
                            <label className="relative w-full h-48 border-2 border-dashed border-white/10 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center group bg-black/20">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple={mode === 'thumbnail'}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                                    <Upload className="w-7 h-7 text-white/40 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-sm font-bold text-white/80 group-hover:text-white">Click to Upload or Drag & Drop</p>
                                <p className="text-xs text-white/30 mt-1">
                                    {mode === 'thumbnail' ? 'Upload up to 5 images (JPG, PNG)' : 'Supports JPG, PNG (Max 5MB)'}
                                </p>
                            </label>
                        )}
                    </div>
                </div>
              )}

              {/* Aspect Ratio */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Format</label>
                <div className="grid grid-cols-4 gap-2">
                  {ASPECT_RATIOS.map((ratio) => {
                    const Icon = ratio.icon;
                    const isSelected = aspectRatio === ratio.value;
                    return (
                      <button
                        key={ratio.value}
                        type="button"
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all gap-1.5 h-[84px] ${
                          isSelected
                            ? 'bg-primary/10 border-primary/50 text-white shadow-[0_0_15px_-5px_var(--primary)]'
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold text-center leading-3">{ratio.label}</span>
                        <span className="text-[9px] opacity-50">{ratio.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt */}
              <div className="flex-1 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Prompt</label>
                    <button 
                        type="button" 
                        onClick={handleEnhance}
                        disabled={enhancing || !prompt.trim()}
                        className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50 hover:bg-white/5 px-2 py-1 rounded-lg"
                    >
                        <Wand2 className={`w-3 h-3 ${enhancing ? 'animate-spin' : ''}`} />
                        {enhancing ? 'Enhancing...' : 'Enhance Prompt'}
                    </button>
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                        mode === 'art' ? "A futuristic city floating in clouds..." :
                        mode === 'thumbnail' ? "YouTube thumbnail style, shocked face..." :
                        "Describe the scene..."
                    }
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 resize-none transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || uploading || isLocked}
                className="w-full bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl py-4 font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                 {loading ? 'Generating...' : uploading ? 'Uploading...' : 'Generate Magic'}
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
        <div className="flex-1 w-full lg:h-full min-h-[400px] mb-20 lg:mb-0">
          <div className={`w-full h-full bg-[#050505] border border-white/10 rounded-[24px] relative overflow-hidden shadow-2xl flex items-center justify-center transition-all ${
             generatedImage ? 'border-primary/20' : 'border-dashed border-white/5'
          }`}>
            {displayImageUrl ? (
              <div 
                className="relative w-full h-full flex items-center justify-center select-none"
                onContextMenu={(e) => e.preventDefault()} // Block Right Click context menu globally on container
              >
                <img 
                    src={displayImageUrl} 
                    className={`max-w-full max-h-full object-contain p-4 lg:p-12 shadow-2xl relative z-10 ${isTrial ? 'pointer-events-none' : ''}`} // Disable dragging if trial
                    onContextMenu={(e) => e.preventDefault()} // Extra safety
                    draggable={!isTrial}
                />
                
                {/* Background Blur */}
                <div className="absolute inset-0 z-0">
                    <img src={displayImageUrl} className="w-full h-full object-cover blur-[100px] opacity-30" />
                </div>
                
                <div className="absolute bottom-8 flex gap-2 z-20 bg-black/50 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                    {isTrial ? (
                        <Link href="/dashboard/billing" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:brightness-110 shadow-lg shadow-amber-900/20">
                             <Lock className="w-4 h-4" /> Unlock to Download
                        </Link>
                    ) : (
                        <button onClick={() => window.open(displayImageUrl, '_blank')} className="bg-white text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors">
                            <Download className="w-4 h-4" /> Download
                        </button>
                    )}
                </div>
              </div>
            ) : (
              <div className="text-center relative z-10 p-6">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-2xl">
                    <ImageIcon className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Create</h3>
                <p className="text-white/40 max-w-sm mx-auto text-sm">
                  Upload, Describe, and Generate.
                </p>
              </div>
            )}
            
            {loading && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-30">
                 <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                 <h3 className="text-xl font-bold text-white animate-pulse">{uploading ? 'Uploading...' : 'Creating...'}</h3>
                 <p className="text-white/40 text-sm mt-2">{Math.round(progress)}% Complete</p>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
