'use client';

import { useEffect } from 'react';

export default function LocationUpdater() {
  useEffect(() => {
    const updateLocation = async () => {
      try {
        // Fetch simple endpoint that returns country from header
        const res = await fetch('/api/misc/geo'); 
        if (!res.ok) return;
        
        const data = await res.json();
        if (data.country) {
          // Send to our update endpoint
          await fetch('/api/auth/update-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: data.country })
          });
        }
      } catch (e) {
        // Silent fail
      }
    };

    updateLocation();
  }, []);

  return null;
}

