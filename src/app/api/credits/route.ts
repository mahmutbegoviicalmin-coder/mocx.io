import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.NANOBANANA_API_KEY) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const response = await fetch('https://api.nanobananaapi.ai/api/v1/common/credit', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Credit check failed:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Credit check error:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}
