import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    const connection = await getConnection()
    
    // Create table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_url VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer VARCHAR(255),
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Insert visitor log
    await connection.execute(
      'INSERT INTO visitor_logs (page_url, ip_address, user_agent, referrer) VALUES (?, ?, ?, ?)',
      [data.pageUrl, ip, userAgent, data.referrer || '']
    )
    
    await connection.end()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 })
  }
}