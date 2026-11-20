import { type NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'

import { kvKeys } from '~/config/kv'
import { redis } from '~/lib/redis'
import { client } from '~/sanity/lib/client'

export const runtime = 'nodejs'

const noStoreHeaders = { 'Cache-Control': 'private, no-store, max-age=0' }
const postIdPattern = /^[A-Za-z0-9._-]{1,128}$/

export async function POST(req: NextRequest) {
  let body: { postIds?: unknown; incrementPostId?: unknown } | null

  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400, headers: noStoreHeaders }
    )
  }

  if (
    !body ||
    !Array.isArray(body.postIds) ||
    body.postIds.length < 1 ||
    body.postIds.length > 20 ||
    body.postIds.some(
      (id) => typeof id !== 'string' || !postIdPattern.test(id)
    ) ||
    (body.incrementPostId !== undefined &&
      (typeof body.incrementPostId !== 'string' ||
        !postIdPattern.test(body.incrementPostId)))
  ) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400, headers: noStoreHeaders }
    )
  }

  const postIds = [...new Set(body.postIds as string[])]
  const publishedIds = await client.fetch<string[]>(
    groq`*[_type == "post" && _id in $postIds && !(_id in path("drafts.**")) && defined(slug.current)]._id`,
    { postIds },
    { next: { tags: ['posts'], revalidate: 600 } }
  )
  const incrementPostId =
    typeof body.incrementPostId === 'string' &&
    publishedIds.includes(body.incrementPostId)
      ? body.incrementPostId
      : undefined

  if (body.incrementPostId && !incrementPostId) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404, headers: noStoreHeaders }
    )
  }

  if (publishedIds.length === 0) {
    return NextResponse.json({ posts: {} }, { headers: noStoreHeaders })
  }

  const [viewCounts, reactionCounts] = await Promise.all([
    redis.mget<number[]>(...publishedIds.map((id) => kvKeys.postViews(id))),
    redis.mget<number[][]>(
      ...publishedIds.map((id) => `reactions:${id}`)
    ),
  ])

  const posts = Object.fromEntries(
    publishedIds.map((id, index) => [
      id,
      {
        views: viewCounts[index] ?? 0,
        reactions: reactionCounts[index] ?? [0, 0, 0, 0],
      },
    ])
  )

  if (incrementPostId) {
    void redis.incr(kvKeys.postViews(incrementPostId)).catch((error) => {
      console.error('[PostViews] Failed to record view', error)
    })
  }

  return NextResponse.json({ posts }, { headers: noStoreHeaders })
}
