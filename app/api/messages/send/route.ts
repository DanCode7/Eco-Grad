import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, postId, message } = await request.json();

    if (!senderId || !receiverId || !postId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    await connection.execute(
      `INSERT INTO messages (sender_id, receiver_id, post_id, message) 
       VALUES (?, ?, ?, ?)`,
      [senderId, receiverId, postId, message]
    );

    await connection.end();

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}