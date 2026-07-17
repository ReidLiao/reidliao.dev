import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

import { env } from '~/env.mjs'

/**
 * On-demand ISR revalidation for Sanity publish.
 *
 * Sanity webhook (document publish / update):
 *   POST https://your-domain/api/revalidate?secret=YOUR_SECRET
 *   Body (optional): { "slug": { "current": "post-slug" } }
 *   or: { "slug": "post-slug" }
 *
 * Manual:
 *   POST /api/revalidate?secret=...&slug=post-slug
 *   POST /api/revalidate?secret=...&path=/blog
 */
export async function POST(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get('secret') ||
    req.headers.get('x-revalidate-secret')

  if (!env.REVALIDATE_SECRET || secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let slug =
    req.nextUrl.searchParams.get('slug') ||
    req.nextUrl.searchParams.get('path') ||
    ''

  try {
    const body = (await req.json()) as {
      slug?: string | { current?: string }
      path?: string
    }
    if (!slug) {
      if (typeof body.slug === 'string') slug = body.slug
      else if (body.slug?.current) slug = body.slug.current
      else if (body.path) slug = body.path
    }
  } catch {
    // no JSON body — query params only
  }

  revalidateTag('posts')
  revalidateTag('settings')
  revalidatePath('/')
  revalidatePath('/blog')

  const revalidated: string[] = ['/', '/blog', 'tag:posts', 'tag:settings']

  if (slug) {
    if (slug.startsWith('/')) {
      revalidatePath(slug)
      revalidated.push(slug)
    } else {
      revalidateTag(`post:${slug}`)
      revalidatePath(`/blog/${slug}`)
      revalidated.push(`/blog/${slug}`, `tag:post:${slug}`)
    }
  }

  return NextResponse.json({
    revalidated: true,
    paths: revalidated,
    now: Date.now(),
  })
}
