import * as React from 'react'

import { cn } from '~/lib/utils'

const buttonVariants = {
  default:
    'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-950 dark:hover:bg-zinc-300',
  secondary:
    'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
  outline:
    'border border-zinc-200 bg-transparent text-zinc-800 hover:border-lime-500/60 hover:bg-lime-500/5 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-lime-400/50 dark:hover:bg-lime-400/5',
  ghost:
    'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
  link: 'text-lime-700 underline-offset-4 hover:underline dark:text-lime-400',
} as const

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 rounded-full px-3 text-xs',
  icon: 'h-10 w-10 p-0',
} as const

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      type = 'button',
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-lime-400/70',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
