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
    try {
      await redis.incr(kvKeys.totalPageViews)
    } catch {
      // ignore view counter failures
    }

    const ip = getClientIP(req)
    let country = 'US'
    let city = 'Unknown'
    let geoResolved = false

    if (ip !== '127.0.0.1') {
      const cacheKey = `geo:${ip}`
      try {
        const cached = await redis.get<{ country: string; city: string }>(
          cacheKey
        )

        if (cached?.country) {
          country = cached.country
          city = cached.city ?? 'Unknown'
          geoResolved = true
        } else {
          try {
            const res = await fetch(`http://ip-api.com/json/${ip}`, {
              cache: 'no-store',
            })
            if (res.ok) {
              const data = await res.json()
              if (data.countryCode) {
                country = data.countryCode
                geoResolved = true
              }
              if (data.city) city = data.city
            }
          } catch {
            // keep defaults; do not cache failed lookups
          }

          if (geoResolved) {
            await redis.set(
              cacheKey,
              { country, city },
              { ex: GEO_CACHE_TTL_SECONDS }
            )
          }
        }
      } catch {
        // geo lookup optional
      }
    }

    const countryInfo = countries.find((x) => x.cca2 === country)
    if (countryInfo && geoResolved) {
      try {
        await redis.set(kvKeys.currentVisitor, {
          country,
          city,
          flag: countryInfo.flag,
        })
      } catch {
        // ignore
      }
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
    '/sign-in(.*)',
    '/blocked',
    // Allow unmatched routes (404) without redirecting to sign-in.
    // /admin is still protected by app/admin/layout.tsx (siteOwner check).
    '/(.*)',
  ],
})
