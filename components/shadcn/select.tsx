import * as React from 'react'

import { cn } from '~/lib/utils'

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full appearance-none rounded-full border border-zinc-300 bg-white px-3.5 pr-9 text-sm font-medium text-zinc-800 outline-hidden transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'

export { Select }
