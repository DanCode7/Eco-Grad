import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const otherUserId = request.nextUrl.searchParams.get('otherUserId');
    const postId = request.nextUrl.searchParams.get('postId');
    
    if (!userId || !otherUserId || !postId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Get all messages between two users for a specific post
    const [messages] = await connection.execute(
      `SELECT 
        m.id,
        m.sender_id,
        m.receiver_id,
        m.message,
        m.is_read,
        m.created_at,
        u.username as sender_username
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.post_id = ? 
        AND ((m.sender_id = ? AND m.receiver_id = ?) 
          OR (m.sender_id = ? AND m.receiver_id = ?))
      ORDER BY m.created_at ASC`,
      [postId, userId, otherUserId, otherUserId, userId]
    );

    // Mark messages as read
    await connection.execute(
      `UPDATE messages 
       SET is_read = TRUE 
       WHERE post_id = ? 
         AND sender_id = ? 
         AND receiver_id = ? 
         AND is_read = FALSE`,
      [postId, otherUserId, userId]
    );

    await connection.end();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching message thread:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}