'use client'

import {
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { ExternalLinkIcon } from '~/assets'
import { Card } from '~/components/ui/Card'
import { cdnImageSrc } from '~/lib/cdn-image'
import { urlForImage } from '~/sanity/lib/image'
import { type Project } from '~/sanity/schemas/project'

type ProjectStatus = '本站在用' | '推荐' | '用过'

export function ProjectCard({
  project,
  meta,
}: {
  project: Project
  meta: {
    status: ProjectStatus
    recommendationReason: string
  }
}) {
  const { _id, url, icon, name, description } = project

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2)
    },
    [mouseX, mouseY, radius]
  )
  const maskBackground = useMotionTemplate`radial-gradient(circle ${radius}px at ${mouseX}px ${mouseY}px, black 40%, transparent)`
  const [isHovering, setIsHovering] = React.useState(false)
  const statusClassName =
    meta.status === '本站在用'
      ? 'bg-lime-500/10 text-lime-700 ring-lime-500/20 dark:bg-lime-400/10 dark:text-lime-300 dark:ring-lime-400/20'
      : 'bg-zinc-100 text-zinc-600 ring-zinc-900/5 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/10'
  const hasRecommendationReason =
    meta.recommendationReason.trim() !== '' &&
    meta.recommendationReason !== '推荐理由待补充。'

  return (
    <Card
      as="li"
      key={_id}
      className="transition-transform duration-200 ease-out hover:-translate-y-1"
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image
          src={cdnImageSrc(
            urlForImage(icon)?.size(100, 100).auto('format').url(),
            { width: 100, quality: 80 }
          )}
          alt=""
          width={36}
          height={36}
          sizes="36px"
          className="h-9 w-9 rounded-full"
          loading="lazy"
          unoptimized
        />
      </div>
      <h2 className="mt-7 text-base font-bold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={url} target="_blank" rel="noopener noreferrer sponsored">
          {name}
        </Card.Link>
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${statusClassName}`}
        >
          {meta.status}
        </span>
      </div>
      <Card.Description className="mt-4 line-clamp-2">
        {description}
      </Card.Description>
      {hasRecommendationReason && (
        <p className="relative z-10 mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            推荐理由：
          </span>
          {meta.recommendationReason}
        </p>
      )}
      <p className="pointer-events-none relative z-40 mt-6 flex items-center text-sm font-medium text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:text-lime-600 dark:text-zinc-200 dark:group-hover:text-lime-400">
        <span className="mr-2">前往查看</span>
        <ExternalLinkIcon className="h-4 w-4 flex-none transition-transform duration-200 group-hover:translate-x-0.5" />
      </p>

      <AnimatePresence>
        {isHovering && (
          <motion.footer
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 z-30 select-none rounded-2xl border border-lime-500/30 shadow-[0_0_18px_-12px_rgba(132,204,22,0.9)] sm:-inset-x-6 sm:rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              WebkitMaskImage: maskBackground,
            }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </Card>
  )
}
