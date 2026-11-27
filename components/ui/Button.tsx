/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsxm } from '@zolplay/utils'
import Link from 'next/link'

import { buttonBaseStyles, buttonVariantStyles } from './buttonStyles'

const variantStyles = {
  primary: buttonVariantStyles.primary,
  secondary: `rounded-full ${buttonVariantStyles.secondary}`,
}

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
}
type NativeLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
type SharedProps = {
  variant?: keyof typeof variantStyles
  className?: string
}
type ButtonProps = SharedProps & (NativeButtonProps | NativeLinkProps)
export function Button({
  variant = 'primary',
  className,
  href,
  ...props
}: ButtonProps) {
  const cn = clsxm(
    buttonBaseStyles,
    variantStyles[variant],
    className
  )

  return href ? (
    <Link href={href} className={cn} {...(props as any)} />
  ) : (
    <button className={cn} {...(props as any)} />
  )
}
