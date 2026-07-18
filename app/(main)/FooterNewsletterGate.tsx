'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

/** Hide footer newsletter on homepage — aside already has one. */
export function FooterNewsletterGate({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  if (pathname === '/') return null
  return <>{children}</>
}
