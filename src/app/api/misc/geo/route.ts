import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Return country info for LocationUpdater
  const country = req.headers.get('x-vercel-ip-country') || (req as any).geo?.country;
  
  return NextResponse.json({ 
    status: 'ok',
    country: country
  });
}

