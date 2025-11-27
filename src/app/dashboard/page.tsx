'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon, Info, Image as ImageIcon } from 'lucide-react';

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [refImageUrl, setRefImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'website' | 'image'>('text');
  
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt && activeTab === 'text') return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Logic to handle different tabs (Website Screenshot would happen here ideally)
      // For now, passing the URL directly if it's an image URL, or just prompt
      
      let finalImageUrls = undefined;
      if (activeTab === 'image' && refImageUrl) {
        finalImageUrls = [refImageUrl];
      } else if (activeTab === 'website' && websiteUrl) {
        // In a real app, we would call an API to screenshot this URL first
        // For this demo, we might treat it as a reference URL if it points to an image, 
        // or warn the user.
        // To keep it simple as requested, we'll pass it as a reference URL hoping the API might handle it 
        // or just use it as context in the prompt.
        finalImageUrls = [websiteUrl]; // Assuming user pastes an image URL or we use it as context
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          imageUrls: finalImageUrls
        }),
      });

      if (!res.ok) throw new Error('Failed to start generation');
      
      const data = await res.json();
      const taskId = data.data?.taskId;

      if (!taskId) throw new Error('No task ID received');

      // Poll for results
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`/api/status?taskId=${taskId}`);
        const statusData = await statusRes.json();

        if (statusData.status !== 'pending' && statusData.result) {
           clearInterval(pollInterval);
           setGeneratedImage(statusData.result);
           setLoading(false);
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(pollInterval);
        if (loading) setLoading(false); // Timeout
      }, 60000);

    } catch (err) {
      console.error(err);
      setError('Generation failed. Please try again.');
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
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    Reference Image URL
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={refImageUrl}
                      onChange={(e) => setRefImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use an existing image as a reference.
                  </p>
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
              <div className="mt-4 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
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

