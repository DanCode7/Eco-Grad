import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getUserFromEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
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

    // 해당 사용자의 게시물만 조회
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
      WHERE user_id = ? 
      ORDER BY created_at DESC`,
      [user.id]
    );

    await connection.end();

    return NextResponse.json(
      { 
        message: 'Posts retrieved successfully',
        posts: posts
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}