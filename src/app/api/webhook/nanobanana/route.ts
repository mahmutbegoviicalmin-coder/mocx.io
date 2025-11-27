import { NextResponse } from 'next/server';

// In a real app, you'd save this to a database. 
// For this demo, we'll use a simple in-memory store (note: resets on server restart)
// Key: taskId, Value: status/result
// We need to export this so other routes can read it (like a status polling route)
export const tasks = new Map();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Webhook received:', data);

    // The structure of the webhook payload isn't explicitly detailed in the snippet 
    // but usually contains taskId and status/image info.
    // We'll store whatever we get.
    if (data.taskId) {
       tasks.set(data.taskId, data);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

