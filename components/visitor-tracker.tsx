'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function VisitorTracker() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Track page visit
    fetch('/api/track-visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageUrl: pathname,
        referrer: document.referrer
      })
    }).catch(console.error)
  }, [pathname])
  
  return null
}