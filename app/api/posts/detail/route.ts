import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // 게시물 상세 정보 조회 (Buy 페이지 detail용 - active 및 sold 포함)
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
      WHERE p.id = ?`,
      [postId]
    );

    await connection.end();

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Product details retrieved successfully',
        product: posts[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}