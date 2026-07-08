import { authMiddleware } from '@clerk/nextjs'
import { type NextRequest, NextResponse } from 'next/server'

import { kvKeys } from '~/config/kv'
import countries from '~/lib/countries.json'
import { isProduction } from '~/lib/is-production'
import { redis } from '~/lib/redis'

export const config = {
  matcher: ['/((?!_next|studio|.*\\..*).*)'],
}

const GEO_CACHE_TTL_SECONDS = 60 * 60 * 24

function getClientIP(req: NextRequest): string {
  let ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim()
  }

  if (ip === '::1') {
    return '127.0.0.1'
  }

  return ip
}

async function beforeAuthMiddleware(req: NextRequest) {
  const { nextUrl } = req
  const isApi = nextUrl.pathname.startsWith('/api/')

  if (isProduction && !isApi) {
    const ip = getClientIP(req)
    let country = 'US'
    let city = 'Unknown'

    if (ip !== '127.0.0.1') {
      const cacheKey = `geo:${ip}`
      const cached = await redis.get<{ country: string; city: string }>(cacheKey)

      if (cached?.country) {
        country = cached.country
        city = cached.city ?? 'Unknown'
      } else {
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

        await redis.set(
          cacheKey,
          { country, city },
          { ex: GEO_CACHE_TTL_SECONDS }
        )
      }
    }

    const countryInfo = countries.find((x) => x.cca2 === country)
    if (countryInfo) {
      await redis.set(kvKeys.currentVisitor, {
        country,
        city,
        flag: countryInfo.flag,
      })
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
  ],
})
