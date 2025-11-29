import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // 1. Check for Token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Missing BLOB_READ_WRITE_TOKEN');
      return NextResponse.json(
          { error: 'Server misconfiguration: Missing Vercel Blob Token' }, 
          { status: 500 }
      );
  }

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'File body is required' }, { status: 400 });
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Blob upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    return NextResponse.json(
        { error: 'Upload failed', details: errorMessage }, 
        { status: 500 }
    );
  }
}
