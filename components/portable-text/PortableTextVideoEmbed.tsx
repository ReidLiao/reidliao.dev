'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import React from 'react'

function parseVideoEmbed(url: string): {
  kind: 'youtube' | 'bilibili' | 'direct'
  src: string
} | null {
  try {
    const u = new URL(url)

    // YouTube
    const youtubeHosts = new Set([
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'youtube-nocookie.com',
      'www.youtube-nocookie.com',
    ])
    if (youtubeHosts.has(u.hostname)) {
      let id = u.searchParams.get('v')
      if (!id && u.hostname === 'youtu.be') {
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
    const bilibiliHosts = new Set([
      'bilibili.com',
      'www.bilibili.com',
      'player.bilibili.com',
      'b23.tv',
      'www.b23.tv',
    ])
    if (bilibiliHosts.has(u.hostname)) {
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

    // Do not embed arbitrary URLs in an iframe.
    return null
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

  if (!embed) {
    const fallbackUrl = value.url && /^https?:\/\//i.test(value.url) ? value.url : null
    if (!fallbackUrl) return null

    return (
      <figure data-blockid={value._key} className="not-prose my-8">
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-lime-600 hover:text-lime-800 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-lime-400 dark:hover:text-lime-300"
        >
          此视频暂不支持内嵌播放，打开原视频
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 4h6v6M20 4l-9 9" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </figure>
    )
  }

  return (
    <figure data-blockid={value._key} className="not-prose my-8">
      {value.title ? (
        <figcaption className="mb-2 font-mono text-[11px] tracking-wide text-zinc-600 dark:text-zinc-400">
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
