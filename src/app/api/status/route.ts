import { NextResponse } from 'next/server';
import { tasks } from '../webhook/nanobanana/route';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'TaskId required' }, { status: 400 });
  }

  const taskData = tasks.get(taskId);

  if (!taskData) {
    // If we don't have data yet, it might still be processing or we haven't received the webhook
    return NextResponse.json({ status: 'pending' });
  }

  return NextResponse.json(taskData);
}

