'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon, Info, Image as ImageIcon, X } from 'lucide-react';

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [refImageUrl, setRefImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'website' | 'image'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    // Reset file input manually if needed, or let React handle it via key/ref
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt && activeTab === 'text') return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let finalImageUrls: string[] | undefined = undefined;
      
      if (activeTab === 'image') {
        if (selectedFile && filePreview) {
          // Use Data URI from file upload
          finalImageUrls = [filePreview];
        } else if (refImageUrl) {
          // Use provided URL
          finalImageUrls = [refImageUrl];
        }
      } else if (activeTab === 'website' && websiteUrl) {
        finalImageUrls = [websiteUrl];
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          imageUrls: finalImageUrls
        }),
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.error || data.details?.msg || 'Failed to start generation');
      }
      
      const taskId = data.data?.taskId;

      if (!taskId) {
        console.error('API Response missing taskId:', data);
        throw new Error('No task ID received from API');
      }

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
            const statusRes = await fetch(`/api/status?taskId=${taskId}`);
            const statusData = await statusRes.json();

            if (statusData.status === 'completed' && statusData.result) {
               clearInterval(pollInterval);
               setGeneratedImage(statusData.result);
               setLoading(false);
            } else if (statusData.status === 'failed') {
               clearInterval(pollInterval);
               setError(statusData.error || 'Generation failed on server.');
               setLoading(false);
            }
        } catch (pollErr) {
            console.error('Polling error', pollErr);
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(pollInterval);
        if (loading) {
            setLoading(false);
            setError('Request timed out. Please check back later.');
        }
      }, 90000); // Increased timeout to 90s

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Generation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                <ImageIcon className="w-5 h-5" />
              </span>
              Create Mockup
            </h2>

            {/* Tabs */}
            <div className="flex p-1 bg-muted/50 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'text' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setActiveTab('website')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'website' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Website
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'image' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Upload
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your mockup (e.g. 'Modern laptop on a wooden desk with coffee')"
                  className="w-full h-32 bg-muted/30 border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {activeTab === 'website' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    Website URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll take a screenshot of this URL to use in the mockup.
                  </p>
                </div>
              )}

              {activeTab === 'image' && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                       Upload Reference (Photo)
                    </label>
                    
                    {!filePreview ? (
                      <div className="relative border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors text-center">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Click or drag to upload</p>
                        <p className="text-xs text-muted-foreground/50 mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border border-border group">
                         <img src={filePreview} alt="Preview" className="w-full h-32 object-cover opacity-80" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={clearFile}
                              className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or use URL</span>
                    </div>
                  </div>

                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={refImageUrl}
                      onChange={(e) => setRefImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:brightness-110 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Generating...' : 'Generate Mockup'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg break-words">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Canvas/Result */}
        <div className="w-full lg:w-2/3">
          <div className="bg-card border border-border rounded-xl h-[600px] flex items-center justify-center relative overflow-hidden shadow-sm">
            {generatedImage ? (
              <img src={generatedImage} alt="Generated Result" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                   <ImageIcon className="w-10 h-10 opacity-50" />
                </div>
                <p className="text-lg font-medium">Ready to generate</p>
                <p className="text-sm opacity-70 max-w-xs mx-auto mt-2">
                  Enter a prompt or upload a reference to get started.
                </p>
              </div>
            )}
            
            {loading && (
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                 <div className="text-center text-white">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                   <p>Creating your masterpiece...</p>
                 </div>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
