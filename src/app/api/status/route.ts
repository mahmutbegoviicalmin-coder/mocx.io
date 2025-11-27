import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'TaskId required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.nanobananaapi.ai/api/v1/nanobanana/record-info?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || data.code !== 200) {
       console.error('NanoBanana Status Error:', data);
       return NextResponse.json(data, { status: response.status === 200 ? 400 : response.status });
    }

    // Map NanoBanana status to our internal format
    // successFlag: 0-generating, 1-success, 2-create failed, 3-gen failed
    let status = 'pending';
    let result = null;
    let error = null;

    if (data.data?.successFlag === 1) {
        status = 'completed';
        result = data.data.response?.resultImageUrl;
    } else if (data.data?.successFlag === 2 || data.data?.successFlag === 3) {
        status = 'failed';
        error = data.data.errorMessage || 'Generation failed';
    }

    return NextResponse.json({ 
        status, 
        result, 
        error, 
        originalData: data.data 
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Failed to check task status' }, { status: 500 });
  }
}
