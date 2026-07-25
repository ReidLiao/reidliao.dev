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
  const px = size === 'sm' ? 22 : size === 'lg' ? 32 : 26

  return (
    <span
      className={clsxm(
        'pointer-events-none absolute z-10 overflow-hidden rounded-full',
        'opacity-80 shadow-[0_2px_8px_rgba(0,0,0,0.18)]',
        'ring-[1.5px] ring-white/40',
        'dark:opacity-75 dark:ring-white/25',
        size === 'sm' && 'left-2 top-2',
        size === 'md' && 'left-2.5 top-2.5 md:left-3 md:top-3',
        size === 'lg' && 'left-3 top-3 md:left-4 md:top-4',
        className
      )}
    >
      <Image
        src="/avatar.jpg"
        alt=""
        width={px}
        height={px}
        className={clsxm(
          'rounded-full object-cover',
          size === 'sm' && 'h-5 w-5',
          size === 'md' && 'h-6 w-6 md:h-7 md:w-7',
          size === 'lg' && 'h-7 w-7 md:h-8 md:w-8'
        )}
        priority={priority}
        unoptimized
      />
    </span>
  )
}
