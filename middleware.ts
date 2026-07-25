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
const IP_LOOKUP_TIMEOUT_MS = 2500

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

/**
 * Analytics + geo lookup. Never awaited on the request path so the response
 * ships immediately; failures are swallowed on purpose.
 */
async function collectVisitor(req: NextRequest) {
  try {
    await redis.incr(kvKeys.totalPageViews)
  } catch {
    // ignore counter failures
  }

  const ip = getClientIP(req)
  if (ip === '127.0.0.1') return

  const cacheKey = `geo:${ip}`
  let country: string | undefined
  let city: string | undefined

  try {
    const cached = await redis.get<{ country: string; city: string }>(cacheKey)
    if (cached?.country) {
      country = cached.country
      city = cached.city ?? 'Unknown'
    }
  } catch {
    // ignore
  }

  if (!country) {
    try {
      const res = await fetch(`http://ip-api.com/json/${ip}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(IP_LOOKUP_TIMEOUT_MS),
      })
      if (res.ok) {
        const data = (await res.json()) as {
          countryCode?: string
          city?: string
        }
        if (data.countryCode) {
          country = data.countryCode
          city = data.city ?? 'Unknown'
          try {
            await redis.set(
              cacheKey,
              { country, city },
              { ex: GEO_CACHE_TTL_SECONDS }
            )
          } catch {
            // ignore cache write failure
          }
        }
      }
    } catch {
      // network / timeout — leave country undefined
    }
  }

  if (!country) return
  const info = countries.find((x) => x.cca2 === country)
  if (!info) return

  try {
    await redis.set(kvKeys.currentVisitor, {
      country,
      city: city ?? 'Unknown',
      flag: info.flag,
    })
  } catch {
    // ignore
  }
}

function beforeAuthMiddleware(req: NextRequest) {
  const isApi = req.nextUrl.pathname.startsWith('/api/')

  if (isProduction && !isApi) {
    // Fire-and-forget: keeps middleware off the critical path.
    void collectVisitor(req)
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
    '/vps',
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
