import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // 테이블 목록 확인
    const [tables] = await connection.execute(
      "SHOW TABLES"
    );

    // users 테이블 구조 확인
    const [usersStructure] = await connection.execute(
      "DESCRIBE users"
    );

    // posts 테이블 구조 확인
    const [postsStructure] = await connection.execute(
      "DESCRIBE posts"
    );

    // 각 테이블의 레코드 수 확인
    const [userCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM users"
    );
    
    const [postCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM posts"
    );

    await connection.end();

    return NextResponse.json({
      message: 'Database tables information',
      tables: tables,
      usersTable: {
        structure: usersStructure,
        recordCount: (userCount as any)[0].count
      },
      postsTable: {
        structure: postsStructure,
        recordCount: (postCount as any)[0].count
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check database tables',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}