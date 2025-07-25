import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 모든 사용자의 게시물 조회 (active 및 sold 포함 - Buy 페이지용)
    const [posts] = await connection.execute(
      `SELECT 
        p.id, 
        p.title, 
        p.item_type, 
        p.size, 
        p.condition_status, 
        p.price, 
        p.contact_info,
        p.image_path,
        p.image_filename,
        p.image_url,
        p.status,
        p.created_at,
        p.updated_at,
        u.username as seller_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.status ASC, p.created_at DESC
      LIMIT 20`
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
    console.error('Error fetching active posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active posts' },
      { status: 500 }
    );
  }
}