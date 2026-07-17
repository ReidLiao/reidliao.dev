'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import React from 'react'

function parseAudioEmbed(url: string): {
  kind: 'direct' | 'iframe'
  src: string
} | null {
  try {
    const u = new URL(url)

    if (/\.(mp3|m4a|aac|ogg|wav|flac)(\?|$)/i.test(u.pathname)) {
      return { kind: 'direct', src: url }
    }

    // NetEase cloud music song page → player iframe
    if (u.hostname.includes('music.163.com')) {
      const id = u.searchParams.get('id')
      if (id) {
        return {
          kind: 'iframe',
          src: `https://music.163.com/outchain/player?type=2&id=${id}&auto=0&height=66`,
        }
      }
    }

    return { kind: 'iframe', src: url }
  } catch {
    return null
  }
}

export function PortableTextAudioEmbed({
  value,
}: PortableTextComponentProps<{
  _key: string
  url: string
  title?: string
}>) {
  const embed = React.useMemo(
    () => (value.url ? parseAudioEmbed(value.url) : null),
    [value.url]
  )

  if (!embed) return null

  return (
    <figure
      data-blockid={value._key}
      className="not-prose my-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50/90 to-white p-4 dark:border-zinc-700/50 dark:from-zinc-900/80 dark:to-zinc-900/40 sm:rounded-3xl sm:p-5"
    >
      <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
        AUDIO
      </p>
      {value.title ? (
        <h4 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {value.title}
        </h4>
      ) : null}

      <div className="mt-3">
        {embed.kind === 'direct' ? (
          <audio controls preload="metadata" className="w-full" src={embed.src}>
            你的浏览器不支持音频播放。
          </audio>
        ) : (
          <iframe
            src={embed.src}
            title={value.title || '嵌入音频'}
            className="h-[90px] w-full max-w-full rounded-xl border-0"
            loading="lazy"
            allow="autoplay; encrypted-media"
          />
        )}
      </div>
    </figure>
  )
}
