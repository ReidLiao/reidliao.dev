import { clsxm } from '@zolplay/utils'

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={clsxm(className, 'prose min-w-0 max-w-full dark:prose-invert')}>
      {children}
    </div>
  )
}
