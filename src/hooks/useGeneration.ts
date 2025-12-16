import { useState, useEffect } from 'react';

interface GenerationOptions {
  prompt: string;
  imageFiles?: File[];
  aspectRatio?: string;
  mode: 'art' | 'mockup' | 'thumbnail';
}

export function useGeneration() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  // Simulated progress effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && !uploading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          const increment = prev < 30 ? 1.5 : prev < 60 ? 0.5 : 0.1;
          return Math.min(prev + increment, 95);
        });
      }, 800);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading, uploading]);

  const generate = async ({ prompt, imageFiles = [], aspectRatio = '1:1', mode }: GenerationOptions) => {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setTaskId(null);

    try {
      let finalImageUrls: string[] | undefined = undefined;

      // 1. Upload Images
      if (imageFiles.length > 0) {
        setUploading(true);
        finalImageUrls = [];
        
        for (const file of imageFiles) {
            const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: 'POST',
                body: file,
            });
            if (!uploadRes.ok) {
                const errData = await uploadRes.json().catch(() => ({}));
                throw new Error(errData.error || errData.details || 'Failed to upload image');
            }
            const blob = await uploadRes.json();
            finalImageUrls.push(blob.url);
        }
        setUploading(false);
      }

      // 2. Start Generation
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          imageUrls: finalImageUrls,
          aspectRatio,
          mode // Optional: Backend could log usage by mode
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details?.msg || 'Failed to start generation');
      }
      
      const newTaskId = data.data?.taskId;
      if (!newTaskId) throw new Error('No task ID received');
      
      setTaskId(newTaskId);

      // 3. Poll for Status
      let timeoutId: NodeJS.Timeout;
      const pollInterval = setInterval(async () => {
        try {
            const statusRes = await fetch(`/api/status?taskId=${newTaskId}`);
            if (!statusRes.ok) return;

            const statusData = await statusRes.json();
            
            if (statusData.progress && typeof statusData.progress === 'number') {
                setProgress(prev => Math.max(prev, statusData.progress));
            }

            if (statusData.status === 'completed' && statusData.result) {
               clearInterval(pollInterval);
               clearTimeout(timeoutId);
               setGeneratedImage(statusData.result);
               setLoading(false);
            } else if (statusData.status === 'failed') {
               clearInterval(pollInterval);
               clearTimeout(timeoutId);
               setError(statusData.error || 'Generation failed.');
               setLoading(false);
            }
        } catch (pollErr) { console.error(pollErr); }
      }, 2000);

      timeoutId = setTimeout(() => {
        clearInterval(pollInterval);
        setLoading(false);
        setError('Timeout. Please check history later.');
      }, 600000); // 10 min timeout

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Generation failed.');
      setLoading(false);
      setUploading(false);
    }
  };

  return {
    generate,
    loading,
    uploading,
    progress,
    error,
    generatedImage,
    taskId
  };
}


