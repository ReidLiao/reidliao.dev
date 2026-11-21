import { clsxm } from '@zolplay/utils'
import Image from 'next/image'
import Link from 'next/link'
import { type ComponentProps } from 'react'

function AvatarContainer({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={clsxm(
        className,
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10'
      )}
      {...props}
    />
  )
}

type AvatarImageProps = Omit<ComponentProps<typeof Link>, 'href'> & {
    large?: boolean
    href?: string
  }
function AvatarImage({
  large = false,
  className,
  href,
  ...props
}: AvatarImageProps) {
  return (
    <Link
      aria-label="主页"
      className={clsxm(className, 'pointer-events-auto')}
      href={href ?? '/'}
      {...props}
    >
      <Image
        src={large ? '/avatar-128.webp' : '/avatar-64.webp'}
        alt="青柠夜栈"
        width={large ? 64 : 36}
        height={large ? 64 : 36}
        className={clsxm(
          'rounded-full bg-zinc-100 object-cover [clip-path:circle(46%_at_50%_50%)] dark:bg-zinc-800',
          large ? 'h-16 w-16' : 'h-9 w-9'
        )}
        priority={large}
      />
    </Link>
  )
}

export const Avatar = Object.assign(AvatarContainer, { Image: AvatarImage })
