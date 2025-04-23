import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { token, topic } = await request.json();

    if (!token || !topic) {
      return NextResponse.json(
        { error: 'Token and topic are required' },
        { status: 400 }
      );
    }

    await admin.messaging().subscribeToTopic(token, topic);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to topic' },
      { status: 500 }
    );
  }
} 