import { NextResponse } from 'next/server'

import { kvKeys } from '~/config/kv'
import { redis } from '~/lib/redis'

export const dynamic = 'force-dynamic'

const VIEWS_CACHE_TTL_SECONDS = 60
const noStoreHeaders = { 'Cache-Control': 'private, no-store, max-age=0' }

type VisitorGeolocation = {
  country: string
  city?: string
  flag: string
}

export async function GET() {
  let totalViews: number | null = null
  let visitor: VisitorGeolocation | null = null

  try {
    const cached = await redis.get<number>(kvKeys.totalPageViewsCached)
    const views =
      typeof cached === 'number'
        ? cached
        : await redis.get<number>(kvKeys.totalPageViews)

    if (typeof views === 'number') {
      totalViews = views
      if (typeof cached !== 'number') {
        await redis.set(kvKeys.totalPageViewsCached, views, {
          ex: VIEWS_CACHE_TTL_SECONDS,
        })
      }
    }
  } catch {
    // Keep the public page useful if the counter store is unavailable.
  }

  try {
    const [lastVisitor, currentVisitor] = await redis.mget<VisitorGeolocation[]>(
      kvKeys.lastVisitor,
      kvKeys.currentVisitor
    )

    if (currentVisitor) {
      await redis.set(kvKeys.lastVisitor, currentVisitor)
    }

    visitor = lastVisitor ?? currentVisitor ?? null
  } catch {
    // Keep the public page useful if the geolocation store is unavailable.
  }

  return NextResponse.json(
    { totalViews, visitor },
    { headers: noStoreHeaders }
  )
}
