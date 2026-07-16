import Image from 'next/image'

import { clsxm } from '@zolplay/utils'

/** Soft author badge overlaid on post covers — avoids a hard “sticker” look. */
export function PostAuthorBadge({
  size = 'md',
  className,
  priority = false,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  priority?: boolean
}) {
  const px = size === 'sm' ? 28 : size === 'lg' ? 44 : 36

  return (
    <span
      className={clsxm(
        'pointer-events-none absolute z-10 overflow-hidden rounded-full',
        'shadow-[0_4px_14px_rgba(0,0,0,0.28)]',
        'ring-2 ring-white/55 ring-offset-0',
        'dark:ring-white/35',
        size === 'sm' && 'left-2.5 top-2.5',
        size === 'md' && 'left-3 top-3 md:left-3.5 md:top-3.5',
        size === 'lg' && 'left-3.5 top-3.5 md:left-5 md:top-5',
        className
      )}
    >
      <Image
        src="/avatar.jpg"
        alt=""
        width={px}
        height={px}
        sizes={`${px}px`}
        className={clsxm(
          'rounded-full object-cover',
          size === 'sm' && 'h-7 w-7',
          size === 'md' && 'h-8 w-8 md:h-9 md:w-9',
          size === 'lg' && 'h-10 w-10 md:h-11 md:w-11'
        )}
        priority={priority}
      />
    </span>
  )
}
