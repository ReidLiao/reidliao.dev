import * as React from 'react'

import { cn } from '~/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variants = {
    default:
      'border-transparent bg-emerald-700/10 text-emerald-700 ring-emerald-700/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    secondary:
      'border-transparent bg-zinc-100 text-zinc-600 ring-zinc-900/5 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/10',
    outline:
      'border-zinc-200 bg-transparent text-zinc-600 ring-transparent dark:border-zinc-700 dark:text-zinc-300',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ring-1 transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
