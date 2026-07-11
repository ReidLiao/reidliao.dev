import { NextRequest, NextResponse } from 'next/server'

import { isAllowedImageProxyUrl } from '~/lib/cdn-image'

export const runtime = 'nodejs'

/** Cache proxied Sanity images for 30 days (ISR-style fetch cache). */
const REVALIDATE_SECONDS = 60 * 60 * 24 * 30

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('u')
  if (!raw || !isAllowedImageProxyUrl(raw)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const upstream = await fetch(raw, {
      // Server → Sanity is usually fast (overseas VPS).
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
      },
    })

    if (!upstream.ok || !upstream.body) {
      return new NextResponse('Upstream error', { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    const headers = new Headers({
      'Content-Type': contentType,
      // Browser + NPM can cache hard; URL already includes transform params.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    })

    const contentLength = upstream.headers.get('content-length')
    if (contentLength) headers.set('Content-Length', contentLength)

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    })
  } catch {
    return new NextResponse('Proxy failed', { status: 502 })
  }
}
