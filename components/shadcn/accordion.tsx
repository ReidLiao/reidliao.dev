import { cn } from '~/lib/utils'

export type AccordionEntry = {
  _key?: string
  title?: string
  content?: string
}

export function Accordion({
  items,
  className,
}: {
  items: AccordionEntry[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'my-6 divide-y divide-zinc-200 dark:divide-zinc-700',
        className
      )}
    >
      {items.map((item, index) => (
        <details key={item._key || index} className="group py-1">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-2 font-semibold text-zinc-800 transition-colors marker:hidden hover:text-emerald-700 focus-visible:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/70 focus-visible:outline-none dark:text-zinc-100 dark:hover:text-emerald-400 dark:focus-visible:text-emerald-400 dark:focus-visible:ring-emerald-400/70 [&::-webkit-details-marker]:hidden">
            {item.title}
            <span
              aria-hidden="true"
              className="text-zinc-500 transition-transform group-open:rotate-45 dark:text-zinc-400"
            >
              +
            </span>
          </summary>
          {item.content ? (
            <p className="pr-6 pb-3 text-sm leading-relaxed whitespace-pre-line text-zinc-600 dark:text-zinc-400">
              {item.content}
            </p>
          ) : null}
        </details>
      ))}
    </div>
  )
}
