import { NextRequest, NextResponse } from 'next/server'

import { normalizeImageProxyUrl } from '~/lib/cdn-image'
import {
  fetchAndCacheImage,
  ImageProxyError,
  readImageCache,
} from '~/lib/img-cache'

export const runtime = 'nodejs'

function imageResponse(body: Buffer, contentType: string, hit: boolean) {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Image-Cache': hit ? 'HIT' : 'MISS',
      'Content-Length': String(body.byteLength),
    },
  })
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('u')
  const url = raw ? normalizeImageProxyUrl(raw) : null
  if (!url) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const diskHit = await readImageCache(url)
    if (diskHit) {
      return imageResponse(diskHit.body, diskHit.contentType, true)
    }

    const fetched = await fetchAndCacheImage(url)
    if (!fetched) {
      return new NextResponse('Upstream error', { status: 502 })
    }

    return imageResponse(fetched.body, fetched.contentType, false)
  } catch (error) {
    if (error instanceof ImageProxyError) {
      return new NextResponse(error.message, { status: error.status })
    }
    return new NextResponse('Proxy failed', { status: 502 })
  }
}
