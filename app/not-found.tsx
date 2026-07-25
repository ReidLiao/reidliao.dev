import Link from 'next/link'

import { CloudIcon, HomeIcon, ScriptIcon, UsersIcon } from '~/assets'
import { Container } from '~/components/ui/Container'

export default function NotFoundPage() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]" />
      <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <Container className="max-w-lg">
          <p className="font-mono text-xs tracking-widest text-lime-600 dark:text-lime-400">
            HTTP 404
          </p>
          <p className="mt-3 font-mono text-sm text-zinc-400 dark:text-zinc-500">
            path_not_found
          </p>
          <h1 className="mt-6 text-7xl font-bold tracking-tighter text-zinc-800 dark:text-zinc-100 sm:text-8xl">
            404
          </h1>
          <p className="mt-6 text-lg font-medium text-zinc-800 dark:text-zinc-100">
            这个页面走丢了
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            路径不存在，可能已被移除或地址输入有误。
            <br className="hidden sm:inline" />
            从下方入口继续逛逛：
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-zinc-800/10 ring-1 ring-zinc-900/5 transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-white/10 dark:hover:bg-zinc-300"
            >
              <HomeIcon className="h-4 w-4" />
              返回首页
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-lime-400/40 dark:hover:text-lime-400"
            >
              <ScriptIcon className="h-4 w-4" />
              博客
            </Link>
            <Link
              href="/vps"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-lime-400/40 dark:hover:text-lime-400"
            >
              <CloudIcon className="h-4 w-4" />
              机房
            </Link>
            <Link
              href="/guestbook"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-lime-400/40 dark:hover:text-lime-400"
            >
              <UsersIcon className="h-4 w-4" />
              留言墙
            </Link>
          </div>
        </Container>
      </main>
    </>
  )
}
