import * as React from 'react'

import { cn } from '~/lib/utils'

type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType
}

// Plain content card. Use components/ui/Card for clickable hover cards.
const Card = React.forwardRef<HTMLElement, CardProps>(
  ({ as: Component = 'div', className, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'relative rounded-xl border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-zinc-600 dark:text-zinc-400', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

export { Card, CardDescription }
