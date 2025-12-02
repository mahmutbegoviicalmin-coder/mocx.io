'use client';

import { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, Info, Image as ImageIcon, X, Wand2, Layout, Square, Smartphone, Monitor, Zap, Lock, Download, Share2, Maximize2 } from 'lucide-react';
import { TopUpModal } from '@/components/TopUpModal';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ASPECT_RATIOS = [
  { label: 'Social Post', sub: '1080x1080', value: '1:1', icon: Square },
  { label: 'Story / Reel', sub: '1080x1920', value: '9:16', icon: Smartphone },
  { label: 'Landscape', sub: '1920x1080', value: '16:9', icon: Monitor },
  { label: 'Standard', sub: '4:3', value: '4:3', icon: Layout },
];

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [refImageUrl, setRefImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'website' | 'image'>('website');
  const [aspectRatio, setAspectRatio] = useState('1:1'); // Default to Square for Social Media
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [lastUploadedImage, setLastUploadedImage] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && !uploading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          // Slower progress as it gets higher to simulate real waiting
          if (prev >= 95) return prev; 
          // Adjusted for longer generation times (approx 5 mins to reach 90%)
          const increment = prev < 30 ? 1.5 : prev < 60 ? 0.5 : 0.1;
          return Math.min(prev + increment, 95);
        });
      }, 800);
    } else {
        setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading, uploading]);

  const { user } = useUser();
  const router = useRouter();

  // Credits Logic
  const [credits, setCredits] = useState<number | null>(null);
  const [isCreditsLoaded, setIsCreditsLoaded] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    if (user?.publicMetadata?.credits !== undefined) {
        setCredits(user.publicMetadata.credits as number);
        setIsCreditsLoaded(true);
    } else if (user) {
        setCredits(0);
        setIsCreditsLoaded(true);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Max 5MB.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setFilePreview(url);
        setLastUploadedImage(url);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setLastUploadedImage(null);
  };

  const handleEnhance = async () => {
    if (!prompt) return;
    setEnhancing(true);
    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Failed to enhance prompt', err);
    } finally {
      setEnhancing(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mocx-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error('Download failed', e);
        window.open(generatedImage, '_blank');
    }
  };

  // Determine Max Credits based on plan name
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan';
  const isLocked = !isCreditsLoaded || (planName === 'Free Plan' && (credits === null || credits < 1));

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
       router.push('/dashboard/billing'); 
       return;
    }
    
    if (credits !== null && credits < 1) {
        setShowTopUpModal(true);
        return;
    }
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let finalImageUrls: string[] | undefined = undefined;
      
      if (activeTab === 'image') {
        if (selectedFile) {
          setUploading(true);
          try {
             const uploadRes = await fetch(`/api/upload?filename=${selectedFile.name}`, {
                method: 'POST',
                body: selectedFile,
             });
             
             if (!uploadRes.ok) throw new Error('Failed to upload image');
             
             const blob = await uploadRes.json();
             finalImageUrls = [blob.url];
          } catch (uploadError) {
             console.error('Upload failed', uploadError);
             throw new Error('Failed to upload reference image. Please try again or use a URL.');
          } finally {
             setUploading(false);
          }
        } else if (refImageUrl) {
          finalImageUrls = [refImageUrl];
        } else {
            throw new Error("Please upload an image or provide a reference URL.");
        }
      } else if (activeTab === 'website') {
        if (!websiteUrl) {
            throw new Error("Please provide a website URL.");
        }
        finalImageUrls = [`https://image.thum.io/get/width/1920/crop/1080/noanimate/${websiteUrl}`];
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt || "High quality professional product mockup", 
          imageUrls: finalImageUrls,
          aspectRatio: aspectRatio
        }),
      });

      const data = await res.json();

      if (!res.ok) {
         if (data.error && data.error.includes('credits')) {
             setShowTopUpModal(true);
             setLoading(false);
             return;
         }
         throw new Error(data.error || data.details?.msg || 'Failed to start generation');
      }
      
      const taskId = data.data?.taskId;

      if (!taskId) {
        throw new Error('No task ID received from API');
      }

      let timeoutId: NodeJS.Timeout;

      const pollInterval = setInterval(async () => {
        try {
            const statusRes = await fetch(`/api/status?taskId=${taskId}`);
            
            if (!statusRes.ok) {
                console.warn('Status check returned not ok:', statusRes.status);
                return;
            }

            const statusData = await statusRes.json();

            // Update progress if provided by backend
            if (statusData.progress && typeof statusData.progress === 'number') {
                setProgress(prev => Math.max(prev, statusData.progress));
            }

            if (statusData.status === 'completed' && statusData.result) {
               clearInterval(pollInterval);
               clearTimeout(timeoutId);
               setGeneratedImage(statusData.result);
               setLoading(false);
               setCredits(prev => (prev !== null ? prev - 1 : null));
            } else if (statusData.status === 'failed') {
               clearInterval(pollInterval);
               clearTimeout(timeoutId);
               setError(statusData.error || 'Generation failed on server.');
               setLoading(false);
            }
        } catch (pollErr) {
            console.error('Polling error', pollErr);
        }
      }, 2000);

      timeoutId = setTimeout(() => {
        clearInterval(pollInterval);
        setLoading(false);
        setError('Generation is taking longer than expected. Please check the "History" tab later or try again.');
      }, 600000); // Increased timeout to 10 minutes

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Generation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-4 lg:p-6 relative overflow-hidden font-sans">
      <TopUpModal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} />
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-50" />

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-3rem)]">
        
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-[420px] flex flex-col gap-6 lg:h-full lg:overflow-y-auto no-scrollbar shrink-0">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/5 rounded-[24px] p-6 shadow-2xl flex flex-col gap-6">
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-primary to-orange-600 p-2.5 rounded-xl shadow-lg shadow-primary/20">
                        <Wand2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-white">Create Mockup</h2>
                        <p className="text-xs text-white/40 font-medium">Design your masterpiece</p>
                    </div>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold text-white/80">{credits !== null ? credits : '-'} Credits</span>
                </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6 relative flex-1 flex flex-col">
              {isLocked && (
                 <div className="absolute -inset-6 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 rounded-[2rem] border border-primary/20 shadow-2xl">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 animate-pulse">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Upgrade to Generate</h3>
                    <p className="text-sm text-white/50 mb-6 max-w-[240px] leading-relaxed">
                      Unlock professional features and generate unlimited mockups.
                    </p>
                    <Link href="/dashboard/billing" className="bg-primary hover:brightness-110 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                      View Plans
                    </Link>
                 </div>
              )}

              {/* Source Selection */}
              <div className="space-y-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Source</label>
                  <div className="grid grid-cols-2 gap-1 bg-black/40 p-1.5 rounded-xl border border-white/5">
                    <button
                        type="button"
                        onClick={() => setActiveTab('website')}
                        className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 ${
                        activeTab === 'website' ? 'bg-[#2A2A2A] text-white shadow-lg border border-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Monitor className="w-3.5 h-3.5" />
                        Website
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('image')}
                        className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 ${
                        activeTab === 'image' ? 'bg-[#2A2A2A] text-white shadow-lg border border-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Upload
                    </button>
                  </div>
              </div>

              {/* Inputs Area */}
              <div className="min-h-[120px]">
                {activeTab === 'website' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-xl" />
                        <LinkIcon className="absolute left-4 top-3.5 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors z-10" />
                        <input
                        type="url"
                        disabled={isLocked}
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all relative z-10"
                        />
                    </div>
                    </motion.div>
                )}

                {activeTab === 'image' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div>
                        {!filePreview ? (
                        <div className={`relative border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-primary/50 hover:bg-white/5 transition-all text-center group cursor-pointer ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input 
                            type="file" 
                            accept="image/*"
                            disabled={isLocked}
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-inner">
                                <Upload className="w-5 h-5 text-white/50 group-hover:text-white" />
                            </div>
                            <p className="text-sm text-white font-medium">Drop your design here</p>
                            <p className="text-xs text-white/30 mt-1">Supports JPG, PNG</p>
                        </div>
                        ) : (
                        <div className="relative rounded-xl overflow-hidden border border-white/10 group shadow-2xl">
                            <img src={filePreview} alt="Preview" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    className="bg-white text-black px-4 py-2 rounded-lg font-bold text-xs hover:scale-105 transition-transform"
                                >
                                    Change Image
                                </button>
                            </div>
                        </div>
                        )}
                    </div>
                    </motion.div>
                )}
              </div>

              {/* Aspect Ratio Grid */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Output Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {ASPECT_RATIOS.map((ratio) => {
                    const Icon = ratio.icon;
                    const isSelected = aspectRatio === ratio.value;
                    return (
                      <button
                        key={ratio.value}
                        type="button"
                        disabled={isLocked}
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group hover:scale-[1.02] active:scale-95 ${
                          isSelected
                            ? 'bg-primary/10 border-primary/50 text-white shadow-[0_0_20px_-10px_var(--primary)]'
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-black/20 text-white/40 group-hover:text-white'}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wide">{ratio.label}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-primary/80' : 'text-white/20'}`}>{ratio.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Section */}
              <div className="flex-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Prompt Details</label>
                    <button
                    type="button"
                    onClick={handleEnhance}
                    disabled={!prompt || enhancing || isLocked}
                    className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-primary hover:text-white transition-colors disabled:opacity-50 px-2 py-1 hover:bg-primary/10 rounded-lg hover:scale-105 active:scale-95"
                    >
                    <Wand2 className={`w-3 h-3 ${enhancing ? 'animate-spin' : ''}`} />
                    {enhancing ? 'Enhancing...' : 'AI Enhance'}
                    </button>
                </div>
                <div className="relative flex-1">
                    <textarea
                    value={prompt}
                    disabled={isLocked}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the scene... (e.g. 'Cosmetic bottle on a wet rock surface, waterfall background, cinematic lighting')"
                    className="w-full h-full min-h-[120px] bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all leading-relaxed"
                    />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || uploading || isLocked}
                className="w-full bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl py-4 font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-[0.98] relative overflow-hidden lg:static fixed bottom-4 left-4 right-4 lg:w-full w-[calc(100%-2rem)] z-40 hover:scale-[1.01]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center gap-2">
                    {uploading ? (
                    'Uploading Assets...'
                    ) : loading ? (
                    'Generating...'
                    ) : (
                    <>
                        Generate Mockup
                        <span className="flex items-center gap-1 text-[10px] bg-black/20 px-2 py-0.5 rounded-full ml-1 text-white/90 border border-white/10">
                        <Zap className="w-3 h-3 fill-current text-yellow-400" />
                        1
                        </span>
                    </>
                    )}
                </div>
              </button>
            </form>
            
            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl break-words flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Result */}
        <div className="flex-1 w-full lg:h-full min-h-[400px] lg:min-h-[500px] mb-24 lg:mb-0">
          <div className={`w-full h-[400px] lg:h-full bg-[#050505] border border-white/10 rounded-[24px] relative overflow-hidden shadow-2xl flex items-center justify-center transition-all group ${
             generatedImage ? 'border-primary/20' : 'border-dashed border-white/5'
          }`}>
            {generatedImage ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Ambient Blur Background */}
                <div className="absolute inset-0 z-0">
                    <img src={generatedImage} className="w-full h-full object-cover blur-[100px] opacity-40 scale-125" />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Main Image */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full h-full p-8 lg:p-12 flex items-center justify-center"
                >
                    <img 
                        src={generatedImage} 
                        alt="Generated Result" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50 ring-1 ring-white/10" 
                    />
                </motion.div>
                
                {/* Floating Action Dock */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-2xl p-2 rounded-2xl border border-white/10 shadow-2xl shadow-black/50"
                >
                    <button 
                        onClick={handleDownload} 
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        Download High Res
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-1" />
                    <button 
                        onClick={() => window.open(generatedImage, '_blank')}
                        className="p-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all"
                        title="Open Fullscreen"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setGeneratedImage(null)} 
                        className="p-3 rounded-xl hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
              </div>
            ) : (
              <div className="text-center relative z-10">
                <div className="relative w-40 h-40 mx-auto mb-8 group cursor-default">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-orange-500/40 rounded-full blur-[60px] animate-pulse opacity-50" />
                    <div className="bg-gradient-to-b from-white/10 to-transparent w-full h-full rounded-full flex items-center justify-center border border-white/10 relative z-10 shadow-2xl backdrop-blur-sm">
                        <ImageIcon className="w-16 h-16 text-white/30 group-hover:text-white/50 transition-colors" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Ready to Create</h3>
                <p className="text-white/40 max-w-md mx-auto text-base leading-relaxed">
                  Upload your design or website URL on the left,<br />describe the scene, and let AI create magic.
                </p>
              </div>
            )}
            
            {loading && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-30 transition-all p-8 text-center">
                 <div className="relative mb-8">
                    {/* Progress Circle */}
                    <div className="w-32 h-32 rounded-full border-4 border-white/5 relative flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="46"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-white/5"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="46"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray="289.02"
                                strokeDashoffset={289.02 - (289.02 * progress) / 100}
                                className="text-primary transition-all duration-500 ease-out"
                            />
                        </svg>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                        </div>
                    </div>
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2 tracking-tight animate-pulse">
                    {uploading ? 'Uploading Assets...' : 'Creating Masterpiece...'}
                 </h3>
                 <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                    {progress > 80 ? 'Finalizing details (this may take a few minutes)...' : progress > 50 ? 'Applying advanced lighting and textures...' : 'Analyzing prompt and composition...'}
                 </p>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
