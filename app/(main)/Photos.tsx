'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { cdnImageSrc } from '~/lib/cdn-image'
import { type HeroPhoto } from '~/sanity/queries'

export function Photos({ photos }: { photos: HeroPhoto[] }) {
  const [width, setWidth] = React.useState(0)
  const [isCompact, setIsCompact] = React.useState(false)
  const expandedWidth = React.useMemo(() => width * 1.38, [width])

  React.useEffect(() => {
    const handleResize = () => {
      // 640px is the breakpoint for md
      if (window.innerWidth < 640) {
        setIsCompact(true)
        return setWidth(window.innerWidth / 2 - 64)
      }

      setIsCompact(false)
      setWidth(window.innerWidth / photos.length - 4 * photos.length)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [photos.length])

  return (
    <motion.div
      className="mt-16 sm:mt-20"
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.35,
        duration: 0.45,
        ease: 'easeOut',
      }}
    >
      <div className="-my-4 flex w-full snap-x snap-proximity scroll-pl-4 justify-start gap-4 overflow-x-auto px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0">
        {photos.map((photo, idx) => {
          const style: React.CSSProperties = isCompact
            ? { width }
            : {
                width,
                transform: `rotate(${idx % 2 === 0 ? 2 : -1}deg)`,
              }

          return (
            <div
              key={photo.url ?? idx}
              className="group relative h-40 flex-none shrink-0 snap-start overflow-hidden rounded-xl bg-zinc-100 ring-2 ring-lime-800/20 transition-[width,filter,opacity] duration-300 hover:opacity-100 hover:[filter:grayscale(0)] dark:bg-zinc-800 dark:ring-lime-300/10 md:h-72 md:rounded-3xl md:opacity-90 md:[filter:grayscale(0.4)] md:hover:!w-[var(--expanded-w)]"
              style={
                {
                  ...style,
                  '--expanded-w': `${expandedWidth}px`,
                } as React.CSSProperties
              }
            >
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
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
