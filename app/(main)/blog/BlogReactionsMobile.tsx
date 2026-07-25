'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { prettifyNumber } from '~/lib/math'
import { type Post } from '~/sanity/schemas/post'

function moodToReactions(mood: Post['mood']) {
  switch (mood) {
    case 'happy':
      return ['claps', 'tada', 'confetti', 'fire']
    case 'sad':
      return ['pray', 'cry', 'heart', 'hugs']
    default:
      return ['claps', 'heart', 'thumbs-up', 'fire']
  }
}

/**
 * Horizontal reactions bar for mobile / md screens. The desktop sidebar
 * (`BlogReactions`) is hidden < lg, so readers on phones need a way to react
 * to a post — this shows up at the article footer.
 */
export function BlogReactionsMobile({
  _id,
  mood,
  reactions,
}: Pick<Post, '_id' | 'mood'> & { reactions?: number[] }) {
  const [cached, setCached] = React.useState(reactions ?? [0, 0, 0, 0])

  const onClick = React.useCallback(
    async (index: number) => {
      setCached((prev) => {
        const next = [...prev]
        next[index]++
        return next
      })

      try {
        const res = await fetch(`/api/reactions?id=${_id}&index=${index}`, {
          method: 'PATCH',
        })
        const { data } = (await res.json()) as { data: number[] }
        if (Array.isArray(data)) setCached(data)
      } catch {
        // ignore
      }
    },
    [_id]
  )

  const items = moodToReactions(mood)

  return (
    <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-zinc-100 bg-white/60 px-4 py-5 backdrop-blur-sm dark:border-zinc-700/40 dark:bg-zinc-900/40 lg:hidden">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        觉得有用？留下一个反应
      </p>
      <div className="flex items-center justify-center gap-6">
        {items.map((reaction, idx) => (
          <motion.button
            key={reaction}
            type="button"
            whileTap={{ scale: 1.25 }}
            onClick={() => onClick(idx)}
            aria-label={`发送 ${reaction} 反应`}
            className="group relative flex flex-col items-center gap-1 text-zinc-700 dark:text-zinc-300"
          >
            <span className="relative h-8 w-8">
              <Image
                src={`/reactions/${reaction}.png`}
                alt=""
                fill
                sizes="32px"
                loading="lazy"
                unoptimized
              />
            </span>
            <span className="text-[11px] font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
              {prettifyNumber(cached[idx] ?? 0, true)}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
