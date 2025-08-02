import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Get all messages for the user
    const [messages] = await connection.execute(
      `SELECT 
        m.id,
        m.post_id,
        m.sender_id,
        m.receiver_id,
        m.message,
        m.is_read,
        m.created_at,
        p.title as post_title,
        p.price,
        p.image_url,
        u1.username as sender_username,
        u2.username as receiver_username
      FROM messages m
      JOIN posts p ON m.post_id = p.id
      JOIN users u1 ON m.sender_id = u1.id
      JOIN users u2 ON m.receiver_id = u2.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at DESC`,
      [userId, userId]
    );

    await connection.end();

    // Group messages by conversation (post_id + other_user_id)
    const conversationMap = new Map();
    
    (messages as any[]).forEach(msg => {
      const otherUserId = msg.sender_id == userId ? msg.receiver_id : msg.sender_id;
      const otherUsername = msg.sender_id == userId ? msg.receiver_username : msg.sender_username;
      const key = `${msg.post_id}-${otherUserId}`;
      
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          post_id: msg.post_id,
          post_title: msg.post_title,
          price: msg.price,
          image_url: msg.image_url,
          other_user_id: otherUserId,
          other_username: otherUsername,
          last_message: msg.message,
          last_message_time: msg.created_at,
          unread_count: 0,
          messages: []
        });
      }
      
      const conversation = conversationMap.get(key);
      conversation.messages.push(msg);
      
      // Count unread messages sent by the other user
      if (msg.sender_id != userId && !msg.is_read) {
        conversation.unread_count++;
      }
    });

    // Convert map to array and sort by last message time
    const conversations = Array.from(conversationMap.values())
      .map(conv => {
        // Remove the messages array from the response
        const { messages, ...conversationData } = conv;
        return conversationData;
      })
      .sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}