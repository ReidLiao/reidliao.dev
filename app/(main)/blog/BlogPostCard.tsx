import { parseDateTime } from '@zolplay/utils'
import Image from 'next/image'
import Link from 'next/link'

import {
  CalendarIcon,
  CursorClickIcon,
  HourglassIcon,
  ScriptIcon,
} from '~/assets'
import { PostAuthorBadge } from '~/components/PostAuthorBadge'
import { cdnImageSrc } from '~/lib/cdn-image'
import { prettifyNumber } from '~/lib/math'
import { type Post } from '~/sanity/schemas/post'

export function BlogPostCard({ post, views }: { post: Post; views: number }) {
  const { title, slug, mainImage, publishedAt, categories, readingTime } = post
  const coverSrc = cdnImageSrc(mainImage.asset.url, { width: 840, quality: 75 })

  return (
    <Link
      href={`/blog/${slug}`}
      prefetch={false}
      className="group relative flex w-full transform-gpu flex-col overflow-hidden rounded-3xl bg-transparent ring-2 ring-[--post-image-bg] transition-transform hover:-translate-y-0.5"
      style={
        {
          '--post-image-bg': mainImage.asset.dominant?.background,
        } as React.CSSProperties
      }
    >
      <div className="relative aspect-[240/135] w-full isolate overflow-hidden">
        <Image
          src={coverSrc}
          alt=""
          className="rounded-t-3xl object-cover"
          placeholder="blur"
          blurDataURL={mainImage.asset.lqip}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
          loading="lazy"
        />
        <PostAuthorBadge size="md" />
      </div>
      <span className="relative z-10 flex w-full flex-1 shrink-0 flex-col justify-between gap-0.5 rounded-b-3xl bg-zinc-900/90 p-4 dark:bg-zinc-950/90 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:select-none before:rounded-b-3xl before:bg-zinc-950/35 before:transition-opacity after:pointer-events-none after:absolute after:inset-0 after:z-10 after:select-none after:rounded-b-3xl after:bg-gradient-to-b after:from-transparent after:to-zinc-950/95 after:transition-opacity group-hover:before:opacity-70 md:p-5">
        <h2 className="z-20 text-base font-bold tracking-tight text-white transition-opacity group-hover:opacity-100 md:text-xl">
          {title}
        </h2>

        <span className="relative z-20 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-white/90 transition-colors group-hover:text-white">
          <span className="inline-flex min-w-0 items-center space-x-3">
            <span className="inline-flex items-center space-x-1 text-[12px] font-medium md:text-sm">
              <CalendarIcon />
              <span>
                {parseDateTime({ date: new Date(publishedAt) })?.format(
                  'YYYY/MM/DD'
                )}
              </span>
            </span>

            {Array.isArray(categories) && (
              <span className="inline-flex items-center space-x-1 text-[12px] font-medium md:text-sm">
                <ScriptIcon />
                <span>{categories.join(', ')}</span>
              </span>
            )}
          </span>
          <span className="inline-flex shrink-0 items-center space-x-3 text-[12px] font-medium md:text-xs">
            <span className="inline-flex items-center space-x-1">
              <CursorClickIcon />
              <span>{prettifyNumber(views, true)}</span>
            </span>

            <span className="inline-flex items-center space-x-1">
              <HourglassIcon />
              <span>{readingTime.toFixed(0)}分钟阅读</span>
            </span>
          </span>
        </span>
      </span>
    </Link>
  )
}
