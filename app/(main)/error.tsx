'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { HomeIcon, UTurnLeftIcon } from '~/assets'
import { Container } from '~/components/ui/Container'

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-xs tracking-widest text-lime-600 dark:text-lime-400">
        RUNTIME ERROR
      </p>
      <p className="mt-3 font-mono text-sm text-zinc-400 dark:text-zinc-500">
        something_went_wrong
      </p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
        出了点问题
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        当前页面渲染失败。可以重试，或先回首页继续浏览。
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
          digest: {error.digest}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-zinc-800/10 ring-1 ring-zinc-900/5 transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-white/10 dark:hover:bg-zinc-300"
        >
          <UTurnLeftIcon className="h-4 w-4" />
          重试
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-lime-400/40 dark:hover:text-lime-400"
        >
          <HomeIcon className="h-4 w-4" />
          返回首页
        </Link>
      </div>
    </Container>
  )
}
