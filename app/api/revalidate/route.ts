import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

import { env } from '~/env.mjs'

/**
 * On-demand ISR revalidation for Sanity publish.
 *
 * Sanity Manage → API → Webhooks → Create webhook:
 *   URL: https://reidliao.dev/api/revalidate
 *   Trigger: Create + Update + Delete
 *   Filter: _type in ["post", "settings", "project"]
 *   Projection: {_type, "slug": slug.current}
 *   HTTP headers: x-revalidate-secret: <REVALIDATE_SECRET>
 *   Drafts: OFF
 *
 * Manual test:
 *   curl -X POST "https://reidliao.dev/api/revalidate?secret=..." -H "Content-Type: application/json" -d '{"slug":"your-post"}'
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
