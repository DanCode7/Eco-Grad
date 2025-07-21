import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getUserFromEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userEmail, postId } = await request.json();

    if (!userEmail || !postId) {
      return NextResponse.json(
        { error: 'User email and post ID are required' },
        { status: 400 }
      );
    }

    // 사용자 정보 조회
    const user = await getUserFromEmail(userEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const connection = await getConnection();

    // 게시물이 해당 사용자의 것인지 확인하고 조회
    const [posts] = await connection.execute(
      `SELECT 
        id, 
        title, 
        item_type, 
        size, 
        condition_status, 
        price, 
        contact_info,
        image_path,
        image_filename,
        image_url,
        status,
        created_at,
        updated_at
      FROM posts 
      WHERE id = ? AND user_id = ?`,
      [postId, user.id]
    );

    await connection.end();

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: 'Post not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Post retrieved successfully',
        post: posts[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}