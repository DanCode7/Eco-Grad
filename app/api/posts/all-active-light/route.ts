import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 이미지 데이터를 제외하고 조회 (목록 표시용)
    const [posts] = await connection.execute(
      `SELECT 
        p.id, 
        p.title, 
        p.item_type, 
        p.size, 
        p.condition_status, 
        p.price, 
        p.contact_info,
        p.status,
        p.created_at,
        u.username as seller_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.status IN ('active', 'sold')
      ORDER BY p.status ASC, p.created_at DESC
      LIMIT 50`
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