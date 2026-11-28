import { cn } from '~/lib/utils'

export function Separator({ label }: { label?: string }) {
  return label ? (
    <div className="my-8 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"
      />
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"
      />
    </div>
  ) : (
    <hr
      className={cn(
        'my-8 border-0 border-t border-zinc-200 dark:border-zinc-700'
      )}
    />
  )
}
