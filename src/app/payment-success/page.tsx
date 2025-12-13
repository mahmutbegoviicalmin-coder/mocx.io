'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Trigger Facebook Pixel Purchase Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        currency: 'USD',
        value: 0.00 
      });
    }
    
    const timeout = setTimeout(() => {
        router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center text-white p-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-white/60 mb-8">
          Thank you for your purchase. Your credits have been added to your account.
        </p>

        <div className="space-y-3">
          <Link 
            href="/dashboard"
            className="block w-full py-3 bg-[#ff5400] hover:bg-[#ff5400]/90 rounded-xl font-bold transition-colors"
          >
            Go to Dashboard
          </Link>
          <p className="text-xs text-white/30">
            Redirecting automatically in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
