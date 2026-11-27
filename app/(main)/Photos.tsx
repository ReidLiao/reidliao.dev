'use client'

import { clsxm } from '@zolplay/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { cdnImageSrc } from '~/lib/cdn-image'
import { type HeroPhoto } from '~/sanity/queries'

export function Photos({ photos }: { photos: HeroPhoto[] }) {
  const photoCount = Math.max(photos.length, 1)
  const desktopWidth = `calc(${100 / photoCount}vw - ${4 * photoCount}px)`
  const photoWidths = {
    '--photo-width-tablet': `max(160px, ${desktopWidth})`,
    '--photo-width-desktop': desktopWidth,
    '--expanded-w': `calc(${(100 / photoCount) * 1.38}vw - ${4 * photoCount * 1.38}px)`,
  } as React.CSSProperties

  return (
    <motion.div
      className="mt-16 sm:mt-20"
      initial={{ scale: 0.94, y: 12 }}
      animate={{ scale: 1, y: 0 }}
      transition={{
        delay: 0.35,
        duration: 0.45,
        ease: 'easeOut',
      }}
    >
      <div
        className="-my-4 flex w-full snap-x snap-proximity scroll-pl-4 justify-start gap-4 overflow-x-auto px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0"
        style={photoWidths}
      >
        {photos.map((photo, idx) => {
          const cardClassName = clsxm(
            'group relative h-40 w-[calc(50vw_-_64px)] flex-none shrink-0 snap-start overflow-hidden rounded-xl bg-zinc-100 ring-2 ring-lime-800/20 transition-[width,filter,opacity] duration-300 hover:opacity-100 hover:[filter:grayscale(0)] dark:bg-zinc-800 dark:ring-lime-300/10 sm:w-[var(--photo-width-tablet)] md:h-72 md:w-[var(--photo-width-desktop)] md:rounded-3xl md:opacity-90 md:[filter:grayscale(0.4)] md:hover:!w-[var(--expanded-w)]',
            idx % 2 === 0 ? 'sm:rotate-2' : 'sm:-rotate-1'
          )
          const image = (
            <Image
              src={cdnImageSrc(photo.url, { width: 720, quality: 75 })}
              alt=""
              width={500}
              height={500}
              sizes="(max-width: 640px) 45vw, 18rem"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
              priority={idx === 0}
              loading={idx === 0 ? undefined : 'lazy'}
              placeholder={photo.lqip ? 'blur' : 'empty'}
              blurDataURL={photo.lqip}
            />
          )

          return photo.link ? (
            <Link
              key={photo.url ?? idx}
              href={photo.link}
              aria-label={`打开精选内容：${photo.link}`}
              className={cardClassName}
            >
              {image}
            </Link>
          ) : (
            <div
              key={photo.url ?? idx}
              className={cardClassName}
            >
              {image}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
