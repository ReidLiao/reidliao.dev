'use client'

import React from 'react'

import { prettifyNumber } from '~/lib/math'

type PostMetrics = {
  views: number
  reactions: number[]
}

type PostMetricsResponse = {
  posts: Record<string, PostMetrics>
}

const PostMetricsContext = React.createContext<
  Record<string, PostMetrics> | null
>(null)

export function LivePostMetricsProvider({
  postIds,
  incrementPostId,
  children,
}: {
  postIds: string[]
  incrementPostId?: string
  children: React.ReactNode
}) {
  const idsKey = [...new Set(postIds)].join(',')
  const stablePostIds = React.useMemo(
    () => (idsKey ? idsKey.split(',') : []),
    [idsKey]
  )
  const [metrics, setMetrics] = React.useState<Record<string, PostMetrics>>({})

  React.useEffect(() => {
    if (!stablePostIds.length) return

    const controller = new AbortController()
    setMetrics({})

    const requestId = window.setTimeout(() => {
      void fetch('/api/live-post-metrics', {
        method: 'POST',
        cache: 'no-store',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postIds: stablePostIds,
          incrementPostId,
        }),
      })
        .then(async (response) => {
          if (!response.ok) return null
          return (await response.json()) as PostMetricsResponse
        })
        .then((data) => {
          if (data) setMetrics(data.posts)
        })
        .catch(() => undefined)
    }, 0)

    return () => {
      window.clearTimeout(requestId)
      controller.abort()
    }
  }, [idsKey, incrementPostId, stablePostIds])

  return (
    <PostMetricsContext.Provider value={metrics}>
      {children}
    </PostMetricsContext.Provider>
  )
}

export function useLivePostMetrics(postId: string) {
  return React.useContext(PostMetricsContext)?.[postId]
}

export function LivePostViewCount({ postId }: { postId: string }) {
  const views = useLivePostMetrics(postId)?.views ?? 0
  return <>{prettifyNumber(views, true)}</>
}
