import { Container } from '~/components/ui/Container'

function CardSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-3xl ring-2 ring-zinc-100 dark:ring-zinc-800">
      <div className="aspect-[240/135] w-full animate-pulse bg-zinc-100 dark:bg-zinc-800/60" />
      <div className="flex flex-col gap-3 p-4 md:p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-3 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
      </div>
    </div>
  )
}

export default function BlogListSkeleton() {
  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800/60 sm:h-12" />
        <div className="mt-6 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
      </header>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </Container>
  )
}
