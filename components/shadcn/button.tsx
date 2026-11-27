import * as React from 'react'

import { buttonBaseStyles, buttonVariantStyles } from '~/components/ui/buttonStyles'
import { cn } from '~/lib/utils'

const buttonVariants = {
  default: buttonVariantStyles.primary,
  secondary: buttonVariantStyles.secondary,
  outline: buttonVariantStyles.outline,
  ghost: buttonVariantStyles.ghost,
  link: buttonVariantStyles.link,
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
        buttonBaseStyles + ' whitespace-nowrap',
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
