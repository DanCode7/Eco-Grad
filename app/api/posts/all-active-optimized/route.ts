import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 모든 사용자의 게시물 조회 (이미지는 썸네일 크기로 최적화)
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
        p.updated_at,
        CASE 
          WHEN p.image_url IS NOT NULL THEN 
            CONCAT(SUBSTRING(p.image_url, 1, 100), '...truncated...') 
          ELSE NULL 
        END as image_preview,
        u.username as seller_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.status ASC, p.created_at DESC
      LIMIT 100`
    );

    // 각 게시물의 실제 이미지 URL을 가져오되, 최대 30개만
    const postsWithImages = posts.slice(0, 30);
    const postsWithoutImages = posts.slice(30);

    // 처음 30개만 이미지 포함
    const [imagesResult] = await connection.execute(
      `SELECT id, image_url 
       FROM posts 
       WHERE id IN (${postsWithImages.map(() => '?').join(',')})`,
      postsWithImages.map(p => p.id)
    );

    const imageMap = new Map(imagesResult.map(img => [img.id, img.image_url]));

    const optimizedPosts = [
      ...postsWithImages.map(post => ({
        ...post,
        image_url: imageMap.get(post.id) || null,
        image_preview: undefined
      })),
      ...postsWithoutImages.map(post => ({
        ...post,
        image_url: null,
        image_preview: undefined,
        needs_image_load: true
      }))
    ];

    await connection.end();

    return NextResponse.json(
      { 
        message: 'Posts retrieved successfully',
        posts: optimizedPosts,
        total: posts.length
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