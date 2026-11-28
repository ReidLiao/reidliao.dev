export const buttonBaseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium outline-offset-2 transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700/70 disabled:pointer-events-none disabled:opacity-50 active:transition-none dark:focus-visible:ring-emerald-400/70'

export const buttonVariantStyles = {
  primary:
    'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-200 dark:text-zinc-950 dark:hover:bg-zinc-300 dark:active:bg-zinc-300/70',
  secondary:
    'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-700',
  outline:
    'border border-zinc-200 bg-transparent text-zinc-800 hover:border-emerald-700/60 hover:bg-emerald-700/5 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-400/5',
  ghost:
    'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
  link: 'text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400',
} as const
