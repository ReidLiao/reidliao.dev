import { NextRequest, NextResponse } from 'next/server'

import { isAllowedImageProxyUrl } from '~/lib/cdn-image'
import { fetchAndCacheImage, readImageCache } from '~/lib/img-cache'

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
  if (!raw || !isAllowedImageProxyUrl(raw)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const diskHit = await readImageCache(raw)
    if (diskHit) {
      return imageResponse(diskHit.body, diskHit.contentType, true)
    }

    const fetched = await fetchAndCacheImage(raw)
    if (!fetched) {
      return new NextResponse('Upstream error', { status: 502 })
    }

    return imageResponse(fetched.body, fetched.contentType, false)
  } catch {
    return new NextResponse('Proxy failed', { status: 502 })
  }
}
