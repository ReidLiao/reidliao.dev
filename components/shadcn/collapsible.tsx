import { cn } from '~/lib/utils'

export function Collapsible({
  title,
  content,
  defaultOpen = false,
}: {
  title: string
  content: string
  defaultOpen?: boolean
}) {
  return (
    <details
      open={defaultOpen}
      className="group my-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    >
      <summary
        className={cn(
          'flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 font-semibold text-zinc-800 transition-colors hover:text-emerald-700 focus-visible:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/70 focus-visible:outline-none dark:text-zinc-100 dark:hover:text-emerald-400 dark:focus-visible:text-emerald-400 dark:focus-visible:ring-emerald-400/70 [&::-webkit-details-marker]:hidden'
        )}
      >
        {title}
        <span
          aria-hidden="true"
          className="text-zinc-500 transition-transform group-open:rotate-45 dark:text-zinc-400"
        >
          +
        </span>
      </summary>
      <div className="border-t border-zinc-100 px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        {content}
      </div>
    </details>
  )
}
