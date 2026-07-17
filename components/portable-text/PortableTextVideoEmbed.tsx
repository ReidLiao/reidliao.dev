'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import React from 'react'

function parseVideoEmbed(url: string): {
  kind: 'youtube' | 'bilibili' | 'direct' | 'iframe'
  src: string
} | null {
  try {
    const u = new URL(url)

    // YouTube
    if (
      u.hostname.includes('youtube.com') ||
      u.hostname.includes('youtu.be') ||
      u.hostname.includes('youtube-nocookie.com')
    ) {
      let id = u.searchParams.get('v')
      if (!id && u.hostname.includes('youtu.be')) {
        id = u.pathname.replace(/^\//, '').split('/')[0]
      }
      if (!id && u.pathname.includes('/embed/')) {
        id = u.pathname.split('/embed/')[1]?.split(/[/?]/)[0]
      }
      if (id) {
        return {
          kind: 'youtube',
          src: `https://www.youtube-nocookie.com/embed/${id}`,
        }
      }
    }

    // Bilibili
    if (u.hostname.includes('bilibili.com') || u.hostname.includes('b23.tv')) {
      const bv = u.pathname.match(/\/video\/(BV[\w]+)/i)?.[1]
      const aid = u.searchParams.get('aid') || u.pathname.match(/\/video\/av(\d+)/i)?.[1]
      if (bv) {
        return {
          kind: 'bilibili',
          src: `https://player.bilibili.com/player.html?bvid=${bv}&high_quality=1&autoplay=0`,
        }
      }
      if (aid) {
        return {
          kind: 'bilibili',
          src: `https://player.bilibili.com/player.html?aid=${aid}&high_quality=1&autoplay=0`,
        }
      }
      // already a player url
      if (u.pathname.includes('player.html')) {
        return { kind: 'bilibili', src: url }
      }
    }

    // Direct media
    if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(u.pathname)) {
      return { kind: 'direct', src: url }
    }

    // Generic iframe fallback (e.g. some music/video pages that allow embed)
    return { kind: 'iframe', src: url }
  } catch {
    return null
  }
}

export function PortableTextVideoEmbed({
  value,
}: PortableTextComponentProps<{
  _key: string
  url: string
  title?: string
}>) {
  const embed = React.useMemo(
    () => (value.url ? parseVideoEmbed(value.url) : null),
    [value.url]
  )

  if (!embed) return null

  return (
    <figure data-blockid={value._key} className="not-prose my-8">
      {value.title ? (
        <figcaption className="mb-2 font-mono text-[11px] tracking-wide text-zinc-400 dark:text-zinc-500">
          {value.title}
        </figcaption>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-950 shadow-sm dark:border-zinc-700/50 md:rounded-3xl">
        {embed.kind === 'direct' ? (
          <video
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full"
            src={embed.src}
          >
            你的浏览器不支持视频播放。
          </video>
        ) : (
          <div className="relative aspect-video w-full">
            <iframe
              src={embed.src}
              title={value.title || '嵌入视频'}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </figure>
  )
}
