import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

export function Table({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table
        className={cn(
          'w-full min-w-max border-collapse text-left text-sm',
          className
        )}
      >
        {children}
      </table>
    </div>
  )
}

export function TableHeadCell({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-zinc-200 bg-zinc-50 px-3 py-2.5 font-semibold whitespace-nowrap text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-100">
      {children}
    </th>
  )
}

export function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="border-b border-zinc-100 px-3 py-2.5 align-top text-zinc-600 last:border-b-0 dark:border-zinc-800 dark:text-zinc-300">
      {children}
    </td>
  )
}
