import { authMiddleware } from '@clerk/nextjs'
import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { redis } from '~/lib/redis'

export const config = {
  matcher: ['/((?!_next|studio|.*\\..*).*)'],
}

async function beforeAuthMiddleware(req: NextRequest) {
  const { nextUrl } = req
  const isApi = nextUrl.pathname.startsWith('/api/')

  if (process.env.EDGE_CONFIG) {
    const blockedIPs = await get<string[]>('blocked_ips')
    const ip = getIP(req)

    if (blockedIPs?.includes(ip)) {
      if (isApi) {
        return NextResponse.json(
          { error: 'You have been blocked.' },
          { status: 403 }
        )
      }

      nextUrl.pathname = '/blocked'
      return NextResponse.rewrite(nextUrl)
    }

    if (nextUrl.pathname === '/blocked') {
      nextUrl.pathname = '/'
      return NextResponse.redirect(nextUrl)
    }
  }

  if (!isApi && env.VERCEL_ENV === 'production') {
    let ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1'
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim()
    }

    let country = 'US'
    let city = 'Unknown'

    if (ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const res = await fetch(`http://ip-api.com/json/${ip}`, {
          cache: 'no-store',
        })
        if (res.ok) {
          const data = await res.json()
          if (data.countryCode) country = data.countryCode
          if (data.city) city = data.city
        }
      } catch {
        // keep defaults
      }
    }

    const countryInfo = countries.find((x) => x.cca2 === country)
    if (countryInfo) {
      const flag = countryInfo.flag
      await redis.set(kvKeys.currentVisitor, { country, city, flag })
    }
  }

  return NextResponse.next()
}

export default authMiddleware({
  beforeAuth: beforeAuthMiddleware,
  publicRoutes: [
    '/',
    '/studio(.*)',
    '/api(.*)',
    '/blog(.*)',
    '/confirm(.*)',
    '/projects',
    '/guestbook',
    '/newsletters(.*)',
    '/about',
    '/rss',
    '/feed',
    '/ama',
  ],
})
