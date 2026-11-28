import * as React from 'react'

import { cn } from '~/lib/utils'

const variants = {
  info: 'border-emerald-700/25 bg-emerald-700/5 text-zinc-800 dark:border-emerald-400/25 dark:bg-emerald-400/5 dark:text-zinc-100',
  success:
    'border-emerald-700/30 bg-emerald-700/5 text-zinc-800 dark:border-emerald-400/30 dark:bg-emerald-400/5 dark:text-zinc-100',
  warning:
    'border-amber-600/30 bg-amber-500/5 text-zinc-800 dark:border-amber-400/30 dark:bg-amber-400/5 dark:text-zinc-100',
  error:
    'border-rose-600/30 bg-rose-500/5 text-zinc-800 dark:border-rose-400/30 dark:bg-rose-400/5 dark:text-zinc-100',
} as const

export type AlertVariant = keyof typeof variants

export function Alert({
  className,
  variant = 'info',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: AlertVariant }) {
  return (
    <div
      role="note"
      className={cn(
        'rounded-xl border px-4 py-3',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export function AlertTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-semibold', props.className)} {...props} />
}

export function AlertDescription(
  props: React.HTMLAttributes<HTMLParagraphElement>
) {
  return (
    <p
      className={cn(
        'mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300',
        props.className
      )}
      {...props}
    />
  )
}
